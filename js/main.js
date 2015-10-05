var obj = {
	loginCnt: function(){
		$('.login-beneficios').css({
	        'position' : 'absolute',
	        'left' : '50%',
	        'top' : '50%',
	        'margin-left' : -$('.login-beneficios').outerWidth()/2,
	        'margin-top' : -$('.login-beneficios').outerHeight()/2
	    });
	},
	slideMarcas: function(){
		$('.marcas-s').slick({
		  	slidesToShow: 6,
		  	slidesToScroll: 1,
		  	autoplay: true,
		  	autoplaySpeed: 2000,
		  	arrows:false
		});
	},
	slidePromocion: function(){
		$('.slider-promocion').slick({
		  	slidesToShow: 1,
		  	slidesToScroll: 1,
		  	autoplay: true,
		  	autoplaySpeed: 2000
		});
	},
	validateLogin: function(){
		console.log('Est oes una prueba');
		$("#loginForm").validate({
        // Specify the validation rules
        rules: {
          dni: {
            required: true
          },
          empresa:{
          	required: true
          }
        },
        
        // Specify the validation error messages
        messages: {
          dni: {
            required: "Lo sentimos pero este DNI no está registrado"
          },
          empresa:{
          	required: "Debe seleccionar una empresa afiliada"
          }
        },
        //errorPlacement: function(error, element) {
          //error.insertAfter($(element).parents('.form-group').find('.cnt-error').html(error));
        //},
        submitHandler: function(form) {
            form.submit();
        }
      });
	}
}