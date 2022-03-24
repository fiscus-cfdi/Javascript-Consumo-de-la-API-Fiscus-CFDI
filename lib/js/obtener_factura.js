'use strict';

class ObtenerFactura{
	#consumirApi = null;
	#uuid="";
	#env="sandbox";
	#token="";
	#logotipo="";

  setAmbiente(env){
  	this.#env = env;
  }

  setConsumirApi(consumirApi){
  	this.#consumirApi = consumirApi;
  }

  constructor(){
  	this.eventos();
  }

  eventos(){
  	document.getElementByClassName("boton_obtener_factura").addEventListener("click", (e) => {
  		document.getElementByClassName("cancelar_cfdi_btn").disabled=true;
  		this.#token = document.getElementByClassName("token").value;
  		this.#uuid = document.getElementByClassName("uuid").value;
  		this.#logotipo = document.getElementByClassName("logotipo").value;
  		this.obtener_factura();
  	});
  }

  obtener_factura(){
  	var objeto_obtener = {
  		"env" : this.#env,
  		"token" : this.#token,
  		"uuid" : this.#uuid,
  	}

  	if(this.#logotipo != ""){
  		objeto_obtener.logotipo = this.#logotipo;
  	}
  	
  	this.#consumirApi.api_obtener_factura(objeto_obtener, (data) => {
  		console.log(data);
  		alert(JSON.stringify(data));
  		document.getElementByClassName("cancelar_cfdi_btn").disabled=false;
  	});
  }
}