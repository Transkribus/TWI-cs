console.log("IN CROWD.JS");
console.log(window.location.pathname);
//We strip off the ids and should have a useful app base that will work for any server context
var appbase = window.location.pathname.replace(/\/\d+(|\/)/g, "");
//var serverbase = window.location.pathname.replace(/\/\w+\/\d+(|\/)/g, ""); //nb expects slash
//our urls will be like this:
// domain.com/serverbase/appname/id/id/id/id/action
// remove from the back nothing after word that *should* == appname and anything after it (to get server base)
var serverbase = window.location.pathname.replace(/\/\w+(|\/|\/\d.*)$/g, ""); 

console.log("APPBASE: ",appbase);
console.log("SERVERBASE: ",serverbase);

$(document).ready(function(){

	init_thumbs();
});

function init_thumbs(){

	$("#collections > div").each(function(){
		var div = this;
		colId = $(this).data("colid");
		thumb_url = make_url("/utils/thumb/"+colId);
		$.getJSON(thumb_url, function(thumb_data){
			$("a", div).prepend('<img src="'+thumb_data.url+'"/>');
		}).done(function(a,b) {
		    console.log( "Done: ",a, " ",b );
		}).fail(function( a, b){
		    console.log( "Fail: ",a, " ",b );
		    $("a", div).prepend('<img src="/static/images/wolpertinger.jpg"/>');

		});
		//a little nonsense until we have the  total lines figure... then use that rather than the number of words
		max = $("#gauge_"+colId).data("words");
		lines =  $("#gauge_"+colId).data("lines");
		var prop = 0;
		if(lines > 0)
			prop = Math.round((lines/max)*100);
		//just in case...
		if(lines > max) max = lines;
		$("#gauge_"+colId).gauge(prop ,{
			type : "halfcircle",
			bgcolor: '#fef',
			color: 'green'
		});
	});
	$("#documents > div").each(function(){
		var div = this;
		colId = $(this).data("colid");
		docId = $(this).data("docid");
		console.log("COLID: ",colId);
		thumb_url = make_url("/utils/thumb/"+colId+"/"+docId);
		$.getJSON(thumb_url, function(thumb_data){
			$("a", div).prepend('<img src="'+thumb_data.url+'"/>');
		}).done(function(a,b) {
		    console.log( "Done: ",a, " ",b );
		}).fail(function( a, b){
		    console.log( "Fail: ",a, " ",b );
		});
		//a little nonsense until we have the  total lines figure... then use that rather than the number of words
		max = $("#gauge_"+docId).data("words");
		lines =  $("#gauge_"+docId).data("lines");
		var prop = 0;
		if(lines > 0)
			prop = Math.round((lines/max)*100);
		//just in case...
		if(lines > max) max = lines;
		$("#gauge_"+docId).gauge(prop ,{
			type : "halfcircle",
			bgcolor: '#fef',
			color: 'green'
		});

	});

}
