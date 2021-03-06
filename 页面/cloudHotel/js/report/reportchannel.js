M.Page.ReportChannel = M.createClass();
M.extend(M.Page.ReportChannel.prototype, {
    context: {},
    droplist: {},
    dropdownliststa: {},
    submittext: "处理中...",
    init: function() {
        this.initDOM();
        this.initEvent();
        this.initChart();
    },
    initDOM: function() {
        this.context.datelist = $("#datelist");
        this.context.fromdate = $("#fromdate");
        this.context.enddate = $("#enddate");
        this.context.dateval = $("#dateval");
        this.context.datevallist = $("#datevallist");
        this.context.reloadbtn = $("#reloadbtn");
        this.context.daterange = $("#daterange");
        this.context.body = $(document.body);
        this.context.innid = $("#innid");
        this.context.loading = $("#loading");
        this.context.channelfilter = $("#channelfilter");
        this.context.otherlist = $("#otherlist");
        this.context.orderform_toggle = $("#orderform_toggle");
        this.context.orderform_toshow = $("#orderform_toshow");
        this.context.fromdate.datepicker({
            showOtherMonths: true,
            selectOtherMonths: true
        });
        this.context.enddate.datepicker({
            showOtherMonths: true,
            selectOtherMonths: true
        });
        this.context.detaillist = $("#detaillist");
        this.context.othertext = $("#othertext");
        var channelcode = this.context.channelfilter.children(":first").addClass("on").attr("code");
        this._loadchanneldata(channelcode);
    },
    initEvent: function() {
        this.context.reloadbtn.bind("click", this.reloadbtn_click.toEventHandler(this));
        this.context.daterange.bind("click", this.daterange_click.toEventHandler(this));
        this.context.datelist.bind("change", this.datelist_change.toEventHandler(this));
        this.context.innid.bind("change", this.inn_change.toEventHandler(this));
        $(document.body).bind("click", this.document_click.toEventHandler(this));
        this.context.dateval.bind("focus", this.dateval_focus.toEventHandler(this));
        this.context.channelfilter.bind("click", this.channelfilter_click.toEventHandler(this));
        this.context.orderform_toggle.bind("click", this.orderform_toggle_click.toEventHandler(this));
    },
    datelist_change: function(e) {
        document.forms[0].submit();
    },
    channelfilter_click: function(e) {
        var ele = M.EventEle(e);
        var tag = ele.attr("tag");
        if (tag == 'filter') {
            var li = ele;
            if (!M.isEmpty(ele.attr("href"))) {
                li = ele.parent();
            }
            if (li.hasClass('on')) {
                return;
            }
            var dropdown = ele.parents('.ip-dropdown');
            if (dropdown.length > 0) {
                this.context.othertext.find("span[tag=other]").html(ele.text());
                this.context.otherlist.hide();
            }
            this.context.channelfilter.find('.on').removeClass('on');
            li.addClass("on");
            var channelcode = ele.attr("code");
            this._loadchanneldata(channelcode);
        }
        if (tag == 'other') {
            this.context.otherlist.show();
        }
    },
    document_click: function(e) {
        var ele = M.EventEle(e);
        var style = ele.attr("tag");
        if (style != 'dropdownlist' && style != 'other') {
            var tpl = ele.parents("th[tag=filter]");
            var hf = ele.parents("div[tag=filter]");
            var of = ele.parents('.ip-dropdown');
            if (tpl.length + hf.length + of.length == 0) {
                this.context.body.children().find(".ip-dropdown[tag=otherlist]:visible").hide();
            }
            var box = ele.parents('div[tag=dateval]');
            var df = ele.parents(".ui-datepicker-header");
            var df1 = ele.parents(".ui-datepicker-calendar");
            if (box.length == 0 && df.length == 0 && df1.length == 0) {
                this.context.datevallist.hide();
            }
        }
    },
    inn_change: function(e) {
        document.forms[0].submit();
    },
    orderform_toggle_click: function(e) {
        var ele = M.EventEle(e);
        var t = ele.attr("tag");
        var target = null;
        if (t == "orderform_toggle") {
            target = ele.parent().children("a[tag=orderform_toggle]");
        }
        if (t == "orderform_i") {
            target = ele.parent("a[tag=orderform_toggle]");
        }
        if (!M.isEmpty(target)) {
            this.context.orderform_toggle.hide();
            this.context.orderform_toshow.slideDown("slow");
        }
    },
    reloadbtn_click: function(e) {
        this.context.datelist.attr("name", '');
        document.forms[0].submit();
    },
    dateval_focus: function(e) {
        this.context.datevallist.show();
    },
    daterange_click: function(e) {
        var ele = M.EventEle(e);
        var t = ele.attr("tag");
        if (t == "showlist" || t == "filter") {
            M.stopevent(e);
            this.context.daylist.show();
        }
        if (t == "date") {}
    },
    _loadchanneldata: function(channelcode) {
        if (M.isEmpty(channelcode)) {
            return;
        }
        var fromdate = this.context.fromdate.val();
        var enddate = this.context.enddate.val();
        var innid = M.getDroplistVal(this.context.innid);
        this.context.loading.show();
        this.context.detaillist.hide().children("tbody").children("tr[tag=item]").remove();
        M._getjson("/ReportSource/getchanneldetaildata", {
            "fromdate": fromdate,
            "enddate": enddate,
            "innid": innid,
            "channelcode": channelcode
        },
        this.channeldetail_finished.toEventHandler(this));
    },
    channeldetail_finished: function(d) {
        this.context.loading.hide();
        var orderlist = d.datasource;
        this.context.detaillist.show();
        if (d.status == 'success') {
            this._showorder(orderlist);
        } else {}
    },
    _showorder: function(orderlist) {
        var tmpl_tr = this.context.detaillist.children("tbody").children("tr[tag=tmpl]");
        var total_tr = this.context.detaillist.children("tbody").children("tr[tag=total]");
        var prevdate = null;
        var day_rows = 0;
        var prev_tr = null;
        var day_total = 0;
        var alltotal = 0;
        for (var i = 0; i < orderlist.length; i++) {
            var order = orderlist[i];
            var totalprice = parseFloat(order.price).toFixed(2);
            totalprice = parseFloat(totalprice);
            alltotal += totalprice;
            if (M.isEmpty(prevdate) || prevdate != order.checkindate) {
                prevdate = order.checkindate;
                day_rows = 1;
                day_total = 0;
                prev_tr = tmpl_tr.clone(true).attr("tag", 'item');
                day_total += totalprice;
                var datetime = M.strtotime(order.checkindate);
                var datestr = order.checkindate.substr(5, 2) + "/" + order.checkindate.substr(8.2);
                prev_tr.find("td[tag=date]").html(datestr);
                prev_tr.find("td[tag=roomname]").html(order.roomname);
                prev_tr.find("td[tag=name]").html(order.guestname);
                prev_tr.find("td[tag=channel]").html(order.channelname);
                prev_tr.find("td[tag=totalprice]").html('￥' + totalprice.toFixed(1));
                prev_tr.find("td[tag=datetotal]").html('￥' + day_total.toFixed(1));
                prev_tr.show().insertBefore(total_tr);
            } else {
                day_rows++;
                var tmptr = tmpl_tr.clone(true).attr("tag", 'item');
                day_total += totalprice;
                var datestr = order.checkindate.substr(5, 2) + "/" + order.checkindate.substr(8.2);
                tmptr.find("td[tag=date]").remove();
                tmptr.find("td[tag=roomname]").html(order.roomname);
                tmptr.find("td[tag=name]").html(order.guestname);
                tmptr.find("td[tag=channel]").html(order.channelname);
                tmptr.find("td[tag=totalprice]").html('￥' + totalprice.toFixed(1));
                tmptr.find("td[tag=datetotal]").remove();
                prev_tr.find("td[tag=datetotal]").html('￥' + day_total.toFixed(1)).attr("rowspan", day_rows);
                prev_tr.find("td[tag=date]").attr("rowspan", day_rows);
                tmptr.show().insertBefore(total_tr);
            }
            total_tr.find("td[tag=total]").html('￥' + alltotal.toFixed(1));
        }
    },
    _closepopup: function() {
        M.ClosePopup();
    },
    destroy: function() {}
});
M.extend(M.Page.ReportChannel.prototype, {
    initChart: function() {
        this.context.channelchart = $("#channelchart");
        var source_channel = reportdata.report;
        var soruce_graph = reportdata.graph;
        var f_source_channel = new Array();
        for (var d in source_channel) {
            var v = source_channel[d];
            if (v.rate == 0) {
                continue;
            }
            f_source_channel.push({
                "name": v.name,
                "color": v.color,
                y: parseInt(v.sales)
            });
        }
        var clolor = reportdata.graph;
        if (!M.isEmpty(f_source_channel) || f_source_channel.length > 0) {
            var incomepie = this.context.channelchart.highcharts({
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
                        size: "50%",
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            color: '#000000',
                            connectorColor: '#000000',
                            format: '{point.name}: {point.percentage:.1f} %'
                        },
                        colors: clolor
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x: 5,
                    y: 50,
                    borderWidth: 0,
                    labelFormatter: function() {
                        return this.name + '&nbsp';
                    },
                    useHTML: true
                },
                series: [{
                    type: 'pie',
                    name: '占比',
                    data: f_source_channel
                }]
            });
        }
    },
    _convertdatasource: function(source, field) {
        var formatedsource = new Array();
        for (var d in source) {
            var v = source[d];
            var val = parseInt(v[field.value]);
            formatedsource.push([v[field.name], val]);
        }
        return formatedsource;
    }
});
M.ready(function() {
    page = new M.Page.ReportChannel();
    return page;
});