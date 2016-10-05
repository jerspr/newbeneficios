var elements = [];
var subDominio;
var empresas_e = [];

$(document).ready(function () {
    obj.validateEmailCupon();
    validarPreguntas.validateRespuesta();
    validarEnvio.validateEmailCuponPuntos();

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
        var check = $('#activeChek');
        if (!check.is(':checked')) {
            check.trigger('click');
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
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: "/home/envioCupon",
                async: false,
                data: {
                    email: email.val(),
                    idOferta: ofertaID.val(),
                    idEmpresa: empresaID.val(),
                    idCliente: clienteID.val(),
                    slug_cat: slugcat.val()
                },
                success: function (data) {
                    if (data.session) {
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
                                    case "textnumb":
                                        contenedor.html($('<input type="text" name="respuesta" id="respuesta" class="form-control" ' +
                                            'placeholder="Ingrese aquí su respuesta" autocomplete="off"><div class="error-check"></div>'));
                                        $("#respuesta").rules('remove');
                                        $("#respuesta").rules("add", {
                                            required: true,
                                            number: true,
                                            maxlength: 9,
                                            minlength: 9,
                                            messages: {
                                                required: "El campo no puede quedar vacío",
                                                number: "Debe ingresar solo numeros",
                                                maxlength: "El número debe de tener 9 dígitos",
                                                minlength: "El número debe de tener 9 dígitos"
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
                    } else {
                        window.location.href = "/login";
                    }
                },
                error: function () {
                    window.location.href = "/login";
                }
            });

        } else {
            $('#send_coupon').removeAttr('disabled');
        }
    });

    $("#emailCuponPuntos").submit(function (e) {
        e.preventDefault();
        var send_coupon = $('#send_coupon');
        send_coupon.attr('disabled', 'disabled');

        var email = $('#email');
        var ofertaID = $('#idOferta');
        var empresaID = $('#idEmpresa');
        var clienteID = $('#idCliente');
        var slugcat = $('#slug_cat');
        var puntos = $('#puntos');
        var atributo = $('#atributo');
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

        if ($(this).valid() && valid) {
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: "/puntos/envioCupon",
                async: false,
                data: {
                    email: email.val(),
                    idOferta: ofertaID.val(),
                    idEmpresa: empresaID.val(),
                    idCliente: clienteID.val(),
                    slug_cat: slugcat.val(),
                    puntos: puntos.val(),
                    atributo: atributo.val()
                },
                success: function (data) {
                    if (data.session) {
                        if (data.response) {
                            $("#enviarPuntos").modal('hide');
                            send_coupon.removeAttr('disabled');

                            var saldo = $('#puntos-final');
                            var precioBeneficio = $('#precio-beneficio');
                            saldo.data("value", data.disponibles);
                            precioBeneficio.html(data.disponibles);
                            $('#cant-puntos').text(data.puntos + ' puntos');

                            var campoPuntos = $("#puntos");
                            campoPuntos.rules('remove');
                            campoPuntos.rules("add", {
                                required: true,
                                min: 1,
                                max: function () {
                                    var precio = parseInt($('#precio-final').data("value"));
                                    var puntos = parseInt($('#puntos-final').data("value"));

                                    if (precio < puntos) {
                                        return precio;
                                    } else if (precio > puntos) {
                                        return puntos;
                                    } else {
                                        return precio;
                                    }
                                },
                                messages: {
                                    required: "Debe ingresar una cantidad de puntos para usar",
                                    min: "Debe ingresar una cantidad válidad",
                                    max: "Debe ingresar una cantidad menor o igual a sus puntos disponibles o al precio del cupón"
                                }
                            });

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

                            $('#modalFelicitacionesPuntos').modal('show');
                            setTimeout(function () {
                                $("body").addClass("modal-open");
                            }, 1000);
                        } else {
                            if (data.status == 404) {
                                $(location).attr("href", 404);
                            } else {
                                $("#enviarPuntos").modal('hide');
                                $('#modalErrorPuntos').modal('show');
                                send_coupon.removeAttr('disabled');
                                setTimeout(function () {
                                    $("body").addClass("modal-open");
                                }, 1000);
                            }
                        }
                    } else {
                        window.location.href = "/login";
                    }
                },
                error: function () {
                    window.location.href = "/login";
                }
            });
        } else {
            send_coupon.removeAttr('disabled');
        }
    });

    $('#puntos').keyup(function (e) {
        var campoPrecio = $('#precio-final');
        var campoPuntos = $('#puntos-final');

        var puntosUsados = parseInt($(this).val());
        var precio = parseInt(campoPrecio.data("value"));
        var puntos = parseInt(campoPuntos.data("value"));

        if (precio - puntosUsados < 0 || puntos - puntosUsados < 0 || isNaN(precio) || isNaN(puntosUsados)) {
            e.preventDefault();
        } else {
            var resultado = "S/ " + (precio - puntosUsados);
            campoPrecio.html(resultado);

            var resultado2 = (puntos - puntosUsados);
            campoPuntos.html(resultado2);
        }
    });

    $('a.enviarPuntos').click(function (e) {
        var value = $(this).data("value");
        var precio = $(this).find('#precioAtributo').val();
        var nombre = $(this).find('#nombreAtributo').val();

        var campoPrecio = $("#precio-final");
        campoPrecio.data("value", precio);
        campoPrecio.html("S/ " + precio);

        var precioVenta = $("#precio-venta");
        precioVenta.html("S/ " + precio);

        var tituloCupon = $("#tituloCupon");
        tituloCupon.html(nombre);

        $("#atributo").val(value);

        var campoPuntos = $("#puntos");
        campoPuntos.rules('remove');
        campoPuntos.rules("add", {
            required: true,
            min: 1,
            max: function () {
                var precio = parseInt($('#precio-final').data("value"));
                var puntos = parseInt($('#puntos-final').data("value"));

                if (precio < puntos) {
                    return precio;
                } else if (precio > puntos) {
                    return puntos;
                } else {
                    return precio;
                }
            },
            messages: {
                required: "Debe ingresar una cantidad de puntos para usar",
                min: "Debe ingresar una cantidad válidad",
                max: "Debe ingresar una cantidad menor o igual a sus puntos disponibles o al precio del cupón"
            }
        });
    });
});

var validarPreguntas = {
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
                        $('#listU').text(data.NomSession);
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

var validarEnvio = {
    validateEmailCuponPuntos: function () {
        $("#emailCuponPuntos").validate({
            rules: {
                email: {
                    required: true
                },
                terminos: {
                    required: true
                },
                puntos: {
                    required: true,
                    min: 1,
                    max: function () {
                        var precio = parseInt($('#precio-final').data("value"));
                        var puntos = parseInt($('#puntos-final').data("value"));

                        if (precio < puntos) {
                            return precio;
                        } else if (precio > puntos) {
                            return puntos;
                        } else {
                            return precio;
                        }
                    }
                }
            },

            // Specify the validation error messages
            messages: {
                email: {
                    required: "Debe ingresar un email",
                    email: "Ingrese un correo válido"
                },
                terminos: {
                    required: "Debe aceptar las condiciones, términos y políticas de uso"
                },
                puntos: {
                    required: "Debe ingresar una cantidad de puntos para usar",
                    min: "Debe ingresar una cantidad válida",
                    max: "Debe ingresar una cantidad menor o igual a sus puntos disponibles o al precio del cupón"
                }
            },
            errorPlacement: function (error, element) {
                error.insertAfter($(element).parents('.cnt-form-error').find('.error-check').html(error));
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