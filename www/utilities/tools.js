// herramientas de uso general
var tools = {
    getSettings: function(method, url, data){
        if (typeof(data) == "undefined"){
            data == null;
        }
        var settings = {
            async: true,
            //"crossDomain": true,
            url: url,
            method: method,
            headers: {
                "cache-control": "no-cache"
            },
            processData: false,
            contentType: false,
            mimeType: "multipart/form-data",
            error: tools.genericFunctionError,
            dataType : 'json',
            data: data
        }
        var token = tools.getCookie('token');
        if (token != "" ){
            settings.headers.Authorization = " toke " + token;
        }
        return settings;
    },

    post : function (url, data, functionDone){
        var settings = tools.getSettings("POST", url, data);
        $.ajax(settings).done(functionDone);
    },

    get : function (url, functionDone){
        var settings = tools.getSettings("GET", url, null);
        $.ajax(settings).done(functionDone);
    },
    // envio de mensajes de error
    genericFunctionError: function(err){
        console.log(err);
    },
//agrega cookie
    putCookie: function (key, data) {
        document.cookie = key+"="+data+"; path=/";
    },
//obtiene una cookie
    getCookie: function (key) {
        var name = key + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },
//elimina una cookie
    deleteCookie: function (keyCookie){
        document.cookie = keyCookie + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    },
//obtiene un array de un json
    getArrayJson: function(data, value){
        var array = [];
        for(var i = 0; i < data.length; i++){
            if (!data[i].hasOwnProperty(value)) continue;
            array.push(data[i][value]);
        }
        return array;
    }

} // fin tools

$(document).ready( function (){

(function() {
  /**
   * Ajuste decimal de un número.
   *
   * @param {String}  tipo  El tipo de ajuste.
   * @param {Number}  valor El numero.
   * @param {Integer} exp   El exponente (el logaritmo 10 del ajuste base).
   * @returns {Number} El valor ajustado.
   */
  function decimalAdjust(type, value, exp) {
    // Si el exp no está definido o es cero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // Si el valor no es un número o el exp no es un entero...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
  // Decimal floor
  if (!Math.floor10) {
    Math.floor10 = function(value, exp) {
      return decimalAdjust('floor', value, exp);
    };
  }
  // Decimal ceil
  if (!Math.ceil10) {
    Math.ceil10 = function(value, exp) {
      return decimalAdjust('ceil', value, exp);
    };
  }
})();

});