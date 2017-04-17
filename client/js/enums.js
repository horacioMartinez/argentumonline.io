define({
    /* valor default primer elemento enums en VB: 0 */

    Heading: {
        norte: 1,
        este: 2,
        sur: 3,
        oeste: 4
    },

    eMessage: {
        DontSeeAnything: 0,
        NPCSwing: 1,
        NPCKillUser: 2,
        BlockedWithShieldUser: 3,
        BlockedWithShieldOther: 4,
        UserSwing: 5,
        SafeModeOn: 6,
        SafeModeOff: 7,
        ResuscitationSafeOff: 8,
        ResuscitationSafeOn: 9,
        NobilityLost: 10,
        CantUseWhileMeditating: 11,
        NPCHitUser: 12,
        UserHitNPC: 13,
        UserAttackedSwing: 14,
        UserHittedByUser: 15,
        UserHittedUser: 16,
        WorkRequestTarget: 17,
        HaveKilledUser: 18,
        UserKill: 19,
        EarnExp: 20,
        Home: 21,
        CancelHome: 22,
        FinishHome: 23
    },

    Ciudad: {
        Ullathorpe: 1,
        Nix: 2,
        Banderbill: 3,
        Lindos: 4,
        Arghal: 5
    },

    Raza: {
        humano: 1,
        elfo: 2,
        elfoOscuro: 3,
        gnomo: 4,
        enano: 5
    },

    NombreRaza: {
        1: "Human",
        2: "Elf",
        3: "Dark Elf",
        4: "Gnome",
        5: "Dwarf"
    },

    Clase: {
        mago: 1,
        clerigo: 2,
        guerrero: 3,
        asesino: 4,
        ladron: 5,
        bardo: 6,
        druida: 7,
        bandido: 8,
        paladin: 9,
        cazador: 10,
        pirata: 11,
    },


    NombreClase: {
        1: "Mage",
        2: "Cleric",
        3: "Warrior",
        4: "Assasin",
        5: "Thief",
        6: "Bard",
        7: "Druid",
        8: "Bandit",
        9: "Paladin",
        10: "Hunter",
        11: "Pirate"
    },

    Genero: {
        hombre: 1,
        mujer: 2
    },

    ParteCuerpo: {
        cabeza: 1,
        piernaIzquierda: 2,
        piernaDerecha: 3,
        brazoDerecho: 4,
        brazoIzquierdo: 5,
        torso: 6
    },

    Skill: {
        magia: 1,
        robar: 2,
        tacticas: 3,
        armas: 4,
        meditar: 5,
        apunalar: 6,
        ocultarse: 7,
        supervivencia: 8,
        talar: 9,
        comerciar: 10,
        defensa: 11,
        pesca: 12,
        mineria: 13,
        carpinteria: 14,
        herreria: 15,
        liderazgo: 16,
        domar: 17,
        proyectiles: 18,
        wrestling: 19,
        navegacion: 20,
        fundirmetal: 88
    },

    Muerto: {
        cabezaCasper: 500,
        cuerpoFragataFantasmal: 87
    },

    MensajeConsola: {
        ESTAS_MUERTO: "¡¡¡You are dead!!!",
        MENSAJE_1: "¡¡",
        MENSAJE_2: "!!",
        MENSAJE_11: "¡",
        MENSAJE_22: "!",
        MENSAJE_GOLPE_CRIATURA_1: "¡¡Le has pegado a la criatura por ",
        MENSAJE_GOLPE_CABEZA: "¡¡La criatura te ha pegado en la cabeza por ",
        MENSAJE_GOLPE_BRAZO_IZQ: "¡¡La criatura te ha pegado el brazo izquierdo por ",
        MENSAJE_GOLPE_BRAZO_DER: "¡¡La criatura te ha pegado el brazo derecho por ",
        MENSAJE_GOLPE_PIERNA_IZQ: "¡¡La criatura te ha pegado la pierna izquierda por ",
        MENSAJE_GOLPE_PIERNA_DER: "¡¡La criatura te ha pegado la pierna derecha por ",
        MENSAJE_GOLPE_TORSO: "¡¡La criatura te ha pegado en el torso por ",
        CRIATURA_FALLA_GOLPE: "¡¡¡La criatura falló el golpe!!!",
        CRIATURA_MATADO: "¡¡¡La criatura te ha matado!!!",
        RECHAZO_ATAQUE_ESCUDO: "¡¡¡Has rechazado el ataque con el escudo!!!",
        USUARIO_RECHAZO_ATAQUE_ESCUDO: "¡¡¡El usuario rechazó el ataque con su escudo!!!",
        FALLADO_GOLPE: "¡¡¡Has fallado el golpe!!!",
        SEGURO_ACTIVADO: "",
        SEGURO_DESACTIVADO: "",
        PIERDE_NOBLEZA: "¡¡Has perdido puntaje de nobleza y ganado puntaje de criminalidad!! Si sigues ayudando a criminales te convertirás en uno de ellos y serás perseguido por las tropas de las ciudades.",
        USAR_MEDITANDO: "¡Estás meditando! Debes dejar de meditar para usar objetos.",
        SEGURO_RESU_ON: "SEGURO DE RESURRECCION ACTIVADO",
        SEGURO_RESU_OFF: "SEGURO DE RESURRECCION DESACTIVADO",
        ATAQUE_FALLO: " attacked you and missed!!",
        RECIBE_IMPACTO_CABEZA: " has hit you in the head dealing ",
        RECIBE_IMPACTO_BRAZO_IZQ: " has hit you in your left arm dealing ",
        RECIBE_IMPACTO_BRAZO_DER: " has hit you in your right arm dealing ",
        RECIBE_IMPACTO_PIERNA_IZQ: " has hit you in your left leg dealing ",
        RECIBE_IMPACTO_PIERNA_DER: " has hit you in your right leg dealing ",
        RECIBE_IMPACTO_TORSO: " has hit you in the body dealing ",
        PRODUCE_IMPACTO_1: "¡¡You have hit ",
        PRODUCE_IMPACTO_CABEZA: " in the head dealing ",
        PRODUCE_IMPACTO_BRAZO_IZQ: " in the left arm dealing ",
        PRODUCE_IMPACTO_BRAZO_DER: " in the right arm dealing ",
        PRODUCE_IMPACTO_PIERNA_IZQ: " in the left leg dealing ",
        PRODUCE_IMPACTO_PIERNA_DER: " in the right leg dealing ",
        PRODUCE_IMPACTO_TORSO: " in the body dealing ",
        TRABAJO_MAGIA: "Click on the target...",
        TRABAJO_PESCA: "Haz click sobre el sitio donde quieres pescar...",
        TRABAJO_ROBAR: "Click on the target...",
        TRABAJO_TALAR: "Haz click sobre el árbol...",
        TRABAJO_MINERIA: "Haz click sobre el yacimiento...",
        TRABAJO_FUNDIRMETAL: "Haz click sobre la fragua...",
        TRABAJO_PROYECTILES: "Click on the target...",
        TRABAJO_DOMAR: "Haz click sobre la criatura...",
        ENTRAR_PARTY_1: "Si deseas entrar en una party con ",
        ENTRAR_PARTY_2: ", escribe /entrarparty",
        NENE: "Cantidad de NPCs: ",
        FRAGSHOOTER_TE_HA_MATADO: "te ha matado!",
        FRAGSHOOTER_HAS_MATADO: "Has matado a",
        FRAGSHOOTER_HAS_GANADO: "Has ganado ",
        FRAGSHOOTER_PUNTOS_DE_EXPERIENCIA: "puntos de experiencia.",
        NO_VES_NADA_INTERESANTE: "You dont see anything interesting.",
        HAS_MATADO_A: "You have killed ",
        HAS_GANADO_EXPE_1: "You have gain ",
        HAS_GANADO_EXPE_2: " points of experience.",
        TE_HA_MATADO: " has killed you!",
        HOGAR: "Has llegado a tu hogar. El viaje ha finalizado.",
        HOGAR_CANCEL: "Tu viaje ha sido cancelado.",
        MACRO_TRABAJO_ACTIVADO: "Macro Trabajo ACTIVADO haz click sobre el objetivo",
        MACRO_TRABAJO_DESACTIVADO: "Macro Trabajo DESACTIVADO",
        MACRO_TABAJO_REQUIERE_EQUIPAR: "Necesitas seleccionar alguna herramienta para trabajar!",
        MACRO_HECHIZOS_ACTIVADO: "Auto lanzar hechizos activado haz click sobre el objetivo",
        MACRO_HECHIZOS_DESACTIVADO: "Auto lanzar hechizos desactivado",
        MACRO_HECHIZOS_REQUIRE_SELECCIONAR: "Necesitas seleccionar que hechizo lanzar",
        MENSAJE_HOGAR : "Has llegado a tu hogar. El viaje ha finalizado.",
        MENSAJE_HOGAR_CANCEL : "Tu viaje ha sido cancelado."
    },

    Intervalo: {
        macroHechizos: 2788,
        macroTrabajo: 900,
        ataque: 900,
        ataqueConArco: 1000,
        hechizo: 1000,
        ataqueHechizo: 600,
        hechizoAtaque: 600,
        trabajar: 700,
        usarItemConU: 380,
        usarItemConDobleClick: 430,
        requestPostionUpdate: 2000,
        domar: 700,
        robar: 700
    },

    SONIDOS: {
        paso1: "23",
        paso2: "24",
        pasoNavegando: "50",
        lluvia_outdoor: "lluviaout",
        lluvia_indoor: "lluviain",
        lluvia_start_indoor: "lluviainst",
        lluvia_start_outdoor: "lluviaoutst",
        lluvia_end_indoor: "lluviainend",
        lluvia_end_outdoor: "lluviaoutend",
        comprar_vender: 'sell_buy_item',
        retirar_depositar: 'withdraw_deposit_item',
        click: 'click',
        dados: 'cupdice'
    },

    ClanType: {
        ROYAL_ARMY: 0,
        EVIL: 1,
        NEUTRAL: 2,
        GM: 3,
        LEGAL: 4,
        CRIMINAL: 5
    }
});