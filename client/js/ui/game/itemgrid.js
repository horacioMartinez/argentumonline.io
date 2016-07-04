/**
 * Created by horacio on 2/21/16.
 */

define(['jquery-ui'], function () {

    //TODO: crear los popups en run time con jquery y borrarlos cuando se cierran

    class ItemGrid {
        constructor(gridID, sortable) {
            this.MAX_DELAY_DOUBLE_CLICK = 400;

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
        }

        setSelectionCallback(f) {
            this._selectionCallback = f;
        }

        setDobleClickCallback(cb) { // params: slot
            this._doubleClickCallback = cb;
        }

        getSelectedSlot() {
            return this._selectedSlot;
        }

        resetSelectedSlot() {
            this._selectedSlot = null;
            this.$this.children().removeClass("selected");
        }

        modificarSlot(numSlot, cantidad, numGraf, equiped) {
            var $item = this._getItem(numSlot);
            if (!$item) {
                $item = this._crearItem();
                $item.data("slot", numSlot);
            }

            $item.text(cantidad + "");
            var url = "url(graficos/" + numGraf + ".png)";
            $item.css('background-image', url);
            if (equiped) {
                $item.addClass("equiped");
            } else {
                $item.removeClass("equiped");
            }
        }

        _getItem(numSlot) {
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
        }

        _crearItem() {
            var $item = $('<li></li>').appendTo(this.$this);
            var self = this;
            $item.mousedown(function () {
                var $currentItem = $(this);
                $currentItem.addClass("selected");
                $currentItem.siblings().removeClass("selected");
                self._selectedSlot = $currentItem.data("slot");
                if (self._selectionCallback) {
                    self._selectionCallback(self._selectedSlot);
                }
            });

            if (self._doubleClickCallback) {
                // DOBLE CLICK FIX: simulo doble click con el click para que ande ok en todos los browsers
                $item.click(function () {
                    var newTime = Date.now();
                    var delta = newTime - (this.click_time || 0);
                    this.click_time = newTime;
                    if (delta < self.MAX_DELAY_DOUBLE_CLICK) {
                        self._doubleClickCallback(self._selectedSlot);
                    }
                }.bind($item));
            }
            return $item;
        }

        borrarSlot(numSlot) {
            var $item = this._getItem(numSlot);
            if ($item) {
                $item.remove();
            }
        }

        clear() {
            this.$this.empty();
        }
    }

    return ItemGrid;
});