// menu
app.controller('menu', function($scope, $state) {

    $scope.busqueda = function(){
        var texto = $scope.txtBusqueda;
        $state.go("menu.search", {texto: texto});
    }
});