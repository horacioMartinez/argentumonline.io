/**
 * Created by horacio on 2/27/16.
 */




    class IntroUI {
        constructor(assetManager, showMensajeCb) {
            this.loadingBarUsada = $("#loadingBarUsada");
        }

        updateLoadingBar(porcentajeCargado) {
            this.loadingBarUsada.css("width", porcentajeCargado + "%");
        }

    }

    
export default IntroUI;