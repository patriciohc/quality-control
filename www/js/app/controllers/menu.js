// menu
app.controller('menu', function($scope, $state) {

    $scope.busqueda = function(){
        var texto = $scope.txtBusqueda;
        $state.go("menu.search", {texto: texto});
    }

    /* $(function() {
        var offset = $("#sidebar-wrapper").offset();
        var topPadding = 15;
        $(window).scroll(function() {
        if ($("#sidebar-wrapper").height() < $(window).height() && $(window).scrollTop() > offset.top) { /* LINEA PARA NO ANIMAR SI EL Menu ES MAYOR AL TAMANO DE PANTALLA
        $("#sidebar-wrapper").stop().animate({
        marginTop: $(window).scrollTop() - offset.top + topPadding
        });
        } else {
        $("#sidebar-wrapper").stop().animate({
        marginTop: 0
        });
        };
        });

    }) */

    toggle();
});



