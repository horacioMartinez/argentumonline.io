define(['json!../indices/graficos.json',
        'json!../indices/armas.json',
        'json!../indices/cabezas.json',
        'json!../indices/cascos.json',
        'json!../indices/cuerpos.json',
        'json!../indices/escudos.json',
        'json!../indices/fxs.json', 'lib/howler', 'lib/pixi', 'preloader'],
    function (jsonGraficos, jsonArmas, jsonCabezas, jsonCascos, jsonCuerpos, jsonEscudos, jsonFxs, __howler__, PIXI, Preloader) {

        var AssetManager = Class.extend({
            init: function () {
                this.currentMusic = null;
                this.sounds = [];
                this.enabled = true;

                this.indices = jsonGraficos;
                this.armas = jsonArmas;
                this.cabezas = jsonCabezas;
                this.cascos = jsonCascos;
                this.cuerpos = jsonCuerpos;
                this.escudos = jsonEscudos;
                this.fxs = jsonFxs;
                this._baseTextures = [];
                this.grhs = [];

                this.preloader = new Preloader(this);
            },

            getGrh: function (grh) {
                if (!this.grhs[grh])
                    this.loadGrh(grh);
                return this.grhs[grh];
            },

            loadGrh: function (grh) {
                if (!this.indices[grh] || this.grhs[grh]) {
                    return;
                }
                if (this.indices[grh].frames) {// animacion
                    var frameNumbers = this.indices[grh].frames;
                    var vecgrhs = [];
                    for (var j = 0; j < frameNumbers.length; j++) {
                        if (!this.grhs[frameNumbers[j]])
                            this._loadGrhGrafico(frameNumbers[j]);
                        vecgrhs.push(this.grhs[frameNumbers[j]]);
                    }
                    this.grhs[grh] = {frames: vecgrhs, velocidad: this.indices[grh].velocidad};
                }
                else { // no animacion
                    this._loadGrhGrafico(grh);
                }
            },

            _loadGrhGrafico: function (grh) {
                var numGrafico = this.indices[grh].grafico;
                if (!this._baseTextures[numGrafico]) { // cargar basetexture
                    this._baseTextures[numGrafico] = new PIXI.BaseTexture.fromImage("graficos/" + numGrafico + ".png")
                }
                this.grhs[grh] = new PIXI.Texture(this._baseTextures[numGrafico], new PIXI.Rectangle(this.indices[grh].offX, this.indices[grh].offY, this.indices[grh].width, this.indices[grh].height));
            },

            /*getMapa: function(numMapa){
             // TODO: guardar aca o en otro lado mapa actual der izq.. etc ver final carpeta, poner el parse segun numero
             if (!this.mapaActual)
             this.mapaActual= JSON.parse(mapa1);
             return this.mapaActual;
             },*/

            setMusic: function (nombre) { // todo: unload cada vez que cmabia??
                /*
                 if (this.currentMusic)
                 this.currentMusic.unload();
                 this.currentMusic = new Howl({
                 urls: ['audio/musica/' + nombre + '.m4a'],
                 loop: true
                 });
                 if (this.enabled)
                 this.currentMusic.play();
                 */
            },

            playSound: function (nombre) {
                if (this.enabled) {
                    if (!this.sounds[nombre]) {
                        this.sounds[nombre] = new Howl({
                            urls: ['audio/sonidos/' + nombre + '.m4a']
                        })
                    }
                    this.sounds[nombre].play();
                }
            },

            toggleSound: function () {
                if (this.enabled) {

                    this.enabled = false;
                    if (this.currentMusic)
                        this.currentMusic.pause();

                } else {
                    this.enabled = true;

                    if (this.currentMusic)
                        this.currentMusic.play();
                }
            },

            /*
             $.getJSON('simple.json')
             .success(function(data) {
             alert(data.simple);
             log.error("HOLAAAAAAAAAAA " + data.simple);
             }).error(function(xhr) {
             alert("Se produjo algun error cargando la página, probá recargandola");
             });*/

            getMapaSync: function (numMapa) {
                var res;
                $.ajax({
                    type: 'GET',
                    url: "mapas/mapa" + numMapa + ".json",
                    dataType: 'json',
                    success: function (data) {
                        res = data;
                    },
                    data: null,
                    async: false
                });
                return res;
            },

            preload: function (terminar_callback) {
                this.preloader.preloadAll(terminar_callback);
            },

            getIndices: function () {
                return this.indices;
            },

            getArmas: function () {
                return this.armas;
            },

            getCabezas: function () {
                return this.cabezas;
            },

            getCascos: function () {
                return this.cascos;
            },

            getCuerpos: function () {
                return this.cuerpos;
            },

            getEscudos: function () {
                return this.escudos;
            },

            getFxs: function () {
                return this.fxs;
            },
        });

        return AssetManager;
    });