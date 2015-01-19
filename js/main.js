var roles = [true, true, true, true, true];
var champions = [];
var free2play = [];
var largeNames=[];
$(function () {
    //load the champion data
    $.getJSON("data/champions.json", function (championsJSON) {
        champions = championsJSON;
        var html;
        for (index = 0; index < champions.length; ++index) {
            divId = champions[index].name.replace(/\W/g, '');
            champions[index].shortName=divId;
            if (champions[index].name.length>8)
            {
                largeNames.push(divId);
            }
            html = '<li id="champ' + divId + '" class="col-lg-1 col-md-1 col-sm-2 col-xs-3 champion" data-championId="' + index + '"><img class="img-responsive championPortrait" src="' + champions[index].iconSRC + '"><span class="label label-default center-block championLabel">' + champions[index].name + '</span></li>';
            $('#champions').append(html);

            //init modal
            $('#randomChampionModal').modal({show:false});

        }

        //make some big champion names smaller on big scree
        champTextFit();

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
        var $randomDiv=$('#randomtest');
        $randomDiv.html('');
        $randomDiv.css('transform','translate(200px,0px)');
        var random=1;
        var randomChamp=champions[random];
        //champs before
        var location=Math.floor((Math.random() * 10) + 30);

        var randomArray=champions.slice(); //copy the champ array to the random array
        randomArray.splice(random,1)
        randomArray=shuffle(randomArray);
        randomArray[location]=randomChamp;

        for (index = 0; index < location+10; ++index) {
            $randomDiv.append('<img src="'+randomArray[index].iconSRC+'">');
        }
        setTimeout(function() {
            /* fade out and rotate 3 times */
        $('#randomButton').transition({ opacity: 0, perspective: 550, rotateX: 180 }, 1000 );
        $('#randomSelecter').transition({ opacity: 1, perspective: 550, rotateX: 360 }, 1000);

            $randomDiv.transition({
                x: -(location)*100+$('#randomSelecterChild').width()/2+400-((Math.random() * 70) + 15)
                //x: -100
            }, 3000,'cubic-bezier(.6,-.28,.48,1)',function(){
                $('#randomChampionModalTitle').html(randomChamp.name);
                $('#randomChampionModalBody p').html('<a href="http://www.probuilds.net/champions/'+randomChamp.shortName+'">Probuilds</a><br>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad sed dolores iusto ab vero tempora in earum accusantium quas iure repellendus fugit ipsa reiciendis. Id illo natus sequi ex eveniet!');
                $('#randomChampionModalBackground').css('background-image', 'url(' + randomChamp.splashSRC + ')');
                setTimeout(function() {
                    adjustModalMaxHeightAndPosition();
                    $('#randomChampionModal').modal('show');
                    setTimeout(function() {
                        $('#randomButton').transition({opacity: 1, perspective: 550, rotateX: 0}, 1000);
                        $('#randomSelecter').transition({opacity: 0, perspective: 550, rotateX: 180}, 1000);
                    },1000)
                },200)
            })
        }, 200);
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
    $('.toShow').show('slow');
    $('.toHide').hide('slow');
}
function champTextFit() {

    if ($(window).width() > 992|| $(window).width()<512) {
        for (index = 0; index < largeNames.length; ++index) {
            $label = $('#champ' + largeNames[index] + ' .championLabel')
            $label.fitText(0.6 * ($label.html().length) / 11);
        }
    }
    else
    {
        for (index = 0; index < largeNames.length; ++index) {
            $label = $('#champ' + largeNames[index] + ' .championLabel')
            $label.removeAttr( 'style' );
        }
    }
}
$(window).on("debouncedresize", function( event ) {
    champTextFit();
});

shuffle = function(v){
    for(var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
    return v;
};