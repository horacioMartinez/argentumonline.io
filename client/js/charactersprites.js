/**
 * Created by horacio on 3/2/16.
 */

define(['lib/pixi', 'spritegrh'], function (PIXI, SpriteGrh) {

    function CharacterSprites(Heading, bodys, heads, headOffX, headOffY, weapons, shields, helmets) {
        /*
         Body, Head,Weapon,Shield,Helmet: vector con los grhs de los 4 headings. Cada uno de los headings puede contener un solo grh o AnimGrhs (frames de grhs + vel)
         */
        // Clase que hereda de container de pixi
        PIXI.Container.call(this);
        this.heading = Heading;
        this.setBodys(bodys, headOffX, headOffY, true);
        this.setHeads(heads, true);
        this.setWeapons(weapons, true);
        this.setShields(shields, true);
        this.setHelmets(helmets, true);
        this._updateOrdenHijos();
        this._visible = true;
    }

    CharacterSprites.prototype = Object.create(PIXI.Container.prototype);
    CharacterSprites.constructor = CharacterSprites;

    CharacterSprites.prototype.setSpeed = function (vel) {
        this._velocidad = vel;
        this._forEachHeadingSprite(function (sprite) {
            sprite.setSpeed(vel);
        });
    };

    CharacterSprites.prototype.play = function () {
        this._forEachHeadingSprite(function (sprite) {
            sprite.play();
        });
    };

    CharacterSprites.prototype.setVisible = function (visible) {
        this._visible = visible;
        this._forEachHeadingSprite(function (sprite) {
            sprite.setVisible(visible);
        });
    };

    CharacterSprites.prototype.isVisible = function () {
        return this._visible;
    };

    CharacterSprites.prototype.update = function (time) {
        log.error("aca");
    };

    CharacterSprites.prototype.start = function () {
        log.error("aca");
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

    CharacterSprites.prototype.setBodys = function (bodys, headOffX, headOffY) {
        this.bodys = bodys;
        this._setHeadOffset(headOffX, headOffY);

        this.bodySprite = this._setHeadingSprite(this.bodySprite, bodys);

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
    };

    CharacterSprites.prototype.setHeads = function (heads) {
        this.heads = heads;
        this.headSprite = this._setHeadingSprite(this.headSprite, heads);
        if (this.headSprite) {
            this.headSprite.zIndex = 4;
            this.headSprite.setPosition(this.headOffX, this.headOffY)

        }
    };

    CharacterSprites.prototype.setWeapons = function (weapons) {
        this.weapons = weapons;
        this.weaponSprite = this._setHeadingSprite(this.weaponSprite, weapons);
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
    };

    CharacterSprites.prototype.setShields = function (shields) {
        this.shields = shields;
        this.shieldSprite = this._setHeadingSprite(this.shieldSprite, shields);
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
    };

    CharacterSprites.prototype.setHelmets = function (helmets) {
        this.helmets = helmets;
        this.helmetSprite = this._setHeadingSprite(this.helmetSprite, helmets);
        if (this.helmetSprite) {
            this.helmetSprite.zIndex = 5;
            this.helmetSprite.setPosition(this.headOffX, this.headOffY);
        }
    };

    CharacterSprites.prototype._setHeadingSprite = function (varSprite, grhs) {
        if (!grhs) {
            if (varSprite)
                varSprite.remover();
            return null;
        }
        if (varSprite) {
            varSprite.cambiarGrh(grhs[this.heading]);
            return varSprite;
        }
        var nuevoSprite = new SpriteGrh(this, grhs[this.heading], 1);
        if (this._velocidad)
            nuevoSprite.setSpeed(this._velocidad);
        nuevoSprite.visible = this._visible;
        return nuevoSprite;
    };

    CharacterSprites.prototype._setHeadOffset = function (headOffX, headOffY) {
        if (this.headOffX)
            if ((this.headOffX === headOffX) && (this.headOffY === headOffY))
                return;

        this.headOffX = headOffX || 0;
        this.headOffY = headOffY || 0;
        if (this.headSprite) {
            this.headSprite.setPosition(this.headOffX, this.headOffY);
        }
        if (this.helmetSprite) {
            this.helmetSprite.setPosition(this.headOffX, this.headOffY)
        }

    };

    CharacterSprites.prototype._updateOrdenHijos = function () { // TODO: al agregar en vez de esto hacer insercion por busqueda binaria con lso z index
        this.children.sort(function (a, b) {
            a.zIndex = a.zIndex || 0;
            b.zIndex = b.zIndex || 0;
            return b.zIndex - a.zIndex
        });
    };

    CharacterSprites.prototype._forEachHeadingSprite = function (callback) {
        if (this.bodySprite)
            callback(this.bodySprite);
        if (this.headSprite)
            callback(this.headSprite);
        if (this.weaponSprite)
            callback(this.weaponSprite);
        if (this.shieldSprite)
            callback(this.shieldSprite);
        if (this.helmetSprite)
            callback(this.helmetSprite);
    };

    return CharacterSprites;
});