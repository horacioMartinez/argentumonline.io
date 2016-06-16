/**
 * Created by horacio on 5/2/16.
 */

define(["text!../../../menus/opciones.html!strip", 'ui/popups/popup'], function (DOMdata, PopUp) {

    class Opciones extends PopUp {
        constructor(audioTab, configurarTeclasTab) {
            var options = {
                width:500,
                height:600,
                minWidth:250,
                minHeight:400
            };
            super(DOMdata,options);
            this.audioTab = audioTab;
            this.configurarTeclasTab = configurarTeclasTab;
            this.initCallbacks();
            audioTab.initCallbacks();
            configurarTeclasTab.initCallbacks();
            var self = this;
            configurarTeclasTab.setCerrarCallback(function(){
                self.hide();
            });
        }

        show() {
            super.show();
            this.audioTab.onShow();
            this.configurarTeclasTab.onShow();
        }

        hide() {
            super.hide();
            this.audioTab.onHide();
            this.configurarTeclasTab.onHide();
        }

        initCallbacks() {
            var self = this;

            //$( "#popUpOpcionesTabs" ).tabs(); // TODO

            $("#opcionesBotonCerrar").click(function () {
                self.hide();
            });

        }

    }

    return Opciones;
});
