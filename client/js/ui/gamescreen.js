/**
 * Created by horacio on 1/27/16.
 */

define(['jquery','ui/screen'],
    function ($,Screen) {
        var GameScreen = Screen.extend({
            init: function(botonInventario_callback,botonHechizos_callback,botonLanzar_callback,botonInfo_callback){
                this._super();

                var self= this;
                this.botonMapa = this.agregarBoton("BotonMapa",682,335, function (){
                    //self.login_callback($(nombreInput).val(),$(passwordInput).val());
                    alert("TODO");
                });
                this.botonGrupo = this.agregarBoton("BotonGrupo",681,356, function (){
                    //self.login_callback($(nombreInput).val(),$(passwordInput).val());
                    alert("TODO");
                });
                this.botonOpciones = this.agregarBoton("BotonOpciones",681,377, function (){
                    //self.login_callback($(nombreInput).val(),$(passwordInput).val());
                    alert("TODO");
                });
                this.botonEstadisticas = this.agregarBoton("BotonEstadisticas",681,399, function (){
                    //self.login_callback($(nombreInput).val(),$(passwordInput).val());
                    alert("TODO");
                });
                this.botonClanes = this.agregarBoton("BotonClanes",683,423, function (){
                    //self.login_callback($(nombreInput).val(),$(passwordInput).val());
                    alert("TODO");
                });

                this.inventario = this.agregarItemGrid(600,55,5,4);

                this.botonInventario = this.agregarBotonInivisible(591,15,86,32,botonInventario_callback);
                this.botonHechizos = this.agregarBotonInivisible(677,15,86,32,botonHechizos_callback);
                this.botonLanzar = this.agregarBotonInivisible(575,245,95,35,botonLanzar_callback);
                this.botonInfo = this.agregarBotonInivisible(705,245,61,35,botonInfo_callback);
                this.hechizos = this.agregarListaMultiple(590,53,185,190,"hechizosGame");

            }
        });
        return GameScreen;
    });