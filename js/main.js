//init all variables
/*jslint latedef:false*/
/*global adjustModalMaxHeightAndPosition */
/*global Modernizr */
var roles = [false, false, false, false, false];
var roleTypeOptions = ['All', 'Loose', 'Normal', 'Strict'];
var roleType = 2;
var rolesPos = ['Toplane', 'Jungle', 'Midlane', 'Marksman', 'Support'];
var rolesJSON;

var champions = [];
var order = [];
var largeNames = [];
var championsDisabled;
var champPlayed = {};

var free2play = [];
var enableF2P = true;
var free2playError=false;
var free2playURL="http://wwbtestserver.cloudapp.net:8080/free2play.json";

var doingRandom=true;
var doingNext=false;
var randomChamp;
var randomChampId;
var champsExcluded;

var loading = 7; //countdown till all JSON is loaded
var loadingProgress=0; //the progress bar

var DOMReady=false;
var region='EUW';

//set pnotify styling and options
/* global PNotify */
PNotify.prototype.options.styling = "bootstrap3";
PNotify.prototype.options.delay = 3000;//3 seconds

//init easy storage
//var ns = $.initNamespaceStorage('championPicker');
//check if we support localstorage
if (Modernizr.localstorage) {
    var storage = $.localStorage;
}
else
{
    //no, lets do cookies
    var storage = $.cookieStorage;
}
if (storage.isSet('championsDisabled'))
{
championsDisabled = storage.get('championsDisabled');
}
else
{
    championsDisabled=null;
}

if (storage.isSet('roleType')) {
    roleType = storage.get('roleType');
} else {
    roleType = 2;
    storage.set('roleType', roleType);
}

$('.roleType').html(roleTypeOptions[roleType] + ' <span class="caret"></span>');


if (storage.isSet('enableF2P')) {

    enableF2P = storage.get('enableF2P');
} else {
    enableF2P = true;
    storage.set('enableF2P', enableF2P);
}


if (!enableF2P) {
    var $free2play=$('.free2play');
    $free2play.toggleClass('btn-success');
    $free2play.toggleClass('btn-default');
}

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

    loading -= (roleTypeOptions.length - 1);
    updateProgress(2 * (roleTypeOptions.length - 1));
    if (!loading)//check if we are loading to load everything
    {
        loadData();
    }
} else {

    //init rolesJSON
    rolesJSON=[];

    //load roles
    loadRoleData();
}

$(function () {
    "use strict";//strict mode

    //DOM completed loading!
    DOMReady=true;

    if (free2playError)
    {
        showFree2PlayError();
    }

    loading--;

    updateProgress(2);
    if (!loading)//check if we are loading to load everything
    {
        loadData();
    }
});

function reloadActive(update) {
    "use strict";//strict mode

    var $championsli=$("#champions").find("li");
    var $btnRole=$('.btn-role');
    //check if all buttons are on or off:
    if ((roles[0] && roles[1] && roles[2] && roles[3] && roles[4]) || (!roles[0] && !roles[1] && !roles[2] && !roles[3] && !roles[4])) {
        //activate everything
        $championsli.addClass('toShow');
        $championsli.removeClass('toHide');

        //toggle the appropriate button
        if (roles[0]) {
            $btnRole.addClass('active');
        }
        else
        {
            $btnRole.removeClass('active');
        }

        if (update) {
            updateShowHide();
        }
        return true;
    }

    //de-activate everything
    $championsli.addClass('toHide');
    $championsli.removeClass('toShow');
    $btnRole.removeClass('active');

    //update roleType
    if (roleType === 0) {
        roleType = 2;
        storage.set('roleType', roleType);
    }
    $('.roleType').html(roleTypeOptions[roleType] + ' <span class="caret"></span>');

    //check if all buttons are off:
    if (!roles[0] && !roles[1] && !roles[2] && !roles[3] && !roles[4]) {
        if (update) {
            updateShowHide();
        }
        return true;
    }

    //if its not we have to some real work
    processRoles(update);
    return true;
}

function processRoles(update) {
    "use strict";//strict mode

    var index,index2;
    for (index = 0; index < roles.length; ++index) {
        if (roles[index]) {
            //activate the button
            $('.role_' + index).addClass('active');

            //we have to activate all champions who have this role
            for (index2 = 0; index2 < rolesJSON[roleType][index].length; ++index2) {
                var $championDiv=$('[data-championId=' + rolesJSON[roleType][index][index2] + ']');
                $championDiv.addClass('toShow');
                $championDiv.removeClass('toHide');
            }
        }
    }
    if (update)
    {
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

    var index,$label;
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
    var $randomChampionModalLore=$('.randomChampionModalLore');
    var $randomChampionModalLinks=$('.randomChampionModalLinks');
    var $randomChampionModalLinks2=$('.randomChampionModalLinks2');

    height -= 110;//height of title
    height -= 50;//height of bottom button

    if ($(window).width() >= 450) {
        //update visibility
        $randomChampionModalLore.show();
        $randomChampionModalLinks.show();
        $randomChampionModalLinks2.hide();

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
        //update visibility
        $randomChampionModalLore.hide();
        $randomChampionModalLinks.hide();
        $randomChampionModalLinks2.show();

        height -= 40;//margins
        if (animate) {
            $randomChampionModalLinks2.transition({height: (height) + 'px'},
                adjustModalMaxHeightAndPosition);
        }
        else {
            $randomChampionModalLinks2.height(height);
            adjustModalMaxHeightAndPosition();
        }
    }
}

function updateFree2Play() {
    "use strict";//strict mode

    var $Free2PlayDis;
    if (enableF2P) {
        $Free2PlayDis=$('.Free2Play.disabled');
        $Free2PlayDis.addClass('disabled_f2p');
        $Free2PlayDis.removeClass('disabled');
    }
    else {
        $Free2PlayDis=$('.Free2Play.disabled');
        $Free2PlayDis.addClass('disabled');
        $Free2PlayDis.removeClass('disabled_f2p');
    }
    //update f2p
    storage.set('enableF2P',enableF2P);
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

function loadRoleData()
{
    "use strict";//strict mode

    var filename,index; //so we know what data we are parsing
    for (index = 1; index < roleTypeOptions.length; ++index) {
        filename = 'data/roles' + roleTypeOptions[index] + '.json';
        //lets load it
        $.ajax({
            dataType: "json",
            url: filename,
            success: loadRole,
            context: {index: index}
        });
    }
}
function loadRole(rolesJson) {
    "use strict";//strict mode

    rolesJSON[this.index] = rolesJson; // jshint ignore:line
    loading--;
    updateProgress(2);

    if (!loading)//check if we are loading to load everything
    {
        loadData();
    }
}

function loadF2PData() {
    "use strict";//strict mode

    //get free2play
    $.getJSON(free2playURL, function (free2playJSON) {
        if (free2playJSON.errors[region]===true)
        {
            if ((DOMReady===true) && (free2playError===false))
            {
                //show error now
                free2playError=true;
                showFree2PlayError();
            }
            else
            {
                //if not, handle this when it is
                free2playError=true;
            }
        }

        free2play=free2playJSON.free2play[region];
        storage.set('free2play', free2play);

        loading--;
        updateProgress(2);
        if (!loading)//check if we are loading to load everything
        {
            loadData();
        }
    }).error(function(){
        //something went wrong! Lets check if the dom is ready
        //If free2playError is true, it has already been showed sometime, so do not show it again.
        if ((DOMReady===true) && (free2playError===false))
        {
            //show error now
            free2playError=true;
            showFree2PlayError();
        }
        else
        {
            //if not, handle this when it is
            free2playError=true;
        }

        //lets still do the rest, so we can continue loading
        //if we have data, lets use it instead of the online
        free2play = storage.get('free2play');
        if (free2play===null)
        {
            free2play=[];
        }

        loading--;
        updateProgress(2);
        if (!loading)//check if we are loading to load everything
        {
            loadData();
        }

    });
}
function loadData() {
    "use strict";//strict mode

    //save the roles
    storage.set('rolesJSON',rolesJSON);


    //reload the data after 2 seconds
    setTimeout(function()
    {
        loadChampionData();
        loadOrderData();
        loadRoleData();
        loadF2PData();
    },2000);


    var i,index,divId,html='';
    for (i = 0; i < order.length; ++i) {
        index = order[i];
        divId = champions[index].name.replace(/\W/g, '');
        champions[index].shortName = divId;
        if (champions[index].name.length > 8) {
            largeNames.push(divId);
        }

        //Insert the champion, first don't display because its still loading
        html += '<li style="display:none" id="champ' + divId + '" class="col-lg-1 col-md-1 col-sm-2 col-xs-3 champion toShow showSearch" data-championId="' + index + '"><img class="img-responsive championPortrait" src="' + champions[index].iconSRC + '"><span class="label label-default center-block championLabel">' + champions[index].name + '</span></li>';
    }
    $('#champions').append(html);

    //init modal
    $('.randomChampionModal').modal({
        show: false
    });


    //make some big champion names smaller on big scree
    champTextFit();

    //check if we have champions
    if (championsDisabled === null) {
        championsDisabled = {};
        for (i = 0; i < order.length; ++i) {
            index = order[i];
            championsDisabled[index] = false;
        }
        storage.set('championsDisabled', championsDisabled);
    }


    //get champion playcount
    champPlayed = storage.get('champPlayed');
    if (champPlayed === null) {
        champPlayed = {};
        for (i = 0; i < order.length; ++i) {
            index = order[i];
            champPlayed[index] = 0;
        }
        storage.set('champPlayed', champPlayed);
    }

    //update disabled
    for (i = 0; i < order.length; ++i) {
        index = order[i];
        if (championsDisabled[index]) {
            $('[data-championId=' + index + ']').addClass('disabled');
        }
        else {
            $('[data-championId=' + index + ']').addClass('notDisabled');
        }
    }

    //free 2play
    var $championDiv;
    for (index = 0; index < free2play.length; ++index) {
        $championDiv=$('[data-championId=' + free2play[index] + ']');
        $championDiv.addClass('Free2Play');
        $championDiv.find('span').removeClass('label-default');
        $championDiv.find('span').addClass('label-success');
    }
    updateFree2Play();

    //load the champ click events
    $('.champion').click(function () {
        //toggle the classes
        $(this).toggleClass('notDisabled');

        var champId = $(this).data('championid');

        var disabled;
        if ($(this).hasClass('Free2Play')) {
            //if free 2 play enabled, only half disable it
            if (enableF2P)
            {
            $(this).toggleClass('disabled_f2p');
            disabled = $(this).hasClass('disabled_f2p');
            }
            else
            {
                //fully disable
                $(this).toggleClass('disabled');
                disabled = $(this).hasClass('disabled');
            }
        }
        else {
            $(this).toggleClass('disabled');
            disabled = $(this).hasClass('disabled');
        }

        championsDisabled[champId] = disabled;
        storage.set('championsDisabled', championsDisabled);
    });

    $('.randomChampionDontHaveButton').click(randomChampionDontHave);

    $('.randomChampionNextButton').click(randomChampionNew);

    function randomChampionDontHave()
    {
        //set champion to not have
        $('[data-championId=' + randomChampId+ ']').click();

        randomChampionNew();

    }
    function randomChampionNew(){
        //check if we are not mid animation.
        if (doingNext===true)
        {
            return false;
        }

        doingNext=true;
        //apparently he does not have or like this champion. Lets decrease the playcount
        champPlayed[randomChampId] -= 1;

        //lets add it to the excluded champions
        champsExcluded.push(randomChampId);

        var random=getRandomChampion(champsExcluded);
        var randomRole,options;
        if (random===false)
        {
            //something went wrong, there are no options!
            //this is probably because someone clicked on "i don't have this champion. So lets hide the modal.
            $('.randomChampionModal').modal('hide');
            //and notify the user

            var notice = new PNotify({
                title: 'No champions',
                text: 'There are no champions left to choose from.',
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
            notice.get().click(function() {
                notice.options.animation='none';
                notice.remove();
            });

            doingRandom=false;
            doingNext=false;
            return false;

        }
        else{
            randomChampId=random[0];
            randomRole=random[1];
            options=random[2];
            randomChamp = champions[randomChampId];
        }

        //update its playcount
        champPlayed[random] += 1;
        storage.set('champPlayed', champPlayed);

        //clone the modal
        var $randomChampionModal=$('.randomChampionDialog');
        var $randomChampionModal2=$randomChampionModal.clone();

        //change the champion
        updateModal($randomChampionModal2,randomChamp,randomChampId,rolesPos[randomRole],options.length);

        //rotate and hide the modal
        $randomChampionModal2.css('opacity',0);
        $randomChampionModal2.css('transform','perspective(550px) rotateY(180deg)');

        //insert the modal
        $randomChampionModal2.insertAfter('.randomChampionDialog');

        //do the transformation.
        /* fade out and rotate 3 times */
        $randomChampionModal.transition({
            opacity: 0,
            perspective: 550,
            rotateY: 540
        }, 1000);
        $randomChampionModal2.transition({
            opacity: 1,
            perspective: 550,
            rotateY: 360
        }, 1000,  function (){
            $randomChampionModal.remove();

            //reset the click events
            $('.randomChampionDontHaveButton').click(randomChampionDontHave);

            $('.randomChampionNextButton').click(randomChampionNew);

            //reset the mid animation counter
            doingNext=false;
        });
    }
    //load search button
    $('#championSearch').keyup(function() {
        var val=$('#championSearch').val().toLowerCase();
        var $champion=$('.champion');
        if (val.length===0)
        {
            $champion.removeClass('hiddenSearch');
            $champion.addClass('showSearch');
        }
        else
        {
            val=val.split("|");
            var searchresults=[];
            for (i = 0; i < val.length; ++i) {
                var subresult=searchFor(val[i]);
                $.merge(searchresults,subresult);
            }
            //disable all champions
            $champion.addClass('hiddenSearch');
            $champion.removeClass('showSearch');
            var $championDiv;
            for (i = 0; i < searchresults.length; ++i) {
                $championDiv=$('[data-championId=' + searchresults[i] + ']');
                $championDiv.removeClass('hiddenSearch');
                $championDiv.addClass('showSearch');
            }
        }
    });

    //update active
    reloadActive(false);


    //loading
    var loaded=0;
    var loadedPlus=(1/order.length)*(100-7*2);
    var $championPortrait=$('.championPortrait');
    $championPortrait.on('load',function()
    {
        loaded++;
        updateProgress(loadedPlus);
        if ($(this).parent().hasClass('toShow'))
        {
            $(this).parent().show();
        }
        if (loaded===order.length)
        {
            $('#ProgressContainer').remove();
            loadData2();
        }
    });

    //if its in cache it might have already loaded.
    if (loaded!==order.length) {
        $championPortrait.each(function() {
            if (this.complete) {
                $(this).trigger('load');
            }
    });
    }

    //enable random button
    doingRandom=false;
}

function loadData2() {

    "use strict";//strict mode

    //the free2play button
    $('.free2play').click(function () {
        var $free2play=$('.free2play');
        $free2play.toggleClass('btn-success');
        $free2play.toggleClass('btn-default');
        enableF2P = !enableF2P;
        updateFree2Play();
    });

    //load the selection buttons
    $('.roles button').click(function () {
        //get class
        var roleId = $(this).data('roleid');
        //var $roleBtnClass = $('.role_' + roleId);

        //switch roles
        roles[roleId] = !roles[roleId];
        storage.set('roles', roles);
        //reload which champs should be active
        reloadActive(true);
    });

    $('.dropdownRole li a').click(function () {
        //update roleType
        roleType = $(this).data('roleid');
        storage.set('roleType', roleType);
        $('.roleType').html(roleTypeOptions[roleType] + ' <span class="caret"></span>');
        reloadActive(true);
    });


    $('#random').click(function () {
        //check if we are not already busy with the previous one
        if (doingRandom)
        {
            return false;
        }
        doingRandom=true;

        //reset the excluded champions
        champsExcluded=[];

        var random=getRandomChampion([]);//no excluded champions
        if (random===false)
        {
            //something went wrong, no champions
            doingRandom=false;
            //send a message
            var notice=new PNotify({
                title: 'No possible champions.',
                text: 'Please enable at least 1 champion.',
                opacity: 0.9,
                type: 'error',
                icon: 'glyphicon glyphicon-warning-sign',
                nonblock: {
                    nonblock: true,
                    nonblock_opacity: 0.2
                },
                history: {
                    history: false
                }
            });
            notice.get().click(function() {
                notice.options.animation='none';
                notice.remove();
            });

            return false;
        }
        randomChampId=random[0];
        var randomRole=random[1];
        var options=random[2];
        //because options is later padded
        var totalOptions=options.length;
        randomChamp = champions[randomChampId];


        //remove this champion from the option selection if there are enough champions
        if (options.length > 8) {
            options.splice(options.indexOf(randomChampId), 1);
        }

        //update its playcount
        champPlayed[randomChampId] += 1;
        storage.set('champPlayed', champPlayed);


        var $randomDiv = $('#randomtest');
        $randomDiv.empty();
        $('.randomChampionModalLore,.randomChampionModalLinks2').height(0);
        $randomDiv.css('transform', 'translate(200px,0px)');
        //champs before
        var location = Math.min(Math.max(20, options.length - 10), 35) + Math.floor(Math.random() * 10);

        //max is location, + 10 at the end
        if (options.length <= location+10) {
            var len = options.length;
            //not enough options, fill it up!
            while (options.length <= location+10) {
                var key = Math.floor(Math.random() * len);
                options.push(options[key]);
            }
        }

        shuffle(options);

        //insert the champion at the correct location
        options[location] = randomChampId;
        var index,html='';
        for (index = 0; index <= location + 10; ++index) {
            if (options[index]!==-1)
            {
                html+=('<img src="' + champions[options[index]].iconSRC + '">');
            }
        }
        $randomDiv.append(html);

        setTimeout(function () {
            /* fade out and rotate 3 times */
            $('#randomButton').transition({
                opacity: 0,
                perspective: 550,
                rotateX: 180
            }, 1000);
            $('#randomSelecter').transition({
                opacity: 1,
                perspective: 550,
                rotateX: 360
            }, 1000);

            $randomDiv.transition({
                x: -(location) * 100 + $('#randomSelecterChild').width() / 2 + 400 - ((Math.random() * 70) + 15)
            }, 3000, 'cubic-bezier(.6,-.28,.48,1)', function () {

                var $randomChampionDialog=$('.randomChampionDialog');
                //set rotation
                $randomChampionDialog.css('transform','perspective(550px) rotateY(360deg)');

                updateModal($randomChampionDialog,randomChamp,randomChampId,rolesPos[randomRole],totalOptions);

                setTimeout(function () {
                    var $randomChampionModal=$('.randomChampionModal');

                    adjustModalMaxHeightAndPosition();
                    $randomChampionModal.modal('show');
                    setTimeout(function () {
                        modalLoreFit(false);
                    }, 200);

                    //sometimes above does not work, then use this one:
                    $randomChampionModal.on('shown.bs.modal', function () {
                        modalLoreFit(true);
                    });

                    //we can random again after the modal closes
                    $randomChampionModal.on('hidden.bs.modal', function () {
                        doingRandom=false;
                    });

                    setTimeout(function () {
                        $('#randomButton').transition({
                            opacity: 1,
                            perspective: 550,
                            rotateX: 0
                        }, 1000);
                        $('#randomSelecter').transition({
                            opacity: 0,
                            perspective: 550,
                            rotateX: 180
                        }, 1000);
                    }, 1000);
                }, 200);
            });
        }, 200);
        //false so no extra events get triggered
        return false;
    });
}

function updateModal(divId, randomChamp,randomChampId,role,totalOptions)
{
    "use strict";//strict mode

    divId.find('.randomChampionModalTitle').html(randomChamp.name + ': ' + randomChamp.title);
    divId.find('.randomChampionModalRole').html(role);
    divId.find('.randomChampionModalLore p').html(randomChamp.description);

    //probuilds
    divId.find('.randomChampionModalProbuildLink').attr("href",'http://www.probuilds.net/champions/' + randomChamp.shortName);

    //mobafire
    divId.find('.randomChampionModalMobafireLink').attr("href",randomChamp.mobafireURL);

    //lolwiki
    divId.find('.randomChampionModalLoLWikiLink').attr("href",'http://leagueoflegends.wikia.com/wiki/' + randomChamp.name);

    divId.find('.randomChampionModalBackground').css('background-image', 'url(' + randomChamp.splashSRC + ')');

    //enable both buttons
    divId.find('.randomChampionDontHaveButton').prop("disabled",false);
    divId.find('.randomChampionNextButton').prop("disabled",false);

    //check if its a free 2 play champion that has been disabled
    if (enableF2P===true)//otherwise the champ would not have been chosen
    {
        if (free2play.indexOf(randomChampId)!==-1)
        {
            //okay, the champion is free2play, now lets see if its disabled
            if (championsDisabled[randomChampId]===true)
            {
                //okay, its already disabled, no use of the "i dont have this champion button now"
                divId.find('.randomChampionDontHaveButton').prop("disabled",true);
            }
        }
    }
    //check if we have no other option to switch to
    if (totalOptions===1)
    {
        divId.find('.randomChampionNextButton').prop("disabled",true);
    }
}

function updateProgress(loadProgress)
{
    "use strict";//strict mode

    loadingProgress+=loadProgress;
    $("#loadingProgress").css('width',loadingProgress+'%');
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


function getRandomChampion(excluded)
{

    "use strict";//strict mode

    var $optionDivs=$('.toShow.notDisabled.showSearch, .toShow.disabled_f2p.showSearch');

    //check if we have options:
    if ($optionDivs.length===0)
    {
        return false;
    }

    //Get all possible champions for all roles
    var options = [];//all options, including not chosen lanes
    var realOptions = [[],[],[],[],[]];//the real options
    var champId = 0;

    //now lets see what champions we haven't played or played the least:
    var leastPlayed = Number.MAX_VALUE;
    $optionDivs.each(function () {
        champId = $(this).data('championid');

        //check if not excluded
        if (excluded.indexOf(champId)===-1)
        {
            options.push(champId);

            //if smaller, replace the list
            if (champPlayed[champId]<leastPlayed)
            {
                //reset
                realOptions = [[],[],[],[],[]];//the real options
                leastPlayed=champPlayed[champId];
            }

            //if just as much (or smaller), add to the list
            if (champPlayed[champId]<=leastPlayed)
            {
                //go through all roles
                var i;
                for (i=0;i<5;++i) {
                    if (rolesJSON[roleType][i].indexOf(champId) !== -1)
                    {
                        realOptions[i].push(champId);
                    }
                }
            }
        }
    });

    var rolesFiltered=roles.slice(0);//copy

    //count the amount of options
    if ((realOptions[0].length+realOptions[1].length+realOptions[2].length+realOptions[3].length+realOptions[4].length)===0)
    {
        //something went wrong, we have no options!
        return false;
    }

    //if all roles are deselected it counts as all roles being selected
    if (!roles[0] && !roles[1] && !roles[2] && !roles[3] && !roles[4])
    {
        rolesFiltered=[true,true,true,true,true];
    }

    //filter the roles where there is no champion for
    var i;
    for (i=0;i<5;++i) {
        if (realOptions[i].length === 0)
        {
            //no champions for this role
            rolesFiltered[i]=false;
        }
    }

    // choose a role
    var randomRole = Math.floor(Math.random() * 5);

    //make sure the role chosen is actually wanted
    while (!rolesFiltered[randomRole]) {
        randomRole = Math.floor(Math.random() * 5);
    }

    //go to the correct options
    realOptions=realOptions[randomRole];

    //lets get a random option
    var randomId=realOptions[Math.floor(Math.random()*realOptions.length)];

    return [randomId,randomRole,options];
}

function showFree2PlayError()
{
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
    notice.get().click(function() {
        notice.options.animation='none';
        notice.remove();
    });
}

function searchFor(toSearch) {
    "use strict";//strict mode

    var results = [];
    toSearch = trimString(toSearch); // trim it
    for(var i=0; i<order.length; i++) {
            if(champions[order[i]].nameLower.indexOf(toSearch)!==-1) {
                if(!itemExists(results, champions[order[i]])) {
                    results.push(order[i]);
                }
            }
    }
    return results;
}

function trimString(s) {
    "use strict";//strict mode

    var l=0, r=s.length -1;
    while(l < s.length && s[l] === ' ')
    {
        l++;
    }
    while(r > l && s[r] === ' '){
        r-=1;
    }
    return s.substring(l, r+1);
}


function compareObjects(o1, o2) {
    "use strict";//strict mode

    var k;
    for(k in o1) {
        //noinspection JSUnfilteredForInLoop
        if(o1[k] !== o2[k])
        {
            return false;
        }
    }
    for(k in o2) {
        //noinspection JSUnfilteredForInLoop
        if(o1[k] !== o2[k])
        {
            return false;
        }
    }
    return true;
}

function itemExists(haystack, needle) {
    "use strict";//strict mode

    for(var i=0; i<haystack.length; i++)
    {
        if(compareObjects(haystack[i], needle))
        {
            return true;
        }
    }
    return false;
}