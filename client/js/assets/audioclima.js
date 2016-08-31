/**
 * Created by horacio on 8/31/16.
 */

define(['enums', 'lib/howler'], function (Enums, Howler) {

    class AudioClima {
        constructor(audio) {
            this.audio = audio;

            this._bajoTecho = null;
            this._outdoor = null;
            this._lloviendo = false;
        }

        reset() {
            this._lloviendo = false;
            //this._stopLluvia();
        }

        setBajoTecho(bajoTecho) {
            if (this._bajoTecho !== bajoTecho) {
                this._bajoTecho = bajoTecho;
                if (this._lloviendo) {
                    this._playLoopLluvia();
                }
            }
        }

        setOutdoor(outdoor) {
            if (this._outdoor !== outdoor) {
                this._outdoor = outdoor;
                if (this._outdoor) {
                    if (this._lloviendo) {
                        this._playLoopLluvia();
                    }
                } else {
                    if (this._lloviendo) {
                        this._finLluvia();
                    }
                }
            }
        }

        toogleLluvia() {
            this._lloviendo = !this._lloviendo;
            if (this._lloviendo) {
                this._iniciarLluvia();
            } else {
                this._finLluvia();
            }
        }

        _finLluvia() {
            this._stopLluvia();
            if (!this._outdoor) {
                return;
            }
            var nombre;
            if (this._bajoTecho) {
                nombre = Enums.SONIDOS.lluvia_end_indoor;
            } else {
                nombre = Enums.SONIDOS.lluvia_end_outdoor;
            }
            this.audio.playSound(nombre, false, null, 0.2);
        }

        _iniciarLluvia() {
            if (!this._outdoor) {
                return;
            }
            var nombre;
            if (this._bajoTecho) {
                nombre = Enums.SONIDOS.lluvia_start_indoor;
            } else {
                nombre = Enums.SONIDOS.lluvia_start_outdoor;
            }
            this.audio.playSound(nombre, false, this._playLoopLluvia(), 0.2);
        }

        _playLoopLluvia() {
            this._stopLluvia();
            var nombre, sprite;
            if (this._bajoTecho) {
                nombre = Enums.SONIDOS.lluvia_indoor;
                sprite = {lluvia: [130, 7900]};
            }
            else {
                nombre = Enums.SONIDOS.lluvia_outdoor;
                sprite = {lluvia: [100, 4200]};
            }

            if (!this.audio.isLoaded(nombre)) { //cargar con sprite para que loopee bien
                this.audio.cargarSonido(nombre, null, sprite);
            }
            this.audio.playSound(nombre, true, null, 0.4, "lluvia");
        }

        _stopLluvia() {
            this.audio.stopSound(Enums.SONIDOS.lluvia_indoor);
            this.audio.stopSound(Enums.SONIDOS.lluvia_outdoor);
            this.audio.stopSound(Enums.SONIDOS.lluvia_start_outdoor);
            this.audio.stopSound(Enums.SONIDOS.lluvia_start_indoor);
        }
    }

    return AudioClima;
});