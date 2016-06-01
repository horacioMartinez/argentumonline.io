/**
 * Created by horacio on 4/20/16.
 */

define(['enums', 'lib/howler'], function (Enums, Howler) {

    class Audio {
        constructor() {
            this.currentMusic = null;
            this.soundEnabled = true;
            this.musicEnabled = true;
            this.soundVolume = 1.0;
            this.musicVolume = 1.0;
            this.sounds = [];

            this.mutedMusicName = null;
        }

        setMusic(nombre) { // todo: unload cada vez que cmabia?? <<- ALGO ANDA MAL y SIGUE AUMENTANDO MEMORIA, ver el task manager de chrome

            if (this.musicEnabled) {
                if (this.currentMusic)
                    this.currentMusic.stop();

                this.currentMusic = new Howler.Howl({
                    urls: ['audio/musica/' + nombre + '.m4a'],
                    loop: true
                });
                this.currentMusic.play();
                this.currentMusic.volume(this.musicVolume);
            }
            else {
                this.mutedMusicName = nombre;
            }

        }

        playSound(nombre, loop, onEnd) {
            if (this.soundEnabled) {
                if (!this.sounds[nombre]) {
                    this._cargarSonido(nombre, loop, onEnd);
                }
                this.sounds[nombre].play();
                this.sounds[nombre].volume(this.soundVolume);
            }
        }

        _cargarSonido(nombre, loop, onEnd) {
            if (this.sounds[nombre])
                return;

            this.sounds[nombre] = new Howler.Howl({
                urls: ['audio/sonidos/' + nombre + '.m4a']
            });

            if (loop)
                this.sounds[nombre].loop(loop);
            if (onEnd)
                this.sounds[nombre].on("onend", onEnd);
        }

        finalizarSonidoLluvia(bajoTecho) {
            this.stopLluvia();
            var nombre;
            if (bajoTecho)
                nombre = Enums.SONIDOS.lluvia_end_indoor;
            else
                nombre = Enums.SONIDOS.lluvia_end_outdoor;
            this.playSound(nombre);
            this.sounds[nombre].volume(0.2 * this.soundVolume);
        }

        IniciarSonidoLluvia(bajoTecho) {
            var nombre;
            if (bajoTecho)
                nombre = Enums.SONIDOS.lluvia_start_indoor;
            else
                nombre = Enums.SONIDOS.lluvia_start_outdoor;
            this.playSound(nombre, false, this.playLoopLluvia(bajoTecho));
            this.sounds[nombre].volume(0.2 * this.soundVolume);
        }

        playLoopLluvia(bajoTecho) {
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
            }
            this.sounds[nombre].play("lluvia");
            this.sounds[nombre].volume(0.4 * this.soundVolume);
        }

        stopLluvia() {
            if (this.sounds[Enums.SONIDOS.lluvia_indoor])
                this.sounds[Enums.SONIDOS.lluvia_indoor].stop();
            if (this.sounds[Enums.SONIDOS.lluvia_outdoor])
                this.sounds[Enums.SONIDOS.lluvia_outdoor].stop();
        }

        toggleSound() {
            if (this.soundEnabled) {

                this.soundEnabled = false;
                if (this.currentMusic)
                    this.currentMusic.pause();

            } else {
                this.soundEnabled = true;

                if (this.currentMusic)
                    this.currentMusic.play();
            }
        }

        setSoundMuted(muted) {
            this.soundEnabled = !muted;
        }

        setMusicMuted(muted) {
            this.musicEnabled = !muted;
            if (this.musicEnabled) {
                if (this.mutedMusicName)
                    this.setMusic(this.mutedMusicName);
            } else {
                if (this.currentMusic)
                    this.currentMusic.stop();
            }
        }

        setGlobalVolume(volume) {
            Howler.Howler.volume(volume); // afecta tambien a los que no esten al maximo, ej global = 0.5 -> lluvia de 0.4 a 0.2
        }

        setSoundVolume(volume) {
            this.soundVolume = volume;
        }

        setMusicVolume(volume) {
            this.musicVolume = volume;
            if (this.currentMusic)
                this.currentMusic.volume(this.musicVolume);
        }

        stopMusic() {
            if (this.currentMusic)
                this.currentMusic.stop();
        }
    }

    return Audio;
});
