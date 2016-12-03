app
// vista correlacion
.controller('correlacion', function($scope, $http) {

    $scope.correlacionChart = getConfigScatter(null);

    $http.get("/api/cat-producto").then(function(response){
        $scope.productos = response.data;
    });

    $scope.changeSelectProducto1 = function () {
        var producto = $scope.productos[$scope.slProducto1];

        var parms = "?nameProducto=" + producto.nombre; // + "&" + "atributo=" + atributo;
        $http.get("/api/atributo/" + parms).then(function(response) {
            $scope.datosProducto1 = response.data;
        });
    }

    $scope.changeSelectProducto2 = function (){
        var producto = $scope.productos[$scope.slProducto2];

        var parms = "?nameProducto=" + producto.nombre; // + "&" + "atributo=" + atributo;
        $http.get("/api/atributo/" + parms).then(function(response) {
            $scope.datosProducto2 = response.data;
        });
    }


    $scope.changeSelectAtrr1 = function () {
        $scope.datosAtributo1 = $scope.datosProducto1[$scope.slAttr1];
    }

    $scope.changeSelectAtrr2 = function () {
        $scope.datosAtributo2 = $scope.datosProducto2[$scope.slAttr2];

        var x = $scope.datosAtributo1.data.map(function(obj){
            return obj.value;
        });

        var y = $scope.datosAtributo2.data.map(function(obj){
            return obj.value;
        });

        var xy = []
        for (var i in x){
            xy.push([x[i], y[i]]);
        }
        $scope.correlacionChart.series[0].data = xy;

        $scope.correlacion = estadistica.getCorrelacion(x, y);
    }

});
