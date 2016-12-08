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


    //Funcion que calcula la moda, si hi han 2 repetits retorna un -1
    moda: function moda(array){
 			//iniciamos las variables necesarias en todo el codigo
 			var moda, moda2;
 			var contador = 0, contador2 = 0;
 			//Recorremos la array
 			for (var x=0; x<array.length; x++){
 				//Miramos que el numero cogido no sea el de la moda
 				if(array[x] != moda) {
 					var contadorReinicia=0;
 					//Recorremos la array para encontrar concordancias on el numero sacado de la array de X
 					for(var i=0; i<array.length; i++){
 						//cunado el numero sea igual al de la array de x le añadimos 1 al contador
 						if (array[i] == array[x]) contadorReinicia++;
 					}
//si el contador que se reinicia nos da mas alto que el contador general añadimos el numero a la variable moda y cambiamos el contador general por el que reinicia
 					if (contadorReinicia>contador){
 						contador = contadorReinicia;
 						moda = array[x];
 					}
 				}
 			}
 			//Miramos que no hayan 2 con la misma cantidad
 			for ( var x=0; x<array.length; x++ ){
 				//Miramos que el numero cogido no sea el de la moda
 				if(array[x] != moda && array[x] != moda2){
 					var contadorReinicia=0;
 					//Recorremos la array para encontrar concordancias on el numero sacado de la array de X
 					for(var i=0; i<array.length; i++){
 						//cunado el numero sea igual al de la array de x le añadimos 1 al contador
 						if (array[i] == array[x]) contadorReinicia++;
 					}
 					//si el contador que se reinicia nos da mas alto que el contador general añadimos el numero a la variable moda y cambiamos el contador general por el que reinicia
 					if (contadorReinicia>contador2){
 						contador2 = contadorReinicia;
 						moda2 = array[x];
 					}
 					//Si tenemos 2 de la misma cantidad retornamos -1
 					if (contador2 == contador) return -1;
 				}
 			}
 			//Retornamos la moda!!!
 			return moda;
 		}

}

module.exports = estadistica;
