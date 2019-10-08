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
class AltaCuenta
{
    #alta = {
        "env": "production",
        "token": "",
        "correo": "",
        "password": "",

        //VARIABLES OPCIONALES
        "nombre":"",
        "apellidoP":"",
        "apellidoM":""
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
        this.#alta["env"] = env;
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
     * 
     */
    eventos() {
        document.getElementById("agregar_cuenta_btn").addEventListener("click", (e) => {
            this.validarDatos();
        })
    }

    /**
     * 
     */
    validarDatos() {
        this.#alta["correo"] = document.getElementById("correo").value;
        this.#alta["password"] = document.getElementById("password").value;
        this.#alta["nombre"] = document.getElementById("nombre").value;
        this.#alta["apellido_paterno"] = document.getElementById("apellidoP").value;
        this.#alta["apellido_materno"] = document.getElementById("apellidoM").value;

        if (this.#alta["correo"] !== "" && this.#alta["password"] !== "") {
            this.enviar_datos();
        } else {
            alert("El correo y el password son requeridos");
        }
        console.log(this.#alta);
    }

    /**
     * 
     */
    enviar_datos() {
        this.#consumirApi.api_agregar_cuenta(this.#alta, (datos) => {
            console.log(datos);
            alert(JSON.stringify(datos));
        })
    }
}