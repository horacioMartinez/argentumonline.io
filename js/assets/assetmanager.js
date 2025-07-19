import jsonArmas from '../../indices/armas.json';
import jsonCabezas from '../../indices/cabezas.json';
import jsonCascos from '../../indices/cascos.json';
import jsonCuerpos from '../../indices/cuerpos.json';
import jsonEscudos from '../../indices/escudos.json';
import jsonFxs from '../../indices/fxs.json';
import * as PIXI from 'pixi.js';
import Preloader from './preloader.js';
import Audio from './audio.js';

class AssetManager {
            constructor() {
                this.audio = new Audio();

                this.indices = null; // cargados por el preloader
                this.armas = jsonArmas;
                this.cabezas = jsonCabezas;
                this.cascos = jsonCascos;
                this.cuerpos = jsonCuerpos;
                this.escudos = jsonEscudos;
                this.fxs = jsonFxs;
                this._baseTextures = [];

                this.grhs = [];
                this.dataMapas = [];
                this.preloader = new Preloader(this);
                
                // Configure PIXI settings for v7
                PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;
                PIXI.BaseTexture.defaultOptions.mipmap = PIXI.MIPMAP_MODES.OFF;
                PIXI.TextureGCSystem.defaultMode = PIXI.GC_MODES.MANUAL;
            }

            getNumGraficoFromGrh(grh) {
                if (!this.indices[grh]) {
                    return null;
                }
                if (this.indices[grh].grafico) {
                    return this.indices[grh].grafico;
                }
                // animacion, devuelvo grafico del primer frame
                return this.getNumGraficoFromGrh(this.indices[grh].frames[0]);
            }

            getFaceGrafFromNum(numHead) {
                if (!this.cabezas[numHead]) {
                    return;
                }
                var grh = this.cabezas[numHead].down;
                return this.getNumGraficoFromGrh(grh);
            }

            getBodyGrafFromNum(numCuerpo) {
                if (!this.cuerpos[numCuerpo]) {
                    return;
                }
                var grh = this.cuerpos[numCuerpo].down;
                return this.getNumGraficoFromGrh(grh);
            }

            getGrh(grh) {
                if (!this.grhs[grh]) {
                    this.loadGrh(grh);
                }
                return this.grhs[grh];
            }

            getTerrenoGrh(grh) {
                if (!this.grhs[grh]) {
                    this.loadGrh(grh);
                }
                var res = this.grhs[grh];

                return res;
            }

            loadGrh(grh) {
                if (!this.indices[grh] || this.grhs[grh]) {
                    return;
                }
                if (this.indices[grh].frames) {// animacion
                    var frameNumbers = this.indices[grh].frames;
                    var vecgrhs = [];
                    for (var j = 0; j < frameNumbers.length; j++) {
                        if (!this.grhs[frameNumbers[j]]) {
                            this._loadGrhGrafico(frameNumbers[j]);
                        }
                        vecgrhs.push(this.grhs[frameNumbers[j]]);
                    }
                    this.grhs[grh] = {frames: vecgrhs, velocidad: this.indices[grh].velocidad};
                }
                else { // no animacion
                    this._loadGrhGrafico(grh);
                }
            }

            _loadGrhGrafico(grh) {
                var nombreGrafico = this.indices[grh].grafico;
                if (!this._baseTextures[nombreGrafico]) { // cargar basetexture
                    this._setBaseTexture(nombreGrafico, PIXI.BaseTexture.from("graficos/" + nombreGrafico + ".png"));
                }
                this.grhs[grh] = new PIXI.Texture(this._baseTextures[nombreGrafico], new PIXI.Rectangle(this.indices[grh].offX, this.indices[grh].offY, this.indices[grh].width, this.indices[grh].height));
            }

            _setBaseTexture(nombreGrafico, baseTexture) {
                this._baseTextures[nombreGrafico] = baseTexture;
            }


            getMapaASync(numMapa, completeCallback) {
                if (!this.dataMapas[numMapa]) {
                    var self = this;
                    $.ajax({
                        type: 'GET',
                        url: "mapas/mapa" + numMapa + ".json",
                        dataType: 'json',
                        data: null
                    }).done(function (data) {
                        self.dataMapas[numMapa] = data;
                        completeCallback(self.dataMapas[numMapa]);
                    }).fail(function () {
                        alert("Error cargando mapa " + numMapa);
                        self.getMapaASync(numMapa, completeCallback);
                    });
                } else {
                    completeCallback(this.dataMapas[numMapa]);
                }
            }

            preload(terminar_callback, progress_callback) {
                this.preloader.preload(terminar_callback, progress_callback);
            }

            getIndices() {
                return this.indices;
            }

            getArmas() {
                return this.armas;
            }

            getCabezas() {
                return this.cabezas;
            }

            getCascos() {
                return this.cascos;
            }

            getCuerpos() {
                return this.cuerpos;
            }

            getEscudos() {
                return this.escudos;
            }

            getFxs() {
                return this.fxs;
            }
        }

export default AssetManager;