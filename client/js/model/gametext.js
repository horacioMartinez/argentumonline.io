/**
 * Created by horacio on 02/08/2016.
 */

define(['enums', 'font'],
    function (Enums, Font) {
        class GameText {
            constructor(renderer) {
                this.renderer = renderer;
            }

            playerHitByUser(player, parteCuerpo, danio, attackerName) {
                let bodyPartMessage;
                switch (parteCuerpo) {
                    case Enums.ParteCuerpo.cabeza:
                        bodyPartMessage = Enums.MensajeConsola.RECIBE_IMPACTO_CABEZA;
                        break;
                    case Enums.ParteCuerpo.brazoIzquierdo:
                        bodyPartMessage = Enums.MensajeConsola.RECIBE_IMPACTO_BRAZO_IZQ;
                        break;
                    case Enums.ParteCuerpo.brazoDerecho:
                        bodyPartMessage = Enums.MensajeConsola.RECIBE_IMPACTO_BRAZO_DER;
                        break;
                    case Enums.ParteCuerpo.piernaIzquierda:
                        bodyPartMessage = Enums.MensajeConsola.RECIBE_IMPACTO_PIERNA_IZQ;
                        break;
                    case Enums.ParteCuerpo.piernaDerecha:
                        bodyPartMessage = Enums.MensajeConsola.RECIBE_IMPACTO_PIERNA_DER;
                        break;
                    case Enums.ParteCuerpo.torso:
                        bodyPartMessage = Enums.MensajeConsola.RECIBE_IMPACTO_TORSO;
                        break;
                    default:
                        throw new Error("Mensaje de parte de cuerpo invalido");
                }
                let txt = Enums.MensajeConsola.MENSAJE_1 + attackerName + bodyPartMessage + danio + Enums.MensajeConsola.MENSAJE_2;

                this.renderer.agregarCharacterHoveringInfo(player, -danio, Font.CANVAS_DANIO_RECIBIDO);
                this.renderer.agregarTextoConsola(txt, Font.FIGHT);
            }

            playerHitByMob(player, parteCuerpo, danio) {
                let bodyPartMessage;
                switch (parteCuerpo) {
                    case Enums.ParteCuerpo.cabeza:
                        bodyPartMessage = Enums.MensajeConsola.MENSAJE_GOLPE_CABEZA;
                        break;
                    case Enums.ParteCuerpo.brazoIzquierdo:
                        bodyPartMessage = Enums.MensajeConsola.MENSAJE_GOLPE_BRAZO_IZQ;
                        break;
                    case Enums.ParteCuerpo.brazoDerecho:
                        bodyPartMessage = Enums.MensajeConsola.MENSAJE_GOLPE_BRAZO_DER;
                        break;
                    case Enums.ParteCuerpo.piernaIzquierda:
                        bodyPartMessage = Enums.MensajeConsola.MENSAJE_GOLPE_PIERNA_IZQ;
                        break;
                    case Enums.ParteCuerpo.piernaDerecha:
                        bodyPartMessage = Enums.MensajeConsola.MENSAJE_GOLPE_PIERNA_DER;
                        break;
                    case Enums.ParteCuerpo.torso:
                        bodyPartMessage = Enums.MensajeConsola.MENSAJE_GOLPE_TORSO;
                        break;
                    default:
                        throw new Error("Mensaje de parte de cuerpo invalido");
                }
                let txt = Enums.MensajeConsola.MENSAJE_1 + bodyPartMessage + danio + Enums.MensajeConsola.MENSAJE_2;
                this.renderer.agregarCharacterHoveringInfo(player, -danio, Font.CANVAS_DANIO_RECIBIDO);
                this.renderer.agregarTextoConsola(txt, Font.FIGHT);
            }

            playerHitMob(bicho, danio) {
                if (bicho) {
                    this.renderer.agregarCharacterHoveringInfo(bicho, danio, Font.CANVAS_DANIO_REALIZADO);
                }
                this.renderer.agregarTextoConsola(Enums.MensajeConsola.MENSAJE_GOLPE_CRIATURA_1 + danio + Enums.MensajeConsola.MENSAJE_2, Font.FIGHT);
            }

            playerHitUser(hittedUser, parteCuerpo, danio) {
                this.renderer.agregarCharacterHoveringInfo(hittedUser, danio, Font.CANVAS_DANIO_REALIZADO);

                let bodyPartMessage;
                switch (parteCuerpo) {
                    case Enums.ParteCuerpo.cabeza:
                        bodyPartMessage = Enums.MensajeConsola.PRODUCE_IMPACTO_CABEZA;
                        break;
                    case Enums.ParteCuerpo.brazoIzquierdo:
                        bodyPartMessage = Enums.MensajeConsola.PRODUCE_IMPACTO_BRAZO_IZQ;
                        break;
                    case Enums.ParteCuerpo.brazoDerecho:
                        bodyPartMessage = Enums.MensajeConsola.PRODUCE_IMPACTO_BRAZO_DER;
                        break;
                    case Enums.ParteCuerpo.piernaIzquierda:
                        bodyPartMessage = Enums.MensajeConsola.PRODUCE_IMPACTO_PIERNA_IZQ;
                        break;
                    case Enums.ParteCuerpo.piernaDerecha:
                        bodyPartMessage = Enums.MensajeConsola.PRODUCE_IMPACTO_PIERNA_DER;
                        break;
                    case Enums.ParteCuerpo.torso:
                        bodyPartMessage = Enums.MensajeConsola.PRODUCE_IMPACTO_TORSO;
                        break;
                    default:
                        throw new Error("Mensaje de parte de cuerpo invalido");
                }
                let attackerName = hittedUser.nombre;
                let txt = Enums.MensajeConsola.PRODUCE_IMPACTO_1 + attackerName + bodyPartMessage + danio + Enums.MensajeConsola.MENSAJE_2;
                this.renderer.agregarTextoConsola(txt, Font.FIGHT);
            }

            consoleMsg(texto, font) {
                if (!font) {
                    font = Font.INFO;
                }
                this.renderer.agregarTextoConsola(texto, font);
            }

            chat(c, chat, r, g, b) {
                if (c) {
                    this.renderer.setCharacterChat(c, chat, r, g, b);
                }
            }

            removeCharacterChat (character){
                this.renderer.removerChat(character);
            }
        }

        return GameText;
    });