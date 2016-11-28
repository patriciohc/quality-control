//var sheet = null; // hoja de trabajo actual

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
    $scope.guardarJson = function() {
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
                identificador: item[idenProdJson],
                atributos: {}
            }
            for (var j in checks)
                row.atributos[checks[j].name] = item[checks[j].name];
            jsonExcel.push(row);
        }

        var parametros = {
            id: producto._id,
            atributos: checks,
        }

       $http.put('/api/cat-producto/', parametros)
        .success(function(data, status) {
            $scope.message = data;
        })
        .error(function(data, status) {
            alert( "Fallo la insercion: " + JSON.stringify({data: data}));
        });

	   $http.post('/api/producto/', jsonExcel)
        .success(function(data, status, headers, config) {
			$scope.message = data;
		})
        .error(function(data, status, headers, config) {
			alert( "Fallo la insercion: " + JSON.stringify({data: data}));
		});
    }


})

.controller('mainControl', function($scope) {

    $scope.checksTable = [];

    /* eventos en select */

    $scope.changeSelectSheet = function(){
        hidenAll();
        var sheet = $scope.sheets[$scope.slSheet];
        $scope.attrs = sheet.head;

        $scope.grupos = getResumenExcel(sheet);
        $scope.showMainContent = true;
        var dataPieCharts = [];
        for (var i = 0; i < excelInfo.grupos.length; i++){
            var data = getDataPieChart($scope.grupos[i].data, excelInfo.grupos[i].elementos);
            dataPieCharts.push(data);
        }

        makePieChart(dataPieCharts);

    }

    $scope.changeSelectFile = function(){
        var book = excel.books[$scope.slFile];
        $scope.sheets = book.sheets;
        if (excel.books.length == 1){
            $scope.slSheet = 0;
        }

        $scope.showContent = true;
    }

    /* Creacion de graficas,  recibe como parametro grupos de datos, dataGrupos.length = cantidad de graficas */
    makePieChart = function(dataGrupos) {
        for (var i = 0; i < dataGrupos.length; i++){
            var config = getConfigPie();
            config.series[0].data = dataGrupos[i];
            config.plotOptions.series.point.events.click = function(){
                $scope.slAttr = this.name;
                $scope.$apply($scope.changeSelectAtrr());
            }
            makeChart("#divCircular" + i, config);
        }

        $scope.showPieCharts = true;
    }

    makeScatterChart = function(sheet, campo){
        var config = getConfigScatter();
        config.series = getDataScatter(sheet, campo);
        config.yAxis.plotLines = getPlotLinesScatter(sheet, campo);
        config.plotOptions.series.point.events.click = function(){
            $scope.informacionGral = excel.getRow(sheet, this.category)[0];
            var dataPieCharts = [];
            for (var i = 0; i < excelInfo.grupos.length; i++){
                var data = getDataPieChart(dicToArray($scope.informacionGral), excelInfo.grupos[i].elementos);
                dataPieCharts.push(data);
            }
            $scope.$apply( function(){
                makePieChart(dataPieCharts);
                $scope.pieCharts = excelInfo.grupos;
            });
        }
        makeChart("#divDispersion", config);

        $scope.showGraficas = true;
    }

    makeColumnChart = function(sheet, campo){
        var dataColumn = excel.getColumn(sheet, campo);
        var serie = binData(dataColumn);
        var config = getConfigColumn();
        config.series[0].name = sheet.name;
        config.series[0].data = serie;
        makeChart("#divFrecuencia", config);

        $scope.showGraficas = true;
    }

    /* evento en tabla de informacion general del sheet*/
    $scope.clickTable = function () {
        $scope.slAttr = this.r.name;
        $scope.changeSelectAtrr();
    }

    /* busqueda de productos */
    $scope.BusquedaProductos = function () {
        if ($scope.txtBusqueda == null ||
            typeof($scope.txtBusqueda) == "undefined" ||
            $scope.txtBusqueda.length <= 3 ) {
            alert("Texto muy corto");
            return;
        }
        var sheet = $scope.sheets[$scope.slSheet];
        var resultados = excel.search( $scope.txtBusqueda);
        if (resultados == null || resultados.length == 0){
            alert("No se encontraron resultados...");
            return;
        }
        hidenAll();
        $scope.resultadoBusqueda = excel.search($scope.txtBusqueda);
        $scope.showMainContent = true;

    }

    $scope.clickOnTableResumen = function(){
        $scope.informacionGral = this.r;
        var dataPieCharts = [];
        for (var i = 0; i < excelInfo.grupos.length; i++){
            var data = getDataPieChart(dicToArray($scope.informacionGral), excelInfo.grupos[i].elementos);
            dataPieCharts.push(data);
        }
        makePieChart(dataPieCharts);

        $scope.pieCharts = excelInfo.grupos;
    }

    function hidenAll() {
        $scope.showMainContent = false;
        $scope.showPanelDer = false;
        $scope.showGraficas = false;
        $scope.grupos = false;
        $scope.informacionGral = false;
        $scope.showPieCharts = false;
        $scope.resultadoBusqueda = false;
    }

     $scope.exportToExcelTableSearch = function(){
        var c = $scope.checksTable;
        var arrayIds = [];
        for ( var index in $scope.checksTable ){
            arrayIds.push($scope.resultadoBusqueda[index].ID_ANALISIS);
        }
        var rows = excel.getRowsInList(arrayIds);
        var head = arrayDicToArray(excel.books[0].sheets[0].head, "name");
        var xml = excel.jsonToSsXml(rows, head);
        excel.download(xml, "expoert.xls", 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }

    $scope.selectAllChecks = function(){
        for (var i = 0; i < $scope.resultadoBusqueda.length ; i++){
            $scope.checksTable[i] = this.checkAll;
        }
    }

    $scope.exportToExcelTableResumen = function(){
        var header = "";
        var body = "";
        for (var i = 0; i < excelInfo.grupos.length; i++){
            header += excel.emitXmlHeader(excelInfo.grupos[i].elementos);
            body += excel.jsonToSsXmlRow($scope.grupos[i].data);
            //var data = getDataPieChart($scope.grupos[i].data, excelInfo.grupos[i].elementos);
            //dataPieCharts.push(data);
        }

        var xml = excel.emitXmlInfo() + header;
        xml += body;
        xml += excel.emitXmlFooter();

        excel.download(xml, 'test.xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');


    }

})

//vista curvaNormal
.controller('curva_Gauss', function($scope, $http) {

    $http.get("/api/cat-producto").then(function(response){
        $scope.productosG = response.data;
        //$scope.attrs = $scope.productosG[0].atributos;
    });

    //$scope.dataG = [
       // [65, 59, 80, 81, 56, 55, 40],
        //[28, 48, 40, 19, 86, 27, 90]
    //];

    $scope.attrsG = ["SiO2", "Al2O3", "FeO", "CaO"];

    $scope.changeAtribGauss = function() {
        var indicesXY = [];
        var producto = $scope.productosG[$scope.slProductoG].nombre;
        var atributo = $scope.slAttrG;
        var parms = "?nameProducto=" + producto + "&" + "atributo=" + atributo;
        $http.get("/api/atributo" + parms).then(function(response) {
            var datosG = response.data;
             // promedio
                    $scope.promedio = estadistica.getPromedio(datosG);
                     //desviacion estandar
                    $scope.desviacion = estadistica.desvStd(datosG);
            var multiplicando = 1/Math.sqrt(2*Math.PI);
            for(var i = 0; i < datosG.length; i++)
                {
                    var x = datosG[i];
                    var z = ($scope.promedio - x)/$scope.desviacion;
                    var multiplicador = Math.pow(Math.E,-1/2*Math.pow(z,2));
                    var y = multiplicando * multiplicador;
                    indicesXY.push([x,y]);
                }
            //chart.series[0].setData(indicesXY);
            $scope.normalChart.series[0].data = indicesXY;
        });


        $scope.normalChart = {
            chart:{
        renderTo:'container',
        type:'column',
        alignTicks:false,
        marginTop:25
    },
    exporting:{enabled:false},
    title:{text:'Campana de gauss.'},
    tooltip:{
        borderWidth:1,
        formatter:function() {
            return '<b>Range:</b><br/> '+ this.x +'<br/>'+
                '<b>Count:</b> '+ this.y;
        }
    },
    plotOptions:{
        series:{
            minPointLength:1,
            shadow:false,
            marker:{enabled:false}
        },
        area:{
            events:{
                legendItemClick: function() {
                    if (this.name == 'Sigma Bands') {
                        toggleBands(chart);
                    }
                }
            }
        }
    },
    xAxis: {
        lineColor:'#999',
        tickColor:'#ccc'
    },
    yAxis:{
        title:{text:''},
        gridLineColor:'#e9e9e9',
        tickWidth:1,
        tickLength:3,
        tickColor:'#ccc',
        lineColor:'#ccc',
        endOnTick:false,
    },
            exporting: {
            enabled: true
        },
    series:[{
        type:'spline',
        lineWidth:1,
        name:'Curva Normal',
        color:'rgba(90,155,212,.75)',
        fillColor:'rgba(90,155,212,.15)',
        data: []
        //data:[[-3.2807020192309,0.10168053006185],[-3.0425988742109,0.23641431548771],[-2.8044957291909,0.51637633957668],[-2.5663925841709,1.0595354537927],[-2.3282894391509,2.0423080409267],[-2.0901862941309,3.6981421093266],[-1.8520831491109,6.2907516383431],[-1.6139800040909,10.052592494842],[-1.3758768590709,15.090728685704],[-1.1377737140509,21.28133847858],[-0.89967056903087,28.193192861774],[-0.66156742401087,35.086995418605],[-0.42346427899086,41.020853564556],[-0.18536113397085,45.052593912695],[0.052742011049155,46.482716760157],[0.29084515606916,45.052593912695],[0.52894830108917,41.020853564556],[0.76705144610918,35.086995418605],[1.0051545911292,28.193192861773],[1.2432577361492,21.28133847858],[1.4813608811692,15.090728685704],[1.7194640261892,10.052592494842],[1.9575671712092,6.2907516383431],[2.1956703162292,3.6981421093266],[2.4337734612492,2.0423080409267],[2.6718766062692,1.0595354537927],[2.9099797512892,0.51637633957668],[3.1480828963092,0.23641431548771]]
    }]
        }

        //grafica
    var chart = new Highcharts.Chart({

});

        function toggleBands(chart) {
            $.each(chart.xAxis[0].plotLinesAndBands, function(index,el){
                if(el.svgElem != undefined) {
                    el.svgElem[ el.visible ? 'show' : 'hide' ]();
                    el.visible = !el.visible;
                }
            });
        }
        ///termina

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
    //$("#slFile").slideDown();
}

function getResumenExcel(sheet){
    var grupos = [];
    for (var i = 0; i < excelInfo.grupos.length; i++){
        var includeElemt = excelInfo.grupos[i].elementos; // elementos a incluir en calculos
        var g = auxGetResumenExcel(sheet, includeElemt);
        g.name = excelInfo.grupos[i].name;
        grupos.push( g );
    }
    return grupos


}
// funcion axuliar a getResumenExcel
function auxGetResumenExcel(sheet, includeElemt) {
    var resumen = {
        name: "",
        data:[]
    };
     for (var i = 3; i < sheet.head.length; i++ ){
        if (includeElemt.indexOf(sheet.head[i].normal) == -1) continue;
        var column = excel.getColumn(sheet, sheet.head[i].normal);
        var newItem =  {
            name: sheet.head[i].name,
            value: estadistica.getPromedio(column), // promedio
            desvStd: estadistica.desvStd(column),
            rango: estadistica.rango(column),
        }
        resumen.data.push(newItem);
    }
    return resumen;
}

function getDataPieChart(info, includeElemt) {
    var data = []
    for (var i = 0; i < info.length; i++){
        if (includeElemt.indexOf(info[i].name) >= 0){
            var item = {};
            item.name = info[i].name;
            item.y = info[i].value;
            data.push(item);
        }
    }
    var total = 0;
    for (var i = 0; i < data.length; i++) {
        total += data[i].y;
    }
    data.push({name:"otros", y: 100 - total});
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

function arrayDicToArray(arrayDic, campo){
    var array = [];
    for (var i = 0; i < arrayDic.length; i++){
        var item = arrayDic[i]
        var value = item[campo];
        array.push(value);
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

/*$( document ).ready(function() {
    excel.init("fileExcel", updateSelectFiles);
});*/

