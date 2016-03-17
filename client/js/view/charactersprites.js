/**
 * Created by horacio on 3/2/16.
 */

define(['lib/pixi', 'view/spritegrh'], function (PIXI, SpriteGrh) {

    function CharacterSprites(Heading, bodys, heads, headOffX, headOffY, weapons, shields, helmets, font, nombre, clan) {
        /*
         Body, Head,Weapon,Shield,Helmet: vector con los grhs de los 4 headings. Cada uno de los headings puede contener un solo grh o AnimGrhs (frames de grhs + vel)
         */
        // Clase que hereda de container de pixi
        PIXI.Container.call(this);

        this.OFFSET_HEAD = -34;
        this._fxsInfinitos = [];
        this.heading = Heading;
        this.setBodys(bodys, headOffX, headOffY);
        this.setHeads(heads);
        this.setWeapons(weapons);
        this.setShields(shields);
        this.setHelmets(helmets);
        this._setNombre(font, nombre, clan);
        this._updateOrdenHijos();

    }

    CharacterSprites.prototype = Object.create(PIXI.Container.prototype);
    CharacterSprites.constructor = CharacterSprites;

    CharacterSprites.prototype.setFX = function (grh, offX, offY, loops) {
        var nuevoSprite = new SpriteGrh(grh, loops);
        this.addChild(nuevoSprite);
        nuevoSprite.setPosition(offX, offY);
        nuevoSprite.zIndex = 6;
        if (loops > 0) {
            nuevoSprite.play();
            var self = this;
            nuevoSprite.onComplete = function () {
                self.removeChild(this);
            };
        }
        else {
            this._fxsInfinitos.push(nuevoSprite);
        }
    };

    CharacterSprites.prototype.setSombraSprite = function (grh) {
        if (this._sombraSprite)
            return;
        this._sombraSprite = new SpriteGrh(grh);
        this.addChild(this._sombraSprite);
        this._sombraSprite.zIndex = -1;
        this._updateOrdenHijos();
    };

    CharacterSprites.prototype._updateSombraSpriteSize = function (grh) {
        if (this._sombraSprite) {
            var w = this.bodySprite.width < 32 ? 32 : this.bodySprite.width;
            if (w !== this._sombraSprite.width)
                this._sombraSprite.setSize(w, w);
        }
    };

    CharacterSprites.prototype.removerFxsInfinitos = function () {
        for (var i = 0; i < this._fxsInfinitos; i++) {
            this.removeChild(this._fxsInfinitos[i]);
        }
        this._fxsInfinitos = [];
    };

    CharacterSprites.prototype.setPositionChangeCallback = function (callback) {
        this._onSetPosition = callback;
    };

    CharacterSprites.prototype.setPosition = function (x, y) { // TODO: usar los getters y setters de x e y como en sprite
        this.x = x;
        this.y = y;
        if (this._onSetPosition)
            this._onSetPosition();
    };

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
        this.visible = visible;
    };

    CharacterSprites.prototype.isVisible = function () {
        return this.visible;
    };

    CharacterSprites.prototype._setNombre = function (font, nombre, clan) {
        if (this._nombre) {
            this.removeChild(this._nombre);
            this._nombre = null;
        }
        if (this._clan) {
            this.removeChild(this._clan);
            this._clan = null;
        }

        if (nombre) {
            this._nombre = new PIXI.Text(nombre, font);
            this.addChild(this._nombre);
            this._nombre.y = 32;
            this._nombre.x = this.bodySprite.x + 32 / 2 - this._nombre.width / 2;
        }
        if (clan) {
            this._clan = new PIXI.Text(clan, font);
            this.addChild(this._clan);
            this._clan.y = this._nombre.y + this._nombre.height;
            this._clan.x = this.bodySprite.x + 32 / 2 - this._clan.width / 2;
        }
    };

    CharacterSprites.prototype.cambiarHeading = function (heading) {
        if (this.heading === heading)
            return;

        this.heading = heading;
        this.setBodys(this.bodys, this.headOffX, this.headOffY, true);
        this.setHeads(this.heads);
        this.setWeapons(this.weapons);
        this.setShields(this.shields);
        this.setHelmets(this.helmets);

        this._updateOrdenHijos();
        this._updateSombraSpriteSize();
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
            this._updateSombraSpriteSize();
        }
    };

    CharacterSprites.prototype.setHeads = function (heads) {
        this.heads = heads;
        this.headSprite = this._setHeadingSprite(this.headSprite, heads);
        if (this.headSprite) {
            this.headSprite.zIndex = 4;
            this.headSprite.setPosition(this.headOffX, this.headOffY);
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
            this.helmetSprite.setPosition(this.headOffX, this.headOffY + this.OFFSET_HEAD);
        }
    };

    CharacterSprites.prototype._setHeadingSprite = function (varSprite, grhs) {
        if (!grhs) {
            if (varSprite)
                this.removeChild(varSprite);
            return null;
        }
        if (varSprite) {
            varSprite.cambiarGrh(grhs[this.heading]);
            return varSprite;
        }
        var nuevoSprite = new SpriteGrh(grhs[this.heading], 1);
        this.addChild(nuevoSprite);
        if (this._velocidad)
            nuevoSprite.setSpeed(this._velocidad);
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
            return a.zIndex - b.zIndex;
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