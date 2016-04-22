/**
 * Created by horacio on 4/20/16.
 */

define(['ui/popups/popup', 'enums'], function (PopUp, Enums) {

    var Skills = PopUp.extend({
        init: function (game) {
            this._super("popUpSkills");
            this.game = game;
            this.initCallbacks();
            this.nombres = [];
            this.initNombresSkills(this.nombres);
        },

        show: function () {
            this._super();
            this.game.client.sendRequestSkills();
        },
        initCallbacks: function () {
            var self = this;
            $("#skillsBotonCerrar").click(function () {
                self.hide();
            });
        },

        initNombresSkills: function (nombres) { // TODO: sacar esto de aca, crear clase skills?
            nombres[Enums.Skill.magia] = "Magia";
            nombres[Enums.Skill.robar] = "Robar";
            nombres[Enums.Skill.tacticas] = "Evasión en combate";
            nombres[Enums.Skill.armas] = "Combate cuerpo a cuerpo";
            nombres[Enums.Skill.meditar] = "Meditar";
            nombres[Enums.Skill.apuñalar] = "Apuñalar";
            nombres[Enums.Skill.ocultarse] = "Ocultarse";
            nombres[Enums.Skill.supervivencia] = "Supervivencia";
            nombres[Enums.Skill.talar] = "Talar árboles";
            nombres[Enums.Skill.comerciar] = "Comercio";
            nombres[Enums.Skill.defensa] = "Defensa con escudos";
            nombres[Enums.Skill.pesca] = "Pesca";
            nombres[Enums.Skill.mineria] = "Minería";
            nombres[Enums.Skill.carpinteria] = "Carpintería";
            nombres[Enums.Skill.herreria] = "Herrería";
            nombres[Enums.Skill.liderazgo] = "Liderazgo";
            nombres[Enums.Skill.domar] = "Domar animales";
            nombres[Enums.Skill.proyectiles] = "Combate a distancia";
            nombres[Enums.Skill.wrestling] = "Combate sin armas";
            nombres[Enums.Skill.navegacion] = "Navegación";
            nombres[Enums.Skill.fundirmetal] = "????";
        },
    });

    return Skills;
});