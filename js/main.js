var roles = [true, true, true, true, true];
var champions = [];
var free2play = [];
var largeNames=['MissFortune','TwistedFate','Mordekaiser','Tryndamere','Cassiopeia','DrMundo'];
$(function () {
    //load the champion data
    $.getJSON("data/champions.json", function (championsJSON) {
        champions = championsJSON;
        var html;
        for (index = 0; index < champions.length; ++index) {
            divId = champions[index].name.replace(/(\.|\s)/g, '');
            html = '<li id="champ' + divId + '" class="col-lg-1 col-md-1 col-sm-2 col-xs-3 champion" data-championId="' + index + '"><img class="img-responsive championPortrait" src="' + champions[index].iconSRC + '"><span class="label label-default center-block championLabel">' + champions[index].name + '</span></li>';
            $('#champions').append(html);
        }

        //make some big champion names responsive
        for (index = 0; index < largeNames.length; ++index) {
            $label=$('#champ'+largeNames[index]+' .championLabel')
            $label.fitText(0.55*($label.html().length)/11);
        }

        //load free2play
        $.getJSON("data/freeToPlay.json", function (free2playJSON) {
            free2play = free2playJSON;
            for (index = 0; index < free2play.length; ++index) {
                $('[data-championId=' + free2play[index] + '] span').removeClass('label-default');
                $('[data-championId=' + free2play[index] + '] span').addClass('label-success');
            }
        });

        //load the champ click events
        $('.champion').click(function () {
            $(this).toggleClass('disabled');
        });
    });


    //load the selection buttons
    $('.roles button').click(function () {
        //get class
        var roleId = $(this).data('roleid');
        var $roleBtnClass = $('.role_' + roleId);
        //toggle the appropriate button
        $roleBtnClass.button('toggle');

        roles[roleId] = !roles[roleId];
        //reload which champs should be active
        reloadActive();
    });


    $('#random').click(function () {
        random = 1;
    });
});

function reloadActive() {
    var toHide = [];
    var toShow = [];
    //check if all buttons are on:
    if (roles[0] && roles[1] && roles[2] && roles[3] && roles[4]) {
        //activate everything
        $("#champions li").addClass('toShow');
        $("#champions li").removeClass('toHide');
        updateShowHide();
        return true;
    }

    //de-activate everything
    $("#champions li").addClass('toHide');
    $("#champions li").removeClass('toShow');

    //check if all buttons are off:
    if (!roles[0] && !roles[1] && !roles[2] && !roles[3] && !roles[4]) {
        updateShowHide();
        return true;
    }

    //if its not we have to some real work
    filename = 'data/roles';
    filename += 'Strict.json';
    $.getJSON(filename, function (rolesJson) {
        for (index = 0; index < roles.length; ++index) {
            if (roles[index]) {
                //we have to activate all champions who have this role
                for (index2 = 0; index2 < rolesJson[index].length; ++index2) {
                    $('[data-championId=' + rolesJson[index][index2] + ']').addClass('toShow');
                    $('[data-championId=' + rolesJson[index][index2] + ']').removeClass('toHide');
                }
            }
        }
        updateShowHide();
        return true;
    });
}

function updateShowHide() {
    $('.toShow').show();
    $('.toHide').hide();
}