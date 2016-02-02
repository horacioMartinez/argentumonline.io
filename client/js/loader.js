define(['text!../indices/graficos.json',
        'text!../indices/armas.json',
        'text!../indices/cabezas.json',
        'text!../indices/cascos.json',
        'text!../indices/cuerpos.json',
        'text!../indices/escudos.json',
        'text!../indices/fxs.json'],
    function (jsonGraficos, jsonArmas, jsonCabezas, jsonCascos, jsonCuerpos, jsonEscudos, jsonFxs) {

        var Loader = Class.extend({
            init: function () {
                this.ui = {};
                this.callback_llamado = false;
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

            loadGraficos: function () {
                this.indices = this.getIndices();
                if (this.graficos)
                    log.error("graficos cargados dos veces?!");
                this.graficos = [];
                for (var i = 0; i < this.indices.length; i++) {
                    if (!this.indices[i].grafico) { // animacion
                        continue;
                    }
                    var numGrafico = this.indices[i].grafico;
                    if (this.graficos[numGrafico]) { // ya puesto a cargar
                        continue;
                    }

                    this.graficos[numGrafico] = {imagen: new Image(), loaded: false};
                    this.graficos[numGrafico].imagen.crossOrigin = "Anonymous";
                    this.graficos[numGrafico].imagen.onload = this.crearImgLoadFunc(numGrafico); // esto es al pedo si se cargan al principio (hacerlo para los de despues, TODO: que al principio se carguen los mas comunes y los demas se carguen en el momento si los necesita)
                    this.graficos[numGrafico].imagen.src = "graficos/" + numGrafico + ".png";
                }
            },

            graficosCargados: function (){
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

            loadUI: function () {
                if (this.UIloaded) {
                    log.error("graficos ui tratados de cargar dos veces!");
                    return;
                }
                var graficos = ["interfaz.png","login.jpg","barraexp.png","barraEnergia.png","barraMana.png","barraVida.png","barraHambre.png","barraSed.png","centroInventario.jpg","centroHechizos.jpg"];
                this.loadGraficosUI(graficos);
                this.UIloaded = true;
            },

            loadGraficosUI: function(nombres){
                for (var i = 0; i < nombres.length; i++) {
                    var variable = nombres[i].slice(0, -4); // saco extension
                    this.ui[variable] = new Image();
                    this.ui[variable].crossOrigin = "Anonymus";
                    this.ui[variable].src = ( "graficos/ui/" + nombres[i]);
                }
            },

            getUI: function () {
                return this.ui;
            },

            /*getMapa: function(numMapa){
             // TODO: guardar aca o en otro lado mapa actual der izq.. etc ver final carpeta, poner el parse segun numero
             if (!this.mapaActual)
             this.mapaActual= JSON.parse(mapa1);
             return this.mapaActual;
             },*/

            getGraficos: function () {
                return this.graficos;
            }
        });

        return Loader;
    });