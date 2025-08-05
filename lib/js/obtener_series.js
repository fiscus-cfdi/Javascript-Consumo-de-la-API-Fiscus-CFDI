'use strict';
/**
 * Description. Clase para manejar los eventos de Cancelar un CFDI mediante la API de Fiscus CFDI
 * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
 * @date 2019-08-27
 * @version 1.0.0
 * @access public
 * @param {class} consumirApi instancia de la clase ConsumirApi, para realizar las peticiones al servidor
 * @param {string} rfc RFC de la empresa que se va a cancelar
 * @param {string} env ambiente sandbox | production
 * @see https://fiscuscfdi.com/API_Facturacion/docs/
 * @link https://fiscuscfdi.com/API_Facturacion/docs/
 */
class ObtenerSeries {
    #consumirApi = null;
    #rfc = "";
    #env = "sandbox";

    /**
     * Description. Método para establecer el ambiente: sandbox | production
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2019-08-26
     * @param  {string} env ambiente sandbox | production
     * @return {void}
    **/
    setAmbiente(env) {
        this.#env = env;
    }
    /**
     * Description. Método para establecer la instancia de ConsumirApi para realizar peticiones al servidor
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2019-08-26
     * @param  {object} consumirApi instancia para conectarse con el servidor de la API de Fiscus CFDI
     * @return {void}
    **/
    setConsumirApi(consumirApi) {
        this.#consumirApi = consumirApi;
    }
    /**
     * Description. Constructor de la clase, manda llamar a la función que maneja los eventos: this.eventos()
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2019-08-22
    **/
    constructor() {
        this.eventos();
    }
    /**
     * Description. Método para manejar los eventos al obtener las series de un RFC
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2019-08-22
    **/
    eventos() {
        document.getElementById("obtener_series_cfdi_btn").addEventListener("click", (e) => {
            document.getElementById("obtener_series_cfdi_btn").disabled = true;
            this.#rfc = document.getElementById("rfc").value;
            this.obtener_series();
        });
    }
    /**
     * Description. Método para realizar la petición para Obtener las Series a la API de Fiscus CFDI
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2019-08-27
     * @return {void}
    **/
    obtener_series() {
        var series = {
            "env": this.#env,
            "token": "-1",
            "rfc": this.#rfc
        };
        this.#consumirApi.api_obtener_series(series, (datos) => {
            //Respuesta del servidor
            console.log(datos);
            alert(JSON.stringify(datos));
            document.getElementById("obtener_series_cfdi_btn").disabled = false;
        });
    }
}