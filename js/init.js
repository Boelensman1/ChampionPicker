function init()
{
    'use strict';

    //init modal
    $('.randomChampionModal').modal({
        show: false
    });


    $('.randomChampionDontHaveButton').click(randomChampionDontHave);

    $('.randomChampionNextButton').click(randomChampionNew);

    function randomChampionDontHave() {
        //set champion to not have
        $('[data-championId=' + randomChampId + ']').click();

        randomChampionNew();

    }

    function randomChampionNew() {
        //check if we are not mid animation.
        if (doingNext === true) {
            return false;
        }

        doingNext = true;
        //apparently he does not have or like this champion. Lets decrease the playcount
        champPlayed[randomChampId] -= 1;

        //lets add it to the excluded champions
        champsExcluded.push(randomChampId);

        var random = getRandomChampion(champsExcluded);
        var randomRole, options;
        if (random === false) {
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
            notice.get().click(function () {
                notice.options.animation = 'none';
                notice.remove();
            });

            doingRandom = false;
            doingNext = false;
            return false;

        }
        else {
            randomChampId = random[0];
            randomRole = random[1];
            options = random[2];
            randomChamp = champions[randomChampId];
        }

        //update its playcount
        if (champPlayed[random]===undefined)
        {
            champPlayed[random]=0;
        }
        champPlayed[random] += 1;
        storage.set('champPlayed', champPlayed);

        //clone the modal
        var $randomChampionModal = $('.randomChampionDialog');
        var $randomChampionModal2 = $randomChampionModal.clone();

        //change the champion
        updateModal($randomChampionModal2, randomChamp, randomChampId, rolesPos[randomRole], options.length);

        //rotate and hide the modal
        $randomChampionModal2.css('opacity', 0);
        $randomChampionModal2.css('transform', 'perspective(550px) rotateY(180deg)');

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
        }, 1000, function () {
            $randomChampionModal.remove();

            //reset the click events
            $('.randomChampionDontHaveButton').click(randomChampionDontHave);

            $('.randomChampionNextButton').click(randomChampionNew);

            //reset the mid animation counter
            doingNext = false;
        });
    }

    //load search button
    $('#championSearch').keyup(function () {
        var val = $('#championSearch').val().toLowerCase();
        var $champion = $('.champion');
        if (val.length === 0) {
            $champion.removeClass('hiddenSearch');
            $champion.addClass('showSearch');
        }
        else {
            var i;
            val = val.split("|");
            var searchresults = [];
            for (i = 0; i < val.length; ++i) {
                var subresult = searchFor(val[i]);
                $.merge(searchresults, subresult);
            }
            //disable all champions
            $champion.addClass('hiddenSearch');
            $champion.removeClass('showSearch');
            var $championDiv;
            for (i = 0; i < searchresults.length; ++i) {
                $championDiv = $('[data-championId=' + searchresults[i] + ']');
                $championDiv.removeClass('hiddenSearch');
                $championDiv.addClass('showSearch');
            }
        }
    });

    //the free2play button
    $('.free2play').click(function () {
        var $free2play = $('.free2play');

        switch (free2playState) {
            case 0:
            {
                free2playState = 2;
                $free2play.removeClass('btn-warning');
                $free2play.removeClass('btn-success');
                $free2play.addClass('btn-primary');
                $free2play.find('p').text('Only');
                break;
            }
            case 1:
            {
                free2playState = 0;
                $free2play.removeClass('btn-success');
                $free2play.removeClass('btn-primary');
                $free2play.addClass('btn-warning');
                $free2play.find('p').text('Disabled');
                break;
            }
            case 2:
            {
                free2playState = 1;
                $free2play.removeClass('btn-warning');
                $free2play.removeClass('btn-primary');
                $free2play.addClass('btn-success');
                $free2play.find('p').text('Enabled');
                break;
            }
        }
        clearTimeout(free2playTimout);
        free2playTimout = setTimeout(function () {
            $free2play.find('p').text($free2play.data('text'));
        }, 1000);

        updateFree2Play();
    });

    //load the selection buttons
    $('.roles button').click(function () {
        //get class
        var roleId = $(this).data('roleid');

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
        if (doingRandom) {
            return false;
        }
        doingRandom = true;

        //reset the excluded champions
        champsExcluded = [];

        var random = getRandomChampion([]);//no excluded champions
        if (random === false) {
            //something went wrong, no champions
            doingRandom = false;
            //send a message
            var notice = new PNotify({
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
            notice.get().click(function () {
                notice.options.animation = 'none';
                notice.remove();
            });

            return false;
        }
        randomChampId = random[0];
        var randomRole = random[1];
        var options = random[2];
        //because options is later padded
        var totalOptions = options.length;
        randomChamp = champions[randomChampId];


        //remove this champion from the option selection if there are enough champions
        if (options.length > 8) {
            options.splice(options.indexOf(randomChampId), 1);
        }

        //update its playcount
        if (champPlayed[randomChampId]===undefined)
        {
            champPlayed[randomChampId]=0;
        }
        champPlayed[randomChampId] += 1;
        storage.set('champPlayed', champPlayed);


        var $randomDiv = $('#randomtest');
        $randomDiv.empty();
        $('.randomChampionModalLore,.randomChampionModalLinks2').height(0);
        $randomDiv.css('transform', 'translate(200px,0px)');
        //champs before
        var location = Math.min(Math.max(20, options.length - 10), 35) + Math.floor(Math.random() * 10);

        //max is location, + 10 at the end
        if (options.length <= location + 10) {
            var len = options.length;
            //not enough options, fill it up!
            while (options.length <= location + 10) {
                var key = Math.floor(Math.random() * len);
                options.push(options[key]);
            }
        }

        shuffle(options);

        //insert the champion at the correct location
        options[location] = randomChampId;
        var index, html = '';
        for (index = 0; index <= location + 10; ++index) {
            if (options[index] !== -1) {
                html += ('<img src="' + champions[options[index]].iconSRC + '">');
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

                var $randomChampionDialog = $('.randomChampionDialog');
                //set rotation
                $randomChampionDialog.css('transform', 'perspective(550px) rotateY(360deg)');

                updateModal($randomChampionDialog, randomChamp, randomChampId, rolesPos[randomRole], totalOptions);

                setTimeout(function () {
                    var $randomChampionModal = $('.randomChampionModal');

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
                        doingRandom = false;
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

    //define the settings buttons
    $('#btn-force-reload').click(function(){
        forceReload();
    });

    $('#btn-reset-playcount').confirmation({onConfirm:function(){
        var i;
        champPlayed = {};
        storage.set('champPlayed', champPlayed);


        var notice = new PNotify({
            title: 'Playcount',
            text: 'The playcount has been reset.',
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
    }});

    $('#btn-reset-champions').confirmation({onConfirm:function(){
        championsDisabled=[];
        storage.set('championsDisabled', championsDisabled);
        forceReload();
    }});

    //load export data
    $('.sidebar').on('show.bs.sidebar',function(){
        var i, exportString={};
        for (i = 0; i < exportKeys.length; ++i) {
            exportString[exportKeys[i]]=storage.get(exportKeys[i]);
        }
        $('#settingsExport').val(JSON.stringify(exportString));
    });

    //on click select all
    $('#settingsExport').click(function(){
        this.setSelectionRange(0, this.value.length);
    });

    //on double click, copy
    $('#settingsExport').dblclick(function(){

    });

    //on click import
    $('#settingsImportButton').click(function(){
        var i,key, keys, json=JSON.parse($('#settingsImport').val());
        keys=Object.keys(json);
        for (i = 0; i < keys.length; ++i) {
            key=keys[i];
            storage.set(key, json[key]);
            window[key]=json[key];
        }
        forceReload();
    });
}