/**
 * Created by horacio on 4/6/16.
 **/

define(['ui/game/keymouseinput'], function (KeyMouseInput) {
    class KeyMouseListener {

        constructor(game, acciones, keys, comandosChat) {
            this.game = game; // todo: sacar de aca !?
            this.inputHandler = new KeyMouseInput(game, acciones);
            this.setKeys(keys);
            this.comandosChat = comandosChat;

            this._prevKeyDown = [];
            this.$gameCanvas = $('#gamecanvas');

            this.talkingToClan = false;
        }

        setKeys(keys) {
            this.keys = keys;
            this.inputHandler.setKeys(keys);
        }

        showChat() {
            $('#chatbox').addClass('active');
            $('#chatinput').focus();
        }

        hideChat() {
            $('#chatbox').removeClass('active');
            $('#chatinput').blur();
        }

        updateGameMouseCoordinates(game, event, $gameCanvas) {

            var gamePos = $gameCanvas.offset(),
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
        }

        upKeyTeclasCaminar() {
            var teclasCaminar = this.inputHandler.getTeclasCaminar();
            var self = this;
            _.each(teclasCaminar, function (key) {
                self._upKey(key);
                self.inputHandler.keyUp(key);
            });
        }

        initListeners() {
            var self = this;
            $('#chatbox').attr('value', '');
            this._initMouseListeners();
            this._initDocumentKeysListeners();
            this._initChatKeyListener();
        }

        _initDocumentKeysListeners() {
            var self = this;

            $(document).keyup(function (e) {
                var key = e.which;
                self._upKey(key);
                self.inputHandler.keyUp(key);
            });

            $(document).keydown(function (e) {
                if (!self.game.started) {
                    return;
                }

                var key = e.which;

                if (self.inputHandler.isCaminarKey(key)) {
                    if (!self._isKeyDown(key)) {
                        self.inputHandler.keyDown(key);
                        self._downKey(key);
                    }
                    if (!self.game.gameUI.hayPopUpActivo()) { // si hay un popup abierto dejar que siga la tecla al pop up, sino no
                        return false;
                    }
                    else {
                        return;
                    }
                }

                if (self.game.isPaused || (self.game.gameUI.hayPopUpActivo())) {
                    return;
                }

                // lo de abajo se ejecuta solo si no hay un pop up abierto

                var $chatb = $('#chatbox');

                if (key === self.keys.chat) {
                    if ($chatb.hasClass('active')) {
                        self._trySendingChat();
                        self.hideChat();
                    } else {
                        self.showChat();
                    }
                }

                if (key === self.keys.chatClan) {
                    if ($chatb.hasClass('active')) {
                        if (self.talkingToClan) {
                            self._trySendingChat();
                            self.hideChat();
                        }
                    } else {
                        self.talkingToClan = true;
                        self.showChat();
                    }
                }

                if (!$chatb.hasClass('active')) {
                    if (self._isKeyDown(key)) {
                        return false;
                    }
                    self._downKey(key);

                    return self.inputHandler.keyDown(key); // << return false previene el default y hace que no se propague mas
                    // TODO: hacer algo como lo anterior para los popUps, por ejemplo si tenes configurado el F5 en meditar prevenir que se recargue la pagina (lo hace devolviendo false)
                    //TODO?: directamente desactivar todos los Fs, asi se evita que apretes uno sin querer?
                }
            });

        }

        _trySendingChat() {
            var $chat = $('#chatinput');
            if ($chat.attr('value') !== '') {
                if (this.game.player) {
                    var chat = $chat.val();

                    if (this.talkingToClan) {
                        this.game.client.sendGuildMessage(chat);
                        this.talkingToClan = false;
                    } else {
                        var res = this.comandosChat.parsearChat(chat);
                        if (res) {
                            this.game.client.sendTalk(res);
                        }
                    }
                }
                $chat.val('');
            }
        }

        _initChatKeyListener() {
            var self = this;

            $('#chatinput').keydown(function (e) {

                var key = e.which;

                if (key === self.keys.chat) {
                    self._trySendingChat();
                    self.hideChat();
                    return false;
                }

                if (key === self.keys.cerrar) {
                    self.hideChat();
                    return false;
                }

            });
        }

        _initMouseListeners() {

            var self = this;

            self.$gameCanvas.click(function (event) {
                // TODO: si haces click afuera del menu pop up que lo cierre?

                if (self.updateGameMouseCoordinates(self.game, event, self.$gameCanvas)) {
                    self.inputHandler.click();
                }
            });

            self.$gameCanvas.dblclick(function (event) {
                // TODO: si haces click afuera del menu pop up que lo cierre?
                if (self.updateGameMouseCoordinates(self.game, event, self.$gameCanvas)) {
                    self.inputHandler.doubleClick();
                }
            });

            self.$gameCanvas.mousemove(_.debounce(function (event) {
                self.updateGameMouseCoordinates(self.game, event, self.$gameCanvas);
            }, 50));

            // DEBUG:
            /*
             $(window).bind('mousewheel DOMMouseScroll', function (event) {
             var escala;
             if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
             //scroll up
             escala = 1.1;
             }
             else {
             // scroll down
             escala = 0.9;
             }
             self.game.renderer.stage.scale.x *= escala;
             self.game.renderer.stage.scale.y *= escala;
             self.game.renderer.stage.x = ((self.game.renderer.stage.width * (1 - self.game.renderer.stage.scale.x)) / 2);
             self.game.renderer.stage.y = ((self.game.renderer.stage.height * (1 - self.game.renderer.stage.scale.y)) / 2);
             });*/

        }

        _downKey(key) {
            this._prevKeyDown[key] = true;
        }

        _upKey(key) {
            this._prevKeyDown[key] = null;
        }

        _isKeyDown(key) {
            if (this._prevKeyDown[key]) {
                return true;
            }
            return false;
        }

    }

    return KeyMouseListener;
});