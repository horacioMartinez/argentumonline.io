/**
 * Created by horacio on 8/20/16.
 */

define(['enums', 'utils/util', 'font', 'lib/pixi', 'view/charactersprites', 'view/charactername',
        'view/charactertext', 'view/spritegrh', 'view/rendererutils'],
    function (Enums, Utils, Font, PIXI, CharacterSprites, CharacterName, CharacterText, SpriteGrh, RendererUtils) {

        class EntityRenderer {
            constructor(escala, entityContainer, entityNamesContainer, entityChatContainer, camera, assetManager) {
                this.escala = escala;
                this.entityContainer = entityContainer;
                this.entityNamesContainer = entityNamesContainer;
                this.entityChatContainer = entityChatContainer;
                this.camera = camera;
                this.assetManager = assetManager;

                this.tilesize = 32;

                this.grhs = assetManager.grhs;
                this.indices = assetManager.getIndices();
                this.armas = assetManager.getArmas();
                this.cabezas = assetManager.getCabezas();
                this.cascos = assetManager.getCascos();
                this.cuerpos = assetManager.getCuerpos();
                this.escudos = assetManager.getEscudos();
                this.fxs = assetManager.getFxs();
            }

            rescale(escala) { //TEMPORAL
                this.escala = escala;
            }

            _getHeadingsGrhs(varIndice, num) {
                if (!num) {
                    return null;
                }
                if (!varIndice[num]) {
                    return null;
                }
                if (!varIndice[num].down) {
                    return null;
                }
                var res = [];
                res[Enums.Heading.norte] = this.assetManager.getGrh(varIndice[num].up);
                res[Enums.Heading.este] = this.assetManager.getGrh(varIndice[num].right);
                res[Enums.Heading.sur] = this.assetManager.getGrh(varIndice[num].down);
                res[Enums.Heading.oeste] = this.assetManager.getGrh(varIndice[num].left);
                return res;
            }

            agregarItem(item, numGrh) {
                if (!this.assetManager.getGrh(numGrh)) {
                    log.error("grh de item invalido!");
                    return;
                }
                item.sprite = new SpriteGrh(this.assetManager.getGrh(numGrh));
                item.sprite.zOffset = -50; // para que item quede debajo de chars en misma cord Y ( para todo X)
                this.entityContainer.addChild(item.sprite);
                item.sprite.setPosition(item.x, item.y);
            }

            sacarItem(item) {
                if (!item.sprite) {
                    return;
                }
                RendererUtils.removePixiChild(this.entityContainer, item.sprite);
                item.sprite = null;
            }

            agregarCharacter(char) {
                var self = this;

                let f = function () {
                    var char = this;
                    var nombre = char.nombre;
                    var clan = char.clan;
                    var color = char.nickColor;
                    if (char.spriteNombre) {
                        RendererUtils.removePixiChild(self.entityNamesContainer, char.spriteNombre);
                        char.spriteNombre = null;
                    }
                    if (!nombre.trim()) {
                        return;
                    }
                    var fontColor = color ? Font.NickColor[Font.NickColorIndex[color]] : Font.NickColor.CIUDADANO;
                    var font = Font.NOMBRE_BASE_FONT;
                    font.fill = fontColor;
                    var nuevoNombre = new CharacterName(nombre, clan, font, self.escala);
                    self.entityNamesContainer.addChild(nuevoNombre);
                    char.spriteNombre = nuevoNombre;
                };

                char.on('nameChanged', f);

                char.emit('nameChanged');

                var sprite = new CharacterSprites();
                sprite.setSombraSprite(this.assetManager.getGrh(23651));

                this.entityContainer.addChild(sprite);

                sprite.setSpeed(char.moveSpeed); // ANIMACIONES char se setean a misma velocidad que su movimiento !!

                sprite.zOffset = -30; // para que quede debajo de los objetos del mapa en el mismo y
                char.sprite = sprite;

                char.texto = new CharacterText(this.escala);
                this.entityChatContainer.addChild(char.texto);

                char.on('positionChanged', function () {
                    var spriteX = this.x;
                    var spriteY = this.y;
                    this.sprite.setPosition(spriteX, spriteY);
                    if (this.spriteNombre) {
                        this.spriteNombre.setPosition(spriteX, spriteY);
                    }
                    if (this.texto) {
                        this.texto.setPosition(spriteX, spriteY);
                    }
                });

                char.emit('positionChanged');

                char.on('headingChanged', function () {
                    char.sprite.cambiarHeading(char.heading);
                });

                char.emit('headingChanged');

                char.on('bodyChanged', function () {
                    var Body = char.body;
                    var bodys = self._getHeadingsGrhs(self.cuerpos, Body);
                    var headOffX = 0;
                    var headOffY = 0;
                    if (self.cuerpos[Body]) {
                        headOffX = self.cuerpos[Body].offHeadX;
                        headOffY = self.cuerpos[Body].offHeadY;
                    }
                    char.sprite.setBodys(bodys, headOffX, headOffY);
                });

                char.emit('bodyChanged');

                char.on('headChanged', function () {
                    var Head = char.head;
                    var heads = self._getHeadingsGrhs(self.cabezas, Head);
                    char.sprite.setHeads(heads);
                });

                char.emit('headChanged');

                char.on('weaponChanged', function () {
                    var Weapon = char.weapon;
                    var weapons = self._getHeadingsGrhs(self.armas, Weapon);
                    char.sprite.setWeapons(weapons);
                });

                char.emit('weaponChanged');

                char.on('shieldChanged', function () {
                    var Shield = char.shield;
                    var shields = self._getHeadingsGrhs(self.escudos, Shield);
                    char.sprite.setShields(shields);
                });

                char.emit('shieldChanged');

                char.on('helmetChanged', function () {
                    var Helmet = char.helmet;
                    var helmets = self._getHeadingsGrhs(self.cascos, Helmet);
                    char.sprite.setHelmets(helmets);
                });

                char.emit('helmetChanged');

            }

            sacarCharacter(char) {
                RendererUtils.removePixiChild(this.entityContainer, char.sprite);
                char.sprite = null;
                RendererUtils.removePixiChild(this.entityChatContainer, char.texto);
                char.texto = null;

                if (char.spriteNombre) {
                    RendererUtils.removePixiChild(this.entityNamesContainer, char.spriteNombre);
                    char.spriteNombre = null;
                }
            }

            setCharacterChat(char, chat, r, g, b) {
                var color = "rgb(" + r + "," + g + "," + b + ")";
                char.texto.setChat(chat, color);
            }

            removerChat(char) {
                char.texto.removerChat();
            }

            setCharVisible(char, visible) {
                char.sprite.setVisible(visible);
                if (char.spriteNombre) {
                    char.spriteNombre.setVisible(visible);
                }
            }

            agregarCharacterHoveringInfo(char, valor, font) {
                char.texto.addHoveringInfo(valor, font);
            }

            setCharacterFX(char, FX, FXLoops) {
                var grh = this.assetManager.getGrh(this.fxs[FX].animacion);
                char.sprite.setFX(grh, this.fxs[FX].offX, this.fxs[FX].offY, FXLoops);
            }

            entityVisiblePorCamara(entity) {
                let entityRect = entity.sprite.getLocalBounds().clone();

                entityRect.x = entity.x;
                entityRect.y = entity.y;

                RendererUtils.posicionarRectEnTile(entityRect);
                return this.camera.rectVisible(entityRect);

                // var graphics = new PIXI.Graphics();
                // graphics.beginFill(0xFFFF00);
                // graphics.lineStyle(5, 0xFF0000);
                // graphics.drawRect(entityRect.x, entityRect.y, entityRect.width, entityRect.height);
                // this.gameStage.addChild(graphics);
            }

            entityEnTileVisible(entity) { // puede que no este en un tile visible pero si sea visible la entidad (para eso usar el de arriba)
                return this.camera.isVisiblePosition(entity.gridX, entity.gridY);
            }

        }
        return EntityRenderer;
    });