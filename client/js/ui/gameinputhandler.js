/**
 * Created by horacio on 4/6/16.
 */


define([], function () {
    var GameInputHandler = Class.extend({

        init: function (game) {
            this.game = game;
        },

        showChat: function () {
            $('#chatbox').addClass('active');
            $('#chatinput').focus();
        },

        hideChat: function () {
            $('#chatbox').removeClass('active');
            $('#chatinput').blur();
        },

        inGameMouseCoordinates: function (game, event) {

            var gamePos = $('#gamecanvas').offset(),
                width = game.renderer.pixiRenderer.width,
                height = game.renderer.pixiRenderer.height,
                mouse = game.mouse;

            mouse.x = event.pageX - gamePos.left;
            mouse.y = event.pageY - gamePos.top;

            var posEnGameCanvas = true;
            if (mouse.x <= 0) {
                mouse.x = 0;
                posEnGameCanvas = false;
            } else if (mouse.x >= width) {
                mouse.x = width - 1;
                posEnGameCanvas = false;
            }

            if (mouse.y <= 0) {
                mouse.y = 0;
                posEnGameCanvas = false;
            } else if (mouse.y >= height) {
                mouse.y = height - 1;
                posEnGameCanvas = false;
            }
            return posEnGameCanvas;
        },

        initGameDom: function () {
            var game = this.game;

            $('#chatbox').attr('value', '');

            var self = this;

            $('#gamecanvas').click(function (event) {
                //self.center();

                if ((!game.started) || (game.isPaused))
                    return;

                if (self.inGameMouseCoordinates(game, event)) {
                    game.click();
                }
                // TODO: si haces click afuera del menu pop up que lo cierre?
            });

            $('#gamecanvas').dblclick(function (event) {
                if ((!game.started) || (game.isPaused))
                    return;

                //self.center();
                if (self.inGameMouseCoordinates(game, event)) {
                    game.doubleclick();
                }
                // TODO: si haces click afuera del menu pop up que lo cierre?
            });

            /*
             $(document).mousemove(function (event) {
             self.inGameMouseCoordinates(game,event);
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

                if (_prevKeyDown[wh] != null) {
                    if (_prevKeyDown[wh][kC] == true) {
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

                    if (!game.gameUI.hayPopUpActivo()) { // si hay un popup abierto dejar que siga la tecla al pop up, sino no
                        return false;
                    }
                    return;
                }

                if (game.isPaused || (game.gameUI.hayPopUpActivo()))
                    return;
                // lo de abajo se ejecuta solo si no hay un pop up abierto

                $chatb = $('#chatbox');

                if (key === Enums.Keys.ENTER) {
                    if ($chatb.hasClass('active')) {
                        self.hideChat();
                    } else {
                        self.showChat();
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
                        case Enums.Keys.T:
                            game.tratarDeTirarItem();
                            break;
                        default:
                            break;
                    }
                }
            });

            $('#chatinput').keydown(function (e) {

                var key = e.which;

                if (key === 13) {
                    $chat = $('#chatinput');
                    if ($chat.attr('value') !== '') {
                        if (game.player) {
                            game.enviarChat($chat.val());
                        }
                        $chat.val('');
                        self.hideChat();
                        $('#gamecanvas').focus();
                        return false;
                    } else {
                        self.hideChat();
                        return false;
                    }
                }

                if (key === 27) {
                    self.hideChat();
                    return false;
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
                     if (self.loginFormActive() || self.createNewCharacterFormActive()) {
                     $('input').blur();      // exit keyboard on mobile
                     self.tryStartingGame();
                     return false;           // prevent form submit
                     }*/
                    }
                }
            });

            /*
             // DEBUGGGGGGGGGGGGGGGGG:
             $(window).bind('mousewheel DOMMouseScroll', function(event){
             var escala;
             if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
             //scroll up
             escala = 1.1;
             }
             else {
             // scroll down
             escala = 0.9;
             }
             game.renderer.stage.scale.x *= escala;
             game.renderer.stage.scale.y *= escala;
             game.renderer.stage.x = ((game.renderer.stage.width * (1-game.renderer.stage.scale.x))/2);
             game.renderer.stage.y = ((game.renderer.stage.height * (1-game.renderer.stage.scale.y))/2);
             });*/

        },
    });

    return GameInputHandler;
});