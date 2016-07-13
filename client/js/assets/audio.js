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

            this.MUSIC_PATH = 'audio/musica/';
            this.SOUND_PATH = 'audio/sonidos/';
            this.MAIN_EXTENSION = '.webm';
            this.SECONDARY_EXTENSION = '.mp3';

            this.mutedMusicName = null;
        }

        setMusic(nombre) { // todo: unload cada vez que cmabia??
            if (this.musicEnabled) {
                if (this.currentMusic) {
                    let fadingOutMusic = this.currentMusic;
                    fadingOutMusic.fade(fadingOutMusic.volume(), 0, 1000);
                    fadingOutMusic.once("fade", () => {
                        fadingOutMusic.stop();
                    });
                    //this.currentMusic.stop();
                }

                this.currentMusic = new Howler.Howl({
                    src: [this.MUSIC_PATH + nombre + this.MAIN_EXTENSION, this.MUSIC_PATH + nombre + this.SECONDARY_EXTENSION],
                    loop: true
                });

                // TODO: fade y que se ejecuten los dos la mismo tiempo? (por alguna rezon no anda)
                //this.currentMusic.fade(0,this.musicVolume,1000);
                this.currentMusic.volume(this.musicVolume);
                this.currentMusic.play();
            }
            else {
                this.mutedMusicName = nombre;
            }

        }

        playSound(nombre, loop, onEnd, volume) {
            if (this.soundEnabled) {
                volume = volume || 1;
                if (!this.sounds[nombre]) {
                    this._cargarSonido(nombre, loop, onEnd);
                }
                this.sounds[nombre].volume(this.soundVolume * volume);
                this.sounds[nombre].play();
            }
        }

        _cargarSonido(nombre, loop, onEnd, sprite) {
            if (this.sounds[nombre]) {
                return;
            }

            this.sounds[nombre] = new Howler.Howl({
                src: [this.SOUND_PATH + nombre + this.MAIN_EXTENSION, this.SOUND_PATH + nombre + this.SECONDARY_EXTENSION],
                sprite: sprite
            });

            if (loop) {
                this.sounds[nombre].loop(loop);
            }
            if (onEnd) {
                this.sounds[nombre].on("onend", onEnd);
            }
        }

        finalizarSonidoLluvia(bajoTecho) {
            this.stopLluvia();
            if (!this.soundEnabled) {
                return;
            }
            var nombre;
            if (bajoTecho) {
                nombre = Enums.SONIDOS.lluvia_end_indoor;
            } else {
                nombre = Enums.SONIDOS.lluvia_end_outdoor;
            }
            this.playSound(nombre, false, null, 0.2);
        }

        IniciarSonidoLluvia(bajoTecho) {
            var nombre;
            if (!this.soundEnabled) {
                return;
            }
            if (bajoTecho) {
                nombre = Enums.SONIDOS.lluvia_start_indoor;
            } else {
                nombre = Enums.SONIDOS.lluvia_start_outdoor;
            }
            this.playSound(nombre, false, this.playLoopLluvia(bajoTecho), 0.2);
        }

        playLoopLluvia(bajoTecho) {
            this.stopLluvia();
            if (!this.soundEnabled) {
                return;
            }
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
                this._cargarSonido(nombre, true, null, sprite);
            }
            this.sounds[nombre].volume(0.4 * this.soundVolume);
            this.sounds[nombre].play("lluvia");
        }

        stopLluvia() {
            if (this.sounds[Enums.SONIDOS.lluvia_indoor]) {
                this.sounds[Enums.SONIDOS.lluvia_indoor].stop();
            }
            if (this.sounds[Enums.SONIDOS.lluvia_outdoor]) {
                this.sounds[Enums.SONIDOS.lluvia_outdoor].stop();
            }
        }

        toggleSound() {
            if (this.soundEnabled) {

                this.soundEnabled = false;
                if (this.currentMusic) {
                    this.currentMusic.pause();
                }

            } else {
                this.soundEnabled = true;

                if (this.currentMusic) {
                    this.currentMusic.play();
                }
            }
        }

        setSoundMuted(muted) {
            this.soundEnabled = !muted;
        }

        setMusicMuted(muted) {
            this.musicEnabled = !muted;
            if (this.musicEnabled) {
                if (this.mutedMusicName) {
                    this.setMusic(this.mutedMusicName);
                }
            } else {
                if (this.currentMusic) {
                    this.currentMusic.stop();
                }
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
            if (this.currentMusic) {
                this.currentMusic.volume(this.musicVolume);
            }
        }

        stopMusic() {
            if (this.currentMusic) {
                this.currentMusic.stop();
            }
        }
    }

    return Audio;
});
