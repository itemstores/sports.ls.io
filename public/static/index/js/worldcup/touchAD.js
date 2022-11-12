var ShowAd=false;
//控制广告8：30--18：00不显示广告，如不需要的此时内隐藏，注释掉以下代码即可
/*var da = new Date();
if ((da.getHours() == 8 && da.getMinutes() >= 30) || da.getHours() > 8)
 {
    if (da.getHours() < 18) 
    {
       ShowAd=false;
    }
}*/
//控制广告8：30--18：00不显示广告，如不需要的此时内隐藏，注释掉以下代码即可

//足球
var arrImages = ["/ad/advertise.aspx?id=1577^/mn/152522_g.jpg^","/ad/advertise.aspx?id=1578^/mn/174707_2.jpg^","","","","","",""];

//蓝球
var arrImagesLq = ["","","","","",""];

//足球分析
var arrImagesAnaly = ["","/ad/advertise.aspx?id=1595^/mn/175444_73.png^","",""];

//蓝球分析
var arrImagesAnalyLq = ["","",""];

//篮球赛果
var arrImagesScheduleLq = [""];

//足球赛果
var arrImagesSchedule = [""];

//足球赛程
var arrImagesFixture = [""];

//足球赛程
var arrImagesFixtureLq = [];

//足球事件
var arrImagesShijian = ["","/ad/advertise.aspx?id=1919^/mn/175525_73.png^"];

//世界杯
var arrImagesWorldCup = [];

var arrEmpty = [];
var _adIndex = 0;
var curAdList = null;


function getAdVisible() {
    //try {
    //    bomHelper.ajaxGet("/ipchecker.aspx?" + Date.parse(new Date()),
    //        function (data) {
    //            ShowAd = data == "1";
    //        },
    //        false);
    //}
    //catch (e) { }
}

getAdVisible();

function initAd(adList){
  if (ShowAd)
        this.curAdList = adList;
    else
        this.curAdList = arrEmpty;
}

function getAd() {
    if ((curAdList == null || _adIndex > curAdList.length - 1)&&!ShowAd) return;
    if (curAdList.length>=(_adIndex+1)&&curAdList[_adIndex] != "") {
        var adContent = curAdList[_adIndex].split("^");
        if (adContent[1] != "")
            document.write("<div class=\"fenxiBar\" style=\"height:34px;padding-left: 0px;\"><a href='" + adContent[0] + "' target='_blank'><img src='" + adContent[1] + "' width='100%'  height='34' /></a></div>");
        else
            document.write("<div class=\"fenxiBar\"  style=\"height:34px;padding-left: 0px;\" ><a href='" + adContent[0] + "' style='color:red;width:100%;height:34px;' target='_blank'>" + adContent[2] + "</a></div>");
    }
	_adIndex++;
}