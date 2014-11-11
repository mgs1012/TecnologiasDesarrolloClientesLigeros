/**
 * 
 */
var dniValido = false;
var emailValido = false;

$(document).ready(function (){
	$("#fecha").datepicker();
	$("#radio").buttonset();
	$("#sortable").sortable();
	$("#sortable").disableSelection();
	$("#enviar").button().click(function( event ) {	
		if(dniValido && emailValido){
			$("#miform").submit();
		}else{
			$("#miform").preventDefault();
		}
	
	});
	$("input[name=medio]:radio").change(function () {
		if(this.value=='ordinario'){
			mostrarCorreo();
		}else{
			 mostrarCorreoElectronico();
		}
	});
	$("#slider-vertical").slider({
	      orientation: "vertical",
	      range: "min",
	      min: 12,
	      max: 20,
	      value: 16,
	      slide: function(event, ui) {
	        $("#amount").val(ui.value);
	        $('body').css({'font-size': ui.value});
	      }
	    });
	$( "#amount" ).val( $( "#slider-vertical" ).slider( "value" ) );	 
	$("button").addClass("hereda");
	$("label").addClass("hereda");
	$("#cp").blur(function(){
	      var valor = $("#cp").val();
	      $.ajax({
	        type:"GET",
	        url: "http://www.eui.upm.es/~salonso/master/provincia.php",
	        crossDomain: true,
	        data:"CP="+valor,
	        dataType: 'jsonp',  
	        success: function(data)
	        {
	          $("#provincia").val(data);
	        }
	      });
	});
	$("#dni").blur(function(){
		 var Letras = new Array('T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B', 'N',
		          'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E', 'T');
		if(Letras[this.value.slice(0, this.value.length - 1)%23] != this.value.slice(this.value.length - 1, this.value.length)){
			$("#dni").css('border-color','#ff0000');
			dniValido = false;
		}else{
			dniValido = true;
			$("#dni").css('border-color','#24ed09');
		}
	});
	$("#email").blur(function(){
		var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
		if(!this.value.match(pattern)){
			$("#email").css('border-color','#ff0000');
			emailValido = false;
		}else{
			emailValido = true;
			$("#email").css('border-color','#24ed09');
		}
	});
});


function mostrarCorreo() {
		$('#correoContainer').removeClass("no-display");
		$('#email').val("");
		$('#correoElectronicoContainer').addClass("no-display");
}

function mostrarCorreoElectronico() {
		$('#correoElectronicoContainer').removeClass("no-display");
		$('#localidad').val("");
		$('#correo').val("");
		$('#correoContainer').addClass("no-display");	
}