/**
 * 
 */
var fechaActual = new Date();
var data = 4;
var lineas = 1;

function onload() {
	document.getElementById("fecha").innerHTML = "Fecha : " + fechaActual.toLocaleDateString();
	document.getElementById('calFechaLim').setAttribute("value", fechaActual.getFullYear() + "-" + ("0" + (fechaActual.getMonth() + 1)).slice(-2) + "-" +  ("0" + fechaActual.getDate()).slice(-2));
}

function fechaAbono() {
	var fecha;		
	var dias = 0;
	var radioButtons = document.getElementsByName('fechaLim');		
	for (var i = 0; i < radioButtons.length-1; i++) {
		if (radioButtons[i].checked) {
			dias = radioButtons[i].value;
		}
	}
	dias = dias*24*60*60*1000;
	fecha  = new Date(fechaActual.getTime() + dias);	
	document.getElementById("fechaAbono").innerHTML = "Días límite para abono: " + fecha.toLocaleDateString();
}

function fechaAbonoDiaConcreto(){
	var ano = document.getElementById('calFechaLim').value.substring(0, 4);
	var mes = document.getElementById('calFechaLim').value.substring(5, 7);
	var dia = document.getElementById('calFechaLim').value.substring(8, 10);
	var fecha = new Date(ano, mes-1, dia,  fechaActual.getHours(), fechaActual.getMinutes(), fechaActual.getSeconds(), fechaActual.getMilliseconds());
	if(fechaActual<=fecha){		
		document.getElementById("fechaAbono").innerHTML = "Fecha límite para abono: " + fecha.toLocaleDateString();
	}else{
		alert("Error! La fecha escogida es anterior a la fecha de hoy.");
	}
}

function mostrarCal() {
	fechaAbonoDiaConcreto();
	if (document.getElementsByName('fechaLim')[document.getElementsByName('fechaLim').length-1].checked && document.getElementById('sinCal')!=null) {
		document.getElementById('sinCal').setAttribute("id","calSi");
	}	
}

function ocultarCalendario() {
	if (!document.getElementsByName('fechaLim')[document.getElementsByName('fechaLim').length-1].checked && document.getElementById('calSi')!=null) {
		document.getElementById('calSi').setAttribute("id","sinCal");
	}
}

function ocultarCalendarioDiaConcreto() {
	if (!document.getElementsByName('fechaLim')[document.getElementsByName('fechaLim').length-1].checked && document.getElementById('calSi')!=null) {
		document.getElementById('calSi').setAttribute("id","sinCal");
	}
}

function insertLinea() {
	var container = document.getElementById('lineas');
	var linea = document.createElement('tr');  
	for (var cont = 0; cont < data; cont++) {
		var insertTD = document.createElement('td');
		var insertIN = document.createElement('input');
		insertIN.type = 'text';
		switch (cont) {
			case 0:
				insertIN.id = 'concepto' + lineas;
				break;
			case 1:
				insertIN.id = 'precio' + lineas;
				break;
			case 2:
				insertIN.id = 'unidades' + lineas;
				break;
			case 3:
				insertIN.id = 'importe' + lineas;
				insertIN.disabled = 'disabled';
				break;	
			default:
				break;
		}		
		insertTD.appendChild(insertIN);
		linea.appendChild(insertTD);
	}	
	container.appendChild(linea);
	lineas++;
	if(document.getElementById('btnSupr').disabled == true){
		document.getElementById('btnSupr').disabled = false;
	}
}

function suprLinea() {  
    if(lineas>1){
        document.getElementById('lineas').removeChild(document.getElementById('lineas').lastChild);
        lineas--;
        if (lineas<=1) {
        	document.getElementById('btnSupr').disabled = true;
    	}
    }        
}

function calculo() {
	var vacio = false;
	lineas = 1;
	document.getElementById("subtotal").value = 0;	
	document.getElementById("IVA").value = 0;
	document.getElementById("total").value = 0;	

	for (var imp = 0; imp < lineas; imp++) {
		document.getElementById("importe" + imp).value = 0;
		if(document.getElementById("precio" + imp).value && document.getElementById("unidades" + imp).value && document.getElementById("concepto" + imp).value){
			calculoImporte(imp);
			actualizarSubtotal(imp);
			actualizarIVA(imp);
		}else{
			vacio =  true;			
		}	
	}	
	if(vacio){
		alert("Se deben completar todos los campos para calcular el importe de la factura.");
	}else{
		var total = calculoTotal();
		mostrarGraficaFinal(total);
	}
}

function calculoImporte(imp) {
	var p = parseFloat(document.getElementById("precio" + imp).value);
	var u = parseInt(document.getElementById("unidades" + imp).value);
	document.getElementById("importe" + imp).value = (p * u).toFixed(2);
}

function actualizarSubtotal(i) {	
	document.getElementById("subtotal").value = (parseFloat(document.getElementById("subtotal").value) + parseFloat(document.getElementById("importe" + i).value)).toFixed(2);
	
}

function actualizarIVA(i) {		
	document.getElementById("IVA").value = ((parseFloat(document.getElementById("IVA").value) + parseFloat(document.getElementById("importe" + i).value))*21/100).toFixed(2);	
}

function calculoTotal() {	
	document.getElementById("total").value = (parseFloat(document.getElementById("subtotal").value) + parseFloat(document.getElementById("IVA").value)).toFixed(2);
	return document.getElementById("total").value;
}

function enter() {
	alert("La información ha sido enviada con éxito.");
}

function mostrarGraficaFinal(total) {
	if(document.getElementById("grafico").hasChildNodes()){
		document.getElementById("grafico").removeChild(document.getElementById("myChart"));
	}
	var canvas = document.createElement("canvas");
	canvas.setAttribute("id", "myChart");
	canvas.setAttribute("height", 300);
	canvas.setAttribute("width", 300);
	document.getElementById("grafico").appendChild(canvas);
	Chart.defaults.global.tooltipTemplate = "<%if (label){%><%=label%>: <%}%><%= (value*" + parseFloat(total).toFixed(2) +")/100  %> €";
	var g = new Chart(document.getElementById("myChart").getContext("2d")).Pie();
	for (var i = 0; i < lineas; i++) {
		var color = new Array(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256));
		g.addData({
		    value: (document.getElementById("importe" + i).value *  100) / total,
		    color: "rgb(" + color[0] +"," + color[1] +"," + color[2] + ")",
		    highlight: "rgba(" + color[0] +"," + color[1] +"," + color[2] + ",0.8)",
		    label: document.getElementById("concepto" + i).value
		});
	}	
}

