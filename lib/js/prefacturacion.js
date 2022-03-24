'use strict';
/**
 * Description. Clase para manejar la peticion para obtener el proximo folio consecutivo de acuerdo a los datos proporcionados.
 * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
 * @date 2019-08-22
 * @version 1.0.0
 * @access public
 * @param {object} infoEmisor objecto con las variables que se enviarán para obtener el folio
 * @param {class} consumirApi instancia de la clase ConsumirApi, para realizar las peticiones al servidor
 * @see ConsumirApi
 * @link https://fiscuscfdi.com/API_Facturacion/docs/
 */
class Prefacturacion
{
    #infoEmisor = {
        "token":"",
        "json_cfdi":"", 
        "rfc_emisor":"",
        "pdf":true
    };
    #consumirApi = null;


    /**
     * Description. Método para establecer la instancia de ConsumirApi para realizar peticiones al servidor
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
     * @date   2019-08-26
     * @param  {object} consumirApi instancia para conectarse con el servidor de la API de Fiscus CFDI
     * @return {void}
    **/
    setConsumirApi(consumirApi)
    {
        this.#consumirApi = consumirApi;
    }
    /**
     * Description. Constructor de la clase, se manda llamar a la función que maneja los eventos: this.eventos()
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
     * @date   2019-08-22
    **/
    constructor()
    {
        this.eventos();
    }
    /**
     * Description. Método para manejar los eventos al obtener folio
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
     * @date   2019-08-22
    **/
    eventos()
    {
        document.getElementById("boton_obtener_prefactura").addEventListener("click",(e) => {
            this.#infoEmisor["json_cfdi"] = document.getElementById("json_cfdi").value;
            this.#infoEmisor["rfc_emisor"] = document.getElementById("rfc_emisor").value;
            this.peticion();
        });
    }
    /**
     * Description. Método que reliza la conexión con el servidor de la API, mediante la variable de instancia consumirAPI por medio del método api_previsualizar_prefactura(...)
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
     * @date   2019-08-22
    **/
    peticion()
    {
        this.#consumirApi.api_previsualizar_prefactura(this.#infoEmisor, (datos)=>{
            //Respuesta del servidor
            console.log(datos);
            alert(JSON.stringify(datos));
            var a = document.createElement("a");
						a.href = "data:application/pdf;base64,"+datos.json_respuesta.pdf;
						a.download = this.#infoEmisor["rfc_emisor"] + '.pdf';
						document.body.appendChild(a);
						a.click();
						document.body.removeChild(a);
        });
    }
}