
define(function() {

    var InfoManager = Class.extend({
        init: function(game) {
            this.game = game;
            this.damageInfos = {};
            this.consoleInfos = {};
            this.destroyQueue = [];
            this.consolaDirty = false;
        },

        addDamageInfo: function(value, char, type, duration) {
            var time = this.game.currentTime,
                id = time+""+(isNaN(value*1)?value:value*1)+""+char.x+""+char.y,
                self = this,
                info = new DamageInfo(id, value,char, (duration)?duration:1000, type);
            info.onDestroy(function(id) {
                self.destroyQueue.push(id);
            });
            this.damageInfos[id] = info;
        },

        addConsoleInfo: function(texto){
            var time = this.game.currentTime,
                id = time+""+texto,
                self = this;

            var info = new ConsoleInfo(id, texto, 5, 60);
            info.onDestroy(function(id) {
                self.destroyQueue.push(id);
                self.consolaDirty = true;
            });

            this.forEachConsoleInfo(function(info) {
                info.y = info.y - 15;
                if (info.y < 0 )
                    info.destroy();
            });

            this.consoleInfos[id] = info;
            this.consolaDirty = true;
        },

        forEachConsoleInfo: function(callback){
            var self = this;

            _.each(this.consoleInfos, function(info, id) {
                callback(info);
            });
        },

        forEachDamageInfo: function(callback){
            var self = this;

            _.each(this.damageInfos, function(info, id) {
                callback(info);
            });
        },

        update: function(time) {
            var self = this;

            this.forEachConsoleInfo(function(info) {
                info.update(time);
                if (info.dirty) {
                    info.dirty = false;
                    self.consolaDirty = true;
                }
            });

            this.forEachDamageInfo(function(info) {
                info.update(time);
            });

            _.each(this.destroyQueue, function(id) {
                if (self.consoleInfos[id])
                    delete self.consoleInfos[id];
                else if (self.damageInfos[id])
                    delete self.damageInfos[id];
            });
            this.destroyQueue = [];
        }
    });


    var damageInfoColors = {
        "received": {
            fill: "rgb(255, 50, 50)",
            stroke: "rgb(255, 180, 180)"
        },
        "inflicted": {
            fill: "white",
            stroke: "#373737"
        },
        "healed": {
            fill: "rgb(80, 255, 80)",
            stroke: "rgb(50, 120, 50)"
         },
        "health": {
            fill: "white",
            stroke: "#373737"
        },
        "exp": {
            fill: "rgb(80, 80, 255)",
            stroke: "rgb(50, 50, 255)"
       }
    };


    var DamageInfo = Class.extend({
        DURATION: 1000,

        init: function(id, value, char, duration, type) {
            this.id = id;
            this.value = value;
            this.duration = duration;
            this.char = char;
            this.opacity = 1.0;
            this.lastTime = 0;
            this.speed = 100;
            this.fillColor = damageInfoColors[type].fill;
            this.strokeColor = damageInfoColors[type].stroke;
            this.centered = true;
        },

        isTimeToAnimate: function(time) {
            return (time - this.lastTime) > this.speed;
        },

        update: function(time) {
            if(this.isTimeToAnimate(time)) {
                this.lastTime = time;
                this.tick();
            }
        },

        tick: function() {
            /*if(this.type !== 'health')*/ this.y -= 1;
            this.opacity -= (70/this.duration);
            if(this.opacity < 0) {
                this.destroy();
            }
        },

        onDestroy: function(callback) {
            this.destroy_callback = callback;
        },

        destroy: function() {
            if(this.destroy_callback) {
                this.destroy_callback(this.id);
            }
        }
    });

    var ConsoleInfo = Class.extend({

        init: function(id, msg,x,y) {
            this.id = id;
            this.value = msg;
            this.duration = 6000;
            this.duration_before_fade = 4000;
            this.elapsed_duration = 0;
            this.x = x;
            this.y = y;
            this.opacity = 1.0;
            this.lastTime = 0;
            this.speed = 200;
            this.fillColor = "white";
            this.strokeColor = "#373737";
            this.centered = false;
            this.dirty = true;
            this.valid = true;
        },

        isTimeToAnimate: function(time) {
            return (time - this.lastTime) > this.speed;
        },

        update: function(time) {
            if(this.isTimeToAnimate(time)) {
                this.lastTime = time;
                this.tick(this.speed);
            }
        },

        tick: function(delta) {
            //if(this.type !== 'health') this.y -= 1;
            this.elapsed_duration += delta;
            if (this.elapsed_duration > this.duration_before_fade) {
                this.opacity -= (this.elapsed_duration / 5000);
                this.dirty = true;
            }
            if( (this.opacity < 0) || (this.elapsed_duration > this.duration)) {
                this.dirty = true;
                this.destroy();
            }
        },

        onDestroy: function(callback) {
            this.destroy_callback = callback;
        },

        destroy: function() {
            this.valid = false;
            if(this.destroy_callback) {
                this.destroy_callback(this.id);
            }
        }
    });

    return InfoManager;
});
