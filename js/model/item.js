import Entity from '../model/entity.js';



    class Item extends Entity {
        constructor(gridX, gridY) {
            super(gridX, gridY);
            this.sprite = null;
        }

    }
    
export default Item;