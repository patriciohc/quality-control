app

//vista curvaNormal
.controller('curva_Gauss', function($scope, $http) {

    $scope.normalChart = getNormalChart();

    $http.get("/api/cat-producto").then(function(response){
        $scope.productosG = response.data;
        //$scope.attrs = $scope.productosG[0].atributos;
    });


    $scope.seleccionPrudGauss = function (){
        var producto = $scope.productosG[$scope.slProductoG];

        var parms = "?nameProducto=" + producto.nombre; // + "&" + "atributo=" + atributo;
        $http.get("/api/atributo/" + parms).then(function(response) {
            $scope.data = response.data;
        });
    }

    $scope.changeAtribGauss = function() {
        var datosG = $scope.data[$scope.slAttr];

        datosG.data.sort(function (a, b) {
            if (a.value > b.value) {
                return 1;
            }
            if (a.value < b.value) {
                return -1;
            }
            // a must be equal to b
            return 0;
        });

        var min = datosG.data[0].value;
        var max = datosG.data[datosG.data.length-1].value;
        var paso = (max - min) / 100;
        var dataX = new Array(100)
        for (var i = 0; i < dataX.length; i++){
            dataX[i] = min + paso * i;
        }

        var multiplicando = 1/Math.sqrt(2*Math.PI);
        var indicesXY = [];
        for(var i = 0; i < dataX.length; i++) {
            var x = dataX[i];
            var z = (datosG.promedio - x)/datosG.desvStd;
            var multiplicador = Math.pow(Math.E,-1/2*Math.pow(z,2));
            var y = multiplicando * multiplicador;
            indicesXY.push([x,y]);
        }
        $scope.normalChart.series[0].data = indicesXY


        // function toggleBands(chart) {
        //     $.each(chart.xAxis[0].plotLinesAndBands, function(index,el){
        //         if(el.svgElem != undefined) {
        //             el.svgElem[ el.visible ? 'show' : 'hide' ]();
        //             el.visible = !el.visible;
        //         }
        //     });
        // }
        ///termina

    }


});



