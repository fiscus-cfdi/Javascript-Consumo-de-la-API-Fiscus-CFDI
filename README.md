![Fiscus CFDI](https://app.fiscus.mx/assets/img/github/banner_2.jpg)

# INTRODUCCIÓN

Ejemplo de consumo de la API de [Fiscus CFDI](https://app.fiscus.mx) en **Javascript** para Facturar CFDI, notas de crédito, notas de cargo, nómina, comprobante de pago, complementos, addendas, etc.

## Credenciales

Para consumir la API es necesario primer obtener las credenciales correctas, para dar de alta tu cuenta en [Fiscus CFDI](https://app.fiscus.mx) sigue los siguientes pasos:

- **Paso 1.** Regístrate en [Fiscus CFDI](https://app.fiscus.mx) (y recibe 10 folios gratis) en la siguiente url: https://app.fiscus.mx/index.php/Registro.
  - ![Registro en Fiscus CFDI](https://app.fiscus.mx/assets/img/github/registro.png)

* **Paso 2.** Obtén las credenciales para poder consumir la API en: https://app.fiscus.mx/index.php/CuentaApi.
  - ![Credenciales para consumir API de Fiscus CFDI](https://app.fiscus.mx/assets/img/github/credenciales.png)

- **Paso 3.** Listo, ya puedes consumir la API de [Fiscus CFDI](https://app.fiscus.mx) y timbrar CFDI, notas de crédito, notas de cargo, nómina, comprobante de pago, complementos, addendas, etc.

# Importar 
Importar los archivos JS y CSS para poder crear los objetos disponibles para consumir la API:
```html
<link rel="stylesheet" type="text/css" href="./../dist/fiscuscfdi.1.0.0.min.css">
<script type="text/javascript" src="./../dist/fiscuscfdi.1.0.0.min.js"></script>
```
# MÉTODOS DISPONIBLES

## Agregar RFC

Antes de poder timbrar y cancelar facturas (CFDI), es necesario dar de alta el RFC (persona física/moral) para mayor detalle del método de agregar RFC consulta la [documentación](https://fiscuscfdi.com/API_Facturacion/docs/#operation/api_agregar_rfc).

El ejemplo para agregar un RFC está en la siguiente [liga](https://github.com/fiscus-cfdi/Javascript-Consumo-de-la-API-Fiscus-CFDI/blob/master/Fiscus_CFDI_AgregarRFC.html), reemplaza tu usuario y password con los que obtuviste en el paso 2. Para ambiente de pruebas envía el string "**sandbox**" al método setAmbiente, en caso de querer agregar el RFC en producción pasar el string "**production**" al mismo método (setAmbiente).

```javascript
var consumo_api = new ConsumirApi();
consumo_api.setUsuario("TU_USUARIO_VA_AQUÍ");
consumo_api.setPassword("TU_PASSWORD_VA_AQUÍ");

var altaRfc = new AltaRfc();
altaRfc.setAmbiente("sandbox");
altaRfc.setConsumirApi(consumo_api);
```

## Timbrar CFDI

Para poder timbrar un CFDI, primero debe darse de alta un RFC. El ejemplo para timbrar un CFDI está en la siguiente [liga](https://github.com/fiscus-cfdi/Javascript-Consumo-de-la-API-Fiscus-CFDI/blob/master/Fiscus_CFDI_Timbrar33.html). Para timbrar en ambiente de pruebas (no válidas ante el SAT) envía el string "**sandbox**" al método setAmbiente, en caso de querer timbrar en ambiente de producción (válidas ante el SAT) pasar el string "**production**" al mismo método (setAmbiente).

```javascript
var consumo_api = new ConsumirApi();
consumo_api.setUsuario("TU_USUARIO_VA_AQUÍ");
consumo_api.setPassword("TU_PASSWORD_VA_AQUÍ");

var timbrarCfdi = new TimbrarCFDI();
timbrarCfdi.setAmbiente("sandbox");
timbrarCfdi.setConsumirApi(consumo_api);
```

## Cancelar CFDI

Para cancelar un CFDI, primero tuvo que haber sido timbrado en la plataforma de Fiscus CFDI. El ejemplo para cancelar un CFDI está en la siguiente [liga](https://github.com/fiscus-cfdi/Javascript-Consumo-de-la-API-Fiscus-CFDI/blob/master/Fiscus_CFDI_CancelarCFDI.html). Para cancelar en ambiente de pruebas (el CFDI tuvo que haber sido timbrado también en éste ambiente) envía el string "**sandbox**" al método setAmbiente, en caso de querer cancelar en ambiente de producción (el CFDI tuvo que haber sido timbrado también en éste ambiente) pasar el string "**production**" al mismo método (setAmbiente).

```javascript
var consumo_api = new ConsumirApi();
consumo_api.setUsuario("TU_USUARIO_VA_AQUÍ");
consumo_api.setPassword("TU_PASSWORD_VA_AQUÍ");

var cancelarCFDI = new CancelarCFDI();
cancelarCFDI.setAmbiente("sandbox");
cancelarCFDI.setConsumirApi(consumo_api);
```

## Obtener Series de un RFC

Para poder generar una serie por medio de la [API de Fiscus CFDI](http://app.fiscus.mx/API_Facturacion/docs/) se necesita primero tener un número de serie relacionado a su RFC; Al llamar a este endpoint se le retornarán todos los números de serie asociados a su RFC y en caso de no tener ninguno se le asignará uno. El ejemplo para generar un número de serie está en la siguiente [liga](https://github.com/fiscus-cfdi/Javascript-Consumo-de-la-API-Fiscus-CFDI/blob/master/Fiscus_CFDI_ObtenerSeries.html).

```javascript
var consumo_api = new ConsumirApi();
consumo_api.setUsuario("TU_USUARIO_VA_AQUÍ");
consumo_api.setPassword("TU_PASSWORD_VA_AQUÍ");

var obtener_series = new ObtenerSeries();
obtener_series.setAmbiente("sandbox");
obtener_series.setConsumirApi(consumo_api);
```

## Agregar Cuenta

Desde la api se pueden dar de alta cuentas especificando un correo válido y una contraseña. El ejemplo para agregar cuentas esta en la siguiente [liga](https://github.com/fiscus-cfdi/Javascript-Consumo-de-la-API-Fiscus-CFDI/blob/master/Fiscus_CFDI_AgregarCuenta.html). Para agregar una cuenta en ambiente de pruebas envía el string "**sandbox**" al método setAmbiente, en caso de querer agregar una cuente en ambiente de producción pasar el string "**production**" al mismo método (setAmbiente).

```javascript
var consumo_api = new ConsumirApi();
consumo_api.setUsuario("TU_USUARIO_VA_AQUÍ");
consumo_api.setPassword("TU_PASSWORD_VA_AQUÍ");

var altaCuenta = new AltaCuenta();
altaCuenta.setAmbiente("sandbox");
altaCuenta.setConsumirApi(consumo_api);
```

## Guardar Ticket

Para que el cliente pueda ver la factura relacionada con su transacción es necesario guardar su ticket para lo que se necesita que forme un JSON con la estructura del CFDI (omitiendo el nodo del receptor) además de una serie relacionada a su empresa y una clave de ticket arbitraria. Esta se validará y se habilitara su facturación. El ejemplo para guardar ticket un CFDI está en la siguiente [liga](https://github.com/fiscus-cfdi/Javascript-Consumo-de-la-API-Fiscus-CFDI/blob/master/Fiscus_CFDI_GuardarTicket.html).

```javascript
var consumo_api = new ConsumirApi();
consumo_api.setUsuario("TU_USUARIO_VA_AQUÍ");
consumo_api.setPassword("TU_PASSWORD_VA_AQUÍ");

var guardarTicket = new GuardarTicket();
guardarTicket.setConsumirApi(consumo_api);
```

## Estatus Ticket

Para saber el estatus de un Ticket se puede realizar una petición para un ticket o en una sola petición se pueden pasar multiples tickets siempre y cuando pertenezca a la misma serie del RFC. El ejemplo para obtener el estatus de un ticket está en la siguiente [liga](https://github.com/fiscus-cfdi/Javascript-Consumo-de-la-API-Fiscus-CFDI/blob/master/Fiscus_CFDI_EstatusTicket.html).

```javascript
var consumo_api = new ConsumirApi();
consumo_api.setUsuario("TU_USUARIO_VA_AQUÍ");
consumo_api.setPassword("TU_PASSWORD_VA_AQUÍ");

var estatusTicket = new EstatusTicket();
estatusTicket.setConsumirApi(consumo_api);
```

## Enviar Factura

Para enviar una factura timbrada a un correo se debe contar con el folio fiscal generado para esta y especificar la direccion del correo. El ejemplo para enviar una factura está en la siguiente [liga](https://github.com/fiscus-cfdi/Javascript-Consumo-de-la-API-Fiscus-CFDI/blob/master/Fiscus_CFDI_EnviarFactura.html).

```javascript
var consumo_api = new ConsumirApi();
consumo_api.setUsuario("TU_USUARIO_VA_AQUÍ");
consumo_api.setPassword("TU_PASSWORD_VA_AQUÍ");

var altaCuenta = new EnviarFactura();
altaCuenta.setConsumirApi(consumo_api);
```

## Obtener Folio

Devuelve el proximo numero de folio consecutivo correspondiente al rfc y serie de emisor proporcionados, si no se especifica una serie se tomaran en cuenta los folios correspondientes a este rfc y sin serie. El ejemplo para enviar una factura esta en la siguente [liga](https://github.com/fiscus-cfdi/Javascript-Consumo-de-la-API-Fiscus-CFDI/blob/master/Fiscus_CFDI_ObtenerFolio.html).

```javascript
var consumo_api = new ConsumirApi();
consumo_api.setUsuario("TU_USUARIO_VA_AQUÍ");
consumo_api.setPassword("TU_PASSWORD_VA_AQUÍ");

var obtenerFolio = new ObtenerFolio();
obtenerFolio.setAmbiente("sandbox");
obtenerFolio.setConsumirApi(consumo_api);
```

## Obtener Factura

Devuelve el xml timbrado y el pdf correspondiente al folio fiscal recibido, si se envía el parámetro logotipo reemplaza el logotipo del RFC emisor o serie si tiene uno asignado, de no ser así lo agrega solo para ese pdf.

```javascript
var consumo_api = new ConsumirApi();
consumo_api.setUsuario("TU_USUARIO_VA_AQUÍ");
consumo_api.setPassword("TU_PASSWORD_VA_AQUÍ");

var obtener_factura = new ObtenerFactura();
obtener_factura.setAmbiente("sandbox");
obtener_factura.setConsumirApi(consumo_api);
```

## Obtener RFCs

Obtiene todos los RFCs pertenecientes o compartidos al cliente del API.

```javascript
var consumo_api = new ConsumirApi();
consumo_api.setUsuario("TU_USUARIO_VA_AQUÍ");
consumo_api.setPassword("TU_PASSWORD_VA_AQUÍ");

var obtener_rfcs = new ObtenerRfcs();
obtener_rfcs.setAmbiente("sandbox");
obtener_rfcs.setConsumirApi(consumo_api);
```

## Utilizar Proxy
Puedes manejar las peticiones del lado del servidor (tu servidor) y así ocultar las credenciales de API (usuario/contraseña), para ello puedes instalar la librería de PHP para consumir la API de app.fiscus.mx (https://github.com/fiscus-cfdi/api-fiscuscfdi-php), y configurar el objeto  ConsumirApi de la siguiente manera:

```javascript
var consumo_api = new ConsumirApi();
consumo_api.setUrl("URL_DE_TU_SERVIDOR");

var timbrarCfdi = new TimbrarCFDI();
timbrarCfdi.setAmbiente("sandbox");
timbrarCfdi.setConsumirApi(consumo_api);

```

## Llenar a partir de un Objeto JSON
Se puede llenar los campos de HTML a partir de un objeto JSON.
```javascript
  var timbrarCfdi=new TimbrarCFDI();
  timbrarCfdi.setAmbiente("sandbox");
  timbrarCfdi.setConsumirApi(consumo_api);          
  try {
      var cfdi = '{ "Version": "4.0", "Folio": 2, "Fecha": "2022-10-18T16:46:29", "Sello": "@", "FormaPago": "03", "Certificado": "@", "SubTotal": 27445.6, "Moneda": "MXN", "Total": 31836.9, "TipoDeComprobante": "I", "Exportacion": "01", "MetodoPago": "PUE", "LugarExpedicion": "64010", "Emisor": { "Rfc": "IXS7607092R5", "Nombre": "INTERNACIONAL XIMBO Y SABORES", "RegimenFiscal": "601" }, "Receptor": { "Rfc": "KICR630120NX3", "Nombre": "RODRIGO KITIA CASTRO", "UsoCFDI": "G03", "DomicilioFiscalReceptor": "64010", "RegimenFiscalReceptor": "612" }, "Conceptos": { "Concepto": [ { "Impuestos": { "Traslados": { "Traslado": [ { "Base": 27445.6, "Impuesto": "002", "TipoFactor": "Tasa", "TasaOCuota": 0.16, "Importe": 4391.3 } ] } }, "ClaveProdServ": "78101803", "Cantidad": "47.320", "ClaveUnidad": "E48", "ObjetoImp": "02", "Unidad": "E48", "Descripcion": "Transporte", "ValorUnitario": "580.0000", "Importe": "27445.6000" } ] } }';
      cfdi = JSON.parse(cfdi);
      timbrarCfdi.setCfdi(cfdi); 
  } catch (error) {
      console.log(error);
  }

```

## Callback cuando el timbrado fué exitoso
Se puede pasar un callback, para cuando el timbrado de la factura fué exitoso.
```javascript
  var timbrarCfdi=new TimbrarCFDI();
  timbrarCfdi.setAmbiente("sandbox");
  timbrarCfdi.setConsumirApi(consumo_api);          
  timbrarCfdi.setCallbackTimbradoExitoso(function(timbrado){
      console.log(timbrado);
  });  
```

## Implementación rápida con JavaScript - CFDI 4.0

```html
<link rel="stylesheet" type="text/css" href="./../lib/css/fiscus_cfdi.css" >

<div id="ContenedorTimbrar40"></div>
<script type="text/javascript" src="./../lib/js/generar_html_fiscuscfdi.js"></script>
<!--
<script type="text/javascript" src="./../dist/fiscuscfdi.2.0.0.min.js"></script>
-->
<script type="text/javascript" src="./../lib/js/consumo_api.js"></script>
<script type="text/javascript" src="./../lib/js/timbrar_cfdi.js"></script>
<script type="text/javascript">
		(function(){
      document.getElementById("ContenedorTimbrar40").innerHTML=GenerarHTMLFiscusCFDI.HTMLFacturar40();

			var consumo_api=new ConsumirApi();
            consumo_api.setUsuario("TU_USUARIO_VA_AQUÍ");
            consumo_api.setPassword("TU_PASSWORD_VA_AQUÍ");
            

            var timbrarCfdi=new TimbrarCFDI();
            timbrarCfdi.setAmbiente("sandbox");
            timbrarCfdi.setConsumirApi(consumo_api);
            timbrarCfdi.setCallbackTimbradoExitoso(function(timbrado){
                console.log(timbrado);
            });            
            try {
                var cfdi = '{ "Version": "4.0", "Folio": 2, "Fecha": "2022-10-18T16:46:29", "Sello": "@", "FormaPago": "03", "Certificado": "@", "SubTotal": 27445.6, "Moneda": "MXN", "Total": 31836.9, "TipoDeComprobante": "I", "Exportacion": "01", "MetodoPago": "PUE", "LugarExpedicion": "64010", "Emisor": { "Rfc": "IXS7607092R5", "Nombre": "INTERNACIONAL XIMBO Y SABORES", "RegimenFiscal": "601" }, "Receptor": { "Rfc": "KICR630120NX3", "Nombre": "RODRIGO KITIA CASTRO", "UsoCFDI": "G03", "DomicilioFiscalReceptor": "64010", "RegimenFiscalReceptor": "612" }, "Conceptos": { "Concepto": [ { "Impuestos": { "Traslados": { "Traslado": [ { "Base": 27445.6, "Impuesto": "002", "TipoFactor": "Tasa", "TasaOCuota": 0.16, "Importe": 4391.3 } ] } }, "ClaveProdServ": "78101803", "Cantidad": "47.320", "ClaveUnidad": "E48", "ObjetoImp": "02", "Unidad": "E48", "Descripcion": "Transporte", "ValorUnitario": "580.0000", "Importe": "27445.6000" } ] } }';
                cfdi = JSON.parse(cfdi);
                timbrarCfdi.setCfdi(cfdi); 
            } catch (error) {
                console.log(error);
            }
		})();
	</script>
```

## Implementación rápida con JavaScript - CFDI 4.0 / Complemento de pago 2.0

```html
<link rel="stylesheet" type="text/css" href="./../lib/css/fiscus_cfdi.css" >

<div id="ContenedorTimbrar40"></div>
<script type="text/javascript" src="./../lib/js/generar_html_fiscuscfdi.js"></script>
<!--
<script type="text/javascript" src="./../dist/fiscuscfdi.2.0.0.min.js"></script>
-->
<script type="text/javascript" src="./../lib/js/consumo_api.js"></script>
<script type="text/javascript" src="./../lib/js/timbrar_cfdi.js"></script>
<script type="text/javascript" src="./../lib/js/comprobante_pago20.js"></script>
<script type="text/javascript">
		(function(){
      document.getElementById("ContenedorTimbrar40").innerHTML=GenerarHTMLFiscusCFDI.HTMLFacturar40_ComplementoPago20();

			var consumo_api=new ConsumirApi();
      consumo_api.setUsuario("TU_USUARIO_VA_AQUÍ");
      consumo_api.setPassword("TU_PASSWORD_VA_AQUÍ");


      var timbrarCfdi=new ComprobantePago20();
      timbrarCfdi.setAmbiente("sandbox");
      timbrarCfdi.setConsumirApi(consumo_api); 
      timbrarCfdi.setCallbackTimbradoExitoso(function(timbrado){
          console.log(timbrado);
      });            
      try {
          var cfdi = '{"Emisor":{"Rfc":"IXS7607092R5","Nombre":"INTERNACIONAL XIMBO Y SABORES SA DE CV","RegimenFiscal":"601"},"Receptor":{"Rfc":"KIJ0906199R1","Nombre":"KERNEL INDUSTIA JUGUETERA","UsoCFDI":"G03","DomicilioFiscalReceptor":"68224","RegimenFiscalReceptor":"601"},"Conceptos":{"Concepto":[{"Impuestos":{"Traslados":{"Traslado":[{"Base":1000,"Impuesto":"002","TipoFactor":"Tasa","TasaOCuota":0.16,"Importe":160}]}},"ClaveProdServ":"12352311","Cantidad":"1","ClaveUnidad":"E48","ObjetoImp":"02","Unidad":"E48","Descripcion":"Al\u00famina y otros compuestos de aluminio","ValorUnitario":"1000.0000","Importe":"1000.0000"}]},"Impuestos":{"Traslados":{"Traslado":[{"Base":1000,"Impuesto":"002","TipoFactor":"Tasa","TasaOCuota":0.16,"Importe":160}]},"TotalImpuestosTrasladados":160},"Version":"4.0","Folio":90,"Fecha":"2022-03-31T13:36:27","Sello":"@","FormaPago":"99","NoCertificado":"30001000000400002446","Certificado":"@","SubTotal":1000,"Moneda":"MXN","Total":1160,"TipoDeComprobante":"I","Exportacion":"01","MetodoPago":"PUE","LugarExpedicion":"64010","uuid":"DF14EC55-C5CC-4B77-BA11-5437369A1158","Complemento":{"TimbreFiscalDigital":{"FechaTimbrado":"2022-03-31T13:40:58","NoCertificadoSAT":"30001000000400002495","RfcProvCertif":"SPR190613I52","SelloCFD":"Q1QTRe4m65qgd8EAMIT8H8tjU3UG0rOlUxmirg8Xm5XmeMoOl8Gkmk2tsEpFGFOhQn\/1FNSqtBtstd1bSMoAu5qFUiLzAQb54enupx3fAIRTeonGhK++XN\/p\/yQ5KkPXsDWfkBaEVcF3dXtuTHMtcvyZ\/0XMioPlwHl4y7wC95AEX7+sOkdSxpdsR9B+mhyMOWtR6HF+XXVObuuj2cauR60JNcg1oAb46tiwIUiQ5hxziCwuGrYywTCsWEtEYFj9d8ioRbEbWhrtG4ta6tNwrzc7WDKFzr8MUYWUKe2Ij69DjAXYBj3otj6ZreXLhU9H6aaUn6A422POx\/f4I4clCg==","SelloSAT":"DAwhgSnIITCccetVuXhk74BszqZpIZdPbKFAcMOCqx4m9mqMonxOfg2jX9nhGWaeGPU\/xaQPQtmzEIrY47cdgW2mISfrNHhgtcqvR0SWZqWADSY6tdRUU0dJH2LHiNy0hNQqVAs+qAcVccwBv3fGt7IRSsxOVoVama1yCcoCycN\/jUhTllf8lYiZN4KHnOGAJZYZ9cO4Bnkr7PjjkwVEVaR8mcKPz4PDY5vQv5aq4kh\/82W0HGB+PijXkpKFZLngYniDEVCc7qXfRmRXC1WzEuDvuGl1bJps3CthBEsuM7kBpqdPq4oGKCHwbvN3Ky9u4X1MFETWFHEmRUut+Upb\/g==","UUID":"DF14EC55-C5CC-4B77-BA11-5437369A1158","Version":"1.1","schemaLocation":"http:\/\/www.sat.gob.mx\/TimbreFiscalDigital http:\/\/www.sat.gob.mx\/sitio_internet\/cfd\/TimbreFiscalDigital\/TimbreFiscalDigitalv11.xsd"}}}';
          cfdi = JSON.parse(cfdi);
          console.log(cfdi);
          //timbrarCfdi.setCfdi(cfdi); 
          //timbrarCfdi.setCfdiPago(cfdi); 
          //timbrarCfdi.setCfdiPago(cfdi,true); 
      } catch (error) {
          console.log(error);
      }
		})();
	</script>
```


# DOCUMENTACIÓN

Para mayor detalle de cada método y cómo implementarlo en otro lenguaje de programación, ingrese a la documentación de la API

- https://fiscuscfdi.com/API_Facturacion/docs/
