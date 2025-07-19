/**
 * Created by horacio on 3/22/16.
 */

import * as PIXI from 'pixi.js';
import PreloadSounds from '../../preload_config/preload_sounds.json';
import PreloadGraficos from '../../preload_config/preload_graficos.json';



        class Preloader {
            constructor(assetManager) {
                this.assetManager = assetManager;
            }

            _preloadSoundsAsync(){
                for (let sound of PreloadSounds) { //preload async, no necesariamente los termina de cargar antes de  empezar
                    this.assetManager.audio.cargarSonido(sound);
                }
            }


            async preload(terminar_callback, progress_callback) {

                // fonts: // OJO: si se usan web fonts sacar esto y el script del index
                WebFont.load({
                    custom: {
                        families: ['Myriad Pro:n4,n7,i4,i7']
                    }
                });

                //sounds:

                this._preloadSoundsAsync();

                // graficos:

                let self = this;
                
                // Add all assets to load
                const assetsToLoad = [];
                
                // Add indices
                assetsToLoad.push({ alias: "indices", src: "indices/graficos.json" });
                
                // Add graphics
                for (let grafico of PreloadGraficos) {
                    assetsToLoad.push({ alias: grafico.toString(), src: "graficos/" + grafico + ".png" });
                }
                
                // Add all assets to PIXI Assets system
                PIXI.Assets.add(assetsToLoad);
                
                // Track progress
                let loadedCount = 0;
                const totalCount = assetsToLoad.length;
                
                // Load all assets
                try {
                    // Load indices first
                    const indicesData = await PIXI.Assets.load("indices");
                    self.assetManager.indices = indicesData;
                    loadedCount++;
                    progress_callback((loadedCount / totalCount) * 100);
                    
                    // Load all graphics
                    for (let grafico of PreloadGraficos) {
                        const texture = await PIXI.Assets.load(grafico.toString());
                        self.assetManager._setBaseTexture(grafico, texture.baseTexture);
                        loadedCount++;
                        progress_callback((loadedCount / totalCount) * 100);
                    }
                    
                    terminar_callback();
                } catch (error) {
                    console.error('Error loading assets:', error);
                }
            }


        }

        
export default Preloader;