/**
 * Created by horacio on 3/5/16.
 */


define(['lib/pixi'],
    function (PIXI) { // TODO: esto deberia heredar de movieclip? (y que un sprite no animado tambien sea un movieclip?) <- SI
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
                if (this.sprite) {
                    this.padre.removeChild(this.sprite);
                }
                this.sprite = null;
            },

            _posicionarGrafico: function () {
                this.sprite.anchor.set(( (this.sprite.width - 32) / 2 ) / this.sprite.width, (this.sprite.height - 32)/ this.sprite.height);
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
                if (this._zIndex)
                    this.sprite.zIndex = this._zIndex;
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
                    if (this.padre.ordenado) {
                        var gridX = Math.floor(x / 32);
                        var gridY = Math.floor(y / 32);
                        this._setOrden(gridX, gridY);

                    }
                }
            },

            setX: function (x) {
                this._x = x;
                if (this.sprite) {
                    this.sprite.x = x;
                    if (this.padre.ordenado) {
                        var gridX = Math.floor(x / 32);
                        var gridY = Math.floor(this._y / 32);
                        this._setOrden(gridX, gridY);
                    }
                }
            },

            setY: function (y) {
                this._y = y;
                if (this.sprite) {
                    this.sprite.y = y;
                    if (this.padre.ordenado) {
                        var gridX = Math.round(this._x / 32);
                        var gridY = Math.round(y / 32);
                        this._setOrden(gridX, gridY);
                    }
                }
            },

            setWidth: function (w) {
                if (this.sprite) {
                    this.sprite.width = w;
                    this._posicionarGrafico();
                }
            },

            setHeight: function (h) {
                if (this.sprite) {
                    this.sprite.height = h;
                    this._posicionarGrafico();
                }
            },

            setZindex: function (z) {
                this._zIndex = z;
                if (this.sprite)
                    this.sprite.zIndex = z;
            },

            _setOrden: function (gridX, gridY) {
                if (this._ordenX === gridX && this._ordenY === gridY)
                    return;
                this._ordenX = gridX;
                this._ordenY = gridY;
                var z = gridY * 1000 + (101 - gridX);
                this.sprite.zIndex = z;
                /*
                 var res = binarySearch(this.padre.children, this, function (a, b) {
                 a.zIndex = a.zIndex || 0;
                 b.zIndex = b.zIndex || 0;
                 return a.zIndex - b.zIndex;
                 });
                 this.padre.setChildIndex(this.sprite, res.index);*/
            },

        });

        return SpriteGrh;
    });
