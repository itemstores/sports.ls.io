
function CheckAdEnabled() {
    if(window.location.href.indexOf("/hz/") != -1)
    {
        if (typeof (ShowAd) != "undefined")
        ShowAd = false;
    }
}

function CheckHzPrefix(p) {
    if (window.location.href.indexOf("/hz/") != -1) {
        return "/hz/";
    }
    else return p?"/":"";
}

function BomHelper() {
    this.ie = "";
    this.firefox = "";
    this.chrome = "";
    this.opera = "";
    this.safari = "";
}
//检测浏览器版本，并保存
BomHelper.prototype.checkBrowerType = function () {
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/msie ([\d.]+)/)) ? this.ie = s[1] :
    (s = ua.match(/firefox\/([\d.]+)/)) ? this.firefox = s[1] :
    (s = ua.match(/chrome\/([\d.]+)/)) ? this.chrome = s[1] :
    (s = ua.match(/opera.([\d.]+)/)) ? this.opera = s[1] :
    (s = ua.match(/version\/([\d.]+).*safari/)) ? this.safari = s[1] : 0;
}
//获取ajax对象
BomHelper.prototype.ajaxObj = function () {
    var xmlHttp = null;

    if (this.ie != "") {
        if (typeof ActiveXObject != "undefined") {
            return new XMLHttpRequest();
        }
        else {
            try {
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (ex1) {
                try {
                    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (ex2) {
                    alert("创建ajax对象失败,本网站只支持ie6以上版本浏览器,请刷新页面重试");
                }
            }
        }
    } else {
        try {
            xmlHttp = new XMLHttpRequest();
        } catch (ex3) {
            alert("创建ajax对象失败,请刷新页面重试");
        }
    }
    return xmlHttp;
}
//发送ajax的GET请求
BomHelper.prototype.ajaxGet = function (sUrl, fnAjax, noSync) {
    var xmlHttp = this.ajaxObj();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4)
            fnAjax(xmlHttp.responseText);
    }
    if (sUrl.indexOf("?") == -1)
        sUrl = sUrl + "?flesh=" + Date.parse(new Date());
    else
        sUrl = sUrl + "&flesh=" + Date.parse(new Date());
    xmlHttp.open("GET", sUrl, (noSync != undefined ? noSync : true));
    //xmlHttp.send(null);
}
//发送ajax的post请求
BomHelper.prototype.ajaxPost = function (sUrl, sPostData, fnAjax) {
    var xmlHttp = this.ajaxObj();

    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4)
            fnAjax(xmlHttp.responseText);
    }
    if (sPostData == "")
        sPostData = sPostData + "flesh=" + Date.parse(new Date());
    else
        sPostData = sPostData + "&flesh=" + Date.parse(new Date());
    xmlHttp.open("POST", sUrl, true);
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttp.send(sPostData);
}

//同步获取xml文件
BomHelper.prototype.ajaxXml = function (sUrl, sys, fnAjax) {
    var xmlHttp = this.ajaxObj();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4)
            fnAjax(xmlHttp.responseXML);
    }
    if (sUrl.indexOf("?") == -1)
        sUrl = sUrl + "?flesh=" + Math.random();
    else
        sUrl = sUrl + "&flesh=" + Math.random();
    xmlHttp.open("GET", sUrl, sys);
    xmlHttp.send(null);
}

//若是IE7以上版本，则要求它使用IE7
BomHelper.prototype.useIE7 = function () {
    document.write("<meta content=\"IE=EmulateIE7\" http-equiv=\"X-UA-Compatible\">");
}

var bomHelper = new BomHelper();
bomHelper.checkBrowerType();

//JS去除空格
String.prototype.Trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
}

//js Cookie操作
function findCookie(cookieName) {
    //获取cookie字符串 
    var strCookie = document.cookie;
    //将多cookie切割为多个名/值对 
    var arrCookie = strCookie.split("; ");
    var cookieValue = "";
    //遍历cookie数组，处理每个cookie对 
    for (var i = 0; i < arrCookie.length; i++) {
        var arr = arrCookie[i].split("=");
        //找到名称为userId的cookie，并返回它的值 
        if (cookieName == arr[0]) {
            cookieValue = arr[1];
            break;
        }
    }
    return cookieValue;
}

function writeCookie(name, value, expireVal) {
    var expire = expireVal;
    var hours = 365;
    if (expire == undefined)
        expire = new Date((new Date()).getTime() + hours * 3600000);

    expire = ";path=/;expires=" + expire.toGMTString();
    //document.cookie = name + "=" + escape(value) + expire;
    document.cookie = name + "=" + value + expire;
}
function writeCommonCookie(name, value, expireVal) {
    var expire = expireVal;
    var hours = 365;
    if (expire == undefined)
        expire = new Date((new Date()).getTime() + hours * 3600000);

    expire = ";path=/;domain=.titan007.com;expires=" + expire.toGMTString();
    //document.cookie = name + "=" + escape(value) + expire;
    document.cookie = name + "=" + value + expire;
}
function delCookie(name) {
    var date = new Date();
    date.setTime(date.getTime() - 1);
    var cval = findCookie(name);
    if (cval != null) {
        var expire = ";path=/;expires=" + date.toGMTString();
        document.cookie = name + "=" + cval + expire;
    }
}


function selectGuess(kind) {
    if (kind == 0) {
        document.getElementById("zero").className = "ddl on";
        document.getElementById("zero").attributes["onclick"].value = "selectGuess(3)";
    } if (kind == 3) {
        document.getElementById("zero").className = "ddl";
        document.getElementById("zero").attributes["onclick"].value = "selectGuess(0)";
    }
    else if (kind == 1) {
        location.href = CheckHzPrefix() +"//m3.titan007.com/guess/schedule.aspx";
    } else if (kind == 2) {
        location.href = CheckHzPrefix() +"//m3.titan007.com/basket/schedule.aspx";
    }
}
function selectGuess2(kind) {
    if (kind == 0) {
        document.getElementById("zero2").className = "ddl on"
        document.getElementById("zero2").attributes["onclick"].value = "selectGuess2(4)";
    } if (kind == 4) {
        document.getElementById("zero2").className = "ddl"
        document.getElementById("zero2").attributes["onclick"].value = "selectGuess2(0)";
    }
    else if (kind == 1) {
        location.href = "//m3.titan007.com/ballpub/hottheme.aspx"
    } else if (kind == 2) {
        location.href = "//m3.titan007.com/ballpub/caihottheme.aspx"
    } else if (kind == 3) {
        location.href = "//m3.titan007.com/mp/"
    }
}
function selectType(kind) {
    //var cName = document.getElementById("zeroType").className;
    //if (kind == 0) {
    //    document.getElementById("zeroType").className = cName + " on";
    //    document.getElementById("zeroType").attributes["onclick"].value = "selectType(3)";
    //} if (kind == 3) {
    //    document.getElementById("zeroType").className = cName.replace(" on","");
    //    document.getElementById("zeroType").attributes["onclick"].value = "selectType(0)";
    //}
    //else
    if (kind == 1) {
        writeCommonCookie("indexType", "1");
        location.href = CheckHzPrefix() + "/";
    } else if (kind == 2) {
        writeCommonCookie("indexType", "2");
        location.href = CheckHzPrefix() + "/basketball.shtml";
    } else if (kind == 3) {
        writeCommonCookie("indexType", "3");
        location.href = CheckHzPrefix() + "/worldcup";
    }
}

function getTopHeight() {
    var adTop = 0;
    if (document.documentElement && document.documentElement.scrollTop)
        adTop = document.documentElement.scrollTop;
    else if (document.body)
        adTop = document.body.scrollTop
    else
        adTop = window.pageYOffset;

    return adTop;
}
//时间戳格式化,date("YmdHis",time) 相当于yyyyMMddHHmmss
function date(format, timestamp) {
    var a, jsdate = ((timestamp) ? new Date(timestamp * 1000) : new Date());
    var pad = function (n, c) {
        if ((n = n + "").length < c) {
            return new Array(++c - n.length).join("0") + n;
        } else {
            return n;
        }
    };
    var txt_weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var txt_ordin = { 1: "st", 2: "nd", 3: "rd", 21: "st", 22: "nd", 23: "rd", 31: "st" };
    var txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var f = {
        // Day 
        d: function () { return pad(f.j(), 2) },
        D: function () { return f.l().substr(0, 3) },
        j: function () { return jsdate.getDate() },
        l: function () { return txt_weekdays[f.w()] },
        N: function () { return f.w() + 1 },
        S: function () { return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th' },
        w: function () { return jsdate.getDay() },
        z: function () { return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0 },

        // Week 
        W: function () {
            var a = f.z(), b = 364 + f.L() - a;
            var nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1;
            if (b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b) {
                return 1;
            } else {
                if (a <= 2 && nd >= 4 && a >= (6 - nd)) {
                    nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31");
                    return date("W", Math.round(nd2.getTime() / 1000));
                } else {
                    return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0);
                }
            }
        },

        // Month 
        F: function () { return txt_months[f.n()] },
        m: function () { return pad(f.n(), 2) },
        M: function () { return f.F().substr(0, 3) },
        n: function () { return jsdate.getMonth() + 1 },
        t: function () {
            var n;
            if ((n = jsdate.getMonth() + 1) == 2) {
                return 28 + f.L();
            } else {
                if (n & 1 && n < 8 || !(n & 1) && n > 7) {
                    return 31;
                } else {
                    return 30;
                }
            }
        },

        // Year 
        L: function () { var y = f.Y(); return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0 },
        //o not supported yet 
        Y: function () { return jsdate.getFullYear() },
        y: function () { return (jsdate.getFullYear() + "").slice(2) },

        // Time 
        a: function () { return jsdate.getHours() > 11 ? "pm" : "am" },
        A: function () { return f.a().toUpperCase() },
        B: function () {
            // peter paul koch: 
            var off = (jsdate.getTimezoneOffset() + 60) * 60;
            var theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() + off;
            var beat = Math.floor(theSeconds / 86.4);
            if (beat > 1000) beat -= 1000;
            if (beat < 0) beat += 1000;
            if ((String(beat)).length == 1) beat = "00" + beat;
            if ((String(beat)).length == 2) beat = "0" + beat;
            return beat;
        },
        g: function () { return jsdate.getHours() % 12 || 12 },
        G: function () { return jsdate.getHours() },
        h: function () { return pad(f.g(), 2) },
        H: function () { return pad(jsdate.getHours(), 2) },
        i: function () { return pad(jsdate.getMinutes(), 2) },
        s: function () { return pad(jsdate.getSeconds(), 2) },
        //u not supported yet 

        // Timezone 
        //e not supported yet 
        //I not supported yet 
        O: function () {
            var t = pad(Math.abs(jsdate.getTimezoneOffset() / 60 * 100), 4);
            if (jsdate.getTimezoneOffset() > 0) t = "-" + t; else t = "+" + t;
            return t;
        },
        P: function () { var O = f.O(); return (O.substr(0, 3) + ":" + O.substr(3, 2)) },
        //T not supported yet 
        //Z not supported yet 

        // Full Date/Time 
        c: function () { return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P() },
        //r not supported yet 
        U: function () { return Math.round(jsdate.getTime() / 1000) }
    };

    return format.replace(/[\ ]?([a-zA-Z])/g, function (t, s) {
        if (t != s) {
            // escaped 
            ret = s;
        } else if (f[s]) {
            // a date function exists 
            ret = f[s]();
        } else {
            // nothing special 
            ret = t == "T" || t == "t" ? " " : s;
        }
        return ret;
    });
}

function GoDetail(url) {
    var parm = url.indexOf("lqinfo") > 0 ? "historyUrlLq" : "historyUrl";
    var historyUrl = findCookie(parm);
    if (historyUrl == "")
        historyUrl = url;
    else
        writeCookie(parm, "");
    var url = historyUrl.split("^");
    if (url.length > 1) {
        window.location.href = url[1];
    }
    window.location.href = historyUrl;
}
function GetQueryValue(queryName) {
    var query = decodeURI(window.location.search.substring(1));
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == queryName) { return pair[1]; }
    }
    return null;
}
function filter(str) {
    var pattern = /[`~!@#$^&*=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？]/g;
    return str.replace(pattern, "");
}
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        var str = filter(decodeURI(r[2]));
        return str;
    }
    return null;
}
window.onload = function () {

    var isDarkType = findCookie("themeDark");
    if (isDarkType != null && isDarkType == "1") {
            document.body.className = "theme--dark";
    }
}
function GetDarkType() {
    var isDarkType = findCookie("themeDark");
    if (isDarkType != null && isDarkType == "1") {
        document.body.className = "theme--dark";
    }
}
function ShowNav(type) {
    document.getElementById("subnavDiv").style.display = (type == 1 ? "" : "none");
}
function ChangeNavDarkType() {
    var isDark = (document.body.className.indexOf("theme--dark") != -1);
    writeCommonCookie("themeDark", (isDark ? "" : "1"));
    writeCookie("themeDark", (isDark ? "" : "1"));
    document.body.className = (isDark ? "" : "theme--dark");
}