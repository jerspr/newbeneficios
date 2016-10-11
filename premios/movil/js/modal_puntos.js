/**
 * Created by marlo on 12/08/16.
 */
$(document).ready(function () {
    $('#flyoutMovil').on('hide.bs.modal', function (e) {
        $.ajax({
            type: "GET",
            url: "/puntos/closeModal",
            success: function (data) {
                console.log('ok!!');
            },
            error: function () {
                console.log('error!!');
            }
        });
    });
});
