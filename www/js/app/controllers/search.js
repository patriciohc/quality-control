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