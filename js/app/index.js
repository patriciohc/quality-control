var sheet = null; // hoja de trabajo actual

var app = angular.module('mainApp', ['ngSanitize']);
/*
app.directive('pieChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            title: '@',
            data: '=',
            plotLines: '=',
            clickSerie: '&',
        },
        link: function (scope, element) {
            var config = getConfigPie();
            config.series[0].data = scope.data;
            config.plotOptions.series.point.events.click = scope.clickSerie;
            config.title.text = scope.title;
            config.yAxis.plotLines = scope.plotLines;

            Highcharts.chart(element[0], config);
        } // fin link
    };
});


app.directive('scatterChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            title: '@',
            data: '=',
            clickSerie: '&',
        },
        link: function (scope, element) {
            var config = getConfigScatter();
            config.series = scope.series;
            config.plotOptions.series.point.events.click = scope.clickSerie;
            config.title.text = scope.title;

            Highcharts.chart(element[0], config);
        } // fin link
    };
});
*/

app.controller('mainControl', function($scope) {

    $scope.showMainContent = false;
    $scope.showPanelDer = false;
    $scope.showGraficas = false;

    $scope.changeSelectAtrr = function () {
        sheet = $scope.sheets[$scope.slSheet];
        var dataColumn = excel.getColumn(sheet, $scope.slAttr);
        $scope.titlePanel = excel.books[$scope.slFile].name.split(".")[0];
        // promedio
        $scope.promedio = estadistica.getPromedio(dataColumn);
        // desviacion estandar
        $scope.desviacion = estadistica.desvStd(dataColumn);
        // rango
        $scope.rango = 232;
        // graficas
        $scope.makeScatterChart(sheet, $scope.slAttr);
        $scope.makeColumnChart(sheet, $scope.slAttr);

        // mostrar contenido
        $scope.showMainContent = true;
        $scope.showPanelDer = true;
        $scope.showPieChart = false;
        $scope.informacionGral = false;
    }

    $scope.changeSelectSheet = function(){
        var sheet = $scope.sheets[$scope.slSheet];
        $scope.attrs = sheet.head;
        $scope.resumen = getResumenExcel(sheet);
        $scope.showMainContent = true;
        var data = getDataPieChart($scope.resumen);
        $scope.makePieChart(data);

        $scope.slAttr = false;
        $scope.informacionGral =  false;
        $scope.showGraficas = false; 
    }

    $scope.changeSelectFile = function(){
        var book = excel.books[$scope.slFile];
        $scope.sheets = book.sheets;
        if (excel.books.length == 1){
            $scope.slSheet = 0;
            $scope.changeSelectSheet();
        }
        $scope.showContent = true;
    }

    $scope.makePieChart = function(data) {
        var config = getConfigPie();
        config.series[0].data = data;
        config.plotOptions.series.point.events.click = function(){
            $scope.slAttr = this.name;
            $scope.$apply($scope.changeSelectAtrr());
        }
        makeChart("#divCircular", config);

        $scope.showPieChart = true;
    }

    $scope.makeScatterChart = function(sheet, campo){
        var config = getConfigScatter();
        config.series = getDataScatter(sheet, campo);
        config.yAxis.plotLines = getPlotLinesScatter(sheet, campo); 
        config.plotOptions.series.point.events.click = function(){
            var info = excel.getRow(sheet, this.category)[0];
            var data = getDataPieChart(dicToArray(info));
            $scope.$apply( function(){
                $scope.makePieChart(data);
                $scope.informacionGral = "No Analisis:  " + "<b>" + info.ID_ANALISIS + "</b><br/>";
                $scope.informacionGral +=  "No Lote:  " + "<b>" + info.LOTE + "</b><br/>";
                $scope.informacionGral +=  "Cantidad:  " + "<b>" + info.CANTIDAD + "</b><br/>";
            });
        }
        makeChart("#divDispersion", config);

        $scope.showGraficas = true;
    }

    $scope.makeColumnChart = function(sheet, campo){
        var dataColumn = excel.getColumn(sheet, campo);
        var serie = binData(dataColumn);
        var config = getConfigColumn();
        config.series[0].name = sheet.name;
        config.series[0].data = serie;
        makeChart("#divFrecuencia", config);

        $scope.showGraficas = true;
    }

    $scope.clickTable = function () {
        $scope.slAttr = this.r.name;
        $scope.changeSelectAtrr();
    }

});


var updateSelectFiles = function(book) {
    var select = document.getElementById("slFile");
    var title = document.getElementById("labelTitle");
    title.innerHTML = book.name;
    select.innerHTML = "";
    var option = document.createElement("option");
    option.text = "seleccione el archivo";
    option.value = "-1";
    select.add(option);
    for (var i = 0; i < excel.books.length; i++){
        option = document.createElement("option");
        var item = excel.books[i];
        option.text = item.name;
        option.value = i;
        select.add(option);
    }
    $("#slFile").slideDown();

    //$("#tbResultadoGral").slideDown();
}

function getResumenExcel(sheet){
    var resumen = [];
    for (var i = 3; i < sheet.head.length; i++ ){
        var column = excel.getColumn(sheet, sheet.head[i].normal);
        var newItem =  {
            name: sheet.head[i].name,
            value: estadistica.getPromedio(column), // promedio
            desvStd: estadistica.desvStd(column),
            rango: estadistica.rango(column),
        }
        resumen.push(newItem);
    }
    return resumen;
}

function getDataPieChart(info) {
    var includeElemt = excelInfo.elementos; // elementos a incluir en calculos
    var data = []
    for (var i = 0; i < info.length; i++){
        if (includeElemt.indexOf(info[i].name) >= 0){
            var item = {};
            item.name = info[i].name;
            item.y = info[i].value;
            data.push(item);
        }

    }
    /*var total = 0;
    for (var i = 0; i < info.length; i++) {
        total += info[i].y;
    }*/
    //data.push({name:"otros", y: 100 - total});
    return data;
}

function dicToArray(dic){
    var keys = Object.keys(dic);
    var array = [];
    for (var i = 0; i < keys.length; i++){
        var item = {}
        item.name = keys[i];
        item.value = dic[keys[i]];
        array.push(item);
    }
    return array;
}



function getDataScatter(sheet, campo){
    var data = [];
    for (var i = 0; i < sheet.data.length; i++){
        var item = sheet.data[i];
        var dato = [item.ID_ANALISIS, item[campo]];
        data.push(dato);
    }
    var series =  [{
        name: campo,
        color: 'rgba(36, 43, 252, .6)',
        data: data
    }];
    return series;
}

function getPlotLinesScatter(sheets, campo){
    var linesPlot = [];
    var dataColumn = excel.getColumn(sheet, campo);
    // promedio
    var promedio = estadistica.getPromedio(dataColumn);
    var line = getConfigPlotLines("Promedio: " + promedio, promedio);
    linesPlot.push(line)
    // desviacion estandar
    var desvStd = estadistica.desvStd(dataColumn);
    // abajo 
    line = getConfigPlotLines("Desviacion STD: " + desvStd, promedio - desvStd);
    line.color = "blue";
    linesPlot.push(line);
    // arriba
    line = getConfigPlotLines("Desviacion STD: " + desvStd, promedio + desvStd);
    line.color = "blue";
    linesPlot.push(line);

    //configDispersion.yAxis.plotLines = linesPlot;
    return linesPlot;
}

/*
function clickTry(){
    var element = document.getElementById("mainApp");
    var scope = angular.element(element).scope();
    scope.messege();
}
*/

$( document ).ready(function() {
    excel.init("fileExcel", updateSelectFiles);
});