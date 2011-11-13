var loadingHTML='<div id="towerNumMsg"><div id="loading"><img src="https://s3.amazonaws.com/osmwww/images/loading.gif" /></div></div>';

var loadingHeatmapHTML='<div id="loading" style="position:relative;top:8px"><img src="https://s3.amazonaws.com/osmwww/images/loading.gif" /></div>';

var updateRefreshHTML = '<p id="updateRefresh">'/*<a id="mapUpdate"><img src="http://s3.amazonaws.com/osmwww/images/update.png" /></a>*/+'<a id="resetFilters"><img src="http://s3.amazonaws.com/osmwww/images/reset.png" /></a></p>';

var allNetworksHTML = '<div><div><input class="filterTower" name="filterTower" type="radio" checked="checked" id="all" /></div><p id="all-para">All Networks <span class="towerNumCount"></span></p></div>';

var netwkTypeListHTML = '<div id="netwkTypeList" style="display:none"><div id="netwkTypeFilter2GDiv"><a class="cssPop netwkTypePopup" style="text-decoration:none" href="/blog/2011/02/18/what-the-2-75g/"><img src="http://s3.amazonaws.com/osmwww/images/info.png" /><span>2G technology includes voice calls and some basic data services... (more)</span></a><input class="netwkTypeFilter" type="checkbox" checked="checked" name="netwkTypeFilter" value="2G" type="radio" id="2G" />2G</div><div id="netwkTypeFilter3GDiv"><a class="cssPop netwkTypePopup" href="/blog/2011/02/18/what-the-2-75g/" style="text-decoration:none"><img src="http://s3.amazonaws.com/osmwww/images/info.png" /><span>3G technology includes voice calls and high speed data services... (more)</span></a><input class="netwkTypeFilter" type="checkbox" checked="checked" name="netwkTypeFilter" value="3G" type="radio" id="3G" />3G </div><div id="netwkTypeFilter4GDiv"><a class="cssPop netwkTypePopup" href="/blog/2011/02/18/what-the-2-75g/" style="text-decoration:none"><img src="http://s3.amazonaws.com/osmwww/images/info.png" /><span>4G is the latest generation technology that supports broadband like data speeds... (more)</span></a><input class="netwkTypeFilter" type="checkbox" checked="checked" name="netwkTypeFilter" value="4G" type="radio" id="4G" />4G </div></div>';

(function($){$.fn.clearField=function(s){s=jQuery.extend({blurClass:'clearFieldBlurred',activeClass:'clearFieldActive',attribute:'rel',value:''},s);return $(this).each(function(){var el=$(this);s.value=el.val();if(el.attr(s.attribute)==undefined){el.attr(s.attribute,el.val()).addClass(s.blurClass)}else{s.value=el.attr(s.attribute)}el.focus(function(){if(el.val()==el.attr(s.attribute)){el.val('').removeClass(s.blurClass).addClass(s.activeClass)}});el.blur(function(){if(el.val()==''){el.val(el.attr(s.attribute)).removeClass(s.activeClass).addClass(s.blurClass)}})})}})(jQuery);

    
function mapInit(){         
    if (posOveride) {
        var latlng = new google.maps.LatLng(latOveride,lngOveride);
        $('#brenInfo').append("Location: <b>Manual Link</b>");
    } else if (google.loader.ClientLocation) {
        var latlng = new google.maps.LatLng(google.loader.ClientLocation.latitude, google.loader.ClientLocation.longitude);
        $('#brenInfo').append("Location: <b>IP Based</b>");
    } else {
        var client = new simplegeo.ContextClient('BzkqJWGWZpa9rcK5J6P5MBg8J85JRpmW');
        
        var latlng = new google.maps.LatLng(37.777125,-122.419644);
        $('#brenInfo').append("Location: <b>Default (San Francisco)</b>");
                
        client.getLocationFromIP(function(err, position) {
            if(err) {} else {
                latlng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                $('#brenInfo').append("Location: <b>SimpleGeoIP</b>"+latlng);
                if(map === null || map === undefined) {
                    //make sure map exists
                } else {
                    map.setCenter(latlng);
                }
            } 
        });
                    
        //var latlng = new google.maps.LatLng(37.777125,-122.419644);
        
    }

    var settings = {
        zoom: initZoom,
        center: latlng,
        mapTypeControl: false,
        //mapTypeControlOptions: {
        //  style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        //  position: google.maps.ControlPosition.LEFT
        //},
        //disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    var stylez = [
      {
        featureType: "road",
        elementType: "all",
        stylers: [
          { visibility: "simplified" }
        ]
      },{
        featureType: "road.highway",
        elementType: "all",
        stylers: [
          { lightness: -4 }
        ]
      },{
        featureType: "road.arterial",
        elementType: "all",
        stylers: [
          { lightness: -4 }
        ]
      }
    ];
    
    geocoder = new google.maps.Geocoder();
       
    map = new google.maps.Map(document.getElementById("first-map"), settings);
    
    var styledMapOptions = {
          name: "OpenSignalMaps"
    }

    var jazzMapType = new google.maps.StyledMapType(
          stylez, styledMapOptions);

    map.mapTypes.set('opensignalmaps', jazzMapType);
    map.setMapTypeId('opensignalmaps');
    
    var overlayDivTEMP = '<div id="overlayDiv"><div id="map-overlay-container" style="cursor:pointer"><div id="map-control" class="map-overlay" classname="map-overlay" title="Toggle Map Mode">';
        
    if (startHeatMap==1) {
        overlayDivTEMP += '<a class="controlMode" id="controlModeHeatmap">Coverage Map</a> <a id="controlModeTower" class="controlMode switchedOff">Tower Map</a>';
    } else {
        overlayDivTEMP += '<a class="controlMode switchedOff" id="controlModeHeatmap">Coverage Map</a> <a id="controlModeTower" class="controlMode">Tower Map</a>';
    }
    
    overlayDivTEMP += '</div><div class="map-overlay" classname="map-overlay" id="map-control-info"><div id="map-control-bar" class="bot-brdr" classname="bot-brdr"><a title="Show/Hide Sidebar" id="controlBarToggle"><img src="https://s3.amazonaws.com/osmwww/images/arrow-up.png"></a><a title="Zoom In" class="controlZoom" id="zoomIn"><img src="https://s3.amazonaws.com/osmwww/images/control-zoom-in.png"></a><a title="Zoom Out" class="controlZoom" id="zoomOut"><img src="https://s3.amazonaws.com/osmwww/images/control-zoom-out.png"></a><a title="Launch/Hide Full Screen Mode" id="controlBarFullScrn"><img src="https://s3.amazonaws.com/osmwww/images/fullscreen.png"></a><div id="heatmapLoadingContainer"></div></div><div id="map-control-body">'+loadingHTML+'<div id="towerList"></div></div></div></div></div>';
    
    $('#container').append('<div style="display:none">'+overlayDivTEMP+'</div>');
    
    var overlayDiv = document.getElementById('overlayDiv');
    var controlDiv = document.getElementById('map-control');
    
    overlayDiv.index = 1;
    
    google.maps.event.addDomListener(controlDiv, 'click', function() {
        switchMap(map);
    });
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(overlayDiv);
            
    google.maps.event.addListener(map, 'tilesloaded', function () {
        
        if (startHeatMap==1) { // Check if link is asking to start with heatmap.  If so, pretend heatmap is off & switch to heatmap.
            isHeatMap=0;
            startHeatMap=0; // Reset value so it won't do it on next tilesloaded event.
            switchMap(map);
        } else { updateMap(map, 0); }
    }); 
}
    
function switchMap(map) {
    if (isHeatMap==0) {
        clearOverlays();
        //map.overlayMapTypes.insertAt(0, heatmap);
        isHeatMap=1;
        getMarkers(map, isHeatMap, 1); 
        $('#controlModeHeatmap').removeClass('switchedOff');
        $('#controlModeTower').addClass('switchedOff');
    } else if (isHeatMap==1) {
        isHeatMap=0;
        if(map.overlayMapTypes.length!=0) { map.overlayMapTypes.removeAt(0); } 
        clearOverlays();
        customFilterInteraction();  // Display custom errors here (if switching from 4G heatmap view to tower view).
        getMarkers(map, isHeatMap, 0); //heatmaptoo would usually be 1 for this, but redundant as done manually above
        limitMarkers(markerLimit);
        $('#controlModeHeatmap').addClass('switchedOff');
        $('#controlModeTower').removeClass('switchedOff');
    }
    generateLink();
}

function postNotification(message) {

    if ($('#mapNotification').length==0) {
        $('#map-overlay-container').after('<div id="mapNotification"></div>');  
    }
    $('#mapNotification').replaceWith('<div id="mapNotification" style="display:none"><p>'+message+'</p></div>')
    $('#mapNotification').fadeIn(200).delay(6000).fadeOut(400);     

}

function refreshHeatMap(map, heatmaptoo) {
    clearOverlays();
    if (heatmaptoo==1) {
        if(map.overlayMapTypes.length!=0) { map.overlayMapTypes.removeAt(0); } 
        map.overlayMapTypes.insertAt(0, heatmap);
    }
}

function updateMap(map, heatmaptoo) {
    if (isHeatMap==0) {
        if( filtersArr["netwkID"].length >= 1 || filtersArr["netwkType"].length >= 1) {
            clearOverlays();
        }
    }
    getMarkers(map, isHeatMap, heatmaptoo);
    generateLink();
}

function limitMarkers(markerLimit) {
  if (markersArray) { 
    for (i in markersArray) {
        if (i>markerLimit-1) {
            markersArray[i].setMap(null);
        } 
    }
    var numToRemove = markersArray.length-markerLimit;
    removedMarkers = markersArray.splice(markerLimit,numToRemove);
    //alert(markerLimit+':'+numToRemove+' : '+markersArray.length);
  }
}

function clearOverlays() {
    if (markersArray) {
        for (i in markersArray) {
          markersArray[i].setMap(null);
        }
  }
}

function addNetwkToArr(network_id, netwkName, netwkCount) {

    if(network_id=="all") {return false;}
    
    //Assign Icon
    if (jQuery.inArray(network_id, networkArray)==-1) {
        networkArray.push(network_id);
        if (networkArray.length>numIcons) { 
            var iconID = (networkArray.length % numIcons); 
        } else { 
            var iconID = networkArray.length-1; 
        } 
        if (jQuery.inArray(parseInt(network_id, 10), customIcons)==-1) {
            iconArray[network_id]='https://s3.amazonaws.com/osmwww/images/ant-icons/'+markerColors[iconID]+'.png';
        } else {
            iconArray[network_id]='https://s3.amazonaws.com/osmwww/images/ant-icons/'+network_id+'.png';
        }
    }
    
    //Build Network List HTML
    
    if (netwkDispArr.length<netDispLim && jQuery.inArray(network_id, netwkDispArr)==-1) {
        $('#towerList').append('<div><div><img height="22" width="22" src="'+iconArray[network_id]+'" /><input class="filterTower" name="filterTower" type="radio" id="'+network_id+'" /></div><p id="'+network_id+'-para">'+netwkName+' <span class="towerNumCount">('+netwkCount+')</span></p></div>');
        if (jQuery.inArray(parseInt(network_id, 10), filtersArr["netwkID"])>-1) { 
            //console.log('match for '+ network_id);
            $('input#'+network_id).attr('checked', true); 
            showNetwkTypeOptions(network_id);
        } else { 
            //console.log('No match for '+ network_id);
        } // Give options for filtered networks
        netwkDispArr.push(network_id); // Keep track of displayed networks.
    } else { netDispExtra=netDispExtra+1; }
}

function showNetwkTypeOptions(id) {
    
    $('#netwkTypeList').remove(); // Get rid of any previous instance
    $('#'+id+'-para').after(netwkTypeListHTML);
    if (jQuery.inArray(id, netwk4GArr)>-1) { $('#netwkTypeFilter4GDiv').show(); } else { $('#netwkTypeFilter4GDiv').hide(); }
    
    $('#netwkTypeList').show();
    
    $('#netwkTypeList input').unbind('change').bind('change', function() { 
    
        filtersArr["netwkType"].length=0;  // Temporary reset array to recalculate
    
        if($('#netwkTypeList input:checked').length == 3) { 
            
            // All checked - keep no filters.
            
        } else {
            
            $('#netwkTypeList input:checked').each(function() {
                
                var netwkTypeid = $(this).attr('id');
                if ($(this).attr('checked') && $(this).is(":visible")) { // Visible check means 4G won't be included if its not visible
                    if (jQuery.inArray(netwkTypeid, filtersArr["netwkType"])==-1) {
                        filtersArr["netwkType"].push(netwkTypeid);
                    }
                } else { // Anything not checked is removed from filter array.
                    var bTemp = jQuery.inArraynetwkTypeid;
                    if (bTemp>-1) {
                        filtersArr["netwkType"].splice(bTemp,1);
                    }
                }
            });
        }
        
        customFilterInteraction(); // Display custom errors e.g. if filtering for 4G towers (which we can't yet display).

        updateMap(map, 1);
    });
    
                
    if(id=="all") { filtersArr["netwkID"].length=0; } else { filtersArr["netwkID"]=[id]; }

}

function resetFilters() { 
    filtersArr["netwkID"].length=0; filtersArr["netwkType"].length=0; updateMap(map, 1); 
}

function customFilterInteraction() {

    if (filtersArr["netwkType"].length==1 && jQuery.inArray("4G", filtersArr["netwkType"])>-1 && isHeatMap!=1) {
        postNotification("We are still working on 4G tower locations! At the moment we can only show 3G");
        $('#netwkTypeList input#3G').attr('checked', true);
        filtersArr["netwkType"].push("3G");
    } 
    
    if (filtersArr["netwkType"].length==1 && jQuery.inArray("4G", filtersArr["netwkType"])>-1 && isHeatMap==1 && jQuery.inArray("310260", filtersArr["netwkID"])>-1) {
        postNotification("Note: Although T-mobile now has its HSPA+ network that supports 4G like speeds, we have no way to detect this so its included in our T-mobile 3G data.");
        $('#netwkTypeList input#3G').attr('checked', true);
        filtersArr["netwkType"].push("3G");
    } 
}

function getMarkers(map, isHeatMap, heatmaptoo) {

    //postNotification('map updated');
    
    //if($('#towerList').length!=0) { var towerListHTML = $('#towerList').html(); } else { var towerListHTML = ""; }
    //$('#map-control-body').html(loadingHTML+'<div id="towerList">'+towerListHTML+'</div>');
    
    if (isHeatMap==0) { 
        $('#towerNumMsg').replaceWith(loadingHTML); 
    } else { 
        $('#towerNumMsg').html(heatmapHTML);
        console.log("trying to add html")
         console.log("towerNumMsg length:"+$('#map-control-body').length); 
        $('#heatmapLoadingContainer').html(loadingHeatmapHTML); 
        refreshHeatMap(map, heatmaptoo); // Update the heatmap tiles.
    
    }
    
    var bounds = map.getBounds();
    var zoom = map.getZoom();

    var swPoint = bounds.getSouthWest();
    var nePoint = bounds.getNorthEast();
    var digits = 5;
    if (zoom>16) {  
        digits = 4;
    } else if (zoom>12 && zoom <=16) {
        digits = 3;
    } else if (zoom>9 && zoom<=12) {
        digits = 2;
    } else if (zoom>7 && zoom<=9) {
        digits = 1;
    } else if (zoom<=7) {
        digits = 0;
    }
    if (zoom >= prvZoom) { zoomDcrs = 0; } else { zoomDcrs=1; }
    prvZoom=zoom // Set for next time round
    var minlat = swPoint.lat().toFixed(digits);
    var minlng = swPoint.lng().toFixed(digits);
    var maxlat = nePoint.lat().toFixed(digits);
    var maxlng = nePoint.lng().toFixed(digits);
    //$('#brenInfo').html('<p>maxlat:'+maxlat+' minlat: '+minlat+' maxlng: '+maxlng+' minlng: '+minlng+' netwkID:'+filtersArr["netwkID"]+' netwkType:'+filtersArr["netwkType"]+' zoom:'+zoom+'</p>')
    
    $.post('/app/getdata.php', { maxlat: maxlat, minlat: minlat, maxlng: maxlng, minlng: minlng, netwkID:filtersArr["netwkID"], netwkType:filtersArr["netwkType"], isHeatMap:isHeatMap, prvRtnCount:prvRtnCount, zoomDcrs:zoomDcrs, zoom:zoom, client:"web" }, function(xml) {

        //if (isHeatMap==1) { return false; } //Prevent fast user switching screwing things up
        var towerNum = $('summary', xml).attr('num');
        if(prvRtnCount<markerLimit && zoomDcrs!=1 && isHeatMap==0 && towerNum>=markerLimit) {
            // I detected a false index - take action? //
        } 
        if(isHeatMap==0) {prvRtnCount=towerNum;} else {prvRtnCount=markerLimit;} // Should ensure no index is used switching back from heatmaps
        
        if (towerNum>=markerLimit) { 
            if (isHeatMap==0) { 
                $('#towerNumMsg').html('<span class="markersLimited">Showing a selection of '+markerLimit+' Cell Towers.&nbsp; Zoom in for more.</span>'); 
            } else { $('#loading').remove(); }
        } else { 
            if (isHeatMap==0) { $('#towerNumMsg').html(towerNum+' Towers are located in this view'); } else { $('#loading').remove(); }
            clearOverlays(); //This is because limit markers won't remove enough in this case.
        }
        //var sql = $('summary', xml).attr('sql');
        //$('#towerNumMsg').append(sql);
    
        //var checkTemp = $('summary', xml).attr('netwkID');
        
        if( filtersArr["netwkID"].length >= 1 || filtersArr["netwkType"].length >= 1) {
            
            if (netwkDispArr.length==0) {
                $('#towerList').html(updateRefreshHTML);
                $('#resetFilters').click(function() { resetFilters(); });
            }
            
            if ( filtersArr["netwkID"].length==0 && $('#all-para').length==0 ) {
                $('#towerList').append(allNetworksHTML);
                $('#all-para span.towerNumCount').html('('+towerNum+')');
                showNetwkTypeOptions('all');
                //If all networks html doesnt exist and its not filtered by network, add it
            }
            
            $('network', xml).each(function() {
                var network_id = $(this).attr('id');
                var network_name = $(this).attr('name');
                var count = $(this).attr('count');
    
                addNetwkToArr(network_id, network_name, count);
                
            });
            
        } else {
            $('#towerList').html(updateRefreshHTML);
            $('#towerList').append(allNetworksHTML);
            $('input#all').attr('checked', true); 
            $('#all-para span.towerNumCount').html('('+towerNum+')');
            
            showNetwkTypeOptions('all');
            netwkDispArr.length=0; // Reset displayed network list.
            
            $('#resetFilters').click(function() { resetFilters(); });
            
            netDispExtra=0;
            $('network', xml).each(function() {
                var network_id = $(this).attr('id');
                var network_name = $(this).attr('name');
                var count = $(this).attr('count');
                
                addNetwkToArr(network_id, network_name, count);
                
            });
            if (netDispExtra>0) { $('#towerList').append('<div style="clear:both"></div><p id="netDispExtra">'+netDispExtra+' more networks not listed...</p>'); }
            
        }
        
        if (isHeatMap==1) { $('.towerNumCount').hide(); } else { $('.towerNumCount').show(); } // Tower count is irrelevant for HeatMaps
        
        var uncheckArr = ["2G", "3G", "4G"];  
        $('networktype', xml).each(function() {//Uncheck all boxes that were not filtered. Just for first page load if customized url
        
            var netwkType = $(this).attr('netwkType');
            var bTemp = jQuery.inArray(netwkType, uncheckArr);
            if (bTemp>-1) {
                uncheckArr.splice(bTemp,1);
            }                   
        });
        
        if (uncheckArr.length!=0  && uncheckArr.length!=3) { //If length=3 no filters were in xml, so all should remain checked
            for(i in uncheckArr) {
                $('#netwkTypeList input#'+uncheckArr[i]).attr('checked', false);
            }
        }
        
        $('#towerList input').not('#netwkTypeList input').unbind('change').bind('change', function() {
            
            var id = $(this).attr('id');
            showNetwkTypeOptions(id);
            /* Old Logic that allowed more than one networkID in filtersArr
            if ($(this).attr('checked')) {
                if (jQuery.inArray(id, filtersArr["netwkID"])==-1) {
                    filtersArr["netwkID"].push(id);
                }
            } else { // Anything not checked is removed from filter array.
                var bTemp = jQuery.inArray(id, filtersArr["netwkID"]);
                if (bTemp>-1) {
                    filtersArr["netwkID"].splice(bTemp,1);
                }
            }*/
            updateMap(map, 1);
        });
        
        $('marker', xml).each(function(i) {
            
            //var fuzz = (Math.random()/9000); // INTRODUCE SOME FUZZING
            //var tempLat = parseFloat($(this).attr('lat'))+parseFloat(fuzz);
            //var tempLng = parseFloat($(this).attr('lng'))+parseFloat(fuzz);

            var network_id = $(this).attr('network_id');
            var the_marker = new google.maps.Marker({
                title: 'Network: '+$(this).attr('network_name')+' ('+network_id+') Co-ordinates: ('+$(this).attr('lat')+','+$(this).attr('lng')+')',
                map: map,
                clickable: true,
                position: new google.maps.LatLng(
                   $(this).attr('lat'),
                   $(this).attr('lng')
                ),
                icon: iconArray[network_id]
                //shadow: icon.shadow
            });
             
            //the_marker.infowindow = new google.maps.InfoWindow({
            //  content: $(this).attr('network_name')+' '+network_id
            //});
            
            markersArray.unshift(the_marker);
             
            //new google.maps.event.addListener(the_marker, 'click', function() {
            //  for(x=0; x < markersArray.length; x++){ markersArray[x].infowindow.close(); }
            //  the_marker.infowindow.open(map, the_marker);
                //var bren = the_marker.getTitle();
                //$('#brenInfo').append('Marker Info:'+bren+' ');
                
            //});
        });
        
        //Track AJAX Request
        var ajaxLink = "";
        if (isHeatMap==1) { ajaxLink = "HeatMaps/"; } else { ajaxLink = "CellTowers/"; }
        if( filtersArr["netwkID"].length >= 1) {
            for(i in filtersArr["netwkID"]) {
                ajaxLink=ajaxLink + filtersArr["netwkID"][i]+'/';
            }
        } else if( filtersArr["netwkType"].length >= 1) {
            for(i in filtersArr["netwkType"]) {
                ajaxLink=ajaxLink + filtersArr["netwkType"][i]+'/';
            }
        } else { ajaxLink = ajaxLink + "NoFilters/"; }
        
        //$('#generatelinkTarget').append('B'+ajaxLink);
        //console.log(ajaxLink);
        if (firstPageLoad!=1) {
            //Google Analytics AJAX Interaction tracking:
            _gaq.push(['_trackPageview', '/app/getdata/'+ajaxLink]);
            //Chartbeat AJAX Interaction tracking:
            // TEMPORARILY DISABLING
            //pSUPERFLY.virtualPage('/app/getdata/'+ajaxLink);
        } else {
            //do nothing
            firstPageLoad=0;
        }

        //alert(markersArray.length);
        limitMarkers(markerLimit);
        //alert(markersArray.length);
        
        //var markerCount=0;
        //if (markersArray) {
        //  for (i in markersArray) {
        //      if (markersArray[i].getMap().getZoom()==map.getZoom()) {markerCount++;}
        //  }
        //  $('#brenInfo').prepend('count: '+markerCount);
        //}
   });
}

var heatmap = new google.maps.ImageMapType({
    getTileUrl: function(coord, zoom) {
        
        var fltrAppndLink="";
        if( filtersArr["netwkType"].length >= 1) { 
            for(i in filtersArr["netwkType"]) {
                fltrAppndLink=fltrAppndLink+'&netwkType%5B%5D='+filtersArr["netwkType"][i];
            }
        }
        if (filtersArr["netwkID"].length==0) {
            fltrAppndLink=fltrAppndLink+'&netwkID=all'; //Only 1 accepted.
        } else {
            fltrAppndLink=fltrAppndLink+'&netwkID='+filtersArr["netwkID"][0]; //Only 1 accepted.
        }
        //console.log(fltrAppndLink);
        //alert(coord+' '+zoom);
        if (zoom < 3) {
            //postNotification("Just got TechCrunch'd and our server's struggling, please come back later to zoom :)");
            postNotification("Heatmaps can't be shown at this zoom.  Please zoom in.");
            //postNotification("Currently experiencing a lot of load from BBC article, please come back later to zoom :)");
            return "https://s3.amazonaws.com/opensignalmaps/tiles/zoom-in.png";
        } else if (zoom > 13) {
        
            //postNotification("Currently experiencing a lot of load from BBC article, please come back later to zoom :)");
            postNotification("Heatmaps can't be shown at this zoom.  Please zoom out.");
            return "https://s3.amazonaws.com/opensignalmaps/tiles/zoom-out.png";
        } else {
            $('#mapNotification').hide();
            return "http://opensignalmaps.com/app/getimage.php?"+"zoom="+zoom+"&x="+coord.x+"&y="+coord.y+fltrAppndLink+"&client=auth1ZA294CK772Q4clnt294ri6Qa9";
        }
    },
       tileSize: new google.maps.Size(256, 256),
       opacity:0.43,
       isPng: true
});

function generateLink() {
    var mapLat = Math.round(map.getCenter().lat()*10000)/10000;
    var mapLng = Math.round(map.getCenter().lng()*10000)/10000;
    var zoom = map.getZoom();
    var link = 'http://opensignalmaps.com/index.php?lat='+mapLat+'&lng='+mapLng+'&initZoom='+zoom+'&isHeatMap='+isHeatMap;
    for(i in filtersArr["netwkID"]) {
        link=link+'&netwkID%5B%5D='+filtersArr["netwkID"][i];
    }
    for(i in filtersArr["netwkType"]) {
        link=link+'&netwkType%5B%5D='+filtersArr["netwkType"][i];
    }
    $('#generatelinkTarget').html('Link: <a href="'+link+'">'+link+'</a>');
};

$(document).ready(function() { 
    
    $(function(){
    
        mapInit();
        
        // "live" bind click event
        //$("#markers a").live("click", function(){
        //  var i = $(this).attr("rel");
            // this next line closes all open infowindows before opening the selected one
        //  for(x=0; x < arrInfoWindows.length; x++){ arrInfoWindows[x].close(); }
        //  arrInfoWindows[i].open(map, arrMarkers[i]);
        //});
    });
});
