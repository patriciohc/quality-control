var sheet = null; // hoja de trabajo actual

var app = angular.module('mainApp', []);

app.controller('mainControl', function($scope) {

    $scope.changeSelectAtrr = function (){
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
        setConfigDispersion(sheet, $scope.slAttr);
        setConfigFrecuencia(sheet, $scope.slAttr);
        generarGraficas();
    }

    $scope.changeSelectSheet = function(){
        var sheet = $scope.sheets[$scope.slSheet];
        $scope.attrs = sheet.head;
        //$scope.attrs = 
    }

    $scope.changeSelectFile = function(){
        var book = excel.books[$scope.slFile];
        $scope.sheets = book.sheets;
        if (excel.books.length == 1){
            $scope.slSheet = 0;
            $scope.changeSelectSheet();
        }
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
}

function onClickSerie() {
    var row = excel.getRow(sheet, this.category)[0];
    var data  = [
        {name: "SiO2", y: row.SiO2},
        {name: "Al2O3", y: row.Al2O3},
        {name: "FeO", y: row.FeO},
        {name: "CaO", y: row.CaO},
        {name: "MgO", y: row.MgO},
        {name: "C", y: row.C},
        {name: "S", y: row.S},
        {name: "P x C - C", y: row.P_X_C - row.C}
    ]
    var total = 0;
    for (var i = 0; i < data.length; i++){
        total += data[i].y;
    }
    data.push({name:"otros", y: 100 - total});
    configPie.series[0].data = data;
    updatePie();
}



function setConfigDispersion(sheet, campo){
    var serie = [];
    for (var i = 0; i < sheet.data.length; i++){
        var item = sheet.data[i];
        var dato = [item.ID_ANALISIS, item[campo]];
        serie.push(dato);
    }
    configDispersion.series[0].data = serie;
    configDispersion.series[0].name = campo;
    //configDispersion.title.text = sheet.name;
    // plot lines
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

    configDispersion.yAxis.plotLines = linesPlot;
}

function setConfigFrecuencia(sheet , campo){
    var dataColumn = excel.getColumn(sheet, campo);
    var serie = binData(dataColumn);
    configHistograma.series[0].name = sheet.name;
    //configHistograma.title.text = sheet.name; 
    configHistograma.series[0].data = serie;
}


$( document ).ready(function() {
    excel.init("fileExcel", updateSelectFiles);
});