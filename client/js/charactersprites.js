/**
 * Created by horacio on 3/2/16.
 */

define(['lib/pixi', 'spriteanimado', 'spritegrh'], function (PIXI, SpriteAnimado, SpriteGrh) {

    function CharacterSprites(Heading, bodys, heads, headOffX, headOffY, weapons, shields, helmets, moveSpeed) {
        /*
         Body, Head,Weapon,Shield,Helmet: vector con los grhs de los 4 headings. Cada uno de los headings puede contener un solo grh o AnimGrhs (frames de grhs + vel)
         */
        // Clase que hereda de container de pixi
        PIXI.Container.call(this);
        this.heading = Heading;
        this.velocidadMovimientos = moveSpeed;
        this.setBodys(bodys, headOffX, headOffY, true);
        this.setHeads(heads, true);
        this.setWeapons(weapons, true);
        this.setShields(shields, true);
        this.setHelmets(helmets, true);
        this._updateOrdenHijos();
    }

    CharacterSprites.prototype = Object.create(PIXI.Container.prototype);
    CharacterSprites.constructor = CharacterSprites;

    CharacterSprites.prototype.update = function (time) {
        if (!this.visible) // OJO en este checkea visible pero en el de start no?
            return;
        for (var i = 0; i < this.children.length; ++i) {
            if (this.children[i].update)
                this.children[i].update(time);
        }
    };

    CharacterSprites.prototype.start = function () {
        for (var i = 0; i < this.children.length; ++i) {
            if (this.children[i].start)
                this.children[i].start();
        }
    };

    CharacterSprites.prototype._updateOrdenHijos = function () {
        this.children.sort(function (a, b) {
            a.zIndex = a.zIndex || 0;
            b.zIndex = b.zIndex || 0;
            return b.zIndex - a.zIndex
        });
    };

    CharacterSprites.prototype.cambiarHeading = function (heading) {
        if (this.heading === heading)
            return;

        this.heading = heading;
        this.setBodys(this.bodys, this.headOffX, this.headOffY, true);
        this.setHeads(this.heads, true);
        this.setWeapons(this.weapons, true);
        this.setShields(this.shields, true);
        this.setHelmets(this.helmets, true);
        this._updateOrdenHijos();
    };


    CharacterSprites.prototype.setBodys = function (bodys, headOffX, headOffY, noUpdate) {
        this.bodys = bodys;
        this.headOffX = headOffX;
        this.headOffY = headOffY;
        this._setHeadOffset(headOffX, headOffY);
        this.bodySprite = this._getHeadingSprite(this.bodySprite, bodys);
        if (this.bodySprite) {
            switch (this.heading) {
                case Enums.Heading.norte:
                    this.bodySprite.zIndex = 3;
                    break;
                case Enums.Heading.sur:
                    this.bodySprite.zIndex = 1;
                    break;
                case Enums.Heading.este:
                    this.bodySprite.zIndex = 2;
                    break;
                case Enums.Heading.oeste:
                    this.bodySprite.zIndex = 1;
                    break;
                default:
                    log.error("character heading invalido");
                    break;
            }
        }
        if (!noUpdate)
            this._updateOrdenHijos();
    };

    CharacterSprites.prototype.setHeads = function (heads, noUpdate) {
        this.heads = heads;
        this.headSprite = this._getHeadingSprite(this.headSprite, heads);
        if (this.headSprite) {
            this.headSprite.zIndex = 4;
            this.headSprite.x = this.headOffX;
            this.headSprite.y = this.headOffY;

        }
        if (!noUpdate)
            this._updateOrdenHijos();
    };

    CharacterSprites.prototype.setWeapons = function (weapons, noUpdate) {
        this.weapons = weapons;
        this.weaponSprite = this._getHeadingSprite(this.weaponSprite, weapons);
        if (this.weaponSprite) {
            switch (this.heading) {
                case Enums.Heading.norte:
                    this.weaponSprite.zIndex = 2;
                    break;
                case Enums.Heading.sur:
                    this.weaponSprite.zIndex = 2;
                    break;
                case Enums.Heading.este:
                    this.weaponSprite.zIndex = 3;
                    break;
                case Enums.Heading.oeste:
                    this.weaponSprite.zIndex = 2;
                    break;
                default:
                    log.error("character heading invalido");
                    break;
            }
        }
        if (!noUpdate)
            this._updateOrdenHijos();
    };

    CharacterSprites.prototype.setShields = function (shields, noUpdate) {
        this.shields = shields;
        this.shieldSprite = this._getHeadingSprite(this.shieldSprite, shields);
        if (this.shieldSprite) {
            switch (this.heading) {
                case Enums.Heading.norte:
                    this.shieldSprite.zIndex = 1;
                    break;
                case Enums.Heading.sur:
                    this.shieldSprite.zIndex = 3;
                    break;
                case Enums.Heading.este:
                    this.shieldSprite.zIndex = 1;
                    break;
                case Enums.Heading.oeste:
                    this.shieldSprite.zIndex = 3;
                    break;
                default:
                    log.error("character heading invalido");
                    break;
            }
        }
        if (!noUpdate)
            this._updateOrdenHijos();
    };

    CharacterSprites.prototype.setHelmets = function (helmets, noUpdate) {
        this.helmets = helmets;
        this.helmetSprite = this._getHeadingSprite(this.helmetSprite, helmets);
        if (this.helmetSprite) {
            this.helmetSprite.zIndex = 5;
            this.helmetSprite.x = this.headOffX;
            this.helmetSprite.y = this.headOffY;
        }
        if (!noUpdate)
            this._updateOrdenHijos();
    };

    CharacterSprites.prototype._setHeadOffset = function (headOffX, headOffY) {
        if (this.headOffX)
            if ((this.headOffX === headOffX) && (this.headOffY === headOffY))
                return;

        this.headOffX = headOffX || 0;
        this.headOffY = headOffY || 0;
        if (this.headSprite) {
            this.headSprite.x = this.headOffX;
            this.headSprite.y = this.headOffY;
        }
        if (this.helmetSprite) {
            this.helmetSprite.x = this.headOffX;
            this.helmetSprite.y = this.headOffY;
        }

    };

    CharacterSprites.prototype._getHeadingSprite = function (viejoSprite, grhs) {
        if (!grhs) {
            if (viejoSprite) {
                this.removeChild(viejoSprite);
            }
            return null;
        }

        var nuevoSprite;
        if (grhs[this.heading].frames) { // es un grhAnim

            if (viejoSprite) {
                if (!viejoSprite.velocidad) { // el viejo sprite era un sprite y pasamos a un spriteanimado
                    this.removeChild(viejoSprite);
                }
                else {
                    viejoSprite.cambiarFrames(grhs[this.heading].frames); //ya teniamos un sprite igual a este, cambiamos las texturas y salimos
                    return viejoSprite;
                }
            }
            nuevoSprite = new SpriteAnimado(grhs[this.heading], 1);
            nuevoSprite.setSpeed(this.velocidadMovimientos); // cambio la vel de las animaciones para que coincidan con la de movimiento
        }

        else { // nuevo sprite es grh
            if (viejoSprite) {
                if (viejoSprite.velocidad) { // el viejo sprite era spriteanimado
                    this.removeChild(viejoSprite);
                }
                else {
                    viejoSprite.cambiarTexture(grhs[this.heading]); //cambiamos las texturas y salimos
                    return viejoSprite;
                }
            }
            nuevoSprite = new SpriteGrh(grhs[this.heading]);
        }
        this.addChild(nuevoSprite);
        return nuevoSprite;
    };

    return CharacterSprites;
});