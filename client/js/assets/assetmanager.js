define(['json!../../indices/graficos.json',
        'json!../../indices/armas.json',
        'json!../../indices/cabezas.json',
        'json!../../indices/cascos.json',
        'json!../../indices/cuerpos.json',
        'json!../../indices/escudos.json',
        'json!../../indices/fxs.json',
        'lib/pixi', 'assets/preloader', 'assets/audio', 'enums'],
    function (jsonGraficos, jsonArmas, jsonCabezas, jsonCascos, jsonCuerpos, jsonEscudos, jsonFxs, PIXI, Preloader, Audio, Enums) {

        class AssetManager {
            constructor() {
                this.audio = new Audio();

                this.indices = jsonGraficos;
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
            }

            getNumGraficoFromGrh(grh) {
                if (this.indices[grh] && this.indices[grh].grafico) {
                    return this.indices[grh].grafico;
                }
            }

            getFaceGrafFromNum(numHead) {
                if (!this.cabezas[numHead]) {
                    return;
                }
                var grh = this.cabezas[numHead].down;
                return this.getNumGraficoFromGrh(grh);
            }

            getGrh(grh) {
                if (!this.grhs[grh]) {
                    this.loadGrh(grh);
                }
                return this.grhs[grh];
            }

            getTerrenoGrh(grh) { // TODO: si se implemente con rendertexture el mapa, sacar esto y usar getgrh, sirve para que el grid del terreno no se vea discontinuo
                if (!this.grhs[grh]) {
                    this.loadGrh(grh);
                }
                var res = this.grhs[grh];
                if (!res.terrenoSeteado) {
                    if (!res.frames) {
                        res.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                    }
                    else {
                        for (var i = 0; i < res.frames.length; i++) {
                            res.frames[i].baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                        }
                    }
                    res.terrenoSeteado = true;
                }
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
                var numGrafico = this.indices[grh].grafico;
                if (!this._baseTextures[numGrafico]) { // cargar basetexture
                    this._baseTextures[numGrafico] = new PIXI.BaseTexture.fromImage("graficos/" + numGrafico + ".png")
                }
                this.grhs[grh] = new PIXI.Texture(this._baseTextures[numGrafico], new PIXI.Rectangle(this.indices[grh].offX, this.indices[grh].offY, this.indices[grh].width, this.indices[grh].height));
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
/*
            getMapaASync(numMapa, completeCallback) {
                if (!this.dataMapas[numMapa]) {
                    var self = this;
                    $.ajax({
                        type: 'GET',
                        url: "mapas/mapa" + numMapa + ".json",
                        dataType: 'json',
                        success: function (data) {
                            self.dataMapas[numMapa] = data;
                        },
                        data: null,
                        async: false
                    });
                }
                completeCallback(this.dataMapas[numMapa]);
                //return this.dataMapas[numMapa];
            }*/

            preload(terminar_callback) {
                this.preloader.preload(terminar_callback);
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