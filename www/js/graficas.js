function getConfigPlotLines(title, value) {
    return {
        label: {
            text: title, // Content of the label.
            align: 'left', // Positioning of the label.
                    //Default to center. x: +10 // Amount of pixels the label will be repositioned according to the alignment.
        },
        color: 'red', // Color value
        dashStyle: 'longdash', // Style of the plot line. Default to solid
        value: value, // Value of where the line will appear
        width: 1 // Width of the line
    }
}
// configuracion para grafica de dispercion
function getConfigScatter(functionEvtPoint)
{
    return {
        //credits: { enabled: false },
        options: {
            chart: {
                type: 'scatter',
                //zoomType: 'xy'
            },


            plotOptions: {
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {  click: functionEvtPoint  }
                    }
                }
            }


        },
        title: { text: "Grafica de Dispersion" },
        xAxis: {
            title: {
                //enabled: true,
                text: 'No Analisis'
            },
            //startOnTick: true,
            //endOnTick: true,
            //showLastLabel: true
        },
        yAxis: {
            title: { text: 'Cantidad (%)' },
            plotLines: []
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 4,
                    states: {
                        hover: { enabled: true, lineColor: 'rgb(100,100,100)' }
                    }
                },
                states: {
                    hover: {
                        marker: { enabled: false }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br>',
                    pointFormat: 'No. Analisis: {point.x}, {point.y} %'
                }
            },
            series: {
                cursor: 'pointer',
                point: {
                    events: {  click: function(){alert("punto")} }
                }
            }
        },
        series: [{data: []}]
    }
};
// configuracion para grafica de frecuencia
function getConfigColumn()
{
    return {
        options: {
            chart: {
                type: 'column',
                //margin: [60, 10, 40, 40]
            },
        },
        title: {
            text: 'Grafica de Frecuencia',
            x: 25
        },
        legend: { enabled: false },
        credits: { enabled: false },
        exporting: { enabled: false },
        tooltip: {},
        plotOptions: {
            series: {
                borderWidth: 0.5,
                borderColor: 'rgba(255,255,255,0.5)',
                color: Highcharts.getOptions().colors[1]
            }
        },
        xAxis: {
             plotLines: [{
                color: '#0000FF',
                dashStyle: 'Dash',
                label: {
                    align: 'right',
                    rotation: 270,
                    x: -5,
                    y: 40,
                    text: '<b>Promedio '+'(11)'+'</b>'
                },
                //value: 2.5,
                width: 2,
                zIndex: 4
            }],
            title: { text: 'Porciento en peso' }
        },
        yAxis: {
          title: { text: 'Frecuencia' }
        },

        series: [{
            name: 'Frecuencia',
            color: 'rgba( 0, 154, 253, 0.9 )',
            pointPadding: 0,
            groupPadding: 0,
            data: []
        }]
    }
};

function getConfigPie()
{
    return {
        //credits: {
        //    enabled: false
        //},
        options: {
            chart: {
                //plotBackgroundColor:'aliceblue',
                //plotBorderWidth: null,
                //plotShadow: false,
                type: 'pie'
            },
        },
        title: {
            text: ''
        },
        //exporting: { enabled: false },
        //tooltip: {
        //    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        //},
        /*plotOptions: {
            pie: {
                //allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    //enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    //style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    //}
                }
            },
            series: {
                cursor: 'pointer',
                point: {
                  events: {}
                }
            }
        },*/
        series: [{
            //name: 'Brands',
            //colorByPoint: true,
            data: [],
        }]
    }
};

function getNormalChart() {

    return {
        options: {
            chart:{
                renderTo:'container',
                type:'column',
                alignTicks:false,
                marginTop:25
            }
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
            type:'area',
            lineWidth:1,
            name:'Curva Normal',
            color:'rgba(90,155,212,.75)',
            fillColor:'rgba(90,155,212,.15)',
            data: []
            //data:[[-3.2807020192309,0.10168053006185],[-3.0425988742109,0.23641431548771],[-2.8044957291909,0.51637633957668],[-2.5663925841709,1.0595354537927],[-2.3282894391509,2.0423080409267],[-2.0901862941309,3.6981421093266],[-1.8520831491109,6.2907516383431],[-1.6139800040909,10.052592494842],[-1.3758768590709,15.090728685704],[-1.1377737140509,21.28133847858],[-0.89967056903087,28.193192861774],[-0.66156742401087,35.086995418605],[-0.42346427899086,41.020853564556],[-0.18536113397085,45.052593912695],[0.052742011049155,46.482716760157],[0.29084515606916,45.052593912695],[0.52894830108917,41.020853564556],[0.76705144610918,35.086995418605],[1.0051545911292,28.193192861773],[1.2432577361492,21.28133847858],[1.4813608811692,15.090728685704],[1.7194640261892,10.052592494842],[1.9575671712092,6.2907516383431],[2.1956703162292,3.6981421093266],[2.4337734612492,2.0423080409267],[2.6718766062692,1.0595354537927],[2.9099797512892,0.51637633957668],[3.1480828963092,0.23641431548771]]
        }]
    }

}

function binData(data) {

    var hData = new Array(), //the output array
    size = data.length, //how many data points
    bins = Math.round(Math.sqrt(size)); //determine how many bins we need
    bins = bins > 50 ? 50 : bins; //adjust if more than 50 cells
    var max = Math.max.apply(null, data), //lowest data value
    min = Math.min.apply(null, data), //highest data value
    range = max - min, //total range of the data
    width = range / bins, //size of the bins
    bin_bottom, //place holders for the bounds of each bin
    bin_top;

    //loop through the number of cells
    for (var i = 0; i < bins; i++) {

        //set the upper and lower limits of the current cell
        bin_bottom = min + (i * width);
        bin_top = bin_bottom + width;

        //check for and set the x value of the bin
        if (!hData[i]) {
            hData[i] = new Array();
            hData[i][0] = bin_bottom + (width / 2);
        }

        //loop through the data to see if it fits in this bin
        for (var j = 0; j < size; j++) {
            var x = data[j];

            //adjust if it's the first pass
            i == 0 && j == 0 ? bin_bottom -= 1 : bin_bottom = bin_bottom;

            //if it fits in the bin, add it
            if (x > bin_bottom && x <= bin_top) {
                !hData[i][1] ? hData[i][1] = 1 : hData[i][1]++;
            }
        }
    }
    $.each(hData, function(i, point) {
        if (typeof point[1] == 'undefined') {
            hData[i][1] = 0;
        }
    });
    return hData;
}

//function generarGraficas(arrayId, arrayConfig){
//    if (arrayId.length != arrayConfig.length) return; // datos incompletos
//    for(var i = 0; i < arrayId.length; i++){
//        $(arrayId[i]).highcharts(arrayConfig[i]);
//    }
//    //$('#divDispersion').highcharts(configDispersion);
//    //$('#divFrecuencia').highcharts(configHistograma);
//}
//
//function makeChart(id, config){
//    $(id).highcharts(config);
//}
//
//function updatePie(config){
//    $('#divCircular').highcharts(config);
//}
