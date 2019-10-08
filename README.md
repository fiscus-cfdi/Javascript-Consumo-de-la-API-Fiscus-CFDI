![Fiscus CFDI](https://www.fiscuscfdi.com/assets/img/github/banner_2.jpg)

# INTRODUCCIÓN

Ejemplo de consumo de la API de [Fiscus CFDI](https://www.fiscuscfdi.com) en **Javascript** para Facturar CFDI, notas de crédito, notas de cargo, nómina, comprobante de pago, complementos, addendas, etc.

## Credenciales
Para consumir la API es necesario primer obtener las credenciales correctas, para dar de alta tú cuenta en [Fiscus CFDI](https://www.fiscuscfdi.com) sigue los siguientes pasos:

  

*  **Paso 1.** Regístrate en [Fiscus CFDI](https://www.fiscuscfdi.com) (y recibe 10 folios gratis) en la siguiente url: https://www.fiscuscfdi.com/index.php/Registro.
	* ![Registro en Fiscus CFDI](https://www.fiscuscfdi.com/assets/img/github/registro.png)

  

*  **Paso 2.** Obtén las credenciales para poder consumir la API en: https://www.fiscuscfdi.com/index.php/CuentaApi.
	* ![Credenciales para consumir API de Fiscus CFDI](https://www.fiscuscfdi.com/assets/img/github/credenciales.png)

  

*  **Paso 3.** Listo, ya puedes consumir la API de [Fiscus CFDI](https://www.fiscuscfdi.com) y Timbrar facturar CFDI, notas de crédito, notas de cargo, nómina, comprobante de pago, complementos, addendas, etc. 

  
  
  

# MÉTODOS DISPONIBLES

## Agregar RFC
Antes de poder timbrar y cancelar facturas (CFDI), es necesario dar de alta el RFC (persona física/moral) para mayor detalle del método de agregar RFC consulta la [documentación](https://www.fiscuscfdi.com/API_Facturacion/docs/#operation/api_agregar_rfc). 

El ejemplo para agregar un RFC está en la siguiente  [liga](https://github.com/fiscus-cfdi/Javascript-Consumo-de-la-API-Fiscus-CFDI/blob/master/Fiscus_CFDI_AgregarRFC.html), reemplaza tu usuario y password con los que obtuviste en el paso 2, para ambiente de pruebas envía el string "**sandbox**" al método setAmbiente, en caso de querer agregar el RFC en producción pasar el string "**production**" al mismo método (setAmbiente).
```javascript
    var consumo_api=new ComsumirApi();
    consumo_api.setUsuario("TU_USUARIO_VA_AQUÍ");
    consumo_api.setPassword("TU_PASSWORD_VA_AQUÍ");
    
    var altaRfc=new AltaRfc();
    altaRfc.setAmbiente("sandbox");
    altaRfc.setConsumirApi(consumo_api);
```

  
## Timbrar CFDI
Para poder timbrar un CFDI, primero debe dar de alta un RFC. El ejemplo para timbrar un CFDI está en la siguiente [liga](https://github.com/fiscus-cfdi/Javascript-Consumo-de-la-API-Fiscus-CFDI/blob/master/Fiscus_CFDI_Timbrar33.html).  Para timbrar en ambiente de pruebas (no validas ante el SAT) envía el string "**sandbox**" al método setAmbiente, en caso de querer timbrar en ambiente de producción (validas ante el SAT) pasar el string "**production**" al mismo método (setAmbiente).

```javascript
    var consumo_api=new ComsumirApi();
    consumo_api.setUsuario("TU_USUARIO_VA_AQUÍ");
    consumo_api.setPassword("TU_PASSWORD_VA_AQUÍ");
    
    var timbrarCfdi=new TimbrarCFDI();
    timbrarCfdi.setAmbiente("sandbox");
    timbrarCfdi.setConsumirApi(consumo_api);
```

## Cancelar CFDI
Para cancelar un CFDI, primero tuvo que haber sido timbrado en la plataforma de Fiscus CFDI. El ejemplo para cancelar un CFDI está en la siguiente [liga](https://github.com/fiscus-cfdi/Javascript-Consumo-de-la-API-Fiscus-CFDI/blob/master/Fiscus_CFDI_CancelarCFDI.html). Para cancelar en ambiente de pruebas (el CFDI tuvo que haber sido timbrado también en éste ambiente) envía el string "**sandbox**" al método setAmbiente, en caso de querer cancelar en ambiente de producción (el CFDI tuvo que haber sido timbrado también en éste ambiente) pasar el string "**production**" al mismo método (setAmbiente).
```javascript
    var consumo_api=new ComsumirApi();
    consumo_api.setUsuario("TU_USUARIO_VA_AQUÍ");
    consumo_api.setPassword("TU_PASSWORD_VA_AQUÍ");
    
    var cancelarCFDI=new CancelarCFDI();
    cancelarCFDI.setAmbiente("sandbox");
    cancelarCFDI.setConsumirApi(consumo_api);
```

## Obtener Series de un RFC
Para poder generar una serie por medio de la [API de Fiscus CFDI](http://www.fiscuscfdi.com/API_Facturacion/docs/) se necesita primero tener un número de serie relacionado a su RFC; Al llamar a este endpoint se le retornarán todos los números de serie asociados a su RFC y en caso de no tener ninguno se le asignará uno. El ejemplo para generar un número de serie está en la siguiente [liga](https://github.com/fiscus-cfdi/Javascript-Consumo-de-la-API-Fiscus-CFDI/blob/master/Fiscus_CFDI_ObtenerSeries.html).

```javascript
    var consumo_api=new ComsumirApi();
    consumo_api.setUsuario("TU_USUARIO_VA_AQUÍ");
    consumo_api.setPassword("TU_PASSWORD_VA_AQUÍ");

    var obtener_series = new ObtenerSeries();
    obtener_series.setAmbiente("sandbox");
    obtener_series.setConsumirApi(consumo_api);

```

## Agregar Cuenta
Desde la api se pueden dar de alta cuentas especificando un correo valido y una contraseña. El ejemplo para agregar cuentas esta en la siguiente [liga](https://github.com/fiscus-cfdi/Javascript-Consumo-de-la-API-Fiscus-CFDI/blob/master/Fiscus_CFDI_AgregarCuenta.html). Para agregar una cuenta en ambiente de pruebas envía el string "**sandbox**" al método setAmbiente, en caso de querer agregar una cuente en ambiente de producción pasar el string "**production**" al mismo método (setAmbiente).

```javascript
    var consumo_api=new ComsumirApi();
    consumo_api.setUsuario("TU_USUARIO_VA_AQUÍ");
    consumo_api.setPassword("TU_PASSWORD_VA_AQUÍ");

    var altaRfc=new AltaRfc();
    altaRfc.setAmbiente("sandbox");
    altaRfc.setConsumirApi(consumo_api);
    
```

## Guardar Ticket
Para que el cliente pueda ver la factura relacionada con su transacción es necesario guardar su ticket para lo que se necesita que forme un JSON con la estructura del CFDI (omitiendo el nodo del receptor) además de una serie relacionada a su empresa y una clave de ticket arbitraria. Esta se validará y se habilitara su facturación. El ejemplo para guardar ticket un CFDI está en la siguiente [liga](https://github.com/fiscus-cfdi/Javascript-Consumo-de-la-API-Fiscus-CFDI/blob/master/Fiscus_CFDI_GuardarTicket.html).
```javascript
    var consumo_api=new ComsumirApi();
    consumo_api.setUsuario("TU_USUARIO_VA_AQUÍ");
    consumo_api.setPassword("TU_PASSWORD_VA_AQUÍ");
    
    var guardarTicket=new GuardarTicket();
    guardarTicket.setConsumirApi(consumo_api);
```

# DOCUMENTACIÓN

Para mayor detalle de cada método y cómo implementarlo en otro lenguaje de programación, ingrese a la documentación de la API

* https://www.fiscuscfdi.com/API_Facturacion/docs/
