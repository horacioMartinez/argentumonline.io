define(['game', 'view/renderer', 'storage', 'network/gameclient'], function (Game, Renderer, Storage, GameClient) {

    var App = Class.extend({
        init: function (assetManager, uiManager) {
            this.assetManager = assetManager;
            this.uiManager = uiManager;
            this.client = null;
            this.ready = false;
            this.storage = new Storage();
        },

        _initLoginCallbacks: function(){
            var self = this;
            this.uiManager.loginUI.setBotonJugarCallback( function() {
                self.tryStartingGame();
            });
            this.uiManager.loginUI.setBotonCrearCallback( function() {
                self.setCrearPJ();
            });
        },

        _initCrearPjCallbacks: function(){
            var self = this;
            this.uiManager.crearPjUI.setBotonTirarDadosCallback(function () {
                self.client.sendThrowDices();
            });
            this.uiManager.crearPjUI.setBotonVolverCallback(function () {
                self.uiManager.setLoginScreen();
            });
            this.uiManager.crearPjUI.setBotonCrearCallback(function (nombre, password, raza, genero, clase, cabeza, mail, ciudad) {
                self.startGame(true, nombre, password, raza, genero, clase, cabeza, mail, ciudad);
            });
        },

        _initClientCallbacks: function (client) {
            var self = this;

            client.setDisconnectCallback(function () {
                self.uiManager.setLoginScreen();
                var r = self.game.renderer;
                r.clean(self.uiManager.getEscala());
                var ui = self.game.gameUI;
                self.game.init(self.game.assetManager);
                self.game.setup(self.client,ui,r);
                self.game.started = false;
            });

            client.setLogeadoCallback(function () {
                self.game.start();
                self.uiManager.setGameScreen();
                self.starting = false;
            });

            client.setDadosCallback(function (Fuerza, Agilidad, Inteligencia, Carisma, Constitucion) {
                self.uiManager.crearPjUI.updateDados(Fuerza, Agilidad, Inteligencia, Carisma, Constitucion);
            });

        },

        inicializarGame: function () {
            this.game = new Game(this.assetManager);
            var gameUI = this.uiManager.inicializarGameUI(this.game);
            this.client = new GameClient(this.game,this.uiManager,gameUI, this.host, this.port);
            this._initClientCallbacks(this.client);
            var renderer = new Renderer(this.assetManager, this.uiManager.getEscala());
            this.game.setup(this.client, gameUI,renderer);
            this.ready = true;
        },

        setCrearPJ: function () {
            this.uiManager.crearPjUI.inicializar();
            this.uiManager.loginUI.setCrearButtonState(false);
            var self = this;

            this.client.intentarCrearPersonaje(function () {
                self.uiManager.setCrearPJScreen();
                self.uiManager.loginUI.setCrearButtonState(true);
            });
        },

        tryStartingGame: function () {
            if (this.starting) return;

            log.info(" Trying to start game...");

            var username = this.uiManager.loginUI.getUsername();
            var userpw = this.uiManager.loginUI.getPassword();
            if (!this.validarLogin(username, userpw))
                return;

            this.starting = true;
            this.uiManager.loginUI.setPlayButtonState(false);
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
            this._initLoginCallbacks();
            this._initCrearPjCallbacks();
            this.uiManager.hideIntro();
            this.inicializarGame();

            log.info("App initialized.");
        },

        validarLogin: function (username, userpw) {
            if (!username) {
                this.uiManager.showMensaje("Debes ingresar un usuario");
                return false;
            }

            if (!userpw) {
                this.uiManager.showMensaje("Debes ingresar un password");
                return false;
            }

            return true;
        },

    });
    return App;
});
