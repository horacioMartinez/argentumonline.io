/**
 * Created by horacio on 2/27/16.
 */

define([], function () {
    class IntroUI {
        constructor(assetManager, showMensajeCb) {
            this.loadingBarUsada = $("#loadingBarUsada");
            this.loadingBarTexto = $("#loadingBarTexto");
        }

        updateLoadingBar(cant, max, noInvertida) {
            let $barra =this.loadingBarUsada;
            let $label = this.loadingBarTexto;
            porcentaje = 100 - Math.floor((cant / max) * 100);

            $barra.css("width", porcentaje + "%");
            $label.text(porcentaje + "%");
        }

    }

    return IntroUI;
});