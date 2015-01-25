//init all variables
//TODO: twitch's summary is bugged
var roles = [];
var roleTypeOptions = ['All', 'Loose', 'Normal', 'Strict'];
var roleType = 0;
var champions = [];
var order = [];
var free2play = [];
var largeNames = [];
var rolesPos = ['Toplane', 'Jungle', 'Midlane', 'Marksman', 'Support']
var championsDisabled;
var roleType = 0;
var rolesJSON;
var enableF2P = true;
var champPlayed = {};
var apiKey = 'dc5dc19a-eb7d-4175-8955-59ab577026a5';

var loading = 7; //countdown till everything is loaded

//init storage
ns = $.initNamespaceStorage('championPicker');
storage = $.localStorage;
championsDisabled = storage.get('championsDisabled');

roles = storage.get('roles');
if (roles === null) {
    roles = [true, true, true, true, true];
    storage.set('roles', roles);
}

roleType = storage.get('roleType');
if (roleType === null) {
    roleType = 0;
    storage.set('roleType', roleType);
}

//load from storage
champions = storage.get('champions');
order = storage.get('order');
free2play = storage.get('free2play');
rolesJSON=storage.get('rolesJSON');

if (champions === null) {
    //load the champion data
    loadChampionData();
}
else {
    loading--;
    if (!loading)//check if we are loading to load everything
    {
        loadData();
    }
}

if (order === null) {
    loadOrderData();

}
else {
    loading--;
    if (!loading)//check if we are loading to load everything
    {
        loadData();
    }
}

if (free2play === null) {
    //load f2p
    loadF2PData();
}
else {
    loading--;
    if (!loading)//check if we are loading to load everything
    {
        loadData();
    }
}

if (rolesJSON === null) {
    //load f2p
    loadRoleData();
}
else {
    loading-=(roleTypeOptions.length-1);
    if (!loading)//check if we are loading to load everything
    {
        loadData();
    }
}

$(function () {
    //DOM is loading!
    loading--;
    if (!loading)//check if we are loading to load everything
    {
        loadData();
    }
});

function reloadActive() {
    var toHide = [];
    var toShow = [];

    //check if all buttons are on:
    if (roles[0] && roles[1] && roles[2] && roles[3] && roles[4]) {
        //activate everything
        $("#champions li").addClass('toShow');
        $("#champions li").removeClass('toHide');

        //toggle the appropriate button
        $('.roles .btn').addClass('active');
        //set the modifier to all
        roleType = 0;

        $('.roleType').html('All <span class="caret"></span>');
        $('.roleType').addClass('disabled');

        updateShowHide();
        return true;
    }

    //de-activate everything
    $("#champions li").addClass('toHide');
    $("#champions li").removeClass('toShow');
    $('.roles .btn').removeClass('active');
    $('.roleType').removeClass('disabled');

    //update roleType
    if (roleType == 0) {
        roleType = 2;
        storage.set('roleType', roleType);
    }
    $('.roleType').html(roleTypeOptions[roleType] + ' <span class="caret"></span>');

    //check if all buttons are off:
    if (!roles[0] && !roles[1] && !roles[2] && !roles[3] && !roles[4]) {
        updateShowHide();
        return true;
    }

    //if its not we have to some real work
    processRoles();
    return true;
}

function processRoles() {
    for (index = 0; index < roles.length; ++index) {
        if (roles[index]) {
            //activate the button
            $('.role_' + index).addClass('active');

            //we have to activate all champions who have this role
            for (index2 = 0; index2 < rolesJSON[roleType][index].length; ++index2) {
                $('[data-championId=' + rolesJSON[roleType][index][index2] + ']').addClass('toShow');
                $('[data-championId=' + rolesJSON[roleType][index][index2] + ']').removeClass('toHide');
            }
        }
    }
    updateShowHide();
}

function updateShowHide() {
    $('.toShow').show();
    $('.toHide').hide();
}

function champTextFit() {

    if ($(window).width() > 992 || $(window).width() < 512) {
        for (index = 0; index < largeNames.length; ++index) {
            $label = $('#champ' + largeNames[index] + ' .championLabel')
            $label.fitText(0.6 * ($label.html().length) / 11);
        }
    } else {
        for (index = 0; index < largeNames.length; ++index) {
            $label = $('#champ' + largeNames[index] + ' .championLabel')
            $label.removeAttr('style');
        }
    }
}
$(window).on("debouncedresize", function (event) {
    champTextFit();
    if ($(window).height() >= 320) {
        adjustModalMaxHeightAndPosition();
    }
    modalLoreFit(false);
});

function modalLoreFit(animate) {
    var width = $('#randomChampionDialog').width();
    var height = width * 0.590;//aspect ratio of splashes
    height -= 110//height of title

    if ($(window).width() >= 450) {
        //update visibility
        $('#randomChampionModalLore').show();
        $('#randomChampionModalLinks').show();
        $('#randomChampionModalLinks2').hide();

        height -= 70//height of buttons
        if (animate) {
            $('#randomChampionModalLore').transition({height: (height) + 'px'},
                adjustModalMaxHeightAndPosition);
        }
        else {
            $('#randomChampionModalLore').height(height);
            adjustModalMaxHeightAndPosition();
        }
    }
    else {
        //update visibility
        $('#randomChampionModalLore').hide();
        $('#randomChampionModalLinks').hide();
        $('#randomChampionModalLinks2').show();

        height -= 40//margins
        if (animate) {
            $('#randomChampionModalLinks2').transition({height: (height) + 'px'},
                adjustModalMaxHeightAndPosition);
        }
        else {
            $('#randomChampionModalLinks2').height(height);
            adjustModalMaxHeightAndPosition();
        }
    }
}

function updateFree2Play() {
    if (enableF2P) {
        $('.Free2Play.disabled').addClass('disabled_f2p');
        $('.Free2Play.disabled').removeClass('disabled');
    }
    else {
        $('.Free2Play.disabled_f2p').addClass('disabled');
        $('.Free2Play.disabled_f2p').removeClass('disabled_f2p');
    }
}

function loadChampionData() {
    $.getJSON("data/champions.json", function (championsJSON) {
        champions = championsJSON;
        storage.set('champions', champions);
        loading--;
        if (!loading)//check if we are loading to load everything
        {
            loadData();
        }
    });
}

function loadOrderData() {
    $.getJSON("data/order.json", function (orderJSON) {
        order = orderJSON;
        storage.set('order', order);
        loading--;
        if (!loading)//check if we are loading to load everything
        {
            loadData();
        }
    });
}

function loadRoleData()
{
    for (index = 1; index < roleTypeOptions.length-1; ++index) {
        filename = 'data/roles' + roleTypeOptions[roleType] + '.json';
        //lets load it
        rolesJSON=[];
        $.getJSON(filename, function (rolesJson) {
            rolesJSON[roleType] = rolesJson;
            loading--;
            if (!loading)//check if we are loading to load everything
            {
                loadData();
            }
        });
    }
}

function loadF2PData() {
    //load free2play
    $.getJSON("https://euw.api.pvp.net/api/lol/euw/v1.2/champion?freeToPlay=true&api_key=" + apiKey, function (free2playJSON) {
        free2play = [];
        for (index = 0; index < free2playJSON.champions.length; ++index) {
            free2play[index] = free2playJSON.champions[index].id;
            loading--;
        }
        storage.set('free2play', free2play);
        loading--;
        if (!loading)//check if we are loading to load everything
        {
            loadData();
        }
    });
}
function loadData() {
    //save the roledata
    storage.set('rolesJSON',rolesJSON);
    var html='';
    for (i = 0; i < order.length; ++i) {
        index = order[i];
        divId = champions[index].name.replace(/\W/g, '');
        champions[index].shortName = divId;
        if (champions[index].name.length > 8) {
            largeNames.push(divId);
        }

        //Insert the champion
        html += '<li id="champ' + divId + '" class="col-lg-1 col-md-1 col-sm-2 col-xs-3 champion toShow" data-championId="' + index + '"><img class="img-responsive championPortrait" src="' + champions[index].iconSRC + '"><span class="label label-default center-block championLabel">' + champions[index].name + '</span></li>';
    }
    $('#champions').append(html);


    //init modal
    $('#randomChampionModal').modal({
        show: false
    });

    //make some big champion names smaller on big scree
    champTextFit();

    //reload which champs should be active
    reloadActive();

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
    for (index = 0; index < free2play.length; ++index) {
        $('[data-championId=' + free2play[index] + ']').addClass('Free2Play');
        $('[data-championId=' + free2play[index] + '] span').removeClass('label-default');
        $('[data-championId=' + free2play[index] + '] span').addClass('label-success');
    }
    updateFree2Play();

    //load the champ click events
    $('.champion').click(function () {
        //toggle the classes
        $(this).toggleClass('notDisabled');

        var champId = $(this).data('championid');
        var disabled = $(this).hasClass('disabled');

        if ($(this).hasClass('free2play')) {
            $('Free2Play').toggleClass('disabled_f2p');
            var disabled = $(this).hasClass('disabled_f2p');
        }
        else {
            $(this).toggleClass('disabled');
            var disabled = $(this).hasClass('disabled');
        }

        championsDisabled[champId] = disabled;
        storage.set('championsDisabled', championsDisabled);
    });

    //load the rest
    loadData2();
}


function loadData2() {

    //the free2play button
    $('.free2play').click(function () {
        enableF2P = !enableF2P;
        updateFree2Play();
    });

    //load the selection buttons
    $('.roles button').click(function () {
        //get class
        var roleId = $(this).data('roleid');
        var $roleBtnClass = $('.role_' + roleId);

        //switch roles
        roles[roleId] = !roles[roleId];
        storage.set('roles', roles);
        //reload which champs should be active
        reloadActive();
    });

    $('.dropdownRole li a').click(function () {
        //update roleType
        roleType = $(this).data('roleid');
        storage.set('roleType', roleType);
        $('.roleType').html(roleTypeOptions[roleType] + '<span class="caret"></span>');
        reloadActive();
    });


    $('#random').click(function () {
        //lets first choose a role
        var randomRole = Math.floor(Math.random() * 5);
        var allRoles = true;
        //check if not all buttons are on:
        if (!roles[0] || !roles[1] || !roles[2] || !roles[3] || !roles[4]) {
            allRoles = false;
            while (!roles[randomRole]) {
                randomRole = Math.floor(Math.random() * 5);
            }
        }

        //now we get all possible champions
        var options = [];//all options, including not chosen lanes
        var optionsShuffle = [];//the real options
        var champId = 0;
        $('.toShow.notDisabled, .toShow.disabled_f2p').each(function () {
            champId = $(this).data('championid');
            options.push(champId);
            if (allRoles = true || rolesJSON[roleType][randomRole].indexOf(champId) != -1)//the champion indeed has the role chosen
            {
                optionsShuffle.push(champId);
            }
        });

        //shuffle the options so its random
        shuffle(optionsShuffle);

        //now lets see what champions we haven't played or played the least:
        var random = optionsShuffle[0];
        var mostPlayed = champPlayed[optionsShuffle[0]];
        for (i = 1; i < options.length - 1; ++i) {
            if (mostPlayed > champPlayed[optionsShuffle[i]]) {
                random = optionsShuffle[i];
                mostPlayed = champPlayed[optionsShuffle[i]];
            }
        }

        //we now have the best option
        var randomChamp = champions[random];

        //update its playcount
        champPlayed[random] += 1;
        storage.set('champPlayed', champPlayed);


        var $randomDiv = $('#randomtest');
        $randomDiv.empty();
        $('#randomChampionModalLore,#randomChampionModalLinks2').height(0);
        $randomDiv.css('transform', 'translate(200px,0px)');
        //champs before
        var location = Math.min(Math.max(20, options.length - 10), 35) + Math.floor(Math.random() * 10);

        if (options.length <= 42) {
            var len = options.length;
            //not enough options, fill it up!
            while (options.length <= 42) {
                var key = Math.floor(Math.random() * len);
                options.push(options[key]);
            }
        }
        (options.splice(random, 1))//remove the chosen element, inserts -1 to make sure the numbering remains intact
        shuffle(options);
        options[location] = random;
        var html='';
        for (index = 0; index < location + 10; ++index) {
            html+=('<img src="' + champions[options[index]].iconSRC + '">');
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
                $('#randomChampionModalTitle').html(randomChamp.name + ': ' + randomChamp.title);
                $('#randomChampionModalRole').html(rolesPos[randomRole]);
                $('#randomChampionModalLore p').html(randomChamp.description);

                $('#randomChampionModalLinks').html('<p class="text-left"><a target="_blank" href="http://www.probuilds.net/champions/' + randomChamp.shortName + '">Probuilds</a></p>')
                $('#randomChampionModalLinks2').html('<p class="text-center"><a target="_blank" href="http://www.probuilds.net/champions/' + randomChamp.shortName + '">Probuilds</a></p>')
                //get mobafire url
                //$.getJSON('http://www.mobafire.com/ajax/searchSite?text='+encodeURIComponent());

                //TODO: make mobafire link
                $('#randomChampionModalLinks').append('<p class="text-center" style="width:60%"><a target="_blank" href="http://www.mobafire.com/league-of-legends/' + randomChamp.shortName + '-guide">Mobafire WIP</a></p>')
                $('#randomChampionModalLinks2').append('<p class="text-center""><a target="_blank" href="http://www.mobafire.com/league-of-legends/' + randomChamp.shortName + '-guide">Mobafire WIP</a></p>')

                $('#randomChampionModalLinks').append('<p class="text-right"><a target="_blank" href="http://leagueoflegends.wikia.com/wiki/' + randomChamp.name + '">LoL Wiki</a></p>')
                $('#randomChampionModalLinks2').append('<p class="text-center"><a target="_blank" href="http://leagueoflegends.wikia.com/wiki/' + randomChamp.name + '">LoL Wiki</a></p>')

                $('#randomChampionModalBackground').css('background-image', 'url(' + randomChamp.splashSRC + ')');
                setTimeout(function () {
                    adjustModalMaxHeightAndPosition();
                    $('#randomChampionModal').modal('show');
                    setTimeout(function () {
                        modalLoreFit(false)
                    }, 200);
                    //sometimes above does not work, then use this one:
                    $('#randomChampionModal').on('shown.bs.modal', function (e) {
                        modalLoreFit(true);
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
                    }, 1000)
                }, 200)
            })
        }, 200);
    });
}

//knuth-shuffle
function shuffle(array) {
    var currentIndex = array.length
        , temporaryValue
        , randomIndex
        ;

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

