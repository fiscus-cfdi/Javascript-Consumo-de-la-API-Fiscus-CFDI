"use strict";
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
class ObtenerRfcs {
  #consumirApi = null;
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
    document
      .getElementById("obtener_rfcs_cfdi_btn")
      .addEventListener("click", (e) => {
        document.getElementById("obtener_rfcs_cfdi_btn").disabled = true;
        this.obtener_rfcs();
      });
  }

  /**
   * Description. Método para realizar la petición para Obtener los RFCs a la API de Fiscus CFDI
   * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
   * @date   2019-08-27
   * @return {void}
   **/
  obtener_rfcs() {
    var data = {
      env: this.#env,
      token: "-1",
    };
    this.#consumirApi.api_obtener_rfcs(data, (res) => {
      //Respuesta del servidor
      console.log(res);
      this.drawResult(res);
      document.getElementById("obtener_rfcs_cfdi_btn").disabled = false;
    });
  }

  /**
   * Description. Método para realizar la petición para Obtener los RFCs a la API de Fiscus CFDI
   * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
   * @date   2019-08-27
   * @return {void}
   **/
  drawResult({ json_respuesta: { rfcs } }) {
    var resultBox = document.getElementById("result");

    // Limpiar resultado
    resultBox.innerHTML = "";

    // Crear lista
    // var ul = document.createElement("ul");
    // for (var { rfc, razon_social: rs, estatus } of rfcs) {
    //   var li = document.createElement("li");
    //   li.append(`${rfc} - ${rs} - ${estatus}`);
    //   ul.appendChild(li);
    // }

    // resultBox.appendChild(ul);

    // Crear Tabla
    var table = document.createElement("table");
    var tableHead = document.createElement("thead");
    var tableBody = document.createElement("tbody");

    table.setAttribute("cellpadding", 10);

    // Header
    var thead1 = document.createElement("th");
    var thead2 = document.createElement("th");
    var thead3 = document.createElement("th");

    thead1.append("RFC");
    thead2.append("RAZON SOCIAL");
    thead3.append("ESTATUS");
    tableHead.appendChild(thead1);
    tableHead.appendChild(thead2);
    tableHead.appendChild(thead3);
    table.appendChild(tableHead);

    // Filas
    rfcs.forEach((rfc) => {
      var trow = document.createElement("tr");

      // Columnas
      for (var key in rfc) {
        if (rfc.hasOwnProperty(key)) {
          var data = rfc[key];
          var tcell = document.createElement("td");

          tcell.append(data);
          trow.appendChild(tcell);
        }
      }

      tableBody.appendChild(trow);
    });

    table.appendChild(tableBody);
    resultBox.appendChild(table);
  }
}
