/**
 * Created by horacio on 4/23/16.
 */


define(['enums'], function (Enums) {

    var Skills = Class.extend({
        init: function () {
            this.MAX_PUNTOS_SKILL = 100;
            this._nombres = [];
            this._skills = [];
            this._initNombresSkills(this._nombres);
            this.puntosLibres = 0;
        },

        setSkillsLibres: function (cant) {
            this.puntosLibres = cant;
        },

        agregarSkillsLibres: function (cant) {
            this.puntosLibres += cant;
        },

        setSkills: function (skills) { // llegan cant puntos de skill i, porcentaje de skill i
            this._skills = [];
            for (var i = 0; i < skills.length; i++) {
                var skill = {};
                skill.numSkill = (i / 2) + 1;
                skill.puntos = skills[i];
                skill.porcentaje = skills[i + 1];
                skill.nombre = this.getNombreSkill(skill.numSkill);
                this._skills[skill.numSkill] = skill;
            }
        },

        asignarSkill: function (numSkill) {
            var skill = this._skills[numSkill];
            if ((this.puntosLibres < 1 ) || (skill.puntos >= this.MAX_PUNTOS_SKILL ))
                return false;
            this.puntosLibres--;
            this._skills[numSkill].puntos++;
            return true;
        },

        desAsignarSkill: function (numSkill) {
            var skill = this._skills[numSkill];
            if (skill.puntos < 0 )
                return false;
            this.puntosLibres++;
            this._skills[numSkill].puntos--;
        },

        getPuntosSkill: function(numSkill){
            return this._skills[numSkill].puntos;
        },

        forEachSkill: function (callback) { // callback(numSkill,puntos,porcentaje,nombre)
            _.each(this._skills, function (skill) {
                if (skill) {
                    callback(skill.numSkill,skill.puntos,skill.porcentaje,skill.nombre);
                }
            });
        },

        getNombreSkill: function (numSkill) {
            return this._nombres[numSkill];
        },

        _initNombresSkills: function (nombres) { // TODO: sacar esto de aca, crear clase skills?
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


