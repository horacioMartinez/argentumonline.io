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
                this.dataMapas = [];
                this.sounds = [];

                this.preloader = new Preloader(this);
            },

            getGrh: function (grh) {
                if (!this.grhs[grh])
                    this.loadGrh(grh);
                return this.grhs[grh];
            },

            getTerrenoGrh: function (grh) { // TODO: cuando se implemente con rendertexture el mapa, sacar esto y usar getgrh, sirve para que el grid del terreno no se vea discontinuo
                if (!this.grhs[grh])
                    this.loadGrh(grh);
                res = this.grhs[grh];
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

            setMusic: function (nombre) { // todo: unload cada vez que cmabia?? <<- ALGO ANDA MAL y SIGUE AUMENTANDO MEMORIA, ver el task manager de chrome
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

            playSound: function (nombre, loop, onEnd) { // todo: mover todos los de sonido a una nueva clase de sonido
                if (this.enabled) {
                    if (!this.sounds[nombre]) {
                        this.cargarSonido(nombre,loop,onEnd);
                    }
                    this.sounds[nombre].play();
                }
            },

            cargarSonido: function (nombre, loop, onEnd) {
                if (this.sounds[nombre])
                    return;
                this.sounds[nombre] = new Howl({
                    urls: ['audio/sonidos/' + nombre + '.m4a']
                });

                if (loop)
                    this.sounds[nombre].loop(loop);
                if (onEnd)
                    this.sounds[nombre].on("onend", onEnd);
            },

            finalizarSonidoLluvia: function (bajoTecho) {
                this.stopLluvia();
                var nombre;
                if (bajoTecho)
                    nombre = "lluviainend";
                else
                    nombre = "lluviaoutend";
                this.playSound(nombre);
                this.sounds[nombre].volume(0.3);
            },

            IniciarSonidoLluvia: function (bajoTecho) {
                var nombre;
                if (bajoTecho)
                    nombre = "lluviainst";
                else
                    nombre = "lluviaoutst";
                this.playSound(nombre, false, this.playLoopLluvia(bajoTecho));
                this.sounds[nombre].volume(0.3);
            },

            playLoopLluvia: function (bajoTecho) {
                this.stopLluvia();
                var nombre, sprite;
                if (bajoTecho) {
                    nombre = "lluviain";
                    sprite = {lluvia: [130, 7900]};
                }
                else {
                    nombre = "lluviaout";
                    sprite = {lluvia: [100, 4200]};
                }

                if (!this.sounds[nombre]) { //cargar con sprite para que loopee bien
                    this.cargarSonido(nombre,true);
                    this.sounds[nombre].sprite(sprite);
                    this.sounds[nombre].volume(0.5);
                }
                this.sounds[nombre].play("lluvia");
            },

            stopLluvia: function () {
                if (this.sounds["lluviain"])
                    this.sounds["lluviain"].stop();
                if (this.sounds["lluviaout"])
                    this.sounds["lluviaout"].stop();
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

                return this.dataMapas[numMapa];
            },

            preload: function (terminar_callback) {
                this.preloader.preload(terminar_callback);
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