'use strict';
/**
 * Description. Clase para manejar los eventos de Timbrar un CFDI del tipo "Complemento de pago 2.0" mediante la API de Fiscus CFDI
 * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
 * @date 2022-04-02
 * @version 1.0.0
 * @access public
 * @extends {TimbrarCFDI} 
 * @see ConsumirApi
 * @see TimbrarCFDI
 * @link https://fiscuscfdi.com/API_Facturacion/docs/
 */ 
class ComprobantePago20 extends TimbrarCFDI
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
            "ClaveProdServ":"84111506",
            "Cantidad":"1",
            "ClaveUnidad":"ACT",
            "Descripcion":"Pago",
            "ValorUnitario":"0",
            "Importe":"0",
            "ObjetoImp": "01"
          }
        ]},
        "Complemento":{
            "Pagos20": {
                "Totales": {
                  "MontoTotalPagos": 0
                },
                "Pago": [],
                "Version": "2.0" 
            }
        }, 
        "Version": "4.0",
        "Serie":"",
        "Folio": "",
        "Fecha": "",
        "Sello": "@",
        "NoCertificado": "",
        "Certificado": "@",
        "SubTotal": "0",
        "Moneda": "XXX",
        "Total": "0",
        "TipoDeComprobante": "P",
        "Exportacion":"01",
        "LugarExpedicion": "",
        "Confirmacion":""      
    };  
    #cfdi = {};
    #errores=[];


   /**
     * Description. Constructor de la clase, se manda llamar a la función que maneja los eventos: this.eventos()
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-04-02
   **/
   constructor()
   {
       super();
       this.#cfdi = this.clonar(this.#base_cfdi);
       this.clickHandlerAgregar_pago = this.click_agregar_pago.bind(this);
       this.clickHandlerEliminarPago=this.click_EliminarPago.bind(this);
       this.changeHandlerPago=this.change_Pago.bind(this); 
       this.clickHandlerDescargarPrefactura_ComplementoPago20=this.click_DescargarPrefactura_ComplementoPago20.bind(this);
       this.clickHandlerTimbrarCFDI_ComplementoPago20=this.click_TimbrarCFDI_ComplementoPago20.bind(this);
       this.eventos();

       //Calculando Fecha de Pago
       const f = new Date();
       f.setMinutes(f.getMinutes() - f.getTimezoneOffset());
       const btns=document.querySelectorAll('.Pago[data-atributo="FechaPago"]');
       btns.forEach(btn => btn.value = f.toISOString().slice(0,19));
   }
   /**
    * Description. Método para manejar los eventos al Timbrar un CFDI 3.3
    * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
    * @date   2019-08-22
   **/
    eventos()
    {
        super.eventos(); 
        var agregar_pago=document.getElementById("agregar_pago");
        if(agregar_pago!=null)
        {
            agregar_pago.removeEventListener("click",this.clickHandlerAgregar_pago);
            agregar_pago.addEventListener("click",this.clickHandlerAgregar_pago);
        }

        var PagoEliminar = document.getElementsByClassName('PagoEliminar'); 
        for(let i = 0; i < PagoEliminar.length; i++) {
            PagoEliminar[i].removeEventListener("click", this.clickHandlerEliminarPago);
            PagoEliminar[i].addEventListener("click", this.clickHandlerEliminarPago);
        } 

        var InputPago = document.querySelectorAll('input.Pago, input.DoctoRelacionado, select.Pago, select.DoctoRelacionado, .TrasladoP .TasaOCuotaP, .RetencionP .TasaOCuotaP');
        for(let i = 0; i < InputPago.length; i++) { 
            InputPago[i].removeEventListener("change", this.changeHandlerPago);
            InputPago[i].addEventListener("change", this.changeHandlerPago);
        }

        var DescargarPrefactura=document.getElementById("DescargarPrefactura_ComplementoPago20");
        if(DescargarPrefactura!=null)
        {
            DescargarPrefactura.removeEventListener("click",this.clickHandlerDescargarPrefactura_ComplementoPago20);
            DescargarPrefactura.addEventListener("click",this.clickHandlerDescargarPrefactura_ComplementoPago20);
        }

        var TimbrarCFDI_ComplementoPago20=document.getElementById("TimbrarCFDI_ComplementoPago20");
        if(TimbrarCFDI_ComplementoPago20!=null)
        {
            TimbrarCFDI_ComplementoPago20.removeEventListener("click",this.clickHandlerTimbrarCFDI_ComplementoPago20);
            TimbrarCFDI_ComplementoPago20.addEventListener("click",this.clickHandlerTimbrarCFDI_ComplementoPago20);
        }
    }
    /**
     * Description. Método para establecer un Pago 
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-04-04
     * @param  {object} cfdi 
     * @param  {boolean} agregar_fila 
     * @return {void}
    **/
     setCfdiPago(cfdi, agregar_fila)
     {
        if(agregar_fila!=undefined && agregar_fila)
        {
            this.nuevo_pago();
        }
        //DoctoRelacionado
        var DoctoRelacionado = this.obtener_DoctoRelacionadoBase();
        if(cfdi["Complemento"]!=undefined && cfdi["Complemento"]["TimbreFiscalDigital"]!=undefined)
        {
            DoctoRelacionado["IdDocumento"]=cfdi["Complemento"]["TimbreFiscalDigital"]["UUID"];
        }
        if(cfdi["Moneda"]!=undefined)
        {
            DoctoRelacionado["MonedaDR"]=cfdi["Moneda"];
        }
        if(cfdi["Serie"]!=undefined)
        {
            DoctoRelacionado["Serie"]=cfdi["Serie"];
        }
        if(cfdi["Folio"]!=undefined)
        {
            DoctoRelacionado["Folio"]=cfdi["Folio"];
        }
        if(cfdi["Total"]!=undefined)
        {
            DoctoRelacionado["ImpSaldoAnt"]=cfdi["Total"]; 
        }

 
        //Pagos
        var Pago = document.querySelectorAll('tr.Pago');
        this.establecerElementos(Pago[Pago.length-1],DoctoRelacionado,".DoctoRelacionado");
        
        this.change_ImpPagado();
        this.validarDatosComplementoPago20();
        this.eventos();
     } 
    
    /**
     * Description. Método para manejar el evento de cambio de ImpPagado
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-04-04
     * @return {void}
    **/
    change_ImpPagado()
    {
        var ImpSaldoAnt=0;
        var ImpPagado=0;
        var ImpSaldoInsoluto=0;

        var Nodo_ImpSaldoAnt = null;
        var Nodo_ImpSaldoInsoluto = null; 

        const Nodo_ImpPagado=document.querySelectorAll('.ImpPagado[data-atributo="ImpPagado"]');
        Nodo_ImpPagado.forEach(e => {

            ImpPagado=e.value;
            ImpPagado=parseFloat(ImpPagado);
            ImpPagado=this.redondear(ImpPagado);
            if(isNaN(ImpPagado))
            { 
                ImpPagado=0;
            } 

            //ImpSaldoAnt
            Nodo_ImpSaldoAnt=e.parentNode.parentNode.querySelector('.ImpSaldoAnt[data-atributo="ImpSaldoAnt"]');
            if(Nodo_ImpSaldoAnt.value=="")
            {
                Nodo_ImpSaldoAnt.value=0;
                ImpSaldoAnt=0;
            }
            else
            {
                ImpSaldoAnt=Nodo_ImpSaldoAnt.value;
                ImpSaldoAnt=parseFloat(ImpSaldoAnt);
                ImpSaldoAnt=this.redondear(ImpSaldoAnt);
            }
            if(isNaN(ImpSaldoAnt))
            {
                ImpSaldoAnt=0;
            } 


            //ImpSaldoInsoluto
            Nodo_ImpSaldoInsoluto=e.parentNode.parentNode.querySelector('.ImpSaldoInsoluto[data-atributo="ImpSaldoInsoluto"]');
            ImpSaldoInsoluto=ImpSaldoAnt-ImpPagado;
            ImpSaldoInsoluto=parseFloat(ImpSaldoInsoluto);
            ImpSaldoInsoluto=this.redondear(ImpSaldoInsoluto);
            if(isNaN(ImpSaldoInsoluto))
            {
                ImpSaldoInsoluto=0;
            } 
            if(ImpSaldoInsoluto<0){ImpSaldoInsoluto=0;}
            Nodo_ImpSaldoInsoluto.value=ImpSaldoInsoluto; 
        });
    }
    /**
     * Description. Método para manejar el evento de cambio de contenido de los input del Pago
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21 
     * @return {void}
    **/
   change_Pago()
   {
       document.getElementById("Errores").innerHTML="";
       this.change_ImpPagado();
       this.validarDatosComplementoPago20(); 
   }
   /**
     * Description. Método para manejar el evento del botón para descargar la Pre-factura.
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-04-08
     * @return {void}
    **/
    click_DescargarPrefactura_ComplementoPago20()
    {
        this.deshabilitarBotonTimbrarCFDI();
        this.validarDatosComplementoPago20();
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
        this.getConsumirApi().api_previsualizar_prefactura(infoEmisor, (datos)=>{
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
    click_TimbrarCFDI_ComplementoPago20()
   {
       document.getElementById("Errores").innerHTML="";
       this.deshabilitarBotonTimbrarCFDI();
       this.validarDatos(); 

       if(super.getErrores().length==0)
       {
           var temporal_cfdi = super.getCfdi();
           this.#cfdi["Emisor"]=this.clonar(temporal_cfdi["Emisor"]);
           this.#cfdi["Receptor"]=this.clonar(temporal_cfdi["Receptor"]);
           this.#cfdi["LugarExpedicion"]=temporal_cfdi["LugarExpedicion"]; 

           this.validarDatosComplementoPago20();
           if(this.#errores.length==0) 
           {
               this.deshabilitarBotonTimbrarCFDI();
               this.timbrar_cfdiComplementoPago20();
           }
       }    
   }  
   /**
     * Description. Método para calcular los impuestos de cada Pago 
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-04-03
     * @return {void} 
    **/
    calculoTrasladoRetencionPago()
    { 
         var Pago = document.querySelectorAll("tr.Pago");
         var ImporteImpuestoTraslado=0.0;
         var ImporteImpuestoRetencion=0.0;
         var MontoTotalPagos=0.0;
         for(var i = 0;i<Pago.length;i++)
         {
            var BaseImpuesto=0.0;
            var Monto=0.0;
            var ImpPagado=0.0;
            var ObjetoImpDR="";
            var ImporteImpuestoTrasladoDR=0.0;


            ImpPagado=Pago[i].querySelector('.DoctoRelacionado .ImpPagado').value; 
            ImpPagado=parseFloat(ImpPagado);
            if(isNaN(ImpPagado))
            {
                ImpPagado=0.0;
            } 
            ImpPagado=this.redondear(ImpPagado);
            
            Monto=ImpPagado;
            Pago[i].querySelector('.Pago .Monto').value=Monto;

            MontoTotalPagos=MontoTotalPagos+Monto;
            MontoTotalPagos = this.redondear(MontoTotalPagos);
            
              
            BaseImpuesto = parseFloat(Monto);
            if(isNaN(BaseImpuesto))
            {
                BaseImpuesto=0.0;
            } 

            //DoctoRelacionado 
            ObjetoImpDR = Pago[i].querySelector('.DoctoRelacionado .ObjetoImpDR').value; 
            if(ObjetoImpDR=="02")
            {
                //DoctoRelacionado > ImpuestosDR
                //TrasladoDR
                if(Pago[i].querySelector(".TrasladoDR .TasaOCuotaDR")!=null && Pago[i].querySelector(".TrasladoDR .TasaOCuotaDR").value!="")
                {   
                    ImporteImpuestoTrasladoDR = parseFloat(Pago[i].querySelector('.TrasladoDR .TasaOCuotaDR').value) * BaseImpuesto;
                    ImporteImpuestoTrasladoDR=this.redondear(ImporteImpuestoTrasladoDR);
                    Pago[i].querySelector('.TrasladoDR .BaseDR').value=BaseImpuesto;
                    Pago[i].querySelector('.TrasladoDR .TipoFactorDR').value="Tasa"; 
                    Pago[i].querySelector('.TrasladoDR .ImporteDR').value=ImporteImpuestoTrasladoDR;
                }                   
                //RetencionDR
                if(Pago[i].querySelector(".RetencionDR .TasaOCuotaDR")!=null && Pago[i].querySelector(".RetencionDR .TasaOCuotaDR").value!="")
                {
                    ImporteImpuestoRetencionDR = parseFloat(Pago[i].querySelector('.RetencionDR .TasaOCuotaDR').value) * BaseImpuesto;
                    ImporteImpuestoRetencionDR=this.redondear(ImporteImpuestoRetencionDR);
                    Pago[i].querySelector('.RetencionDR .BaseDR').value=BaseImpuesto;
                    Pago[i].querySelector('.RetencionDR .TipoFactorDR').value="Tasa"; 
                    Pago[i].querySelector('.RetencionDR .ImporteDR').value=ImporteImpuestoRetencionDR;
                }
            }
            

            //Traslado
            if(Pago[i].querySelector(".TrasladoP .TasaOCuotaP")!=null && Pago[i].querySelector(".TrasladoP .TasaOCuotaP").value!="")
            {   
                ImporteImpuestoTraslado = parseFloat(Pago[i].querySelector('.TrasladoP .TasaOCuotaP').value) * BaseImpuesto;
                ImporteImpuestoTraslado=this.redondear(ImporteImpuestoTraslado);
                Pago[i].querySelector('.TrasladoP .BaseP').value=BaseImpuesto;
                Pago[i].querySelector('.TrasladoP .TipoFactorP').value="Tasa"; 
                Pago[i].querySelector('.TrasladoP .ImporteP').value=ImporteImpuestoTraslado;
            }

            //Retencion
            if(Pago[i].querySelector(".Retencion .ImporteP")!=null && Pago[i].querySelector(".Retencion .ImporteP").value!="")
            {
                Pago[i].querySelector('.Retencion .ImporteP').value=this.redondear(Pago[i].querySelector('.Retencion .ImporteP').value);
            }    
         }
         this.mostrarDesgloseTotales(this.#cfdi);
    }
    /**
     * Description. Método para llenar el objeto que se enviará a la API de Fiscus CFDI para timbrar
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2019-08-26
     * @return {void}
    **/
     validarDatosComplementoPago20()
     {
        document.getElementById("Errores").innerHTML="";
        var Errores = [];
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

        //Pago
        this.#cfdi["Complemento"]["Pagos20"]["Pago"]=[]; 
        this.calculoTrasladoRetencionPago();
        var Pago = document.querySelectorAll("tr.Pago");
        var ImporteImpuesto=0.0;
        for(var i = 0;i<Pago.length;i++)
        {
            var item_pago=this.obtener_PagoBase();
            var ErroresPago = this.obtenerElementos(document,item_pago, ".Pago",i);
            Errores=Errores.concat(ErroresPago);
            if(item_pago.FechaPago.length==16)
            {   
                item_pago.FechaPago=item_pago.FechaPago+":00"; 
            }
            
            item_pago.ImpuestosP={
                "RetencionesP":{
                    "RetencionP":[]
                },
                "TrasladosP":{
                    "TrasladoP":[]
                } 
            }
            //DoctoRelacionado
            var item_DoctoRelacionado = this.obtener_DoctoRelacionadoBase();
            var ErroresPago = this.obtenerElementos(Pago[i], item_DoctoRelacionado, ".DoctoRelacionado");
            item_pago.DoctoRelacionado=item_DoctoRelacionado;
            Errores=Errores.concat(ErroresPago);
            if(item_pago.DoctoRelacionado.ObjetoImpDR=="02")
            {
                //DoctoRelacionado > ImpuestosDR
                //TrasladoDR
                if(Pago[i].querySelector(".TrasladoDR .TasaOCuotaDR")!=null && Pago[i].querySelector(".TrasladoDR .TasaOCuotaDR").value!="")
                {   
                    var TrasladoDR = this.obtener_TrasladoDRDoctoRelacionadoBase();
                    var ErroresTraslado = this.obtenerElementos(Pago[i],TrasladoDR, ".TrasladoDR"); 
                    Errores=Errores.concat(ErroresTraslado);
                    item_DoctoRelacionado.ImpuestosDR.TrasladosDR={"TrasladoDR":[]};
                    item_DoctoRelacionado.ImpuestosDR.TrasladosDR.TrasladoDR.push(TrasladoDR);
                }   
                else
                {   
                    item_DoctoRelacionado.ImpuestosDR.TrasladosDR=[];
                }   
                
                //RetencionDR
                if(Pago[i].querySelector(".RetencionDR .TasaOCuotaP")!=null && Pago[i].querySelector(".RetencionDR .TasaOCuotaP").value!="")
                {   
                    var RetencionDR = this.obtener_RetencionDRDoctoRelacionadoBase();
                    var ErroresRetencion = this.obtenerElementos(Pago[i],RetencionDR, ".RetencionDR");
                    Errores=Errores.concat(ErroresRetencion);
                    item_pago.ImpuestosP.RetencionesDR={"RetencionDR":[]};
                    item_pago.ImpuestosP.RetencionesDR.RetencionDR.push(RetencionDR);
                }
                else
                {
                    item_pago.ImpuestosP.RetencionesDR=[];
                }
            }


            var TrasladoP_existe=false;
            var RetencionP_existe=false;
            //TrasladoP
            if(Pago[i].querySelector(".TrasladoP .TasaOCuotaP")!=null && Pago[i].querySelector(".TrasladoP .TasaOCuotaP").value!="")
            {   
                TrasladoP_existe=true;
                var TrasladoP = this.obtener_TrasladoPagoBase();
                var ErroresTraslado = this.obtenerElementos(Pago[i],TrasladoP, ".TrasladoP"); 
                Errores=Errores.concat(ErroresTraslado);
                item_pago.ImpuestosP.TrasladosP={"TrasladoP":[]};
                item_pago.ImpuestosP.TrasladosP.TrasladoP.push(TrasladoP);
            }   
            else
            {   
                item_pago.ImpuestosP.TrasladosP=[];
            }   
            
            //RetencionP
            if(Pago[i].querySelector(".RetencionP .TasaOCuotaP")!=null && Pago[i].querySelector(".RetencionP .TasaOCuotaP").value!="")
            {   
                RetencionP_existe=true;
                var RetencionP = this.obtener_RetencionPagoBase();
                var ErroresRetencion = this.obtenerElementos(Pago[i],RetencionP, ".RetencionP");
                Errores=Errores.concat(ErroresRetencion);
                item_pago.ImpuestosP.RetencionesP={"RetencionP":[]};
                item_pago.ImpuestosP.RetencionesP.RetencionP.push(RetencionP);
            }
            else
            {
                item_pago.ImpuestosP.RetencionesP=[];
            }
            //Eliminando el nodo ImpuestosP 
            if(!TrasladoP_existe && !RetencionP_existe)
            {
                delete item_pago.ImpuestosP;
            }
            
            this.#cfdi["Complemento"]["Pagos20"]["Pago"].push(item_pago); 
        }
         
        this.mostrarDesgloseTotalesComplementoPago20(this.#cfdi);
          
        this.limpiar_cfdi(this.#cfdi);
        console.log(this.#cfdi);
        console.log(Errores);

        if(this.#cfdi["Complemento"]["Pagos20"]["Pago"].length==0)
        {
            Errores.push("Debe agregar al menos un Pago"); 
        }
  
          if(Errores.length>0)
          {
              this.habilitarBotonTimbrarCFDI();
              document.getElementById("Errores").innerHTML=document.getElementById("Errores").innerHTML+Errores.join('<br>');
          }
          this.#errores=Errores;
    }

    /**
     * Description. Método para hacer la conexión a la API y timbrar el complemento de pago 2.0
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2019-08-26
     * @return {void}
    **/
   timbrar_cfdiComplementoPago20()
   {
       var timbrar={
            "env":this.getAmbiente(),
            "token":"-1",
            "cfdi": JSON.stringify(this.#cfdi)
        };
        document.getElementById("Errores").innerHTML="";
        this.getConsumirApi().api_timbrar_cfdi(timbrar, (datos)=>{
            //Respuesta del servidor            
            if(datos!=null && "http_estatus" in datos && datos["http_estatus"]==202)  
            {
                document.getElementById("timbrar_cfdi").style.display="none";
                document.getElementById("descarga").style.visibility="visible";

                this.setContenido_pdf(datos["json_respuesta"]["pdf"]);
                this.setContenido_xml(datos["json_respuesta"]["xml"]); 
                this.setUuid(datos["json_respuesta"]["uuid"]); 

                var callback=this.getCallbackTimbradoExitoso();
                callback(datos);
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
     * Description. Método para mostrar el desglose de totales: SubTotal, Descuento, TotalImpuestosTrasladados, TotalImpuestosRetenidos, Total 
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21 
     * @param {object} cfdi
     * @return {void} 
    **/
    mostrarDesgloseTotalesComplementoPago20(cfdi)
    {
            if(cfdi==undefined)
            {
                cfdi = this.#cfdi;
            }
            var TotalTrasladosBaseIVA16=0.0;
            var TotalTrasladosImpuestoIVA16=0.0; 
            var MontoTotalPagos=0.0;
            for(var i=0;i<cfdi["Complemento"]["Pagos20"]["Pago"].length;i++)
            {
                var Monto = parseFloat(cfdi["Complemento"]["Pagos20"]["Pago"][i]["Monto"]);
                if(isNaN(Monto))
                {
                    Monto=0.0; 
                }
                MontoTotalPagos=MontoTotalPagos + Monto;
                MontoTotalPagos=this.redondear(MontoTotalPagos);

                if(cfdi["Complemento"]["Pagos20"]["Pago"][i]["ImpuestosP"]!=undefined && cfdi["Complemento"]["Pagos20"]["Pago"][i]["ImpuestosP"]["TrasladosP"]!=undefined && cfdi["Complemento"]["Pagos20"]["Pago"][i]["ImpuestosP"]["TrasladosP"]["TrasladoP"]!=undefined)
                {
                    var temporal = parseFloat(cfdi["Complemento"]["Pagos20"]["Pago"][i]["ImpuestosP"]["TrasladosP"]["TrasladoP"][0]["ImporteP"]);
                    if(isNaN(temporal))
                    {
                        temporal=0.0;
                    }
                    TotalTrasladosImpuestoIVA16=TotalTrasladosImpuestoIVA16+temporal; 

                    
                    var temporal_TotalTrasladosBaseIVA16 = parseFloat(cfdi["Complemento"]["Pagos20"]["Pago"][i]["ImpuestosP"]["TrasladosP"]["TrasladoP"][0]["BaseP"]);
                    if(isNaN(temporal_TotalTrasladosBaseIVA16))
                    {
                        temporal_TotalTrasladosBaseIVA16=0.0;
                    }
                    TotalTrasladosBaseIVA16=TotalTrasladosBaseIVA16+temporal_TotalTrasladosBaseIVA16;  
                }
            }

            //Totales
            cfdi["Complemento"]["Pagos20"]["Totales"]={
                "TotalTrasladosBaseIVA16":TotalTrasladosBaseIVA16,
                "TotalTrasladosImpuestoIVA16":TotalTrasladosImpuestoIVA16,
                "MontoTotalPagos":MontoTotalPagos
            };

            
            if(document.getElementById("MontoTotalPagos")!=null)
            {
                document.getElementById("MontoTotalPagos").value=MontoTotalPagos;
                document.getElementById("TotalTrasladosImpuestoIVA16").value=TotalTrasladosImpuestoIVA16;
            }
    }
    /**
     * Description. Método para retornar el contenido de un TrasladoDR
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21 
     * @return {object}
    **/
     obtener_TrasladoDRDoctoRelacionadoBase()
     {
         var TrasladoDR = {
             "BaseDR":"",
             "ImpuestoDR":"",
             "TipoFactorDR":"",
             "TasaOCuotaDR":"",
             "ImporteDR":""
         };
         return this.clonar(TrasladoDR);
     }
    /**
     * Description. Método para retornar el contenido de un TrasladoP
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21 
     * @return {object}
    **/
    obtener_TrasladoPagoBase()
    {
        var TrasladoP = {
            "BaseP":"",
            "ImpuestoP":"",
            "TipoFactorP":"",
            "TasaOCuotaP":"",
            "ImporteP":""
        };
        return this.clonar(TrasladoP);
    }
    /**
     * Description. Método para retornar el contenido de una RetencionDR
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21 
     * @return {object}
    **/
    obtener_RetencionDRDoctoRelacionadoBase()
   {
        var RetencionDR = {
            "BaseDR":"",
            "ImpuestoDR":"",
            "TipoFactorDR":"",
            "TasaOCuotaDR":"",
            "ImporteDR":"" 
        };
        return this.clonar(RetencionDR);
   }
    /**
     * Description. Método para retornar el contenido de una RetenciónP
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21 
     * @return {object}
    **/
   obtener_RetencionPagoBase()
   {
        var RetencionP = {
            "ImpuestoP":"",
            "ImporteP":""
        };
        return this.clonar(RetencionP);
   }
   /**
     * Description. Método para deshabilitar el botón de Timbrar CFDI
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-04-02
     * @return {void}
    **/
    deshabilitarBotonTimbrarCFDI()
    {
        if(document.getElementById("TimbrarCFDI_ComplementoPago20")!=null)
        {
         document.getElementById("TimbrarCFDI_ComplementoPago20").disabled=true;
        }
        if(document.getElementById("DescargarPrefactura_ComplementoPago20")!=null)
       {
           document.getElementById("DescargarPrefactura_ComplementoPago20").disabled=true;
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
         if(document.getElementById("TimbrarCFDI_ComplementoPago20")!=null)
         {
          document.getElementById("TimbrarCFDI_ComplementoPago20").disabled=false;
         }
         if(document.getElementById("DescargarPrefactura_ComplementoPago20")!=null)
       {
           document.getElementById("DescargarPrefactura_ComplementoPago20").disabled=false; 
       }
     }
    /**
     * Description. Método para manejar el evento de eliminar un concepto
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21 
     * @param {object} nodo
     * @return {void}
    **/
   click_EliminarPago(nodo)
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
     * Description. Método para manejar el evento de agregar un Concepto
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21 
     * @return {void}
    **/
    click_agregar_pago()
    {
        this.nuevo_pago();
        this.eventos();
    } 
    /** 
    * Description. Método para agregar una nueva fila de CONCEPTO
    * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
    * @date   2019-08-22
   **/
   nuevo_pago()
   {
        var fila = this.generar_fila_Pago();
        document.getElementById("tbody_pago").insertAdjacentHTML('beforeend',fila);

        
        //Calculando Fecha de Pago
        var Pago = document.querySelectorAll("tr.Pago");
        const f = new Date();
        f.setMinutes(f.getMinutes() - f.getTimezoneOffset());
        const btns=document.querySelectorAll('.Pago[data-atributo="FechaPago"]');
        var contador = 0;
        btns.forEach(btn =>{ 
            if(contador==Pago.length-1)
            {
                btn.value = f.toISOString().slice(0,19);
            }
            contador++;
        });
   }
   /**
     * Description. Método para retornar el contenido de una Retención 
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21 
     * @return {object}
    **/
    obtener_PagoBase()
    {
        var Pago = { 
            "DoctoRelacionado": [],
            "FechaPago": "",
            "FormaDePagoP": "",
            "MonedaP": "",
            "TipoCambioP":"", 
            "Monto": ""
        };
        return this.clonar(Pago);
    }
    /**
     * Description. Método para retornar el contenido de un DoctoRelacionadoBase 
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21 
     * @return {object}
    **/
    obtener_DoctoRelacionadoBase()
    {
        var DoctoRelacionado = {
            "ImpuestosDR": {
            },
            "IdDocumento": "",
            "MonedaDR": "",
            "EquivalenciaDR":"1",
            "Serie": "",
            "Folio": "",
            "NumParcialidad": "",
            "ImpSaldoAnt": "",
            "ImpSaldoInsoluto": "",
            "ImpPagado": "",
            "ObjetoImpDR": "01"
        };
        return this.clonar(DoctoRelacionado);
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
     * Description. Método para retornar el contenido de un Concepto (fila en la tabla)
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-03-21 
     * @return {string}
    **/
    generar_fila_Pago() 
    {
        return '<tr class="Pago DoctoRelacionado"> <td> <span class="PagoEliminar">Eliminar</span> </td> <td> <div> <span>IdDocumento</span> <input type="text" class="DoctoRelacionado IdDocumento" data-atributo="IdDocumento" maxlength="36" value="" placeholder="Requerido" required=""> </div> <div> <span>Serie</span> <input type="text" class="DoctoRelacionado Serie" data-atributo="Serie" maxlength="25" value="" placeholder="Opcional"> </div> <div> <span>Folio</span> <input type="text" class="DoctoRelacionado Folio" data-atributo="Folio" maxlength="40" value="" placeholder="Opcional"> </div> <div> <span>MonedaDR</span> <select class="DoctoRelacionado" data-atributo="MonedaDR" required=""> <option value="AED">AED - Dirham de EAU</option> <option value="AFN">AFN - Afghani</option> <option value="ALL">ALL - Lek</option> <option value="AMD">AMD - Dram armenio</option> <option value="ANG">ANG - Florín antillano neerlandés</option> <option value="AOA">AOA - Kwanza</option> <option value="ARS">ARS - Peso Argentino</option> <option value="AUD">AUD - Dólar Australiano</option> <option value="AWG">AWG - Aruba Florin</option> <option value="AZN">AZN - Azerbaijanian Manat</option> <option value="BAM">BAM - Convertibles marca</option> <option value="BBD">BBD - Dólar de Barbados</option> <option value="BDT">BDT - Taka</option> <option value="BGN">BGN - Lev búlgaro</option> <option value="BHD">BHD - Dinar de Bahrein</option> <option value="BIF">BIF - Burundi Franc</option> <option value="BMD">BMD - Dólar de Bermudas</option> <option value="BND">BND - Dólar de Brunei</option> <option value="BOB">BOB - Boliviano</option> <option value="BOV">BOV - Mvdol</option> <option value="BRL">BRL - Real brasileño</option> <option value="BSD">BSD - Dólar de las Bahamas</option> <option value="BTN">BTN - Ngultrum</option> <option value="BWP">BWP - Pula</option> <option value="BYR">BYR - Rublo bielorruso</option> <option value="BZD">BZD - Dólar de Belice</option> <option value="CAD">CAD - Dolar Canadiense</option> <option value="CDF">CDF - Franco congoleño</option> <option value="CHE">CHE - WIR Euro</option> <option value="CHF">CHF - Franco Suizo</option> <option value="CHW">CHW - Franc WIR</option> <option value="CLF">CLF - Unidad de Fomento</option> <option value="CLP">CLP - Peso chileno</option> <option value="CNY">CNY - Yuan Renminbi</option> <option value="COP">COP - Peso Colombiano</option> <option value="COU">COU - Unidad de Valor real</option> <option value="CRC">CRC - Colón costarricense</option> <option value="CUC">CUC - Peso Convertible</option> <option value="CUP">CUP - Peso Cubano</option> <option value="CVE">CVE - Cabo Verde Escudo</option> <option value="CZK">CZK - Corona checa</option> <option value="DJF">DJF - Franco de Djibouti</option> <option value="DKK">DKK - Corona danesa</option> <option value="DOP">DOP - Peso Dominicano</option> <option value="DZD">DZD - Dinar argelino</option> <option value="EGP">EGP - Libra egipcia</option> <option value="ERN">ERN - Nakfa</option> <option value="ETB">ETB - Birr etíope</option> <option value="EUR">EUR - Euro</option> <option value="FJD">FJD - Dólar de Fiji</option> <option value="FKP">FKP - Libra malvinense</option> <option value="GBP">GBP - Libra Esterlina</option> <option value="GEL">GEL - Lari</option> <option value="GHS">GHS - Cedi de Ghana</option> <option value="GIP">GIP - Libra de Gibraltar</option> <option value="GMD">GMD - Dalasi</option> <option value="GNF">GNF - Franco guineano</option> <option value="GTQ">GTQ - Quetzal</option> <option value="GYD">GYD - Dólar guyanés</option> <option value="HKD">HKD - Dolar De Hong Kong</option> <option value="HNL">HNL - Lempira</option> <option value="HRK">HRK - Kuna</option> <option value="HTG">HTG - Gourde</option> <option value="HUF">HUF - Florín</option> <option value="IDR">IDR - Rupia</option> <option value="ILS">ILS - Nuevo Shekel Israelí</option> <option value="INR">INR - Rupia india</option> <option value="IQD">IQD - Dinar iraquí</option> <option value="IRR">IRR - Rial iraní</option> <option value="ISK">ISK - Corona islandesa</option> <option value="JMD">JMD - Dólar Jamaiquino</option> <option value="JOD">JOD - Dinar jordano</option> <option value="JPY">JPY - Yen</option> <option value="KES">KES - Chelín keniano</option> <option value="KGS">KGS - Som</option> <option value="KHR">KHR - Riel</option> <option value="KMF">KMF - Franco Comoro</option> <option value="KPW">KPW - Corea del Norte ganó</option> <option value="KRW">KRW - Won</option> <option value="KWD">KWD - Dinar kuwaití</option> <option value="KYD">KYD - Dólar de las Islas Caimán</option> <option value="KZT">KZT - Tenge</option> <option value="LAK">LAK - Kip</option> <option value="LBP">LBP - Libra libanesa</option> <option value="LKR">LKR - Rupia de Sri Lanka</option> <option value="LRD">LRD - Dólar liberiano</option> <option value="LSL">LSL - Loti</option> <option value="LYD">LYD - Dinar libio</option> <option value="MAD">MAD - Dirham marroquí</option> <option value="MDL">MDL - Leu moldavo</option> <option value="MGA">MGA - Ariary malgache</option> <option value="MKD">MKD - Denar</option> <option value="MMK">MMK - Kyat</option> <option value="MNT">MNT - Tugrik</option> <option value="MOP">MOP - Pataca</option> <option value="MRO">MRO - Ouguiya</option> <option value="MUR">MUR - Rupia de Mauricio</option> <option value="MVR">MVR - Rupia</option> <option value="MWK">MWK - Kwacha</option> <option selected="selected" value="MXN">MXN - Peso Mexicano</option> <option value="MXV">MXV - México Unidad de Inversión (UDI)</option> <option value="MYR">MYR - Ringgit malayo</option> <option value="MZN">MZN - Mozambique Metical</option> <option value="NAD">NAD - Dólar de Namibia</option> <option value="NGN">NGN - Naira</option> <option value="NIO">NIO - Córdoba Oro</option> <option value="NOK">NOK - Corona noruega</option> <option value="NPR">NPR - Rupia nepalí</option> <option value="NZD">NZD - Dólar de Nueva Zelanda</option> <option value="OMR">OMR - Rial omaní</option> <option value="PAB">PAB - Balboa</option> <option value="PEN">PEN - Nuevo Sol</option> <option value="PGK">PGK - Kina</option> <option value="PHP">PHP - Peso filipino</option> <option value="PKR">PKR - Rupia de Pakistán</option> <option value="PLN">PLN - Zloty</option> <option value="PYG">PYG - Guaraní</option> <option value="QAR">QAR - Qatar Rial</option> <option value="RON">RON - Leu rumano</option> <option value="RSD">RSD - Dinar serbio</option> <option value="RUB">RUB - Rublo ruso</option> <option value="RWF">RWF - Franco ruandés</option> <option value="SAR">SAR - Riyal saudí</option> <option value="SBD">SBD - Dólar de las Islas Salomón</option> <option value="SCR">SCR - Rupia de Seychelles</option> <option value="SDG">SDG - Libra sudanesa</option> <option value="SEK">SEK - Corona sueca</option> <option value="SGD">SGD - Dolar De Singapur</option> <option value="SHP">SHP - Libra de Santa Helena</option> <option value="SLL">SLL - Leona</option> <option value="SOS">SOS - Chelín somalí</option> <option value="SRD">SRD - Dólar de Suriname</option> <option value="SSP">SSP - Libra sudanesa Sur</option> <option value="STD">STD - Dobra</option> <option value="SVC">SVC - Colon El Salvador</option> <option value="SYP">SYP - Libra Siria</option> <option value="SZL">SZL - Lilangeni</option> <option value="THB">THB - Baht</option> <option value="TJS">TJS - Somoni</option> <option value="TMT">TMT - Turkmenistán nuevo manat</option> <option value="TND">TND - Dinar tunecino</option> <option value="TOP">TOP - Pa"anga</option> <option value="TRY">TRY - Lira turca</option> <option value="TTD">TTD - Dólar de Trinidad y Tobago</option> <option value="TWD">TWD - Nuevo dólar de Taiwán</option> <option value="TZS">TZS - Shilling tanzano</option> <option value="UAH">UAH - Hryvnia</option> <option value="UGX">UGX - Shilling de Uganda</option> <option value="USD">USD - Dolar americano</option> <option value="USN">USN - Dólar estadounidense (día siguiente)</option> <option value="UYI">UYI - Peso Uruguay en Unidades Indexadas (URUIURUI)</option> <option value="UYU">UYU - Peso Uruguayo</option> <option value="UZS">UZS - Uzbekistán Sum</option> <option value="VEF">VEF - Bolívar</option> <option value="VND">VND - Dong</option> <option value="VUV">VUV - Vatu</option> <option value="WST">WST - Tala</option> <option value="XAF">XAF - Franco CFA BEAC</option> <option value="XAG">XAG - Plata</option> <option value="XAU">XAU - Oro</option> <option value="XBA">XBA - Unidad de Mercados de Bonos Unidad Europea Composite (EURCO)</option> <option value="XBB">XBB - Unidad Monetaria de Bonos de Mercados Unidad Europea (UEM-6)</option> <option value="XBC">XBC - Mercados de Bonos Unidad Europea unidad de cuenta a 9 (UCE-9)</option> <option value="XBD">XBD - Mercados de Bonos Unidad Europea unidad de cuenta a 17 (UCE-17)</option> <option value="XCD">XCD - Dólar del Caribe Oriental</option> <option value="XDR">XDR - DEG (Derechos Especiales de Giro)</option> <option value="XOF">XOF - Franco CFA BCEAO</option> <option value="XPD">XPD - Paladio</option> <option value="XPF">XPF - Franco CFP</option> <option value="XPT">XPT - Platino</option> <option value="XSU">XSU - Sucre</option> <option value="XTS">XTS - Códigos reservados específicamente para propósitos de prueba</option> <option value="XUA">XUA - Unidad ADB de Cuenta</option> <option value="XXX">XXX - Los códigos asignados para las transacciones en que intervenga ninguna moneda</option> <option value="YER">YER - Rial yemení</option> <option value="ZAR">ZAR - Rand</option> <option value="ZMW">ZMW - Kwacha zambiano</option> <option value="ZWL">ZWL - Zimbabwe Dólar</option> </select> </div> <div> <span>EquivalenciaDR</span> <input type="text" class="DoctoRelacionado EquivalenciaDR" data-atributo="EquivalenciaDR" value="1" placeholder="Opcional"> </div> <div> <span>NumParcialidad</span> <input type="text" class="DoctoRelacionado NumParcialidad" data-atributo="NumParcialidad" value="1" placeholder="Requerido" required=""> </div> <div> <span>ImpSaldoAnt</span> <input type="text" class="DoctoRelacionado ImpSaldoAnt" data-atributo="ImpSaldoAnt" value="" placeholder="Requerido" required=""> </div> <div> <span>ImpPagado</span> <input type="text" class="DoctoRelacionado ImpPagado" data-atributo="ImpPagado" value="" placeholder="Requerido" required=""> </div> <div> <span>ImpSaldoInsoluto</span> <input type="text" class="DoctoRelacionado ImpSaldoInsoluto" data-atributo="ImpSaldoInsoluto" value="" placeholder="Requerido" required=""> </div> <div> <span>ObjetoImpDR</span> <select class="DoctoRelacionado ObjetoImpDR" data-atributo="ObjetoImpDR" required=""> <option value="01" selected="">01 - No objeto de impuesto.</option> <option value="02">02 - Sí objeto de impuesto..</option> <option value="03">03 - Sí objeto del impuesto y no obligado al desglose.</option> </select> </div> <div class="TrasladoDR"> <span>TrasladoDR</span> <input type="hidden" class="TrasladoDR BaseDR" data-atributo="BaseDR" maxlength="25" value="" required="" placeholder=""> <select class="TrasladoDR ImpuestoDR" data-atributo="ImpuestoDR" required=""> <option value="" selected="">Selecciona el Impuesto</option> <option value="001">ISR</option> <option value="002">IVA</option> <option value="003">IEPS</option> </select> <input type="hidden" class="TrasladoDR TipoFactorDR" data-atributo="TipoFactorDR" value="Tasa" required="" placeholder=""> <input type="hidden" class="TrasladoDR ImporteDR" data-atributo="ImporteDR" maxlength="25" value="" placeholder=""> <input type="text" class="TrasladoDR TasaOCuotaDR" data-atributo="TasaOCuotaDR" maxlength="6" value="" placeholder="Tasa ej. 0.16"> </div> <div class="RetencionDR"> <span>RetencionDR</span> <input type="hidden" class="RetencionDR BaseDR" data-atributo="BaseDR" maxlength="25" value="" required="" placeholder=""> <select class="RetencionDR ImpuestoDR" data-atributo="ImpuestoDR" required=""> <option value="">Selecciona el Impuesto</option> <option value="001">ISR</option> <option value="002">IVA</option> <option value="003">IEPS</option> </select> <input type="hidden" class="RetencionDR TipoFactorDR" data-atributo="TipoFactorDR" value="Tasa" required="" placeholder=""> <input type="hidden" class="RetencionDR ImporteDR" data-atributo="ImporteDR" maxlength="25" value="" placeholder=""> <input type="text" class="RetencionDR TasaOCuotaDR" data-atributo="TasaOCuotaDR" maxlength="6" value="" placeholder="Tasa ej. 0.04"> </div> </td> <td> <input type="datetime-local" class="Pago FechaPago" data-atributo="FechaPago" value="" placeholder="Requerido"> </td> <td> <select class="Pago FormaDePagoP" data-atributo="FormaDePagoP" required=""> <option value="01">01 - Efectivo</option> <option value="02">02 - Cheque nominativo</option> <option value="03">03 - Transferencia electrónica de fondos</option> <option value="04">04 - Tarjeta de crédito</option> <option value="05">05 - Monedero electrónico</option> <option value="06">06 - Dinero electrónico</option> <option value="08">08 - Vales de despensa</option> <option value="12">12 - Dación de pago</option> <option value="13">13 - Por subrogación</option> <option value="14">14 - Por consignación</option> <option value="15">15 - Condonación</option> <option value="17">17 - Compensación</option> <option value="23">23 - Novación</option> <option value="24">24 - Confusión</option> <option value="25">25 - Remisión de deuda</option> <option value="26">26 - Prescricpión o caducidad</option> <option value="27">27 - A satisfacción del acreedor</option> <option value="28">28 - Tarjeta de débito</option> <option value="29">29 - Tarjeta de serviccios</option> <option value="30">30 - Aplicación de anticipos</option> <option value="31">31 - Intermediario pagos</option> <option value="99">99 - Por definir</option> </select> </td> <td> <select class="Pago MonedaP" data-atributo="MonedaP" required=""> <option value="AED">AED - Dirham de EAU</option> <option value="AFN">AFN - Afghani</option> <option value="ALL">ALL - Lek</option> <option value="AMD">AMD - Dram armenio</option> <option value="ANG">ANG - Florín antillano neerlandés</option> <option value="AOA">AOA - Kwanza</option> <option value="ARS">ARS - Peso Argentino</option> <option value="AUD">AUD - Dólar Australiano</option> <option value="AWG">AWG - Aruba Florin</option> <option value="AZN">AZN - Azerbaijanian Manat</option> <option value="BAM">BAM - Convertibles marca</option> <option value="BBD">BBD - Dólar de Barbados</option> <option value="BDT">BDT - Taka</option> <option value="BGN">BGN - Lev búlgaro</option> <option value="BHD">BHD - Dinar de Bahrein</option> <option value="BIF">BIF - Burundi Franc</option> <option value="BMD">BMD - Dólar de Bermudas</option> <option value="BND">BND - Dólar de Brunei</option> <option value="BOB">BOB - Boliviano</option> <option value="BOV">BOV - Mvdol</option> <option value="BRL">BRL - Real brasileño</option> <option value="BSD">BSD - Dólar de las Bahamas</option> <option value="BTN">BTN - Ngultrum</option> <option value="BWP">BWP - Pula</option> <option value="BYR">BYR - Rublo bielorruso</option> <option value="BZD">BZD - Dólar de Belice</option> <option value="CAD">CAD - Dolar Canadiense</option> <option value="CDF">CDF - Franco congoleño</option> <option value="CHE">CHE - WIR Euro</option> <option value="CHF">CHF - Franco Suizo</option> <option value="CHW">CHW - Franc WIR</option> <option value="CLF">CLF - Unidad de Fomento</option> <option value="CLP">CLP - Peso chileno</option> <option value="CNY">CNY - Yuan Renminbi</option> <option value="COP">COP - Peso Colombiano</option> <option value="COU">COU - Unidad de Valor real</option> <option value="CRC">CRC - Colón costarricense</option> <option value="CUC">CUC - Peso Convertible</option> <option value="CUP">CUP - Peso Cubano</option> <option value="CVE">CVE - Cabo Verde Escudo</option> <option value="CZK">CZK - Corona checa</option> <option value="DJF">DJF - Franco de Djibouti</option> <option value="DKK">DKK - Corona danesa</option> <option value="DOP">DOP - Peso Dominicano</option> <option value="DZD">DZD - Dinar argelino</option> <option value="EGP">EGP - Libra egipcia</option> <option value="ERN">ERN - Nakfa</option> <option value="ETB">ETB - Birr etíope</option> <option value="EUR">EUR - Euro</option> <option value="FJD">FJD - Dólar de Fiji</option> <option value="FKP">FKP - Libra malvinense</option> <option value="GBP">GBP - Libra Esterlina</option> <option value="GEL">GEL - Lari</option> <option value="GHS">GHS - Cedi de Ghana</option> <option value="GIP">GIP - Libra de Gibraltar</option> <option value="GMD">GMD - Dalasi</option> <option value="GNF">GNF - Franco guineano</option> <option value="GTQ">GTQ - Quetzal</option> <option value="GYD">GYD - Dólar guyanés</option> <option value="HKD">HKD - Dolar De Hong Kong</option> <option value="HNL">HNL - Lempira</option> <option value="HRK">HRK - Kuna</option> <option value="HTG">HTG - Gourde</option> <option value="HUF">HUF - Florín</option> <option value="IDR">IDR - Rupia</option> <option value="ILS">ILS - Nuevo Shekel Israelí</option> <option value="INR">INR - Rupia india</option> <option value="IQD">IQD - Dinar iraquí</option> <option value="IRR">IRR - Rial iraní</option> <option value="ISK">ISK - Corona islandesa</option> <option value="JMD">JMD - Dólar Jamaiquino</option> <option value="JOD">JOD - Dinar jordano</option> <option value="JPY">JPY - Yen</option> <option value="KES">KES - Chelín keniano</option> <option value="KGS">KGS - Som</option> <option value="KHR">KHR - Riel</option> <option value="KMF">KMF - Franco Comoro</option> <option value="KPW">KPW - Corea del Norte ganó</option> <option value="KRW">KRW - Won</option> <option value="KWD">KWD - Dinar kuwaití</option> <option value="KYD">KYD - Dólar de las Islas Caimán</option> <option value="KZT">KZT - Tenge</option> <option value="LAK">LAK - Kip</option> <option value="LBP">LBP - Libra libanesa</option> <option value="LKR">LKR - Rupia de Sri Lanka</option> <option value="LRD">LRD - Dólar liberiano</option> <option value="LSL">LSL - Loti</option> <option value="LYD">LYD - Dinar libio</option> <option value="MAD">MAD - Dirham marroquí</option> <option value="MDL">MDL - Leu moldavo</option> <option value="MGA">MGA - Ariary malgache</option> <option value="MKD">MKD - Denar</option> <option value="MMK">MMK - Kyat</option> <option value="MNT">MNT - Tugrik</option> <option value="MOP">MOP - Pataca</option> <option value="MRO">MRO - Ouguiya</option> <option value="MUR">MUR - Rupia de Mauricio</option> <option value="MVR">MVR - Rupia</option> <option value="MWK">MWK - Kwacha</option> <option selected="selected" value="MXN">MXN - Peso Mexicano</option> <option value="MXV">MXV - México Unidad de Inversión (UDI)</option> <option value="MYR">MYR - Ringgit malayo</option> <option value="MZN">MZN - Mozambique Metical</option> <option value="NAD">NAD - Dólar de Namibia</option> <option value="NGN">NGN - Naira</option> <option value="NIO">NIO - Córdoba Oro</option> <option value="NOK">NOK - Corona noruega</option> <option value="NPR">NPR - Rupia nepalí</option> <option value="NZD">NZD - Dólar de Nueva Zelanda</option> <option value="OMR">OMR - Rial omaní</option> <option value="PAB">PAB - Balboa</option> <option value="PEN">PEN - Nuevo Sol</option> <option value="PGK">PGK - Kina</option> <option value="PHP">PHP - Peso filipino</option> <option value="PKR">PKR - Rupia de Pakistán</option> <option value="PLN">PLN - Zloty</option> <option value="PYG">PYG - Guaraní</option> <option value="QAR">QAR - Qatar Rial</option> <option value="RON">RON - Leu rumano</option> <option value="RSD">RSD - Dinar serbio</option> <option value="RUB">RUB - Rublo ruso</option> <option value="RWF">RWF - Franco ruandés</option> <option value="SAR">SAR - Riyal saudí</option> <option value="SBD">SBD - Dólar de las Islas Salomón</option> <option value="SCR">SCR - Rupia de Seychelles</option> <option value="SDG">SDG - Libra sudanesa</option> <option value="SEK">SEK - Corona sueca</option> <option value="SGD">SGD - Dolar De Singapur</option> <option value="SHP">SHP - Libra de Santa Helena</option> <option value="SLL">SLL - Leona</option> <option value="SOS">SOS - Chelín somalí</option> <option value="SRD">SRD - Dólar de Suriname</option> <option value="SSP">SSP - Libra sudanesa Sur</option> <option value="STD">STD - Dobra</option> <option value="SVC">SVC - Colon El Salvador</option> <option value="SYP">SYP - Libra Siria</option> <option value="SZL">SZL - Lilangeni</option> <option value="THB">THB - Baht</option> <option value="TJS">TJS - Somoni</option> <option value="TMT">TMT - Turkmenistán nuevo manat</option> <option value="TND">TND - Dinar tunecino</option> <option value="TOP">TOP - Pa"anga</option> <option value="TRY">TRY - Lira turca</option> <option value="TTD">TTD - Dólar de Trinidad y Tobago</option> <option value="TWD">TWD - Nuevo dólar de Taiwán</option> <option value="TZS">TZS - Shilling tanzano</option> <option value="UAH">UAH - Hryvnia</option> <option value="UGX">UGX - Shilling de Uganda</option> <option value="USD">USD - Dolar americano</option> <option value="USN">USN - Dólar estadounidense (día siguiente)</option> <option value="UYI">UYI - Peso Uruguay en Unidades Indexadas (URUIURUI)</option> <option value="UYU">UYU - Peso Uruguayo</option> <option value="UZS">UZS - Uzbekistán Sum</option> <option value="VEF">VEF - Bolívar</option> <option value="VND">VND - Dong</option> <option value="VUV">VUV - Vatu</option> <option value="WST">WST - Tala</option> <option value="XAF">XAF - Franco CFA BEAC</option> <option value="XAG">XAG - Plata</option> <option value="XAU">XAU - Oro</option> <option value="XBA">XBA - Unidad de Mercados de Bonos Unidad Europea Composite (EURCO)</option> <option value="XBB">XBB - Unidad Monetaria de Bonos de Mercados Unidad Europea (UEM-6)</option> <option value="XBC">XBC - Mercados de Bonos Unidad Europea unidad de cuenta a 9 (UCE-9)</option> <option value="XBD">XBD - Mercados de Bonos Unidad Europea unidad de cuenta a 17 (UCE-17)</option> <option value="XCD">XCD - Dólar del Caribe Oriental</option> <option value="XDR">XDR - DEG (Derechos Especiales de Giro)</option> <option value="XOF">XOF - Franco CFA BCEAO</option> <option value="XPD">XPD - Paladio</option> <option value="XPF">XPF - Franco CFP</option> <option value="XPT">XPT - Platino</option> <option value="XSU">XSU - Sucre</option> <option value="XTS">XTS - Códigos reservados específicamente para propósitos de prueba</option> <option value="XUA">XUA - Unidad ADB de Cuenta</option> <option value="XXX">XXX - Los códigos asignados para las transacciones en que intervenga ninguna moneda</option> <option value="YER">YER - Rial yemení</option> <option value="ZAR">ZAR - Rand</option> <option value="ZMW">ZMW - Kwacha zambiano</option> <option value="ZWL">ZWL - Zimbabwe Dólar</option> </select> </td> <td> <input type="text" class="Pago TipoCambioP" data-atributo="TipoCambioP" value="1" placeholder="Opcional"> </td> <td> <input type="text" class="Pago Monto" data-atributo="Monto" value="" placeholder="Requerido" required="" readonly="readonly"> </td> <td> <div class="TrasladoP"> <input type="hidden" class="TrasladoP BaseP" data-atributo="BaseP" maxlength="25" value="" required="" placeholder=""> <select class="TrasladoP ImpuestoP" data-atributo="ImpuestoP" required=""> <option value="" selected="">Selecciona el Impuesto</option> <option value="001">ISR</option> <option value="002">IVA</option> <option value="003">IEPS</option> </select> <input type="hidden" class="TrasladoP TipoFactorP" data-atributo="TipoFactorP" value="Tasa" required="" placeholder=""> <input type="hidden" class="TrasladoP ImporteP" data-atributo="ImporteP" maxlength="25" value="" placeholder=""> <input type="text" class="TrasladoP TasaOCuotaP" data-atributo="TasaOCuotaP" maxlength="6" value="" placeholder="Tasa ej. 0.16"> </div> </td> <td> <div class="RetencionP"> <input type="hidden" class="RetencionP ImporteP" data-atributo="ImporteP" maxlength="25" value="" required="" placeholder=""> <select class="RetencionP ImpuestoP" data-atributo="ImpuestoP" required=""> <option value="">Selecciona el Impuesto</option> <option value="001">ISR</option> <option value="002">IVA</option> <option value="003">IEPS</option> </select> </div> </td> <!-- <td> <input type="text" class="Pago NumOperacion" data-atributo="NumOperacion" maxlength="100" value="" placeholder="Opcional" readonly="readonly" > </td> <td> <input type="text" class="Pago RfcEmisorCtaOrd" data-atributo="RfcEmisorCtaOrd" maxlength="13" value="" placeholder="Opcional" readonly="readonly" > </td> <td> <input type="text" class="Pago NomBancoOrdExt" data-atributo="NomBancoOrdExt" maxlength="300" value="" placeholder="Opcional" readonly="readonly" > </td> <td> <input type="text" class="Pago CtaOrdenante" data-atributo="CtaOrdenante" maxlength="50" value="" placeholder="Opcional" readonly="readonly" > </td> <td> <input type="text" class="Pago RfcEmisorCtaBen" data-atributo="RfcEmisorCtaBen" maxlength="13" value="" placeholder="Opcional" readonly="readonly" > </td> <td> <input type="text" class="Pago CtaBeneficiario" data-atributo="CtaBeneficiario" maxlength="50" value="" placeholder="Opcional" readonly="readonly" > </td> <td> <select class="DoctoRelacionado TipoCadPago" data-atributo="TipoCadPago"> <option value="">Opcional</option> <option value="01">01 - SPEI.</option> </select> </td> <td> <input type="text" class="Pago CertPago" data-atributo="CertPago" maxlength="1000" value="" placeholder="Opcional" readonly="readonly" > </td> <td> <input type="text" class="Pago CadPago" data-atributo="CadPago" maxlength="8192" value="" placeholder="Opcional" readonly="readonly" > </td> <td> <input type="text" class="Pago SelloPago" data-atributo="SelloPago" maxlength="1000" value="" placeholder="Opcional" readonly="readonly" > </td> --> </tr>';
    }
    /**
     * Description. Método para limpiar el objeto de CFDI, las propiedades vacias se eliminan
     * @author Tecnología Globalbtek <Fiscus CFDI> globalbtek.com | app.fiscus.mx
     * @date   2022-04-03
     * @param {object} cfdi
     * @return {void}
    **/
   limpiar_cfdi(cfdi)
   {
        var self = this;
        var excluir_claves = ['TasaOCuota','ValorUnitario','Importe','SubTotal','Total','Emisor', 'Receptor','ImpSaldoAnt','ImpSaldoInsoluto'];
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
}