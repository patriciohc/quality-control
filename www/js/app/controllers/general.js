app
// vista general
.controller('general', function($scope, $http) {
    $http.get('/api/atributo').then(function(response){
        $scope.productos = response.data;
        
        for (var i = 0; i < $scope.productos.length; i++){
            var config = getConfigPie();
            var producto = $scope.productos[i];
            for (var j in producto.data){
                config.series[0].data.push({name: producto.data[j].atributo, y: producto.data[j].promedio});
            }
            $scope.$apply(function(){
                $scope["pieChart_" + i] = config;
            });
        }
    });
});
