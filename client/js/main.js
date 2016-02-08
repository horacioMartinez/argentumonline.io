define(['jquery', 'app', 'enums'], function ($, App, Enums) {
    var app, game;

    var initApp = function () {
        $(document).ready(function () {
            __ESCALA__ = ( $('#container').height() / 500 );
            $('#container').width(__ESCALA__ * 800);
            $('#chatbox input').css("font-size", Math.floor(12 * __ESCALA__) + 'px');
            log.error("ESCALA: " + __ESCALA__); // TODO: no usar una variable global!
            app = new App();
            app.center();

            if (Detect.isWindows()) {
                // Workaround for graphical glitches on text
                $('body').addClass('windows');
            }

            if (Detect.isOpera()) {
                // Fix for no pointer events
                $('body').addClass('opera');
            }

            if (Detect.isFirefoxAndroid()) {
                // Remove chat placeholder
                $('#chatinput').removeAttr('placeholder');
            }

            $('#chatbutton').click(function () {
                if ($('#chatbutton').hasClass('active')) {
                    app.showChat();
                } else {
                    app.hideChat();
                }
            });

            $('.clickable').click(function (event) {
                event.stopPropagation();
            });

            $('.twitter').click(function () {
                var url = $(this).attr('href');

                app.openPopup('twitter', url);
                return false;
            });

            $('.facebook').click(function () {
                var url = $(this).attr('href');

                app.openPopup('facebook', url);
                return false;
            });

            var data = app.storage.data;
            if (data.hasAlreadyPlayed) {
                if (data.player.name && data.player.name !== "") {
                    $('#playername').html(data.player.name);
                    $('#playerimage').attr('src', data.player.image);
                }
            }

            document.addEventListener("touchstart", function () {
            }, false);

            $(window).bind("resize", app.resizeUi.bind(app));

            log.info("App initialized.");

            initGame();

            // cuando todo este cargado -> app.tryStartingGame();
        });
    };

    var initGame = function () {
        require(['game'], function (Game) {

            var canvas = document.getElementById("entities"),
                background = document.getElementById("background"),
                foreground = document.getElementById("foreground"),
                interfaz = document.getElementById("interfaz"),
                input = document.getElementById("chatinput");

            game = new Game(app);
            game.setup(canvas, background, foreground, interfaz, input);
            game.setStorage(app.storage);
            app.setGame(game);

            if (app.isDesktop && app.supportsWorkers) {
                game.loadMap();
            }

            $('#chatbox').attr('value', '');

            if (game.renderer.mobile || game.renderer.tablet) {
                $('#interfaz').bind('touchstart', function (event) {
                    if ( (!game.started) || (game.isPaused))
                        return;
                    app.center();
                    if (app.setMouseCoordinates(event.originalEvent.touches[0]))
                        game.click();
                });
            } else {
                $('#interfaz').click(function (event) {
                    if ( (!game.started) || (game.isPaused))
                        return;

                    app.center();
                    if (app.setMouseCoordinates(event)) {
                            game.click();
                    }
                    // TODO: si haces click afuera del menu pop up que lo cierre?
                });

                $('#interfaz').dblclick(function (event) {
                    if ( (!game.started) || (game.isPaused))
                        return;

                    app.center();
                    if (app.setMouseCoordinates(event)) {
                        game.doubleclick();
                    }
                    // TODO: si haces click afuera del menu pop up que lo cierre?
                });
            }

            $(document).mousemove(function (event) {
                app.setMouseCoordinates(event);
                if (game.started) {
                    game.movecursor();
                }
            });

            _prevKeyDown = {};

            function _downKey(e) {
                var wh = e.which;
                var kC = e.keyCode;
                if (_prevKeyDown[wh] == null) {
                    _prevKeyDown[wh] = {};
                }
                _prevKeyDown[wh][kC] = true;
            }

            function _upKey(event) {
                var wh = event.which;
                var kC = event.keyCode;

                if (_prevKeyDown[wh] != null) {
                    _prevKeyDown[wh][kC] = null;
                }
            }

            function _isKeyDown(event) {
                var wh = event.which;
                var kC = event.keyCode;

                var result = false;

                if (this._prevKeyDown[wh] != null) {
                    if (this._prevKeyDown[wh][kC] == true) {
                        result = true;
                    }
                }
                return result;
            }

            $(document).keyup(function (e) {
                var key = e.which;
                _upKey(e);
                if (game.started) {
                    switch (key) {
                        case Enums.Keys.LEFT:
                        case Enums.Keys.KEYPAD_4:
                            game.terminarDeCaminar(Enums.Heading.oeste);
                            game.player.disableKeyboardNpcTalk = false;
                            break;
                        case Enums.Keys.RIGHT:
                        case Enums.Keys.KEYPAD_6:
                            game.terminarDeCaminar(Enums.Heading.este);
                            game.player.disableKeyboardNpcTalk = false;
                            break;
                        case Enums.Keys.UP:
                        case Enums.Keys.KEYPAD_8:
                            game.terminarDeCaminar(Enums.Heading.norte);
                            game.player.disableKeyboardNpcTalk = false;
                            break;
                        case Enums.Keys.DOWN:
                        case Enums.Keys.KEYPAD_2:
                            game.terminarDeCaminar(Enums.Heading.sur);
                            game.player.disableKeyboardNpcTalk = false;
                            break;
                        default:
                            break;
                    }
                }
            });

            $(document).keydown(function (e) {
                if ( (!game.started) || (game.isPaused))
                    return;

                var key = e.which,
                    $chat = $('#chatinput');

                if (key === Enums.Keys.ENTER) {
                    if ($('#chatbox').hasClass('active')) {
                        app.hideChat();
                    } else {
                        app.showChat();
                    }
                }

                // maneja las flechas, asi se las puede usar cuando tenes algun menu o el chat abierto
                if (!_isKeyDown(e)) {
                    var continuar = false;
                    switch (key) {
                        case Enums.Keys.LEFT:
                        case Enums.Keys.KEYPAD_4:
                            game.caminar(Enums.Heading.oeste);
                            break;
                        case Enums.Keys.RIGHT:
                        case Enums.Keys.KEYPAD_6:
                            game.caminar(Enums.Heading.este);
                            break;
                        case Enums.Keys.UP:
                        case Enums.Keys.KEYPAD_8:
                            game.caminar(Enums.Heading.norte);
                            break;
                        case Enums.Keys.DOWN:
                        case Enums.Keys.KEYPAD_2:
                            game.caminar(Enums.Heading.sur);
                            break;
                        default:
                            continuar = true;
                            break;
                    }
                    if (!continuar) {
                        _downKey(e);
                        e.preventDefault();
                        return;
                    }
                }

                if (!$('#chatbox').hasClass('active') /* && !this.game.uiRenderer.popUpActivo*/) {
                    if (_isKeyDown(e))
                        return;
                    _downKey(e);
                    e.preventDefault();
                    switch (key){
                        case Enums.Keys.A:
                            game.agarrar();
                            break;
                        case Enums.Keys.O:
                            game.ocultarse();
                            break;

                        default:
                            break;
                    }
                }
            });

            /*
             function handleMouseDown(evt) { //
             evt.preventDefault();
             evt.stopPropagation();

             // you can change the cursor if you want
             // just remember to handle the mouse up and put it back :)
             //evt.target.style.cursor = 'move';

             // rest of code goes here
             }

             document.addEventListener('mousedown', handleMouseDown, false);// */

            $('#chatinput').keydown(function (e) {

                var key = e.which,
                    $chat = $('#chatinput'),
                    placeholder = $(this).attr("placeholder");

                //   if (!(e.shiftKey && e.keyCode === 16) && e.keyCode !== 9) {
                //        if ($(this).val() === placeholder) {
                //           $(this).val('');
                //            $(this).removeAttr('placeholder');
                //            $(this).removeClass('placeholder');
                //        }
                //    }

                if (key === 13) {
                    if ($chat.attr('value') !== '') {
                        if (game.player) {
                            game.enviarChat($chat.attr('value'));
                        }
                        $chat.attr('value', '');
                        app.hideChat();
                        $('#interfaz').focus();
                        return false;
                    } else {
                        app.hideChat();
                        return false;
                    }
                }

                if (key === 27) {
                    app.hideChat();
                    return false;
                }
            });

            $('#chatinput').focus(function (e) {
                var placeholder = $(this).attr("placeholder");

                if (!Detect.isFirefoxAndroid()) {
                    $(this).val(placeholder);
                }

                if ($(this).val() === placeholder) {
                    this.setSelectionRange(0, 0);
                }
            });

            $(document).bind("keydown", function (e) {
                var key = e.which,
                    $chat = $('#chatinput');

                if (key === 13) { // Enter
                    if (game.started) {
                        $chat.focus();
                        return false;
                    } else {
                        if (app.loginFormActive() || app.createNewCharacterFormActive()) {
                            $('input').blur();      // exit keyboard on mobile
                            app.tryStartingGame();
                            return false;           // prevent form submit
                        }
                    }
                }

                if ($('#chatinput:focus').size() == 0 && $('#nameinput:focus').size() == 0) {
                    if (key === 27) { // ESC
                        //TODO
                        //app.hideWindows();
                        _.each(game.player.attackers, function (attacker) {
                            attacker.stop();
                        });
                        return false;
                    }

                    // The following may be uncommented for debugging purposes.
                    //
                    // if(key === 32 && game.started) { // Space
                    //     game.togglePathingGrid();
                    //     return false;
                    // }
                    // if(key === 70 && game.started) { // F
                    //     game.toggleDebugInfo();
                    //     return false;
                    // }
                }
            });

            if (game.renderer.tablet) {
                $('body').addClass('tablet');
            }
            app.tryStartingGame(); // INICIA GAME <-
        });

    };

    initApp();
});
