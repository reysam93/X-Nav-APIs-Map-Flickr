$(document).ready(function(){

	$("#search button").click(addrSearch);

	map = L.map("map");
	L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
	attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">'
    }).addTo(map);

	function onLocationFound(e){
		var radius = e.accuracy / 2;
		L.marker(e.latlng).addTo(map)
	            .bindPopup("You are within " + radius +
			       " meters from this point<br/>" +
			       "Coordinates: " + e.latlng.toString())
		    .openPopup();
		L.circle(e.latlng, radius).addTo(map);
	}
	map.on("locationfound", onLocationFound);

	function onLocationError(e) {
		alert(e.message);
    }

    map.on('locationerror', onLocationError);
    map.locate({setView: true, maxZoom: 16});
});

function addrSearch(){
	var inp = $("#addr");
	var nominatim = "http://nominatim.openstreetmap.org/search?format=json&limit=5&q=" + inp.val();
	inp.val("");
	$.getJSON(nominatim, function(data) {
		var items = [];
		coords =[];

		$.each(data, function(key, val){
			coords.push({
				"lat": val.lat,
				"lon": val.lon,
				"type": val.type
			});
			items.push(
				"<li id=\"" + key + "\">" + val.display_name + "</li>"
			);
		});
		$("#results").empty();
		if (items.length != 0) {
			$('<p>', { html: "Search results:" }).appendTo('#results');
		    $('<ul/>', {
			'class': 'my-new-list',
			html: items.join('')
		    }).appendTo('#results');
		}else{
			$('<p>', { html: "No results found" }).appendTo('#results');
		}
		$('<p>', { html: "<button id='close' type='button'>Close</button>" }).appendTo('#results');
		$('#results').on('click', 'li', chooseAddr);
		$("#close").click(removeResults);
	});
}

function removeResults() {
    $("#results").empty();
    $("#imgs").empty();
}

function chooseAddr() {
    var coord = coords[$(this).index()];
		   
    getImages($(this).html())
    var location = new L.LatLng(coord.lat, coord.lon);
    map.panTo(location);

    if (coord.type == 'city' || coord.type == 'administrative') {
		map.setZoom(10);
    } else {
		map.setZoom(14);
    }
}

function getImages(name){
	$("#imgs").empty();
	var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?"
	$.getJSON(flickerAPI, {
		tags: name,
		tagmode: "any",
		format: "json"
	}).done(function(resp){
		var html = "<ul>"
		for (var i = 0; i < 5; i++){
			html += "<li><h4>" + resp.items[i].title + "</h4>"
			html += "<img src='" + resp.items[i].media.m + "'></li>"
		}
		html += "</ul>";
		$("#imgs").append(html);
	});
}