var obj = {
	slideMarcas: function(){
		$('.marcas-s').slick({
		  	slidesToShow: 6,
		  	slidesToScroll: 1,
		  	autoplay: true,
		  	autoplaySpeed: 2000,
		  	arrows:false,
		  	responsive: [
		  		{
			      breakpoint: 1199,
			      settings:{
			        slidesToShow: 5
			      }
			    },
		  		{
			      breakpoint: 991,
			      settings:{
			        slidesToShow: 4
			      }
			    },
			    {
			      breakpoint: 600,
			      settings:{
			        slidesToShow: 3
			      }
			    },
			    {
			      breakpoint: 480,
			      settings:{
			        slidesToShow: 2
			      }
			    }
		    ]
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
	},
	menu_fixed: function(){
		var nav = $('header');
		var pos = nav.offset().top;				
		
		$(window).scroll(function () {
			var fix = '';
			if($(this).scrollTop() > pos){
				fix = true;
			}else{
				fix = false;
				$(".search").removeClass("hide-s");
			}
			nav.toggleClass("fix-nav", fix);
			$('body').toggleClass("fix-body", fix);	
		});
	},
	menu_lateral: function(){
		var startX, curX, startY, curY; // Variables
		var newXScroll, newYScroll, genXScroll; // More Variables!
		// Change the height of the sidebar, as well as a few things to do with the main content area, so the user
		// can actually scroll in the content area.
		function sideBarHeight() { 
			var docHeight = $(document).height();
			var winHeight = $(window).height();
			$('.slide-in').height(winHeight);
			$('#main-container').height(winHeight);
			$('#sub-container').height($('#sub-container').height());
		}
		sideBarHeight();
		var outIn = 'in';
		Hammer(document.getElementById('main-container')).on('swiperight', function(e) {
			$('.slide-in').toggleClass('on');		
			$('#main-container').toggleClass('on');
			outIn = 'out';
		});
		Hammer(document.getElementById('main-container')).on('swipeleft', function(e) {
			$('.slide-in').toggleClass('on');	
			$('#main-container').toggleClass('on');
			outIn = 'in';
		});
		function runAnimation() {
			if(outIn == 'out') {
				$('.slide-in').toggleClass('on');
				$('#main-container').toggleClass('on');	
				outIn = 'in';
			} else if(outIn == 'in') {
				$('.slide-in').toggleClass('on');	
				$('#main-container').toggleClass('on');	
				outIn = 'out';
			}
		}
		$('.menu-icon')[0].addEventListener('touchend', function(e) {
			$('.slide-in').toggleClass('on');		
			$('#main-container').toggleClass('on');
		});
		$('.menu-icon').click(function() {
			$('.slide-in').toggleClass('on');		
			$('#main-container').toggleClass('on');
		});
	},
	search_show:function(){
		$(".search-lupa").click(function(e){
			e.preventDefault();
			$(".search-movil").show();
        });
        $(".back-search").click(function(e){
			e.preventDefault();
			$(".search-movil").hide();
        });
	}
}