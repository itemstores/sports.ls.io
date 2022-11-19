var timeDiff = 0;
var GoalCn2 = ["0", "0/0.5", "0.5", "0.5/1", "1", "1/1.5", "1.5", "1.5/2", "2", "2/2.5", "2.5", "2.5/3", "3", "3/3.5", "3.5", "3.5/4", "4", "4/4.5", "4.5", "4.5/5", "5", "5/5.5", "5.5", "5.5/6", "6", "6/6.5", "6.5", "6.5/7", "7", "7/7.5", "7.5", "7.5/8", "8", "8/8.5", "8.5", "8.5/9", "9", "9/9.5", "9.5", "9.5/10", "10", "10/10.5", "10.5", "10.5/11", "11", "11/11.5", "11.5", "11.5/12", "12", "12/12.5", "12.5", "12.5/13", "13", "13/13.5", "13.5", "13.5/14", "14"];
var WCTeamIdArr = [646, 779, 815, 904, 744, 783, 797, 7384, 637, 766, 819, 891, 638, 649, 823, 913, 650, 772, 903, 914, 645, 768, 795, 813, 642, 648, 778, 793, 765, 767, 810, 898];
var WCScheArr = [];
var attenCookieName = "WCAtten";
var language = typeof (window.language) == "undefined" ? 0 : window.language;
var LoadTime = 0;
var lastUpdateFileTime = 0;
var refreshTime = 5;

var isShowYellowCard = true;
var isShowRedCard = true;
var isTanScore = true;
var isTanRed = true;
var isSound = true;
var isRedSound = true;
var pathnameValue = document.location.pathname;

//-------------------------- 类 ---------------------------------------------------------
function WCSche(dataArr) {
    this.scheduleid = dataArr[0];
    this.matchState = parseInt(dataArr[1]);
    var mtArr = dataArr[2].split(',');
    this.matchTime = new Date(mtArr[0], parseInt(mtArr[1]) - 1, mtArr[2], mtArr[3], mtArr[4], mtArr[5]);
    /*    console.log(dataArr[3]);
        debugger;
        if (dataArr[3] != "") {
            var mt2Arr = dataArr[3].split(',');
            this.startTime = new Date(mt2Arr[0], parseInt(mt2Arr[1]) - 1, mt2Arr[2], mt2Arr[3], mt2Arr[4], mt2Arr[5]);
        } else {
            this.startTime = this.matchTime;
        }*/
    this.kind = dataArr[4].split('^')[0].replace("半准决赛", "8强");
    this.groupName = dataArr[4].split('^')[1];
    this.homeTeamId = dataArr[5];
    this.homeTeam = dataArr[6];
    this.awayTeamId = dataArr[7];
    this.awayTeam = dataArr[8];
    this.homeScore = dataArr[9];
    this.awayScore = dataArr[10];
    this.homeHalfScore = dataArr[11];
    this.awayHalfScore = dataArr[12];
    this.homeRed = dataArr[13];
    this.awayRed = dataArr[14];
    this.homeYellow = dataArr[15];
    this.awayYellow = dataArr[16];
    this.hCorner = dataArr[17];
    this.gCorner = dataArr[18];
    this.homeFlag = dataArr[19];
    this.homeLetInit = dataArr[9]; //主队让分初始值
    this.homeLetScore = dataArr[10]; //主队让分具体值
    this.homeLetOdds = dataArr[11]; //主队让分赔率值
    this.homeSizeInit = dataArr[12]; //主队大小初始值
    this.homeSizeScore = dataArr[13]; //主队大小实际值
    this.homeSizeOdds = dataArr[14]; //主队让大小赔率值
    this.awayLetInit = dataArr[23]; //客队让分初始值
    this.awayLetScore = dataArr[24]; //客队让分具体值
    this.awayLetOdds = dataArr[25]; //客队让分赔率值
    this.awaySizeInit = dataArr[26]; //客队大小初始值
    this.awaySizeScore = dataArr[27]; //客队大小实际值
    this.awaySizeOdds = dataArr[28]; //客队让大小赔率值
    this.openState = dataArr[29]; //开盘状态(0未开盘1赛前盘2已关盘)
    this.openStateFlag = dataArr[3]; //比赛状态(0未开盘1赛前盘2已关盘)
    this.homeTeamEn = dataArr[30]; //主队英文
    this.awayTeamEn = dataArr[31]; //客队英文
    this.groupNameEn = dataArr[32].split('^')[1]; //小组英文
    this.homeGoals = dataArr[35]; //主队赛果
    this.awayGoals = dataArr[36]; //客队赛果
    if (WCTeamIdArr.indexOf(parseInt(this.homeTeamId)) > -1) {
        this.homeFlag = "/static/index/images/worldcup/" + this.homeTeamId + ".png";
    }
    this.awayFlag = dataArr[20];
    if (WCTeamIdArr.indexOf(parseInt(this.awayTeamId)) > -1) {
        this.awayFlag = "/static/index/images/worldcup/" + this.awayTeamId + ".png";
    }

    if (this.homeFlag.length - 1 == this.homeFlag.lastIndexOf("/")) {
        this.homeFlag = "/static/index/images/worldcup/worldcuphoder.png";
    }
    if (this.awayFlag.length - 1 == this.awayFlag.lastIndexOf("/")) {
        this.awayFlag = "/static/index/images/worldcup/worldcuphoder.png";
    }

    this.firstLetGoal = dataArr[21];
    //使用本地数据在客户端翻译附加信息
    this.explainText = window.isUseLocal ? ShowExplain(dataArr[22], this.homeTeam, this.awayTeam) : dataArr[22];
    this.mIndex = 0;

    //排序权值 状态-时间-赛程id
    this.Weight = function () {
        var ss = this.matchState > 0 ? 1 : this.matchState;
        if (ss >= 0 || ss == -1) ss = ss + 50;
        else {
            ss = 40;// -10~-14 sort by time
        }
        var tt = [mtArr[0].substr(2, 2), mtArr[1], mtArr[2], mtArr[3], mtArr[4]].join("");
        return parseFloat("" + ss + "" + (9999999999 - parseInt(tt)) + "." + (1000 - this.mIndex));
    }
}

function ScheLiveChange(data) {
    if (data == "") return;
    var arrTr = data.split("^");
    if (arrTr.length < 2) return;
    this.scheduleid = arrTr[0];
    this.matchState = parseInt(arrTr[1]);
    this.homeScore = arrTr[2];
    this.awayScore = arrTr[3];
    this.homeHalfScore = arrTr[4];
    this.awayHalfScore = arrTr[5];
    this.homeRed = arrTr[6];
    this.awayRed = arrTr[7];
    if (arrTr[9] == "") {
        this.startTime = new Date();
    }
    else {
        var sTimeArr = arrTr[9].split(",");
        this.startTime = new Date(sTimeArr[0], sTimeArr[1], sTimeArr[2], sTimeArr[3], sTimeArr[4], sTimeArr[5]);
    }
    this.homeYellow = arrTr[12];
    this.awayYellow = arrTr[13];
    this.explainText = arrTr[15];
    this.hCorner = arrTr[16];
    this.gCorner = arrTr[17];
    this.hasCorner = arrTr[18] == "1";
    this.homeLetInit = dataArr[9]; //主队让分初始值
    this.homeLetScore = dataArr[10]; //主队让分具体值
    this.homeLetOdds = dataArr[11]; //主队让分赔率值
    this.homeSizeInit = dataArr[12]; //主队大小初始值
    this.homeSizeScore = dataArr[13]; //主队大小实际值
    this.homeSizeOdds = dataArr[14]; //主队让大小赔率值
    this.awayLetInit = dataArr[23]; //客队让分初始值
    this.awayLetScore = dataArr[24]; //客队让分具体值
    this.awayLetOdds = dataArr[25]; //客队让分赔率值
    this.awaySizeInit = dataArr[26]; //客队大小初始值
    this.awaySizeScore = dataArr[27]; //客队大小实际值
    this.awaySizeOdds = dataArr[28]; //客队让大小赔率值
    this.openState = dataArr[29]; //开盘状态(0未开盘1赛前盘2已关盘)
    this.openStateFlag = dataArr[3]; //比赛状态(0未开盘1赛前盘2已关盘)
    this.homeTeamEn = dataArr[30]; //主队英文
    this.awayTeamEn = dataArr[31]; //客队英文
    this.groupNameEn = dataArr[32].split('^')[1]; //小组英文
    this.homeGoals = dataArr[35]; //主队赛果
    this.awayGoals = dataArr[36]; //客队赛果
}

//-------------------------- 页面 ---------------------------------------------------------
function InitPageSche() {
    //加载时间
    //bomHelper.ajaxGet("/txt/time.shtml", function (data) {
    //    SetTimeDiff(data);
    //});

    isShowYellowCard = (findCookie("isYellowShow") == "1" || findCookie("isYellowShow") == "");
    isRedSound = (findCookie("isRedSound") == "1" || findCookie("isRedSound") == "");
    isTanScore = (findCookie("isScoreTan") == "1" || findCookie("isScoreTan") == "");
    isTanRed = (findCookie("isRedTan") == "1");
    isSound = (findCookie("isScoreSound") == "1" || findCookie("isScoreSound") == "");
    language = findCookie("language");

    var _refreshTime = parseInt(findCookie("refreshTime"));
    if (_refreshTime >= 5) {
        refreshTime = _refreshTime;
    }

    //与服务器的时间差
    SetTimeDiff(thisServerTime);
    for (var i = 0; i < scheArr.length; i++) {
        var scheObj = new WCSche(scheArr[i]);
        scheObj.mIndex = i + 1;
        WCScheArr.push(scheObj);
    }
// debugger
    ShowScheList("分组赛");

    window.setTimeout(GetTime, refreshTime * 1000);
    window.setInterval(ShowStatePerMinute, 60 * 1000);
}
function ResetPageSche(scheArr, typeName) {
    WCScheArr = [];
    for (var i = 0; i < scheArr.length; i++) {
        var scheObj = new WCSche(scheArr[i]);
        scheObj.mIndex = i + 1;
        WCScheArr.push(scheObj);
    }
    ShowScheList(typeName);

    //window.setTimeout(GetTime, refreshTime * 1000);
    //window.setInterval(ShowStatePerMinute, 60 * 1000);
}

function ShowScheList(scheKind, scheKindIndex) {
    var scheList = [];
    var htmlArr = [];
    var count = 0;
    if (pathnameValue == '/') {
        var isNoStarted = '未开始';
        var isStarted = '已开始';
        var isEnd = '已结束';
        var isOdds = '让分';
        var isSize = '大/小';
        var isUnopened = '未开盘';
        var isClosed = '已关盘';
    } else {
        var isNoStarted = 'Not Started';
        var isStarted = 'Started';
        var isEnd = 'End';
        var isOdds = 'Handicap';
        var isSize = 'Over/Under';
        var isUnopened = 'Unopened';
        var isClosed = 'Closed';
    }
    for (var i = 0; i < WCScheArr.length; i++) {
        var scheObj = WCScheArr[i];
        var isShow = scheKind ? (scheKind == "决赛" ? ["决赛", "季军赛"].indexOf(scheObj.kind) > -1 : scheObj.kind == scheKind) : true;
        var groupFlag = (pathnameValue == '/') ? " 组" : " Group";
        var matchTimeFormat = (pathnameValue == '/') ? FormatWCTime(scheObj.matchTime, 1) : matchFormatDate("2022-" + FormatWCTime(scheObj.matchTime, 1));
        var groupTop = (scheObj.groupName ? (scheObj.groupName + groupFlag) : scheObj.kind);
        var homeGoals = (scheObj.homeGoals == '-') ? '' : scheObj.homeGoals;
        var awayGoals = (scheObj.awayGoals == '-') ? '' : scheObj.awayGoals;
        if (pathnameValue != '/') {
            groupTop = groupTop.replace("8强", "Quarter Final");
            groupTop = groupTop.replace("16强", "Round of 16");
            groupTop = groupTop.replace("准决赛", "Semi Final");
            groupTop = groupTop.replace("季军赛", "Finals");
            groupTop = groupTop.replace("决赛", "Finals");
        }
        if (isShow) {
            htmlArr.push("<div class=\"match\" id=\"match_" + scheObj.scheduleid + "\" >");
            //htmlArr.push("<div class=\"match\" id=\"match_" + scheObj.scheduleid + "\" onclick=\"ToFenXi(" + scheObj.scheduleid + ")\">");
            // htmlArr.push("  <div class=\"settop" + (IsAttension(scheObj.scheduleid) ? " on" : "") + "\" onclick=\"AddAtten(" + scheObj.scheduleid + ",this,event)\"></div>");
            htmlArr.push("  <div class=\"home\">");
            htmlArr.push("    <div class=\"data\">" + groupTop + "<span class=\"time\">" + matchTimeFormat + "</span>" + FormatWCTime(scheObj.matchTime, 2) + "</div>");
            htmlArr.push("    <div class=\"team\" id=\"" + scheObj.scheduleid + "_hName\">");
            //htmlArr.push("      <span class=\"cardBox\"><span class=\"rc\" id=\"" + scheObj.scheduleid + "_homeRed\" style=\"display:" + (scheObj.homeRed > 0 && isShowRedCard ? "" : "none") + "\">" + (scheObj.homeRed > 0 ? scheObj.homeRed : "") + "</span><span class=\"yc\" id=\"" + scheObj.scheduleid + "_homeYellow\" style=\"display:" + (scheObj.homeYellow > 0 && isShowYellowCard ? "" : "none") + "\">" + (scheObj.homeYellow > 0 ? scheObj.homeYellow : "") + "</span></span>");
            if (pathnameValue == '/') {
                htmlArr.push("      <div class=\"name\">" + scheObj.homeTeam + "</div>");
            } else {
                htmlArr.push("      <div class=\"name\">" + scheObj.homeTeamEn + "</div>");
            }
            htmlArr.push("      <i><img src=\"" + scheObj.homeFlag + "\" onerror=\"WCImgOnError(this)\" /></i>");
            htmlArr.push("    </div>");

            if (scheObj.openState == 1) {
                htmlArr.push("    <div class=\"oddsbg oddsdbTopL\">");
                htmlArr.push("      <span class=\"oddsFontSize\"><lable>" + scheObj.homeLetScore + "</lable><lable class=\"oddsColor lableLeft\">" + scheObj.homeLetOdds + "</lable><span>");
                htmlArr.push("    </div>");
                htmlArr.push("    <div class=\"oddsbg oddsdbBottomL\">");
                htmlArr.push("      <span class=\"oddsFontSize\"><lable>" + scheObj.homeSizeScore + "</lable><lable class=\"oddsColor lableLeft\">" + scheObj.homeSizeOdds + "</lable><span>");
                htmlArr.push("    </div>");

            }

            htmlArr.push("  </div>");
            htmlArr.push("  <div class=\"vs\">");

            if (scheObj.openStateFlag == 0) {
                htmlArr.push("    <div class=\"matchStateFlag0\"><lable>" + isNoStarted + "</lable></div>");
            }
            if (scheObj.openStateFlag == 1) {
                htmlArr.push("    <div class=\"matchStateFlag1\"><lable>" + isStarted + "</lable></div>");
            }
            if (scheObj.openStateFlag == 2) {
                htmlArr.push("    <div class=\"matchStateFlag2\"><lable>" + isEnd + "</lable></div>");
            }

            htmlArr.push("    <div class=\"name " + FormatScoreClass(scheObj) + "\" id=\"" + scheObj.scheduleid + "_score\"><small class=\"vs_home_goals\">" + homeGoals + "</small>" + FormatScore(scheObj) + "<small class=\"vs_away_goals\">" + awayGoals + "</small></div>");

            if (scheObj.openState == 0) {
                htmlArr.push("    <div class=\"oddsbg\">");
                htmlArr.push("      <span class=\"oddsFontSize msg oddsTriangleUp\"><lable class=\"vsLableCenter\">" + isUnopened + "</lable><span>");
                htmlArr.push("    </div>");
            }

            if (scheObj.openState == 1) {
                htmlArr.push("    <div class=\"oddsbg\">");
                htmlArr.push("      <span class=\"oddsFontSize msg oddsTriangleUp\"><lable class=\"vsLableCenter\">" + isOdds + "</lable><span>");
                htmlArr.push("    </div>");
                htmlArr.push("    <div class=\"oddsbg\">");
                htmlArr.push("      <span class=\"oddsFontSize\"><lable class=\"vsLableCenter\">" + isSize + "<span>");
                htmlArr.push("    </div>");
            }

            if (scheObj.openState == 2) {
                htmlArr.push("    <div class=\"oddsbg\">");
                htmlArr.push("      <span class=\"oddsFontSize msg oddsTriangleUp\"><lable class=\"vsLableCenter\">" + isClosed + "</lable><span>");
                htmlArr.push("    </div>");
            }

            htmlArr.push("  </div>");
            htmlArr.push("  <div class=\"guest\">");
            htmlArr.push("    <div class=\"data\">" + Goal2GoalCn(scheObj.firstLetGoal) + " <span class=\"conner\" id=\"" + scheObj.scheduleid + "_corner\">" + FormatCorner(scheObj) + "</span><span class=\"halfScore\" id=\"" + scheObj.scheduleid + "_halfScore\">" + FormatHalfScore(scheObj) + "</span></div>");
            htmlArr.push("    <div class=\"team\" id=\"" + scheObj.scheduleid + "_gName\">");
            htmlArr.push("      <i><img src=\"" + scheObj.awayFlag + "\" onerror=\"WCImgOnError(this)\" /></i>");
            if (pathnameValue == '/') {
                htmlArr.push("      <div class=\"name\">" + scheObj.awayTeam + "</div>");
            } else {
                htmlArr.push("      <div class=\"name\">" + scheObj.awayTeamEn + "</div>");
            }
            //htmlArr.push("      <span class=\"cardBox\"><span class=\"yc\" id=\"" + scheObj.scheduleid + "_awayYellow\" style=\"display:" + (scheObj.awayYellow > 0 && isShowYellowCard ? "" : "none") + "\">" + (scheObj.awayYellow > 0 ? scheObj.awayYellow : "") + "</span><span class=\"rc\" id=\"" + scheObj.scheduleid + "_awayRed\" style=\"display:" + (scheObj.awayRed > 0 && isShowRedCard ? "" : "none") + "\">" + (scheObj.awayRed > 0 ? scheObj.awayRed : "") + "</span></span>");
            htmlArr.push("    </div>");

            if (scheObj.openState == 1) {
                var scoreVal = addSpacePrice(scheObj.awayLetScore, scheObj.awaySizeScore);
                htmlArr.push("    <div class=\"oddsbg oddsdbTopR\">");
                htmlArr.push("      <span class=\"oddsFontSize\"><lable>" + scoreVal[0] + "</lable><lable class=\"oddsColor lableLeft\">" + scheObj.awayLetOdds + "</lable><span>");
                htmlArr.push("    </div>");
                htmlArr.push("    <div class=\"oddsbg oddsdbBottomR\">");
                htmlArr.push("      <span class=\"oddsFontSize\"><lable>" + scoreVal[1] + "</lable><lable class=\"oddsColor lableLeft\">" + scheObj.awaySizeOdds + "</lable><span>");
                htmlArr.push("    </div>");
            }

            htmlArr.push("  </div>");
            //htmlArr.push("  <div class=\"more\"></div>")
            htmlArr.push("  <div class=\"msg\" style='display:none;' id=\"" + scheObj.scheduleid + "_explain\">" + scheObj.explainText + "</div>");
            if (Ba_Soccer.indexOf(scheObj.scheduleid) != -1)
                //htmlArr.push("  <a href='?id=" + scheObj.scheduleid + "&kind=1'><div class=\"information\">本场精选情报</div></a>");
                htmlArr.push("</div>");
            count++;
        }
    }
    if (count == 0) htmlArr.push("<div class='nodata'>暂无数据</div>");
    document.getElementById("MatchContainer").innerHTML = htmlArr.join("");
}

function matchFormatDate(date) {
    date = new Date(date.replace(/-/g, '/')); //Wed Jan 02 2019 00:00:00 GMT+0800 (China Standard Time)
    var chinaDate = date.toDateString(); //"Tue, 01 Jan 2019 16:00:00 GMT"
    //注意：此处时间为中国时区，如果是全球项目，需要转成【协调世界时】（UTC）
    var globalDate = date.toUTCString(); //"Wed Jan 02 2019"
    //之后的处理是一样的
    var chinaDateArray = chinaDate.split(' ');
    var displayDate = `${chinaDateArray[1]} ${chinaDateArray[2]}`; //"Jan XX"
    console.log(displayDate);
    return displayDate;
}

function addSpacePrice(let, size) {
    var letVal = sizeVal = '';
    var letlen = let.length, sizelen = size.length;
    var len = (letlen > sizelen) ? letlen - sizelen : sizelen - letlen;

    if (len > 0) {
        if (letlen > sizelen) {
            var sizeSpaceString = '';
            for (var i = 0; i < len; i++) {
                sizeSpaceString += '&nbsp;';
                if (i % 2 == 1 || ((len % 2 == 1) && (len - 1) == i)) {
                    sizeSpaceString += '&nbsp;';
                }
                sizeSpaceString = (sizeSpaceString.length > 78) ? sizeSpaceString.slice(0, sizeSpaceString.length - 6) : sizeSpaceString;
            }
            letVal = let;
            sizeVal = sizeSpaceString + size;
        } else {
            var lenSpaceString = '';
            for (var i = 0; i < len; i++) {
                lenSpaceString += '&nbsp;';
                if (i % 2 == 1 || ((len % 2 == 1) && (len - 1) == i)) {
                    lenSpaceString += '&nbsp;';
                }
                lenSpaceString = (lenSpaceString.length > 78) ? lenSpaceString.slice(0, lenSpaceString.length - 6) : lenSpaceString;
            }
            letVal = lenSpaceString + let;
            sizeVal = size;
        }
    }

    return [letVal, sizeVal];
}

//广告
function ShowWorldCupAd(scheKindIndex) {
    //除了关注，其余子栏下广告位对应位置，统一为第N-1场赛事上方
    var adPosArr = [[0, 0, 0, 0, 0], [3, 2, 1, 1, 1], [6, 4, 2, 3, 3], [9, 6, 3, 3, 3]];

    var matchBox = document.getElementById("MatchContainer");
    var matchDomList = matchBox.getElementsByClassName("match");
    var adArr = window.arrImagesWorldCup || [];

    function CreateWCAdItem(adLink, adImgSrc) {
        var adDiv = document.createElement("div");
        adDiv.innerHTML = "<a href='" + adLink + "' target='_blank'><img src='" + adImgSrc + "' style='width:100%;height:34px'/></a>";
        return adDiv;
    }

    for (var i = 0; i < adArr.length; i++) {
        var adLink = adArr[i].split('^')[0];
        var adImgSrc = adArr[i].split('^')[1];
        var adPos = adPosArr[i];

        if (adPos) {
            var matchIndex = adPos[scheKindIndex];
            if (matchIndex >= 0) {
                var matchDom = matchDomList[matchIndex];
                if (matchDom)
                    matchBox.insertBefore(CreateWCAdItem(adLink, adImgSrc), matchDom);
                else
                    matchBox.appendChild(CreateWCAdItem(adLink, adImgSrc));
            }
        }
    }


}

function FormatScore(scheObj) {
    return (scheObj.matchState >= 1 && scheObj.matchState <= 4) || scheObj.matchState == -1 ? (scheObj.homeScore + "-" + scheObj.awayScore) : "VS";
}

function FormatScoreClass(scheObj) {
    return (scheObj.matchState >= 1 && scheObj.matchState <= 4) ? "green" : scheObj.matchState == -1 ? "red" : "";
}

function FormatStateClass(mState) {
    return (mState >= 1 && mState <= 4) || mState == -1 ? "red" : "";
}

function FormatCorner(scheObj) {
    var hCorner = scheObj.hCorner;
    var gCorner = scheObj.gCorner;
    if (hCorner !== '' && gCorner !== '') {
        if ((scheObj.matchState >= 1 && scheObj.matchState <= 4) || scheObj.matchState == -1) {
            return hCorner + "-" + gCorner;
        }
    }

    return "";
}

function FormatHalfScore(scheObj) {
    return (scheObj.matchState >= 2 && scheObj.matchState <= 4) || scheObj.matchState == -1 ? ("(" + scheObj.homeHalfScore + "-" + scheObj.awayHalfScore + ")") : "";
}

function FormatWCTime(dateObj, type) {
    function AddTimePre(n) {
        if (n < 10)
            return "0" + n;
        return n;
    }

    if (type == 1) {
        return AddTimePre(dateObj.getMonth() + 1) + "-" + AddTimePre(dateObj.getDate());
    }
    else if (type == 2) {
        return AddTimePre(dateObj.getHours()) + ":" + AddTimePre(dateObj.getMinutes());
    }
}

function GetTime() {
    try {
        LoadTime = (LoadTime + 1) % 60;
        if (LoadTime == 0) {
            GetXml("2");
        }
        else {
            var timeUrl = "/txt/time.txt?r=007" + Date.parse(new Date());
            //var timeUrl = "/vbsxml/time.txt?r=007" + Date.parse(new Date());
            bomHelper.ajaxGet(timeUrl, function (retData) {
                if (retData != "" && retData != lastUpdateFileTime) {
                    lastUpdateFileTime = retData;
                    GetXml("");
                }
            });
        }
    }
    catch (e) {
        isInRefreshing = false;
    }
    window.setTimeout(GetTime, 2000);
}

function GetXml(t) {
    bomHelper.ajaxXml("/txt/change" + t + ".xml?r=007" + Date.parse(new Date()), true, DealWithChange);
}

function DealWithChange(retXml) {
    var root = retXml.documentElement;
    var isTan = true;
    var score1change, score2change, red1change, red2change, oldHomeScore, oldAwayScore, oldHomeRed, oldAwayRed;
    for (var i = 0; i < root.childNodes.length; i++) {
        var liveObj;
        if (document.all && parseInt(bomHelper.ie) < 10)
            liveObj = new ScheLiveChange(root.childNodes[i].text);
        else
            liveObj = new ScheLiveChange(root.childNodes[i].textContent);

        isInRefreshing = true;

        for (var j = 0; j < WCScheArr.length; j++) {
            var scheObj = WCScheArr[j];
            if (scheObj.scheduleid == liveObj.scheduleid) {
                var sid = scheObj.scheduleid;
                var isHasDom = !!document.getElementById("match_" + sid);
                var isStateChangeEnd = false;
                scheObj.startTime = liveObj.startTime;
                scheObj.homeHalfScore = liveObj.homeHalfScore;
                scheObj.awayHalfScore = liveObj.awayHalfScore;

                //状态
                if (scheObj.matchState != liveObj.matchState) {
                    scheObj.matchState = liveObj.matchState;
                    isStateChangeEnd = scheObj.matchState <= -1;
                    if (isHasDom) {
                        document.getElementById(sid + "_state").innerHTML = ShowMatchState(scheObj.matchState, scheObj.startTime);
                        document.getElementById(sid + "_state").className = "data " + FormatStateClass(scheObj.matchState);
                        document.getElementById(sid + "_halfScore").innerHTML = FormatHalfScore(scheObj);
                        document.getElementById(sid + "_corner").innerHTML = FormatCorner(scheObj);
                        document.getElementById(sid + "_score").className = "name " + FormatScoreClass(scheObj);
                        document.getElementById(sid + "_score").innerHTML = FormatScore(scheObj);
                    }
                }

                //半场进球
                if (scheObj.homeHalfScore != "" || scheObj.awayHalfScore != "") {
                    if (isHasDom) {
                        document.getElementById(sid + "_halfScore").innerHTML = FormatHalfScore(scheObj);
                    }
                }
                score1change = false;
                //主进球
                if (scheObj.homeScore != liveObj.homeScore) {
                    oldHomeScore = liveObj.homeScore;
                    scheObj.homeScore = liveObj.homeScore;
                    score1change = true;
                    if (isHasDom) {
                        playSound(0);
                        document.getElementById(sid + "_score").innerHTML = FormatScore(scheObj);
                        document.getElementById(sid + "_hName").style.backgroundColor = "#FFEDBD";
                        if (isTan && isTanScore) {
                            isTan = false;
                            ShowScoreTan(scheObj.homeTeam, scheObj.awayTeam, scheObj.homeScore, scheObj.awayScore, true);
                            setTimeout("HideTan('ppDiv')", 8000);
                        }
                        setTimeout("ResetColor('" + sid + "_hName')", 10000);
                    }
                }
                score2change = false;
                //客进球
                if (scheObj.awayScore != liveObj.awayScore) {
                    oldAwayScore = liveObj.awayScore;
                    scheObj.awayScore = liveObj.awayScore;
                    score2change = true;
                    if (isHasDom) {
                        playSound(0);
                        document.getElementById(sid + "_score").innerHTML = FormatScore(scheObj);
                        document.getElementById(sid + "_gName").style.backgroundColor = "#FFEDBD";
                        if (isTan && isTanScore) {
                            isTan = false;
                            ShowScoreTan(scheObj.homeTeam, scheObj.awayTeam, scheObj.homeScore, scheObj.awayScore, false);
                            setTimeout("HideTan('ppDiv')", 8000);
                        }
                        setTimeout("ResetColor('" + sid + "_gName')", 10000);
                    }
                }

                //主红牌
                if (scheObj.homeRed != liveObj.homeRed) {
                    scheObj.homeRed = liveObj.homeRed;
                    if (isHasDom) {
                        playSound(2);
                        document.getElementById(sid + "_homeRed").innerHTML = scheObj.homeRed > 0 ? scheObj.homeRed : "";
                        document.getElementById(sid + "_homeRed").style.display = scheObj.homeRed > 0 && isShowRedCard ? "" : "none";

                        if (isTan && isTanRed) {
                            isTan = false;
                            ShowRedTan(scheObj.homeTeam, scheObj.homeRed);
                            setTimeout("HideTan('ppRedDiv')", 8000);
                        }
                    }
                }

                //客红牌
                if (scheObj.awayRed != liveObj.awayRed) {
                    scheObj.awayRed = liveObj.awayRed;
                    if (isHasDom) {
                        playSound(2);
                        document.getElementById(sid + "_awayRed").innerHTML = scheObj.awayRed > 0 ? scheObj.awayRed : "";
                        document.getElementById(sid + "_awayRed").style.display = scheObj.awayRed > 0 && isShowRedCard ? "" : "none";

                        if (isTan && isTanRed) {
                            isTan = false;
                            ShowRedTan(scheObj.awayTeam, scheObj.awayRed);
                            setTimeout("HideTan('ppRedDiv')", 8000);
                        }
                    }
                }

                //主黄牌
                if (scheObj.homeYellow != liveObj.homeYellow) {
                    scheObj.homeYellow = liveObj.homeYellow;
                    if (isHasDom) {
                        document.getElementById(sid + "_homeYellow").innerHTML = scheObj.homeYellow > 0 ? scheObj.homeYellow : "";
                        document.getElementById(sid + "_homeYellow").style.display = scheObj.homeYellow > 0 && isShowYellowCard ? "" : "none";
                    }
                }

                //客黄牌
                if (scheObj.awayYellow != liveObj.awayYellow) {
                    scheObj.awayYellow = liveObj.awayYellow;
                    if (isHasDom) {
                        document.getElementById(sid + "_awayYellow").innerHTML = scheObj.awayYellow > 0 ? scheObj.awayYellow : "";
                        document.getElementById(sid + "_awayYellow").style.display = scheObj.awayYellow > 0 && isShowYellowCard ? "" : "none";
                    }
                }

                //角球
                if (liveObj.hasCorner && (scheObj.hCorner != liveObj.hCorner || scheObj.gCorner != liveObj.gCorner)) {
                    scheObj.hCorner = liveObj.hCorner;
                    scheObj.gCorner = liveObj.gCorner;
                    scheObj.hasCorner = true;
                    if (isHasDom) {
                        document.getElementById(sid + "_corner").innerHTML = FormatCorner(scheObj);
                    }
                }

                //附加说明
                if (liveObj.explainText) {
                    scheObj.explainText = ShowExplain(liveObj.explainText, scheObj.homeTeam, scheObj.awayTeam);
                    if (isHasDom) {
                        document.getElementById(sid + "_explain").innerHTML = scheObj.explainText;
                        document.getElementById(sid + "_explain").style.display = "";
                    }
                }

                if (isStateChangeEnd) {
                    setTimeout(SetToBottom, 8000, scheObj);
                }

            }
        }

        isInRefreshing = false;
    }

}

function ShowScoreTan(hTeam, gTeam, hScore, gScore, isHome) {
    document.getElementById("PopWin").style.display = "block";
    document.getElementById("ppDiv").style.display = "block";
    document.getElementById("ppHomeTeam").innerHTML = hTeam;
    if (isHome)
        document.getElementById("ppScore").innerHTML = "<span class='red'>" + hScore + "</span>:" + gScore;
    else
        document.getElementById("ppScore").innerHTML = hScore + ":" + "<span class='red'>" + gScore + "</span>";
    document.getElementById("ppGuestTeam").innerHTML = gTeam;
}

function ShowRedTan(teamName, redNum) {
    document.getElementById("PopWin").style.display = "block";
    document.getElementById("ppRedDiv").style.display = "block";
    document.getElementById("redTeam").innerHTML = teamName;
    document.getElementById("redCardNum").innerHTML = redNum;
}

function HideTan(domId) {
    document.getElementById(domId).style.display = "none";
    document.getElementById("PopWin").style.display = "none";
}
//生成弹窗提示,t=1为主队变化,t=2为客队变化,t=3为主客队同时变化(比分或者红牌修正)
function GetTanBox(qt, t, isScore, boxDesc) {
    var str = new Array();
    var isBig = false;
    if (window.screen.width > 320) {
        isBig = true;
    }
    str.push('<div class="status"><span>' + qt.sclassName + '</span><span class="red">' + showMatchState(qt.matchState, qt.startTime) + '</span><span class="msg">' + boxDesc + '</span></div>');
    //1为主队变化
    if (t == 1 || t == 3) {
        if (isScore) {
            str.push('<div class="icon"><img src="/Images/ball.svg" /></div>');
        }
        else {
            str.push('<div class="icon"><img src="/Images/redCard.svg" /></div>');
        }
    }
    else {
        str.push('<div class="icon"></div>');
    }
    str.push('<div class="homeTeam"' + (isBig ? "" : "style='width:34%;'") + '>' + qt.homeTeam + '</div>');
    if (t == 3) {
        if (isScore) {
            str.push('<div class="b score"' + (isBig ? "" : "style='width:12%;'") + '><span class="red">' + qt.homeScore + '</span> : <span class="red">' + qt.awayScore + '</span></div>');
        } else {
            str.push('<div class="b score"' + (isBig ? "" : "style='width:12%;'") + '><span class="red">' + qt.homeRed + '</span> - <span class="red">' + qt.awayRed + '</span></div>');
        }
    } else {
        if (t == 1) {
            if (isScore) {
                str.push('<div class="b score"' + (isBig ? "" : "style='width:12%;'") + '><span class="red">' + qt.homeScore + '</span> : ' + qt.awayScore + '</div>');
            } else {
                str.push('<div class="b score"' + (isBig ? "" : "style='width:12%;'") + '><span class="red">' + qt.homeRed + '</span> - ' + qt.awayRed + '</div>');
            }
        } else {
            if (isScore) {
                str.push('<div class="b score"' + (isBig ? "" : "style='width:12%;'") + '>' + qt.homeScore + ' : <span class="red">' + qt.awayScore + '</span></div>');
            } else {
                str.push('<div class="b score"' + (isBig ? "" : "style='width:12%;'") + '>' + qt.homeRed + ' - <span class="red">' + qt.awayRed + '</span></div>');
            }
        }
    }
    str.push('<div class="guestTeam"' + (isBig ? "" : "style='width:34%;'") + '>' + qt.awayTeam + '</div >');
    if (t == 1) {
        str.push('<div class="icon"></div>');
    }
    else {
        if (isScore) {
            str.push('<div class="icon"><img src="/Images/ball.svg" /></div>');
        }
        else {
            str.push('<div class="icon"><img src="/Images/redCard.svg" /></div>');
        }
    }
    var ulList = document.getElementById("tanUl");
    if (ulList.childElementCount >= 3) {
        ulList.removeChild(ulList.lastElementChild);
    }
    var sid = "tanBox" + tanTimes;
    var li_1 = document.createElement("li");
    li_1.id = sid;
    li_1.innerHTML = str.join("");
    var ulList1 = document.getElementById("tanUl");
    if (ulList1.childElementCount > 0) {
        ulList1.insertBefore(li_1, ulList1.firstChild);
    }
    else {
        ulList1.appendChild(li_1)
    }
    setTimeout("hideTan('" + sid + "')", 10000);
    tanTimes = tanTimes + 1;
}
//获取比分页弹窗描述
function GetTanType(tanType, oldHomeScore, liveHomeScore, oldAwayScore, liveAwayScore, oldHomeRed, liveHomeRed, oldAwayRed, liveAwayRed) {
    if (tanType == 1) {
        if (oldHomeScore == liveAwayScore && oldAwayScore == liveHomeScore) {
            return "修正比分";
        }
        if (oldHomeScore < liveHomeScore || oldAwayScore < liveAwayScore) {
            return "进球";
        }
        if (oldHomeScore > liveHomeScore || oldAwayScore > liveAwayScore) {
            return "进球无效";
        }
    } else {
        if (oldHomeRed == liveAwayRed && oldAwayRed == liveHomeRed) {
            return "修正红牌";
        }
        if (oldHomeRed < liveHomeRed || oldAwayRed < liveAwayRed) {
            return "红牌";
        }
        if (oldHomeRed > liveHomeRed || oldAwayRed > liveAwayRed) {
            return "红牌无效";
        }
    }
}
//隐藏弹窗
function hideTan(sid) {
    var parent = document.getElementById("tanUl");
    var child = document.getElementById(sid);
    if (child != null) {
        parent.removeChild(child);
    }
}

//每分钟刷新比赛时间
function ShowStatePerMinute() {
    for (var i = 0; i < WCScheArr.length; i++) {
        var scheObj = WCScheArr[i];
        if (scheObj.matchState > 0) {
            var elem = document.getElementById(scheObj.scheduleid + "_state");
            if (elem) {
                elem.innerHTML = ShowMatchState(scheObj.matchState, scheObj.startTime);
                elem.className = "data " + FormatStateClass(scheObj.matchState);
            }
        }
    }
}

function ResetColor(sid) {
    if (document.getElementById(sid))
        document.getElementById(sid).style.backgroundColor = "#FFF";
}


function SetToBottom(scheObj) {
    if (!scheObj) return;

    var oldScheIndex = WCScheArr.indexOf(scheObj);
    if (oldScheIndex >= 0) {
        //根据权重重新排序
        WCScheArr = WCScheArr.sort(function (a, b) {
            var aw = a.Weight(), bw = b.Weight(); return aw == bw ? 0 : (aw > bw ? -1 : 1);
        });

        var newScheIndex = WCScheArr.indexOf(scheObj);
        if (oldScheIndex != newScheIndex) {
            var scheDom = document.getElementById("match_" + scheObj.scheduleid);
            if (scheDom) {
                var tempIndex = newScheIndex;

                if (tempIndex == WCScheArr.length - 1) {
                    //在最后
                    document.getElementById("MatchContainer").removeChild(scheDom);
                    document.getElementById("MatchContainer").appendChild(scheDom);
                }
                else {
                    //遍历后面的赛事
                    var isMove = false;
                    while (++tempIndex <= WCScheArr.length - 1) {
                        var nextDom = document.getElementById("match_" + WCScheArr[tempIndex].scheduleid);
                        if (nextDom) {
                            document.getElementById("MatchContainer").removeChild(scheDom);
                            document.getElementById("MatchContainer").insertBefore(scheDom, nextDom);
                            isMove = true;
                            break;
                        }
                    }

                    //后面的赛事没有显示的，则在最后
                    if (!isMove) {
                        document.getElementById("MatchContainer").removeChild(scheDom);
                        document.getElementById("MatchContainer").appendChild(scheDom);
                    }
                }


            }
        }
    }
}

function ToFenXi(scheid) {
    //var topHeight = getTopHeight();

    //writeCookie("scrollTop", topHeight, new Date((new Date()).getTime() + 60000));

    for (var i = 0; i < WCScheArr.length; i++) {
        var scheObj = WCScheArr[i];
        if (scheObj.scheduleid == scheid) {
            if (scheObj.matchState == 0) {
                window.location.href = CheckHzPrefix() + "/Analy/Analysis/" + scheid + ".htm?pagefrom=v";
            } else {
                window.location.href = CheckHzPrefix() + "/Analy/ShiJian/" + scheid + ".htm?pagefrom=v";
            }
            break;
        }
    }

}

function WCImgOnError(imgObj) {
    imgObj.src = "/static/index/images/worldcup/worldcuphoder.png";
    imgObj.onerror = null;
}

//-------------------------- 通用方法 ---------------------------------------------------------
function SetTimeDiff(data) {
    var t = new Date(data.substr(0, 4), parseInt(data.substr(4, 2)) - 1, data.substr(6, 2), data.substr(8, 2), data.substr(10, 2), data.substr(10, 2));
    timeDiff = parseInt(((new Date()).getTime() - t.getTime()) / 1000);
}

function ShowExplain(exlist, hometeam, guestteam) {
    // 广东体育; 1 | 1; 2 | 5; 12 | 90, 1 - 1; 2 - 2; 1, 2 - 2; 5 - 4; 1   
    hometeam = hometeam.replace("\(中\)", "");
    guestteam = guestteam.replace("\(中\)", "");
    var explainList = "";
    if (exlist != "") {
        var arrExplain = exlist.split('|');
        if (arrExplain[0].split(';')[0] != "")
            explainList += arrExplain[0].split(';')[0] + " ";
        if (arrExplain[0].split(';')[1] == "1")
            explainList += "<a href=http://www.310win.com/buy/jingcai.aspx target=_blank><font color=red>[购买竞彩]</font></a> <br>";
        if (arrExplain[1].split(';')[0] != "") {

            explainList += "先开球(";
            if (arrExplain[1].split(';')[0] == "1")
                explainList += hometeam + ")";
            else if (arrExplain[1].split(';')[0] == "2")
                explainList += guestteam + ")";
            if (arrExplain[1].split(';')[1] == "")
                explainList += "<br>";
        }
        if (arrExplain[1].split(';')[1] != "") {
            if (arrExplain[1].split(';')[1] == "1" || arrExplain[1].split(';')[1] == "5")
                explainList += " <a href=http://tvhk.city007.net/ target=_blank><font color=blue>[独家宽频]</font></a><br>";
            else if (arrExplain[1].split(';')[1] == "2" || arrExplain[1].split(';')[1] == "4")
                explainList += " <a href=http://www.310tv.com/ target=_blank><font color=blue>直播</font></a><br>";
        }
        if (arrExplain[2].split(';')[0] != "") {
            explainList += "角球数(" + arrExplain[2].split(';')[0] + ") | ";
            explainList += "角球数(" + arrExplain[2].split(';')[1] + ")<br>";
        }
        var scoresList = arrExplain[3].split(';');
        if (scoresList[0] != "") {
            explainList += scoresList[0].split(',')[0] + "分钟[" + scoresList[0].split(',')[1] + "],";
            if (scoresList[1] != "")
                explainList += "两回合[" + scoresList[1] + "],";
            if (scoresList[2] != "") {
                if (scoresList[2].split(',')[0] == "1")
                    explainList += "120分钟[" + scoresList[2].split(',')[1] + "],";
                else if (scoresList[2].split(',')[0] == "2")
                    explainList += "加时[" + scoresList[2].split(',')[1] + "],";
                else
                    explainList += "加时中,现在比分[" + scoresList[2].split(',')[1] + "]";
            }
            if (scoresList[3] != "")
                explainList += "点球[" + scoresList[3] + "],";
            explainList += (scoresList[4] == "1" ? hometeam + "赢" : scoresList[4] == "2" ? guestteam + "赢" : "");
        }
        else if (explainList.lastIndexOf("<br>") == explainList.length - 4)
            explainList = explainList.substring(0, explainList.length - 4);
    }
    return explainList;
}

//显示状态
function ShowMatchState(mState, startTime) {
    var ms = "";
    switch (mState) {
        case 4: ms = "加"; break;
        case 3: ms = "下半场"; break;
        case 2: ms = "中"; break;
        case 1: ms = "上半场"; break;
        //case 0: ms = "未开"; break;
        case 0: ms = "&nbsp;"; break; //未开不显示
        case -1: ms = "完"; break;
        case -10: ms = "取消"; break;
        case -11: ms = "待定"; break;
        case -12: ms = "腰砍"; break;
        case -13: ms = "中断"; break;
        case -14: ms = "推迟"; break;
    }
    if (language == "1") {
        //本地化
        switch (mState) {
            case 3: ms = "下半場"; break;
            case 1: ms = "上半場"; break;
            //case 0: ms = "未開"; break;
            case 0: ms = "&nbsp;"; break;
            case -14: ms = "推遲"; break;
        }
    }
    if (mState == 1) {
        var now = new Date();
        var serverTime = now.getTime() / 1000 - timeDiff;

        var df = (serverTime - startTime.getTime() / 1000) / 60;
        df = parseInt(df);
        if (df <= 0) {
            ms = "1'";
        } else if (df <= 45) {
            ms = df.toString() + "'";
        } else {
            ms = "45+'";
        }
    } else if (mState == 3) {
        var now = new Date();
        var serverTime = now.getTime() / 1000 - timeDiff;
        var df = (serverTime - startTime.getTime() / 1000) / 60 + 46;
        //由于不确定它计算出来的数据一定准确，所以做多几个判断
        df = parseInt(df);
        if (df <= 46) {
            ms = "46'";
        } else if (df <= 90) {
            ms = df.toString() + "'";
        } else {
            ms = "90+'";
        }
    }
    return ms;
}

function Goal2GoalCn(goal) { //数字盘口转汉汉字	
    if (goal == null || goal + "" == "")
        return "";
    else {
        if (goal > 10 || goal < -10) return goal + "";
        if (goal >= 0) return GoalCn2[parseInt(goal * 4)];
        else return "-" + GoalCn2[Math.abs(parseInt(goal * 4))];
    }
}
function showVs() {
    document.getElementById("vsContainer").style.display = (document.getElementById("vsContainer").style.display == "none" ? "" : "none");
    document.body.style.overflow = document.body.style.overflow == "hidden" ? "visible" : "hidden";
}

//音乐播放相关
function _$(id) {
    return document.getElementById(id);
}
window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
var ac = new window.AudioContext();
var isUC = navigator.userAgent.toLowerCase().indexOf("ucbrowser") > 0;
function playSoundAndriod(type, source) {
    try {
        var sourceTemp = null;
        var arrayBuffer = type == 1 ? goalSoundBuffer : redSoundBuffer;

        //analyser && analyser.disconnect(gainNode);
        //gainNode && gainNode.disconnect(ac.destination);

        sourceTemp = ac.createBufferSource();
        sourceTemp.buffer = arrayBuffer;

        // 创建音量节点
        gainNode = ac.createGain();
        // 创建分析节点
        analyser = ac.createAnalyser();

        // 嵌套连接
        sourceTemp.connect(gainNode);
        analyser.connect(gainNode);
        gainNode.connect(ac.destination);
        sourceTemp.start(0);

    } catch (e) {
        alert(e);
    }
}
function playSound(opt) {
    if (navigator.userAgent.toLowerCase().indexOf("iphone") != -1 || navigator.userAgent.toLowerCase().indexOf("pad") != -1) {
        try {
            if (isUC) {
                if (opt == 2) {
                    if (isRedSound)
                        playSoundAndriod(2, redSource);
                } else {
                    if (isSound)
                        playSoundAndriod(1, goalSource);
                }
            } else {
                var sName = opt == 0 ? "audio_home" : (opt == 1 ? "audio_away" : "audio_red");
                if (sName == "audio_red" && isRedSound) {
                    _$(sName).play();
                } else {
                    if (isSound) {
                        _$(sName).play();
                    }
                }
            }
        }
        catch (e) { }
    }
    else {
        if (opt == 2) {

            if (isRedSound) {
                if (isUC)
                    playSoundAndriod(2, redSource);
                else
                    document.getElementById("soundRed").play();
            }
        }
        else {
            if (isSound) {
                if (isUC)
                    playSoundAndriod(1, goalSource);
                else
                    document.getElementById("sound").play();
            }
        }
    }
}
function sound_init() {

    if (isUC && ac != null) {
        loadAudioFile(1);
        loadAudioFile(2);
    }
    else {
        //主队声音
        var sound_arr = new Array();
        sound_arr.push('<audio id="audio_home" style="display: none">');
        sound_arr.push('<source src="/static/index/images/worldcup/goals_sound.mp3" type="audio/mpeg" />');
        sound_arr.push('<source src="/static/index/images/worldcup/goals_sound.ogg" type="audio/ogg" />');
        sound_arr.push('</audio>');
        if (!_$("audio_home")) {
            _$("soundsHome").innerHTML = sound_arr.join("");
        }
        //客队声音
        sound_arr = new Array();
        sound_arr.push('<audio id="audio_away" style="display: none">');
        sound_arr.push('<source src="/static/index/images/worldcup/goals_sound.mp3" type="audio/mpeg" />');
        sound_arr.push('<source src="/static/index/images/worldcup/goals_sound.ogg" type="audio/ogg" />');
        sound_arr.push('</audio>');
        if (!_$("audio_away")) {
            _$("soundsAway").innerHTML = sound_arr.join("");
        }

        //红牌声音
        sound_arr = new Array();
        sound_arr.push('<audio id="audio_red" style="display: none" >');
        sound_arr.push('<source src="/static/index/images/worldcup/sound_red.mp3" type="audio/mpeg" />');
        sound_arr.push('<source src="/static/index/images/worldcup/sound_red.ogg" type="audio/ogg" />');
        sound_arr.push('</audio>');
        if (!_$("audio_red")) {
            _$("soundsRed").innerHTML = sound_arr.join("");
        }

        _$("audio_home").load();
        _$("audio_away").load();
        _$("audio_red").load();

        if (window.removeEventListener) {
            window.removeEventListener("touchstart", soundHandle, false);
        }
        window.addEventListener("touchstart", soundHandle, false);
    }
}

function soundHandle() {
    if (_$("audio_home")) {
        _$("audio_home").load();
        _$("audio_away").load();
        _$("audio_red").load();
    }
    if (window.removeEventListener) {
        window.removeEventListener("touchstart", soundHandle, false);
    }
}
function loadAudioFile(type) {
    var url = type == 1 ? "/static/index/images/worldcup/goals_sound.mp3" : "/static/index/images/worldcup/sound_red.mp3"
    var xhr = new XMLHttpRequest(); //通过XHR下载音频文件
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function (e) { //下载完成
        initSound(this.response, type);
    };
    xhr.send();
}

function createAudio(buffer, type) {
    var bufferSource, audioBuffer
    // 如果音频是关闭状态，则重新新建一个全局音频上下文
    if (ac.state === 'closed') {
        ac = new (window.AudioContext || window.webkitAudioContext)();
    }
    audioBuffer = buffer;

    // 创建BufferSrouceNode
    bufferSource = ac.createBufferSource();
    bufferSource.buffer = buffer;
    // 创建音量节点
    gainNode = ac.createGain();
    // 创建分析节点
    analyser = ac.createAnalyser();

    // 嵌套连接
    bufferSource.connect(gainNode);
    analyser.connect(gainNode);
    gainNode.connect(ac.destination);

    if (type == 1) {
        goalSource = bufferSource;
    } else {
        redSource = bufferSource;
    }
}
function initSound(arrayBuffer, type) {
    var audioBuffer = null;
    ac.decodeAudioData(arrayBuffer, function (buffer) { //解码成功时的回调函数
        if (type == 1) {
            goalSoundBuffer = buffer;
        } else {
            redSoundBuffer = buffer;
        }
        createAudio(buffer, type);
    }, function (e) { //解码出错时的回调函数
        console.log('Error decoding file', e);
    });
}
//多语言选择
function ShowLanguage() {
    document.getElementById('lang-menu').classList.toggle('showlan');
}

// document.addEventListener("click", clickHidden); //所有组件添加点击事件
// function clickHidden() {
//     console.log(123);
//     //document.getElementById("language-list").style.display = "none";
// }

