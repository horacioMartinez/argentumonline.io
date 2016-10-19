/**
 * Created by horacio on 4/20/16.
 */

define(['enums', 'lib/howler', 'assets/audioclima'], function (Enums, Howler, AudioClima) {

    class Audio {
        constructor() {
            this.clima = new AudioClima(this);

            this.currentMusic = null;
            this.soundEnabled = true;
            this.musicEnabled = true;
            this.soundVolume = 1.0;
            this.musicVolume = 1.0;
            this._sounds = {};

            this.MUSIC_PATH = 'audio/musica/';
            this.SOUND_PATH = 'audio/sonidos/';
            this.MAIN_EXTENSION = '.webm';
            this.SECONDARY_EXTENSION = '.mp3';

            this.currentMusicName = null;
        }

        reset() {
            for (let sound in this._sounds) {
                if (this._sounds.hasOwnProperty(sound)) {
                    this._sounds[sound].stop();
                }
            }
            if (this.currentMusic) {
                this.currentMusic.stop();
            }
            this.currentMusicName = null;
        }

        setMusic(nombre) {
            if (!nombre || (nombre === this.currentMusicName && this.currentMusic && this.currentMusic.playing())) {
                return;
            }
            this.currentMusicName = nombre;

            if (this.musicEnabled) {
                if (this.currentMusic) {
                    let fadingOutMusic = this.currentMusic;
                    fadingOutMusic.fade(fadingOutMusic.volume(), 0, 1000);
                    fadingOutMusic.once("fade", () => {
                        fadingOutMusic.stop();
                    });
                }
                this.currentMusic = new Howler.Howl({
                    src: [this.MUSIC_PATH + nombre + this.MAIN_EXTENSION, this.MUSIC_PATH + nombre + this.SECONDARY_EXTENSION],
                    loop: true
                });

                this.currentMusic.volume(this.musicVolume);
                this.currentMusic.play();
            }
        }

        playSound(nombre, loop, onEnd, volume, spriteNameToPlay) {
            if (this.soundEnabled) {
                volume = volume || 1;
                if (!this._sounds[nombre]) {
                    this.cargarSonido(nombre, onEnd);
                }
                this._sounds[nombre].loop(loop);
                this._sounds[nombre].volume(this.soundVolume * volume);
                if (spriteNameToPlay) {
                    this._sounds[nombre].play(spriteNameToPlay);
                } else {
                    this._sounds[nombre].play();
                }
            }
        }

        stopSound(nombre) {
            if (this._sounds[nombre]) {
                this._sounds[nombre].stop();
            }
        }

        cargarSonido(nombre, onEnd, sprite) {
            if (this._sounds[nombre]) {
                return;
            }

            this._sounds[nombre] = new Howler.Howl({
                src: [this.SOUND_PATH + nombre + this.MAIN_EXTENSION, this.SOUND_PATH + nombre + this.SECONDARY_EXTENSION],
                sprite: sprite
            });
            if (onEnd) {
                this._sounds[nombre].on("onend", onEnd);
            }
        }

        isLoaded(nombre) {
            return !!this._sounds[nombre];
        }

        toggleSound() {
            if (this.soundEnabled) {
                this.soundEnabled = false;
                this.setMusicMuted(false);

            } else {
                this.soundEnabled = true;
                this.setMusicMuted(true);
            }
        }

        setSoundMuted(muted) {
            this.soundEnabled = !muted;
        }

        setSoundVolume(volume) {
            this.soundVolume = volume;
        }

        setMusicMuted(muted) {
            this.musicEnabled = !muted;
            if (this.musicEnabled) {
                if (this.currentMusicName) {
                    this.setMusic(this.currentMusicName);
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
