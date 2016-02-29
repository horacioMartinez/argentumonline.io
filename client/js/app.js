define(['jquery', 'storage', 'gameclient', 'crearpj'], function ($, Storage, GameClient, CrearPJ) {

    var App = Class.extend({
        init: function () {
            this.crearPJ = new CrearPJ();
            this.isParchmentReady = true;
            this.client = null;
            this.ready = false;
            this.storage = new Storage();

            if (localStorage && localStorage.data) {
                this.frontPage = 'loadcharacter';
            } else {
                this.frontPage = 'createcharacter';
            }
        },

        setGame: function (game) {
            this.game = game;
            this.client = new GameClient(this.game, this.host, this.port);
            this.game.client = this.client;

            this.isMobile = this.game.renderer.mobile;
            this.isTablet = this.game.renderer.tablet;
            this.isDesktop = !(this.isMobile || this.isTablet);
            this.supportsWorkers = !!window.Worker;
            this.ready = true;
        },

        center: function () {
            window.scrollTo(0, 1);
        },

        canStartGame: function () {
            if (this.isDesktop) {
                return (this.game && this.game.map && this.game.map.isLoaded);
            } else {
                return this.game;
            }
        },

        setCrearPJ: function () {
            this.crearPJ.inicializar();
            this.setCrearButtonState(false);
            this.client = new GameClient(this.game, this.host, this.port);
            var self = this;
            this.client.setDadosCallback(function (Fuerza, Agilidad, Inteligencia, Carisma, Constitucion) {
                self.crearPJ.updateDados(Fuerza, Agilidad, Inteligencia, Carisma, Constitucion);
            });
            this.client.intentarCrearPersonaje(function () {
                self.setCrearPJScreen();
                self.setCrearButtonState(true);
            });
            this.crearPJ.setBotonTirarDadosCallback(function () {
                self.client.sendThrowDices();
            });
            this.crearPJ.setBotonVolverCallback(function () {
                self.setLoginScreen();
            });
            this.crearPJ.setBotonCrearCallback(function (nombre, password, raza, genero, clase, cabeza, mail, ciudad) {
                self.startGame(true,nombre,password, raza, genero, clase, cabeza, mail, ciudad);
            });
        },

        tryStartingGame: function () {
            if (this.starting) return;        // Already loading

            var username = $('#loginNombre').val();
            var userpw = $('#loginContrasenia').val();
            if (!this.validarLogin(username, userpw)) return;

            this.setPlayButtonState(false);
            this.startGame(false,username, userpw);
        },

        startGame: function (newChar, username, userpw, raza, genero, clase, cabeza, mail, ciudad ) {
            this.firstTimePlaying = !this.storage.hasAlreadyPlayed();
            if (this.game.started)
                return;
            this.center();
            this.game.inicializar(username);
            var self = this;
            this.client.setLogeadoCallback( function(){
                self.game.start();
                self.setGameScreen();
                self.setPlayButtonState(true);
            });

            if (!newChar) {
                this.client.intentarLogear(username, userpw);
            }
            else {
                this.client.sendLoginNewChar(username, userpw, 0, 13, 0, raza, genero, clase, cabeza, mail, ciudad);
            }
        },

        start: function () {
            this.hideIntro();
            $('body').addClass('login');
        },

        //estas son las que van
        setLoginScreen: function () {
            var $body = $('body');
            $body.removeClass('jugar');
            $body.removeClass('crear');
            $body.addClass('login');
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

        getActiveForm: function () {
            if (this.loginFormActive()) return $('#loadcharacter');
            else if (this.createNewCharacterFormActive()) return $('#createcharacter');
            else return null;
        },

        loginFormActive: function () {
            return $('#parchment').hasClass("loadcharacter");
        },

        createNewCharacterFormActive: function () {
            return $('#parchment').hasClass("createcharacter");
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

        clearValidationErrors: function () {
            var fields = this.loginFormActive() ? this.loginFormFields : this.createNewCharacterFormFields;
            $.each(fields, function (i, field) {
                field.removeClass('field-error');
            });
            $('.validation-error').remove();
        },

        setMouseCoordinates: function (event) {
            var gamePos = $('#gamecanvas').offset(),
                scale = this.game.renderer.getScaleFactor(),
                width = this.game.renderer.getWidth(),
                height = this.game.renderer.getHeight(),
                mouse = this.game.mouse;

            mouse.x = event.pageX - gamePos.left - (this.isMobile ? 0 : 5 * scale);
            mouse.y = event.pageY - gamePos.top - (this.isMobile ? 0 : 7 * scale);

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
        //Init the hud that makes it show what creature you are mousing over and attacking
        initTargetHud: function () {
            var self = this;
            var scale = self.game.renderer.getScaleFactor(),
                healthMaxWidth = $("#inspector .health").width() - (12 * scale),
                timeout;
            /*
             this.game.player.onSetTarget(function(target, name, mouseover){
             var el = '#inspector';
             var sprite = target.sprite,
             x = ((sprite.animationData.idle_down.length-1)*sprite.width),
             y = ((sprite.animationData.idle_down.row)*sprite.height);
             $(el+' .name').text(name);

             //Show how much Health creature has left. Currently does not work. The reason health doesn't currently go down has to do with the lines below down to initExpBar...
             if(target.healthPoints){
             $(el+" .health").css('width', Math.round(target.healthPoints/target.maxHp*100)+'%');
             } else{
             $(el+" .health").css('width', '0%');
             }
             var level = Types.getMobLevel(Types.getKindFromString(name));
             if(level !== undefined) {
             $(el + ' .level').text("Level " + level);
             }
             else {
             $('#inspector .level').text('');
             }

             $(el).fadeIn('fast');
             });*/

            self.game.onUpdateTarget(function (target) {
                $("#inspector .health").css('width', Math.round(target.healthPoints / target.maxHp * 100) + "%");
            });

            /*self.game.player.onRemoveTarget(function(targetId){
             $('#inspector').fadeOut('fast');
             $('#inspector .level').text('');
             self.game.player.inspecting = null;
             });*/
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

        resizeUi: function () {
            __ESCALA__ = ( $('#container').height() / 500 );
            /* TODO unica funcion con estas cosas que tambien estan en main */
            $('#container').width(__ESCALA__ * 800);
            $('#chatbox input').css("font-size", Math.floor(12 * __ESCALA__) + 'px');

            if (this.game)
                this.game.resize();
        }
    });

    return App;
});
