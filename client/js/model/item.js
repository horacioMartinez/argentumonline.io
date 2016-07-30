define(['model/entity'], function (Entity) {

    class Item extends Entity {
        constructor(gridX, gridY) {
            super(gridX, gridY);
            this.sprite = null;
        }

    }
    return Item;

});
