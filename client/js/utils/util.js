define(function () {
    return {
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
});
/*
 // busqueda binaria que devuelve {found,index} donde index es el index donde esta o si no lo encontro donde estaria
 // despues se lo puede insertar con list.splice(resultadoBusqueda.index, 0, item);
 var binaryPosSearch = function (list, item, cmp_func) {
 var lo = 0;
 var hi = list.length;
 while (lo < hi) {
 var mid = ((lo + hi) / 2) | 0;
 var cmp_res = cmp_func(item, list[mid]);
 if (cmp_res == 0) {
 return {
 found: true,
 index: mid
 };
 } else if (cmp_res < 0) {
 hi = mid;
 } else {
 lo = mid + 1;
 }
 }

 return {
 found: false,
 index: hi
 };
 };

 function binarySearch(ar, el, compare_fn) {
 var m = 0;
 var n = ar.length - 1;
 while (m <= n) {
 var k = (n + m) >> 1;
 var cmp = compare_fn(el, ar[k]);
 if (cmp > 0) {
 m = k + 1;
 } else if(cmp < 0) {
 n = k - 1;
 } else {
 return k;
 }
 }
 return m;
 return -m - 1;
 }*/
