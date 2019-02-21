app
//vista curvaNormal
.controller('combinaciones', function($scope, $http) {

    $scope.no_analisis = null;
    $scope.porcentaje = null;
    $scope.message = '';
    $scope.listProducts = [];
    $scope.restante = 100;

    $scope.addItemListProducts = function () {
        if ($scope.no_analisis && $scope.porcentaje) {
            if ($scope.porcentaje > $scope.restante) {
                $scope.message = 'La suma total de elementos no puede pasar del 100%';
                return;
            }
            $http.get('/api/producto/id-analisis/'+$scope.no_analisis)
            .then(response => {
                let product = response.data;
                var exist = $scope.listProducts.find(item => item.identificador == product.identificador);
                if (!exist) {
                    product.porcentaje = $scope.porcentaje;
                    $scope.listProducts.push(product);
                    $scope.no_analisis = null;
                    $scope.porcentaje = null;
                    $scope.restante = getRestante();
                    $scope.message = '';
                    calcularMezcla();
                } else {
                    $scope.message = 'El numero de análisis ya fue agregado';
                }
            })
            .catch(error => {
                console.log(error);
            })
        } else {
            $scope.message = 'se require el numero de análisis y porcentaje';
        }
    }

    function getRestante () {
        return 100 - getTotal();
    }

    function getTotal () {
        let total = 0;
        $scope.listProducts.forEach(element => {
            total += element.porcentaje;
        });
        return total;
    }

    $scope.incrementar = function (product) {
        if (getTotal() < 100) {
            product.porcentaje = parseInt(product.porcentaje) + 1;
            $scope.restante = getRestante();
            calcularMezcla();
        }
    }

    $scope.decrementar = function (product) {
        if (product.porcentaje > 0) {
            product.porcentaje = parseInt(product.porcentaje) - 1;
            $scope.restante = getRestante();
            calcularMezcla();
        }
    }

    function calcularMezcla () {
        if ($scope.restante != 0) return;
        let resultados = {
            Si: 0,
            Al: 0,
            Fe: 0,
            Ca: 0,
            Mg: 0,
            C: 0
        };
        $scope.listProducts.forEach(item => {
            resultados.Si = resultados.Si + (item.porcentaje * item.atributos.Si / 100); 
            resultados.Al = resultados.Al + (item.porcentaje * item.atributos.Al / 100); 
            resultados.Fe = resultados.Fe + (item.porcentaje * item.atributos.Fe / 100); 
            resultados.Ca = resultados.Ca + (item.porcentaje * item.atributos.Ca / 100); 
            resultados.Mg = resultados.Mg + (item.porcentaje * item.atributos.Mg / 100); 
            resultados.C = resultados.C + (item.porcentaje * item.atributos.C / 100);  
        });
        $scope.resultados = resultados;
        var config = getConfigPie();
        for (key in resultados) {
            config.series[0].data.push({name: key, y: resultados[key]});
        }
        $scope.pieChart = config;
    }


});



