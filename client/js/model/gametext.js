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
                var txt = "";
                var formatMessage = function (bodyPartMessage) {
                    return Enums.MensajeConsola.MENSAJE_1 + attackerName + bodyPartMessage + danio + Enums.MensajeConsola.MENSAJE_2;
                };
                switch (parteCuerpo) {
                    case Enums.ParteCuerpo.cabeza:
                        txt = formatMessage(Enums.MensajeConsola.RECIBE_IMPACTO_CABEZA);
                        break;
                    case Enums.ParteCuerpo.brazoIzquierdo:
                        txt = formatMessage(Enums.MensajeConsola.RECIBE_IMPACTO_BRAZO_IZQ);
                        break;
                    case Enums.ParteCuerpo.brazoDerecho:
                        txt = formatMessage(Enums.MensajeConsola.RECIBE_IMPACTO_BRAZO_DER);
                        break;
                    case Enums.ParteCuerpo.piernaIzquierda:
                        txt = formatMessage(Enums.MensajeConsola.RECIBE_IMPACTO_PIERNA_IZQ);
                        break;
                    case Enums.ParteCuerpo.piernaDerecha:
                        txt = formatMessage(Enums.MensajeConsola.RECIBE_IMPACTO_PIERNA_DER);
                        break;
                    case Enums.ParteCuerpo.torso:
                        txt = formatMessage(Enums.MensajeConsola.RECIBE_IMPACTO_TORSO);
                        break;
                    default:
                        log.error("Mensaje de parte de cuerpo invalido");
                }
                this.renderer.agregarCharacterHoveringInfo(player, -danio, Font.CANVAS_DANIO_RECIBIDO);
                this.renderer.agregarTextoConsola(txt, Font.FIGHT);
            }

            playerHitByMob(player, parteCuerpo, danio) {
                var txt = "";
                var formatMessage = function (bodyPartMessage) {
                    return Enums.MensajeConsola.MENSAJE_1 + bodyPartMessage + danio + Enums.MensajeConsola.MENSAJE_2;
                };
                switch (parteCuerpo) {
                    case Enums.ParteCuerpo.cabeza:
                        txt = formatMessage(Enums.MensajeConsola.MENSAJE_GOLPE_CABEZA);
                        break;
                    case Enums.ParteCuerpo.brazoIzquierdo:
                        txt = formatMessage(Enums.MensajeConsola.MENSAJE_GOLPE_BRAZO_IZQ);
                        break;
                    case Enums.ParteCuerpo.brazoDerecho:
                        txt = formatMessage(Enums.MensajeConsola.MENSAJE_GOLPE_BRAZO_DER);
                        break;
                    case Enums.ParteCuerpo.piernaIzquierda:
                        txt = formatMessage(Enums.MensajeConsola.MENSAJE_GOLPE_PIERNA_IZQ);
                        break;
                    case Enums.ParteCuerpo.piernaDerecha:
                        txt = formatMessage(Enums.MensajeConsola.MENSAJE_GOLPE_PIERNA_DER);
                        break;
                    case Enums.ParteCuerpo.torso:
                        txt = formatMessage(Enums.MensajeConsola.MENSAJE_GOLPE_TORSO);
                        break;
                    default:
                        log.error("Mensaje de parte de cuerpo invalido");
                }
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
                let attackerName = hittedUser.nombre;

                this.renderer.agregarCharacterHoveringInfo(hittedUser, danio, Font.CANVAS_DANIO_REALIZADO);

                var formatMessage = function (bodyPartMessage) {
                    return Enums.MensajeConsola.PRODUCE_IMPACTO_1 + attackerName + bodyPartMessage + danio + Enums.MensajeConsola.MENSAJE_2;
                };
                let txt = "";
                switch (parteCuerpo) {
                    case Enums.ParteCuerpo.cabeza:
                        txt = formatMessage(Enums.MensajeConsola.PRODUCE_IMPACTO_CABEZA);
                        break;
                    case Enums.ParteCuerpo.brazoIzquierdo:
                        txt = formatMessage(Enums.MensajeConsola.PRODUCE_IMPACTO_BRAZO_IZQ);
                        break;
                    case Enums.ParteCuerpo.brazoDerecho:
                        txt = formatMessage(Enums.MensajeConsola.PRODUCE_IMPACTO_BRAZO_DER);
                        break;
                    case Enums.ParteCuerpo.piernaIzquierda:
                        txt = formatMessage(Enums.MensajeConsola.PRODUCE_IMPACTO_PIERNA_IZQ);
                        break;
                    case Enums.ParteCuerpo.piernaDerecha:
                        txt = formatMessage(Enums.MensajeConsola.PRODUCE_IMPACTO_PIERNA_DER);
                        break;
                    case Enums.ParteCuerpo.torso:
                        txt = formatMessage(Enums.MensajeConsola.PRODUCE_IMPACTO_TORSO);
                        break;
                    default:
                        log.error("Mensaje de parte de cuerpo invalido");
                }
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
        }

        return GameText;
    });