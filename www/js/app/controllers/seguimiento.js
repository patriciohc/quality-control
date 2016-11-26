app
// vista search
.controller('search', function($scope, $http) {

    $scope.histogram = {};
    $scope.histogram.series = ['Frecuencia'];

    $scope.scatter = {};
    //$scope.pie = {};

    $scope.pie =
    {
        options: {
            chart: {
                type: 'pie'
            }
        },
        series: [{
            data: [10, 15, 12, 8, 7]
        }],
        title: {
            text: 'Hello'
        },
        loading: false
    }

    $http.get("/api/cat-producto").then(function(response){
        $scope.productos = response.data;
    });

    $scope.gralData = {};

    $scope.changeSelectProducto = function (){
        var producto = $scope.productos[$scope.slProducto];

        var parms = "?nameProducto=" + producto.nombre; // + "&" + "atributo=" + atributo;
        $http.get("/api/atributo/" + parms).then(function(response) {
            var data = response.data;
            $scope.options = {
                chart: {type: 'pie'}
            }
            $scope.title = {text: 'Composicion quimica'}
            $scope.pie.series[0].data = [];
            for (var i in data){
                $scope.pie.series[0].data.push({name: data[i].atributo, y:data[i].promedio});
                //$scope.pie.data.push(data[i].promedio);
            }
        });
    }

    $scope.changeSelectAtrr = function () {
        //hidenAll();
        var producto = $scope.productos[$scope.slProducto].nombre;
        var atributo = $scope.slAttr;
        var parms = "?nameProducto=" + producto; // + "&" + "atributo=" + atributo;
        $http.get("/api/atributo/" + parms).then(function(response) {
            if (!response.data || !response.data.length) return;
            // histograma de frecuencias
            var frecuencia = binData(response.data);
            $scope.histogram.labels = frecuencia.map(function(obj){
                return obj[0];
            });
            var data = frecuencia.map(function(obj){
                return obj[1];
            });
            $scope.histogram.data = [data];

            // grafica de dispercion
            $scope.scatter.series = ['Series A', 'Series B'];
            $scope.scatter.data = (function (data){
                var array = []
                for (var i in data){
                    var item = data[i];
                    var point = {
                        x: i,
                        y: item
                    }
                    array.push(point);
                }
                return array;
            })(response.data);

            $scope.scatter.labels = (function(data){
                var array = new Array(data.length);
                for (var i = 0; i < data.length; i++){
                    array[i] = i;
                }
                return array;
            })($scope.scatter.data);

            //$scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
            $scope.scatter.options = {
                showLines: false,
                scales: {
                    yAxes: [
                        { type: 'linear', }
                    ],
                    xAxes: [{
                        //type: 'linear',
                        display: false,
                        position: 'bottom'
                    }]
                }
            }

            // promedio
            $scope.gralData.promedio = estadistica.getPromedio(dataColumn);
            // desviacion estandar
            $scope.gralData.desviacion = estadistica.desvStd(dataColumn);
            // rango
            $scope.gralData.rango = 232;
        });
    }

});


