$(document).ready(function(){
	$("#getPics").click(function(){
		var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?"
		$.getJSON(flickerAPI, {
			tags: "fuenlabrada",
			tagmode: "any",
			format: "json",
		}).done(getImgs)
	});

	$("#chooseTag").click(function(){
		var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?"
		var tag = $("#tag").val()
		$.getJSON(flickerAPI, {
			tags: tag,
			tagmode: "any",
			format: "json",
		}).done(getImgs)
	});
});

function getImgs(resp){
	$("#content").html("");
	var html = "<ul>"
	for (var i = 0; i < 10; i++){
		html += "<li><h4>" + resp.items[i].title + "</h4>"
		html += "<img src='" + resp.items[i].media.m + "'></li>"
	}
	html += "</ul>"
	$("#content").append(html)
}