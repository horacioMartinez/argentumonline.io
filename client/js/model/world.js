/**
 * Created by horacio on 7/26/16.
 */

define(['enums'],
    function (Enums) {
        class World {
            constructor(renderer) {
                this.renderer = renderer;
                this.characters = [];
                this.items = [];
            }

            getCharacter(CharIndex) {
                return this.characters.find((char) => {
                    return char.id === CharIndex;
                });
            }

            getCharacterInGridPos(gridX, gridY) {
                return this.characters.find((char) => {
                    return ((char.gridX === gridX) && (char.gridY === gridY));
                });
            }

            addCharacter(char) {
                this.characters.push(char);
                this.renderer.agregarCharacter(char);
            }

            sacarCharacter(c) {
                let index = this.characters.indexOf(c);
                if (index > -1) {
                    this.renderer.sacarCharacter(c);
                    this.characters.splice(index, 1);
                }
            }

            addItem(item, grhIndex) {
                this.items.push(item);
                this.renderer.agregarItem(item, grhIndex);
            }

            sacarItem(item) {
                let index = this.items.indexOf(item);
                if (index > -1) {
                    this.items.splice(index, 1);
                    this.renderer.sacarItem(item);
                }
            }

            getItemInGridPos(gridX, gridY) {
                return this.items.find((item) => {
                    return ((item.gridX === gridX) && (item.gridY === gridY));
                });
            }

            forEachCharacter(callback){ // loopeo al revez asi permite remover items en callback
                let i;
                for (i = this.characters.length - 1; i >= 0; i--) {
                    callback(this.characters[i], i);
                }
            }

            forEachItem(callback){
                let i;
                for (i = this.items.length - 1; i >= 0; i--) {
                    callback(this.items[i], i);
                }
            }

            forEachEntity(callback) {
                this.forEachCharacter(callback);
                this.forEachItem(callback);
            }

            getEntities(){
                return this.characters.concat(this.items);
            }
        }

        return World;
    });