'use strict';
/**
 * Description. Clase para manejar los eventos de alta de una cuenta.
 * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
 * @date 2019-10-08
 * @version 1.0.0
 * @access public
 * @param {object} alta objecto con las variables que se enviarán para dar de alta un RFC
 * @param {class} consumirApi instancia de la clase ConsumirApi, para realizar las peticiones al servidor
 * @see ConsumirApi
 * @link https://www.fiscuscfdi.com/API_Facturacion/docs/
 */
class EnviarFactura
{
    #enviar_factura = {
        "env": "sandbox",
        "token": "",
        "uuid": "",
        "correo": ""
    }
    #consumirApi = null;

    /**
     * Description. Metodo para establecer el ambiente sandbox | production
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
     * @date 2019-10-08
     * @param {String} env ambiente sandbox | production
     * @return {void} 
     */
    setAmbiente(env) {
        this.#enviar_factura["env"] = env;
    }

    /**
     * Description. Metodo para establecer el ambiente sandbox | production
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
     * @date 2019-10-08
     * @param {object} consumirApi instancia para conectarse con el servidor de la API de Fiscus CFDI
     * @return {void}
     */
    setConsumirApi(consumirApi) {
        this.#consumirApi = consumirApi;
    }

    /**
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
     * @date 2019-10-08
     */
    constructor(){
        this.eventos();
    }

    /**
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
     * @date 2019-10-08
     */
    eventos() {
        document.getElementById("enviar_factura_btn").addEventListener("click", (e) => {
            this.validarDatos();
        })
    }

    /**
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
     * @date 2019-10-08
     */
    validarDatos() {
        this.#enviar_factura["correo"] = document.getElementById("correo").value;
        this.#enviar_factura["uuid"] = document.getElementById("uuid").value;

        if (this.#enviar_factura["correo"] !== "" && this.#enviar_factura["uuid"] !== "") {
            this.enviar_datos();
        } else {
            alert("El correo y el folio fiscal son requeridos");
        }
        console.log(this.#enviar_factura);
    }

    /**
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
     * @date 2019-10-08
     */
    enviar_datos() {
        this.#consumirApi.api_enviar_factura(this.#enviar_factura, (datos) => {
            console.log(datos);
            alert(JSON.stringify(datos));
        })
    }
}