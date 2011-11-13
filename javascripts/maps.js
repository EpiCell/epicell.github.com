$(document).ready(function() {
	//Basic
	var mapid = 'malaria-map';
	
	var cartodbMapOptions = {
		zoom: 5,
		center: new google.maps.LatLng( 22, 75 ),
		disableDefaultUI: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	// Init the map
	var carto_map = new google.maps.Map(document.getElementById(mapid), cartodbMapOptions);

    google.maps.event.addListener(carto_map, 'bounds_changed', function() {
                 var center= carto_map.getCenter();
                 // console.log("cent is ");
                 //                 console.log(center.lat()+" "+center.lng())
                 var query = "SELECT mpc.country_or_area as country , mpc.value as value, mpc.year as year, gdp.value as gdp, countries.pop_est as population FROM mobile_per_country as mpc , undata_2006_healthcare_spent_percent_of_gdp as gdp, countries WHERE  countries.name = mpc.country_or_area and gdp.country_or_area= mpc.country_or_area and mpc.country_or_area = (SELECT name FROM countries WHERE ST_Intersects(the_geom,GeometryFromText('Point("+center.lng()+" "+center.lat()+")',4326)))"
                 // console.log(query);
                 $.getJSON("http://sciencehackday-10.cartodb.com/api/v1/sql?q="+query+"&callback=?", function(data){
                         setUpCountryInfo(data);
                 });
             });

	var map_style = [ { stylers: [ { saturation: -65 }, { gamma: 1.52 } ] }, { featureType: "administrative", stylers: [ { saturation: -95 },{ gamma: 2.26 } ] },
	{ featureType: "water", elementType: "labels", stylers: [ { visibility: "off" } ] },{ featureType: "administrative.locality", stylers: [ { visibility: 'off' } ] },
	{ featureType: "road", stylers: [ { visibility: "simplified" }, { saturation: -99 }, { gamma: 2.22 } ] }, { featureType: "poi", elementType: "labels", stylers: [ { visibility: "off" } ] },
	{ featureType: "road.arterial", stylers: [ { visibility: 'off' } ] }, { featureType: "road.local", elementType: "labels", stylers: [ { visibility: 'off' } ] },
	{ featureType: "transit", stylers: [ { visibility: 'off' } ] }, { featureType: "road", elementType: "labels", stylers: [ { visibility: 'off' } ] },
	{ featureType: "poi", stylers: [ { saturation: -55 } ] } ];

	carto_map.setOptions({styles: map_style});

	// Add the cartodb tiles
	var cartodb_layer = {
		getTileUrl: function(coord, zoom) {
			return "https://sciencehackday-10.cartodb.com/tiles/india_towers_signals/" + zoom + "/" + coord.x + "/" + coord.y + ".png" +
			"?sql=SELECT cartodb_id, ST_Buffer(the_geom_webmercator,35000) as the_geom_webmercator FROM india_towers_signals";
		},
		tileSize: new google.maps.Size(256, 256)
	};
	
	
	// Add the cartodb tiles
	var cell_layer = {
		getTileUrl: function(coord, zoom) {
			return "http://opensignalmaps.com/app/getimage.php?"+"zoom="+zoom+"&x="+coord.x+"&y="+coord.y+"&netwkID=all&client=auth1ZA294CK772Q4clnt294ri6Qa9";
		},
		tileSize: new google.maps.Size(256, 256),
		opacity: 0.15
	};
 
	// Add the cartodb tiles
	var dengue = {
		getTileUrl: function(coord, zoom) {
			return "https://sciencehackday-10.cartodb.com/tiles/dengue_3_months/" + zoom + "/" + coord.x + "/" + coord.y + ".png" +
			"";
		},
		tileSize: new google.maps.Size(256, 256)
	};
	
 
	var cell_imagemaptype = new google.maps.ImageMapType(cell_layer);


    //carto_map.addOverlay(cell_imagemaptype);
	carto_map.overlayMapTypes.insertAt(0, cell_imagemaptype);
	
	
	var cartodb_imagemaptype = new google.maps.ImageMapType(cartodb_layer);

	carto_map.overlayMapTypes.insertAt(1, cartodb_imagemaptype);
	

	var dengue_imagemaptype = new google.maps.ImageMapType(dengue);

	carto_map.overlayMapTypes.insertAt(1, dengue_imagemaptype);


	/*
	 var table2 = 'india_towers_signals';
     var cartodb_towers = new google.maps.CartoDBLayer({
       map_canvas: mapid,
       map: carto_map,
       user_name:'sciencehackday-10',
       table_name: table2,
       query: "SELECT cartodb_id, ST_Buffer(the_geom_webmercator,35000) as the_geom_webmercator FROM "+ table2,
       map_style: false,
       infowindow: false,
       auto_bound: false,
     });
     
	 var table = 'dengue_3_months';
     var cartodb_dengue = new google.maps.CartoDBLayer({
       map_canvas: mapid,
       map: carto_map,
       user_name:'sciencehackday-10',
       table_name: table,
       query: "SELECT * FROM dengue_3_months",
       map_style: false,
       infowindow: false,
       auto_bound: false,
     });
     */
     
     
     
     
});

function plotGraph(data){
   
   $.plot($("#phone_take_up_plot"),[data], {
       xaxis:{
           color: 'white',
           label:"year"
       },
       yaxis:{
           color:'white',
           label: "% of population with phones"
       }
   }); 
  }
  
function setUpCountryInfo(data){
    var plot_data=[];
    console.log(data);
    var country_name =data.rows[0].country;
    $("#country").html(country_name);
    $("#phone_count").html((data.rows[0].value*1).toFixed(2)+"%");
    $("#gdp").html((data.rows[0].gdp)+"%");
    $("#population").html((data.rows[0].population)+" people");
    
    $.each(data.rows ,function(index, record){
        console.log(typeof record.year)
        if(record.value != 0){
            plot_data.push([record.year,record.value]);
        }
    });
    plotGraph(plot_data);
    

}
