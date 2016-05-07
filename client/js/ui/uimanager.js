/**
 * Created by horacio on 4/6/16.
 */
define(['ui/loginui','ui/crearpjui','ui/game/gameui', 'ui/popups/mensaje'], function (LoginUI,CrearPjUI, GameUI, Mensaje) {

    var UIManager = Class.extend({
        init: function (assetManager) {
            this.assetManager = assetManager;
            this.mensaje = new Mensaje();
            this.loginUI = new LoginUI();
            this.crearPjUI = new CrearPjUI(this.assetManager,this.mensaje);

            this.gameUI = null;
        },


        center: function () {
            window.scrollTo(0, 1);
        },

        setLoginScreen: function () {
            var $body = $('body');
            $body.removeClass('jugar');
            $body.removeClass('crear');
            $body.addClass('login');
            this.loginUI.setPlayButtonState(true);
            this.loginUI.setCrearButtonState(true);
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


        openPage: function (type, url) {
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

        initDOM: function () {
            var self = this;

            $('.clickable').click(function (event) {
                event.stopPropagation();
            });

            $('.twitter').click(function () {
                var url = $(this).attr('href');

                self.openPage('twitter', url);
                return false;
            });

            $('.facebook').click(function () {
                var url = $(this).attr('href');

                self.openPage('facebook', url);
                return false;
            });

            /*
             var data = self.storage.data;
             if (data.hasAlreadyPlayed) {
             if (data.player.name && data.player.name !== "") {
             $('#playername').html(data.player.name);
             $('#playerimage').attr('src', data.player.image);
             }
             }*/

            document.addEventListener("touchstart", function () {
            }, false);

            $(window).on('resize', self.resizeUi.bind(self));
            // $(window).on('resize', _.debounce(function () {// <--- todo
            //               self.resizeUi.bind(self)
            //           }, 500));



        },

        getEscala: function () {
            return $('#container').height() / 500;
        },

        resizeUi: function () {
            var escala = this.getEscala();
            $('#container').width(escala * 800);
            $('#chatbox input').css("font-size", Math.floor(12 * escala) + 'px');

            if (this.gameUI)
                this.gameUI.resize(escala);
        },

        hideIntro: function () { // TODO
            $('body').removeClass('intro');
            /*setTimeout(function () {
                $('body').addClass('login');
            }, 500);*/
            this.setLoginScreen();
        },

        inicializarGameUI: function (gameManager, storage /*SACAME!*/) {
            this.gameUI = new GameUI(gameManager,storage);
            return this.gameUI;
        },

        showMensaje: function (mensaje) {
            this.mensaje.show(mensaje);
        },

    });

    return UIManager;
});