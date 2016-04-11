/**
 * Created by horacio on 4/6/16.
 */


define(['ui/game/keymouseinput'], function (KeyMouseInput/*SACAME*/) {
    var KeyMouseListener = Class.extend({

        init: function (game, acciones) {
            this.game = game; // todo: sacar de aca !?
            this.inputHandler = new KeyMouseInput(game, acciones);

            this._prevKeyDown = {};
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

        initListeners: function () {
            var self = this;
            var game = this.game;
            var inputHandler = this.inputHandler;

            $('#chatbox').attr('value', '');

            $('#gamecanvas').click(function (event) {
                // TODO: si haces click afuera del menu pop up que lo cierre?

                if (self.inGameMouseCoordinates(game, event)) {
                    inputHandler.click();
                }
            });

            $('#gamecanvas').dblclick(function (event) {
                // TODO: si haces click afuera del menu pop up que lo cierre?
                if (self.inGameMouseCoordinates(game, event)) {
                    inputHandler.doubleClick();
                }
            });

            $(document).keyup(function (e) {
                var key = e.which;
                self._upKey(e);
                inputHandler.keyUp(key);
            });

            $(document).keydown(function (e) {
                if (!game.started)
                    return;

                var key = e.which;

                if (inputHandler.isCaminarKey(key)) {
                    if (!self._isKeyDown(e)) {
                        inputHandler.keyDown(key);
                        self._downKey(e);
                    }
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
                    if (self._isKeyDown(e))
                        return;
                    self._downKey(e);
                    e.preventDefault();
                    inputHandler.keyDown(key);
                }
            });

            $('#chatinput').keydown(function (e) {

                var key = e.which;

                if (key === Enums.Keys.ENTER) {
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

                if (key === Enums.Keys.ESCAPE) {
                    self.hideChat();
                    return false;
                }
            });

            $(document).bind("keydown", function (e) {
                var key = e.which;

                if (key === Enums.Keys.ENTER) { // Enter
                    $chat = $('#chatinput');
                    if (game.started) {
                        $chat.focus();
                        return false;
                    }
                }
            });
        },

        _downKey: function (e) {
            var wh = e.which;
            var kC = e.keyCode;
            if (this._prevKeyDown[wh] == null) {
                this._prevKeyDown[wh] = {};
            }
            this._prevKeyDown[wh][kC] = true;
        },

        _upKey: function (event) {
            var wh = event.which;
            var kC = event.keyCode;

            if (this._prevKeyDown[wh] != null) {
                this._prevKeyDown[wh][kC] = null;
            }
        },

        _isKeyDown: function (event) {
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

    });

    return KeyMouseListener;
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