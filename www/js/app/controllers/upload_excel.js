// vista uploadExcel
app.controller('uploadExcel', function($scope, $http) {
    var sheets;
    $scope.onLoadFile = function(fileBase64){
        sheets = excel.readExcel(fileBase64);
        $scope.hojas = sheets;
    };

    $http.get("/api/cat-producto").then(function(response){
        $scope.productos = response.data;
    });

     //funcion de llenado de select "Nombre producto"
    $scope.llenadoSelectNameProd = function() {
        var nombreProducto = $scope.nameProduc;
        var producto = { nombre: nombreProducto, atributos: [] };
        $http.post("/api/cat-producto", producto).then( function(response){
            var result =  response.data;
            if (result.message) {
                alert("Hubo un problema al guardar.");
            } else
            actualizaSelectProd();
        });
    }

    function actualizaSelectProd(){
        $http.get("/api/cat-producto").then(function(response){
            $scope.productos = response.data;
        });
    }

    $scope.ObtenerHojaexc = function(){
        var sheet = sheets[$scope.nameHojaExcel];
        $scope.identificadores = sheet.head;
        $scope.lotes = sheet.head;
        $scope.ElementosChk = sheet.head;
    }

        //funcion de crear y guardar Json
    $scope.guardarJson = async function() {
        var sheet = sheets[$scope.nameHojaExcel];
        var producto = $scope.productos[$scope.nuevProducto];
        var idenProdJson = $scope.identificaProd;

        var jsonExcel = [];
        var checks = $scope.ElementosChk.map(function(obj){
            if(obj.selected) return obj.name;
        });
        checks = checks.filter(Boolean);
        for (var i in sheet.data) {
            var item = sheet.data[i];
            var row = {
                nombre: producto.nombre,
                identificador: item[idenProdJson].toString(),
                lote: item[$scope.loteName],
                atributos: {}
            }
            for (var j in checks)
                row.atributos[checks[j]] = Math.round10(item[checks[j]], -2);
            jsonExcel.push(row);
        }

        var parametros = {
            id: producto._id,
            atributos: checks,
        }

        try {
            var message = await $http.put('/api/cat-producto/', parametros);
            message = await $http.post('/api/producto/', jsonExcel);
            alert('Los datos se guardaron correctamenta');
            init();
            console.log(message);
        } catch (error) {
            alert( "Fallo la insercion: " + JSON.stringify(error));
        }

    }

    function init() {
        $scope.nuevProducto = '';
        $scope.nameHojaExcel = '';
        $scope.identificaProd = '';
        $scope.loteName = '';
        $scope.ElementosChk = [];
    }

});