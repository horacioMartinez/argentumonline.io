/**
 * Created by horacio on 7/9/16.
 */

define(["text!../../../menus/noticiasClan.html!strip", 'ui/popups/popup'], function (DOMdata, PopUp) {

    class NoticiasClan extends PopUp {
        constructor() {

            var options = {
                width: 500,
                height: 400,
                minWidth: 250,
                minHeight: 300
            };
            super(DOMdata, options);

            this.$noticias = $("#noticiasClanNoticias");
            this.$enemigos = $("#noticiasClanEnemigos");
            this.$aliados = $("#noticiasClanAliados");
            this.$botonAceptar = $("#noticiasClanBotonAceptar");

            this.initCallbacks();
        }

        show(noticias, enemigos, aliados) {
            super.show();
            this.$noticias.text(noticias);
            this.$enemigos.text(enemigos.join('\n'));
            this.$aliados.text(aliados.join('\n'));
        }

        initCallbacks() {
            var self = this;

            this.$botonAceptar.click(function () {
                self.hide();
            });
        }

    }

    return NoticiasClan;
});