
define([], function (){

    var Entity = Class.extend({
        init: function(gridX, gridY) {
            var self = this;

            this.animations = null;
            this.currentAnimation = null;
            this.shadowOffsetY = 0;

            this.setGridPosition(gridX, gridY);

            // Modes
            this.isLoaded = false;
            this.isHighlighted = false;
            this.visible = true;
            this.isFading = false;
            this.setDirty();
        },

        setPosition: function (x, y) {
            this.x = x;
            this.y = y;
            if (this.onPositionChange)
                this.onPositionChange();
        },

        setGridPosition: function(x, y) {
            this.gridX = x;
            this.gridY = y;

            this.setPosition(x * 32, y * 32);
        },

        esPosAdyacente: function(gridX,gridY){ // devulve el heading si la pos es adyacente, sino 0
            if ( (gridY === this.gridY) && (gridX === this.gridX +1 ) )
                return Enums.Heading.este;
            if ( (gridY === this.gridY) && (gridX === this.gridX -1 ) )
                return Enums.Heading.oeste;
            if ( (gridX === this.gridX) && (gridY === this.gridY -1 ) )
                return Enums.Heading.norte;
            if ( (gridX === this.gridX) && (gridY === this.gridY +1 ) )
                return Enums.Heading.sur;
            return 0;
        },

        setHighlight: function(value) {
            if(value === true) {
                this.sprite = this.sprite.silhouetteSprite;
                this.isHighlighted = true;
            }
            else {
                this.sprite = this.normalSprite;
                this.isHighlighted = false;
            }
        },

        setVisible: function(value) {
            this.visible = value;
        },

        isVisible: function() {
            return this.visible;
        },

        toggleVisibility: function() {
            if(this.visible) {
                this.setVisible(false);
            } else {
                this.setVisible(true);
            }
        },

        fadeIn: function(currentTime) {
            this.isFading = true;
            this.startFadingTime = currentTime;
        },

        blink: function(speed, callback) {
            var self = this;

            this.blinking = setInterval(function() {
                self.toggleVisibility();
            }, speed);
        },

        stopBlinking: function() {
            if(this.blinking) {
                clearInterval(this.blinking);
            }
            this.setVisible(true);
        },

        setDirty: function() {
            this.isDirty = true;
            if(this.dirty_callback) {
                this.dirty_callback(this);
            }
        },

        onDirty: function(dirty_callback) {
            this.dirty_callback = dirty_callback;
        }
    });

    return Entity;
});
