app
// vista correlacion
.controller('correlacion', function($scope, $http) {

    var sheets;
    var sheets2;
    $scope.onLoadFileExcel = function(fileBase64){
        sheets = excel.readExcel(fileBase64);
        $scope.hojasEx1 = sheets;
    }
    $scope.onLoadFileExcel2 = function(fileBase64){
        sheets2 = excel.readExcel(fileBase64);
        $scope.hojasEx2 = sheets2;
    }

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

        var xy = [];
        for (var i in x){
            xy.push([x[i], y[i]]);
        }
        
        $scope.correlacionChart.series[0].data = xy;
        $scope.correlacion = estadistica.getCorrelacion(x, y);
        var minX = Math.min.apply(null, x);
        var maxX = Math.max.apply(null, x)
        $scope.correlacionChart.series[1].data = [[minX, $scope.correlacion.f(minX)], [maxX, $scope.correlacion.f(maxX)]];
        $scope.correlacionChart.xAxis.title.text = $("#slAttr1 option:selected").html();
        $scope.correlacionChart.yAxis.title.text = $("#slAttr2 option:selected").html();;

        
    }

    //agregar nuevo excel correlacion

    $scope.changeProdNew1 = function (){
        var hoj = sheets[$scope.slProducto1N];
        $scope.datosAttribNew = hoj.head;
    }

     $scope.changeProdNew2 = function (){
        var hoj2 = sheets2[$scope.slProducto2];
        $scope.datosAttribNew2 = hoj2.head;
    }

     $scope.changeSelectAtribnew1 = function (){
         alert("Alert");
     }

    $('#chkExcelN1').change(function() {
        elementbd = document.getElementById("elementBD");
        elementnew = document.getElementById("elementNuevo");
        check = document.getElementById("chkExcelN1");
        if (check.checked) {
            elementbd.style.display='none';
            elementnew.style.display='block';
        }
        else {
            elementnew.style.display='none';chkExcelN1
            elementbd.style.display='block';
            ('slProducto1N').empty();
        }
    })

        $('#chkExcelN2').change(function() {
        elementbd2 = document.getElementById("elementBD2");
        elementnew2 = document.getElementById("elementNuevo2");
        check2 = document.getElementById("chkExcelN2");
        if (check2.checked) {
            elementbd2.style.display='none';
            elementnew2.style.display='block';
        }
        else {
            elementnew2.style.display='none';
            elementbd2.style.display='block';
        }
    })

});
