/**
 * Created by horacio on 3/2/16.
 */

define(['lib/pixi', 'spritegrh'], function (PIXI, SpriteGrh) {

    function CharacterSprites(Heading, bodys, heads, headOffX, headOffY, weapons, shields, helmets,font, nombre, clan) {
        /*
         Body, Head,Weapon,Shield,Helmet: vector con los grhs de los 4 headings. Cada uno de los headings puede contener un solo grh o AnimGrhs (frames de grhs + vel)
         */
        // Clase que hereda de container de pixi
        PIXI.Container.call(this);

        this._visible = true;
        this._fxsInfinitos = [];
        this.heading = Heading;
        this.setBodys(bodys, headOffX, headOffY, true);
        this.setHeads(heads, true);
        this.setWeapons(weapons, true);
        this.setShields(shields, true);
        this.setHelmets(helmets, true);
        this._setNombre(font,nombre,clan);
        this._updateOrdenHijos();

    }

    CharacterSprites.prototype = Object.create(PIXI.Container.prototype);
    CharacterSprites.constructor = CharacterSprites;

    CharacterSprites.prototype.setFX = function (grh, offX, offY, loops) {
        var nuevoSprite = new SpriteGrh(this, grh, loops);
        nuevoSprite.setPosition(offX, offY);
        nuevoSprite.setZindex(6);
        if (loops > 0) {
            nuevoSprite.play();
            nuevoSprite.onFinAnim(function () {
                nuevoSprite.remover();
            });
        }
        else {
            this._fxsInfinitos.push(nuevoSprite);
        }
    };

    CharacterSprites.prototype.setSombraSprite = function (grh) {
        if (this._sombraSprite)
            return;
        this._sombraSprite = new SpriteGrh(this, grh);
        this._sombraSprite.setVisible(this._visible);
        this._sombraSprite.setZindex(-1);

        var w = this.bodySprite.sprite.width < 32 ? 32 : this.bodySprite.sprite.width;
        this._sombraSprite.setWidth(w);
        this._sombraSprite.setHeight(w);

        this._updateOrdenHijos();
    };

    CharacterSprites.prototype.removerFxsInfinitos = function () {
        for (var i = 0; i < this._fxsInfinitos; i++) {
            this._fxsInfinitos[i].remover();
        }
        this._fxsInfinitos = [];
    };

    CharacterSprites.prototype.setPosition = function (x, y) { // TODO: usar los getters y setters de x e y como en sprite
        this.x = x;
        this.y = y;
        var gridX = Math.round(x / 32);
        var gridY = Math.round(y / 32);
        this._setZIndex(gridY * 1000 + (101 - gridX));
    };

    CharacterSprites.prototype.setOnZindexChange = function (callback) {
        this._onZindexCallback = callback;
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
        this._visible = visible;
        this._forEachHeadingSprite(function (sprite) {
            sprite.setVisible(visible);
        });
        if (this._sombraSprite)
            this._sombraSprite.setVisible(visible);
    };

    CharacterSprites.prototype.isVisible = function () {
        return this._visible;
    };

    CharacterSprites.prototype._setNombre = function (font, nombre,clan) {
        if (this._nombre){
            this.removeChild(this._nombre);
            this._nombre = null;
        }
        if (this._clan){
            this.removeChild(this._clan);
            this._clan= null;
        }

        if (nombre) {
            this._nombre = new PIXI.Text(nombre,font);
            this.addChild(this._nombre);
            this._nombre.y = 32;
            this._nombre.x = this.bodySprite.sprite.x + 32 /2 - this._nombre.width /2 ;
        }
        if (clan){
            this._clan = new PIXI.Text(clan, font);
            this.addChild(this._clan);
            this._clan.y = this._nombre.y + this._nombre.height;
            this._clan.x = this.bodySprite.sprite.x + 32 /2 - this._clan.width /2 ;
        }
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
                    this.bodySprite.setZindex(3);
                    break;
                case Enums.Heading.sur:
                    this.bodySprite.setZindex(1);
                    break;
                case Enums.Heading.este:
                    this.bodySprite.setZindex(2);
                    break;
                case Enums.Heading.oeste:
                    this.bodySprite.setZindex(1);
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
            this.headSprite.setZindex(4);
            this.headSprite.setPosition(this.headOffX, this.headOffY);
        }
    };

    CharacterSprites.prototype.setWeapons = function (weapons) {
        this.weapons = weapons;
        this.weaponSprite = this._setHeadingSprite(this.weaponSprite, weapons);
        if (this.weaponSprite) {
            switch (this.heading) {
                case Enums.Heading.norte:
                    this.weaponSprite.setZindex(2);
                    break;
                case Enums.Heading.sur:
                    this.weaponSprite.setZindex(2);
                    break;
                case Enums.Heading.este:
                    this.weaponSprite.setZindex(3);
                    break;
                case Enums.Heading.oeste:
                    this.weaponSprite.setZindex(2);
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
                    this.shieldSprite.setZindex(1);
                    break;
                case Enums.Heading.sur:
                    this.shieldSprite.setZindex(3);
                    break;
                case Enums.Heading.este:
                    this.shieldSprite.setZindex(1);
                    break;
                case Enums.Heading.oeste:
                    this.shieldSprite.setZindex(3);
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
            this.helmetSprite.setZindex(5);
            log.error(this.headOffX);
            log.error(this.headOffY);
            this.helmetSprite.setPosition(this.headOffX, this.headOffY*0);
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
        nuevoSprite.setVisible(this._visible);
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

    CharacterSprites.prototype._setZIndex = function (z) {
        if (z === this.zIndex)
            return;
        this.zIndex = z;
        if (this._onZindexCallback) {
            this._onZindexCallback();
        }
    };

    return CharacterSprites;
});