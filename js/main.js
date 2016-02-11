/*global adjustModalMaxHeightAndPosition */
/*global Modernizr */
/*jshint latedef:false, unused: false, undef:false */

//init all variables
var roles = [false, false, false, false, false];
var rolesSane = true;
var rolesPos = ['Toplane', 'Jungle', 'Midlane', 'Marksman', 'Support'];
var rolesJSON;

var champions = [];
var order = [];
var largeNames = [];
var championsDisabled;
var champPlayed = {};

var free2play = [];
var free2playState = true;
var free2playError = false;
var free2playTimout;
var free2playURL = "http://wwbtestserver.cloudapp.net:8080/free2play.json";

var doingRandom = true;
var doingNext = false;
var randomChamp;
var randomChampId;
var champsExcluded;

var loadSteps=6;
var loading = loadSteps; //countdown till all JSON is loaded
var loadedOnce=false;
var loadingProgress = 0; //the progress bar

var firstTime=false;

var DOMReady = false;
var region = 'EUW';

var exportKeys=['champPlayed', 'free2playState', 'rolesSane','roles','championsDisabled'];

//init easy storage
//var ns = $.initNamespaceStorage('championPicker');
//check if we support localstorage
var storage;
if (Modernizr.localstorage) {
    storage = $.localStorage;
}
else {
    //no, lets do cookies
    storage = $.cookieStorage;
}
if (storage.isSet('championsDisabled')) {
    championsDisabled = storage.get('championsDisabled');
}
else {
    championsDisabled = null;
}


if (storage.isSet('rolesSane')) {
    rolesSane = storage.get('rolesSane');
    updateSaneRoles();
} else {
    //rolesSane is not set, so this prob. the first time the user went to this website
    firstTime =true;
    rolesSane = true;
    storage.set('rolesSane', rolesSane);
}

//set rolesSane element to the correct state
if (!rolesSane)
{
    $('btn-role-sane').removeClass('active');
}

if (storage.isSet('free2playState')) {

    free2playState = storage.get('free2playState');
} else {
    free2playState = 1;
    storage.set('free2playState', free2playState);
}


var $free2play = $('.free2play');
$free2play.removeClass('btn-success');

//set button to correct color and text
switch (free2playState) {
    case 0:
    {
        $free2play.addClass('btn-warning');
        $free2play.find('p').text('Disabled');
        break;
    }
    case 1:
    {
        $free2play.addClass('btn-success');
        $free2play.find('p').text('Enabled');
        break;
    }
    case 2:
    {
        $free2play.addClass('btn-primary');
        $free2play.find('p').text('Only');
        break;
    }
}

//reset the button
free2playTimout = setTimeout(function () {
    'use strict';
    $free2play.find('p').text($free2play.data('text'));
}, 1000);

//load from storage (or from JSON)
if (storage.isSet('champions')) {
    champions = storage.get('champions');

    loading--;
    updateProgress(2);
    if (!loading)//check if we are loading to load everything
    {
        loadData();
    }
} else {
    //load the champion data
    loadChampionData();
}

if (storage.isSet('order')) {
    order = storage.get('order');

    loading--;
    updateProgress(2);
    if (!loading)//check if we are loading to load everything
    {
        loadData();
    }
} else {
    loadOrderData();

}
if (storage.isSet('free2play')) {
    free2play = storage.get('free2play');

    loading--;
    updateProgress(2);
    if (!loading)//check if we are loading to load everything
    {
        loadData();
    }
} else {
    //load f2p
    loadF2PData();
}

if (storage.isSet('rolesJSON')) {
    rolesJSON = storage.get('rolesJSON');

    loading--;
    updateProgress(2);
    if (!loading)//check if we are loading to load everything
    {
        loadData();
    }
} else {

    //init rolesJSON
    rolesJSON = [];

    //load roles
    loadRoleData();
}

$(function () {
    "use strict";//strict mode

    //DOM completed loading!
    DOMReady = true;

    if (free2playError) {
        showFree2PlayError();
    }
    loading--;
    updateProgress(2);

    //load the later scripts
    $.getScript("dist/ChampionPick-after.min.js", function(){
        //set pnotify styling and options
        /* global PNotify */
        PNotify.prototype.options.styling = "bootstrap3";
        PNotify.prototype.options.delay = 3000;//3 seconds

        if (firstTime)
        {
            var notice = new PNotify({
                title: 'Info',
                text: 'Click on a champion to disable it.',
                opacity: 0.9,
                icon: 'glyphicon glyphicon-envelope',
                nonblock: {
                    nonblock: true,
                    nonblock_opacity: 0.2
                },
                history: {
                    history: false
                },
                delay: 10000
            });
            notice.get().click(function () {
                notice.options.animation = 'none';
                notice.remove();
            });
        }

        loading--;

        updateProgress(2);
        if (!loading)//check if we are loading to load everything
        {
            loadData();
        }

    });
});

function reloadActive(update) {
    "use strict";//strict mode

    var $championsli = $("#champions").find("li");
    var $btnRole = $('.btn-role');
    //check if all buttons are on or off
    if ((roles[0] && roles[1] && roles[2] && roles[3] && roles[4]) || (!roles[0] && !roles[1] && !roles[2] && !roles[3] && !roles[4])) {
        //activate everything
        $championsli.addClass('toShow');
        $championsli.removeClass('toHide');

        //check if all buttons are on or off
        if (roles[0]) {
            $btnRole.addClass('active');
        }
        else {
            $btnRole.removeClass('active');
        }

        if (update) {
            updateShowHide();
        }
        return true;
    }

    //if roles are non-sane, everything is shown
    if (rolesSane) {
        //de-activate everything
        $championsli.addClass('toHide');
        $championsli.removeClass('toShow');
    }
    else
    {
        //activate everything
        $championsli.addClass('toShow');
        $championsli.removeClass('toHide');
    }

    //deactivate all buttons
    $btnRole.removeClass('active');

    //if its not we have to some real work
    processRoles(update);
    return true;
}

function processRoles(update) {
    "use strict";//strict mode

    var index, index2;
    for (index = 0; index < roles.length; ++index) {
        if (roles[index]) {
            //activate the button
            $('.role_' + index).addClass('active');

            //we have to activate all champions who have this role, if insane roles is not selected
            if (rolesSane)
            {
                for (index2 = 0; index2 < rolesJSON[index].length; ++index2) {
                    var $championDiv = $('[data-championId=' + rolesJSON[index][index2] + ']');
                    $championDiv.addClass('toShow');
                    $championDiv.removeClass('toHide');
                }
            }
        }
    }
    if (update) {
        updateShowHide();
    }
}

function updateShowHide() {
    "use strict";//strict mode

    $('.toShow').show();
    $('.toHide').hide();
}

function champTextFit() {
    "use strict";//strict mode

    var index, $label;
    //numbers are where bootstrap swithes
    if ($(window).width() > 992 || $(window).width() < 512) {
        for (index = 0; index < largeNames.length; ++index) {
            $label = $('#champ' + largeNames[index] + ' .championLabel');
            //0.6 and 11 are semi-randomly chosen but seem to fit
            $label.fitText(0.6 * ($label.html().length) / 11);
        }
    } else {
        for (index = 0; index < largeNames.length; ++index) {
            $label = $('#champ' + largeNames[index] + ' .championLabel');
            $label.removeAttr('style');
        }
    }
}
$(window).on("debouncedresize", function () {
    "use strict";//strict mode

    champTextFit();
    //320=where bootstrap swtiches
    if ($(window).height() >= 320) {
        adjustModalMaxHeightAndPosition();
    }
    modalLoreFit(false);
});

function modalLoreFit(animate) {
    "use strict";//strict mode

    var width = $('.randomChampionDialog').width();
    var height = width * 0.590;//aspect ratio of splashes
    var $randomChampionModalLore = $('.randomChampionModalLore');

    height -= 110;//height of title
    height -= 50;//height of bottom button

    if ($(window).width() >= 450) {
        height -= 70;//height of buttons
        if (animate) {
            $randomChampionModalLore.transition({height: (height) + 'px'},
                adjustModalMaxHeightAndPosition);
        }
        else {
            $randomChampionModalLore.height(height);
            adjustModalMaxHeightAndPosition();
        }
    }
    else {
        if (animate) {
                adjustModalMaxHeightAndPosition();
        }
        else {
            adjustModalMaxHeightAndPosition();
        }
    }
}

function updateFree2Play() {
    "use strict";//strict mode
    var $Free2PlayChampions;
    var $champion=$('.champion');
    switch (free2playState) {
        case 0://disabled
        {
            $Free2PlayChampions = $('.Free2Play.disabled_f2p');
            $Free2PlayChampions.addClass('disabled');
            $Free2PlayChampions.removeClass('disabled_f2p');

            $champion.removeClass('hiddenF2P');
            $champion.addClass('showF2P');
        break;
        }
        case 1://enabled
        {
            $Free2PlayChampions = $('.Free2Play.disabled');
            $Free2PlayChampions.addClass('disabled_f2p');
            $Free2PlayChampions.removeClass('disabled');

            $champion.removeClass('hiddenF2P');
            $champion.addClass('showF2P');
        break;
        }
        case 2://only
        {
            $Free2PlayChampions = $('.Free2Play');

            $champion.removeClass('showF2P');
            $champion.addClass('hiddenF2P');

            $Free2PlayChampions.removeClass('hiddenF2P');
            $Free2PlayChampions.addClass('showF2P');
            
            $Free2PlayChampions = $('.Free2Play.disabled');
            $Free2PlayChampions.addClass('disabled_f2p');
            $Free2PlayChampions.removeClass('disabled');
        }
    }
    //update f2p
    storage.set('free2playState', free2playState);
}

function loadChampionData() {
    "use strict";//strict mode

    $.getJSON("data/champions.json", function (championsJSON) {
        champions = championsJSON;
        storage.set('champions', champions);
        loading--;
        updateProgress(2);
        if (!loading)//check if we are loading to load everything
        {
            loadData();
        }
    });
}

function loadOrderData() {
    "use strict";//strict mode

    $.getJSON("data/order.json", function (orderJSON) {
        order = orderJSON;
        storage.set('order', order);
        loading--;
        updateProgress(2);
        if (!loading)//check if we are loading to load everything
        {
            loadData();
        }
    });
}

function loadRoleData() {
    "use strict";//strict mode
        var filename = 'data/roles.json';
        //lets load it
        $.ajax({
            dataType: "json",
            url: filename
        }).success(function(roles)
            {
                rolesJSON = roles;
                console.log(rolesJSON);
                loading--;
                updateProgress(2);

                if (!loading)//check if we are loading to load everything
                {
                    loadData();
                }}
        );
}
function loadF2PData() {
    "use strict";//strict mode

    //get free2play
    $.getJSON(free2playURL, function (free2playJSON) {
        if (free2playJSON.errors[region] === true) {
            if ((DOMReady === true) && (free2playError === false)) {
                //show error now
                free2playError = true;
                showFree2PlayError();
            }
            else {
                //if not, handle this when it is
                free2playError = true;
            }
        }

        free2play = free2playJSON.free2play[region];
        storage.set('free2play', free2play);

        loading--;
        updateProgress(2);
        if (!loading)//check if we are loading to load everything
        {
            loadData();
        }
    }).error(function () {
        //something went wrong! Lets check if the dom is ready
        //If free2playError is true, it has already been showed sometime, so do not show it again.
        if ((DOMReady === true) && (free2playError === false)) {
            //show error now
            free2playError = true;
            showFree2PlayError();
        }
        else {
            //if not, handle this when it is
            free2playError = true;
        }

        //lets still do the rest, so we can continue loading
        //if we have data, lets use it instead of the online
        free2play = storage.get('free2play');
        if (free2play === null) {
            free2play = [];
        }

        loading--;
        updateProgress(2);
        if (!loading)//check if we are loading to load everything
        {
            loadData();
        }

    });
}

function updateModal(divId, randomChamp, randomChampId, role, totalOptions) {
    "use strict";//strict mode

    divId.find('.randomChampionModalTitle').html(randomChamp.name + ': ' + randomChamp.title);
    divId.find('.randomChampionModalRole').html(role);
    divId.find('.randomChampionModalLore p').html(randomChamp.description);

    //probuilds
    divId.find('.randomChampionModalProbuildLink').attr("href", randomChamp.probuildsURL);

    //mobafire
    divId.find('.randomChampionModalMobafireLink').attr("href", randomChamp.mobafireURL);

    //champion.gg
    divId.find('.randomChampionModalChampionggLink').attr("href", randomChamp.championggURL);

    //lolwiki
    divId.find('.randomChampionModalLoLWikiLink').attr("href", randomChamp.lolwikiURL);

    divId.find('.randomChampionModalBackground').css('background-image', 'url(' + randomChamp.splashUrl + ')');

    //enable both buttons
    divId.find('.randomChampionDontHaveButton').prop("disabled", false);
    divId.find('.randomChampionNextButton').prop("disabled", false);

    //check if its a free 2 play champion that has been disabled
    if (free2playState === true)//otherwise the champ would not have been chosen
    {
        if (free2play.indexOf(randomChampId) !== -1) {
            //okay, the champion is free2play, now lets see if its disabled
            if (championsDisabled[randomChampId] === true) {
                //okay, its already disabled, no use of the "i dont have this champion button now"
                divId.find('.randomChampionDontHaveButton').prop("disabled", true);
            }
        }
    }
    //check if we have no other option to switch to
    if (totalOptions === 1) {
        divId.find('.randomChampionNextButton').prop("disabled", true);
    }
}

function updateProgress(loadProgressIncrease) {
    "use strict";//strict mode

    loadingProgress += loadProgressIncrease;
    $("#loadingProgress").css('width', loadingProgress + '%');
}

//knuth-shuffle
function shuffle(array) {
    "use strict";//strict mode

    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


function getRandomChampion(excluded) {

    "use strict";//strict mode

    var $optionDivs = $('.toShow.notDisabled.showSearch.showF2P, .toShow.disabled_f2p.showSearch.showF2P');

    //check if we have options:
    if ($optionDivs.length === 0) {
        return false;
    }

    //Get all possible champions for all roles
    var options = [];//all options, including not chosen lanes
    var realOptions = [[], [], [], [], []];//the real options
    var champId = 0;

    //now lets see what champions we haven't played or played the least:
    var leastPlayed = Number.MAX_VALUE;
    $optionDivs.each(function () {
        champId = $(this).data('championid');

        //check if not excluded
        if (excluded.indexOf(champId) === -1) {
            options.push(champId);

            //check if we have a playcount
            var played=0;
            if (champPlayed[champId]!==undefined)
            {
                played=champPlayed[champId];
            }

            //if smaller, replace the list
            if (played < leastPlayed) {
                //reset
                realOptions = [[], [], [], [], []];//the real options
                leastPlayed = played;
            }

            //if just as much (or smaller), add to the list
            if (played <= leastPlayed) {
                //go through all roles
                var i;
                for (i = 0; i < 5; ++i) {
                    //if roles are insane, add him to every role
                    if (!rolesSane || rolesJSON[i].indexOf(champId) !== -1) {
                        realOptions[i].push(champId);
                    }
                }
            }
        }
    });

    //count the amount of options
    if ((realOptions[0].length + realOptions[1].length + realOptions[2].length + realOptions[3].length + realOptions[4].length) === 0) {
        //something went wrong, we have no options!
        return false;
    }

    var rolesFiltered = roles.slice(0);//copy

    //if all roles are deselected it counts as all roles being selected
    if (!roles[0] && !roles[1] && !roles[2] && !roles[3] && !roles[4]) {
        rolesFiltered = [true, true, true, true, true];
    }

    //filter the roles where there is no champion for
    var i;
    for (i = 0; i < 5; ++i) {
        if (realOptions[i].length === 0) {
            //no champions for this role
            rolesFiltered[i] = false;
        }
    }

    // choose a role
    var randomRole = Math.floor(Math.random() * 5);

    //make sure the role chosen is actually wanted
    while (!rolesFiltered[randomRole]) {
        randomRole = Math.floor(Math.random() * 5);
    }

    //go to the correct options
    realOptions = realOptions[randomRole];

    //lets get a random option
    var randomId = realOptions[Math.floor(Math.random() * realOptions.length)];

    return [randomId, randomRole, options];
}

function showFree2PlayError() {
    "use strict";//strict mode

    var notice = new PNotify({
        title: 'Riot server error',
        text: 'Failed to get free to play data from riot. Data may be missing or out of date.',
        opacity: 0.9,
        icon: 'glyphicon glyphicon-envelope',
        nonblock: {
            nonblock: true,
            nonblock_opacity: 0.2
        },
        history: {
            history: false
        }
    });
    notice.get().click(function () {
        notice.options.animation = 'none';
        notice.remove();
    });
}

function searchFor(toSearch) {
    "use strict";//strict mode

    var results = [];
    toSearch = trimString(toSearch); // trim it
    for (var i = 0; i < order.length; i++) {
        if (champions[order[i]].nameLower.indexOf(toSearch) !== -1) {
            if (!itemExists(results, champions[order[i]])) {
                results.push(order[i]);
            }
        }
    }
    return results;
}
function forceReload()
{
    "use strict";

    //countdown till all JSON is loaded, one les than normal because DOM does not need to load.
    loading = loadSteps-2;
    loadingProgress = 2; //the progress bar, 2 because dom is already loaded
    updateProgress(0);

    $('#ProgressContainer').show();
    loadChampionData();
    loadOrderData();
    loadF2PData();
    loadRoleData();
}

function updateSaneRoles()
{
    "use strict";
    var $btnrolesame=$('.btn-role-sane');
    if (rolesSane)
    {
        $btnrolesame.addClass('active');
        $btnrolesame.text('Sane Roles');
    }
    else{
        $btnrolesame.removeClass('active');
        $btnrolesame.text('Insane Roles');
    }
}

function trimString(s) {
    "use strict";//strict mode

    var l = 0, r = s.length - 1;
    while (l < s.length && s[l] === ' ') {
        l++;
    }
    while (r > l && s[r] === ' ') {
        r -= 1;
    }
    return s.substring(l, r + 1);
}


function compareObjects(o1, o2) {
    "use strict";//strict mode

    var k;
    for (k in o1) {
        //noinspection JSUnfilteredForInLoop
        if (o1[k] !== o2[k]) {
            return false;
        }
    }
    for (k in o2) {
        //noinspection JSUnfilteredForInLoop
        if (o1[k] !== o2[k]) {
            return false;
        }
    }
    return true;
}

function itemExists(haystack, needle) {
    "use strict";//strict mode

    for (var i = 0; i < haystack.length; i++) {
        if (compareObjects(haystack[i], needle)) {
            return true;
        }
    }
    return false;
}