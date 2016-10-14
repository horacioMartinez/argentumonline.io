define(['model/entity', 'transition', 'lib/pixi', 'enums', 'model/charactermovement'], function (Entity, Transition, PIXI, Enums, CharacterMovement) {

    class Character extends Entity {
        constructor(CharIndex, gridX, gridY, Heading, Name, clan, Body, Head, Weapon, Shield, Helmet, FX, FXLoops, NickColor) {

            super(gridX, gridY);

            var self = this;
            if (!Name) // es un bicho o npc
            {
                this.moveSpeed = 200;
            }// bicho (duracion de movimiento en ms, animaciones de mov se setean automaticamnete a esta vel (abajo) )
            else {
                this.moveSpeed = 210;
            } // PJ TODO: setear bien estos valores, fijarse que en lo posible no haya resetmovements (esto pasa si la animacion es mas lenta que el llamado a cambiar de pos)

            this.id = CharIndex;

            this._heading = Heading;

            this.sprite = null;
            this.spriteNombre = null;
            this.texto = null;

            this.movement = new CharacterMovement(this);
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

        setSpeed(speed){
            this.moveSpeed = speed;
            this.sprite.setSpeed(speed);
        }
        
        update(delta){
            this.movement.update(delta);


            //this.sprite.update(delta);
            //if (this.spriteNombre){
            //    this.spriteNombre.update(delta);
            //}
            if (this.texto){
                this.texto.update(delta);
            }
        }

        mover(dir, movimientoCallback, finMovimientoCallback) {
            this._animarMovimiento();
            let finCb = () => {
                this._finAnimarMovimiento();
                if (finMovimientoCallback) {
                    finMovimientoCallback();
                }
            };
            return this.movement.mover(dir, movimientoCallback, finCb);
        }

        estaMoviendose(){
            return this.movement.estaMoviendose();
        }

        resetMovement() {
            return this.movement.resetMovement();
        }

        _animarMovimiento() {
            if (this.sprite) {
                this.sprite.loop(true);
                this.sprite.play();
            }
        }

        _finAnimarMovimiento() {
            if (this.sprite) {
                this.sprite.loop(false);
            }
        }

        get muerto(){
            return (this.head === Enums.Muerto.cabezaCasper) || (this.body === Enums.Muerto.cuerpoFragataFantasmal);
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