/**
 * Created by horacio on 3/1/16.
 */

define(['spritegrh'], function (SpriteGrh) {



    function SpriteAnimado(grhAnim, loops) { // TODO: ver movieclip de pixi
        // grhanim: grhAnim.frame : vector de texturas, grhAnim.velocidad: velocidad de anim
        // Clase que hereda de sprite de pixi
        //SpriteGrh.call(this, texture, width, height);
        this.frames = grhAnim.frames;
        SpriteGrh.call(this, this.frames[0]);
        this.velocidad = grhAnim.velocidad;
        this.length = this.frames.length;
        if (!loops || loops < 0) {
            this.loops = -1;
            this.elapsedLoops = -2;
        }
        else {
            this.loops = loops;
            this.elapsedLoops = loops; //empieza sin arrancar, hay que hacer start() al menos que no tenga loops (arriba) (medio choto esto, deberia o siempre hacer start o nunca)
        }
        this.lastTime = 0;
        this.frameIndex = 0;
        this.finished = false;
    }


    SpriteAnimado.prototype = Object.create(SpriteGrh.prototype);
    SpriteAnimado.constructor = SpriteAnimado;

    SpriteAnimado.prototype.tick = function () {
        if (this.frameIndex < this.length - 1)
            this.frameIndex += 1;
        else {
            this.frameIndex = 0;
            if (this.loops > 0) {
                this.elapsedLoops++;
                if (this.elapsedLoops === this.loops) {
                    this.finished = true;
                    if (this.fin_callback)
                        this.fin_callback();
                }
            }
        }
        this.cambiarTexture(this.frames[this.frameIndex]);
    };

    SpriteAnimado.prototype.onFinAnim = function (callback) {
        this.fin_callback = callback;
    };

    SpriteAnimado.prototype.setSpeed = function (velocidad) {
        this.velocidad = velocidad;
    };

    SpriteAnimado.prototype.setLoops = function (loops) {
        this.loops = loops;
    };

    SpriteAnimado.prototype.update = function (time) {
        if (this.elapsedLoops >= this.loops)
            return false;
        var framesAumentados;
        if (this.lastTime === 0) { //primer frame ( no deberia ser 0 ? )
            framesAumentados = 1;
            this.lastTime = time;
        }

        else
            framesAumentados = (((time - this.lastTime) * this.frames.length) / this.velocidad) | 0; // |0 = math.floor = div entera

        if (framesAumentados) {
            if (framesAumentados > 10) //sacar
                log.error(" Probablemente algun problema con el timepo inicial !");
            for (var i = 0; i < (framesAumentados % (this.frames.length )); i++) {
                if (!this.finished)
                    this.tick();
                else
                    break;
            }
            this.lastTime = time;
            return true;
        } else {
            return false;
        }
    };

    SpriteAnimado.prototype.cambiarFrames = function (frames) {
        if (frames.length < this.frameIndex)
            this.frameIndex = 0;
        this.frames = frames;
        this.length = frames.length;
        this.cambiarTexture(this.frames[this.frameIndex]);
    };

    SpriteAnimado.prototype.start = function () {
        this.lastTime = 0;
        if (this.elapsedLoops > 0)
            this.elapsedLoops = 0;
        this.frameIndex = 0;
        this.finished = false;
    };

    return SpriteAnimado;
});

/*
 function Far(texture, width, height) {
 PIXI.TilingSprite.call(this, texture, width, height);
 }

 Far.constructor = Far;
 Far.prototype = Object.create(PIXI.TilingSprite.prototype);
 */
