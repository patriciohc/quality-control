app
// vista search
.controller('seguimiento', function($scope, $http) {

    $scope.scatter = getConfigScatter();
    $scope.histogram = getConfigColumn();
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

        $scope.scatter.series[0].data = data.data.map(function(obj){
            return [obj.identificador, obj.value];
        });

        var frecuencia = data.data.map(function(obj){
            return obj.value;
        });

        frecuencia = binData(frecuencia);
        $scope.histogram.series[0].data = frecuencia;

//        $http.get("/api/atributo/" + parms).then(function(response) {
//            if (!response.data || !response.data.length) return;
//            // histograma de frecuencias
//            
//            $scope.histogram.labels = frecuencia.map(function(obj){
//                return obj[0];
//            });
//            var data = frecuencia.map(function(obj){
//                return obj[1];
//            });
//            $scope.histogram.data = [data];
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



// var updateSelectFiles = function(book) {
//     var select = document.getElementById("slFile");
//     var title = document.getElementById("labelTitle");
//     title.innerHTML = book.name;
//     select.innerHTML = "";
//     var option = document.createElement("option");
//     option.text = "seleccione el archivo";
//     option.value = "-1";
//     select.add(option);
//     for (var i = 0; i < excel.books.length; i++){
//         option = document.createElement("option");
//         var item = excel.books[i];
//         option.text = item.name;
//         option.value = i;
//         select.add(option);
//     }
//     //$("#slFile").slideDown();
// }

// function getResumenExcel(sheet){
//     var grupos = [];
//     for (var i = 0; i < excelInfo.grupos.length; i++){
//         var includeElemt = excelInfo.grupos[i].elementos; // elementos a incluir en calculos
//         var g = auxGetResumenExcel(sheet, includeElemt);
//         g.name = excelInfo.grupos[i].name;
//         grupos.push( g );
//     }
//     return grupos


// }
// // funcion axuliar a getResumenExcel
// function auxGetResumenExcel(sheet, includeElemt) {
//     var resumen = {
//         name: "",
//         data:[]
//     };
//      for (var i = 3; i < sheet.head.length; i++ ){
//         if (includeElemt.indexOf(sheet.head[i].normal) == -1) continue;
//         var column = excel.getColumn(sheet, sheet.head[i].normal);
//         var newItem =  {
//             name: sheet.head[i].name,
//             value: estadistica.getPromedio(column), // promedio
//             desvStd: estadistica.desvStd(column),
//             rango: estadistica.rango(column),
//         }
//         resumen.data.push(newItem);
//     }
//     return resumen;
// }

// function getDataPieChart(info, includeElemt) {
//     var data = []
//     for (var i = 0; i < info.length; i++){
//         if (includeElemt.indexOf(info[i].name) >= 0){
//             var item = {};
//             item.name = info[i].name;
//             item.y = info[i].value;
//             data.push(item);
//         }
//     }
//     var total = 0;
//     for (var i = 0; i < data.length; i++) {
//         total += data[i].y;
//     }
//     data.push({name:"otros", y: 100 - total});
//     return data;
// }

// function dicToArray(dic){
//     var keys = Object.keys(dic);
//     var array = [];
//     for (var i = 0; i < keys.length; i++){
//         var item = {}
//         item.name = keys[i];
//         item.value = dic[keys[i]];
//         array.push(item);
//     }
//     return array;
// }

// function arrayDicToArray(arrayDic, campo){
//     var array = [];
//     for (var i = 0; i < arrayDic.length; i++){
//         var item = arrayDic[i]
//         var value = item[campo];
//         array.push(value);
//     }
//     return array;
// }



// function getDataScatter(sheet, campo){
//     var data = [];
//     for (var i = 0; i < sheet.data.length; i++){
//         var item = sheet.data[i];
//         var dato = [item.ID_ANALISIS, item[campo]];
//         data.push(dato);
//     }
//     var series =  [{
//         name: campo,
//         color: 'rgba(36, 43, 252, .6)',
//         data: data
//     }];
//     return series;
// }

// function getPlotLinesScatter(sheets, campo){
//     var linesPlot = [];
//     var dataColumn = excel.getColumn(sheet, campo);
//     // promedio
//     var promedio = estadistica.getPromedio(dataColumn);
//     var line = getConfigPlotLines("Promedio: " + promedio, promedio);
//     linesPlot.push(line)
//     // desviacion estandar
//     var desvStd = estadistica.desvStd(dataColumn);
//     // abajo
//     line = getConfigPlotLines("Desviacion STD: " + desvStd, promedio - desvStd);
//     line.color = "blue";
//     linesPlot.push(line);
//     // arriba
//     line = getConfigPlotLines("Desviacion STD: " + desvStd, promedio + desvStd);
//     line.color = "blue";
//     linesPlot.push(line);

//     //configDispersion.yAxis.plotLines = linesPlot;
//     return linesPlot;
// }