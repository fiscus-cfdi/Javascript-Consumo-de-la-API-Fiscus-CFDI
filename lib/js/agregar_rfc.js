'use strict';
/**
 * Description. Clase para manejar los eventos al dar de alta un RFC
 * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
 * @date 2019-08-22
 * @version 1.0.0
 * @access public
 * @param {object} alta objecto con las variables que se enviarán para dar de alta un RFC
 * @param {class} consumirApi instancia de la clase ConsumirApi, para realizar las peticiones al servidor
 * @see ConsumirApi
 * @link https://fiscuscfdi.com/API_Facturacion/docs/
 */
class AltaRfc
{
    #alta = {
        "env":"sandbox",
        "token":"",
        "rfc":"",
        "razon_social":"",
        "certificado_key":"",
        "certificado_cer":"",
        "certificado_password":"", 
        
        //VARIABLES OPCIONALES
        "curp":"",
        "registro_patronal":"",
        "logotipo_contenido":"",
        "logotipo_formato":"",
        "nombre_comercial":"",
        "codigo_postal":"",
        "zona_horaria":"",
        "cuenta_propietario": ""
    };
    #consumirApi = null;

    /**
     * Description. Método para establecer el ambiente: sandbox | production
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2019-08-26
     * @param  {string} env ambiente sandbox | production
     * @return {void}
    **/
    setAmbiente(env)
    {
        this.#alta["env"]=env;
    }
    /**
     * Description. Método para establecer la instancia de ConsumirApi para realizar peticiones al servidor
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
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
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2019-08-22
    **/
    constructor()
    {
        this.eventos();
    }
    /**
     * Description. Método para manejar los eventos al dar de alta un RFC
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2019-08-22
    **/
    eventos()
    {
        document.getElementById("agregar_rfc_btn").addEventListener("click",(e) => {
            this.leer_certificado();
        });
    }
    /**
     * Description. Método para leer los archivos .cer & .key y codificarlos en base64. En caso de que también haya subido una imagen para su logo, también se extrae el contenido en base64. Si el contenido de los archivos fue extraido correctamente, manda llamar a this.validarDatos(); 
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2019-08-22
    **/
    leer_certificado()
    {
        //Primero leer el archivo: .key y después el .cer 
        this.leer_archivo("#certificado_key", true, (base64_key) =>{
            this.leer_archivo("#certificado_cer", true, (base64_cer) => {       

                this.#alta["certificado_key"]=base64_key;
                this.#alta["certificado_cer"]=base64_cer;

                this.#alta["certificado_key"] = this.arraybuffertobase64(this.#alta["certificado_key"]);
                this.#alta["certificado_cer"] = this.arraybuffertobase64(this.#alta["certificado_cer"]);

                this.#alta["certificado_key"] = encodeURIComponent(this.#alta["certificado_key"]);
                this.#alta["certificado_cer"] = encodeURIComponent(this.#alta["certificado_cer"]);


                //Si cargó una imágen para el logotipo de la Factura; se extrae el contenido de la imagen
                if(document.getElementById("logotipo").value!=="")
                {
                    this.leer_archivo("#logotipo",false, (base64_img)=>{
                        var logotipo_contenido = /,(.+)/.exec(base64_img)[1];

                        var logotipo_formato=document.getElementById("logotipo").value.split(".");
                        logotipo_formato=logotipo_formato[logotipo_formato.length-1];

                        this.#alta["logotipo_contenido"] = logotipo_contenido;
                        this.#alta["logotipo_formato"] = logotipo_formato;
                        
                        this.#alta["logotipo_contenido"] = encodeURIComponent(this.#alta["logotipo_contenido"]);

                        this.validarDatos();

                    },(e) =>{
                        //Error al leer el contenido de la imagen (logotipo)
                        alert("No se pudo leer el archivo .cer, intente de nuevo");
                    });
                }
                else
                {   
                    this.validarDatos();    
                }
            },(e) =>{   
                //Error en archivo .cer 
                alert("No se pudo leer el archivo .cer, intente de nuevo");
            }); 
        },(e) =>{   
            //Error en archivo .key
            alert("No se pudo leer el archivo .key, intente de nuevo");
        });
    }
    /**
     * Description. Método para validar los campos requeridos. Si pasa la validación manda llamar a this.enviar_datos();
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2019-08-22
    **/
    validarDatos()
    {   
        this.#alta["token"]="-1";
        this.#alta["rfc"]= document.getElementById("rfc").value;
        this.#alta["razon_social"]= document.getElementById("razon_social").value;
        this.#alta["certificado_password"]= document.getElementById("certificado_password").value;
        
        this.#alta["curp"]= document.getElementById("curp").value;
        this.#alta["registro_patronal"]= document.getElementById("registro_patronal").value;
        this.#alta["nombre_comercial"]= document.getElementById("nombre_comercial").value;
        this.#alta["codigo_postal"]= document.getElementById("codigo_postal").value;
        this.#alta["zona_horaria"]= document.getElementById("zona_horaria").value;
        this.#alta["cuenta_propietario"]= document.getElementById("cuenta_propietario").value;

        if(this.#alta["rfc"].length>0 && this.#alta["razon_social"].length>0 && this.#alta["certificado_password"].length>0)
        {
            for (var id in this.#alta)
            {
                console.log(id);
                if (this.#alta[id] === null || this.#alta[id]==="")
                    delete this.#alta[id];
            }
            this.enviar_datos();
        }
        else
        {
            alert("Rfc, Razón social y el password del certificado son necesarios para continuar, intente de nuevo");
        }
        console.log(this.#alta);
        
    }
    /**
     * Description. Método que reliza la conexión con el servidor de la API, mediante la variable de instancia consumirAPI por medio del método api_agregar_rfc(...)
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2019-08-22
    **/
    enviar_datos()
    {
        this.#consumirApi.api_agregar_rfc(this.#alta, (datos)=>{
            //Respuesta del servidor
            console.log(datos);
            alert(JSON.stringify(datos));
        });
    }
    /**
     * Description. Método para extraer el contenido de los archivos subidos: .cer, .key e imágenes
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2019-08-22
     * @param {string} selector para identificar el input[type=file]
     * @param {boolean} blob para saber si se va a procesar como un binario
     * @param {function} callback_exito pasa el control a la función callback_exito
     * @param {function} callback_error pasa el control a la función callback_error
    **/
    leer_archivo(selector, blob, callback_exito, callback_error)
    {
        if(blob)
        {
            var files = document.querySelector(selector).files;
            for (var i = 0; i < files.length; i++)//if(files.length>0)
            {
                var reader = new FileReader();
                reader.onload = (function(reader){
                return ()=>{
                    //extraer contenido
                    console.log(reader.result);
                    callback_exito(reader.result);
                }
                })(reader);
                reader.readAsArrayBuffer(files[i]);
            }
        }
        else
        {
            var file = document.querySelector(selector).files[0];
            if(file!==undefined)
            {
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function () {
                    console.log(reader.result);
                    callback_exito(reader.result);
                };
                reader.onerror = function (error) {
                    console.log('Error: ', error);
                    callback_error(error);
                };
            }
            else
            {
                callback_error();
            }
        }
    }
    /**
     * Description. Método para convertir un buffer de array en un string en base64
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2019-08-22
     * @param {array} buffer a ser convertido
     * @return {string} en base 64
    **/
    arraybuffertobase64(buffer)
    {
        var binary = '';
        var bytes = new Uint8Array( buffer );
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
        }
        return window.btoa( binary );
    }

}