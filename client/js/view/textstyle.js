/**
 * Created by horacio on 8/30/16.
 */

/**
 * Created by horacio on 3/10/16.
 */

define(['lib/pixi'], function (PIXI) {

    class TextStyle extends PIXI.TextStyle {
        constructor(baseFont, escala, font) {
            if (font){
                $.extend(baseFont,baseFont,font);
            }
            super(baseFont);
            this._font = baseFont;
            escala = escala || 1;
            if (escala !== 1) {
                this.setEscala(escala);
            }
            this._escala = escala;
        }

        setEscala(scale) { //escala con respecto a base_font
            this._escala = scale;

            let resizeFunc = function (target) {
                if (!isNaN(target)) {
                    target *= scale;
                }
                return target;
            };

            let font = this._font;
            if (font.dropShadowBlur) {
                this.dropShadowBlur = resizeFunc(font.dropShadowBlur);
            }
            if (font.dropShadowDistance) {
                this.dropShadowDistance = resizeFunc(font.dropShadowDistance);
            }
            if (font.fontSize) {
                this.fontSize = resizeFunc(font.fontSize);
            }
            if (font.letterSpacing) {
                this.letterSpacing = resizeFunc(font.letterSpacing);
            }
            if (font.lineHeight) {
                this.lineHeight = resizeFunc(font.lineHeight);
            }
            if (font.miterLimit) {
                this.miterLimit = resizeFunc(font.miterLimit);
            }
            if (font.padding) {
                this.padding = resizeFunc(font.padding);
            }
            if (font.strokeThickness) {
                this.strokeThickness = resizeFunc(font.strokeThickness);
            }
        }

        // setFont(font) {
        //     if (this._font !== font) {
        //         this._font = font;
        //         $.extend(this._font, this._defaults, this._font, font);
        //         Object.assign(this, this._font);
        //         this.setEscala(this._escala);
        //     }
        // }
    }
    return TextStyle;
});
