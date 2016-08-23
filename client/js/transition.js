define(function () {

    class Transition {
        constructor() {
            this.startValue = 0;
            this.endValue = 0;
            this.duration = 0;
            this.inProgress = false;
        }

        start(updateFunction, stopFunction, startValue, endValue, duration) {
            this.elapsed = 0;
            this.updateFunction = updateFunction;
            this.stopFunction = stopFunction;
            this.startValue = startValue;
            this.endValue = endValue;
            this.duration = duration;
            this.inProgress = true;
        }

        step(deltaTime) {
            if (this.inProgress) {
                this.elapsed += deltaTime;

                var diff = this.endValue - this.startValue;
                var i = this.startValue + ((diff / this.duration) * this.elapsed);

                if (this.elapsed >= this.duration || ( (diff > 0) && (i >= this.endValue) ) || ( (diff < 0 ) && (i <= this.endValue))) {
                    this.stop();
                    if (this.stopFunction) {
                        this.stopFunction();
                    }
                } else if (this.updateFunction) {
                    this.updateFunction(i);
                }
            }
        }

        restart(startValue, endValue) {
            this.start(this.updateFunction, this.stopFunction, startValue, endValue, this.duration);
        }

        stop() {
            this.inProgress = false;
        }
    }
    return Transition;
});
