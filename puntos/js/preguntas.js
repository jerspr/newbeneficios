var elements = [];
var subDominio;
var empresas_e = [];
$(function () {
    objp.validateRespuesta();
    obj.validateEmailCupon();

    $.validator.addMethod(
        "weekText",
        function (val) {
            var strings = elements;
            var flag = false;
            for (var i = 0; i < strings.length; i++) {
                if (val.toLowerCase() == strings[i].toLowerCase()) {
                    flag = true;
                }
            }
            return !!flag;
        }, "Por favor, seleccione una opción válida");

    $.validator.addMethod(
        "regex",
        function (value, element, regexp) {
            var re = new RegExp(regexp);
            return this.optional(element) || re.test(value);
        },
        "Please check your input."
    );

    $('#enviarMail').on('show.bs.modal', function (e) {
        if (!$('#activeChek').is(':checked')) {
            $('#activeChek').trigger('click');
        }
    });

    $("#emailCupon").submit(function (e) {
        e.preventDefault();
        $('#send_coupon').attr('disabled', 'disabled');

        var email = $('#email');
        var ofertaID = $('#idOferta');
        var empresaID = $('#idEmpresa');
        var clienteID = $('#idCliente');
        var slugcat = $('#slug_cat');
        var valid = false;

        var emailExpre = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        var slugExpre = /^[a-z\-]+$/;
        var degit = /^\d+$/;

        if (emailExpre.test(email.val()) && slugExpre.test(slugcat.val()) && degit.test(ofertaID.val()) &&
            degit.test(empresaID.val())) {
            if ($.inArray(subDominio, empresas_e) > -1) {
                valid = true;
            } else if (degit.test(clienteID.val())) {
                valid = true;
            }
        }

        if (valid) {
            $.post("/home/envioCupon", {
                email: email.val(),
                idOferta: ofertaID.val(),
                idEmpresa: empresaID.val(),
                idCliente: clienteID.val(),
                slug_cat: slugcat.val()
            }, function (data) {
                console.log(data.response);
                if (data.response) {
                    $('#enviarMail').modal('toggle');
                    $('#send_coupon').removeAttr('disabled');
                    if ($.inArray(subDominio, empresas_e) > -1) {
                        email.val('');
                    }
                    if (data.question == '') {
                        $('.questions').css('display', 'none');
                    } else {
                        $('.questions').css('display', '')
                            .find('h5')
                            .empty()
                            .append(data.question["titulo"]);
                        $('#question_number').val(data.number);

                        var input = "";
                        var contenedor = $('div.preguntas');

                        switch (data.question["tipo_campo"]) {
                            case "date":
                                input = $('<select name="respuesta" id="respuesta" class="form-control"></select>');
                                input.append($("<option>").attr('value', '').text("Seleccione..."));
                                for (var i = 0; i < 90; i++) {
                                    input.append($("<option>")
                                        .attr('value', (new Date).getFullYear() - i)
                                        .text((new Date).getFullYear() - i));
                                }
                                var numero = (new Date).getFullYear() - 90;
                                contenedor.html(input);
                                contenedor.append('<div class="error-check"></div>');
                                $("#respuesta").rules('remove');
                                $("#respuesta").rules("add", {
                                    required: true,
                                    number: true,
                                    min: numero,
                                    messages: {
                                        required: "El campo no puede quedar vacío",
                                        number: "Debe seleccionar un año válido",
                                        min: "El año seleccionado debe ser mayor a {0}"
                                    }
                                });
                                break;
                            case "combo":
                                input = $('<select name="respuesta" id="respuesta" class="form-control"></select>');
                                input.append($("<option>").attr('value', '').text("Seleccione..."));

                                $.each(data.question["value_combo"], function (index, value) {
                                    input.append($("<option>").attr('value', value).text(value));
                                    elements.push(value);
                                });

                                contenedor.html(input);
                                contenedor.append('<div class="error-check"></div>');
                                $("#respuesta").rules('remove');
                                $("#respuesta").rules("add", {
                                    required: true,
                                    weekText: true,
                                    messages: {
                                        required: "El campo no puede quedar vacío",
                                        weekText: "Por favor, seleccione una opción válida"
                                    }
                                });
                                break;
                            case "numb":
                                contenedor.html($('<input type="number" min="0" name="respuesta" id="respuesta" class="form-control" ' +
                                    'placeholder="Ingrese aquí su respuesta" autocomplete="off"><div class="error-check"></div>'));
                                $("#respuesta").rules('remove');
                                $("#respuesta").rules("add", {
                                    required: true,
                                    number: true,
                                    messages: {
                                        required: "El campo no puede quedar vacío",
                                        number: "Debe ingresar una cantidad válida"
                                    }
                                });
                                break;
                            case "text":
                            default:
                                contenedor.html($('<input type="text" name="respuesta" id="respuesta" class="form-control" ' +
                                    'placeholder="Ingrese aquí su respuesta" autocomplete="off"><div class="error-check"></div>'));
                                $("#respuesta").rules('remove');
                                $("#respuesta").rules("add", {
                                    required: true,
                                    regex: "^[a-zA-ZñÑ\\s]+$",
                                    messages: {
                                        required: "El campo no puede quedar vacío",
                                        regex: "El campo solo acepta letras"
                                    }
                                });
                                break;
                        }
                    }
                    $('.modal-felicitaciones').modal('show');
                    setTimeout(function () {
                        $("body").addClass("modal-open");
                    }, 1000);
                } else {
                    if (data.status == 404) {
                        $(location).attr("href", 404);
                    } else {
                        $('#enviarMail').modal('toggle');
                        $('.modal-error').modal('show');
                        $('#send_coupon').removeAttr('disabled');
                        setTimeout(function () {
                            $("body").addClass("modal-open");
                        }, 1000);
                    }
                }
            }, 'json');
        } else {
            $('#send_coupon').removeAttr('disabled');
        }
    });
});

var objp = {
    validateRespuesta: function () {
        $("#formRespuesta").validate({
            errorPlacement: function (error, element) {
                error.insertAfter($(element).parents('.cnt-form-error').find('.error-check').html(error));
            },
            submitHandler: function (form) {
                var respuesta = $('#respuesta');
                var clienteID = $('#idCliente');
                var question = $('#question_number');
                $.post("/home/registrarRespuesta", {
                    answer: respuesta.val(),
                    client: clienteID.val(),
                    question: question.val()
                }, function (data) {
                    if (data.response) {
                        $('.modal-felicitaciones').modal('hide');
                        $('.modal-gracias').modal('show');
                        setTimeout(function () {
                            $("body").addClass("modal-open");
                        }, 1000);
                    }
                }, 'json');
            }
        });
    }
};

function getSubDominio(dominio) {
    var URLactual = window.location.hostname;
    subDominio = URLactual.split(dominio)[0];
    subDominio = subDominio.replace("www.", "");
    subDominio = subDominio.substring(0, subDominio.length - 1);
}