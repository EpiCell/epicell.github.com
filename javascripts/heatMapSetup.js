var markerColors=new Array("f52124","0442f3","037511","000000","fb8f10","8e0000","05d400","f5d608","ea0ba8","239eda");

    var map;
    var markersArray = [];
    var networkArray = [];
    var versionCode = 1.0;
    var posOveride = false;
    var initZoom=11;
    var numIcons = markerColors.length;
    var iconArray = [];
    var customIcons = [31000, 310120, 310260, 310000, 310410, 310038, 23415, 23430, 23410, 23433, 23420];
    //31000 Verizon, 310120 Sprint, 310260 T-mobile (US), 3100000 Cricket, 310410 AT&T, 310038 MetroPCS, 23415 Vodafone UK, 23430 T-mobile (UK), 23410 O2-UK, 23433 Orange UK, 23420 3 (UK) 
    var arrInfoWindows = [];
    var markerLimit = 100;
    var netwk4GArr = ["all", "310120", "310260", "31000"];
    //310260 = T-mobile (HSPA+), 310120 = Sprint (Wi-Max)
    var netDispLim = 5;
    var netDispExtra = 0;
    var firstPageLoad = 1;
    var filtersArr = [];
    var netwkDispArr = [];
    filtersArr["netwkID"] = []; 
    filtersArr["netwkType"] = []; 
    var removedMarkers;
    var prvRtnCount=markerLimit;
    var prvZoom=initZoom;
    var zoomDcrs=1;
    var isHeatMap=1; var startHeatMap=1;    
    var heatmapHTML = '<p id="heatmapStrong">Strong Signal</p><p id="heatmapWeak">Weak Signal</p><p id="heatmap"><img src="http://d2cpknllkuywe0.cloudfront.net/images/heatmap-150.png" /></p>';