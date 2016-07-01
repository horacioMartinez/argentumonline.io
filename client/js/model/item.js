define(['model/entity'], function (Entity) {

    class Item extends Entity {
        constructor(id, gridX, gridY) {
            super(gridX, gridY);
            this.id = id;
            this.sprite = null;
        }

    }
    return Item;
    
});
