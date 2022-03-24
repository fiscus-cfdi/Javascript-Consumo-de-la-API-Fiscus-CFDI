'use strict';
/**
 * Description. Clase para manejar los eventos de Cancelar un CFDI mediante la API de Fiscus CFDI
 * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
 * @date 2019-08-27
 * @version 1.0.0
 * @access public
 * @param {class} consumirApi instancia de la clase ConsumirApi, para realizar las peticiones al servidor
 * @param {string} uuid folio fiscal a cancelar
 * @param {string} env ambiente sandbox | production
 * @see https://fiscuscfdi.com/API_Facturacion/docs/
 * @link https://fiscuscfdi.com/API_Facturacion/docs/
 */
class CancelarCFDI
{
    #consumirApi = null;
    #uuid="";
    #env="sandbox";

    /**
     * Description. Método para establecer el ambiente: sandbox | production
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
     * @date   2019-08-26
     * @param  {string} env ambiente sandbox | production
     * @return {void}
    **/
    setAmbiente(env)
    {
        this.#env=env;
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
     * Description. Constructor de la clase, manda llamar a la función que maneja los eventos: this.eventos()
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
     * @date   2019-08-22
    **/
    constructor()
    {
        this.eventos();
    }
    /**
     * Description. Método para manejar los eventos al cancelar un CFDI
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
     * @date   2019-08-22
    **/
    eventos()
    {
        document.getElementById("cancelar_cfdi_btn").addEventListener("click",(e) => {
            document.getElementById("cancelar_cfdi_btn").disabled=true;
            this.#uuid=document.getElementById("uuid").value;
            this.cancelar();
        });
    }
    /**
     * Description. Método para realizar la petición de Cancelación de un CFDI a la API de Fiscus CFDI
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
     * @date   2019-08-27
     * @return {void}
    **/
    cancelar()
    {
        var cancelar={
            "env":this.#env,
            "token":"-1",
            "uuid": this.#uuid
        };
        this.#consumirApi.api_cancelar_cfdi(cancelar, (datos)=>{
            //Respuesta del servidor
            console.log(datos);
            alert(JSON.stringify(datos));
            document.getElementById("cancelar_cfdi_btn").disabled=false;
        });
    }
}