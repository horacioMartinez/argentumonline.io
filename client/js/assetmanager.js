define(['text!../indices/graficos.json',
        'text!../indices/armas.json',
        'text!../indices/cabezas.json',
        'text!../indices/cascos.json',
        'text!../indices/cuerpos.json',
        'text!../indices/escudos.json',
        'text!../indices/fxs.json', 'lib/howler', 'lib/pixi'],
    function (jsonGraficos, jsonArmas, jsonCabezas, jsonCascos, jsonCuerpos, jsonEscudos, jsonFxs, __howler__, PIXI) {

        var AssetManager = Class.extend({
            init: function () {
                this.ui = {};
                this.callback_llamado = false;

                this.currentMusic = null;
                this.sounds = [];

                this.enabled = true;
            },

            getIndices: function () {
                if (!this.indices)
                    this.indices = JSON.parse(jsonGraficos);
                return this.indices;
            },

            getArmas: function () {
                if (!this.armas)
                    this.armas = JSON.parse(jsonArmas);
                return this.armas;
            },

            getCabezas: function () {
                if (!this.cabezas)
                    this.cabezas = JSON.parse(jsonCabezas);
                return this.cabezas;
            },

            getCascos: function () {
                if (!this.cascos)
                    this.cascos = JSON.parse(jsonCascos);
                return this.cascos;
            },

            getCuerpos: function () {
                if (!this.cuerpos)
                    this.cuerpos = JSON.parse(jsonCuerpos);
                return this.cuerpos;
            },

            getEscudos: function () {
                if (!this.escudos)
                    this.escudos = JSON.parse(jsonEscudos);
                return this.escudos;
            },

            getFxs: function () {
                if (!this.fxs)
                    this.fxs = JSON.parse(jsonFxs);
                return this.fxs;
            },

            crearImgLoadFunc: function (numGrafico) {
                var self = this;
                return function () {
                    self.graficos[numGrafico].loaded = true
                };
            },

            graficosCargados: function () {
                if (!this.graficos)
                    return false;
                for (var i = 0; i < this.indices.length; i++) {
                    if (!this.indices[i].grafico) { // animacion
                        continue;
                    }
                    var numGrafico = this.indices[i].grafico;
                    if (!this.graficos[numGrafico]) // no puesto a cargar
                        continue;
                    if (!this.graficos[numGrafico].loaded)
                        return false;
                }
                return true;
            },

            /*getMapa: function(numMapa){
             // TODO: guardar aca o en otro lado mapa actual der izq.. etc ver final carpeta, poner el parse segun numero
             if (!this.mapaActual)
             this.mapaActual= JSON.parse(mapa1);
             return this.mapaActual;
             },*/

            getGraficos: function () {
                return this.graficos;
            },

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

            loadSounds: function () {
                for (var i = 1; i < 212; i++) { // <-- todo numero hardcodeado!
                    if (!this.sounds[i]) {
                        this.sounds[i] = new Howl({
                            urls: ['audio/sonidos/' + i + '.m4a']
                        })
                    }
                }

                log.info("Sonidos cargados!");
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

            loadGrh: function (grh) { // carga asincronica de grafico (forma de carga un grafico en medio del juego, NO usarla en el preload)
                this.indices = this.getIndices();
                if (!this.indices[grh]) //grh invalido
                    return;

                if (this.indices[grh].grafico) { // no animacion
                    var numGrafico = this.indices[grh].grafico;
                    if (this.graficos[numGrafico]) { // ya puesto a cargar
                        return;
                    }
                    this.graficos[numGrafico] = {imagen: new Image(), loaded: false};
                    this.graficos[numGrafico].imagen.crossOrigin = "Anonymous";
                    this.graficos[numGrafico].imagen.onload = this.crearImgLoadFunc(numGrafico);
                    this.graficos[numGrafico].imagen.src = "graficos/" + numGrafico + ".png";
                }
                else { // animacion
                    var grhs = this.indices[grh].frames;
                    for (var i = 0; i < grhs.length; i++) {
                        var numGrafico = this.indices[grhs[i]].grafico;
                        if (this.graficos[numGrafico]) { // ya puesto a cargar
                            return;
                        }
                        this.graficos[numGrafico] = {imagen: new Image(), loaded: false};
                        this.graficos[numGrafico].imagen.crossOrigin = "Anonymous";
                        this.graficos[numGrafico].imagen.onload = this.crearImgLoadFunc(numGrafico);
                        this.graficos[numGrafico].imagen.src = "graficos/" + numGrafico + ".png";
                    }
                }
            },

            _agregarPreloadGraficos: function (loader) {
                this.indices = this.getIndices();
                var graficos = [];
                for (var i = 0; i < this.indices.length; i++) {
                    if (!this.indices[i].grafico) { // animacion
                        continue;
                    }
                    var numGrafico = this.indices[i].grafico;
                    if (graficos[numGrafico]) { // ya puesto a cargar
                        continue;
                    }
                    graficos[numGrafico] = 1;
                    loader.add(numGrafico + "", "graficos/" + numGrafico + ".png");
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

            _loadMapas: function () {
                var maxMapa = 312;
                for (var i = 1; i <= maxMapa; i++) {
                    $.getJSON("mapas/mapa" + i + ".json")/*.success(function(data){
                     log.error("un mapa cargado");
                     })*/;
                }
            },

            _initGrhs: function () { // cada grh es un texture distinto O un objeto que contiene un vector de texturas y velocidad, todo: como ya se creo un texture por cada grafico cargado, reuso ese si es el grh que empieza en 0,0
                if (this.grhs)
                    log.error("graficos cargados dos veces!!");

                this.grhs = [];
                for (var i = 0; i < this.indices.length; i++) {

                    if (this.grhs[i])
                        return; // ya cargado
                    if (this.indices[i].frames) { // animacion
                        var frameNumbers = this.indices[i].frames;
                        var vecgrhs = [];
                        for (var j = 0; j < frameNumbers.length; j++) {
                            if (frameNumbers[j] > i) {
                                var k = frameNumbers[j]; // creo la textura (como el numero es mas alto, todabia no la habia creado)
                                this.grhs[k] = new PIXI.Texture(PIXI.loader.resources[this.indices[k].grafico + ""].texture.baseTexture, new PIXI.Rectangle(this.indices[k].offX, this.indices[k].offY, this.indices[k].width, this.indices[k].height));
                            }
                            vecgrhs.push(this.grhs[frameNumbers[j]]);
                        }
                        this.grhs[i] = {frames: vecgrhs, velocidad: this.indices[i].velocidad};
                    }
                    else {
                        if (this.indices[i].grafico) //grh normal
                            this.grhs[i] = new PIXI.Texture(PIXI.loader.resources[this.indices[i].grafico + ""].texture.baseTexture, new PIXI.Rectangle(this.indices[i].offX, this.indices[i].offY, this.indices[i].width, this.indices[i].height));
                    }
                }
            },

            preload: function (terminar_callback) {
                //this._loadMapas();
                //this.loadSounds();
                // TODO: usar el json loader de pixi para cargar los json
                var loader = PIXI.loader;
                this._agregarPreloadGraficos(loader);
                loader.on('progress', function (loader, loadedResource) {
                    console.log('Progress:', loader.progress + '%');
                });
                var self = this;
                loader.load(function (loader, resources) {
                    self._initGrhs();
                    terminar_callback();
                });
            },
        });

        return AssetManager;
    });