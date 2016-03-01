/**
 * Created by horacio on 3/1/16.
 */

define(['lib/pixi'], function (PIXI) {



    function SpriteAnimado(frames, velocidad, loops) {

        // Clase que hereda de sprite de pixi
        //PIXI.Sprite.call(this, texture, width, height);
        PIXI.Sprite.call(this, PIXI.loader.resources[frames[0] + ""].texture);
        this.frames = frames;
        this.velocidad = velocidad;
        this.length = frames.length;
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
        this.isDirty = true;
        this.finished = false;

        //this.sprite = new PIXI.Sprite(PIXI.loader.resources[frames[this.frameIndex] + ""].texture);
        //this.sprite2 = new PIXI.Sprite(PIXI.loader.resources['5'].texture);
    }


    SpriteAnimado.prototype = Object.create(PIXI.Sprite.prototype);
    SpriteAnimado.constructor = SpriteAnimado;

    SpriteAnimado.prototype.tick = function () {
        log.error("TICK"); // sacame
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
        this.texture = PIXI.loader.resources[this.frames[this.frameIndex] + ""].texture;
    };

    SpriteAnimado.prototype.onFinAnim = function (callback) {
        this.fin_callback = callback;
    };

    SpriteAnimado.prototype.setSpeed = function (velocidad) {
        this.velocidad = velocidad;
    };

    SpriteAnimado.prototype.setLoops = function (loops/*,endcont_callback*/) {
        this.loops = loops;
        //this.endcount_callback = onEndCount;
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
                console.log(" Probablemente algun problema con el timepo inicial !");
            for (var i = 0; i < (framesAumentados % (this.frames.length )); i++) {
                if (!this.finished)
                    this.tick();
                else
                    break;
            }
            this.lastTime = time;
            this.isDirty = true;
            return true;
        } else {
            return false;
        }
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
