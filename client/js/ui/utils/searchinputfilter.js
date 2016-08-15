/**
 * Created by horacio on 30/07/2016.
 */

define(function () {
    return {
        /* elementChildName: ( 'option', 'tr', etc ) */
        makeInputFilterElement: function ($input, $filteredElement, elementChildName) {
            $input.keyup(function () {
                var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();

                $filteredElement.find(elementChildName).show().filter(function () {
                    var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
                    return !~text.indexOf(val);
                }).hide();
            });
        }
    };
});
