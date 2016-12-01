// menu
app.controller('menu', function($scope, $state) {

    $scope.busqueda = function(){
        var texto = $scope.txtBusqueda;
        $state.go("menu.search", {texto: texto});
    }


    $(function() {
        var offset = $("#menu").offset();
        var topPadding = 15;
        $(window).scroll(function() {
        if ($("#menu").height() < $(window).height() && $(window).scrollTop() > offset.top) { /* LINEA PARA NO ANIMAR SI EL Menu ES MAYOR AL TAMANO DE PANTALLA */
        $("#menu").stop().animate({
        marginTop: $(window).scrollTop() - offset.top + topPadding
        });
        } else {
        $("#menu").stop().animate({
        marginTop: 0
        });
        };
        });
    });
});
