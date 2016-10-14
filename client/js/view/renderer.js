define(['enums', 'lib/pixi', 'view/camera', 'view/consola', 'view/containerordenado', 'view/indicadormapa',
        'view/entityrenderer', 'view/climarenderer', 'view/maparenderer','view/rendererutils'],
    function (Enums, PIXI, Camera, Consola, ContainerOrdenado, IndicadorMapa, EntityRenderer, ClimaRenderer,
              MapaRenderer, RendererUtils) {

        class Renderer {
            constructor(assetManager, escala) {
                this.MAPA_WIDTH = 100; // todo: usarlo desde mapa
                this.assetManager = assetManager;
                this.grhs = assetManager.grhs;
                this.indices = assetManager.getIndices();
                this.armas = assetManager.getArmas();
                this.cabezas = assetManager.getCabezas();
                this.cascos = assetManager.getCascos();
                this.cuerpos = assetManager.getCuerpos();
                this.escudos = assetManager.getEscudos();
                this.fxs = assetManager.getFxs();

                this.tilesize = 32;
                this.camera = new Camera(this.tilesize);

                this.entityRenderer = null;
                this.mapaRenderer = null;
                this.climaRenderer = null;

                this._inicializarPixi();
                this.rescale(escala);
            }

            _inicializarPixi() {
                PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
                PIXI.MIPMAP_TEXTURES = false;
                PIXI.GC_MODES.DEFAULT = PIXI.GC_MODES.MANUAL;

                this.pixiRenderer = new PIXI.autoDetectRenderer(this.camera.gridW * this.tilesize, this.camera.gridH * this.tilesize);
                $(this.pixiRenderer.view).css('position', 'relative');
                $(this.pixiRenderer.view).css('display', 'block');
                $("#gamecanvas").append(this.pixiRenderer.view);
                this._initStage();
            }

            _initStage() {
                this.stage = new PIXI.Container();
                this.gameStage = new PIXI.Container();
                this.climaContainer = new PIXI.Container();
                this.layer1 = new PIXI.Container();
                this.layer2 = new PIXI.Container();
                this.gameNames = new PIXI.Container();
                this.layer3 = new ContainerOrdenado(this.MAPA_WIDTH);
                this.layer3.ordenado = true;
                this.layer4 = new PIXI.Container();
                this.gameChat = new PIXI.Container();
                this.consola = new Consola(this.escala);
                this.indicadorMapa = new IndicadorMapa(this.escala);
                this.stage.addChild(this.gameStage);
                this.stage.addChild(this.climaContainer);
                this.stage.addChild(this.consola);
                this.stage.addChild(this.indicadorMapa);
                this.gameStage.addChild(this.layer1);
                this.gameStage.addChild(this.layer2);
                this.gameStage.addChild(this.gameNames);
                this.gameStage.addChild(this.layer3);
                this.gameStage.addChild(this.layer4);
                this.gameStage.addChild(this.gameChat);

                this.entityRenderer = new EntityRenderer(this.escala, this.layer3, this.gameNames, this.gameChat, this.camera, this.assetManager, this.gameStage);
                this.climaRenderer = new ClimaRenderer(this.escala, this.climaContainer, this.assetManager, this.pixiRenderer);
                this.mapaRenderer = new MapaRenderer(this.camera, this.assetManager, this.layer1, this.layer2, this.layer3, this.layer4);
            }

            update(delta){
                //this.entityRenderer.update(delta);
                this.climaRenderer.update(delta);
                //this.mapaRenderer.update(delta);
                this.consola.update(delta);
            }


            agregarTextoConsola(texto, font) {
                this.consola.agregarTexto(texto, font);
            }

            actualizarIndicadorMapa(numMap, x, y) {
                this.indicadorMapa.actualizar(numMap, x, y);
            }

            agregarItem(item, numGrh) {
                this.entityRenderer.agregarItem(item, numGrh);
            }

            sacarItem(item) {
                this.entityRenderer.sacarItem(item);
            }

            agregarCharacter(char) {
                this.entityRenderer.agregarCharacter(char);
            }

            sacarCharacter(char) {
                this.entityRenderer.sacarCharacter(char);
            }

            setCharacterChat(char, chat, r, g, b) {
                this.entityRenderer.setCharacterChat(char, chat, r, g, b);
            }

            removerChat(char) {
                this.entityRenderer.removerChat(char);
            }

            setCharVisible(char, visible) {
                this.entityRenderer.setCharVisible(char, visible);
            }

            agregarCharacterHoveringInfo(char, valor, font) {
                this.entityRenderer.agregarCharacterHoveringInfo(char, valor, font);
            }

            setCharacterFX(char, FX, FXLoops) {
                this.entityRenderer.setCharacterFX(char, FX, FXLoops);
            }

            entityVisiblePorCamara(entity, extraPositions) {
                return this.entityRenderer.entityVisiblePorCamara(entity,extraPositions);
            }

            entityEnTileVisible(entity) { // puede que no este en un tile visible pero si sea visible la entidad (para eso usar el de arriba)
                return this.entityRenderer.entityEnTileVisible(entity);
            }

            rescale(escala) {
                // calcular escala que no haga quedar a los tiles en posiciones no enteras:
                let newTilesize = Math.floor(escala * this.tilesize);
                escala = newTilesize / this.tilesize;

                this.escala = escala;

                this.pixiRenderer.resize(Math.round(this.camera.gridW * this.tilesize * escala), Math.round(this.camera.gridH * this.tilesize * escala));
                this.gameStage.scale.x = escala;
                this.gameStage.scale.y = escala;

                this.gameChat.scale.x = 1 / escala;
                this.gameChat.scale.y = 1 / escala;

                this.gameNames.scale.x = 1 / escala;
                this.gameNames.scale.y = 1 / escala;

                this._syncGamePosition();

                for (var i = 0; i < this.gameChat.children.length; i++) {
                    this.gameChat.children[i].setEscala(escala);
                }
                for (var name of this.gameNames.children) {
                    name.setEscala(escala);
                }
                this.consola.setEscala(escala);
                
                this.indicadorMapa.x = Math.floor((17 * 32 - 75) * escala);
                this.indicadorMapa.y = Math.floor((13 * 32 - 12) * escala);
                this.indicadorMapa.setEscala(escala);

                /* TEMPORAL */
                if (this.entityRenderer) {
                    this.entityRenderer.rescale(escala);
                }
                if (this.climaRenderer) {
                    this.climaRenderer.escala = escala;
                }
                /* TEMPORAL */
            }

            clean(escala) {
                while (this.stage.children.length > 0) {
                    var child = this.stage.getChildAt(0);
                    RendererUtils.removePixiChild(this.stage,child);
                }

                this._initStage();
                this.rescale(escala);
            }

            setBajoTecho(bajoT) {
                this.layer4.visible = !bajoT;
            }

            updateBeforeMovementBegins(dir,entities) {
                this.mapaRenderer.updateTilesMov(dir);
                this.entityRenderer.updateEntitiesMov(dir,entities);
            }


            cambiarMapa(mapa) {
                this.mapaRenderer.cambiarMapa(mapa);
            }

            drawMapaIni(gridX, gridY, entities) {
                this.resetCameraPosition(gridX, gridY,entities);
                this._syncGamePosition();
                this.mapaRenderer.drawMapaIni(gridX, gridY);
            }

            resetCameraPosition(gridX, gridY, entities) {
                this.camera.lookAtGridPos(gridX, gridY);
                this.entityRenderer.updateEntitiesClipping(entities);
            }

            _syncGamePosition() {
                this.gameStage.x = -Math.round(this.camera.x * this.escala);
                this.gameStage.y = -Math.round(this.camera.y * this.escala);
            }

            moverPosition(x, y) {
                this.camera.mover(x, y);
                this._syncGamePosition();
            }

            resetPos(gridX, gridY, entities) {
                this.drawMapaIni(gridX, gridY, entities);
            }

            removeLluvia() {
                this.climaRenderer.removeLluvia();
            }

            createLluvia() {
                this.climaRenderer.createLluvia();
            }

            renderFrame() {
                this.pixiRenderer.render(this.stage);
                /*
                 let testPosEnteras = (c) => {
                 if ( (Math.round(c.x) !== c.x) || (Math.round(c.y) !== c.y) ){
                 log.error(c._grh);
                 throw new Error("ERROR!!!!!!!!!!!: X:" + c.x+ " Y:" + c.y);
                 }
                 c.children.forEach(testPosEnteras);
                 };
                 testPosEnteras(this.stage);
                 */
            }


        }
        return Renderer;
    });
