// menu
app.controller('menu', function($scope, $state) {

    $scope.busqueda = function(){
        var texto = $scope.txtBusqueda;
        $state.go("menu.search", {texto: texto});
    }
    toggle();
});



function toggle(){
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });

    $("#menu-toggle-2").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled-2");
        $('#menu ul').hide();
    });

    $(".itemMenu").click(function(e){
          $(".itemMenu").removeClass("active");
          $(this).addClass("active");
    });
}
