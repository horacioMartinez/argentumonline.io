/**
 * Created by horacio on 2/21/16.
 */

define(['jquery-ui'], function () {

    //TODO: crear los popups en run time con jquery y borrarlos cuando se cierran

    var ItemGrid = Class.extend({
        init: function (gridID, sortable) {
            this.id = gridID;
            this.$this = $("#" + this.id);
            if (sortable) {
                this.$this.sortable({
                    distance: 20,
                    cursor: "move"
                });
            }
            this._selectedSlot = null;
            this._selectionCallback = null;
            this._doubleClickCallback = null;
        },

        setSelectionCallback: function (f) {
            this._selectionCallback = f;
        },
        setDobleClickCallback: function (cb) { // params: slot
            this._doubleClickCallback = cb;
        },

        getSelectedSlot: function () {
            return this._selectedSlot;
        },

        resetSelectedSlot: function () {
            this._selectedSlot = null;
            this.$this.children().removeClass("selected");
        },

        modificarSlot: function (numSlot, cantidad, numGraf, equiped) {
            var $item = this._getItem(numSlot);
            if (!$item) {
                $item = this._crearItem();
                $item.data("slot", numSlot);
            }

            $item.text(cantidad + "");
            var url = "url(../graficos/" + numGraf + ".png)";
            $item.css('background-image', url);
            if (equiped)
                $item.addClass("equiped");
            else
                $item.removeClass("equiped");
        },

        _getItem: function (numSlot) {
            //var listItems = $("#" + this.id + " li");
            var listItems = this.$this.children();
            var res = null;
            listItems.each(function (idx, li) {
                var $item = $(li);
                if ($item.data("slot") === numSlot) {
                    res = $item;
                    return false;
                }
            });
            return res;
        },

        _crearItem: function () {
            var $item = $('<li></li>').appendTo(this.$this);
            var self = this;
            $item.mousedown(function () {
                var $currentItem = $(this);
                $currentItem.addClass("selected");
                $currentItem.siblings().removeClass("selected");
                self._selectedSlot = $currentItem.data("slot");
                if (self._selectionCallback)
                    self._selectionCallback(self._selectedSlot);
            });

            var listItems = this.$this.children();
            listItems.dblclick(function () {
                if (self._doubleClickCallback) {
                    self._doubleClickCallback(self._selectedSlot)
                }
            });
            return $item;
        },

        borrarSlot: function (numSlot) {
            $item = this._getItem(numSlot);
            if ($item)
                $item.remove();
        },
    });

    return ItemGrid;
});