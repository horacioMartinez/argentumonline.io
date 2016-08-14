/**
 * Created by horacio on 4/20/16.
 */

define(["text!../../../menus/skills.html!strip", 'ui/popups/popup'], function (DOMdata, PopUp) {

    class popUpSkills extends PopUp {
        constructor(game) {
            var options = {
                width: 300,
                height: 600,
                minWidth: 150,
                minHeight: 250
            };
            super(DOMdata, options);
            this.game = game;
            this.initCallbacks();
            this.skills = null;
            this.skillsInicializados = false;
        }

        show() {
            super.show();
            this.game.client.sendRequestSkills(); // todo: << sacaR?
        }

        initCallbacks() {
            var self = this;
            $("#skillsBotonCerrar").click(function () {
                self.hide();
            });

            $("#skillsBotonCancelar").click(function () {
                self.hide();
            });

            $("#skillsBotonAceptar").click(function () {
                var puntos = self._getPuntosAdicionalesSerialized();
                if (puntos) {
                    self.game.client.sendModifySkills(puntos);
                    self.game.skills = self.skills;
                }
                self.hide();
            });
        }

        _getSkillDOMid(numSkill) {
            return "popUpSkills_skill_" + numSkill;
        }

        _getSkillTextDOMid(numSkill) {
            return "popUpSkills_textoSkill_" + numSkill;
        }

        _getSkillPointsDOMid(numSkill) {
            return "popUpSkills_puntosSkill_" + numSkill;
        }

        _createSkill(numSkill, nombre, puntos, porcentaje) {
            var self = this;
            //var id = this._getSkillDOMid(numSkill);
            var textoId = this._getSkillTextDOMid(numSkill);
            var puntosId = this._getSkillPointsDOMid(numSkill);
            var botonMasId = "popUpSkills_botonMasSkill_" + numSkill;
            var botonMenosId = "popUpSkills_botonMenosSkill_" + numSkill;

            $("#popUpSkillsContenedorSkills").append('<tr>'
                + '<td class="secondaryColor" id=' + textoId + '></td>'
                + '<td class="everywhereBoldFont activeColor" id=' + puntosId + '></td>'
                + '<td><button id=' + botonMenosId + ' class="botonMenosSkill"></button></td>'
                + '<td><button id=' + botonMasId + ' class="botonMasSkill"></button></td>'
                + '</tr>');

            var $botonMas = $("#" + botonMasId);
            $botonMas.data("numSkill", numSkill);
            $botonMas.on("click", function () {
                var numSkill = $(this).data("numSkill");
                if (self.skills.asignarSkill(numSkill)) {
                    self._updateSkill(numSkill);
                    self._updatePuntosLibres();
                }
            });

            var $botonMenos = $("#" + botonMenosId);
            $botonMenos.data("numSkill", numSkill);
            $botonMenos.on("click", function () {
                var numSkill = $(this).data("numSkill");
                if (self.skills.getPuntosSkill(numSkill) <= self.game.skills.getPuntosSkill(numSkill)) {
                    return;
                }
                self.skills.desAsignarSkill(numSkill);
                self._updateSkill(numSkill);
                self._updatePuntosLibres();
            });
        }

        _updatePuntosLibres() {
            $("#popUpSkillsContenedorPuntosLibres").text("Puntos libres: " + this.skills.puntosLibres);
        }

        _updateSkill(numSkill, nombre, puntos) {
            nombre = nombre || this.skills.getNombreSkill(numSkill);
            puntos = puntos || this.skills.getPuntosSkill(numSkill);
            var id = this._getSkillTextDOMid(numSkill);
            let puntosid = this._getSkillPointsDOMid(numSkill);
            $("#" + id).text(nombre.toUpperCase());
            $("#" + puntosid).text(puntos);
        }

        _updateSkillsPoints() {
            var self = this;
            this.skills.forEachSkill(function (numSkill, puntos, porcentaje, nombre) {
                self._updateSkill(numSkill, nombre.puntos);
            });
        }

        updateSkillsData() {
            var self = this;
            //this.skills = $.extend(true, {}, this.game.skills);
            this.skills = $.extend(true, Object.create(Object.getPrototypeOf(this.game.skills)), this.game.skills); // clonar
            if (!this.skillsInicializados) {
                this.skills.forEachSkill(function (numSkill, puntos, porcentaje, nombre) {
                    self._createSkill(numSkill, nombre, puntos, porcentaje);
                });
                this.skillsInicializados = true;
            }
            this._updateSkillsPoints();
            this._updatePuntosLibres();
        }

        _getPuntosAdicionalesSerialized() {
            var modificados = false;
            var res = [];
            var self = this;
            this.skills.forEachSkill(function (numSkill, puntos, porcentaje, nombre) {
                var puntosAdicionales = puntos - self.game.skills.getPuntosSkill(numSkill);
                res.push(puntosAdicionales);
                if (puntosAdicionales) {
                    modificados = true;
                }
            });
            if (!modificados) {
                return null;
            }
            return res;
        }
    }

    return popUpSkills;
});