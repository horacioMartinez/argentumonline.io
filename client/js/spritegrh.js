/**
 * Created by horacio on 3/5/16.
 */


define(['lib/pixi'],
    function (PIXI) { // TODO: esto deberia heredar de movieclip? (y que un sprite no animado tambien sea un movieclip?)
        // TODO: HACER INSERTAR EN ORDEN ACA (BUSQUEDA B) Y HACER CAMBIAR Z INDEX PARA QUE VUELVA A INSERTAR!!
        // TODO: CAMBIAR Z INDEX CON EL SET POSITION!!!! y si fue creado no ordeanado que no le de bola!
        var SpriteGrh = Class.extend({
            init: function (padre, grh, loops) {
                this._x = 0;
                this._y = 0;
                this._visible = true;
                this.padre = padre;
                if (!loops)
                    this.loops = 0;
                else
                    this.loops = loops;

                this.cambiarGrh(grh);
            },

            cambiarPadre: function (padre) {

                if (this.sprite) {
                    this.padre.removeChild(this.sprite);
                    padre.addChild(this.sprite);
                }
                this.padre = padre;
            },

            remover: function () {
                if (this.sprite)
                    this.padre.removeChild(this.sprite);
                this.sprite = null;
            },

            _posicionarGrafico: function () {
                this.sprite.anchor.set(( (this.sprite.width - 32) / 2 ) / this.sprite.width, (this.sprite.height - 32) / this.sprite.height);
            },

            _setSpeed: function () {
                var duracion;
                if (this._velocidadSeteada) {
                    duracion = this._velocidadSeteada;
                }
                else {
                    duracion = this._grh.velocidad;
                }
                var fps = (this._grh.frames.length / duracion) * 1000;
                this.sprite.animationSpeed = fps / 60;
            },

            setSpeed: function (speed) {
                this._velocidadSeteada = speed;
                if (!this.sprite)
                    return;
                if (!this.sprite.animationSpeed)
                    return;
                this._setSpeed();
            },

            play: function () {
                if (this.sprite.play) {
                    this.sprite.gotoAndStop(0);
                    this.sprite.play();
                }
            },

            _initNuevoSprite: function () {
                if (this.sprite.animationSpeed) {
                    this._setSpeed();
                    if (!this.loops) {
                        this.sprite.play();
                    }
                    else {
                        this.sprite.loop = false;
                        this.sprite.onComplete = function () {
                            this.gotoAndStop(0);
                        };
                    }
                }
                this._posicionarGrafico();
                this.sprite.x = this._x;
                this.sprite.y = this._y;
                this.sprite.visible = this._visible;
                this.padre.addChild(this.sprite);

            },

            cambiarGrh: function (grh) {
                this._grh = grh;
                if (!grh) {
                    if (this.sprite)
                        this.padre.removeChild(this.sprite);
                    this.sprite = null;
                    return;
                }

                if (grh.frames) { // es un grhAnim
                    if (this.sprite) {
                        if (!this.sprite.animationSpeed) { // el viejo sprite era un sprite y pasamos a un spriteanimado
                            this.padre.removeChild(this.sprite);
                        }
                        else {
                            this.sprite.textures = grh.frames; //ya teniamos un sprite igual a este, cambiamos las texturas y salimos
                            this._setSpeed();
                            this._posicionarGrafico();
                            this.sprite.gotoAndStop(0);
                            if (!this.loops)
                                this.sprite.play();
                            return;
                        }
                    }
                    this.sprite = new PIXI.extras.MovieClip(grh.frames);
                }

                else { // nuevo sprite es grh
                    if (this.sprite) {
                        if (this.sprite.animationSpeed) { // el viejo sprite era spriteanimado
                            this.padre.removeChild(this.sprite);
                        }
                        else {
                            this.sprite.texture = grh; //cambiamos las texturas y salimos
                            this._posicionarGrafico();
                            return;
                        }
                    }
                    this.sprite = new PIXI.Sprite(grh);
                }
                this._initNuevoSprite();
            },

            onFinAnim: function (callback) {
                if (this.sprite.onComplete)
                    this.sprite.onComplete = function () {
                        this.gotoAndStop(0);
                        callback();
                    };
            },

            isVisible: function () {
                return this._visible;
            },

            setVisible: function (v) {
                this._visible = v;
                if (this.sprite)
                    this.sprite.visible = v;
            },

            getPosition: function () {
                return {x: this._x, y: this._y};
            },

            setPosition: function (x, y) {
                this._x = x;
                this._y = y;
                if (this.sprite) {
                    this.sprite.x = x;
                    this.sprite.y = y;
                }
            },

            setX: function (x) {
                this._x = x;
                if (this.sprite) {
                    this.sprite.x = x;
                }
            },

            setY: function (y) {
                this._y = y;
                if (this.sprite) {
                    this.sprite.y = y;
                }
            },

        });

        return SpriteGrh;
    });
