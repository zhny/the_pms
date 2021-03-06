M.Page.CheckinGuestPage = M.createClass();
M.extend(M.Page.CheckinGuestPage.prototype, {
    context: {},
    getdatetime: function() {
        var date = M.getTime();
        return date;
    },
    init: function() {
        this.initDOM();
        this.initEvent();
    },
    initDOM: function() {
        this.context.innlist = $("#innlist");
        M.DropdownList(this.context.innlist, this.innlistchange.toEventHandler(this), {});
        this.context.body = $("body");
        this.context.searchform = $("#searchform");
        this.context.search = $("#search");
        this.context.keyword = $("#keyword");
        this.context.guestlist = $("#guestlist");
        this.context.viewGuestPop = $("#viewGuestPop");
        this.context.guestdetail = $("#guestdetail");
        this.context.orderhistory = $("#orderhistory");
        this.context.fromdate = $("#fromdate");
        this.context.enddate = $("#enddate");
        this.context.daterange = $("#daterange");
        this.context.confirmdate = $("#confirmdate");
        this.context.exportpop = $("#exportPop");
        this.context.exportdata = $("#exportdata");
        var now = this.getdatetime();
        var maxdate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        var date = M.timeformat(maxdate, 'Y-m-d');
        this.context.fromdate.datepicker({
            showOtherMonths: true,
            selectOtherMonths: true,
        });
        this.context.enddate.datepicker({
            showOtherMonths: true,
            selectOtherMonths: true
        });
    },
    initEvent: function() {
        this.context.body.bind("click", this.body_click.toEventHandler(this));
        this.context.search.bind("click", this.search_click.toEventHandler(this));
        this.context.keyword.bind('keydown', this.searchkeyword_keydown.toEventHandler(this));
        this.context.guestlist.bind("click", this.guestlist_click.toEventHandler(this));
        this.context.daterange.bind("click", this.daterange_click.toEventHandler(this));
        this.context.confirmdate.bind("click", this.confirmdate_click.toEventHandler(this));
        this.context.exportpop.bind("click", this.exportpop_click.toEventHandler(this));
        this.context.exportdata.bind("click", this.exportdata_click.toEventHandler(this));
    },
    exportpop_click: function(e) {
        var ele = M.EventEle(e);
        var t = ele.attr('tag');
        switch (t) {
        case 'clause':
            this.clause(ele);
            break;
        case 'export':
            this.exportdata(ele);
            break;
        }
    },
    exportdata: function(ele) {
        if (ele.hasClass('btn-cancel')) {
            return;
        }
        var fromdate = this.context.exportpop.find('input[tag=startdate]').val();
        var enddate = this.context.exportpop.find('input[tag=enddate]').val();
        var innid = this._getinnid();
        if (fromdate > enddate) {
            alert('开始日期不能大于结束日期');
            return;
        }
        var href = "/Crm/checkinguestexport?innid=" + innid + "&fromdate=" + fromdate + "&enddate=" + enddate;
        window.location.href = href;
        this._closepopup();
    },
    clause: function(ele) {
        var html_parentdiv = ele.parent().parent();
        if (html_parentdiv.find('input[tag=clause]').is(':checked')) {
            html_parentdiv.find('a[tag=export]').removeClass('btn-cancel').addClass('btn-primary');
        } else {
            html_parentdiv.find('a[tag=export]').removeClass('btn-primary').addClass('btn-cancel');
        }
    },
    exportdata_click: function(e) {
        var now = this.getdatetime();
        var thisdate = M.timeformat(now);
        var startdate = M.timeformat(this._getDateMonth(now, 1));
        var mindate = M.timeformat(this._getDateMonth(now, 3));
        this.context.exportpop.find("input[tag=startdate]").datepicker({
            showOtherMonths: true,
            selectOtherMonths: true
        });
        this.context.exportpop.find("input[tag=enddate]").datepicker({
            showOtherMonths: true,
            selectOtherMonths: true
        });
        this.context.exportpop.find("input[tag=startdate]").datepicker("option", "minDate", mindate);
        this.context.exportpop.find("input[tag=startdate]").datepicker("option", "maxDate", thisdate);
        this.context.exportpop.find("input[tag=enddate]").datepicker("option", "minDate", mindate);
        this.context.exportpop.find("input[tag=enddate]").datepicker("option", "maxDate", thisdate);
        this.context.exportpop.find("input[tag=startdate]").val(startdate);
        this.context.exportpop.find("input[tag=enddate]").val(thisdate);
        this.context.exportpop.find("input[tag=clause]").attr("checked", false);
        this.context.exportpop.find("a[tag=export]").attr("class", 'btn btn-cancel');
        M.Popup(this.context.exportpop, {
            "hideclass": "modal large fade",
            "showclass": "modal large fade in",
            "dragable": true
        },
        function() {}.toEventHandler(this));
    },
    _getDateMonth: function(now, month) {
        var date = new Date(now.getFullYear(), now.getMonth() - month, now.getDate());
        return date;
    },
    confirmdate_click: function() {
        var fromdate = this.context.fromdate.val();
        var enddate = this.context.enddate.val();
        if (enddate < fromdate) {
            alert('结束日期不能小于开始日期');
            return;
        }
        var datetime = M.strtotime(fromdate);
        var enddatetime = new Date(datetime.getFullYear(), datetime.getMonth() + 1, datetime.getDate());
        var checkenddate = M.timeformat(enddatetime, 'Y-m-d');
        if (checkenddate < enddate) {
            alert('最大只能查看一个月的数据');
            return;
        }
        var fromdatestr = M.timeformat(datetime, 'm月d日');
        var enddatestr = M.timeformat(M.strtotime(enddate), 'm月d日');
        this.context.daterange.val(fromdatestr + '-' + enddatestr);
        this.context.confirmdate.parent().hide();
        this.context.fromdate.attr("date", fromdate);
        this.context.enddate.attr("date", enddate);
        this.search_click();
    },
    innlistchange: function() {
        this.search_click();
    },
    daterange_click: function(e) {
        this.context.fromdate.val(this.context.fromdate.attr("date"));
        this.context.enddate.val(this.context.enddate.attr("date"));
        this.context.confirmdate.parent().show();
    },
    body_click: function(e) {
        var ele = M.EventEle(e);
        var style = ele.attr("tag");
        if ((M.isEmpty(style) || style != 'dropdownlist')) {
            if (M.isEmpty(style) || (!M.isEmpty(style) && style != 'showconsumetype')) {
                var tpl = ele.parents("div[tag=dropdownlist]");
                if (tpl.length == 0) {
                    this.context.innlist.removeClass("droplist_on").children("div").hide();
                }
            }
        }
        var tpl = ele.parents("div[tag=dateform]");
        if (tpl.length == 0) {
            var id = ele.attr("id");
            tpl = ele.parents("div[id=ui-datepicker-div]") var range = ele.parents(".ui-datepicker-header");
            if (M.isEmpty(id)) {
                if (tpl.length == 0 && range.length == 0) {
                    this.context.confirmdate.parent().hide();
                }
            } else {
                if (typeof(id) != "undefined" && id != 'ui-datepicker-div') {
                    this.context.confirmdate.parent().hide();
                }
            }
            if (tpl.length == 0 && range.length == 0) {
                if (M.isEmpty(id)) {
                    this.context.confirmdate.parent().hide();
                } else {
                    if (typeof(id) != "undefined" && id != 'ui-datepicker-div') {
                        this.context.confirmdate.parent().hide();
                    }
                }
            }
        }
    },
    guestlist_click: function(e) {
        var ele = M.EventEle(e);
        var t = ele.attr("tag");
        if (M.isEmpty(t)) {
            t = ele.parent().attr("tag");
        }
        switch (t) {
        case 'guest':
            this.guestdetail(ele);
            break;
        }
    },
    guestdetail: function(ele) {
        var gid = ele.parent("tr").attr("gid");
        var innid = this._getinnid();
        var data = {
            "act": "getguestdetail",
            "gid": gid,
            'innid': innid
        };
        M._getjson("/Crm/getorderguestdetail", data, this.getorderguestdetail_finished.toEventHandler(this));
    },
    getorderguestdetail_finished: function(d) {
        if (d.status == "success") {
            var guest = d.guest;
            this.context.guestdetail.children('ul[tag=editable]').removeClass('guestdetail_edit').addClass('guestdetail_edit');
            this.context.guestdetail.find("span[tag=guestname]").html(guest.guestname);
            this.context.guestdetail.find("span[tag=sex]").html(guest.sexname);
            if (!M.isEmpty(guest.birthday)) {
                this.context.guestdetail.find("span[tag=brithday]").html(guest.birthday + '（' + guest.age + '岁）');
            } else {
                this.context.guestdetail.find("span[tag=brithday]").html('');
            }
            this.context.guestdetail.find("span[tag=nation]").html(guest.nation);
            this.context.guestdetail.find("span[tag=idtype]").html(guest.idtypename);
            this.context.guestdetail.find("span[tag=idnum]").html(guest.idnum);
            this.context.guestdetail.find("span[tag=address]").html(guest.address);
            this.context.guestdetail.find("span[tag=phone]").html(guest.phone);
            this.context.guestdetail.find("textarea[name=remark]").val(guest.remark).attr("disabled", 'disabled');
            this.context.orderhistory.children("div[tag=historylist]").children("div[tag=h]").remove();
            var ordercount = this.context.guestlist.find("tr[gid=" + guest.id + "]").children("td[t=ordercount]").html();
            this.context.orderhistory.children("div[tag=total]").children("p").hide();
            if (ordercount == '未住过') {
                this.context.orderhistory.children("div[tag=total]").children("p[tag=new]").show();
            } else {
                this.context.orderhistory.children("div[tag=total]").children("p[tag=history]").show();
            }
            this.context.orderhistory.children("div[tag=total]").children().find("strong[tag=total]").html(ordercount);
            var totalprice = this.context.guestlist.find("tr[gid=" + guest.id + "]").children("td[t=totalprice]").html();
            this.context.orderhistory.children("div[tag=total]").children().find("strong[tag=pricetotal]").html(totalprice);
            var orderlist = d.guest.datelist;
            var target = this.context.orderhistory.children("div[tag=historylist]").show();
            var innname = this.context.innlist.children("span").html();
            if (!M.isEmpty(orderlist)) {
                this.context.orderhistory.children("div[tag=total]").show();
                this.context.orderhistory.children("div[tag=historyerr]").hide();
                var tpl_branch = target.children("div[tag=tpl_branch]");
                var tpl_node = target.children("div[tag=tpl_node]");
                for (i in orderlist) {
                    var tpl = tpl_branch.clone(true).show().attr("tag", "h");
                    var list = orderlist[i].list;
                    tpl.children("div[tag=date]").html(orderlist[i].date);
                    for (var k = 0; k < list.length; k++) {
                        var order = list[k];
                        var node = tpl_node.clone(true).show();
                        var txt_consume = '';
                        if (!M.isEmpty(order.consumemoney)) {
                            txt_consume = '（其它消费' + order.consumemoney + '元）';
                        }
                        var html = '入住&lt;' + innname + '&gt，房间&lt;' + order.roomname + '&gt;，住' + order.nights + '晚，消费' + order.totalprice + '元' + txt_consume;
                        node.children("div").html(html);
                        tpl.append(node);
                    }
                    target.append(tpl);
                }
                if (guest.ordercount > 10) {
                    tpl.append("<div class='tip'><p>只展示最近10次的消费记录</p></div>");
                }
            } else {
                this.context.orderhistory.children("div[tag=total]").hide();
                this.context.orderhistory.children("div[tag=historyerr]").show();
            }
            this.context.viewGuestPop.attr("gid", guest.id);
            this.context.viewGuestPop.children().find(".droplist_on").removeClass("droplist_on").children("div").hide();
            M.Popup(this.context.viewGuestPop, {
                "hideclass": "modal viewguest fade",
                "showclass": "modal viewguest fade in",
                "dragable": true
            });
        } else {
            M.error(d.msg);
        }
    },
    searchkeyword_keydown: function(evt) {
        var evt = evt ? evt: (window.event ? window.event: null);
        if (evt.keyCode == 13) {
            this.search_click();
        }
    },
    search_click: function() {
        var innid = this.context.innlist.children("span").attr("value");
        this.context.searchform.find("input[name=innid]").val(innid);
        var keyword = M.getVal(this.context.keyword);
        this.context.searchform.find("input[name=keyword]").val(keyword);
        this.context.searchform.find("input[name=fromdate]").val(this.context.fromdate.val());
        this.context.searchform.find("input[name=enddate]").val(this.context.enddate.val());
        this.context.searchform.submit();
    },
    _getinnid: function() {
        return this.context.innlist.children("span").attr("value");
    },
    NoUndefined: function(str) {
        return M.isEmpty(str) ? "": str;
    },
    _closepopup: function() {
        M.ClosePopup();
    },
    destroy: function() {}
});