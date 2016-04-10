/**
 * Created by horacio on 4/10/16.
 */

define([], function () {

    var Inventario = Class.extend({
        init: function () {
            this._slots = [];
            this._cambioSlotCallback = null;
            this._borrarSlotCallback = null;
        },

        cambiarSlot: function (numSlot, ObjName, Amount, Price, GrhIndex, ObjIndex, ObjType, MaxHit, MinHit, MaxDef, MinDef, Equiped) {
            var nuevoSlot;
            if (this.isValidSlot(Amount, GrhIndex)) {
                nuevoSlot = {
                    numero: numSlot,
                    objIndex: ObjIndex,
                    objName: ObjName,
                    cantidad: Amount,
                    grh: GrhIndex,
                    objType: ObjType,
                    maxHit: MaxHit,
                    minHit: MinHit,
                    maxDef: MaxDef,
                    minDef: MinDef,
                    precio: Price,
                    equipado: Equiped
                };
            }
            else {
                nuevoSlot = null;
            }

            this._slots[numSlot] = nuevoSlot;
        },

        getSlot: function (numSlot) {
            return this._slots[numSlot];
        },

        forEachSlot: function (callback) {
            _.each(this._slots, function (slot) {
                if (slot) {
                    callback(slot);
                }
            });
        },

        isValidSlot: function (cantidad, grh) {
            if ((cantidad > 0) && (grh > 0))
                return true;
            return false;
        },

    });
    return Inventario;
});
