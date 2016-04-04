define(['jquery', 'storage', 'gameclient', 'crearpj', 'ui/uimanager'], function ($, Storage, GameClient, CrearPJ, UIManager) {

    var App = Class.extend({
        init: function () {
            this.crearPJ = new CrearPJ();
            this.isParchmentReady = true;
            this.client = null;
            this.uiManager = null;
            this.ready = false;
            this.storage = new Storage();
        },

        _initCallbacks: function (client) {
            var self = this;

            client.setDisconnectCallback(function () {
                self.setLoginScreen();
                var r = self.game.renderer;
                r.clean(self.getEscala());
                self.game.init(self,self.game.assetManager);
                self.game.setup(self.client, self.uiManager,r);
                self.game.started = false;
            });

            client.setLogeadoCallback(function () {
                self.game.start();
                self.setGameScreen();
            });

            client.setDadosCallback(function (Fuerza, Agilidad, Inteligencia, Carisma, Constitucion) {
                self.crearPJ.updateDados(Fuerza, Agilidad, Inteligencia, Carisma, Constitucion);
            });

            this.crearPJ.setBotonTirarDadosCallback(function () {
                self.client.sendThrowDices();
            });
            this.crearPJ.setBotonVolverCallback(function () {
                self.setLoginScreen();
            });
            this.crearPJ.setBotonCrearCallback(function (nombre, password, raza, genero, clase, cabeza, mail, ciudad) {
                self.startGame(true, nombre, password, raza, genero, clase, cabeza, mail, ciudad);
            });
        },

        setGame: function (game) {
            this.game = game;
            this.uiManager = new UIManager(this.game);
            this.client = new GameClient(this.game,this.uiManager, this.host, this.port);
            this._initCallbacks(this.client);

            this.game.setup(this.client, this.uiManager);
            this.ready = true;
        },

        center: function () {
            window.scrollTo(0, 1);
        },

        setCrearPJ: function () {
            this.crearPJ.inicializar();
            this.setCrearButtonState(false);
            var self = this;

            this.client.intentarCrearPersonaje(function () {
                self.setCrearPJScreen();
                self.setCrearButtonState(true);
            });
        },

        tryStartingGame: function () {
            if (this.starting) return;        // Already loading

            var username = $('#loginNombre').val();
            var userpw = $('#loginContrasenia').val();
            if (!this.validarLogin(username, userpw)) return;

            this.setPlayButtonState(false);
            this.startGame(false, username, userpw);
        },

        startGame: function (newChar, username, userpw, raza, genero, clase, cabeza, mail, ciudad) {
            this.firstTimePlaying = !this.storage.hasAlreadyPlayed();
            if (this.game.started)
                return;
            //this.center();
            this.game.inicializar(username);
            if (!newChar) {
                this.client.intentarLogear(username, userpw);
            }
            else {
                this.client.sendLoginNewChar(username, userpw, raza, genero, clase, cabeza, mail, ciudad);
            }
        },

        start: function () {
            this.hideIntro();
            $('body').addClass('login');
        },

        setLoginScreen: function () {
            var $body = $('body');
            $body.removeClass('jugar');
            $body.removeClass('crear');
            $body.addClass('login');
            this.setPlayButtonState(true);
            this.setCrearButtonState(true);
        },

        setCrearPJScreen: function () {
            var $body = $('body');
            $body.removeClass('login');
            $body.removeClass('jugar');
            $body.addClass('crear');
        },

        setGameScreen: function () {
            var $body = $('body');
            $body.removeClass('login');
            $body.removeClass('crear');
            $body.addClass('jugar');
        },

        setPlayButtonState: function (enabled) {
            var $playButton = $('#botonJugar');

            if (enabled) {
                this.starting = false;
                $playButton.prop('disabled', false);
            } else {
                // Loading state
                this.starting = true;
                $playButton.prop('disabled', true);
            }
        },

        setCrearButtonState: function (enabled) {
            var $crearButton = $('#botonCrearPJ');

            if (enabled) {
                $crearButton.prop('disabled', false);
            } else {
                $crearButton.prop('disabled', true);
            }
        },


        validarLogin: function (username, userpw) {
            //this.clearValidationErrors(); // TODO: mostrar errores al logear (tambien los que devuelve el game)
            if (!username) {
                //this.addValidationError(this.getUsernameField(), 'Please enter a username.');
                return false;
            }

            if (!userpw) {
                //this.addValidationError(this.getPasswordField(), 'Please enter a password.');
                return false;
            }

            return true;
        },

        addValidationError: function (field, errorText) { // TODO <- algo parecido! y ver crear pj, hacer checkeo en esta clase?
            $('<span/>', {
                'class': 'validation-error blink',
                text: errorText
            }).appendTo('.validation-summary');

            if (field) {
                field.addClass('field-error').select();
                field.bind('keypress', function (event) {
                    field.removeClass('field-error');
                    $('.validation-error').remove();
                    $(this).unbind(event);
                });
            }
        },

        setMouseCoordinates: function (event) {

            var gamePos = $('#gamecanvas').offset(),
                width = this.game.renderer.pixiRenderer.width,
                height = this.game.renderer.pixiRenderer.height,
                mouse = this.game.mouse;

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

        hideIntro: function () {
            $('body').removeClass('intro');
            setTimeout(function () {
                $('body').addClass('login');
            }, 500);
        },

        showChat: function () {
            if (this.game.started) {
                $('#chatbox').addClass('active');
                $('#chatinput').focus();
                $('#chatbutton').addClass('active');
            }
        },

        hideChat: function () {
            if (this.game.started) {
                $('#chatbox').removeClass('active');
                $('#chatinput').blur();
                $('#chatbutton').removeClass('active');
            }
        },

        openPopup: function (type, url) {
            var h = $(window).height(),
                w = $(window).width(),
                popupHeight,
                popupWidth,
                top,
                left;

            switch (type) {
                case 'twitter':
                    popupHeight = 450;
                    popupWidth = 550;
                    break;
                case 'facebook':
                    popupHeight = 400;
                    popupWidth = 580;
                    break;
            }

            top = (h / 2) - (popupHeight / 2);
            left = (w / 2) - (popupWidth / 2);

            newwindow = window.open(url, 'name', 'height=' + popupHeight + ',width=' + popupWidth + ',top=' + top + ',left=' + left);
            if (window.focus) {
                newwindow.focus()
            }
        },

        getEscala: function () {
            return $('#container').height() / 500;
        },

        resizeUi: function () {
            var escala = this.getEscala();
            $('#container').width(escala * 800);
            $('#chatbox input').css("font-size", Math.floor(12 * escala) + 'px');

            if (this.game)
                this.game.resize(escala);
        }
    });

    return App;
});
