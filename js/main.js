var roles = [true, true, true, true, true];
var champions = [];
var order = [];
var free2play = [];
var largeNames = [];
var rolesPos = ['Toplane', 'Jungle', 'Midlane', 'Botlane: Adc', 'Botlane: Support']
var championsDisabled;

//init storage
ns = $.initNamespaceStorage('championPicker');
storage = $.localStorage;
championsDisabled = storage.get('championsDisabled');

$(function () {
    //load the champion data
    $.getJSON("data/champions.json", function (championsJSON) {
        champions = championsJSON;

        $.getJSON("data/order.json", function (orderJSON) {
            order = orderJSON;
            var html;
            for (i = 0; i < order.length; ++i) {
                index = order[i];
                divId = champions[index].name.replace(/\W/g, '');
                champions[index].shortName = divId;
                if (champions[index].name.length > 8) {
                    largeNames.push(divId);
                }


                //Insert the champion
                html = '<li id="champ' + divId + '" class="col-lg-1 col-md-1 col-sm-2 col-xs-3 champion toShow" data-championId="' + index + '"><img class="img-responsive championPortrait" src="' + champions[index].iconSRC + '"><span class="label label-default center-block championLabel">' + champions[index].name + '</span></li>';
                $('#champions').append(html);

                //init modal
                $('#randomChampionModal').modal({
                    show: false
                });

            }

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
                //toggle the classes
                $(this).toggleClass('disabled');
                $(this).toggleClass('notDisabled');

                var champId = $(this).data('championid');
                var disabled = $(this).hasClass('disabled');
                championsDisabled[champId] = disabled;
                storage.set('championsDisabled', championsDisabled);
            });
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
        //get all possible champions
        var options = [];
        var index = 0;
        $('.toShow.notDisabled').each(function () {
            options[index++] = $(this).data('championid');
        });

        var $randomDiv = $('#randomtest');
        $randomDiv.html('');
        $('#randomChampionModalLore,#randomChampionModalLinks2').height(0);
        $randomDiv.css('transform', 'translate(200px,0px)');
        var random = 103;
        var randomChamp = champions[random];
        var randomRole = 2;
        //champs before
        var location = Math.min(Math.max(10, options.length - 10), 35);

        if (options.length <= 22) {
            var len = options.length;
            //not enough options, fill it up!
            while (options.length <= 22) {
                var key = Math.floor(Math.random() * len);
                options[index++] = options[key];
            }
        }

        options.splice(random, 1)
        options = shuffle(options);
        options[location] = random;

        for (index = 0; index < location + 10; ++index) {
            $randomDiv.append('<img src="' + champions[options[index]].iconSRC + '">');
        }
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
                    setTimeout(function(){modalLoreFit(false)},200);
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

        height-=70//height of buttons
        if (animate) {
            $('#randomChampionModalLore').transition({ height: (height)+'px' },
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

        height-=40//margins
        if (animate) {
            $('#randomChampionModalLinks2').transition({ height: (height)+'px' },
                adjustModalMaxHeightAndPosition);
        }
        else {
            $('#randomChampionModalLinks2').height(height);
            adjustModalMaxHeightAndPosition();
        }
    }
}

shuffle = function (v) {
    for (var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
    return v;
};
