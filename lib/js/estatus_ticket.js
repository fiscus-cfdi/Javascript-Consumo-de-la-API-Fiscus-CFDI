'use strict';
/**
 * Description. Clase para manejar los eventos de obtener el Estatus de un Ticket mediante la API de Fiscus CFDI
 * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
 * @date 2019-10-08
 * @version 1.0.0
 * @access public
 * @param {class} consumirApi instancia de la clase ConsumirApi, para realizar las peticiones al servidor
 * @param {string} serie serie asociada al RFC del ticket
 * @param {string} ticket del RFC
 * @see https://fiscuscfdi.com/API_Facturacion/docs/
 * @link https://fiscuscfdi.com/API_Facturacion/docs/
 */
class EstatusTicket
{
    #consumirApi = null;
    #serie="";
    #ticket="";

    /**
     * Description. Método para establecer la instancia de ConsumirApi para realizar peticiones al servidor
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
     * @date   2019-10-08
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
     * @date   2019-10-08
    **/
    constructor()
    {
        this.eventos();
    }
    /**
     * Description. Método para manejar los eventos al obtener el Estatus de un Ticket
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
     * @date   2019-10-08
    **/
    eventos()
    {
        document.getElementById("estatus_ticket_btn").addEventListener("click",(e) => {
            document.getElementById("estatus_ticket_btn").disabled=true;
            this.#serie=document.getElementById("serie").value;
            this.#ticket=document.getElementById("ticket").value;
            this.estatus();
        });
    }
    /**
     * Description. Método para realizar la petición para obtener el Estatus de un Ticket mediante la API de Fiscus CFDI
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
     * @date   2019-10-08
     * @return {void}
    **/
    estatus()
    {
        var estatus={
            "serie":this.#serie,
            "ticket[0]": this.#ticket, //Recibe un array con los tickets que se quieren consultar
            "token":"-1"
        };
        this.#consumirApi.api_estatus_ticket(estatus, (datos)=>{
            //Respuesta del servidor
            console.log(datos);
            alert(JSON.stringify(datos));
            document.getElementById("estatus_ticket_btn").disabled=false;
        });
    }
}