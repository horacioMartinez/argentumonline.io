/**
 * Created by horacio on 4/9/16.
 */

define([], function () {

    class Atributos {
        constructor(game) {
            this.game = game;

            this.hp = -1;
            this.maxHp = -1;
            this.mana = -1;
            this.maxMana = -1;
            this.stamina = -1;
            this.maxStamina = -1;
            this.oro = -1;
            this.nivel = -1;
            this.maxExp = -1;
            this.exp = -1;
            this.maxAgua = -1;
            this.agua = -1;
            this.hambre = -1;
            this.maxHambre = -1;
            this.oro = -1;
        }

        setVida(min, max) {
            if (!max) {
                max = this.maxHp;
            }
            if ((this.hp !== min) || (this.maxHp !== max)) {
                this.hp = min;
                this.maxHp = max;
                this.game.gameUI.interfaz.updateBarraVida(min, max);
            }
        }

        setMana(MinMan, MaxMan) {
            if (!MaxMan && (MaxMan !== 0)) {
                MaxMan = this.maxMana;
            }

            if ((this.mana !== MinMan) || (this.maxMana !== MaxMan)) {
                this.mana = MinMan;
                this.maxMana = MaxMan;
                this.game.gameUI.interfaz.updateBarraMana(MinMan, MaxMan);
            }
        }

        setStamina(MinSta, MaxSta) {
            if (!MaxSta) {
                MaxSta = this.maxStamina;
            }
            if ((this.stamina !== MinSta) || this.maxStamina !== MaxSta) {
                this.stamina = MinSta;
                this.maxStamina = MaxSta;
                this.game.gameUI.interfaz.updateBarraEnergia(MinSta, MaxSta);
            }
        }

        setAgua(MinAgu, MaxAgu) {
            if (!MaxAgu) {
                MaxAgu = this.maxAgua;
            }
            if ((this.agua !== MinAgu) || (this.maxAgua !== MaxAgu)) {
                this.maxAgua = MaxAgu;
                this.agua = MinAgu;
                this.game.gameUI.interfaz.updateBarraSed(MinAgu, MaxAgu);
            }
        }

        setHambre(MinHam, MaxHam) {
            if (!MaxHam) {
                MaxHam = this.maxHambre;
            }
            if ((this.hambre !== MinHam) || (this.maxHambre !== MaxHam)) {
                this.hambre = MinHam;
                this.maxHambre = MaxHam;
                this.game.gameUI.interfaz.updateBarraHambre(MinHam, MaxHam);
            }
        }

        setExp(minExp, maxExp) {
            if (!maxExp) {
                maxExp = this.maxExp;
            }
            if ((this.exp !== minExp) || (this.maxExp !== maxExp)) {
                this.exp = minExp;
                this.maxExp = maxExp;
                this.game.gameUI.interfaz.updateBarraExp(minExp, maxExp);
            }
        }

        setNivel(nivel) {
            if (nivel !== this.nivel) {
                this.nivel = nivel;
                this.game.gameUI.interfaz.updateNivel(nivel);
            }
        }

        setOro(oro) {
            if (this.oro !== oro) {
                this.oro = oro;
                this.game.gameUI.interfaz.updateOro(oro);
            }
        }

    }

    return Atributos;
});