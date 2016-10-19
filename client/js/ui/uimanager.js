/**
 * Created by horacio on 4/6/16.
 */
define(['enums', 'ui/loginui', 'ui/crearpjui', 'ui/game/gameui', 'ui/popups/mensaje', 'ui/introui'], function (Enums, LoginUI, CrearPjUI, GameUI, Mensaje, IntroUI) {

    class UIManager {
        constructor(assetManager) {
            this.assetManager = assetManager;
            this.mensaje = new Mensaje();
            this.introUI = new IntroUI();
            this.loginUI = new LoginUI();
            this.crearPjUI = new CrearPjUI(this.assetManager, this.mensaje);
            this.playSonidoClick = this._createPlaySonidoCallback();

            this.gameUI = null;

            //en px
            this.widthMenuJuego = 154;
            this.widthJuego = 17 * 32;
            this.heightJuego = 13 * 32;
            this.FOOTER_HEIGHT = 60;

            this.escala = null;
        }

        _createPlaySonidoCallback() {
            var self = this;
            var sonidoCb = function ($boton) {
                if (!$boton.hasClass('noClickSound')) {
                    self.assetManager.audio.playSound(Enums.SONIDOS.click);
                }
            };
            return sonidoCb;
        }

        center() {
            window.scrollTo(0, 1);
        }

        setLoginScreen() {
            var $body = $('body');
            $body.removeClass('jugar');
            $body.removeClass('crear');
            $body.addClass('login');
            this.loginUI.setPlayButtonState(true);
            this.loginUI.setCrearButtonState(true);
            if (this.gameUI) {
                this.gameUI.hideGamePopUps();
            }
        }

        setCrearPJScreen() {
            var $body = $('body');
            $body.removeClass('login');
            $body.removeClass('jugar');
            $body.addClass('crear');
        }

        setGameScreen() {
            var $body = $('body');
            $body.removeClass('login');
            $body.removeClass('crear');
            $body.addClass('jugar');
        }

        openPage(type, url) {

            var h = $(window).height(),
                w = $(window).width(),
                popupHeight,
                popupWidth,
                top,
                left;

            switch (type) {
                case 'twitter':
                    popupHeight = h * 2 / 3;
                    popupWidth = Math.min(580, w / 2);
                    break;
                case 'facebook':
                    popupHeight = h * 3 / 4;
                    popupWidth = Math.min(980, w / 1.5);
                    break;
            }

            top = (h / 2) - (popupHeight / 2);
            left = (w / 2) - (popupWidth / 2);

            let newwindow = window.open(url, 'name', 'height=' + popupHeight + ',width=' + popupWidth + ',top=' + top + ',left=' + left);
            if (window.focus) {
                newwindow.focus();
            }
        }

        initDOM() {
            this.resizeUi();

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

            document.addEventListener("touchstart", function () {
            }, false);

            var resizeCallback = this.resizeUi.bind(this);
            $(window).resize(_.throttle(function (event) {
                resizeCallback();
            }, 100));

            $("button").click(function (event) {
                self.playSonidoClick($(this));
            });
        }

        setFooterHiden(gameRatio, windowWidth, windowHeight) {

            windowHeight -= this.FOOTER_HEIGHT;
            let windowRatio = windowWidth / windowHeight;

            if (gameRatio * 0.8 > windowRatio) { // limita el width
                $('footer').show();
                return false;
            }
            if (windowHeight < 600) {
                $('footer').hide();
                return true;
            }
            $('footer').show();
            return false;

        }

        resizeUi() {
            let menuBorderWidth = parseInt($('#menuJuego').css("border-left-width")); // solo borde izq, los demas valen 0
            let containerBorderWidth = parseInt($('#container').css("border-left-width")); // 4 bordes iguales pero hay que pasar alguno para el ancho
            let gameWidth = this.widthMenuJuego + this.widthJuego + menuBorderWidth + containerBorderWidth * 2;
            let gameHeight = this.heightJuego + containerBorderWidth * 2;

            let gameRatio = gameWidth / gameHeight;

            let windowWidth = parseInt($(window).width()) - 10;
            let windowHeight = parseInt($(window).height()) - 30;
            let windowRatio = windowWidth / windowHeight;

            if (!this.setFooterHiden(gameRatio, windowWidth, windowHeight)) {
                windowHeight -= this.FOOTER_HEIGHT;
            }

            if (gameRatio > windowRatio) { // limita el width
                this.escala = windowWidth / gameWidth;
            } else {
                this.escala = windowHeight / gameHeight;
            }

            $('#container').width(Math.floor(this.escala * gameWidth));
            $('#container').height(Math.floor(this.escala * gameHeight));

            $('#chatbox input').css("font-size", Math.max(14,Math.floor(12 * this.escala)) + 'px');

            if (this.gameUI) {
                this.gameUI.resize(this.escala);
            }
        }

        hideIntro() {
            $('body').removeClass('intro');
            this.setLoginScreen();
        }

        inicializarGameUI(gameManager, storage /*SACAME!*/) {
            this.gameUI = new GameUI(gameManager, storage, this.playSonidoClick);
            return this.gameUI;
        }

        showMensaje(mensaje) {
            this.mensaje.show(mensaje);
        }

    }

    return UIManager;
});