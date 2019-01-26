module.exports.TYPE_MESSAGE = 'MESSAGE';
module.exports.TYPE_POSTBACK = 'POSTBACK';
module.exports.TYPE_DB_INTENT = 'DB_INTENT';
module.exports.TYPE_TEXT_INTENT = 'TEXT_INTENT';

module.exports.INTENT_VER_CATALOGO = 'VER_CATALOGO';
module.exports.INTENT_VER_TIPO_PAGOS = 'VER_TIPO_PAGOS';
module.exports.INTENT_VER_CARRITO = 'VER_CARRITO';
module.exports.INTENT_COMPRAR_CARRITO = 'COMPRAR_CARRITO';
module.exports.INTENT_DEFAULT_RESPONSE = 'DEFAULT_RESPONSE';

//Aqui se describe el intent y se ingresan los sinonimos que pueden tener para
//llamar a un intent en particular
module.exports.INTENTS = [
  {"name": "VER_CATALOGO",
    "values": [
    {"postback":"CATALOGUE"},
    {"text":"CATALOGO"},
    {"text":"VER CATALOGO"},
    {"text":"CARTA"}
  ]},
  {"name": "VER_TIPO_PAGOS",
  "values": [
    {"postback":"INFO_PAYMETHODS"},
    {"text":"METODO DE PAGO"},
    {"text":"PAGOS"},
    {"text":"PAGO"}
  ]},
  {"name": "VER_CARRITO",
  "values": [
    {"postback":"CART_VIEW"},
    {"text":"CARRITO"},
    {"text":"PRODUCTOS"}
  ]},
  {"name": "COMPRAR_CARRITO",
  "values": [
    {"postback":"CART_CHECKOUT"},
    {"text":"COMPRAR"},
    {"text":"PAGAR"}
  ]}
];




