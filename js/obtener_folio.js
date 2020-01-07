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
 * @link https://www.fiscuscfdi.com/API_Facturacion/docs/
 */
class ObtenerFolio
{
    #infoEmisor = {
        "env":"sandbox",
        "token":"",
        "rfc":"",
        
        //VARIABLES OPCIONALES
        "serie":"",
    };
    #consumirApi = null;

    /**
     * Description. Método para establecer el ambiente: sandbox | production
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
     * @date   2019-08-26
     * @param  {string} env ambiente sandbox | production
     * @return {void}
    **/
    setAmbiente(env)
    {
        this.#infoEmisor["env"]=env;
    }
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
        document.getElementById("agregar_obtener_folio").addEventListener("click",(e) => {
            this.#infoEmisor["rfc"] = document.getElementById("rfc").value;
            this.#infoEmisor["serie"] = document.getElementById("serie").value;
            this.peticionFolio();
        });
    }
    /**
     * Description. Método que reliza la conexión con el servidor de la API, mediante la variable de instancia consumirAPI por medio del método api_obtener_folio(...)
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
     * @date   2019-08-22
    **/
   peticionFolio()
    {
        this.#consumirApi.api_obtener_folio(this.#infoEmisor, (datos)=>{
            //Respuesta del servidor
            console.log(datos);
            alert(JSON.stringify(datos));
        });
    }
}