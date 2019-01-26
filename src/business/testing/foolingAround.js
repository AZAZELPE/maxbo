const fbUtils = require('../../messengerUtils/fbUtils');

let pruebas = (sender_psid, received_message) => {
    
    let message = "";

    if (message === "") {
      message = tiposDeCatalogo(sender_psid, received_message);
    }
    if (message === "") {
      message = tiposDeQuickResponse(sender_psid, received_message);
    }


    return message;
}

module.exports.pruebas = pruebas;

let tiposDeCatalogo = (sender_psid, received_message) => {

    let message;

    if (received_message.text === 'catalogo1') { 
        let buttons = [fbUtils.buildSelectButton('select')];
        
        let elements = [];
    
        elements.push(fbUtils.buildElementWithImage("TestingVinos","Lo mejor para ti..!!",[],"https://static.vinepair.com/wp-content/uploads/2017/11/vintage-internal.jpg"));
        elements.push(fbUtils.buildElementWithImage("Vino Tinto","Lo mejor de los vinos tintos para ti",buttons,"https://heredadaduna.com/wp-content/uploads/2017/02/vino_tinto_rioja.jpg"));
        elements.push(fbUtils.buildElementWithImage("Vino Blanco","Lo mejor de los vinos blancos para ti",buttons,"https://www.vinetur.com/imagenes/2017/junio/6/vino_blanco.jpg"));
        elements.push(fbUtils.buildElementWithImage("Vino Rosado","Lo mejor de los vinos rosados para ti",buttons,"https://vinosdiferentes.com/wp-content/uploads/2016/06/como-elaborar-vino-rosado.png"));        
    
        message = fbUtils.buildListTemplate('large',elements);
    
    }

    if (received_message.text === 'catalogo2') { 
      let buttons = [fbUtils.buildSelectButton('select')];
      
      let elements = [];
  
      elements.push(fbUtils.buildElementWithImage("Vino Tinto","Lo mejor de los vinos tintos para ti",buttons,"https://heredadaduna.com/wp-content/uploads/2017/02/vino_tinto_rioja.jpg"));
      elements.push(fbUtils.buildElementWithImage("Vino Blanco","Lo mejor de los vinos blancos para ti",buttons,"https://www.vinetur.com/imagenes/2017/junio/6/vino_blanco.jpg"));
      elements.push(fbUtils.buildElementWithImage("Vino Rosado","Lo mejor de los vinos rosados para ti",buttons,"https://vinosdiferentes.com/wp-content/uploads/2016/06/como-elaborar-vino-rosado.png"));
      elements.push(fbUtils.buildElementWithImage("Champagne","El mejor champagne para ti",buttons,"https://static.vinepair.com/wp-content/uploads/2017/11/vintage-internal.jpg"));
  
      message = fbUtils.buildListTemplate('compact',elements);
  
    }

    if (received_message.text === 'catalogo3') { 
      let buttons = [fbUtils.buildSelectButton('select')];
      
      let elements = [];
  
      elements.push(fbUtils.buildElementWithImage("Vino Tinto","Lo mejor de los vinos tintos para ti",buttons,"https://heredadaduna.com/wp-content/uploads/2017/02/vino_tinto_rioja.jpg"));
      elements.push(fbUtils.buildElementWithImage("Vino Blanco","Lo mejor de los vinos blancos para ti",buttons,"https://www.vinetur.com/imagenes/2017/junio/6/vino_blanco.jpg"));
      elements.push(fbUtils.buildElementWithImage("Vino Rosado","Lo mejor de los vinos rosados para ti",buttons,"https://vinosdiferentes.com/wp-content/uploads/2016/06/como-elaborar-vino-rosado.png"));
      elements.push(fbUtils.buildElementWithImage("Champagne","El mejor champagne para ti",buttons,"https://static.vinepair.com/wp-content/uploads/2017/11/vintage-internal.jpg"));
  
      message = fbUtils.buildGenericTemplate(elements);
  
    }

    if (received_message.text === 'catalogo4') { 
      let buttons = [];
      buttons.push(fbUtils.buildPostbackButton("Vino Tinto","tinto"));
      buttons.push(fbUtils.buildPostbackButton("Vino Blanco","blanco"));
      buttons.push(fbUtils.buildPostbackButton("Vino Rosado","rosado"));
      
      let elements = [];
  
      elements.push(fbUtils.buildElement("Tipos de Vinos","Selecciona la categoria que mas te guste",buttons));
  
      message = fbUtils.buildGenericTemplate(elements);
  
    }

    if (received_message.text === 'catalogo5') { 
      let buttons1 = [];
      let buttons2 = [];
      buttons1.push(fbUtils.buildPostbackButton("Vino Tinto","tinto"));
      buttons1.push(fbUtils.buildPostbackButton("Vino Blanco","blanco"));
      buttons2.push(fbUtils.buildPostbackButton("Vino Rosado","rosado"));
      buttons2.push(fbUtils.buildPostbackButton("Champagne","champagne"));
      
      let elements = [];
  
      elements.push(fbUtils.buildElement("Tipos de Vinos","Selecciona la categoria que mas te guste",buttons1));
      elements.push(fbUtils.buildElement("Tipos de Vinos","Selecciona la categoria que mas te guste",buttons2));

      message = fbUtils.buildGenericTemplate(elements);
  
    }

    return message;


}

let tiposDeQuickResponse = (sender_psid, received_message) => {
  if (received_message.text === 'telefono') { 
    let buttons = [fbUtils.buildSelectButton('select')];
    
    message = {"text": "Here is a quick reply!",
    "quick_replies":[
      {
        "content_type":"user_phone_number"
      }
    ]};

  }
  
  if (received_message.text === 'email') { 
    let buttons = [fbUtils.buildSelectButton('select')];
    
    message = {"text": "Here is a quick reply!",
    "quick_replies":[
      {
        "content_type":"user_email"
      }
    ]};

  }

  if (received_message.text === 'gps') { 
    let buttons = [fbUtils.buildSelectButton('select')];
    
    message = {"text": "Here is a quick reply!",
    "quick_replies":[
      {
        "content_type":"location"
      }
    ]};

  }
}