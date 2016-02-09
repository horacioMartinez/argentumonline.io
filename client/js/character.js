define(['entity', 'transition', 'timer', 'animacion', 'enums'], function (Entity, Transition, Timer, Animacion, Enums) {

    var Character = Entity.extend({
        init: function (CharIndex, BodyGrh, HeadGrh, offHeadX, offHeadY, Heading, gridX, gridY, WeaponGrh, ShieldGrh, HelmetGrh, Name, NickColor, Privileges) {
            var self = this;

            this._super(gridX, gridY);

            if (!Name) // es un bicho o npc
                this.moveSpeed = 290;// (duracion de movimiento en ms, animaciones de mov se setean automaticamnete a esta vel (abajo) )
            else
                this.moveSpeed = 230; // PJ TODO: setear bien estos valores, fijarse que en lo posible no haya resetmovements (esto pasa si la animacion es mas lenta que el llamado a cambiar de pos)

            this.id = CharIndex;
            this.bodyGrhs = null;
            this.headGrhs = null;
            this.weaponGrhs = null;
            this.shieldGrhs = null;
            this.helmetGrhs = null;
            this.FXs = [];

            this.setBodyGrh(BodyGrh);
            this.setHeadGrh(HeadGrh);
            this.setWeaponGrh(WeaponGrh);
            this.setShieldGrh(ShieldGrh);
            this.setHelmetGrh(HelmetGrh);

            this.offHeadX = offHeadX;
            this.offHeadY = offHeadY;
            this.offFxX = 0;
            this.offFxY = 0;

            this.heading = Heading;

            this.Name = Name;
            this.NickColor = NickColor;
            this.Privileges = Privileges;

            this.moviendose = false; // moviendose es si sigue pasando al otro tile desde el anterior

            this.chat = null;
            this.tiempoChatInicial = 0;
            this.DURACION_CHAT = 4000;

            this.muerto = false;
            this.movement = new Transition();
        },

        getDirMov: function () {
            return this.heading;
        },

        _getGrh: function (grh) {
            if (!grh)
                return 0;
            if (grh[this.heading] instanceof Animacion) {
                return grh[this.heading].getCurrentFrame();
            }
            return grh[this.heading];
        },

        getBodyGrh: function () { // hacer que devuelve el frame correspondiente si se esta moviendo
            return this._getGrh(this.bodyGrhs);
        },

        getHeadGrh: function () {
            return this._getGrh(this.headGrhs);
        },

        getHelmetGrh: function () { // hacer que devuelve el frame correspondiente si se esta moviendo

            return this._getGrh(this.helmetGrhs);
        },

        getWeaponGrh: function () { // hacer que devuelve el frame correspondiente si se esta moviendo
            return this._getGrh(this.weaponGrhs);
        },

        getShieldGrh: function () {
            return this._getGrh(this.shieldGrhs);
        },

        getFXs: function () {
            return this.FXs;
        },

        tratarDeCaminar: function () {
            return true;
        },

        mover: function (dir) {
            this.resetMovement();
            this.heading = dir;
            this.moviendose = true;
        },

        hasMoved: function () { // se ejecuta al finalizar de caminar
            this.moviendose = false;
        },

        cambiarHeading: function (heading) {
            this.resetMovement();
            this.heading = heading;
        },

        resetMovement: function () {
            if (this.movement.inProgress) {
                this.movement.stop();
                if (this.movement.stopFunction)
                    this.movement.stopFunction();
                //log.error("resetmovemente!, name: " + this.Name);
            }
            this.moviendose = false;
        },

        setGridPositionOnly: function (gridX, gridY) {
            this.gridX = gridX;
            this.gridY = gridY;
        },

        _corregirVelocidad: function (grhs) {
            if (grhs[Enums.Heading.este] instanceof Animacion)
                grhs[Enums.Heading.este].setSpeed(this.moveSpeed);
            if (grhs[Enums.Heading.oeste] instanceof Animacion)
                grhs[Enums.Heading.oeste].setSpeed(this.moveSpeed);
            if (grhs[Enums.Heading.norte] instanceof Animacion)
                grhs[Enums.Heading.norte].setSpeed(this.moveSpeed);
            if (grhs[Enums.Heading.sur] instanceof Animacion)
                grhs[Enums.Heading.sur].setSpeed(this.moveSpeed);

            return grhs;

        },

        setBodyGrh: function (grhs) {
            this.bodyGrhs = this._corregirVelocidad(grhs);
        },

        setHeadGrh: function (grhs) {
            this.headGrhs = this._corregirVelocidad(grhs);
        },

        setWeaponGrh: function (grhs) {
            this.weaponGrhs = this._corregirVelocidad(grhs);
        },

        setShieldGrh: function (grhs) {
            this.shieldGrhs = this._corregirVelocidad(grhs);
        },

        setHelmetGrh: function (grhs) {
            this.helmetGrhs = this._corregirVelocidad(grhs);
        },

        setFX: function (anim, offFxX, offFxY) {

            if (!anim)
                return;

            var id = 0;
            while (this.FXs[id])
                id++;

            var self = this;
            anim.onFinAnim(this.crearFinFxFunc(id));
            this.FXs[id] = {};
            this.FXs[id].anim = anim;

            this.FXs[id].offX = offFxX;
            this.FXs[id].offY = offFxY;

        },
        crearFinFxFunc: function(id){
            var self = this;
            return function(){
                self.deleteFX(id)
            };
        },

        deleteFX: function(id){
            if (!this.FXs[id])
                return;
            this.FXs[id] = null;
        },

        stopFXsInfinitos: function(){ // por ej, para de meditar
            for (var i = 0; i < this.FXs.length; i++){
                if (this.FXs[i])
                    if ( (this.FXs[i].anim.loops < 1) )
                        this.FXs[i] = null;
            }
        },

        hasShadow: function () {
            return true;
        },

        resetMovimientos: function () {
            if (this.bodyGrhs[this.heading] instanceof Animacion)
                this.bodyGrhs[this.heading].start();
            if (this.headGrhs[this.heading] instanceof Animacion)
                this.headGrhs[this.heading].start();
            if (this.weaponGrhs[this.heading] instanceof Animacion)
                this.weaponGrhs[this.heading].start();
            if (this.shieldGrhs[this.heading] instanceof Animacion)
                this.shieldGrhs[this.heading].start();
            if (this.helmetGrhs[this.heading] instanceof Animacion)
                this.helmetGrhs[this.heading].start();
        },

        animarMovimiento: function () {
            this.resetMovimientos();
        },

        update: function (time) {
            // animaciones
            if (this.bodyGrhs[this.heading] instanceof Animacion)
                this.bodyGrhs[this.heading].update(time);
            if (this.headGrhs[this.heading] instanceof Animacion)
                this.headGrhs[this.heading].update(time);
            if (this.weaponGrhs[this.heading] instanceof Animacion)
                this.weaponGrhs[this.heading].update(time);
            if (this.shieldGrhs[this.heading] instanceof Animacion)
                this.shieldGrhs[this.heading].update(time);
            if (this.helmetGrhs[this.heading] instanceof Animacion)
                this.helmetGrhs[this.heading].update(time);
            for (var i = 0; i < this.FXs.length; i++) {
                if (this.FXs[i])
                    this.FXs[i].anim.update(time);
            }
            // chat
            if (this.chat) {
                if (time > this.tiempoChatInicial + this.DURACION_CHAT)
                    this.chat = null;
            }
        },

    });

    return Character;
});