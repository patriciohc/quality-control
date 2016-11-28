app
// vista search
.controller('search', function($scope, $http) {

    //$scope.scatter = getConfigScatter();
    //$scope.histogram = getConfigColumn();
    $scope.pie = getConfigPie();
    $scope.gralData = {};

    $http.get("/api/cat-producto").then(function(response){
        $scope.productos = response.data;
    });

    $scope.changeSelectProducto = function (){
        var producto = $scope.productos[$scope.slProducto];

        var parms = "?nameProducto=" + producto.nombre; // + "&" + "atributo=" + atributo;
        $http.get("/api/atributo/" + parms).then(function(response) {
            $scope.data = response.data;
            for (var i in $scope.data){
                $scope.pie.series[0].data.push({name: $scope.data[i].atributo, y: $scope.data[i].promedio});
            }

            //$scope.pie.plotOptions.series.point.events.click = function(){
            //    $scope.slAttr = this.name;
            //    $scope.changeSelectAtrr();
                //$scope.$apply($scope.changeSelectAtrr());
            //}
        });
    }


    $scope.changeSelectAtrr = function () {
        var data = $scope.data[$scope.slAttr];

        $scope.scatter.series[0].data = data.map(function(obj){
            return [obj.identificador, obj.value];
        });

        //hidenAll();
        //var producto = $scope.productos[$scope.slProducto].nombre;
        //var atributo = $scope.slAttr;
        //var parms = "?nameProducto=" + producto; // + "&" + "atributo=" + atributo;
//        $http.get("/api/atributo/" + parms).then(function(response) {
//            if (!response.data || !response.data.length) return;
//            // histograma de frecuencias
//            var frecuencia = binData(response.data);
//            $scope.histogram.labels = frecuencia.map(function(obj){
//                return obj[0];
//            });
//            var data = frecuencia.map(function(obj){
//                return obj[1];
//            });
//            $scope.histogram.data = [data];
//
//            // grafica de dispercion
//            $scope.scatter.series = ['Series A', 'Series B'];
//            $scope.scatter.data = (function (data){
//                var array = []
//                for (var i in data){
//                    var item = data[i];
//                    var point = {
//                        x: i,
//                        y: item
//                    }
//                    array.push(point);
//                }
//                return array;
//            })(response.data);
//
//            $scope.scatter.labels = (function(data){
//                var array = new Array(data.length);
//                for (var i = 0; i < data.length; i++){
//                    array[i] = i;
//                }
//                return array;
//            })($scope.scatter.data);
//
//            //$scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
//            $scope.scatter.options = {
//                showLines: false,
//                scales: {
//                    yAxes: [
//                        { type: 'linear', }
//                    ],
//                    xAxes: [{
//                        //type: 'linear',
//                        display: false,
//                        position: 'bottom'
//                    }]
//                }
//            }
//
//            // promedio
//            $scope.gralData.promedio = estadistica.getPromedio(dataColumn);
//            // desviacion estandar
//            $scope.gralData.desviacion = estadistica.desvStd(dataColumn);
//            // rango
//            $scope.gralData.rango = 232;
        //});
    }

//    makeScatterChart = function(sheet, campo){
//        config.series = getDataScatter(sheet, campo);
//        config.yAxis.plotLines = getPlotLinesScatter(sheet, campo);
//        config.plotOptions.series.point.events.click = function(){
//            $scope.informacionGral = excel.getRow(sheet, this.category)[0];
//            var dataPieCharts = [];
//            for (var i = 0; i < excelInfo.grupos.length; i++){
//                var data = getDataPieChart(dicToArray($scope.informacionGral), excelInfo.grupos[i].elementos);
//                dataPieCharts.push(data);
//            }
//            $scope.$apply( function(){
//                makePieChart(dataPieCharts);
//                $scope.pieCharts = excelInfo.grupos;
//            });
//        }
//        makeChart("#divDispersion", config);
//
//        $scope.showGraficas = true;
//    }


//
//
//       $scope.checksTable = [];
//
//    /* eventos en select */
//
//    $scope.changeSelectSheet = function(){
//        hidenAll();
//        var sheet = $scope.sheets[$scope.slSheet];
//        $scope.attrs = sheet.head;
//
//        $scope.grupos = getResumenExcel(sheet);
//        $scope.showMainContent = true;
//        var dataPieCharts = [];
//        for (var i = 0; i < excelInfo.grupos.length; i++){
//            var data = getDataPieChart($scope.grupos[i].data, excelInfo.grupos[i].elementos);
//            dataPieCharts.push(data);
//        }
//
//        makePieChart(dataPieCharts);
//
//    }
//
//    $scope.changeSelectFile = function(){
//        var book = excel.books[$scope.slFile];
//        $scope.sheets = book.sheets;
//        if (excel.books.length == 1){
//            $scope.slSheet = 0;
//        }
//
//        $scope.showContent = true;
//    }
//
//    /* Creacion de graficas,  recibe como parametro grupos de datos, dataGrupos.length = cantidad de graficas */
//    makePieChart = function(dataGrupos) {
//        for (var i = 0; i < dataGrupos.length; i++){
//            var config = getConfigPie();
//            config.series[0].data = dataGrupos[i];
//            config.plotOptions.series.point.events.click = function(){
//                $scope.slAttr = this.name;
//                $scope.$apply($scope.changeSelectAtrr());
//            }
//            makeChart("#divCircular" + i, config);
//        }
//
//        $scope.showPieCharts = true;
//    }
//

//
//    makeColumnChart = function(sheet, campo){
//        var dataColumn = excel.getColumn(sheet, campo);
//        var serie = binData(dataColumn);
//        var config = getConfigColumn();
//        config.series[0].name = sheet.name;
//        config.series[0].data = serie;
//        makeChart("#divFrecuencia", config);
//
//        $scope.showGraficas = true;
//    }
//
//    /* evento en tabla de informacion general del sheet*/
//    $scope.clickTable = function () {
//        $scope.slAttr = this.r.name;
//        $scope.changeSelectAtrr();
//    }
//
//    /* busqueda de productos */
//    $scope.BusquedaProductos = function () {
//        if ($scope.txtBusqueda == null ||
//            typeof($scope.txtBusqueda) == "undefined" ||
//            $scope.txtBusqueda.length <= 3 ) {
//            alert("Texto muy corto");
//            return;
//        }
//        var sheet = $scope.sheets[$scope.slSheet];
//        var resultados = excel.search( $scope.txtBusqueda);
//        if (resultados == null || resultados.length == 0){
//            alert("No se encontraron resultados...");
//            return;
//        }
//        hidenAll();
//        $scope.resultadoBusqueda = excel.search($scope.txtBusqueda);
//        $scope.showMainContent = true;
//
//    }
//
//    $scope.clickOnTableResumen = function(){
//        $scope.informacionGral = this.r;
//        var dataPieCharts = [];
//        for (var i = 0; i < excelInfo.grupos.length; i++){
//            var data = getDataPieChart(dicToArray($scope.informacionGral), excelInfo.grupos[i].elementos);
//            dataPieCharts.push(data);
//        }
//        makePieChart(dataPieCharts);
//
//        $scope.pieCharts = excelInfo.grupos;
//    }
//
//    function hidenAll() {
//        $scope.showMainContent = false;
//        $scope.showPanelDer = false;
//        $scope.showGraficas = false;
//        $scope.grupos = false;
//        $scope.informacionGral = false;
//        $scope.showPieCharts = false;
//        $scope.resultadoBusqueda = false;
//    }
//
//     $scope.exportToExcelTableSearch = function(){
//        var c = $scope.checksTable;
//        var arrayIds = [];
//        for ( var index in $scope.checksTable ){
//            arrayIds.push($scope.resultadoBusqueda[index].ID_ANALISIS);
//        }
//        var rows = excel.getRowsInList(arrayIds);
//        var head = arrayDicToArray(excel.books[0].sheets[0].head, "name");
//        var xml = excel.jsonToSsXml(rows, head);
//        excel.download(xml, "expoert.xls", 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//    }
//
//    $scope.selectAllChecks = function(){
//        for (var i = 0; i < $scope.resultadoBusqueda.length ; i++){
//            $scope.checksTable[i] = this.checkAll;
//        }
//    }
//
//    $scope.exportToExcelTableResumen = function(){
//        var header = "";
//        var body = "";
//        for (var i = 0; i < excelInfo.grupos.length; i++){
//            header += excel.emitXmlHeader(excelInfo.grupos[i].elementos);
//            body += excel.jsonToSsXmlRow($scope.grupos[i].data);
//            //var data = getDataPieChart($scope.grupos[i].data, excelInfo.grupos[i].elementos);
//            //dataPieCharts.push(data);
//        }
//
//        var xml = excel.emitXmlInfo() + header;
//        xml += body;
//        xml += excel.emitXmlFooter();
//
//        excel.download(xml, 'test.xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//
//
//    }

});


