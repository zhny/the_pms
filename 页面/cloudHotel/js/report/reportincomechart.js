﻿function _convertdatasource(source) {
    var formatedsource = new Array();
    for (var d in source) {
        var v = source[d];
        formatedsource.push([v.name, v.total]);
    }
    return formatedsource;
}
$(function() {
    var source_income = reportdata.income;
    var f_source_income = new Array();
    for (var d in source_income) {
        var v = source_income[d];
        f_source_income.push({
            "name": v.name,
            "color": v.color,
            y: parseInt(v.total)
        });
    }
    if (!M.isEmpty(f_source_income) || f_source_income.length > 0) {
        var incomepie = $('#incomepie').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: true
            },
            title: {
                text: ''
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                pie: {
                    size: "70%",
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false,
                        color: '#000000',
                        connectorColor: '#000000',
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                    }
                }
            },
            legend: {
                verticalAlign: 'top',
                align: "right",
                labelFormat: "",
                layout: "vertical"
            },
            series: [{
                type: 'pie',
                name: '占比',
                data: f_source_income
            }]
        });
    }
    var source_payout = reportdata.payout;
    var f_source_payout = new Array();
    for (var d in source_payout) {
        var v = source_payout[d];
        f_source_payout.push({
            "name": v.name,
            "color": v.color,
            y: parseInt(v.total)
        });
    }
    if (!M.isEmpty(f_source_payout) || f_source_payout.length > 0) {
        var payoutpie = $('#payoutpie').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            credits: {
                enabled: false
            },
            title: {
                text: ''
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    size: "70%",
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false,
                        color: '#000000',
                        connectorColor: '#000000',
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                    }
                }
            },
            series: [{
                type: 'pie',
                name: '占比',
                data: f_source_payout
            }]
        });
    }
    $('.highcharts-container').css({
        "height": "260px",
        "margin": "-30px 0"
    });
    $('div[tag=chartcanvas]').css("height", "200px");
});