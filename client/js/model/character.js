define(['model/entity', 'transition', 'lib/pixi', 'enums'], function (Entity, Transition, PIXI, Enums) {

    class Character extends Entity {
        constructor(CharIndex, gridX, gridY, Heading, Name, clan, Body, Head, Weapon, Shield, Helmet, FX, FXLoops, NickColor) {

            super(gridX, gridY);

            var self = this;
            if (!Name) // es un bicho o npc
            {
                this.moveSpeed = 200;
            }// bicho (duracion de movimiento en ms, animaciones de mov se setean automaticamnete a esta vel (abajo) )
            else {
                this.moveSpeed = 230;
            } // PJ TODO: setear bien estos valores, fijarse que en lo posible no haya resetmovements (esto pasa si la animacion es mas lenta que el llamado a cambiar de pos)

            this.id = CharIndex;

            this._heading = Heading;

            this.movementTransition = new Transition();
            this.sprite = null;
            this.spriteNombre = null;
            this.texto = null;

            this._nombre = Name;
            this._clan = clan;
            this._body = Body;
            this._head = Head;
            this._weapon = Weapon;
            this._shield = Shield;
            this._helmet = Helmet;
            this._fx = FX;
            this._fxLoops = FXLoops;
            this._nickColor = NickColor;
        }


        mover(dir, movimientoCallback, finMovimientoCallback) {
            this.resetMovement();
            this.heading = dir;
            this._crearMovimiento(movimientoCallback, finMovimientoCallback);
        }

        _crearMovimiento(callback_mov, finMovimientoCallback) {
            this._animarMovimiento();

            var self = this;
            var distPrimerFrame = 0; //32 / (this.moveSpeed / (1000 / 60));

            if (self.heading === Enums.Heading.oeste) {

                self.movementTransition.start(
                    function (x) {
                        self.setPosition(x, self.y);
                        if (callback_mov) {
                            callback_mov(self.x, self.y);
                        }
                    },
                    function () {
                        self.setPosition(self.movementTransition.endValue, self.y);
                        if (callback_mov) {
                            callback_mov(self.x, self.y);
                        }
                        self._hasMoved();

                        if (finMovimientoCallback) {
                            finMovimientoCallback();
                        }
                    },
                    self.x - distPrimerFrame,
                    self.x - 32,
                    self.moveSpeed);
            }
            else if (self.heading === Enums.Heading.este) {
                self.movementTransition.start(
                    function (x) {
                        self.setPosition(x, self.y);
                        if (callback_mov) {
                            callback_mov(self.x, self.y);
                        }
                    },
                    function () {
                        self.setPosition(self.movementTransition.endValue, self.y);
                        if (callback_mov) {
                            callback_mov(self.x, self.y);
                        }
                        self._hasMoved();
                        if (finMovimientoCallback) {
                            finMovimientoCallback();
                        }
                    },
                    self.x + distPrimerFrame,
                    self.x + 32,
                    self.moveSpeed);
            }
            else if (self.heading === Enums.Heading.norte) {
                self.movementTransition.start(
                    function (y) {
                        self.setPosition(self.x, y);
                        if (callback_mov) {
                            callback_mov(self.x, self.y);
                        }
                    },
                    function () {
                        self.setPosition(self.x, self.movementTransition.endValue);
                        if (callback_mov) {
                            callback_mov(self.x, self.y);
                        }
                        self._hasMoved();
                        if (finMovimientoCallback) {
                            finMovimientoCallback();
                        }
                    },
                    self.y - distPrimerFrame,
                    self.y - 32,
                    self.moveSpeed);
            }
            else if (self.heading === Enums.Heading.sur) {
                self.movementTransition.start(
                    function (y) {
                        self.setPosition(self.x, y);
                        if (callback_mov) {
                            callback_mov(self.x, self.y);
                        }
                    },
                    function () {
                        self.setPosition(self.x, self.movementTransition.endValue);
                        if (callback_mov) {
                            callback_mov(self.x, self.y);
                        }
                        self._hasMoved();
                        if (finMovimientoCallback) {
                            finMovimientoCallback();
                        }
                    },
                    self.y + distPrimerFrame,
                    self.y + 32,
                    self.moveSpeed);
            }

            PIXI.ticker.shared.add(this._updateMovement, this);
        }


        estaMoviendose(){
            return this.movementTransition.inProgress;
        }

        // TODO (MUY IMPORTANTE) reveer esto de movimientos,  usar aceleracion ? mov del player en 1 solo event

        _updateMovement(delta) {
            if (this.estaMoviendose()) {
                this.movementTransition.step(delta * (1 / 60) * 1000);
            }
        }

        _hasMoved() { // se ejecuta al finalizar de caminar
            PIXI.ticker.shared.remove(this._updateMovement, this);
        }

        resetMovement() {
            if (this.estaMoviendose()) {
                log.error("reset movement!!!");
                this.movementTransition.stop();
                if (this.movementTransition.stopFunction) {
                    this.movementTransition.stopFunction();
                }
            }
        }

        _animarMovimiento() {
            if (this.sprite) {
                this.sprite.play();
            }
        }

        get muerto(){
            return !((this._head !== Enums.Muerto.cabezaCasper) && (this._body !== Enums.Muerto.cuerpoFragataFantasmal));
        }

        get heading(){
            return this._heading;
        }

        set heading(heading){
            if (this._heading !== heading){
                this._heading = heading;
                this.emit('headingChanged');
            }
        }


        get body(){
            return this._body;
        }

        set body(body){
            if (this._body !== body){
                this._body = body;
                this.emit('bodyChanged');
            }
        }

        get head(){
            return this._head;
        }

        set head(head){
            if (this._head !== head){
                this._head = head;
                this.emit('headChanged');
            }
        }

        get weapon(){
            return this._weapon;
        }

        set weapon(weapon){
            if (this._weapon !== weapon){
                this._weapon = weapon;
                this.emit('weaponChanged');
            }
        }

        get shield(){
            return this._shield;
        }

        set shield(shield){
            if (this._shield !== shield){
                this._shield = shield;
                this.emit('shieldChanged');
            }
        }

        get helmet(){
            return this._helmet;
        }

        set helmet(helmet){
            if (this._helmet !== helmet){
                this._helmet = helmet;
                this.emit('helmetChanged');
            }
        }

        get fx(){
            return this._fx;
        }

        set fx(fx){
            if (this._fx !== fx){
                this._fx = fx;
                this.emit('fxChanged');
            }
        }

        get fxLoops(){
            return this._fxLoops;
        }

        set fxLoops(fxLoops){
            if (this._fxLoops !== fxLoops){
                this._fxLoops = fxLoops;
                this.emit('fxLoopsChanged');
            }
        }

        get nombre(){
            return this._nombre;
        }

        get clan(){
            return this._clan;
        }

        get nickColor(){
            return this._nickColor;
        }

        setName(nombre,clan,color) {
            if (this._nombre !== nombre || this._clan !== clan || this._nickColor !== color) {
                this._nombre = nombre;
                this._clan = clan;
                this._nickColor = color;
                this.emit('nameChanged');
            }
        }

    }

    return Character;
});