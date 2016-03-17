
define(function() {

    var Transition = Class.extend({
        init: function() {
            this.startValue = 0;
            this.endValue = 0;
            this.duration = 0;
            this.inProgress = false;
        },

        start: function(updateFunction, stopFunction, startValue, endValue, duration) {
            this.elapsed = 0;
            this.updateFunction = updateFunction;
            this.stopFunction = stopFunction;
            this.startValue = startValue;
            this.endValue = endValue;
            this.duration = duration;
            this.inProgress = true;
            this.count = 0;
        },

        step: function(deltaTime) {
            if(this.inProgress) {
                if(this.count > 0) {
                    this.count -= 1;
                    log.debug("jumped frame");
                }
                else {
                    this.elapsed += deltaTime;

                    if(this.elapsed > this.duration) {
                        this.elapsed = this.duration;
                    }

                    var diff = this.endValue - this.startValue;
                    var i = this.startValue + ((diff / this.duration) * this.elapsed);

                    i = Math.round(i);

                    if(this.elapsed === this.duration || i === this.endValue) {
                        this.stop();
                        if(this.stopFunction) {
                            this.stopFunction();
                        }
                    }
                    else if(this.updateFunction) {
                        this.updateFunction(i);
                    }
                }
            }
        },

        restart: function(startValue, endValue) {
            this.start(this.updateFunction, this.stopFunction, startValue, endValue, this.duration);
        },

        stop: function() {
            this.inProgress = false;
        }
    });

    return Transition;
});
