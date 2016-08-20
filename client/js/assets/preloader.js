/**
 * Created by horacio on 3/22/16.
 */

define(['lib/pixi', 'json!../../preload_config/preload_sounds.json','json!../../preload_config/preload_graficos.json'],
    function (PIXI, PreloadSounds, PreloadGraficos) {

        class Preloader {
            constructor(assetManager) {
                this.assetManager = assetManager;
                this.loader = PIXI.loader;
            }

            _preloadSoundsAsync(){
                for (let sound of PreloadSounds) { //preload async, no necesariamente los termina de cargar antes de  empezar
                    this.assetManager.audio.cargarSonido(sound);
                }
            }


            preload(terminar_callback, progress_callback) {
                this._preloadSoundsAsync();

                let self = this;
                let loader = this.loader;

                loader.add("indices", "indices/graficos.json");

                for (let grafico of PreloadGraficos) {
                    loader.add(grafico, "graficos/" + grafico + ".png");
                }

                loader.on('progress', function (loader, loadedResource) {
                    progress_callback(loader.progress);
                });

                loader.load(function (loader, resources) {
                    for (let grafico of PreloadGraficos){
                        self.assetManager._setBaseTexture(grafico,PIXI.loader.resources[grafico].texture.baseTexture);
                    }
                    self.assetManager.indices = resources.indices.data;
                    terminar_callback();
                });
            }


        }

        return Preloader;
    });


// _agregarPreloadGrhs(loader, indices) {
//     var graficos = [];
//     for (var i = 0; i < this.PRELOAD_GRHS.length; i++) {
//         var grh = this.PRELOAD_GRHS[i];
//         if (!indices[grh].grafico) { // animacion
//             continue;
//         }
//         var numGrafico = indices[grh].grafico;
//         if (graficos[numGrafico]) { // ya puesto a cargar
//             continue;
//         }
//         graficos[numGrafico] = 1;
//         loader.add(numGrafico + "", "graficos/" + numGrafico + ".png");
//     }
// }
//
// _agregarPreloadMapas(loader) { // TODO: comprimir los mapas con http://pieroxy.net/blog/pages/lz-string/index.html y guardarlos en el local storage ??
//     for (var i = 0; i < this.PRELOAD_MAPAS.length; i++) {
//         loader.add("mapa" + this.PRELOAD_MAPAS[i], "mapas/mapa" + this.PRELOAD_MAPAS[i] + ".json");
//     }
// }
//
// _initGrhsPreload() {
//     for (var i = 0; i < this.PRELOAD_GRHS.length; i++) {
//         this.assetManager.loadGrh(this.PRELOAD_GRHS[i]);
//     }
// }
//
// _onGrhsLoaded() {
//     this._initGrhsPreload();
// }
//
// preloadAll(terminar_callback) {
//     var maxMapa = 312;
//     var i;
//     for (i = 1; i <= maxMapa; i++) {
//         this.PRELOAD_MAPAS.push(i);
//     }
//     for (i = 0; i < this.assetManager.indices.length; i++) {
//         if (this.assetManager.indices[i]) {
//             this.PRELOAD_GRHS.push(i);
//         }
//     }
//     this.preload(terminar_callback);
// }