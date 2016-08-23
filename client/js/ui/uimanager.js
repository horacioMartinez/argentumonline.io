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

            this.escala = null;
            this.resizeUi();
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
                newwindow.focus();
            }
        }

        initDOM() {
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

        resizeUi() {
            let menuBorderWidth = parseInt($('#menuJuego').css("border-left-width")); // solo borde izq, los demas valen 0
            let containerBorderWidth = parseInt($('#container').css("border-left-width")); // 4 bordes iguales pero hay que pasar alguno para el ancho
            let gameWidth = this.widthMenuJuego + this.widthJuego + menuBorderWidth + containerBorderWidth * 2;
            let gameHeight = this.heightJuego + containerBorderWidth * 2;

            let gameRatio = gameWidth / gameHeight;

            let windowWidth = parseInt($(window).width())- 10;
            let windowHeight = parseInt($(window).height()) - 90; // footer
            let windowRatio = windowWidth / windowHeight;

            if (gameRatio > windowRatio) { // limita el width
                this.escala = windowWidth / gameWidth;
            } else {
                this.escala = windowHeight / gameHeight;
            }
            
            $('#container').width(Math.floor(this.escala * gameWidth));
            $('#container').height(Math.floor(this.escala * gameHeight));

            $('#chatbox input').css("font-size", Math.floor(12 * this.escala) + 'px');

            if (this.gameUI) {
                this.gameUI.resize(this.escala);
            }
        }

        hideIntro() { // TODO
            $('body').removeClass('intro');
            /*setTimeout(function () {
             $('body').addClass('login');
             }, 500);*/
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