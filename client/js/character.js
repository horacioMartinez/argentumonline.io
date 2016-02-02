define(['entity', 'transition', 'timer', 'animacion', 'enums'], function (Entity, Transition, Timer, Animacion, Enums) {

    var Character = Entity.extend({
        init: function (CharIndex, BodyGrh, HeadGrh, offHeadX, offHeadY, Heading, gridX, gridY, WeaponGrh, ShieldGrh, HelmetGrh, FX, FXoffX, FXoffY, FXLoops, Name, NickColor, Privileges) {
            var self = this;

            this._super(gridX, gridY);

            if (!Name) // es un bicho o npc
                this.moveSpeed = 290;// (duracion de movimiento en ms, animaciones de mov se setean automaticamnete a esta vel (abajo) )
            else
                this.moveSpeed = 230; // PJ TODO: setear bien estos valores, fijarse que en lo posible no haya resetmovements (esto pasa si la animacion es mas lenta que el llamado a cambiar de pos)

            this.id = CharIndex;
            this.bodyGrhs = {};
            this.headGrhs = {};
            this.weaponGrhs = {};
            this.shieldGrhs = {};
            this.helmetGrhs = {};
            this.setBodyGrh(BodyGrh);
            this.setHeadGrh(HeadGrh);
            this.setWeaponGrh(WeaponGrh);
            this.setShieldGrh(ShieldGrh);
            this.setHelmetGrh(HelmetGrh);

            this.offHeadX = offHeadX;
            this.offHeadY = offHeadY;
            this.heading = Heading;
            this.FX = FX;
            this.FXoffX = FXoffX;
            this.FXoffY = FXoffY;
            this.FXLoops = FXLoops;

            this.Name = Name;
            this.NickColor = NickColor;
            this.Privileges = Privileges;

            this.moviendose = false; // moviendose es si sigue pasando al otro tile desde el anterior

            this.chat = null;
            this.tiempoChatInicial = 0;
            this.DURACION_CHAT = 4000;

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

        puedeCaminar: function () {
            return true;
        },

        mover: function (dir) {
            this.resetMovement();
            this.heading = dir;
            this.moviendose = true;
        },

        cambiarHeading: function (heading) {
            this.resetMovement();
            this.heading = heading;
        },

        resetMovement: function () {
            if (this.moviendose) {
                this.movement.stop();
                if (this.movement.stopFunction)
                    this.movement.stopFunction();
                log.error("resetmovemente!, name: " + this.Name);
            }
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

            // chat
            if (this.chat) {
                if (time > this.tiempoChatInicial + this.DURACION_CHAT)
                    this.chat = null;
            }
        },

    });

    return Character;
});