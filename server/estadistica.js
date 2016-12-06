'use strict'

var estadistica = {
    // recibe data del tipo 
    //[{ identificador: "valor", value: valor }, .....]
    getPromedio: function (data){
        var suma = 0;
        for (var i = 0; i < data.length; i++)
            suma += data[i].value;
        var promedio = suma / data.length;
        return Math.round(promedio * 100) / 100;
    },
    // recibe data del tipo 
    //[{ identificador: "valor", value: valor }, .....]
    desvStd: function (data){
        var N = data.length;
        var x_p = estadistica.getPromedio(data);
        var sumatoria = 0;
        for (var i = 0; i < data.length; i++){
            var x_i = data[i].value;
            sumatoria += Math.pow( x_i - x_p , 2);
        }
        var desvStd = Math.sqrt(sumatoria / N);
        return Math.round(desvStd * 100) / 100;
    },

    rango: function (data) {
        return Math.round(data[0] * 100) / 100;
    }

}

module.exports = estadistica;
