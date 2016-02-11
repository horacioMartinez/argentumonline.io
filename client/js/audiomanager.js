
define(['lib/howler'], function () {

    var AudioManager = Class.extend({
        init: function() {

            this.currentMusic = null;
            this.sounds = [];

            this.enabled = true;
        },

        setMusic: function(nombre){ // todo: unload cada vez que cmabia??
            if (this.currentMusic)
                this.currentMusic.unload();

            this.currentMusic = new Howl({
                urls: ['audio/musica/' + nombre + '.m4a'],
                loop:true
            });

            if (this.enabled)
                this.currentMusic.play();
        },

        playSound: function(nombre){
            if (this.enabled) {
                if (!this.sounds[nombre]) {
                    this.sounds[nombre] = new Howl({
                        urls: ['audio/sonidos/' + nombre + '.m4a']
                    })
                }
                this.sounds[nombre].play();
            }
        },

        loadSounds: function(){
            for (var i = 1; i < 212; i++) { // <-- todo numero hardcodeado!
                if (!this.sounds[i]){
                    this.sounds[i] = new Howl({
                        urls: ['audio/sonidos/' + i + '.m4a']
                    })
                }
            }

            log.info("Sonidos cargados!");
        },

        toggle: function() {
            if(this.enabled) {

                this.enabled = false;
                if(this.currentMusic)
                    this.currentMusic.pause();

            } else {
                this.enabled = true;

                if(this.currentMusic)
                    this.currentMusic.play();
            }
        },

    });

    return AudioManager;
});
