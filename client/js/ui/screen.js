/**
 * Created by horacio on 1/26/16.
 */

define(['jquery'],
    function ($) {

        var Lista = Class.extend({

            init: function (multiple,x, y, w, h) {

                this.multiple = multiple;

                var pX = x * __ESCALA__ + 'px';
                var pY = y * __ESCALA__ + 'px';
                var pW = w * __ESCALA__ + 'px';
                var pH = h * __ESCALA__ + 'px';
                this.id = _.uniqueId('lista_');

                if (this.multiple)
                    this.sel = $('<select id=' + this.id + ' multiple="yes">');
                else
                    this.sel = $('<select id=' + this.id + '>');

                $(this.sel).css({
                    position: "absolute",
                    left: pX,
                    top: pY,
                    background: "black",
                    color: 'white', /*border:'none',"border-style":'none',*/
                    outline: 'none'
                });
                if (h)
                    $(this.sel).css({height: pH, width: pW});
                $(this.sel).appendTo('#container');
            },

            getSelectedSlot: function () {
                res = $('#' + this.id).val();
                if (res) {
                    if (this.multiple)
                        return res[0];
                    return res;
                }
                else
                    return 0;
            },

            getSelectedText: function(){
                if (this.multiple)
                    log.error("TODO");
                else
                    return $('#' + this.id + ' option:selected').text();
            },

            modificarSlot: function (slot, texto) {
                var elemento = $('#' + this.id + ' option[value=' + slot + ']');
                if (!elemento.length) { // nuevo elemento
                    this.sel.append($("<option>").attr('value', slot).text(texto));
                }
                else {
                    $(elemento).text(texto);
                }
            },

            remove: function () {
                this.sel.remove();
            },

            hide: function () {
                this.sel.hide();
            },

            show: function () {
                this.sel.show();
            }
        });

        var ItemGrid = Class.extend({
            /* TODO: usar grids de html*/

            init: function (boxX, boxY, filas, columnas, seleccionar_callback, agregarBotonInvisibleCallback) {
                this.seleccionar_callback = seleccionar_callback;
                this.items = [];
                this.slotActivo = 0;
                var tamSlot = 32;
                var self = this;
                for (var c = 0; c < columnas; c++) {
                    for (var f = 0; f < filas; f++) {
                        var x = boxX + f * tamSlot;
                        var y = boxY + c * tamSlot;
                        var index = (f + 1) + c * filas;

                        this.items[index] = agregarBotonInvisibleCallback(x, y, tamSlot, tamSlot, this.crearSlotFunc(index));
                    }
                }

            },

            crearSlotFunc: function (slot) {
                var self = this;
                return function () {
                    if (self.slotActivo === slot)
                        return;
                    $(self.items[self.slotActivo]).css({'border-style': "none"});
                    $(self.items[slot]).css({'border-style': "dashed"});
                    self.slotActivo = slot;
                };
            },

            hide: function () {
                for (var i = 1; i < this.items.length; i++)
                    $(this.items[i]).hide();
            },

            show: function () {
                for (var i = 1; i < this.items.length; i++)
                    $(this.items[i]).show();
            },

            remove: function () {
                for (var i = 1; i < this.items.length; i++)
                    $(this.items[i]).remove();
            }

        });

        var Screen = Class.extend({

            init: function () {
                this.elementos = [];
            },

            agregarBoton: function (nombre, x, y, click_callback) {
                var url = 'graficos/ui/' + nombre + '.jpg';
                var clickedUrl = 'graficos/ui/' + nombre + 'Click.jpg';
                var rolloverUrl = 'graficos/ui/' + nombre + 'Rollover.jpg';
                var pX = x * __ESCALA__ + 'px';
                var pY = y * __ESCALA__ + 'px';
                var boton = $('<input/>').attr({type: "image", src: url});
                $(boton).css({position: "absolute", left: pX, top: pY});
                $(boton).appendTo('#container');
                //$(botonLogin).width($(botonLogin).width()*2); // HACER DESPUES DEL APPEND O DEVUELVE 0 de width !!!!

                $(boton).click(function () {
                    click_callback();
                });

                $(boton).mousedown(function () {
                    $(boton).attr({src: clickedUrl});
                });

                $(boton).mouseup(function () {
                    $(boton).attr({src: rolloverUrl});
                });

                $(boton).mouseover(function () {
                    $(boton).attr({src: rolloverUrl});
                });

                $(boton).mouseout(function () {
                    $(boton).attr({src: url});
                });

                $(boton).load(function () {
                    if (!this.OnLoaded)
                        $(boton).width($(boton).width() * __ESCALA__);
                    this.OnLoaded = true;
                });

                this.elementos.push(boton);
                return boton;
            },

            agregarItemGrid: function (x, y, filas, columnas, seleccionar_callback) {

                var itemgrid = new ItemGrid(x, y, filas, columnas, seleccionar_callback, this.agregarBotonInivisible);
                return itemgrid;
            },

            agregarBotonInivisible: function (x, y, w, h, click_callback) {
                var pX = x * __ESCALA__ + 'px';
                var pY = y * __ESCALA__ + 'px';
                var pW = w * __ESCALA__ + 'px';
                var pH = h * __ESCALA__ + 'px';
                var boton = $('<button/>');
                $(boton).css({
                    position: "absolute",
                    'border-style': "none",
                    'border-color': "limegreen",
                    'background-color': 'rgba(0,0,0,0)',
                    left: pX,
                    top: pY,
                    width: pW,
                    height: pH
                });
                $(boton).click(function () {
                    click_callback();
                });
                $(boton).appendTo('#container');
                return boton;
            },

            agregarInput: function (x, y, w, h, maxLargo, placeHolder, esPassword) {
                var pX = x * __ESCALA__ + 'px';
                var pY = y * __ESCALA__ + 'px';
                var pW = w * __ESCALA__ + 'px';
                var pH = h * __ESCALA__ + 'px';

                if (!placeHolder)
                    placeHolder = "";
                if (esPassword)
                    var input = $('<input/>').attr({
                        type: "password",
                        placeholder: placeHolder,
                        maxlength: maxLargo,
                        pattern: '[a-zA-Z]*'
                    }); // no funciona pattern
                else
                    var input = $('<input/>').attr({
                        type: "text",
                        placeholder: placeHolder,
                        maxlength: maxLargo,
                        pattern: '[a-zA-Z]*'
                    }); // no funciona pattern
                $(input).css({
                    "background-color": "black",
                    "border-width": "1px",
                    "border-color": "rgb(190,190,190)",
                    "color": "white",
                    position: "absolute",
                    left: pX,
                    top: pY,
                    width: pW,
                    height: pH,
                    "font-size": pH
                });
                $(input).appendTo('#container');

                this.elementos.push(input);
                return input;
            },

            agregarLista: function (multiple,x, y, w, h) {
                var lista = new Lista(multiple,x, y, w, h);
                this.elementos.push(lista);
                return lista;
            },

            delete: function () {
                for (var i = 0; i < this.elementos.length; i++) {
                    $(this.elementos[i]).remove();
                    this.elementos[i] = null;
                }
            },

        });
        return Screen;
    });