define(['jquery', 'ui/loginscreen', 'ui/gamescreen', 'ui/crearpjscreen'],
    function ($, LoginScreen, GameScreen, CrearPjScreen) {

        var UIRenderer = Class.extend({
            init: function (game, context, loader) {
                this.game = game;
                this.loader = loader;
                this.currentScreen = null;
                this.graficosUI = this.loader.getUI();
                this.graficos = this.loader.getGraficos();
                this.uicontext = (context && context.getContext) ? context.getContext("2d") : null;
                this.uicanvas = context;

                this.CONSOLA_RECT = {x: 11, y: 37, w: 540, h: 100};
                this.LARGO_FONT = 12;

                this.rescale(); // TODO <-----------
                this.setFont();
            },

            renderFrame: function () {
                this.drawConsoleInfos();
            },



            drawConsoleInfos: function () {
                if (this.game.infoManager.consolaDirty) {
                    this.uicontext.clearRect(this.CONSOLA_RECT.x, this.CONSOLA_RECT.y, this.CONSOLA_RECT.w, this.CONSOLA_RECT.h);

                    var self = this;
                    this.game.infoManager.forEachConsoleInfo(function (info) {
                        if (info.valid) {
                            if (info.opacity < 1) {
                                self.uicontext.save();
                                self.uicontext.globalAlpha = info.opacity;
                            }
                            self.uicontext.fillText(info.value, info.x + self.CONSOLA_RECT.x, info.y + self.CONSOLA_RECT.y + 14); // sumar a y largo de letras

                            if (info.opacity < 1)
                                self.uicontext.restore();
                        }
                    });

                    this.game.infoManager.consolaDirty = false;
                }
            },

            setLoginScreen: function (conectarse_callback, crear_callback) {
                log.info("Creando login screen");
                if (this.currentScreen)
                    this.currentScreen.delete();
                this.currentScreen = new LoginScreen(conectarse_callback, crear_callback);
                this.drawCurrentScreen();
            },

            setCrearPjScreen: function (tirar_dados_callback, crear_callback, volver_callback) {
                log.info("Creando crearPj screen");
                if (this.currentScreen)
                    this.currentScreen.delete();
                this.currentScreen = new CrearPjScreen(tirar_dados_callback, crear_callback, volver_callback);
                this.drawCurrentScreen();
            },

            setGameScreen: function () {
                log.info("Creando game screen");
                log.error("AAAAAAAAAAAAAAAAAAAA");
                var self = this;
                if (this.currentScreen)
                    this.currentScreen.delete();
                this.currentScreen = new GameScreen(this.drawInventario.bind(this), this.drawHechizos.bind(this), function () {
                    log.error(self.currentScreen.hechizos.getSelectedSlot());
                    log.error(self.currentScreen.hechizos.getSelectedText);
                });
                this.drawCurrentScreen();
                this.setearSlotsHechizos();
            },

            drawCurrentScreen: function(){
                this.clearCanvas();
                if (this.currentScreen instanceof LoginScreen) {
                    this.uicontext.drawImage(this.graficosUI.login, 0, 0);
                }
                else if (this.currentScreen instanceof CrearPjScreen) {
                    this.uicontext.drawImage(this.graficosUI.crearpj, 0, 0);
                }
                else if (this.currentScreen instanceof GameScreen){
                    this.uicontext.drawImage(this.graficosUI.interfaz, 0, 0);
                    this.drawBarras();
                    this.drawInventario();
                    this.drawSlotsInventario();
                }
            },

            drawDados: function (Fuerza, Agilidad, Inteligencia, Carisma, Constitucion) {
                if (!(this.currentScreen instanceof CrearPjScreen)) {
                    log.error("lanzar dados fuera de crear pj screen!");
                    return;
                }
                this.drawCurrentScreen();
                this.uicontext.fillStyle = "white";
                var xDados= 300;
                this.uicontext.fillText(Fuerza, xDados, 195);
                this.uicontext.fillText(Agilidad, xDados, 218);
                this.uicontext.fillText(Inteligencia, xDados, 241);
                this.uicontext.fillText(Carisma, xDados, 264);
                this.uicontext.fillText(Constitucion, xDados, 287);
            },

            setFont: function () {
                var tamFont = (this.LARGO_FONT);// * __ESCALA__); no va por escala ya que los canvas se dibujan siempre del mismo tamaño y se agrandan con setscale
                this.uicontext.font = "bold " + tamFont + "px Arial";
            },


            drawGrh: function (grh, x, y) {

                if (grh === 0)
                    return;

                var numGrafico = this.game.indices[grh].grafico;
                if (!this.graficos[numGrafico].loaded)
                    return;

                var grafico = this.graficos[numGrafico].imagen;
                var sx = this.game.indices[grh].offX;
                var sy = this.game.indices[grh].offY;
                var w = this.game.indices[grh].width;
                var h = this.game.indices[grh].height;

                this.uicontext.fillStyle = "black";
                this.uicontext.fillRect(x, y, w, h); // borro anterior
                this.uicontext.drawImage(grafico, sx, sy, w, h, x, y, w, h);
            },

            _drawSlot: function (boxX, boxY, slot, cantSlotsPorFila, grh, cantidad, Equiped) {
                var tamSlot = 32,
                    x = boxX + ( (slot - 1) % cantSlotsPorFila) * tamSlot,
                    y = boxY + (((slot - 1) / cantSlotsPorFila ) | 0) * tamSlot;
                this.uicontext.clearRect(x,y, tamSlot, tamSlot);
                if (grh) {
                    this.drawGrh(grh, x, y);
                    this.uicontext.fillStyle = "white";
                    var fontY = y + this.LARGO_FONT / 2;
                    this.uicontext.fillText(cantidad, x, fontY);
                    if (Equiped) {
                        this.uicontext.fillStyle = "red";
                        var eX = x + (tamSlot - this.LARGO_FONT);
                        var eY = y + tamSlot;
                        this.uicontext.fillText("E", eX, eY);
                    }
                }
                log.info("draw slot inventario");
            },

            dibujarSlotInventario: function (Slot, GrhIndex, Amount, Equiped) {
                this._drawSlot(600, 55, Slot, 5, GrhIndex, Amount, Equiped);
            },

            modificarSlotHechizos: function (slot, nombre) {
                this.currentScreen.hechizos.modificarSlot(slot, nombre);
            },

            setearSlotsHechizos: function () {
                for (var i = 0; i < this.game.hechizos.length; i++) {
                    if (this.game.hechizos[i])
                        this.modificarSlotHechizos(i, this.game.hechizos[i].nombre);
                }
            },

            drawSlotsInventario: function () {
                for (var i = 0; i < this.game.inventario.length; i++) {
                    if (this.game.inventario[i])
                        this.dibujarSlotInventario(i, this.game.inventario[i].grh, this.game.inventario[i].cantidad, this.game.inventario[i].equipado);
                }
            },

            _drawBarra: function (grafico, x, y, porcentaje, llenarFondoNegro) {
                var w = grafico.width;
                var h = grafico.height;
                if (llenarFondoNegro) {
                    this.uicontext.fillStyle = "black";
                    this.uicontext.fillRect(x, y, w, h);
                }
                w = w * (porcentaje / 100);
                this.uicontext.drawImage(grafico, 0, 0, w, h, x, y, w, h);
            },

            drawBarras: function () {
                this._drawBarra(this.graficosUI.barraexp, 27, 463, 20);
                var porcentaje = 80;
                this._drawBarra(this.graficosUI.barraEnergia, 584, 343, porcentaje, true);
                this._drawBarra(this.graficosUI.barraMana, 584, 366, porcentaje, true);
                this._drawBarra(this.graficosUI.barraVida, 584, 389, porcentaje, true);
                this._drawBarra(this.graficosUI.barraHambre, 584, 411, porcentaje, true);
                this._drawBarra(this.graficosUI.barraSed, 584, 432, porcentaje, true);
            },

            drawInventario: function () {
                this.currentScreen.hechizos.hide();
                this.currentScreen.botonLanzar.hide();
                this.currentScreen.botonInfo.hide();
                this.currentScreen.inventario.show();
                this.uicontext.drawImage(this.graficosUI.centroInventario, 581, 14);
                this.drawSlotsInventario();
            },

            drawHechizos: function () {
                this.currentScreen.inventario.hide();
                this.currentScreen.botonLanzar.show();
                this.currentScreen.botonInfo.show();
                this.currentScreen.hechizos.show();
                this.uicontext.drawImage(this.graficosUI.centroHechizos, 581, 14);
            },

            clearCanvas: function () {
                this.uicontext.clearRect(0, 0, this.uicanvas.width, this.uicanvas.height);
            },

            getWidth: function () {
                return this.uicanvas.width;
            },

            getHeight: function () {
                return this.uicanvas.height;
            },

            rescale: function () {
                log.error("escala UIrenderer seteada a: " + __ESCALA__);
                this.uicanvas.width = 800 * __ESCALA__;
                this.uicanvas.height = 500 * __ESCALA__;
                this.uicontext.scale(__ESCALA__, __ESCALA__);
                log.debug("#UIcanvas set to " + this.uicanvas.width + " x " + this.uicanvas.height);
            },
        });

        return UIRenderer;
    });

/* BOTONES EN CSS::

 var botonLogin = $('<button/>').attr({ id:'botonlogear'});
 $(botonLogin).css({position:"absolute",left:"10px",top:"150px", 'background-image': 'url(' + "graficos/ui/BotonConectarse.jpg" + ')', display: inline-block});
 $(botonLogin).appendTo('#container');
 $(botonLogin).click(function () {
 $(botonLogin).attr({src:'graficos/ui/BotonConectarseClick.jpg'});
 log.error("apreto boton! "+$(nombreInput).val()+ " pw: " + $(passwordInput).val());
 });
 */