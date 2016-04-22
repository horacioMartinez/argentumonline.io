/**
 * Created by horacio on 4/20/16.
 */

define(['lib/howler'], function (Howler) {

    var Audio = Class.extend({
        init: function () {
            this.currentMusic = null;
            this.soundEnabled = true;
            this.musicEnabled = true;
            this.soundVolume = 1.0;
            this.musicVolume = 1.0;
            this.sounds = [];
        },

        setMusic: function (nombre) { // todo: unload cada vez que cmabia?? <<- ALGO ANDA MAL y SIGUE AUMENTANDO MEMORIA, ver el task manager de chrome

            if (this.musicEnabled) {
                //if (this.currentMusic)
                //    this.currentMusic.unload();
                if (this.currentMusic)
                    this.currentMusic.stop();

                this.currentMusic = new Howler.Howl({
                    urls: ['audio/musica/' + nombre + '.m4a'],
                    loop: true,
                });
                this.currentMusic.volume(this.musicVolume);
                this.currentMusic.play();
            }

        },

        playSound: function (nombre, loop, onEnd) { // todo: mover todos los de sonido a una nueva clase de sonido
            if (this.soundEnabled) {
                if (!this.sounds[nombre]) {
                    this._cargarSonido(nombre, loop, onEnd);
                }
                this.sounds[nombre].volume(this.soundVolume);
                this.sounds[nombre].play();
            }
        },

        _cargarSonido: function (nombre, loop, onEnd) {
            if (this.sounds[nombre])
                return;

            this.sounds[nombre] = new Howler.Howl({
                urls: ['audio/sonidos/' + nombre + '.m4a']
            });

            if (loop)
                this.sounds[nombre].loop(loop);
            if (onEnd)
                this.sounds[nombre].on("onend", onEnd);
        },

        finalizarSonidoLluvia: function (bajoTecho) {
            this.stopLluvia();
            var nombre;
            if (bajoTecho)
                nombre = Enums.SONIDOS.lluvia_end_indoor;
            else
                nombre = Enums.SONIDOS.lluvia_end_outdoor;
            this.playSound(nombre);
            this.sounds[nombre].volume(0.2 * this.soundVolume);
        },

        IniciarSonidoLluvia: function (bajoTecho) {
            var nombre;
            if (bajoTecho)
                nombre = Enums.SONIDOS.lluvia_start_indoor;
            else
                nombre = Enums.SONIDOS.lluvia_start_outdoor;
            this.playSound(nombre, false, this.playLoopLluvia(bajoTecho));
            this.sounds[nombre].volume(0.2* this.soundVolume);
        },

        playLoopLluvia: function (bajoTecho) {
            this.stopLluvia();
            var nombre, sprite;
            if (bajoTecho) {
                nombre = Enums.SONIDOS.lluvia_indoor;
                sprite = {lluvia: [130, 7900]};
            }
            else {
                nombre = Enums.SONIDOS.lluvia_outdoor;
                sprite = {lluvia: [100, 4200]};
            }

            if (!this.sounds[nombre]) { //cargar con sprite para que loopee bien
                this._cargarSonido(nombre, true);
                this.sounds[nombre].sprite(sprite);
                this.sounds[nombre].volume(0.4 * this.soundVolume);
            }
            this.sounds[nombre].play("lluvia");
        },

        stopLluvia: function () {
            if (this.sounds[Enums.SONIDOS.lluvia_indoor])
                this.sounds[Enums.SONIDOS.lluvia_indoor].stop();
            if (this.sounds[Enums.SONIDOS.lluvia_outdoor])
                this.sounds[Enums.SONIDOS.lluvia_outdoor].stop();
        },

        toggleSound: function () {
            if (this.soundEnabled) {

                this.soundEnabled = false;
                if (this.currentMusic)
                    this.currentMusic.pause();

            } else {
                this.soundEnabled = true;

                if (this.currentMusic)
                    this.currentMusic.play();
            }
        },


        setSoundMuted: function (muted) {
            this.soundEnabled = !muted;
        },

        setMusicMuted: function(muted){
            this.musicEnabled = !muted;
        },

        setGlobalVolume: function(volume){
            Howler.Howler.volume(volume); // afecta tambien a los que no esten al maximo, ej global = 0.5 -> lluvia de 0.4 a 0.2
        },

        setSoundVolume: function(volume){
            this.soundVolume = volume;
        },

        setMusicVolume: function(volume){
            this.musicVolume = volume;
        },
    });

    return Audio;
});
