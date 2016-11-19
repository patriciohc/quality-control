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
function getConfigScatter()
{
    return {
        credits: { enabled: false },
        chart: {
            type: 'scatter',
            zoomType: 'xy'
        },
        title: { text: "Grafica de Dispersion" },
        xAxis: {
            title: {
                enabled: true,
                text: 'No Analisis'
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
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
                    events: { }
                }
            }
        },
        series: null
    }
};
// configuracion para grafica de frecuencia
function getConfigColumn()
{
    return {
        chart: {
            type: 'column',
            //margin: [60, 10, 40, 40]
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
                pointPadding: 0,
                groupPadding: 0,
                borderWidth: 0.5,
                borderColor: 'rgba(255,255,255,0.5)',
                color: Highcharts.getOptions().colors[1]
            }
        },
        xAxis: {
            title: { text: 'Porciento en peso' }
        },
        yAxis: {
          title: { text: 'Frecuencia' }
        },
        series: [{
            name: 'Frecuencia',
            color: 'rgba( 0, 154, 253, 0.9 )',
            data: null
        }]
    }
};

function getConfigPie()
{
    return {
        credits: {
            enabled: false
        },
        chart: {
            //plotBackgroundColor:'aliceblue',
            //plotBorderWidth: null,
            //plotShadow: false,
            type: 'pie'
        },
        title: {
            text: ''
        },
        exporting: { enabled: false },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                //allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    //enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    /*style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }*/
                }
            },
            series: {
                cursor: 'pointer',
                point: {
                  events: {}
                }
            }
        },
        series: [{
            //name: 'Brands',
            colorByPoint: true,
            data: null,
        }]
    }
};

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

function generarGraficas(arrayId, arrayConfig){
    if (arrayId.length != arrayConfig.length) return; // datos incompletos
    for(var i = 0; i < arrayId.length; i++){
        $(arrayId[i]).highcharts(arrayConfig[i]);
    }
    //$('#divDispersion').highcharts(configDispersion);
    //$('#divFrecuencia').highcharts(configHistograma);
}

function makeChart(id, config){
    $(id).highcharts(config);
}

function updatePie(config){
    $('#divCircular').highcharts(config);
}
