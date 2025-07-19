/**
 * Created by horacio on 3/8/16.
 */

import Font from '../font.js';
import * as PIXI from 'pixi.js';
import rendererUtils from '../view/rendererutils.js';
import TextStyle from '../view/textstyle.js';

class Consola extends PIXI.Container {
    constructor(escala) {
        super();
        
        this.DURACION_TEXTO = 5000;
        this.CANT_LINEAS = 7;

        escala = escala || 1;
        this._escala = escala;
        this.setEscala(escala);

        this._elapsedTime = 0;
    }

    setEscala(escala) {
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].style.setEscala(escala);
            this.children[i].y = this.children[0].height * i;
        }
        this._escala = escala;
    }

    update(delta) {
        this._elapsedTime += delta;

        //solo checkeo primer item porque fue el primero en aparecer
        let texto = this.children[0];
        if (!texto) {
            return;
        }
        if (texto.tiempoInicial + this.DURACION_TEXTO < this._elapsedTime) {
            this._removerTexto(texto);
        }
    }

    _removerTexto(spriteTexto) {
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].y -= spriteTexto.height;
            // aumento el tiempo restante de los que tienen poco asi no se van todos de una
            let tiempoRestante = this.children[i].tiempoInicial + this.DURACION_TEXTO - this._elapsedTime;
            if (tiempoRestante < this.DURACION_TEXTO/5 ){
                this.children[i].tiempoInicial += this.DURACION_TEXTO/5;
            }
        }
        rendererUtils.removePixiChild(this,spriteTexto);
    }

    agregarTexto(texto, font) {
        let estilo = new TextStyle(Font.CONSOLA_BASE_FONT,this._escala,font);
        let nuevoTexto = new PIXI.Text(texto, estilo);

        if (this.children.length > this.CANT_LINEAS - 1) {
            this._removerTexto(this.children[0]);
        }
        var y = 0;
        if (this.children[0]) {
            y = this.children[0].height * this.children.length;
        }
        nuevoTexto.y = y;
        nuevoTexto.tiempoInicial = this._elapsedTime;

        this.addChild(nuevoTexto);
    }
}

export default Consola;