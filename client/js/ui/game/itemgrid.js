/**
 * Created by horacio on 2/21/16.
 */

define(['jquery-ui'], function () {

    class ItemGrid {
        constructor(gridID, cantidadSlots, dragAndDropable) {
            this.cantidadSlots = cantidadSlots;
            this.dragAndDropable = dragAndDropable;
            this.MAX_DELAY_DOUBLE_CLICK = 400;


            this.id = gridID;
            this.$this = $("#" + this.id);
            this._selectedSlot = null;
            this._selectionCallback = null;
            this._doubleClickCallback = null;
            
            this.crearSlots();
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

        crearSlots() {
            for (let i = 0; i < this.cantidadSlots; i++) {
                var $slot = $('<li></li>').appendTo(this.$this);
                $slot.data("slotNumber", i + 1);
                if (this.dragAndDropable) {
                    $slot.droppable({
                        hoverClass: 'ui-state-highlight', //TODO !!!
                        drop: function (event, ui) {
                            let targetSlot = $(this),
                                draggedItem = $(ui.draggable),
                                originalSlot = draggedItem.parent(),
                                targetSlotItem = targetSlot.children();

                            // swap items
                            if (targetSlotItem.length > 0) {
                                targetSlotItem.appendTo(originalSlot);
                            }
                            draggedItem.appendTo(targetSlot);

                            //swap slot numbers TODO: tener cuidado en dropear del inventario a un grid de comerciar (o viceversa) !!
                            let targetSlotNumber = targetSlot.data("slotNumber"),
                                originalSlotNumber = originalSlot.data("slotNumber");
                            targetSlot.data("slotNumber", originalSlotNumber);
                            originalSlot.data("slotNumber", targetSlotNumber);

                        }
                    });
                }
            }
        }

        modificarSlot(numSlot, cantidad, numGraf, equiped) {
            var $item = this._getItem(numSlot);
            if (!$item.length) {
                $item = this._crearItem(numSlot);
                //$item.data("slot", numSlot);
            }

            $item.text(cantidad + "");
            var url = 'url(graficos/css/' + numGraf + '.png)';
            $item.css('background-image', url);
            if (equiped) {
                $item.addClass("equiped");
            } else {
                $item.removeClass("equiped");
            }
        }

        deselect() {
            if (this._selectedSlot) {
                this._getItem(this._selectedSlot).removeClass("selected");
            }
            this._selectedSlot = null;
        }

        _getSlot(numSlot) {
            let $resSlot = null;
            this.$this.children().each(function () {
                var $slot = $(this);
                if ($slot.data("slotNumber") === numSlot) {
                    $resSlot = $slot;
                    return false;
                }
            });
            if (!$resSlot) {
                throw new Error("Numero de slot invalido: " + numSlot);
            }
            return $resSlot;
        }

        _getItem(numSlot) {
            return this._getSlot(numSlot).children();
        }

        _crearItem(numSlot) {
            let $parentSlot = this._getSlot(numSlot);
            var $item = $('<li></li>').appendTo($parentSlot);
            if (this.dragAndDropable) {
                $item.draggable({
                    distance: 15,
                    //cursor: "move", // TODO <-- (anda bugeado)
                    helper: 'clone',
                    revert: 'invalid',
                    start: function (event, ui) { //cambio tamaño helper asi no se expande
                        let $itemHelper = $(ui.helper);
                        $itemHelper.width($parentSlot.width());
                        $itemHelper.height($parentSlot.height());
                    }
                });
            }

            var self = this;
            $item.mousedown(function () {
                var $currentItem = $(this);
                var $currentSlot = $currentItem.parent();
                self.deselect();
                $currentItem.addClass("selected");
                self._selectedSlot = $currentSlot.data("slotNumber");
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

        borrarItem(numSlot) {
            var $item = this._getItem(numSlot);
            if ($item) {
                $item.remove();
            }
        }

        clear() {
            this.$this.children().each(function () {
                $(this).empty(); // "$(this)" = slot
            });
        }
    }

    return ItemGrid;
});