/**
 * Created by horacio on 6/20/16.
 */

define(["text!../../../menus/herreria.html!strip", 'ui/popups/popup'], function (DOMdata, PopUp) {

    class Herreria extends PopUp {
        constructor(game) {

            var options = {
                width: 500,
                height: 400,
                minWidth: 250,
                minHeight: 300
            };
            super(DOMdata, options);

            this.game = game;
            //this.initCallbacks();
            this.$itemsContainer = $("#herreriaContenedorItems");
        }

        /*Item contiene:
         Name: Name,
         GrhIndex: GrhIndex,
         LingH: LingH,
         LingP: LingP,
         LingO: LingO,
         ArmasHerreroIndex: ArmasHerreroIndex,
         ObjUpgrade: ObjUpgrade,
         */
        setItems(items) {
            //TODO objUpgrade

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
                $cellRequerimientos.text('Require lingote hierro: ' + item.LingH + " , lingote plata " + item.LingP + " y lingote de oro: " + item.LingO);
                // TODO: graficos madera y madera elfica
                $row.append($cellRequerimientos);

                var $cellConstruir = $('<td></td>');
                var $botonConstruir = $('<button class="btn btn-default" >Construir</button>');

                $botonConstruir.data("itemIndex", item.ArmasHerreroIndex);
                $botonConstruir.click(function () {
                    var cantidadAConstruir = $('#herreriaCantidadAConstruir').val();
                    self.game.client.sendInitCrafting(cantidadAConstruir, 1);//TODO: horrible esto, que se haga de 1 (cambiar sv)
                    var itemIndex = $(this).data("itemIndex");
                    self.game.client.sendCraftBlacksmith(itemIndex);
                });
                $cellConstruir.append($botonConstruir);
                $row.append($cellConstruir);
                this.$itemsContainer.append($row);
            }
        }

        setWeapons(items) {
            /*Item contiene:
             Name: Name,
             GrhIndex: GrhIndex,
             LingH: LingH,
             LingP: LingP,
             LingO: LingO,
             ArmasHerreroIndex: ArmasHerreroIndex,
             ObjUpgrade: ObjUpgrade,
             */
            this.setItems(items);
        }

        setArmors(items) {
            /* Item contiene
             Name: Name,
             GrhIndex: GrhIndex,
             LingH: LingH,
             LingP: LingP,
             LingO: LingO,
             ArmasHerreroIndex: ArmasHerreroIndex,
             ObjUpgrade: ObjUpgrade,
             */
            this.setItems(items);
        }
    }

    return Herreria;
});

