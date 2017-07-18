	var checkInput = (function(id, ajax){
	//регулярные выражения для проверки валидации данных	
	var reqexpArr = {
	"firstname": /^[a-zA-Zа-яА-Я-]{3,}$/,
	"phone": /^\+\d{1}\s\d\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/
}

	
	return {
		//метод инициализации объекта
		init: function(id){
			var
				_this = this,
				selector = $('#'+id),
				inputs = selector.find("input[name='firstname'], input[name='phone'], input[name='delivery']"),
				keyup = "keyup",
				change = "change";
				if(selector.find("input[name='phone']").length != 0){
					selector.find("input[name='phone']").mask('+3 8(099) 999-99-99');
				}
			//валидация данных при нажатии клавиши в поле формы
			inputs.on("keyup", function(){
				var $this = $(this);
				_this.checkInput($this);
				_this.check(selector);
			});	
			//валидация данных при нажатии измении данных поля
			inputs.on("change", function(){
				var $this = $(this);
				_this.checkInput($this);
				_this.checkRadio(selector);
				_this.check(selector);
			});
			//метод отправки данных формы и переход ко второму шагу
			_this.send(selector, id);
		},

		//метод проверки валидации данных
		checkInput: function($this){

				var $this = $($this);
					checkValue = $this.val(),
					checkData = $this.data("check");

				if(checkValue.match(reqexpArr[checkData])){

					if($this.hasClass('error')){
						$this.removeClass('error');
					}
					$this.addClass("valid");

				} else{

					if($this.hasClass('valid')){
						$this.removeClass('valid');
					}
					$this.addClass("error");
				}
			
		},
		//метод проверяет активирована ли радиокнопка
		checkRadio: function(selector){

			var radio = selector.find('input[name="delivery"]');
			radio.on('change', function(){
				if($(this)[0].type == 'radio'){
					if($(this)[0].checked){
						$($(this)[0]).addClass('valid')
					}else{
						$($(this)[0]).removeClass('valid')
					}

				}
				
			})

		},

		//проверка обязательный полей, если все поля валидные активируется кнопка
		check: function(selector){

			var inputs = selector.find("input[name='firstname'], input[name='phone']"),
					button = selector.find('button[type="submit"]'),
					radio = selector.find("input[name='delivery']");

					flagValue = true;
			//проверка полей		
			inputs.each(function(){

				if(!$(this).hasClass('valid')){

					flagValue = false;
				}

			});
			//проверка радиокнопки
			if(radio.length != 0){
				var radioValid = radio.filter('.valid');
				if(radioValid.length == 0 || !flagValue){
					flagValue = false;
				}

			}

			if(flagValue){
				button.removeAttr('disabled');
			}
			else{
				button.attr('disabled', 'disabled');
			}

		},

		//метод отправки данных формы и переход ко второму шагу
		send: function(selector, id){

			var _this = this,
				button = selector.find('button[type="submit"]');

					button.on('click', function(e){

						e.preventDefault();
						_this.ajaxSend(id);

					});

		},

		//метод отправки данных формы и переход ко второму шагу
		ajaxSend: function(id){

			var _this = this,
				data = new FormData(document.getElementById(id));

				$.ajax({
					url: 'index.php',
					type: 'POST',
					data: data,
					processData: false,
					contentType: false
				}).done(_this.nextStep(id));

		},
		
		//метод переход ко второму шагу
		nextStep: function(id){
			
			if(id == 'step-1'){
				location.href = "step2.html"
			}
			
		}

	}

}());

//объект переключение табов
var swichStep = (function(){

	return {

		init: function(){
			var tabs = $(".tabs__item"),
			orderPage = $(".order").data('page');
			activeTab = tabs.filter('.page-'+orderPage);
			activeTab.addClass('active');
		}

	}

}());	

//метод назначает одинаковую высоту указанным селекторам
	$.fn.sameHeight = function(){
		var icount = 1;
		this.each(function(){
			if(icount < $(this).height())
				icount = $(this).height();
			else
				icount = icount;
		})
		return this.height(icount);
	}	

$(document).ready(function(){

	swichStep.init();
	checkInput.init('step-1');
	checkInput.init('step-2');
	$('.order-step__method-inner').sameHeight();
	
});

$(window).resize(function(){

	var methodInner = $('.order-step__method-inner');
		if($(window).width() > 1248){
		methodInner.sameHeight();
	}
	else{
		if(methodInner.attr('style') !== undefined){
			methodInner.removeAttr('style');
		}
	}
	
});
