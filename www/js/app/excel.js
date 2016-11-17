var excelInfo = null;

$.getJSON("json/excel_info.json")
    
.done(function (json) {
    excelInfo = json;
    //console.log(excelInfo);
});

var excel = {
    /*books contien dos atributos 
    * name: "", // nombre del archivo
    * sheets: [] // hojas del archivo
    *
    * los sheets tienen la siguientes estructura
    *    {
    *        name: "", 
    *        head: {name: "", normal: ""}, 
    *        data: [],
    *    },
    */
    books: [],

// array de sheets 

// boton input file 
//    inputFile: null,
// function a ejecutar al funalizar lectura
//    functionExecute: null,
// inicialia controles
//     init: function (idInputFile, f){
//         excel.functionExecute = f;
//         inputFile = document.getElementById(idInputFile); 

//         $.getJSON("files/excel.json")
//         .done(function (json) {
//             excel.books = json;
//             excel.functionExecute(excel.books[0]);
//             //console.log(excelInfo);
//         });
        
//         if (window.File && window.FileReader && window.FileList && window.Blob) {
//             inputFile.addEventListener('change', this.loadFile, false);
//         } else {
//             alert("Explorador no Compatible");
//         }
//     },
// // carga de archivo 
//     loadFile: function () {
//         var book = {};
//         book.name = inputFile.value.split(".")[0];
//         var files = inputFile.files;
//         //var files = evt.target.files;
//         var file = files[0];
//         if (files && file) {
//             var reader = new FileReader();
//             reader.onload = function(readerEvt) {
//                 var binaryString = readerEvt.target.result;
//                 var base64 = btoa(binaryString);
//                 book.sheets = excel.readExcel(base64);
//                 excel.books.push(book);
//                 if (excel.functionExecute != null) excel.functionExecute(book);
//             };
//             reader.readAsBinaryString(file);
//         }
//     },

    excelToJson: function(){
        /******** descargar en forma de json ************/
        var a = document.getElementById('tmpdownload');
        var encode = encodeURIComponent( JSON.stringify(excel.books) );
        a.href = 'data:text/plain;charset=utf-8,' + encode;
        a.download = "excel.json";
        a.click();
    },

    readExcel: function (fileBase64) {
        var sheets = [];
        var workbook = XLSX.read(fileBase64, { type: 'base64' });
        workbook.SheetNames.forEach(function (sheetName) {
            var newSheet = {};
            newSheet.name = sheetName
            var worksheet = workbook.Sheets[newSheet.name];
            newSheet.head = excel.readHead(worksheet);
            newSheet.data = excel.readTable(worksheet, newSheet.head);
            sheets.push(newSheet);
        });
        return sheets;
    },

    getColumn: function (sheet, campo){
        return JSLINQ(sheet.data)
            .Select(function (x) { return x[campo]}).ToArray();
    },
    // Rregra una fila con el ID indicado 
    getRow: function (sheet, id){
        return JSLINQ(sheet.data)
            .Where(function(x) { return x.ID_ANALISIS == id} )
            .Select(function(x){ return x}).ToArray();
    },
    // Regresa un array con las filas que estan en arrayIds
    getRowsInList: function (arrayIds){
        var result = [];
        for (var index in excel.books[0].sheets){
            var sheet = excel.books[0].sheets[index]; 
            var temp = JSLINQ(sheet.data)
                .Where(function(x) { return arrayIds.indexOf(x.ID_ANALISIS) >= 0 } )
                .Select(function(x){ return x}).ToArray();
            result = result.concat(temp);
        }
        return result;
    },

    search: function (texto){
        var result = [];
        var regExp = new RegExp(texto.toUpperCase());
        for (index in excel.books[0].sheets){
            var sheet = excel.books[0].sheets[index]; 
            var temp = JSLINQ(sheet.data)
                .Where(function(x) {
                    return regExp.test(x.ID_ANALISIS) ||
                    regExp.test(x.LOTE) ||
                    regExp.test(x.CLIENTE.toUpperCase()) ||
                    regExp.test(x.FECHA_EMBARQUE);
                })
                .Select(function(x) {return x}).ToArray();
            result = result.concat(temp);
        }
        return result;
    },

    readTable: function (worksheet, head){
        var tableOutput = [];
        var address_of_cell;
        var colInit = charToInt(excelInfo.configRead.colInitHead); // columna actual
        var colEnd = charToInt(excelInfo.configRead.colEndHead); // columna final
        var rowInit = excelInfo.configRead.rowHead + 1;
        var nRow = rowInit;
        var nextRow = true;
        while (nextRow){
            var row = {};
            for (var nCol = colInit; nCol <= colEnd; nCol++) {
                address_of_cell = intToChar(nCol) + nRow;
                desired_cell = worksheet[address_of_cell];
                var index = nCol - colInit;
                var attr = head[index].normal  
                if (typeof(desired_cell) == 'undefined'){
                    if (nCol == colInit){ // no hay No. se terminaron las filas
                        nextRow = false;
                        break;
                    }
                    row[attr] = "";
                } else {
                    row[attr] = desired_cell.v;
                }
            }
            nRow += 1;
            if (nextRow) tableOutput.push(row);
        }
        return tableOutput;
    }, // fin readTable 

    readHead: function (worksheet) {
        var head = [];
        var address_of_cell;
        var colInit = charToInt(excelInfo.configRead.colInitHead); // columna actual
        var colEnd = charToInt(excelInfo.configRead.colEndHead); // columna final
        for (var i = colInit; i <= colEnd; i++){
            var elemento = {};
            address_of_cell = intToChar(i) + excelInfo.configRead.rowHead;
            /* Find desired cell */
            desired_cell = worksheet[address_of_cell];
            if (typeof desired_cell == 'undefined') return head; // se terminaron las columnas
            elemento.name = desired_cell.v
            elemento.normal = normalize(desired_cell.v).trim();
            elemento.normal = elemento.normal.replace(/ /g,"_");
            //elemento = elemento.replace(/./g,"");
            head.push(elemento);
            //console.log(elemento);
        }
        return head;
    }, 

    emitXmlHeader: function (nameColumns) {
        var headerRow =  '<ss:Row>\n';
        for (var i in nameColumns) {
            headerRow += '  <ss:Cell>\n';
            headerRow += '    <ss:Data ss:Type="String">';
            headerRow += nameColumns[i] + '</ss:Data>\n';
            headerRow += '  </ss:Cell>\n';        
        }
        return headerRow += '</ss:Row>\n';   
        /*return '<?xml version="1.0"?>\n' +
               '<ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n' +
               '<ss:Worksheet ss:Name="Sheet1">\n' +
               '<ss:Table>\n\n' + headerRow;*/
    },  

    emitXmlInfo: function () {
        return '<?xml version="1.0"?>\n' +
               '<ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n' +
               '<ss:Worksheet ss:Name="Sheet1">\n' +
               '<ss:Table>\n\n';
    },

    emitXmlFooter: function() {
        return '\n</ss:Table>\n' +
               '</ss:Worksheet>\n' +
               '</ss:Workbook>\n';
    },  

    jsonToSsXmlRow: function (jsonObject) {
        var row;
        var col;
        var xml;
        var data = typeof jsonObject != "object" ? JSON.parse(jsonObject) : jsonObject;
        
        xml = "";

        for (row = 0; row < data.length; row++) {
            xml += '<ss:Row>\n';
          
            for (col in data[row]) {
                xml += '  <ss:Cell>\n';
                xml += '    <ss:Data ss:Type="String">';// + testTypes[col]  + '">';
                xml += data[row][col] + '</ss:Data>\n';
                xml += '  </ss:Cell>\n';
            }   
            xml += '</ss:Row>\n';
        }
        
        //xml += excel.emitXmlFooter();
        return xml;  
    },

    jsonToSsXml: function (jsonObject, header) {
        var row;
        var col;
        var xml;
        var data = typeof jsonObject != "object" ? JSON.parse(jsonObject) : jsonObject;
        
        xml = excel.emitXmlHeader(header);  

        for (row = 0; row < data.length; row++) {
            xml += '<ss:Row>\n';
          
            for (col in data[row]) {
                xml += '  <ss:Cell>\n';
                xml += '    <ss:Data ss:Type="String">';// + testTypes[col]  + '">';
                xml += data[row][col] + '</ss:Data>\n';
                xml += '  </ss:Cell>\n';
            }   
            xml += '</ss:Row>\n';
        }
        
        xml += excel.emitXmlFooter();
        return xml;  
    },  

    //console.log(jsonToSsXml(testJson)); 

    download: function (content, filename, contentType) {
        if (!contentType) contentType = 'application/octet-stream';
        var a = document.getElementById('tmpdownload');
        var blob = new Blob([content], {
            'type': contentType
        });
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        a.click();
        //window.URL.revokeObjectURL(url);
        //window.location.href=url;
    },

//download(jsonToSsXml(testJson), 'test.xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

} // fin excel 

///// funciones de proposito general ////
function intToChar(i) {
    return String.fromCharCode(i);
}

function charToInt(c){
    return c.charCodeAt(0);   
}

var normalize = (function() {
  var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç.", 
      to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc ",
      mapping = {};
 
  for(var i = 0, j = from.length; i < j; i++ )
      mapping[ from.charAt( i ) ] = to.charAt( i );
 
  return function( str ) {
      var ret = [];
      for( var i = 0, j = str.length; i < j; i++ ) {
          var c = str.charAt( i );
          if( mapping.hasOwnProperty( str.charAt( i ) ) )
              ret.push( mapping[ c ] );
          else
              ret.push( c );
      }      
      return ret.join( '' );
  }
 
})();
