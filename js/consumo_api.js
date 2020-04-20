"use strict";
/**
 * Description. Clase para realizar las peticiones al servidor de la API de Fiscus CFDI, conforme a la documentación: https://www.fiscuscfdi.com/API_Facturacion/docs/
 * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
 * @date 2019-08-22
 * @version 1.0.0
 * @access public
 * @param {string} usuario credenciales para consumir la API
 * @param {string} password credenciales para consumir la API
 * @param {string} url de la API de Fiscus CFDI
 * @see https://www.fiscuscfdi.com/API_Facturacion/docs/
 * @link https://www.fiscuscfdi.com/API_Facturacion/docs/
 */
class ComsumirApi {
  #usuario = "";
  #password = "";
  #url = "https://www.fiscuscfdi.com/index.php/Api?peticion=";

  /**
   * Description. Método para establecer el Usuario para consumir la API de Fiscus CFDI
   * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
   * @date   2019-08-26
   * @param  {string} usuario
   * @return {void}
   **/
  setUsuario(usuario) {
    this.#usuario = usuario;
  }
  /**
   * Description. Método para establecer el Password para consumir la API de Fiscus CFDI
   * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
   * @date   2019-08-26
   * @param  {string} password
   * @return {void}
   **/
  setPassword(password) {
    this.#password = password;
  }
  /**
   * Description. Método para obtener un Token y poder consumir los demás métodos, según la documentación de la API de Fiscus CFDI - https://www.fiscuscfdi.com/API_Facturacion/docs/
   * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
   * @date   2019-08-22
   * @param  {function} callback_exito pasa el control a la función callback_exito
   * @param  {function} callback_error pasa el control a la función callback_error
   * @return {void}
   **/
  api_obtener_token(callback_exito, callback_error) {
    var credenciales = {
      usuario: this.#usuario,
      password: this.#password,
    };
    credenciales = this.convertir_parametros_post(credenciales);
    this.peticion_servidor(
      this.#url + "api_obtener_token",
      credenciales,
      (datos) => {
        console.log(datos);
        if (datos.json_respuesta === null) {
          callback_error(datos.mensaje);
        } else {
          callback_exito(datos.json_respuesta.token);
        }
      }
    );
  }

  /**
   * Description. Método para dar de alta un RFC en la plataforma de Fiscus CFDI, mediante la API
   * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
   * @date   2019-08-22
   * @param  {object} agregar_rfc objeto con los valores requeridos/opcionales para dar de alta un RFC, conforme a la documentación de la API de Fiscus CFDI: https://www.fiscuscfdi.com/API_Facturacion/docs/
   * @return {void}
   **/
  api_agregar_rfc(agregar_rfc, callback) {
    this.api_obtener_token(
      (token) => {
        agregar_rfc["token"] = token;
        console.log(agregar_rfc);
        var credenciales = this.convertir_parametros_post(agregar_rfc);
        this.peticion_servidor(
          this.#url + "api_agregar_rfc",
          credenciales,
          (datos) => {
            console.log(datos);
            callback(datos);
          }
        );
      },
      (e) => {
        callback(e);
      }
    );
  }

  /**
   * Description. Método para timbrar un CFDI en Fiscus CFDI, mediante la API
   * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
   * @date   2019-08-26
   * @param  {object} cfdi objeto con los valores requeridos/opcionales para timbrar un CFDI, conforme a la documentación de la API de Fiscus CFDI: https://www.fiscuscfdi.com/API_Facturacion/docs/
   * @param {function} callback donde regresará el control
   * @return {void}
   **/
  api_timbrar_cfdi(cfdi, callback) {
    this.api_obtener_token(
      (token) => {
        cfdi["token"] = token;
        console.log(cfdi);
        var credenciales = this.convertir_parametros_post(cfdi);
        this.peticion_servidor(
          this.#url + "api_timbrar_cfdi",
          credenciales,
          (datos) => {
            console.log(datos);
            callback(datos);
          }
        );
      },
      (e) => {
        callback(e);
      }
    );
  }
  /**
   * Description. Método para cancelar un CFDI en Fiscus CFDI, mediante la API
   * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
   * @date   2019-08-27
   * @param  {object} cancelar objeto con los valores requeridos/opcionales para cancelar un CFDI, conforme a la documentación de la API de Fiscus CFDI: https://www.fiscuscfdi.com/API_Facturacion/docs/
   * @param {function} callback donde regresará el control
   * @return {void}
   **/
  api_cancelar_cfdi(cancelar, callback) {
    this.api_obtener_token(
      (token) => {
        cancelar["token"] = token;
        console.log(cancelar);
        var credenciales = this.convertir_parametros_post(cancelar);
        this.peticion_servidor(
          this.#url + "api_cancelar_cfdi",
          credenciales,
          (datos) => {
            console.log(datos);
            callback(datos);
          }
        );
      },
      (e) => {
        callback(e);
      }
    );
  }

  /**
   * Description. Modo para obtener RFCs asociados a una cuenta en la API de Fiscus CFDI
   * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
   * @date   2019-10-08
   * @param  {object} data objeto con los valores requeridos/opcionales para obtener las data de un RFC, conforme a la documentación de la API de Fiscus CFDI: https://www.fiscuscfdi.com/API_Facturacion/docs/
   * @param {function} callback donde regresará el control
   * @return {void}
   **/
  api_obtener_rfcs(data, callback) {
    this.api_obtener_token(
      (token) => {
        data["token"] = token;
        console.log(data);
        var credenciales = this.convertir_parametros_post(data);
        this.peticion_servidor(
          this.#url + "api_obtener_rfcs",
          credenciales,
          (datos) => {
            console.log(datos);
            callback(datos);
          }
        );
      },
      (e) => {
        callback(e);
      }
    );
  }

  /**
   * Description. Modo para obtener las series asociadas a un RFC en Fiscus CFDI
   * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
   * @date   2019-10-08
   * @param  {object} series objeto con los valores requeridos/opcionales para obtener las series de un RFC, conforme a la documentación de la API de Fiscus CFDI: https://www.fiscuscfdi.com/API_Facturacion/docs/
   * @param {function} callback donde regresará el control
   * @return {void}
   **/
  api_obtener_series(series, callback) {
    this.api_obtener_token(
      (token) => {
        series["token"] = token;
        console.log(series);
        var credenciales = this.convertir_parametros_post(series);
        this.peticion_servidor(
          this.#url + "api_obtener_numeros_series",
          credenciales,
          (datos) => {
            console.log(datos);
            callback(datos);
          }
        );
      },
      (e) => {
        callback(e);
      }
    );
  }

  api_agregar_cuenta(cuenta, callback) {
    this.api_obtener_token(
      (token) => {
        cuenta["token"] = token;
        console.log(cuenta);
        var credenciales = this.convertir_parametros_post(cuenta);
        this.peticion_servidor(
          this.#url + "api_agregar_cuenta",
          credenciales,
          (datos) => {
            console.log(datos);
            callback(datos);
          }
        );
      },
      (e) => {
        callback(e);
      }
    );
  }
  /**
   * Description. Guarda un JSON representativo del CFDI al que solo se le omitirían los datos del receptor. Este JSON será validado y guardado para su futura facturación
   * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
   * @date   2019-08-26
   * @param  {object} ticket objeto con los valores requeridos/opcionales para crear un ticket, conforme a la documentación de la API de Fiscus CFDI: https://www.fiscuscfdi.com/API_Facturacion/docs/
   * @param {function} callback donde regresará el control
   * @return {void}
   **/
  api_guardar_ticket(ticket, callback) {
    this.api_obtener_token(
      (token) => {
        ticket["token"] = token;
        console.log(ticket);
        var credenciales = this.convertir_parametros_post(ticket);
        this.peticion_servidor(
          this.#url + "api_guardar_ticket",
          credenciales,
          (datos) => {
            console.log(datos);
            callback(datos);
          }
        );
      },
      (e) => {
        callback(e);
      }
    );
  }

  /**
   * Description. Método para obtener el estatus de un Ticket por medio de la API de Fiscus CFDI
   * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
   * @date   2019-08-27
   * @param  {object} estatus_ticket objeto con los valores requeridos/opcionales para obtener el Estatus de un Ticket, conforme a la documentación de la API de Fiscus CFDI: https://www.fiscuscfdi.com/API_Facturacion/docs/
   * @param {function} callback donde regresará el control
   * @return {void}
   **/
  api_estatus_ticket(estatus_ticket, callback) {
    this.api_obtener_token(
      (token) => {
        estatus_ticket["token"] = token;
        console.log(estatus_ticket);
        var credenciales = this.convertir_parametros_post(estatus_ticket);
        this.peticion_servidor(
          this.#url + "api_estatus_ticket",
          credenciales,
          (datos) => {
            console.log(datos);
            callback(datos);
          }
        );
      },
      (e) => {
        callback(e);
      }
    );
  }

  api_enviar_factura(factura, callback) {
    this.api_obtener_token(
      (token) => {
        factura["token"] = token;
        console.log(factura);
        var credenciales = this.convertir_parametros_post(factura);
        this.peticion_servidor(
          this.#url + "api_enviar_factura",
          credenciales,
          (datos) => {
            console.log(datos);
            callback(datos);
          }
        );
      },
      (e) => {
        callback(e);
      }
    );
  }

  api_obtener_folio(infoEmisor, callback) {
    this.api_obtener_token(
      (token) => {
        infoEmisor["token"] = token;
        console.log("info peticion:", infoEmisor);
        var credenciales = this.convertir_parametros_post(infoEmisor);
        this.peticion_servidor(
          this.#url + "api_obtener_folio",
          credenciales,
          (datos) => {
            console.log("info respuesta:", datos);
            callback(datos);
          }
        );
      },
      (e) => {
        callback(e);
      }
    );
  }

  api_obtener_factura(data_factura, callback) {
    this.api_obtener_token(
      (token) => {
        data_factura["token"] = token;
        console.log("info peticion: ", data_factura);
        var credenciales = this.convertir_parametros_post(data_factura);
        this.peticion_servidor(
          this.#url + "api_obtener_factura",
          credenciales,
          (data) => {
            console.log("info respuesta:", data);
            callback(data);
          }
        );
      },
      (e) => {
        callback(e);
      }
    );
  }

  /**
   * Description. Método genérico para realiza las peticiones al servidor, utilizado por los métodos de api_obtener_token(), api_agregar_rfc(), api_timbrar_cfdi() & api_cancelar_cfdi(), recibe 3 parámetros; la url, las variables POST y una función callback
   * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
   * @date   2019-08-21
   * @param  {string} url del servidor
   * @param  {string} parametros parámetros POST, en formato CLAVE1=VALOR1&CLAVE2=VALOR2...
   * @param  {function} callback función a la que se le pasará el control, cuando el servidor responda
   * @return {void}
   **/
  peticion_servidor(url, parametros, callback) {
    var oReq = new XMLHttpRequest();
    oReq.open("POST", url, true);
    oReq.responseType = "json";
    oReq.onload = function (e) {
      console.log(e);
      console.log(oReq.response);
      callback(oReq.response);
    };
    oReq.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded; charset=UTF-8"
    );
    oReq.send(parametros);
  }
  /**
   * Description. Método para convertir un objeto en un string CLAVE1=VALOR1&CLAVE2=VALOR2...
   * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
   * @date   2019-08-22
   * @param  {object} url del objeto
   * @return {string} arreglo con las variables formateadas: CLAVE1=VALOR1&CLAVE2=VALOR2...
   **/
  convertir_parametros_post(objeto) {
    var arreglo = [];
    for (var id in objeto) {
      if (objeto.hasOwnProperty(id)) {
        arreglo.push(id + "=" + objeto[id]);
      }
    }
    return arreglo.join("&");
  }
}
