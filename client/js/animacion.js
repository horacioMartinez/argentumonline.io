define(function () {

    var Animacion = Class.extend({
        init: function (frames, velocidad, loops) {
            this.frames = frames;
            this.velocidad = velocidad;
            this.length = frames.length;
            if (!loops) {
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
        },

        getCurrentFrame: function () {
            return this.frames[this.frameIndex];
        },

        tick: function () {
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
        },

        onFinAnim: function (callback) {
            this.fin_callback = callback;
        },

        setSpeed: function (velocidad) {
            this.velocidad = velocidad;
        },

        setLoops: function (loops/*,endcont_callback*/) {
            this.loops = loops;
            //this.endcount_callback = onEndCount;
        },

        update: function (time) {
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
        },

        start: function () {
            this.lastTime = 0;
            this.elapsedLoops = 0;
            this.frameIndex = 0;
            this.finished = false;
        }
    });

    return Animacion;
});
