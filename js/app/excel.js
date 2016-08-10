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
    inputFile: null,
// function a ejecutar al funalizar lectura
    functionExecute: null,
// inicialia controles
    init: function (idInputFile, f){
        inputFile = document.getElementById(idInputFile); 
        excel.functionExecute = f;
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            inputFile.addEventListener('change', this.loadFile, false);
        } else {
            alert("Explorador no Compatible");
        }
    },
// carga de archivo 
    loadFile: function () {
        var book = {};
        book.name = inputFile.value;
        var files = inputFile.files;
        //var files = evt.target.files;
        var file = files[0];
        if (files && file) {
            var reader = new FileReader();
            reader.onload = function(readerEvt) {
                var binaryString = readerEvt.target.result;
                var base64 = btoa(binaryString);
                book.sheets = excel.readExcel(base64);
                excel.books.push(book);
                if (excel.functionExecute != null) excel.functionExecute(book);
            };
            reader.readAsBinaryString(file);
        }
    },

    readExcel: function (fileBase64){
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

    getRow: function (sheet, id){
        return JSLINQ(sheet.data)
            .Where(function(x) { return x.ID_ANALISIS == id} )
            .Select(function(x){ return x}).ToArray();
    },

    search: function (sheet, texto){
        var regExp = new RegExp(texto.toUpperCase());
        return JSLINQ(sheet.data)
            .Where(function(x) {
                return regExp.test(x.ID_ANALISIS) ||
                regExp.test(x.LOTE) ||
                regExp.test(x.CLIENTE.toUpperCase()) ||
                regExp.test(x.FECHA_EMBARQUE);
            })
            .Select(function(x) {return x}).ToArray();
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
