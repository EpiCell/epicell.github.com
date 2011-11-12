$(document).ready(function() {
	//Basic
	var cartodbMapOptions = {
		zoom: 5,
		center: new google.maps.LatLng( 22.7248057566452, -106.9967118782795 ),
		disableDefaultUI: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	// Init the map
	var carto_map = new google.maps.Map(document.getElementById("malaria-map"), cartodbMapOptions);

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
			return "https://sciencehackday-10.cartodb.com/tiles/tower_locations/" + zoom + "/" + coord.x + "/" + coord.y + ".png" +
			"";
		},
		tileSize: new google.maps.Size(256, 256)
	};

	var cartodb_imagemaptype = new google.maps.ImageMapType(cartodb_layer);

	carto_map.overlayMapTypes.insertAt(0, cartodb_imagemaptype);
});
