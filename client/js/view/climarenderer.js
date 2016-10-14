/**
 * Created by horacio on 8/20/16.
 */

define(['enums', 'lib/pixi','view/spritegrh'], function (Enums, PIXI, SpriteGrh) {
    
    class ClimaRenderer {
        constructor(escala, parentContainer, assetManager, /*TEMPORAL*/ pixiRenderer /*TEMPORAL*/) {
            this.escala = escala;
            /*TEMPORAL*/
            this.pixiRenderer = pixiRenderer;
            /*TEMPORAL*/
            this.assetManager = assetManager;
            this.parentContainer = parentContainer;
            this.containerLluvia = null;
        }

        removeLluvia() {
            if (!this.containerLluvia) {
                return;
            }
            this.parentContainer.removeChild(this.containerLluvia);
            this.gotas = null;
            this.containerLluvia = null;
        }

        createLluvia() {
            if (this.containerLluvia) {
                return;
            }
            this.gotas = [];
            this.containerLluvia = new PIXI.particles.ParticleContainer();
            this.parentContainer.addChild(this.containerLluvia);

            var anguloBase = Math.random() * (Math.PI / 12) + Math.PI / 12;

            var velocidad = 0.5 + Math.pow(anguloBase, 2) * 1.2;
            var cantidadGotas = Math.floor((100 + anguloBase * 250) * this.escala);
            if (Math.random() < 0.5) {
                anguloBase = -anguloBase;
            }
            for (var i = 0; i < cantidadGotas; ++i) {
                var gota = new SpriteGrh(this.assetManager.getGrh(23652));

                gota.x = Math.random() * this.pixiRenderer.width;
                gota.y = Math.random() * this.pixiRenderer.height;
                gota.rotation = anguloBase + Math.random() * Math.PI / 16;
                gota.velocidad = velocidad;

                gota.height = (4 + 6 * Math.random()) * this.escala;
                gota.alpha = 0.4;
                this.gotas.push(gota);
                this.containerLluvia.addChild(gota);
            }
        }

        update(delta){
            if (this.containerLluvia) {
                this._updateGotas(delta);
            }
        }

        _updateGotas(delta) {
            for (var i = 0; i < this.gotas.length; i++) {
                var gota = this.gotas[i];
                gota.position.x -= Math.sin(gota.rotation) * (gota.velocidad) * delta;
                gota.position.y += Math.cos(gota.rotation) * (gota.velocidad) * delta;

                if (gota.position.x > this.pixiRenderer.width + 20) {
                    gota.position.x = 0 - 20;
                    gota.y = Math.random() * this.pixiRenderer.height;
                }
                else if (gota.position.x < 0 - 20) {
                    gota.position.x = this.pixiRenderer.width + 20;
                    gota.y = Math.random() * this.pixiRenderer.height;
                }
                if (gota.position.y > this.pixiRenderer.height) {
                    gota.position.y = 0 - 20;
                    gota.x = Math.random() * this.pixiRenderer.width;
                }
            }
        }

    }
    return ClimaRenderer;
});