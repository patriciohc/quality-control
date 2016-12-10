app
//vista curvaNormal
.controller('curva_Gauss', function($scope, $http) {

    var pointClick1 = null;
    var pointClick2 = null;

    var onClickPoint = function (evt) {
        var datosG = $scope.data[$scope.slAttr];
        $scope.$apply(function(){
            if (pointClick1 == null){
                pointClick1 = {x: evt.point.x, y:evt.point.y};
                $scope.normalChart.series[0].zones[0].value = pointClick1.x;
                $scope.normalChart.series[0].zones[1].value = Infinity;
                
                $scope.normalChart.series[0].zones[0].color = 'rgba(90,100,255,.85)';//"green";
                $scope.normalChart.series[0].zones[1].color = 'rgba(90,155,200,.05)';//"blue";
                $scope.normalChart.series[0].zones[2].color = 'rgba(90,155,200,.05)';//"blue";

                var z = (datosG.promedio - pointClick1.x)/datosG.desvStd;
                $scope.probabilidad = estadistica.areaBajoCurvaNormal(Infinity, z);
            }
            else if (pointClick2 == null) {
                pointClick2 = {x: evt.point.x, y:evt.point.y};;
                $scope.normalChart.series[0].zones[0].value = Math.min(pointClick1.x, pointClick2.x);
                $scope.normalChart.series[0].zones[1].value = Math.max(pointClick1.x, pointClick2.x);
                
                $scope.normalChart.series[0].zones[0].color = 'rgba(90,155,200,.05)';//"blue";
                $scope.normalChart.series[0].zones[1].color = 'rgba(90,100,255,.85)';//"green";
                $scope.normalChart.series[0].zones[2].color = 'rgba(90,155,200,.05)';//"blue";

                var z1 = (datosG.promedio - pointClick1.x)/datosG.desvStd;
                var z2 = (datosG.promedio - pointClick2.x)/datosG.desvStd;
                $scope.probabilidad = estadistica.areaBajoCurvaNormal(z1, z2);   

                pointClick1 = pointClick2 = null;

            } 
        });
    }

    $scope.normalChart = getNormalChart(onClickPoint);
    $scope.histogram = getConfigColumn();

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
        $scope.datosG = $scope.data[$scope.slAttr];
        // campana de gauss
        $scope.datosG.data.sort(function (a, b) {
            if (a.value > b.value) {
                return 1;
            }
            if (a.value < b.value) {
                return -1;
            }
            // a must be equal to b
            return 0;
        });

        var min = $scope.datosG.data[0].value;
        var max = $scope.datosG.data[$scope.datosG.data.length-1].value;
        var paso = (max - min) / 100;
        
        var multiplicando = 1/Math.sqrt(2*Math.PI);
        var f = function(x){
            var z = ($scope.datosG.promedio - x)/$scope.datosG.desvStd;
            var multiplicador = Math.pow(Math.E,-1/2*Math.pow(z,2));
            return Math.round10(multiplicando * multiplicador, -4);
        }
        
        var indicesXY = [];
        var y = 1;
        var x = min;
        while (y > 0.0001) {
            x -= paso;
            y = f(x);
            indicesXY.unshift([x,y]);
        }
        
        y = 1;
        x = min;
        while (y > 0.0001) {
            x += paso;
            y = f(x);
            indicesXY.push([x,y]);
        }

        $scope.normalChart.series[0].data = indicesXY;
        
        // grafica de frecuencia
        var frecuencia = $scope.datosG.data.map(function(obj){
            return obj.value;
        });
        frecuencia = binData(frecuencia);
        $scope.histogram.series[0].data = frecuencia;

        $scope.histogram.xAxis.plotLines[0].value =  $scope.datosG.promedio;
        $scope.histogram.xAxis.plotLines[0].label.text = 'Promedio: ' + Math.round10($scope.datosG.promedio, -2);
    }

});



