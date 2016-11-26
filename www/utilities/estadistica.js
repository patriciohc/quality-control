'use strict'

var estadistica = {

    getPromedio: function (data){
        var suma = 0;
        for (var i = 0; i < data.length; i++)
            suma += data[i];
        var promedio = suma / data.length;
        return Math.round(promedio * 100) / 100;
    },

    desvStd: function (data){
        var N = data.length;
        var x_p = estadistica.getPromedio(data);
        var sumatoria = 0;
        for (var i = 0; i < data.length; i++){
            var x_i = data[i];
            sumatoria += Math.pow( x_i - x_p , 2);
        }
        var desvStd = sumatoria / N;
        return Math.round(desvStd * 100) / 100;
    },

    rango: function (data) {
        return Math.round(data[0] * 100) / 100;
    }

}

module.exports = estadistica;
