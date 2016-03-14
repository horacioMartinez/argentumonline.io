define(['jquery-ui', 'app', 'assetmanager', 'lib/pixi'], function (___ui___, App, AssetManager, PIXI) {
    var app, game, assetManager;

    var initApp = function () {
        $(document).ready(function () {

            /*$(function() {
             $( "#progressbar" ).progressbar({
             value: 37
             });
             });*/

            assetManager = new AssetManager();
            app = new App();
            app.resizeUi();
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

            assetManager.preload(function () {
                initLoginScreen();
                initGame();
            });
        });
    };

    var initLoginScreen = function () {
        $('#botonJugar').click(function () {
            app.tryStartingGame();
        });

        $('#botonCrearPJ').click(function () {
            app.setCrearPJ();
        });
    };

    var initGame = function () {
        require(['game'], function (Game) {
            var input = document.getElementById("chatinput");

            game = new Game(app, assetManager);
            game.setup(input);
            game.setStorage(app.storage);
            app.setGame(game);

            $('#chatbox').attr('value', '');

            $('#gamecanvas').click(function (event) {
                if ((!game.started) || (game.isPaused))
                    return;

                app.center();
                if (app.setMouseCoordinates(event)) {
                    game.click();
                }
                // TODO: si haces click afuera del menu pop up que lo cierre?
            });

            $('#gamecanvas').dblclick(function (event) {
                if ((!game.started) || (game.isPaused))
                    return;

                app.center();
                if (app.setMouseCoordinates(event)) {
                    game.doubleclick();
                }
                // TODO: si haces click afuera del menu pop up que lo cierre?
            });

            /*
             $(document).mousemove(function (event) {
             app.setMouseCoordinates(event);
             if (game.started) {
             game.movecursor();
             }
             });
             */
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
                            break;
                        case Enums.Keys.RIGHT:
                        case Enums.Keys.KEYPAD_6:
                            game.terminarDeCaminar(Enums.Heading.este);
                            break;
                        case Enums.Keys.UP:
                        case Enums.Keys.KEYPAD_8:
                            game.terminarDeCaminar(Enums.Heading.norte);
                            break;
                        case Enums.Keys.DOWN:
                        case Enums.Keys.KEYPAD_2:
                            game.terminarDeCaminar(Enums.Heading.sur);
                            break;
                        default:
                            break;
                    }
                }
            });

            $(document).keydown(function (e) {
                if (!game.started)
                    return;

                var key = e.which;

                // maneja las flechas, asi se las puede usar cuando tenes algun menu o el chat abierto

                var continuar = false;
                switch (key) {
                    case Enums.Keys.LEFT:
                    case Enums.Keys.KEYPAD_4:
                        if (!_isKeyDown(e))
                            game.caminar(Enums.Heading.oeste);
                        break;
                    case Enums.Keys.RIGHT:
                    case Enums.Keys.KEYPAD_6:
                        if (!_isKeyDown(e))
                            game.caminar(Enums.Heading.este);
                        break;
                    case Enums.Keys.UP:
                    case Enums.Keys.KEYPAD_8:
                        if (!_isKeyDown(e))
                            game.caminar(Enums.Heading.norte);
                        break;
                    case Enums.Keys.DOWN:
                    case Enums.Keys.KEYPAD_2:
                        if (!_isKeyDown(e))
                            game.caminar(Enums.Heading.sur);
                        break;
                    default:
                        continuar = true;
                        break;
                }
                if (!continuar) {
                    _downKey(e);
                    if (!game.uiManager.hayPopUpActivo()) { // si hay un popup abierto dejar que siga la tecla al pop up, sino no
                        return false;
                    }
                    return;
                }

                // lo de abajo se ejecuta solo si no hay un pop up abierto

                if (game.isPaused || (game.uiManager.hayPopUpActivo()))
                    return;

                $chatb = $('#chatbox');

                if (key === Enums.Keys.ENTER) {
                    if ($chatb.hasClass('active')) {
                        app.hideChat();
                    } else {
                        app.showChat();
                    }
                }

                if (!$chatb.hasClass('active') /* && !this.game.uiRenderer.popUpActivo*/) {
                    if (_isKeyDown(e))
                        return;
                    _downKey(e);
                    e.preventDefault();
                    switch (key) {
                        case Enums.Keys.A:
                            game.agarrar();
                            break;
                        case Enums.Keys.O:
                            game.ocultarse();
                            break;
                        case Enums.Keys.L:
                            game.requestPosUpdate();
                            break;
                        case Enums.Keys.E:
                            game.equiparSelectedItem();
                            break;
                        case Enums.Keys.U:
                            game.usarConU();
                            break;
                        case Enums.Keys.CONTROL:
                            game.atacar();
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

                var key = e.which;
                placeholder = $(this).attr("placeholder");

                //   if (!(e.shiftKey && e.keyCode === 16) && e.keyCode !== 9) {
                //        if ($(this).val() === placeholder) {
                //           $(this).val('');
                //            $(this).removeAttr('placeholder');
                //            $(this).removeClass('placeholder');
                //        }
                //    }

                if (key === 13) {
                    $chat = $('#chatinput');
                    if ($chat.attr('value') !== '') {
                        if (game.player) {
                            game.enviarChat($chat.val());
                        }
                        $chat.val('');
                        app.hideChat();
                        $('#gamecanvas').focus();
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
                var key = e.which;

                if (key === 13) { // Enter
                    $chat = $('#chatinput');
                    if (game.started) {
                        $chat.focus();
                        return false;
                    } else {/*
                     if (app.loginFormActive() || app.createNewCharacterFormActive()) {
                     $('input').blur();      // exit keyboard on mobile
                     app.tryStartingGame();
                     return false;           // prevent form submit
                     }*/
                    }
                }
            });

            if (game.renderer.tablet) {
                $('body').addClass('tablet');
            }

            app.start(); // <--------------- TODO: hacer que empieze luego de cargar todo (pasarle esta funcion al assetManager para que la llame)!!!
        });

    };

    initApp();

});
