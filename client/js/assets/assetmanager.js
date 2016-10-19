define(['json!../../indices/armas.json',
        'json!../../indices/cabezas.json',
        'json!../../indices/cascos.json',
        'json!../../indices/cuerpos.json',
        'json!../../indices/escudos.json',
        'json!../../indices/fxs.json',
        'lib/pixi', 'assets/preloader', 'assets/audio'],
    function (jsonArmas, jsonCabezas, jsonCascos, jsonCuerpos, jsonEscudos, jsonFxs, PIXI, Preloader, Audio) {

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
                
                PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
                PIXI.MIPMAP_TEXTURES = false;
                PIXI.GC_MODES.DEFAULT = PIXI.GC_MODES.MANUAL;
            }

            getNumCssGraficoFromGrh(grh) {
                if (!this.indices[grh]) {
                    return null;
                }
                if (this.indices[grh].css) {
                    return this.indices[grh].css;
                }
                // animacion, devuelvo grafico del primer frame
                return this.getNumCssGraficoFromGrh(this.indices[grh].frames[0]);
            }

            getFaceGrafFromNum(numHead) {
                if (!this.cabezas[numHead]) {
                    return;
                }
                var grh = this.cabezas[numHead].down;
                return this.getNumCssGraficoFromGrh(grh);
            }

            getBodyGrafFromNum(numCuerpo) {
                if (!this.cuerpos[numCuerpo]) {
                    return;
                }
                var grh = this.cuerpos[numCuerpo].down;
                return this.getNumCssGraficoFromGrh(grh);
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
                    this._setBaseTexture(nombreGrafico,new PIXI.BaseTexture.fromImage("graficos/" + nombreGrafico + ".png"));
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

        return AssetManager;
    });