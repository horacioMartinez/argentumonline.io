define(['jquery', 'storage'], function ($, Storage) {

    var App = Class.extend({
        init: function () {
            this.isParchmentReady = true;
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

        tryStartingGame: function () {
            if (this.starting) return;        // Already loading

            var self = this;
            /*
             var action = this.createNewCharacterFormActive() ? 'create' : 'login';
             var username = this.getUsernameField().attr('value');
             var userpw = this.getPasswordField().attr('value');
             var email = '';
             var userpw2;

             if(action === 'create') {
             email = this.$email.attr('value');
             userpw2 = this.$pwinput2.attr('value');
             }

             if(!this.validateFormFields(username, userpw, userpw2, email)) return;

             this.setPlayButtonState(false);

             if(!this.ready || !this.canStartGame()) {
             var watchCanStart = setInterval(function() {
             log.debug("waiting...");
             if(self.canStartGame()) {
             clearInterval(watchCanStart);
             self.startGame(action, username, userpw, email);
             }
             }, 100);
             } else {
             this.startGame(action, username, userpw, email);
             }*/

            this.startGame('create', "a", "a", "a");
        },

        startGame: function (action, username, userpw, email) {
            var self = this;
            self.firstTimePlaying = !self.storage.hasAlreadyPlayed();

            if (username && !this.game.started) {
                var optionsSet = false,
                    config = this.config;

                //>>includeStart("devHost", pragmas.devHost);
                if (config.local) {
                    log.debug("Starting game with local dev config.");
                    this.game.setServerOptions(config.local.host, config.local.port, username, userpw, email);
                } else {
                    log.debug("Starting game with default dev config.");
                    this.game.setServerOptions(config.dev.host, config.dev.port, username, userpw, email);
                }
                optionsSet = true;
                //>>includeEnd("devHost");

                //>>includeStart("prodHost", pragmas.prodHost);
                if (!optionsSet) {
                    log.debug("Starting game with build config.");
                    this.game.setServerOptions(config.build.host, config.build.port, username, userpw, email);
                }
                //>>includeEnd("prodHost");

                if (!self.isDesktop) {
                    // On mobile and tablet we load the map after the player has clicked
                    // on the login/create button instead of loading it in a web worker.
                    // See initGame in main.js.
                    self.game.loadMap();
                }

                this.center();
                this.game.run(action, function (result) {
                    if (result.success === true) {
                        self.start();
                    } else {
                        self.setPlayButtonState(true);

                        switch (result.reason) {
                            case 'invalidlogin':
                                // Login information was not correct (either username or password)
                                self.addValidationError(null, 'The username or password you entered is incorrect.');
                                self.getUsernameField().focus();
                                break;
                            case 'userexists':
                                // Attempted to create a new user, but the username was taken
                                self.addValidationError(self.getUsernameField(), 'The username you entered is not available.');
                                break;
                            case 'invalidusername':
                                // The username contains characters that are not allowed (rejected by the sanitizer)
                                self.addValidationError(self.getUsernameField(), 'The username you entered contains invalid characters.');
                                break;
                            case 'loggedin':
                                // Attempted to log in with the same user multiple times simultaneously
                                self.addValidationError(self.getUsernameField(), 'A player with the specified username is already logged in.');
                                break;
                            default:
                                self.addValidationError(null, 'Failed to launch the game: ' + (result.reason ? result.reason : '(reason unknown)'));
                                break;
                        }
                    }
                });
            }
        },

        start: function () {
            this.hideIntro();
            $('body').addClass('started');
        },

        setPlayButtonState: function (enabled) {
            var self = this;
            var $playButton = this.getPlayButton();

            if (enabled) {
                this.starting = false;
                this.$play.removeClass('loading');
                $playButton.click(function () {
                    self.tryStartingGame();
                });
                if (this.playButtonRestoreText) {
                    $playButton.text(this.playButtonRestoreText);
                }
            } else {
                // Loading state
                this.starting = true;
                this.$play.addClass('loading');
                $playButton.unbind('click');
                this.playButtonRestoreText = $playButton.text();
                $playButton.text('Loading...');
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

        /**
         * Performs some basic validation on the login / create new character forms (required fields are filled
         * out, passwords match, email looks valid). Assumes either the login or the create new character form
         * is currently active.
         */
        validateFormFields: function (username, userpw, userpw2, email) {
            this.clearValidationErrors();

            if (!username) {
                this.addValidationError(this.getUsernameField(), 'Please enter a username.');
                return false;
            }

            if (!userpw) {
                this.addValidationError(this.getPasswordField(), 'Please enter a password.');
                return false;
            }

            if (this.createNewCharacterFormActive()) {     // In Create New Character form (rather than login form)
                if (!userpw2) {
                    this.addValidationError(this.$pwinput2, 'Please confirm your password by typing it again.');
                    return false;
                }

                if (userpw !== userpw2) {
                    this.addValidationError(this.$pwinput2, 'The passwords you entered do not match. Please make sure you typed the password correctly.');
                    return false;
                }

                // Email field is not required, but if it's filled out, then it should look like a valid email.
                if (email && !this.validateEmail(email)) {
                    this.addValidationError(this.$email, 'The email you entered appears to be invalid. Please enter a valid email (or leave the email blank).');
                    return false;
                }
            }

            return true;
        },

        validateEmail: function (email) {
            // Regex borrowed from http://stackoverflow.com/a/46181/393005
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },

        addValidationError: function (field, errorText) {
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
            clearInterval(this.watchNameInputInterval);
            $('body').removeClass('intro');
            setTimeout(function () {
                $('body').addClass('game');
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
