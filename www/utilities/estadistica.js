'use strict'

var estadistica = {

    getPromedio: function (data){
        var suma = 0;
        for (var i = 0; i < data.length; i++)
            suma += data[i];
        return suma / data.length;
    },

    desvStd: function (data){
        var N = data.length;
        var x_p = estadistica.getPromedio(data);
        var sumatoria = 0;
        for (var i = 0; i < data.length; i++){
            var x_i = data[i];
            sumatoria += Math.pow( x_i - x_p , 2);
        }
        return Math.sqrt(sumatoria / N);
    },

    rango: function (data) {
        return Math.max.apply(null, data) - Math.min.apply(null, data);
    },

    // Calcula el area bajo la curna normal estandar 
    areaBajoCurvaNormal: function(value1, value2) {

        if (value1 == "" || value2 == "") return;
        if (isNaN(value1) || isNaN(value2)) return;
        if (value1 == value2) return 0;
        if (!isFinite(value1) && !isFinite(value2)) return 1;

        var min = Math.min(value1, value2);
        var max = Math.max(value1, value2);
        var area = 0;

        var getValueZ = function(value) {
            var raiz_do_pi = 2.506606;
            var inc = 0.01;
            var c = inc/(6*raiz_do_pi);
            var z = 0;
            var i = 1;
            var x = 0;

            while (x < value) {
                x =  inc * i;
                var s0 = Math.exp(-0.5*Math.pow(((i-1)*inc),2));
                var s1 = 4 * Math.exp(-0.5*Math.pow((i-0.5)*inc,2));
                var s2 = Math.exp(-0.5*Math.pow(i*inc,2));
                z = (s0 + s1 + s2) * c  + z; 
                i++;
            }
            return 0.5 + z; 
        }

        if (isFinite(max) && !isFinite(min)) { // area de max a menos infinito
            if (max < 0 ){
                area = 1.0 - getValueZ(Math.abs(max));
            } else {
                area = getValueZ(max);
            }
        } else if(!isFinite(max) && isFinite(min)) { // area de min hasta mas inifinito
            if (min < 0 ) {
                area = getValueZ(Math.abs(min));
            } else {
                area = 1.0 - getValueZ(min)
            }
        } else {
            if (min > 0 && max > 0 ) {
                area = getValueZ(max) - getValueZ(min);
            } else if (min < 0 && max > 0 ) {
                area = getValueZ(max) - (1 - getValueZ(Math.abs(min)));
            } else if (min < 0 && max < 0) {
                area = (1 - getValueZ(Math.abs(max))) - (1 - getValueZ(Math.abs(min)));
            }
        }
        
        return Math.round10(area, -4)
    },

    getCorrelacion: function(X, Y) {

        if (!X || !Y) return;
        if (X.length != Y.length) return;

        var Sx = estadistica.desvStd(X); // desviacion estandar de x
        var Sy = estadistica.desvStd(Y); // desviacion estandar de y
        var Sxy = estadistica.getCovarianza(X, Y); // covarianza xy
        
        var r = Sxy / (Sx * Sy); // coeficiente de correlacion xy
        r = Math.round10(r, -2);

        var m = Sxy / Math.pow(Sx, 2);
        var b = estadistica.getPromedio(Y) - (m * estadistica.getPromedio(X));
        m = Math.round10(m, -2);
        b = Math.round10(b, -2);

        var obj = {
            f: function(x) { // funcion de correlacion 
                return m * x + b; 
            },
            fs: "f(x) = " + m + "x + " + b, // funcion de correlacion en string 
            r:r , // coeficiente de correlacion 
        }

        return obj;
    },
    
    getCovarianza: function(X, Y) {
        var mediaX = estadistica.getPromedio(X);
        var mediaY = estadistica.getPromedio(Y);
        var Sxy = 0;
        for (var i = 0; i < X.length; i++) {
            Sxy += (X[i] - mediaX) * (Y[i] - mediaY);
        }
        return Sxy / X.length;        
    }

}

