/**
 * Created by horacio on 2/21/16.
 */

define([], function () {

    //TODO: crear los popups en run time con jquery y borrarlos cuando se cierran

    var ItemGrid = Class.extend({
        init: function (gridID) {
            this.id = gridID;
            this._selectedSlot = -1;
            this.selectionCallback = null;

            var self = this;
            $("#" + this.id + " li").mousedown(function () {
                var $this = $(this);
                if ($this.hasClass("valido")) {
                    $this.addClass("selected");
                    self._selectedSlot = $this.index();
                    if (self.selectionCallback)
                        self.selectionCallback(self.getSelectedSlot());
                }
                else{
                    self._selectedSlot = -1;
                }
                $this.siblings().removeClass("selected");
            });
        },

        setSelectionCallback: function(f){
            this.selectionCallback = f;
        },

        getSelectedSlot: function(){
            return this._selectedSlot +1;
        },

        modificarSlot: function(numSlot,cantidad,numGraf){
            numSlot = numSlot -1;
            elem = $("#" + this.id + " li").eq(numSlot);
            if (elem) {
                elem.addClass("valido");
                elem.text(cantidad + "");
                var url = "url(../graficos/" + numGraf + ".png)";
                elem.css('background-image', url);
            }
            else
                log.error("SLOT INVALIDO!");
        },

        borrarSlot: function(numSlot){
            numSlot = numSlot -1;
            elem = $("#" + this.id + " li").eq(numSlot);
            if (elem) {
                elem.removeClass("valido");
                elem.text("");
                elem.css('background-image', 'none');
            }
            else
                log.error("SLOT INVALIDO!");
        },


        /*
         // devuelve 0 si no hay ninguno seleccionado
         // MAL, guardar el seleccionado en una variable local y listo
         getSelectedSlot: function(){
         var slot = -1;
         $("#comerciarGridComprar li").each(function(idx){
         if ($(this).hasClass("selected"))
         slot = idx;
         });
         return slot +1;

         },
         */
    });

    return ItemGrid;
});