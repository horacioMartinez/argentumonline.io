export default {
    isInt: function (n) {
        return (n % 1) === 0;
    },

    // modulo que funciona tambien para los numeros negativos
    modulo: function (num, max) {
        return ((num % max) + max) % max;
    },

    splitNullArray: function (string) {
        return string.split("\u0000");
    },

    joinNullArray: function (array) {
        return array.join("\u0000");
    },
};
