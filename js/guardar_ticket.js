'use strict';

/**
 * Description. Clase para manejar los eventos de Timbrar un CFDI genérico mediante la API de Fiscus CFDI
 * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
 * @date 2019-08-26
 * @version 1.0.0
 * @access public
 * @param {object} cfdi objeto con la estructura de un xml que se enviarán para timbrar un CFDI
 * @param {class} consumirApi instancia de la clase ConsumirApi, para realizar las peticiones al servidor
 * @param {string} contenido_pdf contenido en base 64 del PDF ya timbrado
 * @param {string} contenido_xml contenido en base 64 del XML ya timbrado
 * @param {string} uuid folio fiscal
 * @param {string} serie serie relacionada al RFC que emite el ticket,
 * @param {string} ticket codigo propio del cliente para identificar el ticket
 * @param {number} importe importe final con de la transacción
 * @see ConsumirApi
 * @link https://fiscuscfdi.com/API_Facturacion/docs/
 */
class GuardarTicket
{
    #cfdi = {
        "Emisor": {
          "Rfc": "",
          "Nombre": "",
          "RegimenFiscal": ""
        },
        "Receptor": {
          "Rfc": "",
          "Nombre": "",
          "UsoCFDI": ""
        },
        "Conceptos": {
            "Concepto":[]
        },
        "Version": "",
        "Folio": "",
        "Fecha": "",
        "FormaPago": "",
        "CondicionesDePago": "",
        "Descuento": "",
        "SubTotal": "",
        "Moneda": "",
        "Total": "",
        "TipoDeComprobante": "",
        "MetodoPago": "",
        "LugarExpedicion": ""
    };
    #consumirApi = null;
    #serie="";
    #ticket="12345";
    #importe=0

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
    * Description. Método para manejar los eventos al Timbrar un CFDI 3.3
    * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
    * @date   2019-08-22
   **/
   eventos()
   {
        document.getElementById("agregar_concepto").addEventListener("click",(e) => {
           this.nuevo_concepto();
        });
        document.getElementById("TimbrarCFDI33").addEventListener("click",(e) => {
            var serie = document.getElementById("serie").value;
            var ticket = document.getElementById("ticket").value;
            var importe = document.getElementById("importe").value;
            if (serie && ticket && importe) {
                this.#serie = serie;
                this.#ticket = ticket;
                this.#importe = importe;

                document.getElementById("TimbrarCFDI33").disabled=true;
                this.validarDatos();
            } else {
                alert("Tiene campos pendientes por llenar.");
            }
        });
   }
   /**
    * Description. Método para convertir un string en base64 en blob
    * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
    * @date   2019-08-26
    * @param  {string} b64Data
    * @param  {string} contentType
    * @param  {string} sliceSize
    * @return {object} blob
   **/
   b64toBlob(b64Data, contentType='', sliceSize=512)
   {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++)
      {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }
   /**
    * Description. Método para agregar una nueva fila de CONCEPTO
    * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
    * @date   2019-08-22
   **/
   nuevo_concepto()
   {
        var itm = document.getElementsByClassName("concepto_item");
        if(itm.length>0)
        {
            var cln = itm[itm.length-1].cloneNode(true);
            document.getElementById("tbody_conceptos").appendChild(cln);
        }
   }
   /**
     * Description. Método para llenar el objeto que se enviará a la API de Fiscus CFDI para timbrar
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
     * @date   2019-08-26
     * @return {void}
    **/
   validarDatos()
   {
       var Descuento=0.0;
       var TotalImpuestosRetenidos=0.0;
       var TotalImpuestosTrasladados=0.0;
       var Traslado=[];
       var Retencion=[];
       var SubTotal=0.0;
       var Total=0.0;


       //Emisor
       this.#cfdi["Emisor"]["Rfc"] = document.getElementById("rfc_emisor").value;
       this.#cfdi["Emisor"]["Nombre"] = document.getElementById("razon_social_emisor").value;
       this.#cfdi["Emisor"]["RegimenFiscal"] = document.getElementById("regimen_fiscal_emisor").value;

       //Conceptos
       this.#cfdi["Conceptos"]["Concepto"]=[];
       var concepto = document.getElementsByClassName("concepto_item");
       var item_concepto={
                "Impuestos": {
                   "Traslados": {
                       "Traslado":[]
                   },
                   "Retenciones":{
                       "Retencion":[]
                   }
                }
        };
       var llaves=["ClaveProdServ", "NoIdentificacion", "Cantidad", "ClaveUnidad", "Unidad", "Descripcion", "ValorUnitario", "Importe", "Descuento", "Traslados", "Retenciones"];
       var ImporteImpuesto=0.0;
       for(var i = 0;i<concepto.length;i++)
       {
            item_concepto={
                "Impuestos": {
                    "Traslados": {
                        "Traslado":[]
                    },
                    "Retenciones":{
                        "Retencion":[]
                    }
                }
            };
           for (var j = 0; j < llaves.length; j++)
           {
               if(concepto[i].querySelector('.'+llaves[j]).value.length>0)
               {
                   if(llaves[j]=="Traslados")
                   {
                       ImporteImpuesto=0.0;
                       ImporteImpuesto = parseFloat(concepto[i].querySelector('.TasaOCuotaTraslados').value) * parseFloat(concepto[i].querySelector('.Importe').value);
                       ImporteImpuesto=this.redondear(ImporteImpuesto);
                       TotalImpuestosTrasladados=TotalImpuestosTrasladados+ImporteImpuesto;

                        //Traslado a nivel de 'Concepto'                      
                        item_concepto["Impuestos"]["Traslados"]["Traslado"].push({
                            "Base": concepto[i].querySelector('.Importe').value,
                            "Impuesto": ""+concepto[i].querySelector('.Traslados').value,
                            "TipoFactor": "Tasa",
                            "TasaOCuota": concepto[i].querySelector('.TasaOCuotaTraslados').value,
                            "Importe": ImporteImpuesto
                        });

                        //Traslado a nivel de Impuesto de root (Comprobante)
                        Traslado.push({
                            "Impuesto": ""+concepto[i].querySelector('.Traslados').value,
                            "TipoFactor": "Tasa",
                            "TasaOCuota": concepto[i].querySelector('.TasaOCuotaTraslados').value,
                            "Importe": ImporteImpuesto
                        });
                   }
                   else
                   {
                        if(llaves[j]=="Retenciones")
                        {
                            ImporteImpuesto=0.0;
                            ImporteImpuesto = parseFloat(concepto[i].querySelector('.TasaOCuotaRetenciones').value) * parseFloat(concepto[i].querySelector('.Importe').value);
                            ImporteImpuesto=this.redondear(ImporteImpuesto);
                            TotalImpuestosRetenidos=TotalImpuestosRetenidos+ImporteImpuesto;

                                //Retención a nivel de 'Concepto'                      
                                item_concepto["Impuestos"]["Retenciones"]["Retencion"].push({
                                    "Base": concepto[i].querySelector('.Importe').value,
                                    "Impuesto": ""+concepto[i].querySelector('.Retenciones').value,
                                    "TipoFactor": "Tasa",
                                    "TasaOCuota": concepto[i].querySelector('.TasaOCuotaRetenciones').value,
                                    "Importe": ImporteImpuesto
                                });

                                //Retención a nivel de Impuesto de root (Comprobante)
                                Retencion.push({
                                    "Impuesto": ""+concepto[i].querySelector('.Retenciones').value,
                                    "Importe": ImporteImpuesto
                                });
                        }
                        else
                        {
                            item_concepto[llaves[j]]=concepto[i].querySelector('.'+llaves[j]).value;
                            switch(llaves[j])
                            {
                                case "Descuento":
                                    if(parseFloat(concepto[i].querySelector('.'+llaves[j]).value)!==NaN)
                                    {
                                        Descuento=Descuento+parseFloat(concepto[i].querySelector('.'+llaves[j]).value);
                                    }
                                    break;
                                case "Importe":
                                    if(parseFloat(concepto[i].querySelector('.'+llaves[j]).value)!==NaN)
                                    {
                                        SubTotal=SubTotal+parseFloat(concepto[i].querySelector('.'+llaves[j]).value);
                                    }
                                        
                                    break;
                            }
                        }
                   }
               }
               else
               {
                 if(concepto[i].querySelector('.'+llaves[j]).getAttribute("required")!=null)
                 {
                     alert("La "+llaves[j]+" es requerida");
                 }
               }
            } 
            if(item_concepto["Impuestos"]["Traslados"]["Traslado"].length==0)
                delete item_concepto["Impuestos"]["Traslados"];
            if(item_concepto["Impuestos"]["Retenciones"]["Retencion"].length==0)
                delete item_concepto["Impuestos"]["Retenciones"];

            this.#cfdi["Conceptos"]["Concepto"].push(item_concepto);
       }

       //Impuestos
       this.#cfdi["Impuestos"]={
            "TotalImpuestosTrasladados": 0.0,
            "TotalImpuestosRetenidos": 0.0,
            "Retenciones": 
            {
                "Retencion":[]
            },
            "Traslados": {
                  "Traslado": []               
            }
        };
        if(TotalImpuestosTrasladados==0.0){
            delete this.#cfdi["Impuestos"]["TotalImpuestosTrasladados"];
            delete this.#cfdi["Impuestos"]["Traslados"];
        }
        else
        {
            this.#cfdi["Impuestos"]["TotalImpuestosTrasladados"]=TotalImpuestosTrasladados;
            for(var i=0;i<Traslado.length;i++)
            {
                this.#cfdi["Impuestos"]["Traslados"]["Traslado"].push(Traslado[i])
            }
        }
        if(TotalImpuestosRetenidos==0.0){
            delete this.#cfdi["Impuestos"]["TotalImpuestosRetenidos"];
            delete this.#cfdi["Impuestos"]["Retenciones"];
        }
        else
        {   
            this.#cfdi["Impuestos"]["TotalImpuestosRetenidos"]=TotalImpuestosRetenidos;
            for(var i=0;i<Retencion.length;i++)
            {
                this.#cfdi["Impuestos"]["Retenciones"]["Retencion"].push(Retencion[i])
            }
        }



        //Descuentos
        if(Descuento==0.0)
        {
            delete this.#cfdi["Descuento"];
        }
        else
        {
            this.#cfdi["Descuento"]=Descuento;
        }

        //Cálculo Final
        Total = SubTotal-TotalImpuestosRetenidos+TotalImpuestosTrasladados-Descuento;
        Total = this.redondear(Total);


       //General
       this.#cfdi["Version"] = document.getElementById("Version").value;
       this.#cfdi["Folio"] = document.getElementById("Folio").value;
       this.#cfdi["Fecha"] = document.getElementById("Fecha").value;
       this.#cfdi["FormaPago"] = document.getElementById("FormaPago").value;
       this.#cfdi["CondicionesDePago"] = document.getElementById("CondicionesDePago").value;
       this.#cfdi["SubTotal"] = SubTotal;
       this.#cfdi["Moneda"] = document.getElementById("Moneda").value;
       this.#cfdi["Total"] = Total;
       this.#cfdi["TipoDeComprobante"] = document.getElementById("TipoDeComprobante").value;
       this.#cfdi["MetodoPago"] = document.getElementById("MetodoPago").value;
       this.#cfdi["LugarExpedicion"] = document.getElementById("LugarExpedicion").value;
       

       document.getElementById("SubTotal").value=SubTotal;
       document.getElementById("Total").value=Total;
       console.log(this.#cfdi);


       //Quitar los campos que estén en blanco/vacios
       this.#cfdi=this.limpiar_cfdi(this.#cfdi);



       this.guardar_ticket();
   }
   /**
     * Description. Método para limpiar el objeto de CFDI, las propiedades vacias se eliminan
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
     * @date   2019-08-26
     * @param {object} cfdi
     * @return {void}
    **/
   limpiar_cfdi(cfdi)
   {
        var value=null;
        for(var key in cfdi)
        { 
            value=cfdi[key];
            if(value === "" || value === null)
            {
                delete cfdi[key];
            }
            else if(Object.prototype.toString.call(value) === '[object Object]')
            {
                this.limpiar_cfdi(value);
            }
            else if(Array.isArray(value))
            {
                value.forEach( (el) => { this.limpiar_cfdi(el); });
            }
        };
        return cfdi;
   }
   /**
     * Description. Método para hacer la conexión a la API
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
     * @date   2019-08-26
     * @return {void}
    **/
   guardar_ticket()
   {
       var ticket={
            "token":"-1",
            "cfdi": JSON.stringify(this.#cfdi),
            "serie": this.#serie,
            "ticket": this.#ticket,
            "importe": this.#importe
       };
        this.#consumirApi.api_guardar_ticket(ticket, (datos)=>{
            //Respuesta del servidor
            console.log(datos);
            alert(JSON.stringify(datos));
            document.getElementById("TimbrarCFDI33").disabled=false;
        });
   }
   /**
     * Description. Método para redondear a dos decimales
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | fiscuscfdi.com
     * @date   2019-08-26
     * @param {number} numero
     * @return {number} 
    **/
   redondear(numero)
   {
       return (Math.round(numero * 100) / 100);
   }
}
