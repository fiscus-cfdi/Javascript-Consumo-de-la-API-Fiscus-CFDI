'use strict';

/**
 * Description. Clase para manejar los eventos de Timbrar un CFDI genérico mediante la API de Fiscus CFDI
 * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
 * @date 2022-03-21
 * @version 1.0.0
 * @access public
 * @param {object} cfdi objeto con la estructura de un xml que se enviarán para timbrar un CFDI
 * @param {class} consumirApi instancia de la clase ConsumirApi, para realizar las peticiones al servidor
 * @param {string} contenido_pdf contenido en base 64 del PDF ya timbrado
 * @param {string} contenido_xml contenido en base 64 del XML ya timbrado
 * @param {string} uuid folio fiscal
 * @param {string} env ambiente sandbox | production
 * @param {array} errores array para almacenar los errores obtenidos antes de enviar a Timbrar 
 *  @param {function} callback_timbrado_exitoso función callback cuando el timbrado fué exitoso
 * @see ConsumirApi
 * @link https://fiscuscfdi.com/API_Facturacion/docs/
 */
class TimbrarCFDI
{
    #base_cfdi={
        "Emisor": {
          "Rfc": "",
          "Nombre": "",
          "RegimenFiscal": "",
          "FacAtrAdquirente":""
        },
        "Receptor": {
          "Rfc": "",
          "Nombre": "",
          "DomicilioFiscalReceptor":"",
          "ResidenciaFiscal":"",
          "NumRegIdTrib":"",
          "RegimenFiscalReceptor": "",
          "UsoCFDI": ""
        },
        "Conceptos": {"Concepto" : [
          { 
            "Impuestos": {
            },
            "ClaveProdServ":"",
            "NoIdentificacion":"",
            "Cantidad":"",
            "ClaveUnidad":"",
            "Unidad":"",
            "Descripcion":"",
            "ValorUnitario":"",
            "Importe":""
          }
        ]},
        "Impuestos": {
          "Retenciones": {
            "Retencion" : []
          },
          "TotalImpuestosRetenidos":"",
          "Traslados": {
              "Traslado" : []
          },
          "TotalImpuestosTrasladados":""
        },
        "Version": "4.0",
        "Serie": "",
        "Folio": "", 
        "Fecha": "",
        "Sello": "@",
        "FormaPago": "",
        "NoCertificado": "",
        "Certificado": "@",
        "CondicionesDePago": "",
        "SubTotal": "0.0",
        "Descuento": "",
        "Moneda": "",
        "TipoCambio": "1.0",
        "Total": "0.0",
        "TipoDeComprobante": "I",
        "Exportacion":"",
        "MetodoPago": "",
        "LugarExpedicion": "",
        "Confirmacion":""      
    };
    #cfdi = {};
    #consumirApi = null;
    #contenido_pdf="";
    #contenido_xml="";
    #uuid="";
    #env="sandbox";
    #errores=[];
    #callback_timbrado_exitoso=function(){};


    /**
     * Description. Método para establecer el contenido_pdf.
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21
     * @param  {string}  
     * @return {void}
    **/
     setContenido_pdf(contenido_pdf)
     {
         this.#contenido_pdf=contenido_pdf;
     }
     /**
     * Description. Método para establecer el contenido_xml.
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21
     * @param  {string}  
     * @return {void}
    **/
    setContenido_xml(contenido_xml)
    {
        this.#contenido_xml=contenido_xml;
    }
    /**
     * Description. Método para establecer el uuid.
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21
     * @param  {string}  
     * @return {void}
    **/
     setUuid(uuid)
     {
         this.#uuid=uuid;
     }


    /**
     * Description. Método para establecer el callback cuando el timbrado fue exitoso.
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21
     * @param  {function} callback 
     * @return {void}
    **/
    setCallbackTimbradoExitoso(callback)
    {
        this.#callback_timbrado_exitoso=callback;
    }
    /**
     * Description. Método para obtener el callback cuando el timbrado fue exitoso.
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21
     * @param  {function} callback 
     * @return {void}
    **/
     getCallbackTimbradoExitoso()
     {
         return this.#callback_timbrado_exitoso;
     }
    /**
     * Description. Método para obtener el objeto CFDI.
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-23
     * @return {string}
    **/
    getCfdi()
    {
        return this.#cfdi;
    } 
    /**
     * Description. Método para obtener el array de errores.
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-04-02
     * @return {array}
    **/
    getErrores()
    {
        return this.#errores;
    }
    /**
     * Description. Método para establecer el CFDI, útil cuando se guarda un borrador y tiempo después se quiere retomar para timbrar.
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21
     * @param  {object} cfdi 
     * @return {void}
    **/
    setCfdi(cfdi)
    {
        //Comprobante
        this.establecerElementos(document,cfdi,".Comprobante");

        //Emisor
        if(cfdi["Emisor"]!=undefined)
        {
            this.establecerElementos(document,cfdi["Emisor"],".Emisor");
        }
        

        //Receptor
        if(cfdi["Receptor"]!=undefined)
        {
            this.establecerElementos(document,cfdi["Receptor"],".Receptor"); 
        }
        

        //Concepto
        if(cfdi["Conceptos"]!=undefined) 
        {
            document.getElementById("tbody_conceptos").innerHTML="";
            for(var i=0;i<cfdi["Conceptos"]["Concepto"].length;i++)
            {
                var fila = this.generar_fila_Concepto();
                document.getElementById("tbody_conceptos").insertAdjacentHTML('beforeend',fila);
                var Concepto = document.querySelectorAll('tr.Concepto');
                this.establecerElementos(Concepto[i],cfdi["Conceptos"]["Concepto"][i],".Concepto"); 


                if(cfdi["Conceptos"]["Concepto"][i]["Impuestos"]!=undefined && cfdi["Conceptos"]["Concepto"][i]["Impuestos"]["Traslados"]!=undefined && cfdi["Conceptos"]["Concepto"][i]["Impuestos"]["Traslados"]["Traslado"]!=undefined && cfdi["Conceptos"]["Concepto"][i]["Impuestos"]["Traslados"]["Traslado"].length>0)            {
                    for(var j=0;j<cfdi["Conceptos"]["Concepto"][i]["Impuestos"]["Traslados"]["Traslado"].length;j++)
                    {
                        this.establecerElementos(Concepto[i],cfdi["Conceptos"]["Concepto"][i]["Impuestos"]["Traslados"]["Traslado"][j],".Traslado");
                    } 
                }
                if(cfdi["Conceptos"]["Concepto"][i]["Impuestos"]!=undefined && cfdi["Conceptos"]["Concepto"][i]["Impuestos"]["Retenciones"]!=undefined && cfdi["Conceptos"]["Concepto"][i]["Impuestos"]["Retenciones"]["Retencion"]!=undefined && cfdi["Conceptos"]["Concepto"][i]["Impuestos"]["Retenciones"]["Retencion"].length>0)            {
                    for(var j=0;j<cfdi["Conceptos"]["Concepto"][i]["Impuestos"]["Retenciones"]["Retencion"].length;j++)
                    {
                        this.establecerElementos(Concepto[i],cfdi["Conceptos"]["Concepto"][i]["Impuestos"]["Retenciones"]["Retencion"][j],".Retencion");
                    } 
                }
            } 
        }

        this.validarDatos();
        this.eventos();
        this.change_Serie();
    } 
    /**
     * Description. Método para establecer el ambiente: sandbox | production
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2019-08-26
     * @param  {string} env ambiente sandbox | production
     * @return {void}
    **/
   setAmbiente(env)
   {
       this.#env=env;
   }
   
   /**
     * Description. Método para obtener el ambiente: sandbox | production
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2019-08-26
     * @param  {string} env ambiente sandbox | production
     * @return {void}
    **/
    getAmbiente()
    {
        return this.#env;
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
     * Description. Método para obtener la instancia de ConsumirApi para realizar peticiones al servidor
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2019-08-26
     * @param {void}
     * @return  {object} consumirApi instancia para conectarse con el servidor de la API de Fiscus CFDI
    **/
    getConsumirApi()
    {
        return this.#consumirApi;
    }

   /**
     * Description. Constructor de la clase, se manda llamar a la función que maneja los eventos: this.eventos()
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2019-08-22
   **/
   constructor()
   {
       this.#cfdi = this.clonar(this.#base_cfdi);
       this.clickHandlerAgregar_concepto = this.click_agregar_concepto.bind(this);
       this.changeHandlerConcepto=this.change_Concepto.bind(this);
       this.clickHandlerEliminarConcepto=this.click_EliminarConcepto.bind(this);
       this.changeHandlerSerie=this.change_Serie.bind(this);
       this.clickHandlerTimbrarCFDI=this.click_TimbrarCFDI.bind(this);
       this.clickHandlerDescargarPrefactura=this.click_DescargarPrefactura.bind(this);
       this.clickHandlerDescargarPDF=this.click_DescargarPDF.bind(this);
       this.clickHandlerDescargarXML=this.click_DescargarXML.bind(this);
       this.eventos();
       
       //Calculando Fecha
       var fecha = new Date();
       fecha=new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000)
       var temporal=fecha.toISOString();
       temporal = temporal.substring(0,10)+"T"+temporal.substring(11,19);
       const btns=document.querySelectorAll('.Comprobante[data-atributo="Fecha"]');
       btns.forEach(btn => btn.value=temporal);
   }
   /**
    * Description. Método para manejar los eventos al Timbrar un CFDI 3.3
    * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
    * @date   2019-08-22
   **/
   eventos()
   {
       var agregar_concepto=document.getElementById("agregar_concepto");
       if(agregar_concepto!=null)
       {
           agregar_concepto.removeEventListener("click",this.clickHandlerAgregar_concepto);
           agregar_concepto.addEventListener("click",this.clickHandlerAgregar_concepto);
       }

       var Serie = document.getElementById("Serie");
       if(Serie!=null)
       {
           Serie.removeEventListener("change",this.changeHandlerSerie);
           Serie.addEventListener("change",this.changeHandlerSerie);
       }       

       var Emisor=document.querySelectorAll('.Emisor[data-atributo="Rfc"]');
       for(let i = 0; i < Emisor.length; i++) {
           Emisor[i].removeEventListener("change", this.changeHandlerSerie);
           Emisor[i].addEventListener("change", this.changeHandlerSerie);
        }  

        var ConceptoEliminar = document.getElementsByClassName('ConceptoEliminar');
        for(let i = 0; i < ConceptoEliminar.length; i++) {
            ConceptoEliminar[i].removeEventListener("click", this.clickHandlerEliminarConcepto);
            ConceptoEliminar[i].addEventListener("click", this.clickHandlerEliminarConcepto);
        }     

        var InputConcepto = document.querySelectorAll('input.Concepto, select.Concepto, .Traslado .TasaOCuota, .Retencion .TasaOCuota');
        for(let i = 0; i < InputConcepto.length; i++) { 
            InputConcepto[i].removeEventListener("change", this.changeHandlerConcepto);
            InputConcepto[i].addEventListener("change", this.changeHandlerConcepto);
        }

        var DescargarPrefactura=document.getElementById("DescargarPrefactura");
        if(DescargarPrefactura!=null)
        {
            DescargarPrefactura.removeEventListener("click",this.clickHandlerDescargarPrefactura);
            DescargarPrefactura.addEventListener("click",this.clickHandlerDescargarPrefactura);
        }

        var TimbrarCFDI=document.getElementById("TimbrarCFDI");
        if(TimbrarCFDI!=null)
        {
            TimbrarCFDI.removeEventListener("click",this.clickHandlerTimbrarCFDI);
            TimbrarCFDI.addEventListener("click",this.clickHandlerTimbrarCFDI);
        }
        
        var descargar_pdf=document.getElementById("descargar_pdf");
        if(descargar_pdf!=null)
        {
            descargar_pdf.removeEventListener("click",this.clickHandlerDescargarPDF);
            descargar_pdf.addEventListener("click",this.clickHandlerDescargarPDF);
        }
        
        var descargar_xml=document.getElementById("descargar_xml");
        if(descargar_xml!=null)
        {
            descargar_xml.removeEventListener("click",this.clickHandlerDescargarXML);    
            descargar_xml.addEventListener("click",this.clickHandlerDescargarXML);     
        }   
   }
    /**
     * Description. Método para manejar el evento de descargar el XML.
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21 
     * @return {void}
    **/
   click_DescargarXML(){
        var xmlContent = this.b64toBlob(this.#contenido_xml, "Application/octet-stream");
        xmlContent = URL.createObjectURL(xmlContent);
        
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = xmlContent;
        a.download =  this.#uuid+".xml";
        a.click();
        document.body.removeChild(a);
    }
    /**
     * Description. Método para manejar el evento de descargar el PDF.
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21 
     * @return {void}
    **/
   click_DescargarPDF(){
        var xmlContent = this.b64toBlob(this.#contenido_pdf, "Application/pdf");
        xmlContent = URL.createObjectURL(xmlContent);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = xmlContent;
        a.download =  this.#uuid+".pdf";
        a.click();
        document.body.removeChild(a);
    }
    /**
     * Description. Método para manejar el evento del botón para descargar la Pre-factura.
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-04-08
     * @return {void}
    **/
    click_DescargarPrefactura()
    {
        this.deshabilitarBotonTimbrarCFDI();
        this.validarDatos();
        var Rfc = '';
        if(this.#cfdi["Emisor"]!=undefined && this.#cfdi["Emisor"]["Rfc"]!=undefined)
        {
            Rfc=this.#cfdi["Emisor"]["Rfc"];
        }
        var infoEmisor={
            "token":"",
            "json_cfdi":JSON.stringify(this.#cfdi), 
            "rfc_emisor":Rfc,
            "pdf":true
        };;
        this.#consumirApi.api_previsualizar_prefactura(infoEmisor, (datos)=>{
            //Respuesta del servidor
            var a = document.createElement("a");
            a.href = "data:application/pdf;base64,"+datos.json_respuesta.pdf;
            a.download = infoEmisor["rfc_emisor"] + '.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a); 
            this.habilitarBotonTimbrarCFDI();
        });
    }
    /**
     * Description. Método para manejar el evento del botón para timbrar el CFDI.
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21 
     * @return {void}
    **/
   click_TimbrarCFDI()
   {
       this.deshabilitarBotonTimbrarCFDI();
       this.validarDatos(); 
       if(this.#errores.length==0)
       {
           this.timbrar_cfdi();
       }    
   }   
   /**
     * Description. Método para deshabilitar el botón de Timbrar CFDI
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-04-02
     * @return {void}
    **/
   deshabilitarBotonTimbrarCFDI()
   {
       if(document.getElementById("TimbrarCFDI")!=null)
       {
           document.getElementById("TimbrarCFDI").disabled=true;
       }
       if(document.getElementById("DescargarPrefactura")!=null)
       {
           document.getElementById("DescargarPrefactura").disabled=true;
       }
   }
   /**
     * Description. Método para deshabilitar el botón de Timbrar CFDI
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-04-02
     * @return {void}
    **/
    habilitarBotonTimbrarCFDI()
    {
        if(document.getElementById("TimbrarCFDI")!=null)
        {
         document.getElementById("TimbrarCFDI").disabled=false;
        }
        if(document.getElementById("DescargarPrefactura")!=null)
        {
         document.getElementById("DescargarPrefactura").disabled=false;
        }
    }

   /**
     * Description. Método para manejar el evento de cambio de Serie: para obtener el folio consecutivo
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21 
     * @return {void}
    **/
   change_Serie()
   {
        var RFCEmisor="";
        const Emisor=document.querySelectorAll('.Emisor[data-atributo="Rfc"]');
        Emisor.forEach(e => RFCEmisor=e.value);

        var Serie = document.getElementById("Serie").value;
        if(RFCEmisor.length>0)
        {
            this.obtenerFolio(RFCEmisor, Serie);
        }
   }
   /**
     * Description. Método para manejar el evento de eliminar un concepto
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21 
     * @param {object} nodo
     * @return {void}
    **/
   click_EliminarConcepto(nodo)
   {
        var path=nodo.path;
        if(path!=undefined)
        {
            var row = path[0].parentNode.parentNode;
            if(row!=null && row.parentNode!=null)
            {
                row.parentNode.removeChild(row);
            } 
        } 
        this.validarDatos();
   }
   /**
     * Description. Método para manejar el evento de cambio de contenido de los input del Concepto
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21 
     * @return {void}
    **/
   change_Concepto()
   {
       this.validarDatos();
   }
   /**
     * Description. Método para manejar el evento de agregar un Concepto
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21 
     * @return {void}
    **/
   click_agregar_concepto()
   {
        this.nuevo_concepto();
        this.eventos();
   }
   /**
     * Description. Método para retornar el contenido de un Concepto (fila en la tabla)
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21 
     * @return {string}
    **/
   generar_fila_Concepto()
   {
       return '<tr class="Concepto"> <td> <span class="ConceptoEliminar">Eliminar</span> </td> <td> <input type="text" class="Concepto ClaveProdServ" data-atributo="ClaveProdServ" maxlength="8" minlength="8" value="" placeholder="Requerido" required=""> </td> <td> <input type="text" class="Concepto NoIdentificacion" data-atributo="NoIdentificacion" maxlength="100" value="" placeholder="Opcional"> </td> <td> <input type="text" class="Concepto Cantidad" data-atributo="Cantidad" maxlength="13" value="" placeholder="Requerido"> </td> <td> <select class="Concepto ClaveUnidad" data-atributo="ClaveUnidad"> <option value="H87">H87 - Pieza</option> <option value="EA">EA - Elemento</option> <option value="E48">E48 - Unidad de Servicio</option> <option value="ACT">ACT - Actividad</option> <option value="KGM">KGM - Kilogramo</option> <option value="E51">E51 - Trabajo</option> <option value="A9">A9 - Tarifa</option> <option value="MTR">MTR - Metro</option> <option value="AB">AB - Paquete a granel</option> <option value="BB">BB - Caja base</option> <option value="KT">KT - Kit</option> <option value="SET">SET - Conjunto</option> <option value="LTR">LTR - Litro</option> <option value="XBX">XBX - Caja</option> <option value="MON">MON - Mes </option> <option value="HUR">HUR - Hora</option> <option value="MTK">MTK - Metro cuadrado</option> <option value="11">11 - Equipos</option> <option value="MGM">MGM - Miligramo</option> <option value="XPK">XPK - Paquete</option> <option value="XKI">XKI - Kit (Conjunto de piezas)</option> <option value="AS">AS - Variedad</option> <option value="GRM">GRM - Gramo</option> <option value="PR">PR - Par</option> <option value="DPC">DPC - Docenas de piezas</option> <option value="xun">xun - Unidad</option> <option value="DAY">DAY - Día</option> <option value="XLT">XLT - Lote</option> <option value="10">10 - Grupos</option> <option value="MLT">MLT - Mililitro</option> <option value="E54">E54 - Viaje</option> <option value="ANN">ANN - Año</option> </select> </td> <td> <input type="text" class="Concepto Unidad" data-atributo="Unidad" maxlength="20" value="" placeholder="Opcional"> </td> <td> <input type="text" class="Concepto Descripcion" data-atributo="Descripcion" maxlength="1000" value="" placeholder="Requerido"> </td> <td> <input type="text" class="Concepto ValorUnitario" data-atributo="ValorUnitario" maxlength="13" value="" placeholder="Requerido" required=""> </td> <td> <input type="text" class="Concepto Importe" data-atributo="Importe" maxlength="25" value="" placeholder="Requerido" required=""> </td> <td> <input type="text" class="Concepto Descuento" data-atributo="Descuento" maxlength="25" value="" placeholder="Opcional"> </td> <td> <select class="Concepto ObjetoImp" data-atributo="ObjetoImp"> <option value="01">01 - No objeto de impuesto.</option> <option value="02" selected="">02 - Sí objeto de impuesto..</option> <option value="03">03 - Sí objeto del impuesto y no obligado al desglose.</option> </select> </td> <td> <div class="Traslado"> <input type="hidden" class="Traslado Base" data-atributo="Base" maxlength="25" value="" required="" placeholder=""> <select class="Traslado Impuesto" data-atributo="Impuesto" required=""> <option value="">Selecciona el Impuesto</option> <option value="001">ISR</option> <option value="002" selected="">IVA</option> <option value="003">IEPS</option> </select> <input type="hidden" class="Traslado TipoFactor" data-atributo="TipoFactor" value="Tasa" required="" placeholder=""> <input type="hidden" class="Traslado Importe" data-atributo="Importe" maxlength="25" value="" placeholder=""> <input type="text" class="Traslado TasaOCuota" data-atributo="TasaOCuota" maxlength="6" value="0.16" placeholder=""> </div> </td> <td> <div class="Retencion"> <input type="hidden" class="Retencion Base" data-atributo="Base" maxlength="25" value="" required="" placeholder=""> <input type="hidden" class="Retencion Impuesto" data-atributo="Impuesto" maxlength="25" required="" value="" placeholder=""> <input type="hidden" class="Retencion TipoFactor" data-atributo="TipoFactor" value="Tasa" required="" placeholder=""> <input type="hidden" class="Retencion Importe" data-atributo="Importe" maxlength="25" value="" required="" placeholder=""> <select class="Retencion Impuesto" data-atributo="Impuesto" required=""> <option value="">Selecciona el Impuesto</option> <option value="001">ISR</option> <option value="002">IVA</option> <option value="003">IEPS</option> </select> <input type="text" class="Retencion TasaOCuota" data-atributo="TasaOCuota" maxlength="6" value="" required="" placeholder=""> </div> </td> </tr>';
   } 
   /**
     * Description. Método para retornar el contenido de un Traslado 
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21 
     * @return {object}
    **/
   obtener_TrasladoConceptoBase()
   {
    var Traslado = {
        "Base":"",
        "Impuesto":"",
        "TipoFactor":"",
        "TasaOCuota":"",
        "Importe":""
    };
    return this.clonar(Traslado);
   }
   /**
     * Description. Método para retornar el contenido de una Retención 
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21 
     * @return {object}
    **/
   obtener_RetencionConceptoBase()
   {
    var Retencion = {
        "Base":"",
        "Impuesto":"",
        "TipoFactor":"",
        "TasaOCuota":"",
        "Importe":""
    };
    return this.clonar(Retencion);
   }
   /**
     * Description. Método para retornar el contenido de una Concepto 
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21 
     * @return {object}
    **/
   obtener_ConceptoBase()
   {
       var Concepto ={ 
            "Impuestos": {
            },
            "ClaveProdServ":"",
            "NoIdentificacion":"",
            "Cantidad":"",
            "ClaveUnidad":"",
            "Unidad":"",
            "Descripcion":"",
            "ValorUnitario":"",
            "Importe":"",
            "Descuento":"",
            "ObjetoImp":""
        };
        return this.clonar(Concepto);
   }
   /**
     * Description. Método para clonar un objeto. 
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21 
     * @param {object} obj
     * @return {object}
    **/
   clonar(obj) {
        if(obj == null || typeof(obj) != 'object')
            return obj;    
        var temp = new obj.constructor(); 
        for(var key in obj)
            temp[key] = this.clonar(obj[key]);    
        return temp;
    }
   /**
    * Description. Método para convertir un string en base64 en blob
    * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
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
    * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
    * @date   2019-08-22
   **/
   nuevo_concepto()
   {
        var fila = this.generar_fila_Concepto();
        document.getElementById("tbody_conceptos").insertAdjacentHTML('beforeend',fila);
   }
   /**
     * Description. Método para establecer (llenar) los campos de HTML con base en un objeto de Javascript 
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21 
     * @param {object} nodoPadre
     * @param {object} nodo
     * @param {string} nombreNodo
     * @param {int} indexNodo
     * @return {void}
    **/
   establecerElementos(nodoPadre, nodo, nombreNodo, indexNodo)
   {
        const keys_Comprobante = Object.keys(nodo);
        keys_Comprobante.forEach((key, index) => {
            if(this.esAtributo(nodo[key]))
            {
                var ComprobanteAtributos=nodoPadre.querySelectorAll(nombreNodo+'[data-atributo="'+key+'"]');
                if(indexNodo!=undefined && ComprobanteAtributos.length>0)
                {
                    var Temporal = [];
                    Temporal.push(ComprobanteAtributos[indexNodo].cloneNode(true));
                    ComprobanteAtributos=Temporal;
                }
                ComprobanteAtributos.forEach(atributo => {
                    atributo.value=nodo[key];
                });
            }
        });
   }
   /**
     * Description. Método para obtener los campos de HTML y llenarlos en un objeto de Javascript 
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21 
     * @param {object} nodoPadre
     * @param {object} nodo
     * @param {string} nombreNodo
     * @param {int} indexNodo
     * @return {object} Errores
    **/
   obtenerElementos(nodoPadre, nodo, nombreNodo, indexNodo)
   {
       var Errores = [];
       const keys_Comprobante = Object.keys(nodo);
       keys_Comprobante.forEach((key, index) => {
            if(this.esAtributo(nodo[key]))
            {
                var ComprobanteAtributos=nodoPadre.querySelectorAll(nombreNodo+'[data-atributo="'+key+'"]');
                if(indexNodo!=undefined && ComprobanteAtributos.length>0)
                {
                    var Temporal = [];
                    Temporal.push(ComprobanteAtributos[indexNodo].cloneNode(true));
                    ComprobanteAtributos=Temporal;
                }
                ComprobanteAtributos.forEach(atributo => {
                    nodo[key]=atributo.value.trim();
                    if(atributo.required && atributo.value=="")
                    {
                        Errores.push("El campo "+nombreNodo+"."+key+" es requerido");
                    }
                });
            }
        });
        return Errores;
   }
   /**
     * Description. Método para calcular los impuestos de cada Concepto 
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21 
     * @return {void} 
    **/
   calculoTrasladoRetencionConcepto()
   { 
        var Concepto = document.querySelectorAll("tr.Concepto");
        var ImporteImpuestoTraslado=0.0;
        var ImporteImpuestoRetencion=0.0;
        for(var i = 0;i<Concepto.length;i++)
        {
            var Descuento=0.0;
            var Importe = 0.0;
            var Cantidad=0.0;
            var ValorUnitario=0.0;
            var BaseImpuesto=0.0;

            Descuento=Concepto[i].querySelector('.Concepto .Descuento');
            if(Descuento!=null && Descuento!="")
            {
                Descuento=Descuento.value;
                Descuento=parseFloat(Descuento); 
            }
            else
            {
                Descuento=0.0;
            }
            if(isNaN(Descuento))
            {
                Descuento=0.0;
            }
            if(Concepto[i].querySelector('.Concepto .ClaveUnidad')!=null && Concepto[i].querySelector('.Concepto .Unidad')!=null)
            {
                Concepto[i].querySelector('.Concepto .Unidad').value=Concepto[i].querySelector('.Concepto .ClaveUnidad').value;
            } 

            Cantidad=Concepto[i].querySelector('.Concepto .Cantidad');
            if(Cantidad!=null)
            {
                Cantidad=Cantidad.value; 
            }
            Cantidad=parseFloat(Cantidad);
            if(isNaN(Cantidad))
            {
                Cantidad=0.0;
            }

            ValorUnitario=Concepto[i].querySelector('.Concepto .ValorUnitario').value; 
            ValorUnitario=parseFloat(ValorUnitario);
            if(isNaN(ValorUnitario))
            {
                ValorUnitario=0.0;
            }
              
            Importe = Cantidad * ValorUnitario;
            Importe = this.redondear(Importe);
            if(isNaN(Importe))
            {
                Importe=0.0;
            }

            Concepto[i].querySelector('.Concepto .Cantidad').value=Cantidad;
            Concepto[i].querySelector('.Concepto .ValorUnitario').value=ValorUnitario;
            Concepto[i].querySelector('.Concepto .Importe').value=Importe;
            if(Concepto[i].querySelector('.Concepto .Descuento')!=null)
            {
                Concepto[i].querySelector('.Concepto .Descuento').value=Descuento;
            }



            BaseImpuesto = parseFloat(Importe - Descuento);
            if(isNaN(BaseImpuesto))
            {
                BaseImpuesto=0.0;
            } 
            //Traslado
            if(Concepto[i].querySelector(".Traslado .TasaOCuota")!=null &&Concepto[i].querySelector(".Traslado .TasaOCuota").value!="")
            {   
                ImporteImpuestoTraslado = parseFloat(Concepto[i].querySelector('.Traslado .TasaOCuota').value) * BaseImpuesto;
                ImporteImpuestoTraslado=this.redondear(ImporteImpuestoTraslado);
                Concepto[i].querySelector('.Traslado .Base').value=BaseImpuesto;
                Concepto[i].querySelector('.Traslado .TipoFactor').value="Tasa";
                Concepto[i].querySelector('.Traslado .Importe').value=ImporteImpuestoTraslado;
            }
            
            //Retencion
            if(Concepto[i].querySelector(".Retencion .TasaOCuota")!=null && Concepto[i].querySelector(".Retencion .TasaOCuota").value!="")
            {
                ImporteImpuestoRetencion = parseFloat(Concepto[i].querySelector('.Retencion .TasaOCuota').value) * BaseImpuesto;
                ImporteImpuestoRetencion=this.redondear(ImporteImpuestoRetencion);
                Concepto[i].querySelector('.Retencion .Base').value=BaseImpuesto;   
                Concepto[i].querySelector('.Retencion .TipoFactor').value="Tasa";
                Concepto[i].querySelector('.Retencion .Importe').value=ImporteImpuestoRetencion;
            }    
        }
        this.mostrarDesgloseTotales(this.#cfdi);
   }
   /**
     * Description. Método para mostrar el desglose de totales: SubTotal, Descuento, TotalImpuestosTrasladados, TotalImpuestosRetenidos, Total 
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21 
     * @param {object} cfdi
     * @return {void} 
    **/
   mostrarDesgloseTotales(cfdi)
   {
        if(cfdi==undefined)
        {
            cfdi = this.#cfdi;
        }
        //Cálculo del desglose de Totales
        var SubTotal=0.0;
        var Descuento=0.0;
        var TotalImpuestosTrasladados=0.0;
        var TotalImpuestosRetenidos=0.0;
        var Total=0.0;
        if(cfdi.SubTotal!=undefined)
        {
            SubTotal=cfdi.SubTotal;
            this.redondear(SubTotal);
        }
        if(cfdi.Descuento!=undefined)
        {
            Descuento=cfdi.Descuento;
            this.redondear(Descuento);
        }
        if(cfdi.Impuestos!=undefined && cfdi.Impuestos.TotalImpuestosTrasladados!=undefined)
        {
            TotalImpuestosTrasladados=cfdi.Impuestos.TotalImpuestosTrasladados;
            this.redondear(TotalImpuestosTrasladados);
        }
        else
        {
            TotalImpuestosTrasladados=0.0; 
        }
        if(cfdi.Impuestos!=undefined && cfdi.Impuestos.TotalImpuestosRetenidos!=undefined)
        {
            TotalImpuestosRetenidos=cfdi.Impuestos.TotalImpuestosRetenidos;
            this.redondear(TotalImpuestosRetenidos);
        }
        else
        {
            TotalImpuestosRetenidos=0.0; 
        }
        if(cfdi.Total!=undefined)
        {
            Total=cfdi.Total;
            this.redondear(Total);
        }
        else
        {
            Total = 0.0;
        }

        if(document.getElementById("DesgloseTotales_Total")!=null)
        {
            document.getElementById("DesgloseTotales_SubTotal").innerHTML="$ "+this.numberWithCommas(SubTotal);
            document.getElementById("DesgloseTotales_Descuento").innerHTML="$ "+this.numberWithCommas(Descuento);
            document.getElementById("DesgloseTotales_ImpuestosTrasladados").innerHTML="$ "+this.numberWithCommas(TotalImpuestosTrasladados);
            document.getElementById("DesgloseTotales_ImpuestosRetenidos").innerHTML="$ "+this.numberWithCommas(TotalImpuestosRetenidos);
            document.getElementById("DesgloseTotales_Total").innerHTML="$ "+this.numberWithCommas(Total);
        }
   }
   /**
     * Description. Método para llenar el objeto que se enviará a la API de Fiscus CFDI para timbrar
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2019-08-26
     * @return {void}
    **/
   validarDatos()
   {
       document.getElementById("Errores").innerHTML="";
       var Errores = [];
       var Descuento=0.0;
       var TotalImpuestosRetenidos=0.0;
       var TotalImpuestosTrasladados=0.0;
       var Traslado=[];
       var Retencion=[];
       var SubTotal=0.0;
       var Total=0.0;


       this.#cfdi = this.clonar(this.#base_cfdi);
       //General 
        var ErroresComprobante = this.obtenerElementos(document,this.#cfdi, ".Comprobante");
        Errores=Errores.concat(ErroresComprobante);
        
       //Emisor
       var ErroresEmisor = this.obtenerElementos(document,this.#cfdi["Emisor"], ".Emisor");
       Errores=Errores.concat(ErroresEmisor);

       //Receptor
       var ErroresReceptor = this.obtenerElementos(document,this.#cfdi["Receptor"], ".Receptor");
       Errores=Errores.concat(ErroresReceptor);

       //Conceptos
       this.#cfdi["Conceptos"]["Concepto"]=[];
       this.calculoTrasladoRetencionConcepto();
       var Concepto = document.querySelectorAll("tr.Concepto");
       var ImporteImpuesto=0.0;
       for(var i = 0;i<Concepto.length;i++)
       {
           var item_concepto=this.obtener_ConceptoBase();
           var ErroresConcepto = this.obtenerElementos(document,item_concepto, ".Concepto",i);
           Errores=Errores.concat(ErroresConcepto);
           SubTotal+= this.redondear(parseFloat(item_concepto.Importe));
           if(item_concepto.Descuento!=undefined && item_concepto.Descuento!="")
           {
               Descuento+= this.redondear(parseFloat(item_concepto.Descuento));
           }
           item_concepto.Impuestos={
                "Traslados":{
                    "Traslado":[]
                },
                "Retenciones":{
                    "Retencion":[]
                }
            }
           
            //Traslado
           if(Concepto[i].querySelector(".Traslado .TasaOCuota")!=null &&Concepto[i].querySelector(".Traslado .TasaOCuota").value!="")
           {
               var Traslado = this.obtener_TrasladoConceptoBase();
               var ErroresTraslado = this.obtenerElementos(Concepto[i],Traslado, ".Traslado"); 
               Errores=Errores.concat(ErroresTraslado);
               item_concepto.Impuestos.Traslados={"Traslado":[]};
               item_concepto.Impuestos.Traslados.Traslado.push(Traslado);
           }
           else
           {
               item_concepto.Impuestos.Traslados=[];
           }
           
           //Retencion
           if(Concepto[i].querySelector(".Retencion .TasaOCuota")!=null && Concepto[i].querySelector(".Retencion .TasaOCuota").value!="")
           {
               var Retencion = this.obtener_RetencionConceptoBase();
               var ErroresRetencion = this.obtenerElementos(Concepto[i],Retencion, ".Retencion");
               Errores=Errores.concat(ErroresRetencion);
               item_concepto.Impuestos.Retenciones={"Retencion":[]};
               item_concepto.Impuestos.Retenciones.Retencion.push(Retencion);
           }
           else
           {
               item_concepto.Impuestos.Retenciones=[];
           }
           
           this.#cfdi["Conceptos"]["Concepto"].push(item_concepto);
       }
       
       //Impuestos
       this.traslados_root();
       this.retenciones_root(); 

       if(this.#cfdi.Impuestos.TotalImpuestosTrasladados!=undefined)
       {
           TotalImpuestosTrasladados=this.#cfdi.Impuestos.TotalImpuestosTrasladados;
       }
       if(this.#cfdi.Impuestos.TotalImpuestosRetenidos!=undefined)
       {
           TotalImpuestosRetenidos=this.#cfdi.Impuestos.TotalImpuestosRetenidos;
       }

        //Cálculo Final
        Total = parseFloat(SubTotal)-parseFloat(TotalImpuestosRetenidos)+parseFloat(TotalImpuestosTrasladados)-parseFloat(Descuento);
        Total = this.redondear(Total);  

        this.#cfdi["Descuento"]=this.redondear(Descuento);
        this.#cfdi["SubTotal"]=this.redondear(SubTotal);
        this.#cfdi["Total"]=this.redondear(Total); 

        if(this.#cfdi["Conceptos"]["Concepto"].length==0)
        {
            Errores.push("Debe agregar al menos un Concepto");
        }

        this.limpiar_cfdi(this.#cfdi);
        console.log(this.#cfdi); 
        console.log(Errores);

        if(Errores.length>0)
        {
           this.habilitarBotonTimbrarCFDI();
           document.getElementById("Errores").innerHTML=Errores.join('<br>');
        }
        this.#errores=Errores;

        //Comprobante
        this.establecerElementos(document,this.#cfdi,".Comprobante");

        this.mostrarDesgloseTotales(this.#cfdi);
    }
    /**
     * Description. Método para calcular los impuestos Globales Retenidos 
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21 
     * @return {void} 
    **/
    retenciones_root(){
        this.#cfdi.Impuestos.TotalImpuestosRetenidos = 0;
        this.#cfdi.Impuestos.Retenciones = {};
        this.#cfdi.Impuestos.Retenciones.Retencion = [];
    
        var claves_visitadas = [];      // Array para almacenar las claves de imuestos que ya han sido visitadas
    
        for(var i = 0; i < this.#cfdi.Conceptos.Concepto.length; i++){
          if (this.#cfdi.Conceptos.Concepto[i].Impuestos != undefined && this.#cfdi.Conceptos.Concepto[i].Impuestos.Retenciones != undefined && this.#cfdi.Conceptos.Concepto[i].Impuestos.Retenciones.Retencion != undefined) {
            for(var j = 0; j < this.#cfdi.Conceptos.Concepto[i].Impuestos.Retenciones.Retencion.length; j++){
              var impuestos_retenidos = this.#cfdi.Conceptos.Concepto[i].Impuestos.Retenciones.Retencion[j];
    
              var clave = impuestos_retenidos.Impuesto;      // Obtiene la clave del impuesto
              if (!claves_visitadas.includes(clave)) {
                // Si no existe se crea un elemento en el array con los datos de la retención
                claves_visitadas.push(clave);     // Agrega elemento a lista de claves visitadas
    
                // Copiar json de traslado por referencia y agregarlo a impuestos de la retención
                var traslado_concepto = this.clonar(this.#cfdi.Conceptos.Concepto[i].Impuestos.Retenciones.Retencion[j]);
                traslado_concepto.Importe=this.redondear(traslado_concepto.Importe);
                delete traslado_concepto.Base;
                delete traslado_concepto.TipoFactor; 
                delete traslado_concepto.TasaOCuota;
                this.#cfdi.Impuestos.Retenciones.Retencion.push(traslado_concepto);
              } else {
                // Si existe, suma el elemento se suma el importe al elemento cuyo clave de importe coincide con el examinado
                for (var k = 0; k < this.#cfdi.Impuestos.Retenciones.Retencion.length; k++) {
                  if (this.#cfdi.Impuestos.Retenciones.Retencion[k].Impuesto == clave) {
                    this.#cfdi.Impuestos.Retenciones.Retencion[k].Importe =  this.redondear(this.#cfdi.Impuestos.Retenciones.Retencion[k].Importe) +this.redondear(impuestos_retenidos.Importe);
                    this.#cfdi.Impuestos.Retenciones.Retencion[k].Importe=this.redondear(this.#cfdi.Impuestos.Retenciones.Retencion[k].Importe);
                  }
                }
              }
    
              this.#cfdi.Impuestos.TotalImpuestosRetenidos = this.redondear(this.#cfdi.Impuestos.TotalImpuestosRetenidos) + this.redondear(this.#cfdi.Conceptos.Concepto[i].Impuestos.Retenciones.Retencion[j].Importe);
            }
          }
    
        }    
        this.#cfdi.Impuestos.TotalImpuestosRetenidos = this.redondear(this.#cfdi.Impuestos.TotalImpuestosRetenidos);

        if (this.#cfdi.Impuestos.TotalImpuestosRetenidos == 0) {
          delete this.#cfdi.Impuestos.TotalImpuestosRetenidos;
        }    
        if(this.#cfdi.Impuestos.Retenciones.Retencion.length == 0){
          delete this.#cfdi.Impuestos.Retenciones;
        }    
        for (var i = 0; i < this.#cfdi.Conceptos.Concepto.length; i++) {
          if (this.#cfdi.Conceptos.Concepto[i].Impuestos.Retenciones ==undefined || Array.isArray(this.#cfdi.Conceptos.Concepto[i].Impuestos.Retenciones) || this.#cfdi.Conceptos.Concepto[i].Impuestos.Retenciones.Retencion.length == 0) {
            delete this.#cfdi.Conceptos.Concepto[i].Impuestos.Retenciones;
          }
        }
      }
        /**
         * Description. Método para calcular los impuestos Globales Trasladados 
         * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
         * @date   2022-03-21 
         * @return {void} 
        **/
      traslados_root(){
        this.#cfdi.Impuestos.TotalImpuestosTrasladados = 0;
        this.#cfdi.Impuestos.Traslados = {};
        this.#cfdi.Impuestos.Traslados.Traslado = [];
    
        var claves_visitadas = [];      // Array para almacenar las claves de impuestos que ya han sido visitadas
        
        for (var i = 0; i < this.#cfdi.Conceptos.Concepto.length; i++)
        {
            if(this.#cfdi.Conceptos.Concepto[i].Impuestos==undefined || this.#cfdi.Conceptos.Concepto[i].Impuestos.Traslados==undefined || Array.isArray(this.#cfdi.Conceptos.Concepto[i].Impuestos.Traslados))
            {
                break;
            }
            for (var j = 0; j < this.#cfdi.Conceptos.Concepto[i].Impuestos.Traslados.Traslado.length; j++)
            {
                var impuestos_trasladados = this.#cfdi.Conceptos.Concepto[i].Impuestos.Traslados.Traslado[j];
                var clave = impuestos_trasladados.Impuesto;      // Obtiene la clave del impuesto (ej. "002" => iva, "001"=>isr)
        
                if(!claves_visitadas.includes(clave))
                {
                    // Si no existe se crea un elemento en el array con los datos del traslado
                    claves_visitadas.push(clave);     // Agrega elemento a lista de claves visitadas
                    // Copiar json de traslado por referencia y agregarlo a impuestos trasladados
                    var traslado_concepto = this.clonar(this.#cfdi.Conceptos.Concepto[i].Impuestos.Traslados.Traslado[j]);
                    traslado_concepto.Importe=this.redondear(traslado_concepto.Importe);
                    traslado_concepto.Base=this.redondear(traslado_concepto.Base);
                    this.#cfdi.Impuestos.Traslados.Traslado.push(traslado_concepto);
                }
                else
                {
                    //checar que coincida el impuesto (ej. "002"=>iva) y luego checar que tenga la misma TasaOCuota (ej. 0.08 ó 0.16)
                    var index_traslado=-1;
                    for (var k = 0; k < this.#cfdi.Impuestos.Traslados.Traslado.length; k++)
                    {
                        if (this.#cfdi.Impuestos.Traslados.Traslado[k].Impuesto == clave && this.#cfdi.Impuestos.Traslados.Traslado[k].TasaOCuota==impuestos_trasladados.TasaOCuota)
                        {
                            index_traslado=k;
                            break;
                        }
                    }
                    if(index_traslado==-1)
                    {
                        //Si existe la clave de impuesto (ej. "002"=>iva), pero quizá tiene una TasaOCuota diferente (0.08 ó 0.16)
                        //  ->Hay que crear un nuevo nodo
                        // Copiar json de traslado por referencia y agregarlo a impuestos trasladados
                        var traslado_concepto = this.clonar(this.#cfdi.Conceptos.Concepto[i].Impuestos.Traslados.Traslado[j]);
                        traslado_concepto.Importe=this.redondear(traslado_concepto.Importe); 
                        traslado_concepto.Base=this.redondear(traslado_concepto.Base);
                        this.#cfdi.Impuestos.Traslados.Traslado.push(traslado_concepto);
                    }
                    else
                    {
                        // Si existe, suma el elemento se suma el importe al elemento cuyo clave de importe coincide con el examinado
                        this.#cfdi.Impuestos.Traslados.Traslado[index_traslado].Importe = this.redondear(this.#cfdi.Impuestos.Traslados.Traslado[index_traslado].Importe) + this.redondear(impuestos_trasladados.Importe);
                        this.#cfdi.Impuestos.Traslados.Traslado[index_traslado].Importe = this.redondear(this.#cfdi.Impuestos.Traslados.Traslado[index_traslado].Importe);
                        
                        this.#cfdi.Impuestos.Traslados.Traslado[index_traslado].Base = this.redondear(this.#cfdi.Impuestos.Traslados.Traslado[index_traslado].Base) + this.redondear(impuestos_trasladados.Base);
                        this.#cfdi.Impuestos.Traslados.Traslado[index_traslado].Base = this.redondear(this.#cfdi.Impuestos.Traslados.Traslado[index_traslado].Base);
                    }
        
                }
                this.#cfdi.Impuestos.TotalImpuestosTrasladados += this.redondear(this.#cfdi.Conceptos.Concepto[i].Impuestos.Traslados.Traslado[j].Importe);
            }
        }
        this.#cfdi.Impuestos.TotalImpuestosTrasladados = this.redondear(this.#cfdi.Impuestos.TotalImpuestosTrasladados);
    
        if(this.#cfdi.Impuestos.Traslados.Traslado.length == 0)
        {
          delete this.#cfdi.Impuestos.Traslados;
        }
    
        for (var i = 0; i < this.#cfdi.Conceptos.Concepto.length; i++)
        {
          if (this.#cfdi.Conceptos.Concepto[i].Impuestos.Traslados==undefined || Array.isArray(this.#cfdi.Conceptos.Concepto[i].Impuestos.Traslados) || this.#cfdi.Conceptos.Concepto[i].Impuestos.Traslados.Traslado.length == 0)
          {
            delete this.#cfdi.Conceptos.Concepto[i].Impuestos.Traslados; 
          }
        }
      }
  
    /**
     * Description. Método para saber si un objeto es atributo o es nodo
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21 
     * @param {object|string} input
     * @return {boolean} 
    **/
    esAtributo(input) {
        return input!=null && !Array.isArray(input) && typeof(input) !== 'object';
    }
   /**
     * Description. Método para limpiar el objeto de CFDI, las propiedades vacias se eliminan
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2019-08-26
     * @param {object} cfdi
     * @return {void}
    **/
   limpiar_cfdi(cfdi)
   {
        var self = this;
        var excluir_claves = ['TasaOCuota','Importe','TotalImpuestosTrasladados','SubTotal','Total', 'Emisor', 'Receptor'];  
        Object.keys(cfdi).forEach(function(clave){
        if(cfdi[clave] && typeof cfdi[clave] == 'object' && Object.keys(cfdi[clave]).length > 0){
            self.limpiar_cfdi(cfdi[clave]);
        }
        else if(typeof cfdi[clave] == 'object' && Object.keys(cfdi[clave]).length == 0){
            if(!excluir_claves.includes(clave))
            {
                delete cfdi[clave];
            }
        }
        else if(cfdi[clave] == null || cfdi[clave] == undefined || cfdi[clave] == '' || cfdi[clave] == 0){
            if(!excluir_claves.includes(clave))
            {
                delete cfdi[clave];
            }
        }
        });
   }
   /**
     * Description. Método para hacer la conexión a la API
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2019-08-26
     * @return {void}
    **/
   timbrar_cfdi()
   {
       var timbrar={
            "env":this.#env,
            "token":"-1",
            "cfdi": JSON.stringify(this.#cfdi)
        };
        document.getElementById("Errores").innerHTML="";
        this.#consumirApi.api_timbrar_cfdi(timbrar, (datos)=>{
            //Respuesta del servidor            
            if(datos!=null && "http_estatus" in datos && datos["http_estatus"]==202)  
            {
                document.getElementById("timbrar_cfdi").style.display="none";
                document.getElementById("descarga").style.visibility="visible";

                this.#contenido_pdf = datos["json_respuesta"]["pdf"];
                this.#contenido_xml = datos["json_respuesta"]["xml"];
                this.#uuid = datos["json_respuesta"]["uuid"];

                this.#callback_timbrado_exitoso(datos);
            }
            else
            {    
                document.getElementById("Errores").innerHTML=(datos!=null)?datos.mensaje:"No se pudo procesar la solicitud"; 
                if(!Array.isArray(datos.json_respuesta) && datos.json_respuesta!=null)
                {
                    document.getElementById("Errores").innerHTML=document.getElementById("Errores").innerHTML+" "+datos.json_respuesta.errores;
                }
            }
            this.habilitarBotonTimbrarCFDI();
        });
   }
   /**
     * Description. Método para redondear a dos decimales
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2019-08-26
     * @param {number} numero
     * @return {number} 
    **/
   redondear(numero) 
   {
       numero=(Math.round(numero * 100) / 100);
       numero=numero.toFixed(2);
       numero = parseFloat(numero);
       return numero;
   }
   /**
     * Description. Método para formatear con coma los números, ej. 1000 => 1,000
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2019-08-26
     * @param {number} x
     * @return {string} 
    **/
   numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
   }
   /**
     * Description. Método para hacer la conexión a la API, y obtener el Folio consecutivo
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21
     * @param {string} RFCEmisor
     * @param {string} Serie
     * @return {void}
    **/
   obtenerFolio(RFCEmisor, Serie)
   {
       var infoEmisor = {
           "env":this.#env,
           "token":"",
           "rfc":RFCEmisor,        
           //VARIABLES OPCIONALES
           "serie":Serie,
        };
        this.#consumirApi.api_obtener_folio(infoEmisor, (datos)=>{
            //Respuesta del servidor
            var Folio=1;
            if(datos.json_respuesta!=undefined)
            {
                if(datos.json_respuesta!=undefined && !Array.isArray(datos.json_respuesta))
                {
                    Folio=datos.json_respuesta.folio;
                }   
                else 
                {
                    //document.getElementById("Errores").innerHTML=JSON.stringify(datos);
                }
            }
            document.getElementById("Folio").value=Folio;
        });
   }    
}