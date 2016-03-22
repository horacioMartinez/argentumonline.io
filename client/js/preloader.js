/**
 * Created by horacio on 3/22/16.
 */

define(['lib/howler', 'lib/pixi'],
    function (__howler__, PIXI) {

        var Preloader = Class.extend({
            init: function (assetManager) {
                this.assetManager = assetManager;
                this.PRELOAD_GRHS = [];
            },

            _loadSounds: function () {
                for (var i = 1; i < 212; i++) { // <-- todo numero hardcodeado!
                    if (!this.assetManager.sounds[i]) {
                        this.assetManager.sounds[i] = new Howl({
                            urls: ['audio/sonidos/' + i + '.m4a']
                        })
                    }
                }

                log.info("Sonidos cargados!");
            },

            _copiarBaseTextures: function (resources, baseTextures) {
                for (var res in resources) {
                    baseTextures[parseInt(res)] = resources[parseInt(res)].texture.baseTexture;
                }
            },

            _agregarPreloadGraficos: function (loader, indices) {
                var graficos = [];
                for (var i = 0; i < this.PRELOAD_GRHS.length; i++) {
                    var grh = this.PRELOAD_GRHS[i];
                    if (!indices[grh].grafico) { // animacion
                        continue;
                    }
                    var numGrafico = indices[grh].grafico;
                    if (graficos[numGrafico]) { // ya puesto a cargar
                        continue;
                    }
                    graficos[numGrafico] = 1;
                    loader.add(numGrafico + "", "graficos/" + numGrafico + ".png");
                }
            },

            _loadMapas: function () {
                var maxMapa = 312;
                for (var i = 1; i <= maxMapa; i++) {
                    $.getJSON("mapas/mapa" + i + ".json")/*.success(function(data){
                     log.error("un mapa cargado");
                     })*/;
                }
            },

            _initGrhsPreload: function () {
                for (var i = 0; i < this.PRELOAD_GRHS.length; i++) {
                    this.assetManager.loadGrh(this.PRELOAD_GRHS[i]);
                }
            },

            _loadGrhs: function (terminar_callback) {
                if (!this.PRELOAD_GRHS.length)
                    return false;

                var loader = PIXI.loader;
                this._agregarPreloadGraficos(loader, this.assetManager.indices);

                loader.on('progress', function (loader, loadedResource) {
                    console.log('Progress:', loader.progress + '%');
                });

                var self = this;
                loader.load(function (loader, resources) {
                    self._copiarBaseTextures(PIXI.loader.resources, self.assetManager._baseTextures);
                    self._initGrhsPreload();
                    PIXI.loader.reset();
                    self.PRELOAD_GRHS = null;
                    terminar_callback();
                });

                return true;
            },

            preloadAll: function (terminar_callback) {
                //this._loadMapas();
                //this._loadSounds();
                if (!this._loadGrhs(terminar_callback))
                    terminar_callback();
            },
        });

        return Preloader;
    });
