const jsUtils = require('../jsUtils/jsUtils');
const c = require('../business/constants');

let buildPostbackFilter = (qty,filters) => {
  let postback = {
    "type": c.POSTBACK_FILTER,
    "data": {
      "qty": qty,
      "filters": filters
    }
  };
  return JSON.stringify(postback);
};


let buildPostbackIntent = (intent) => {
  let postback = {
    "type": c.POSTBACK_INTENT,
    "data": {
      "intent": intent
    }
  };
  return JSON.stringify(postback);
};


let buildPostbackProduct = (productId,action,qty,productFilters) => {
  let postback = {
    "type": c.POSTBACK_PRODUCT,
    "data": {
      "id": productId,
      "action": action,
      "quantity": qty,
      "filters": productFilters
    }
  };
  return JSON.stringify(postback);
};

module.exports.buildPostbackFilter = buildPostbackFilter;
module.exports.buildPostbackIntent = buildPostbackIntent;
module.exports.buildPostbackProduct = buildPostbackProduct;
