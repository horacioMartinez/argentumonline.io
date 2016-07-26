/**
 * Created by horacio on 7/26/16.
 */

define(['model/mapa', 'model/item', 'model/character', 'enums'],
    function (Mapa, Item, Character, Enums) {
        class World {
            constructor(renderer) {
                this.renderer = renderer;

                this.map = new Mapa();
                this.characters = [];
                this.items = [];
            }

            getCharacter(CharIndex) {
                return this.characters.find((char) => {
                    return char.id === CharIndex;
                })
            }

            getCharacterInGridPos(gridX, gridY) {
                return this.characters.find((char) => {
                    return ((char.gridX === gridX) && (char.gridY === gridY));
                })
            }

            addCharacter(char) {
                this.characters.push(char);
            }

            sacarCharacter(c) {

            }

            addItem(item) {
                this.items.push(item);
            }

            sacarItem(item) {

            }

            getItemInGridPos(gridX, gridY) {
                return this.items.find((item) => {
                    return ((item.gridX === gridX) && (item.gridY === gridY));
                })
            }

            forEachEntity(callback) {
                _.each(this.characters, function (entity, index) {
                    callback(entity, index);
                });

                _.each(this.items, function (entity, index) {
                    callback(entity, index);
                });
            }

            //
            // actualizarMovPos(char, direccion) {
            //     // Se setea la pos del grid nomas porque la (x,y) la usa para la animacion el character ( y la actualiza el al final)
            //     if (this.entityGrid[char.gridX][char.gridY][1]) {
            //         if (this.entityGrid[char.gridX][char.gridY][1].id === char.id) // es necesario checkear que sean iguales porque puede que haya otro char que piso la dir de este (pisar caspers)
            //         {
            //             this.entityGrid[char.gridX][char.gridY][1] = null;
            //         }
            //     }
            //
            //     switch (direccion) {
            //         case  Enums.Heading.oeste:
            //             this.entityGrid[char.gridX - 1][char.gridY][1] = char;
            //             char.setGridPositionOnly(char.gridX - 1, char.gridY); //
            //             break;
            //         case  Enums.Heading.este:
            //             this.entityGrid[char.gridX + 1][char.gridY][1] = char;
            //             char.setGridPositionOnly(char.gridX + 1, char.gridY);
            //             break;
            //         case  Enums.Heading.norte:
            //             this.entityGrid[char.gridX][char.gridY - 1][1] = char;
            //             char.setGridPositionOnly(char.gridX, char.gridY - 1);
            //             break;
            //         case  Enums.Heading.sur:
            //             this.entityGrid[char.gridX][char.gridY + 1][1] = char;
            //             char.setGridPositionOnly(char.gridX, char.gridY + 1);
            //             break;
            //         default:
            //             log.error(" Direccion de movimiento invalida!");
            //
            //     }
            //
            //     // hacer para que se vea animacion y demas... de los characters
            // }
            //
            // _removeAllEntities() {
            //     var self = this;
            //     this.forEachEntity(function (entity) {
            //         if (entity.id !== self.player.id) {
            //             self.sacarEntity(entity);
            //         }
            //     });
            //     this.items = [];
            // }
            //
            // sacarEntity(entity) {
            //     if (entity instanceof Character) {
            //         if (entity === this.player) {
            //             log.error("TRATANDO DE SACAR AL PLAYER!");
            //             return;
            //         }
            //         this.renderer.sacarCharacter(this.characters[entity.id]);
            //         this.entityGrid[entity.gridX][entity.gridY][1] = null;
            //         this.characters[entity.id] = null;
            //     }
            //     else if (entity instanceof Item) {
            //         var item = this.items[entity.id];
            //         this.renderer.sacarItem(item);
            //         this.entityGrid[item.gridX][item.gridY][0] = null;
            //         this.items[entity.id] = null;
            //     }
            //     else {
            //         log.error("Tipo de entity desconocido!");
            //     }
            // }
            //
            // moverCharacter(CharIndex, gridX, gridY) {
            //
            //     if (CharIndex === this.player.id) {
            //         if ((X !== this.player.gridX) || (Y !== this.player.gridY)) {
            //             this.resetPosCharacter(CharIndex, X, Y);
            //             log.error("moverCharacter: cambiar pos player a x:" + X + " y:" + Y);
            //         }
            //     } else {
            //         var char = this.characters[CharIndex];
            //         if (!c) {
            //             //log.error("mover character inexistente:");// + CharIndex);
            //             return;
            //         }
            //         var dir = c.esPosAdyacente(gridX, gridY);
            //         if (!this.renderer.entityVisiblePorCamara(c, 1) || !dir) {
            //             this.resetPosCharacter(CharIndex, gridX, gridY);
            //         }
            //         else {
            //             c.mover(dir);
            //             this.actualizarMovPos(c, dir);
            //             this.playSonidoPaso(c);
            //         }
            //     }
            //
            // }
            //
            // cambiarCharacter(CharIndex, Body, Head, Heading, Weapon, Shield, Helmet, FX, FXLoops) { // TODO: que solo cambie los que son diferentes!
            //
            //     var c = this.characters[CharIndex];
            //
            //     if (!c) {
            //         //log.error(" cambiar character inexistente ");
            //         return;
            //     }
            //     if (Heading !== c.heading) {
            //         c.cambiarHeading(Heading);
            //     }
            //     c.muerto = !!((Head === Enums.Muerto.cabezaCasper) || (Body === Enums.Muerto.cuerpoFragataFantasmal));
            //
            //     this.renderer.cambiarCharacter(c, Body, Head, Heading, Weapon, Shield, Helmet, FX, FXLoops);
            // }
            //
            // agregarCharacter(CharIndex, Body, Head, Heading, X, Y, Weapon, Shield, Helmet, FX, FXLoops, Name,
            //                  NickColor, Privileges) {
            //
            //     if (this.characters[CharIndex]) {
            //         if (CharIndex === this.player.id) {
            //             this.resetPosCharacter(this.player.id, X, Y, true);
            //             return;
            //         }
            //         log.error("tratando de agregar character habiendo un character con mismo charindex existente");
            //         return;
            //     }
            //     var nombre, clan;
            //     if (Name.indexOf("<") > 0) {
            //         nombre = Name.slice(Name, Name.indexOf("<") - 1);
            //         clan = Name.slice(Name.indexOf("<"), Name.length);
            //     }
            //     else {
            //         nombre = Name;
            //         clan = null;
            //     }
            //
            //     if ((!this.player) && ( this.username.toUpperCase() === nombre.toUpperCase())) { // mal esto, se deberia hacer comparando el charindex pero no se puede porque el server manda el char index del pj despues de crear los chars
            //         this.inicializarPlayer(CharIndex, Body, Head, Heading, X, Y, Weapon, Shield, Helmet, FX, FXLoops, nombre, clan, NickColor, Privileges);
            //         return;
            //     }
            //     var c = new Character(CharIndex, X, Y, Heading, nombre, clan);
            //
            //     if ((Head === Enums.Muerto.cabezaCasper) || (Body === Enums.Muerto.cuerpoFragataFantasmal)) {
            //         c.muerto = true;
            //     } else {
            //         c.muerto = false;
            //     }
            //
            //     this.entityGrid[X][Y][1] = c;
            //     this.characters[CharIndex] = c;
            //
            //     this.setCharacterFX(CharIndex, FX, FXLoops);
            //     this.renderer.agregarCharacter(c, Body, Head, Heading, X, Y, Weapon, Shield, Helmet, FX, FXLoops, nombre, clan,
            //         NickColor);
            // }
            //
            // agregarItem(grhIndex, gridX, gridY) { // TODO: rever si ahora que no hay que updatear hace falta tenerlos en un array
            //     var viejoItem = this.entityGrid[gridX][gridY][0];
            //     if (viejoItem) {
            //         this.sacarEntity(viejoItem);
            //     }
            //     var id = 0;
            //     while (this.items[id]) {
            //         id++;
            //     }
            //     var item = new Item(id, gridX, gridY);
            //     this.entityGrid[gridX][gridY][0] = item;
            //     this.items[id] = item;
            //     this.renderer.agregarItem(item, grhIndex);
            // }
            //
            // inicializarPlayerEnMapa() {
            //     var X = this.player.gridX;
            //     var Y = this.player.gridY;
            //     log.error("DRAW MAPA INICIAL!!! MAPA:" + this.map.numero + " X: " + X + " Y: " + Y);
            //     // --- esto para que se setee al player una pos "anterior" a la del cambio de mapa para que de la ilusion que avanza un tile (sino se deberia quedar quieto esperando el intervalo o traeria problemas en mapas donde entras mirando la salida (ademas de que pasarias siempre en la 2da pos)) ---
            //     let f = () => {
            //         if (this.playerMovement.estaMoviendose()) {
            //             var dir;
            //             switch (this.playerMovement.getDirMov()) {
            //                 case Enums.Heading.sur:
            //                     Y = Y - 1;
            //                     dir = Enums.Heading.sur;
            //                     break;
            //                 case Enums.Heading.norte:
            //                     Y = Y + 1;
            //                     dir = Enums.Heading.norte;
            //                     break;
            //                 case Enums.Heading.este:
            //                     X = X - 1;
            //                     dir = Enums.Heading.este;
            //                     break;
            //                 case Enums.Heading.oeste:
            //                     X = X + 1;
            //                     dir = Enums.Heading.oeste;
            //                     break;
            //                 default:
            //                     break;
            //             }
            //             this.playerMovement.forceCaminar(dir);
            //             this.ignorarProximoSonidoPaso = true; // que no haga sonido este paso forzado
            //         }
            //
            //         this.resetPosCharacter(this.player.id, X, Y, true);
            //         this.renderer.drawMapaIni(this.player.gridX, this.player.gridY);
            //     };
            //     this.map.onceLoaded((mapa) => {
            //         f();
            //     });
            // }
            //
            // resetPosCharacter(charIndex, gridX, gridY, noReDraw) {
            //     var c = this.characters[charIndex];
            //     if (!c) {
            //         log.error(" Reset pos de character no existente, charindex=" + charIndex);
            //         return;
            //     }
            //     if (this.entityGrid[c.gridX][c.gridY][1] === c) {
            //         this.entityGrid[c.gridX][c.gridY][1] = null;
            //     }
            //
            //     c.resetMovement();
            //     c.setGridPosition(gridX, gridY);
            //     this.entityGrid[gridX][gridY][1] = c; // TODO <- esto puede traer problemas
            //
            //     if (c === this.player) {
            //         console.log(" reseteando pos player");
            //         if (!noReDraw) {
            //             this.renderer.resetPos(gridX, gridY);
            //         }
            //         this.actualizarBajoTecho();
            //         this.actualizarIndicadorPosMapa();
            //     }
            // }
            //
            // cambiarMapa(numeroMapa) {
            //     /* todo: cambiar esto si deja de ser sync: */
            //     //this._removeAllEntitys();
            //     if (!this.map.isLoaded) {
            //         this.map.removeCallbacks();
            //     }
            //     this.map = new Mapa(numeroMapa);
            //     this.renderer.cambiarMapa(this.map);
            //
            //     this.assetManager.getMapaASync(
            //         numeroMapa,
            //         (mapData) => {
            //             if (this.map.numero === numeroMapa) {
            //                 this.map.setData(mapData);
            //             }
            //         });
            //
            //     this.playerMovement.disable();
            //     this.map.onceLoaded((mapa) => {
            //         this.playerMovement.enable();
            //         if (this.lloviendo) {
            //             if (this.map.mapaOutdoor()) {
            //                 this.assetManager.audio.IniciarSonidoLluvia();
            //                 this.renderer.createLluvia();
            //             } else {
            //                 this.assetManager.audio.finalizarSonidoLluvia();
            //                 this.renderer.removeLluvia();
            //             }
            //         }
            //     });
            //     this._removeAllEntities();
            // }
            //
            // cambiarArea(gridX, gridY) {
            //
            //     var MinLimiteX = Math.floor(gridX / 9 - 1) * 9;
            //     var MaxLimiteX = MinLimiteX + 26;
            //
            //     var MinLimiteY = Math.floor(gridY / 9 - 1) * 9;
            //     var MaxLimiteY = MinLimiteY + 26;
            //
            //     var self = this;
            //     this.forEachEntity(
            //         function (entity, index) {
            //             if (( (entity.gridY < MinLimiteY) || (entity.gridY > MaxLimiteY) ) || ( (entity.gridX < MinLimiteX) || (entity.gridX > MaxLimiteX) )) {
            //                 if (entity !== self.player) {
            //                     self.sacarEntity(entity);
            //                 }
            //             }
            //         }
            //     );
            // }
        }

        return World;
    });