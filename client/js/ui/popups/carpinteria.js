/**
 * Created by horacio on 6/17/16.
 */

define(["text!../../../menus/carpinteria.html!strip", 'ui/popups/popup'], function (DOMdata, PopUp) {

    class Carpinteria extends PopUp {
        constructor(game) {

            var options = {
                width: 500,
                height: 400,
                minWidth: 250,
                minHeight: 300
            };
            super(DOMdata, options);

            this.game = game;
            this.initCallbacks();
            this.$itemsContainer = $("#carpinteriaContenedorItems");
            this.$carpinteriaTexto = $("#carpinteriaTexto");
        }

        /* Items contiene
         Name: Name,
         GrhIndex: GrhIndex,
         Madera: Madera,
         MaderaElfica: MaderaElfica,
         ObjCarpinteroIndex: ObjCarpinteroIndex,
         ObjUpgrade: ObjUpgrade,
         */

        show(items) {
            super.show();
            this.setItems(items);
        }

        setItems(items) {
            //TODO objUpgrade
            if (items.length < 1) {
                this.$carpinteriaTexto.text("No puedes construir ningun objeto porque no tienes suficientes puntos en carpinteria");
                // TODO: decir que no peude construir items pq le falta skills
            } else{
                this.$carpinteriaTexto.text("");
            }

            var self = this;
            for (var item of items) {

                var $row = $('<tr></tr>');

                var numGraf = this.game.assetManager.getNumCssGraficoFromGrh(item.GrhIndex);
                var url = "url(graficos/" + numGraf + ".png)";

                var $cell = $('<td></td>');
                var $imagenItem = $('<div class="divImagen" style="width: 50px; height:50px;"></div>');
                $imagenItem.css('background-image', url);
                $cell.append($imagenItem);

                $row.append($cell);

                var $cellRequerimientos = $('<td></td>');
                $cellRequerimientos.text('Require madera: ' + item.Madera + " y madera elfica " + item.MaderaElfica);
                // TODO: graficos madera y madera elfica
                $row.append($cellRequerimientos);

                var $cellConstruir = $('<td></td>');
                var $botonConstruir = $('<button class="btn btn-default" >Construir</button>');

                $botonConstruir.data("itemIndex", item.ObjCarpinteroIndex);
                $botonConstruir.click(function () {
                    var cantidadAConstruir = $('#carpinteriaCantidadAConstruir').val();
                    self.game.client.sendInitCrafting(cantidadAConstruir, 1);//TODO: horrible esto, que se haga de 1 (cambiar sv)
                    var itemIndex = $(this).data("itemIndex");
                    self.game.client.sendCraftCarpenter(itemIndex);
                });
                $cellConstruir.append($botonConstruir);
                $row.append($cellConstruir);
                this.$itemsContainer.append($row);
            }
        }

        initCallbacks() {

        }
    }

    return Carpinteria;
});
