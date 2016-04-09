
define(['model/entity'], function(Entity) {

    var Item = Entity.extend({
        init: function(id,gridX, gridY) {
            this._super(gridX,gridY);
            this.id= id;
            this.sprite = null;
        },

    });

    return Item;
});
