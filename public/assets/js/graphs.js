var MONTHS = ["Jan 2012", "Feb 2013", "Jan 2014", "Feb 2017", "Jan 2016", "Jan 2017" ];
var config = {
    type: 'line',
    data: {
        labels: ["2012", "2013", "2014", "2017", "2016", "2017" ],
        datasets: [{
            label: "Blood Glucose",
            backgroundColor: window.chartColors.red,
            borderColor: window.chartColors.red,
            data: [
                125,
                200,
                129,
                210,
                0,
                132
            ],
            fill: false,
        }, {
            label: "Cholesterol",
            fill: false,
            backgroundColor: window.chartColors.blue,
            borderColor: window.chartColors.blue,
            data: [
                200,
                175,
                190,
                255,
                0,
                199
            ],
        }]
    },
    options: {
        responsive: true,
        title:{
            display:true,
            text:'Recent Lab Results'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Month'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Value'
                }
            }]
        }
    }
};
// window.onload = function() {
//     var lineChart = document.getElementById("linechart").getContext("2d");
//     window.myLine = new Chart(lineChart, config);
// };

// document.getElementById('randomizeData').addEventListener('click', function() {
//     config.data.datasets.forEach(function(dataset) {
//         dataset.data = dataset.data.map(function() {
//             return randomScalingFactor();
//         });
//     });
//     window.myLine.update();
// });
var colorNames = Object.keys(window.chartColors);
// document.getElementById('addDataset').addEventListener('click', function() {
//     var colorName = colorNames[config.data.datasets.length % colorNames.length];
//     var newColor = window.chartColors[colorName];
//     var newDataset = {
//         label: 'Dataset ' + config.data.datasets.length,
//         backgroundColor: newColor,
//         borderColor: newColor,
//         data: [],
//         fill: false
//     };
//     for (var index = 0; index < config.data.labels.length; ++index) {
//         newDataset.data.push(randomScalingFactor());
//     }
//     config.data.datasets.push(newDataset);
//     window.myLine.update();
// });
// document.getElementById('addData').addEventListener('click', function() {
//     if (config.data.datasets.length > 0) {
//         var month = MONTHS[config.data.labels.length % MONTHS.length];
//         config.data.labels.push(month);
//         config.data.datasets.forEach(function(dataset) {
//             dataset.data.push(randomScalingFactor());
//         });
//         window.myLine.update();
//     }
// });
// document.getElementById('removeDataset').addEventListener('click', function() {
//     config.data.datasets.splice(0, 1);
//     window.myLine.update();
// });
// document.getElementById('removeData').addEventListener('click', function() {
//     config.data.labels.splice(-1, 1); // remove the label first
//     config.data.datasets.forEach(function(dataset, datasetIndex) {
//         dataset.data.pop();
//     });
//     window.myLine.update();
// });



// bar graph
// var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var color = Chart.helpers.color;
var barChartData = {
    labels: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    datasets: [{
        label: 'Steps (in thousands)',
        backgroundColor: color(window.chartColors.green).alpha(0.5).rgbString(),
        borderColor: window.chartColors.green,
        borderWidth: 1,
        data: [
            (Math.floor(Math.random() * 200) + 120),
            (Math.floor(Math.random() * 200) + 120),
            (Math.floor(Math.random() * 200) + 120),
            (Math.floor(Math.random() * 200) + 120),
            (Math.floor(Math.random() * 200) + 120),
            (Math.floor(Math.random() * 200) + 120),
            (Math.floor(Math.random() * 200) + 120)
        
        ]
    }]
};
window.onload = function() {
    var lineChart = document.getElementById("linechart").getContext("2d");
    window.myLine = new Chart(lineChart, config);
    var theBarChart = document.getElementById("barchart").getContext("2d");
    window.myBar = new Chart(theBarChart, {
        type: 'bar',
        data: barChartData,
        options: {
            responsive: true,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Your Fitness'
            }
        }
    });
};
document.getElementById('randomizeData').addEventListener('click', function() {
    var zero = Math.random() < 0.2 ? true : false;
    barChartData.datasets.forEach(function(dataset) {
        dataset.data = dataset.data.map(function() {
            return zero ? 0.0 : randomScalingFactor();
        });
    });
    window.myBar.update();
});
var colorNames = Object.keys(window.chartColors);
document.getElementById('addDataset').addEventListener('click', function() {
    var colorName = colorNames[barChartData.datasets.length % colorNames.length];;
    var dsColor = window.chartColors[colorName];
    var newDataset = {
        label: 'Dataset ' + barChartData.datasets.length,
        backgroundColor: color(dsColor).alpha(0.5).rgbString(),
        borderColor: dsColor,
        borderWidth: 1,
        data: []
    };
    for (var index = 0; index < barChartData.labels.length; ++index) {
        newDataset.data.push(randomScalingFactor());
    }
    barChartData.datasets.push(newDataset);
    window.myBar.update();
});
document.getElementById('addData').addEventListener('click', function() {
    if (barChartData.datasets.length > 0) {
        var month = MONTHS[barChartData.labels.length % MONTHS.length];
        barChartData.labels.push(month);
        for (var index = 0; index < barChartData.datasets.length; ++index) {
            //window.myBar.addData(randomScalingFactor(), index);
            barChartData.datasets[index].data.push(randomScalingFactor());
        }
        window.myBar.update();
    }
});
document.getElementById('removeDataset').addEventListener('click', function() {
    barChartData.datasets.splice(0, 1);
    window.myBar.update();
});
document.getElementById('removeData').addEventListener('click', function() {
    barChartData.labels.splice(-1, 1); // remove the label first
    barChartData.datasets.forEach(function(dataset, datasetIndex) {
        dataset.data.pop();
    });
    window.myBar.update();
});