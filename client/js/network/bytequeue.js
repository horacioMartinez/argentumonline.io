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