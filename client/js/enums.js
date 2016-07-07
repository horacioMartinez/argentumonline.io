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
        trabajador: 11,
        pirata: 12
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
        ESTAS_MUERTO: "¡¡¡Estás muerto!!!",
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
        SEGURO_ACTIVADO: ">>SEGURO ACTIVADO<<",
        SEGURO_DESACTIVADO: ">>SEGURO DESACTIVADO<<",
        PIERDE_NOBLEZA: "¡¡Has perdido puntaje de nobleza y ganado puntaje de criminalidad!! Si sigues ayudando a criminales te convertirás en uno de ellos y serás perseguido por las tropas de las ciudades.",
        USAR_MEDITANDO: "¡Estás meditando! Debes dejar de meditar para usar objetos.",
        SEGURO_RESU_ON: "SEGURO DE RESURRECCION ACTIVADO",
        SEGURO_RESU_OFF: "SEGURO DE RESURRECCION DESACTIVADO",
        ATAQUE_FALLO: " te atacó y falló!!",
        RECIBE_IMPACTO_CABEZA: " te ha pegado en la cabeza por ",
        RECIBE_IMPACTO_BRAZO_IZQ: " te ha pegado el brazo izquierdo por ",
        RECIBE_IMPACTO_BRAZO_DER: " te ha pegado el brazo derecho por ",
        RECIBE_IMPACTO_PIERNA_IZQ: " te ha pegado la pierna izquierda por ",
        RECIBE_IMPACTO_PIERNA_DER: " te ha pegado la pierna derecha por ",
        RECIBE_IMPACTO_TORSO: " te ha pegado en el torso por ",
        PRODUCE_IMPACTO_1: "¡¡Le has pegado a ",
        PRODUCE_IMPACTO_CABEZA: " en la cabeza por ",
        PRODUCE_IMPACTO_BRAZO_IZQ: " en el brazo izquierdo por ",
        PRODUCE_IMPACTO_BRAZO_DER: " en el brazo derecho por ",
        PRODUCE_IMPACTO_PIERNA_IZQ: " en la pierna izquierda por ",
        PRODUCE_IMPACTO_PIERNA_DER: " en la pierna derecha por ",
        PRODUCE_IMPACTO_TORSO: " en el torso por ",
        TRABAJO_MAGIA: "Haz click sobre el objetivo...",
        TRABAJO_PESCA: "Haz click sobre el sitio donde quieres pescar...",
        TRABAJO_ROBAR: "Haz click sobre la víctima...",
        TRABAJO_TALAR: "Haz click sobre el árbol...",
        TRABAJO_MINERIA: "Haz click sobre el yacimiento...",
        TRABAJO_FUNDIRMETAL: "Haz click sobre la fragua...",
        TRABAJO_PROYECTILES: "Haz click sobre la víctima...",
        TRABAJO_DOMAR: "Haz click sobre la criatura...",
        ENTRAR_PARTY_1: "Si deseas entrar en una party con ",
        ENTRAR_PARTY_2: ", escribe /entrarparty",
        NENE: "Cantidad de NPCs: ",
        FRAGSHOOTER_TE_HA_MATADO: "te ha matado!",
        FRAGSHOOTER_HAS_MATADO: "Has matado a",
        FRAGSHOOTER_HAS_GANADO: "Has ganado ",
        FRAGSHOOTER_PUNTOS_DE_EXPERIENCIA: "puntos de experiencia.",
        NO_VES_NADA_INTERESANTE: "No ves nada interesante.",
        HAS_MATADO_A: "Has matado a ",
        HAS_GANADO_EXPE_1: "Has ganado ",
        HAS_GANADO_EXPE_2: " puntos de experiencia.",
        TE_HA_MATADO: " te ha matado!",
        HOGAR: "Has llegado a tu hogar. El viaje ha finalizado.",
        HOGAR_CANCEL: "Tu viaje ha sido cancelado.",
        MACRO_TRABAJO_ACTIVADO: "Macro Trabajo ACTIVADO haz click sobre el objetivo",
        MACRO_TRABAJO_DESACTIVADO: "Macro Trabajo DESACTIVADO",
        MACRO_TABAJO_REQUIERE_EQUIPAR: "Necesitas seleccionar alguna herramienta para trabajar!",
        MACRO_HECHIZOS_ACTIVADO: "Auto lanzar hechizos activado haz click sobre el objetivo",
        MACRO_HECHIZOS_DESACTIVADO: "Auto lanzar hechizos desactivado",
        MACRO_HECHIZOS_REQUIRE_SELECCIONAR: "Necesitas seleccionar que hechizo lanzar",
    },

    Intervalo: {
        macroHechizos: 2788,
        macroTrabajo: 900,
        ataque: 1500,
        ataqueConArco: 1400,
        hechizo: 1400,
        ataqueHechizo: 1000,
        hechizoAtaque: 1000,
        trabajar: 700,
        usarItemConU: 450,
        usarItemConDobleClick: 500,
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

/*
 FONTTYPE_TALK1
 FONTTYPE_FIGHT2
 FONTTYPE_WARNING3
 FONTTYPE_INFO4
 FONTTYPE_INFOBOLD5
 FONTTYPE_EJECUCION6
 FONTTYPE_PARTY7
 FONTTYPE_VENENO8
 FONTTYPE_GUILD9
 FONTTYPE_SERVER10
 FONTTYPE_GUILDMSG11
 FONTTYPE_CONSEJO12
 FONTTYPE_CONSEJOCAOS13
 FONTTYPE_CONSEJOVesA14
 FONTTYPE_CONSEJOCAOSVesA15
 FONTTYPE_CENTINELA16
 FONTTYPE_GMMSG17
 FONTTYPE_GM18
 FONTTYPE_CITI1ZEN19
 FONTTYPE_CONSE20
 FONTTYPE_DIOS
 */

/*
 'Objetos públicos
 Public DialogosClanes As clsGuildDlg
 Public Dialogos As clsDialogs
 Public Audio As clsAudio
 Public Inventario As clsGrapchicalInventory
 Public InvBanco(1) As clsGrapchicalInventory

 'Inventarios de comercio con usuario
 Public InvComUsu As clsGrapchicalInventory  ' Inventario del usuario visible en el comercio
 Public InvOroComUsu(2) As clsGrapchicalInventory  ' Inventarios de oro (ambos usuarios)
 Public InvOfferComUsu(1) As clsGrapchicalInventory  ' Inventarios de ofertas (ambos usuarios)

 Public InvComNpc As clsGrapchicalInventory  ' Inventario con los items que ofrece el npc

 'Inventarios de herreria
 Public Const MAX_LIST_ITEMS As Byte = 4
 Public InvLingosHerreria(1 To MAX_LIST_ITEMS) As clsGrapchicalInventory
 Public InvMaderasCarpinteria(1 To MAX_LIST_ITEMS) As clsGrapchicalInventory

 Public SurfaceDB As clsSurfaceManager   'No va new porque es una interfaz, el new se pone al decidir que clase de objeto es
 Public CustomKeys As clsCustomKeys
 Public CustomMessages As clsCustomMessages

 Public incomingData As clsByteQueue
 Public outgoingData As clsByteQueue

 ''
 'The main timer of the game.
 Public MainTimer As clsTimer

 #If SeguridadAlkon Then
 Public md5 As clsMD5
 #End If

 'Error code
 Public Const TOO_FAST As Long = 24036
 Public Const REFUSED As Long = 24061
 Public Const TIME_OUT As Long = 24060


 'Sonidos
 Public Const SND_CLICK As String = "click.Wav"
 Public Const SND_PASOS1 As String = "23.Wav"
 Public Const SND_PASOS2 As String = "24.Wav"
 Public Const SND_NAVEGANDO As String = "50.wav"
 Public Const SND_OVER As String = "click2.Wav"
 Public Const SND_DICE As String = "cupdice.Wav"
 Public Const SND_LLUVIAINEND As String = "lluviainend.wav"
 Public Const SND_LLUVIAOUTEND As String = "lluviaoutend.wav"

 ' Head index of the casper. Used to know if a char is killed

 ' Constantes de intervalo
 Public Const INT_MACRO_HECHIS As Integer = 2788
 Public Const INT_MACRO_TRABAJO As Integer = 900

 Public Const INT_ATTACK As Integer = 1500
 Public Const INT_ARROWS As Integer = 1400
 Public Const INT_CAST_SPELL As Integer = 1400
 Public Const INT_CAST_ATTACK As Integer = 1000
 Public Const INT_WORK As Integer = 700
 Public Const INT_USEITEMU As Integer = 450
 Public Const INT_USEITEMDCK As Integer = 125
 Public Const INT_SENTRPU As Integer = 2000

 Public MacroBltIndex As Integer

 Public Const CASPER_HEAD As Integer = 500
 Public Const FRAGATA_FANTASMAL As Integer = 87

 Public Const NUMATRIBUTES As Byte = 5

 Public Const HUMANO_H_PRIMER_CABEZA As Integer = 1
 Public Const HUMANO_H_ULTIMA_CABEZA As Integer = 40 'En verdad es hasta la 51, pero como son muchas estas las dejamos no seleccionables
 Public Const HUMANO_H_CUERPO_DESNUDO As Integer = 21

 Public Const ELFO_H_PRIMER_CABEZA As Integer = 101
 Public Const ELFO_H_ULTIMA_CABEZA As Integer = 122
 Public Const ELFO_H_CUERPO_DESNUDO As Integer = 210

 Public Const DROW_H_PRIMER_CABEZA As Integer = 201
 Public Const DROW_H_ULTIMA_CABEZA As Integer = 221
 Public Const DROW_H_CUERPO_DESNUDO As Integer = 32

 Public Const ENANO_H_PRIMER_CABEZA As Integer = 301
 Public Const ENANO_H_ULTIMA_CABEZA As Integer = 319
 Public Const ENANO_H_CUERPO_DESNUDO As Integer = 53

 Public Const GNOMO_H_PRIMER_CABEZA As Integer = 401
 Public Const GNOMO_H_ULTIMA_CABEZA As Integer = 416
 Public Const GNOMO_H_CUERPO_DESNUDO As Integer = 222
 '**************************************************
 Public Const HUMANO_M_PRIMER_CABEZA As Integer = 70
 Public Const HUMANO_M_ULTIMA_CABEZA As Integer = 89
 Public Const HUMANO_M_CUERPO_DESNUDO As Integer = 39

 Public Const ELFO_M_PRIMER_CABEZA As Integer = 170
 Public Const ELFO_M_ULTIMA_CABEZA As Integer = 188
 Public Const ELFO_M_CUERPO_DESNUDO As Integer = 259

 Public Const DROW_M_PRIMER_CABEZA As Integer = 270
 Public Const DROW_M_ULTIMA_CABEZA As Integer = 288
 Public Const DROW_M_CUERPO_DESNUDO As Integer = 40

 Public Const ENANO_M_PRIMER_CABEZA As Integer = 370
 Public Const ENANO_M_ULTIMA_CABEZA As Integer = 384
 Public Const ENANO_M_CUERPO_DESNUDO As Integer = 60

 Public Const GNOMO_M_PRIMER_CABEZA As Integer = 470
 Public Const GNOMO_M_ULTIMA_CABEZA As Integer = 484
 Public Const GNOMO_M_CUERPO_DESNUDO As Integer = 260

 'Musica
 Public Const MP3_Inicio As Byte = 101

 Public RawServersList As String

 Public Type tColor
 r As Byte
 g As Byte
 b As Byte
 End Type

 Public ColoresPJ(0 To 50) As tColor


 Public Type tServerInfo
 Ip As String
 Puerto As Integer
 desc As String
 PassRecPort As Integer
 End Type

 Public ServersLst() As tServerInfo
 Public ServersRecibidos As Boolean

 Public CurServer As Integer

 Public CreandoClan As Boolean
 Public ClanName As String
 Public Site As String

 Public UserCiego As Boolean
 Public UserEstupido As Boolean

 Public NoRes As Boolean 'no cambiar la resolucion
 Public GraphicsFile As String 'Que graficos.ind usamos

 Public RainBufferIndex As Long
 Public FogataBufferIndex As Long

 Public Const bCabeza = 1
 Public Const bPiernaIzquierda = 2
 Public Const bPiernaDerecha = 3
 Public Const bBrazoDerecho = 4
 Public Const bBrazoIzquierdo = 5
 Public Const bTorso = 6

 'Timers de GetTickCount
 Public Const tAt = 2000
 Public Const tUs = 600

 Public Const PrimerBodyBarco = 84
 Public Const UltimoBodyBarco = 87

 Public NumEscudosAnims As Integer

 Public ArmasHerrero() As tItemsConstruibles
 Public ArmadurasHerrero() As tItemsConstruibles
 Public ObjCarpintero() As tItemsConstruibles
 Public CarpinteroMejorar() As tItemsConstruibles
 Public HerreroMejorar() As tItemsConstruibles

 Public UsaMacro As Boolean
 Public CnTd As Byte


 Public Const MAX_BANCOINVENTORY_SLOTS As Byte = 40
 Public UserBancoInventory(1 To MAX_BANCOINVENTORY_SLOTS) As Inventory

 Public TradingUserName As String

 Public Tips() As String * 255
 Public Const LoopAdEternum As Integer = 999

 'Direcciones
 Public Enum E_Heading
 NORTH = 1
 EAST = 2
 SOUTH = 3
 WEST = 4
 End Enum

 'Objetos
 Public Const MAX_INVENTORY_OBJS As Integer = 10000
 Public Const MAX_INVENTORY_SLOTS As Byte = 30
 Public Const MAX_NORMAL_INVENTORY_SLOTS As Byte = 20
 Public Const MAX_NPC_INVENTORY_SLOTS As Byte = 50
 Public Const MAXHECHI As Byte = 35

 Public Const INV_OFFER_SLOTS As Byte = 20
 Public Const INV_GOLD_SLOTS As Byte = 1

 Public Const MAXSKILLPOINTS As Byte = 100

 Public Const MAXATRIBUTOS As Byte = 38

 Public Const FLAGORO As Integer = MAX_INVENTORY_SLOTS + 1
 Public Const GOLD_OFFER_SLOT As Integer = INV_OFFER_SLOTS + 1

 Public Const FOgata As Integer = 1521


 Public Enum eClass
 Mage = 1    'Mago
 Cleric      'Clérigo
 Warrior     'Guerrero
 Assasin     'Asesino
 Thief       'Ladrón
 Bard        'Bardo
 Druid       'Druida
 Bandit      'Bandido
 Paladin     'Paladín
 Hunter      'Cazador
 Worker      'Trabajador
 Pirat       'Pirata
 End Enum

 Public Enum eCiudad
 cUllathorpe = 1
 cNix
 cBanderbill
 cLindos
 cArghal
 End Enum

 Enum eRaza
 Humano = 1
 Elfo
 ElfoOscuro
 Gnomo
 Enano
 End Enum

 Public Enum eSkill
 Magia = 1
 Robar = 2
 Tacticas = 3
 Armas = 4
 Meditar = 5
 Apuñalar = 6
 Ocultarse = 7
 Supervivencia = 8
 Talar = 9
 Comerciar = 10
 Defensa = 11
 Pesca = 12
 Mineria = 13
 Carpinteria = 14
 Herreria = 15
 Liderazgo = 16
 Domar = 17
 Proyectiles = 18
 Wrestling = 19
 Navegacion = 20
 End Enum

 Public Enum eAtributos
 Fuerza = 1
 Agilidad = 2
 Inteligencia = 3
 Carisma = 4
 Constitucion = 5
 End Enum

 Enum eGenero
 Hombre = 1
 Mujer
 End Enum

 Public Enum PlayerType
 User = &H1
 Consejero = &H2
 SemiDios = &H4
 Dios = &H8
 Admin = &H10
 RoleMaster = &H20
 ChaosCouncil = &H40
 RoyalCouncil = &H80
 End Enum

 Public Enum eObjType
 otUseOnce = 1
 otWeapon = 2
 otArmadura = 3
 otArboles = 4
 otGuita = 5
 otPuertas = 6
 otContenedores = 7
 otCarteles = 8
 otLlaves = 9
 otForos = 10
 otPociones = 11
 otBebidas = 13
 otLeña = 14
 otFogata = 15
 otescudo = 16
 otcasco = 17
 otAnillo = 18
 otTeleport = 19
 otYacimiento = 22
 otMinerales = 23
 otPergaminos = 24
 otInstrumentos = 26
 otYunque = 27
 otFragua = 28
 otBarcos = 31
 otFlechas = 32
 otBotellaVacia = 33
 otBotellaLlena = 34
 otManchas = 35          'No se usa
 otArbolElfico = 36
 otMochilas = 37
 otCualquiera = 1000
 End Enum

 Public Enum eMochilas
 Mediana = 1
 GRANDE = 2
 End Enum

 Public MaxInventorySlots As Byte

 Public Const FundirMetal As Integer = 88

 ' Determina el color del nick
 Public Enum eNickColor
 ieCriminal = &H1
 ieCiudadano = &H2
 ieAtacable = &H4
 End Enum

 Public Enum eGMCommands
 GMMessage = 1           '/GMSG
 showName                '/SHOWNAME
 OnlineRoyalArmy         '/ONLINEREAL
 OnlineChaosLegion       '/ONLINECAOS
 GoNearby                '/IRCERCA
 Comment                 '/REM
 serverTime              '/HORA
 Where                   '/DONDE
 CreaturesInMap          '/NENE
 WarpMeToTarget          '/TELEPLOC
 WarpChar                '/TELEP
 Silence                 '/SILENCIAR
 SOSShowList             '/SHOW SOS
 SOSRemove               'SOSDONE
 GoToChar                '/IRA
 invisible               '/INVISIBLE
 GMPanel                 '/PANELGM
 RequestUserList         'LISTUSU
 Working                 '/TRABAJANDO
 Hiding                  '/OCULTANDO
 Jail                    '/CARCEL
 KillNPC                 '/RMATA
 WarnUser                '/ADVERTENCIA
 EditChar                '/MOD
 RequestCharInfo         '/INFO
 RequestCharStats        '/STAT
 RequestCharGold         '/BAL
 RequestCharInventory    '/INV
 RequestCharBank         '/BOV
 RequestCharSkills       '/SKILLS
 ReviveChar              '/REVIVIR
 OnlineGM                '/ONLINEGM
 OnlineMap               '/ONLINEMAP
 Forgive                 '/PERDON
 Kick                    '/ECHAR
 Execute                 '/EJECUTAR
 banChar                 '/BAN
 UnbanChar               '/UNBAN
 NPCFollow               '/SEGUIR
 SummonChar              '/SUM
 SpawnListRequest        '/CC
 SpawnCreature           'SPA
 ResetNPCInventory       '/RESETINV
 CleanWorld              '/LIMPIAR
 ServerMessage           '/RMSG
 nickToIP                '/NICK2IP
 IPToNick                '/IP2NICK
 GuildOnlineMembers      '/ONCLAN
 TeleportCreate          '/CT
 TeleportDestroy         '/DT
 RainToggle              '/LLUVIA
 SetCharDescription      '/SETDESC
 ForceMIDIToMap          '/FORCEMIDIMAP
 ForceWAVEToMap          '/FORCEWAVMAP
 RoyalArmyMessage        '/REALMSG
 ChaosLegionMessage      '/CAOSMSG
 CitizenMessage          '/CIUMSG
 CriminalMessage         '/CRIMSG
 TalkAsNPC               '/TALKAS
 DestroyAllItemsInArea   '/MASSDEST
 AcceptRoyalCouncilMember '/ACEPTCONSE
 AcceptChaosCouncilMember '/ACEPTCONSECAOS
 ItemsInTheFloor         '/PISO
 MakeDumb                '/ESTUPIDO
 MakeDumbNoMore          '/NOESTUPIDO
 dumpIPTables            '/DUMPSECURITY
 CouncilKick             '/KICKCONSE
 SetTrigger              '/TRIGGER
 AskTrigger              '/TRIGGER with no args
 BannedIPList            '/BANIPLIST
 BannedIPReload          '/BANIPRELOAD
 GuildMemberList         '/MIEMBROSCLAN
 GuildBan                '/BANCLAN
 BanIP                   '/BANIP
 UnbanIP                 '/UNBANIP
 CreateItem              '/CI
 DestroyItems            '/DEST
 ChaosLegionKick         '/NOCAOS
 RoyalArmyKick           '/NOREAL
 ForceMIDIAll            '/FORCEMIDI
 ForceWAVEAll            '/FORCEWAV
 RemovePunishment        '/BORRARPENA
 TileBlockedToggle       '/BLOQ
 KillNPCNoRespawn        '/MATA
 KillAllNearbyNPCs       '/MASSKILL
 LastIP                  '/LASTIP
 ChangeMOTD              '/MOTDCAMBIA
 SetMOTD                 'ZMOTD
 SystemMessage           '/SMSG
 CreateNPC               '/ACC
 CreateNPCWithRespawn    '/RACC
 ImperialArmour          '/AI1 - 4
 ChaosArmour             '/AC1 - 4
 NavigateToggle          '/NAVE
 ServerOpenToUsersToggle '/HABILITAR
 TurnOffServer           '/APAGAR
 TurnCriminal            '/CONDEN
 ResetFactions           '/RAJAR
 RemoveCharFromGuild     '/RAJARCLAN
 RequestCharMail         '/LASTEMAIL
 AlterPassword           '/APASS
 AlterMail               '/AEMAIL
 AlterName               '/ANAME
 ToggleCentinelActivated '/CENTINELAACTIVADO
 DoBackUp                '/DOBACKUP
 ShowGuildMessages       '/SHOWCMSG
 SaveMap                 '/GUARDAMAPA
 ChangeMapInfoPK         '/MODMAPINFO PK
 ChangeMapInfoBackup     '/MODMAPINFO BACKUP
 ChangeMapInfoRestricted '/MODMAPINFO RESTRINGIR
 ChangeMapInfoNoMagic    '/MODMAPINFO MAGIASINEFECTO
 ChangeMapInfoNoInvi     '/MODMAPINFO INVISINEFECTO
 ChangeMapInfoNoResu     '/MODMAPINFO RESUSINEFECTO
 ChangeMapInfoLand       '/MODMAPINFO TERRENO
 ChangeMapInfoZone       '/MODMAPINFO ZONA
 ChangeMapInfoStealNpc   '/MODMAPINFO ROBONPCm
 ChangeMapInfoNoOcultar  '/MODMAPINFO OCULTARSINEFECTO
 ChangeMapInfoNoInvocar  '/MODMAPINFO INVOCARSINEFECTO
 SaveChars               '/GRABAR
 CleanSOS                '/BORRAR SOS
 ShowServerForm          '/SHOW INT
 night                   '/NOCHE
 KickAllChars            '/ECHARTODOSPJS
 ReloadNPCs              '/RELOADNPCS
 ReloadServerIni         '/RELOADSINI
 ReloadSpells            '/RELOADHECHIZOS
 ReloadObjects           '/RELOADOBJ
 Restart                 '/REINICIAR
 ResetAutoUpdate         '/AUTOUPDATE
 ChatColor               '/CHATCOLOR
 Ignored                 '/IGNORADO
 CheckSlot               '/SLOT
 SetIniVar               '/SETINIVAR LLAVE CLAVE VALOR
 CreatePretorianClan     '/CREARPRETORIANOS
 RemovePretorianClan     '/ELIMINARPRETORIANOS
 EnableDenounces         '/DENUNCIAS
 ShowDenouncesList       '/SHOW DENUNCIAS
 MapMessage              '/MAPMSG
 SetDialog               '/SETDIALOG
 Impersonate             '/IMPERSONAR
 Imitate                 '/MIMETIZAR
 RecordAdd
 RecordRemove
 RecordAddObs
 RecordListRequest
 RecordDetailsRequest
 AlterGuildName
 HigherAdminsMessage
 End Enum

 '
 ' Mensajes
 '
 ' MENSAJE_*  --> Mensajes de texto que se muestran en el cuadro de texto
 '










 Public Enum eMessages
 DontSeeAnything
 NPCSwing
 NPCKillUser
 BlockedWithShieldUser
 BlockedWithShieldOther
 UserSwing
 SafeModeOn
 SafeModeOff
 ResuscitationSafeOff
 ResuscitationSafeOn
 NobilityLost
 CantUseWhileMeditating
 NPCHitUser
 UserHitNPC
 UserAttackedSwing
 UserHittedByUser
 UserHittedUser
 WorkRequestTarget
 HaveKilledUser
 UserKill
 EarnExp
 GoHome
 CancelGoHome
 FinishHome
 End Enum

 'Inventario
 Type Inventory
 OBJIndex As Integer
 Name As String
 GrhIndex As Integer
 '[Alejo]: tipo de datos ahora es Long
 Amount As Long
 '[/Alejo]
 Equipped As Byte
 Valor As Single
 OBJType As Integer
 MaxDef As Integer
 MinDef As Integer 'Budi
 MaxHit As Integer
 MinHit As Integer
 End Type

 Type NpCinV
 OBJIndex As Integer
 Name As String
 GrhIndex As Integer
 Amount As Integer
 Valor As Single
 OBJType As Integer
 MaxDef As Integer
 MinDef As Integer
 MaxHit As Integer
 MinHit As Integer
 C1 As String
 C2 As String
 C3 As String
 C4 As String
 C5 As String
 C6 As String
 C7 As String
 End Type

 Type tReputacion 'Fama del usuario
 NobleRep As Long
 BurguesRep As Long
 PlebeRep As Long
 LadronesRep As Long
 BandidoRep As Long
 AsesinoRep As Long

 Promedio As Long
 End Type

 Type tEstadisticasUsu
 CiudadanosMatados As Long
 CriminalesMatados As Long
 UsuariosMatados As Long
 NpcsMatados As Long
 Clase As String
 PenaCarcel As Long
 End Type

 Type tItemsConstruibles
 Name As String
 OBJIndex As Integer
 GrhIndex As Integer
 LinH As Integer
 LinP As Integer
 LinO As Integer
 Madera As Integer
 MaderaElfica As Integer
 Upgrade As Integer
 UpgradeName As String
 UpgradeGrhIndex As Integer
 End Type

 Public Nombres As Boolean

 'User status vars
 Global OtroInventario(1 To MAX_INVENTORY_SLOTS) As Inventory

 Public UserHechizos(1 To MAXHECHI) As Integer

 Public NPCInventory(1 To MAX_NPC_INVENTORY_SLOTS) As NpCinV
 Public UserMeditar As Boolean
 Public UserName As String
 Public UserPassword As String
 Public UserMaxHP As Integer
 Public UserMinHP As Integer
 Public UserMaxMAN As Integer
 Public UserMinMAN As Integer
 Public UserMaxSTA As Integer
 Public UserMinSTA As Integer
 Public UserMaxAGU As Byte
 Public UserMinAGU As Byte
 Public UserMaxHAM As Byte
 Public UserMinHAM As Byte
 Public UserGLD As Long
 Public UserLvl As Integer
 Public UserPort As Integer
 Public UserServerIP As String
 Public UserEstado As Byte '0 = Vivo & 1 = Muerto
 Public UserPasarNivel As Long
 Public UserExp As Long
 Public UserReputacion As tReputacion
 Public UserEstadisticas As tEstadisticasUsu
 Public UserDescansar As Boolean
 Public tipf As String
 Public PrimeraVez As Boolean
 Public bShowTutorial As Boolean
 Public FPSFLAG As Boolean
 Public pausa As Boolean
 Public UserParalizado As Boolean
 Public UserNavegando As Boolean
 Public UserHogar As eCiudad

 Public UserFuerza As Byte
 Public UserAgilidad As Byte

 Public UserWeaponEqpSlot As Byte
 Public UserArmourEqpSlot As Byte
 Public UserHelmEqpSlot As Byte
 Public UserShieldEqpSlot As Byte

 '<-------------------------NUEVO-------------------------->
 Public Comerciando As Boolean
 Public MirandoForo As Boolean
 Public MirandoAsignarSkills As Boolean
 Public MirandoEstadisticas As Boolean
 Public MirandoParty As Boolean
 Public MirandoCarpinteria As Boolean
 Public MirandoHerreria As Boolean
 '<-------------------------NUEVO-------------------------->

 Public UserClase As eClass
 Public UserSexo As eGenero
 Public UserRaza As eRaza
 Public UserEmail As String

 Public Const NUMCIUDADES As Byte = 5
 Public Const NUMSKILLS As Byte = 20
 Public Const NUMATRIBUTOS As Byte = 5
 Public Const NUMCLASES As Byte = 12
 Public Const NUMRAZAS As Byte = 5

 Public UserSkills(1 To NUMSKILLS) As Byte
 Public PorcentajeSkills(1 To NUMSKILLS) As Byte
 Public SkillsNames(1 To NUMSKILLS) As String

 Public UserAtributos(1 To NUMATRIBUTOS) As Byte
 Public AtributosNames(1 To NUMATRIBUTOS) As String

 Public Ciudades(1 To NUMCIUDADES) As String

 Public ListaRazas(1 To NUMRAZAS) As String
 Public ListaClases(1 To NUMCLASES) As String

 Public SkillPoints As Integer
 Public Alocados As Integer
 Public flags() As Integer
 Public Oscuridad As Integer
 Public logged As Boolean

 Public UsingSkill As Integer

 Public MD5HushYo As String * 16

 Public pingTime As Long

 Public EsPartyLeader As Boolean

 Public Enum E_MODO
 Normal = 1
 CrearNuevoPj = 2
 Dados = 3
 End Enum

 Public EstadoLogin As E_MODO

 Public Enum FxMeditar
 CHICO = 4
 MEDIANO = 5
 GRANDE = 6
 XGRANDE = 16
 XXGRANDE = 34
 End Enum

 Public Enum eClanType
 ct_RoyalArmy
 ct_Evil
 ct_Neutral
 ct_GM
 ct_Legal
 ct_Criminal
 End Enum

 Public Enum eEditOptions
 eo_Gold = 1
 eo_Experience
 eo_Body
 eo_Head
 eo_CiticensKilled
 eo_CriminalsKilled
 eo_Level
 eo_Class
 eo_Skills
 eo_SkillPointsLeft
 eo_Nobleza
 eo_Asesino
 eo_Sex
 eo_Raza
 eo_addGold
 eo_Vida
 eo_Poss
 End Enum

 ''
 ' TRIGGERS
 '
 ' @param NADA nada
 ' @param BAJOTECHO bajo techo
 ' @param trigger_2 ???
 ' @param POSINVALIDA los npcs no pueden pisar tiles con este trigger
 ' @param ZONASEGURA no se puede robar o pelear desde este trigger
 ' @param ANTIPIQUETE
 ' @param ZONAPELEA al pelear en este trigger no se caen las cosas y no cambia el estado de ciuda o crimi
 '
 Public Enum eTrigger
 NADA = 0
 BAJOTECHO = 1
 trigger_2 = 2
 POSINVALIDA = 3
 ZONASEGURA = 4
 ANTIPIQUETE = 5
 ZONAPELEA = 6
 End Enum

 'Server stuff
 Public RequestPosTimer As Integer 'Used in main loop
 Public stxtbuffer As String 'Holds temp raw data from server
 Public stxtbuffercmsg As String 'Holds temp raw data from server
 Public SendNewChar As Boolean 'Used during login
 Public Connected As Boolean 'True when connected to server
 Public DownloadingMap As Boolean 'Currently downloading a map from server
 Public UserMap As Integer

 'Control
 Public prgRun As Boolean 'When true the program ends

 Public IPdelServidor As String
 Public PuertoDelServidor As String

 '
 '********** FUNCIONES API ***********
 '

 Public Declare Function GetTickCount Lib "kernel32" () As Long

 'para escribir y leer variables
 Public Declare Function writeprivateprofilestring Lib "kernel32" Alias "WritePrivateProfileStringA" (ByVal lpApplicationname As String, ByVal lpKeyname As Any, ByVal lpString As String, ByVal lpFileName As String) As Long
 Public Declare Function getprivateprofilestring Lib "kernel32" Alias "GetPrivateProfileStringA" (ByVal lpApplicationname As String, ByVal lpKeyname As Any, ByVal lpdefault As String, ByVal lpreturnedstring As String, ByVal nsize As Long, ByVal lpFileName As String) As Long

 'Teclado
 Public Declare Function GetKeyState Lib "user32" (ByVal nVirtKey As Long) As Integer
 Public Declare Function GetAsyncKeyState Lib "user32" (ByVal nVirtKey As Long) As Integer

 Public Declare Sub Sleep Lib "kernel32" (ByVal dwMilliseconds As Long)

 'Para ejecutar el browser y programas externos
 Public Const SW_SHOWNORMAL As Long = 1
 Public Declare Function ShellExecute Lib "shell32.dll" Alias "ShellExecuteA" (ByVal hwnd As Long, ByVal lpOperation As String, ByVal lpFile As String, ByVal lpParameters As String, ByVal lpDirectory As String, ByVal nShowCmd As Long) As Long

 'Lista de cabezas
 Public Type tIndiceCabeza
 Head(1 To 4) As Integer
 End Type

 Public Type tIndiceCuerpo
 Body(1 To 4) As Integer
 HeadOffsetX As Integer
 HeadOffsetY As Integer
 End Type

 Public Type tIndiceFx
 Animacion As Integer
 OffsetX As Integer
 OffsetY As Integer
 End Type

 Public EsperandoLevel As Boolean

 ' Tipos de mensajes
 Public Enum eForumMsgType
 ieGeneral
 ieGENERAL_STICKY
 ieREAL
 ieREAL_STICKY
 ieCAOS
 ieCAOS_STICKY
 End Enum

 ' Indica los privilegios para visualizar los diferentes foros
 Public Enum eForumVisibility
 ieGENERAL_MEMBER = &H1
 ieREAL_MEMBER = &H2
 ieCAOS_MEMBER = &H4
 End Enum

 ' Indica el tipo de foro
 Public Enum eForumType
 ieGeneral
 ieREAL
 ieCAOS
 End Enum

 ' Limite de posts
 Public Const MAX_STICKY_POST As Byte = 5
 Public Const MAX_GENERAL_POST As Byte = 30
 Public Const STICKY_FORUM_OFFSET As Byte = 50

 ' Estructura contenedora de mensajes
 Public Type tForo
 StickyTitle(1 To MAX_STICKY_POST) As String
 StickyPost(1 To MAX_STICKY_POST) As String
 StickyAuthor(1 To MAX_STICKY_POST) As String
 GeneralTitle(1 To MAX_GENERAL_POST) As String
 GeneralPost(1 To MAX_GENERAL_POST) As String
 GeneralAuthor(1 To MAX_GENERAL_POST) As String
 End Type

 ' 1 foro general y 2 faccionarios
 Public Foros(0 To 2) As tForo

 ' Forum info handler
 Public clsForos As clsForum

 'FragShooter variables
 Public FragShooterCapturePending As Boolean
 Public FragShooterNickname As String
 Public FragShooterKilledSomeone As Boolean


 Public Traveling As Boolean

 Public bShowGuildNews As Boolean
 Public GuildNames() As String
 Public GuildMembers() As String

 Public Const OFFSET_HEAD As Integer = -34

 Public Enum eSMType
 sResucitation
 sSafemode
 mSpells
 mWork
 End Enum

 Public Const SM_CANT As Byte = 4
 Public SMStatus(SM_CANT) As Boolean

 'Hardcoded grhs and items
 Public Const GRH_INI_SM As Integer = 4978

 Public Const ORO_INDEX As Integer = 12
 Public Const ORO_GRH As Integer = 511

 Public Const GRH_HALF_STAR As Integer = 5357
 Public Const GRH_FULL_STAR As Integer = 5358
 Public Const GRH_GLOW_STAR As Integer = 5359

 Public Const LH_GRH As Integer = 724
 Public Const LP_GRH As Integer = 725
 Public Const LO_GRH As Integer = 723

 Public Const MADERA_GRH As Integer = 550
 Public Const MADERA_ELFICA_GRH As Integer = 1999

 Public picMouseIcon As Picture

 Public Enum eMoveType
 Inventory = 1
 Bank
 End Enum

 Public Const MP3_INITIAL_INDEX As Integer = 1000
 */
