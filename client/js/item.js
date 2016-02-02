
define(['entity','animacion'], function(Entity,Animacion) {

    var Item = Entity.extend({
        init: function(id,grh, gridX, gridY) {
            this._super(gridX,gridY);
            this.id= id;
            this.grh = grh;
        },

        update: function (time) {
            if (this.grh instanceof Animacion)
                this.grh.update(time);
        },

        getGrh: function(){
            if (this.grh instanceof Animacion) {
                return this.grh.getCurrentFrame();
            }
            return this.grh;
        },

        hasShadow: function() {
            return true;
        },

    });

    return Item;
});
