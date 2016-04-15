define(function () {
    var ByteQueue = Class.extend({
        init: function (ws) {
            this.ws = ws;
            this.data = [];
        },

        WriteByte: function (value) {
            this.data.push(value);
        },

        // todos little endian:
        WriteInteger: function (value) { // 2B

            this.data.push(value & 0xff);
            this.data.push((value >> 8) & 0xff);
        },

        WriteLong: function (value) { // 4B
            this.data.push(value & 0xff);
            this.data.push((value >> 8) & 0xff);
            this.data.push((value >> 16) & 0xff);
            this.data.push((value >> 24) & 0xff);
        },

        WriteSingle: function (value) { // 4B

            var buffer = new ArrayBuffer(4);
            var floatArray = new Float32Array(buffer);
            floatArray[0] = value;
            var byteArray = new Uint8Array(buffer);
            for (var i = 0; i < byteArray.length; i++)
                this.data.push(byteArray[i]);
        },

        WriteDouble: function (value) { //8B

            var buffer = new ArrayBuffer(8);
            var floatArray = new Float64Array(buffer);
            floatArray[0] = value;
            var byteArray = new Uint8Array(buffer);
            for (var i = 0; i < byteArray.length; i++)
                this.data.push(byteArray[i]);
        },

        WriteBoolean: function (value) {
            if (value)
                this.data.push(1);
            else
                this.data.push(0);
        },

        WriteUnicodeStringFixed: function (string) {
            this.data = this.data.concat(
                string.split('').map(
                    function (chr) {
                        return chr.charCodeAt(0);
                    }));
        },

        WriteUnicodeString: function (string) {
            this.WriteInteger(string.length);
            this.WriteUnicodeStringFixed(string);
        },

        PeekByte: function () {
            return this.ws.rQpeek8();
        },

        ReadByte: function () {
            return this.ws.rQshift8();
        },

        ReadInteger: function () {

            var int = this.ws.rQshift16();
            if (int & 0x8000) // ultimo bit de los 16 es 1 -> numero negativo, extiendo los demas bits
                int = int | 0xFFFF0000;
            return int;
        },

        ReadLong: function () {
            return this.ws.rQshift32();
        },

        ReadSingle: function () {
            var buffer = new ArrayBuffer(4);
            var byteView = new Uint8Array(buffer);
            var floatView = new Float32Array(buffer);
            byteView[0] = this.ws.rQshift8();
            byteView[1] = this.ws.rQshift8();
            byteView[2] = this.ws.rQshift8();
            byteView[3] = this.ws.rQshift8();
            return floatView[0];
        },

        ReadDouble: function () {
            var buffer = new ArrayBuffer(8);
            var byteView = new Uint8Array(buffer);
            var floatView = new Float64Array(buffer);
            for (var i = 0; i < 8; i++)
                byteView[i] = this.ws.rQshift8();
            return floatView[0];
        },

        ReadBoolean: function () {
            var value = this.ReadByte();
            if (value)
                return true;
            else
                return false;
        },

        ReadUnicodeString: function () {
            var isoArray = this.ws.rQshiftBytes(this.ws.rQshift16());
            return String.fromCharCode.apply(null, isoArray);
        },

        length: function () {
            return this.ws.rQlen();
        },

        flush: function () {
            this.ws.send(this.data);
            this.data = [];
        }
    });

    return ByteQueue;
});


/*COMENTADOS porque no se usa utf8, lo dejo por las dudas que se use en el futuro, acordarse de cambair el charset en el index.html tambien!

 function stringToUTF8Array(str) { // string a array convertido en utf-8
 var utf8 = [];
 for (var i = 0; i < str.length; i++) {
 var charcode = str.charCodeAt(i);
 if (charcode < 0x80) utf8.push(charcode);
 else if (charcode < 0x800) {
 utf8.push(0xc0 | (charcode >> 6),
 0x80 | (charcode & 0x3f));
 } else if (charcode < 0xd800 || charcode >= 0xe000) {
 utf8.push(0xe0 | (charcode >> 12),
 0x80 | ((charcode >> 6) & 0x3f),
 0x80 | (charcode & 0x3f));
 }
 // surrogate pair
 else {
 i++;
 // UTF-16 encodes 0x10000-0x10FFFF by
 // subtracting 0x10000 and splitting the
 // 20 bits of 0x0-0xFFFFF into two halves
 charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
 utf8.push(0xf0 | (charcode >> 18),
 0x80 | ((charcode >> 12) & 0x3f),
 0x80 | ((charcode >> 6) & 0x3f),
 0x80 | (charcode & 0x3f));
 }
 }
 return utf8;
 }

 function UTF8arrayToString(array) { // array en utf-8 a string (tambien acepta typed arrays ?)
 var out, i, len, c;
 var char2, char3;

 out = "";
 len = array.length;
 i = 0;
 while(i < len) {
 c = array[i++];
 switch(c >> 4)
 {
 case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
 // 0xxxxxxx
 out += String.fromCharCode(c);
 break;
 case 12: case 13:
 // 110x xxxx   10xx xxxx
 char2 = array[i++];
 out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
 break;
 case 14:
 // 1110 xxxx  10xx xxxx  10xx xxxx
 char2 = array[i++];
 char3 = array[i++];
 out += String.fromCharCode(((c & 0x0F) << 12) |
 ((char2 & 0x3F) << 6) |
 ((char3 & 0x3F) << 0));
 break;
 }
 }

 return out;
 }

 // --- version utf8 --- :
 WriteUnicodeStringFixed: function (string) {
 this.data = this.data.concat(stringToUTF8Array(string));
 },

 WriteUnicodeString: function (string) {
 var utf8array = stringToUTF8Array(string);
 this.WriteInteger(utf8array.length);
 this.data = this.data.concat(utf8array);
 },

 ReadUnicodeString: function () {
 var largo = this.ws.rQshift16();
 var utf8array = this.ws.rQshiftBytes(largo);
 return UTF8arrayToString(utf8array);
 },
 */