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
	init_collections_table();
	init_documents_table();
	init_subscription();
});

function init_collections_table(){

	if(!$("#collections_table").length) return;

	var url = make_url("/utils/table_ajax_public/crowdsourcing");

	var columns =  [
		    { "data" : null,
		      "defaultContent": '<span class="glyphicon glyphicon-refresh glyphicon-spin"></span>', 
		      "searchable": false, 
		      "orderable": false},
		    { "data": "colName" },
		    { "data": "nrOfDocuments" },
        	];
	console.log("Let's go");
	var datatable = init_datatable($("#collections_table"),url,columns);
	console.log("apres datatable");

	$("#collections_table").on( 'draw.dt', function () {
		console.log("datatable been drewed");

	    var api = new $.fn.DataTable.Api( "#collections_table" );
		row_data = [];
		//rowIdx is the index of this row before the sort/search, rowLoop contains the (current) idx of the row after the sort
		api.rows({page:'current'}).every( function ( rowIdx, tableLoop, rowLoop ) {

			var d = this.data();
		    this.invalidate('dom');
		    var currRow = this;

			$("#collections_table tbody tr").each(function(rowInd){
		    	if (rowLoop == rowInd){
			/*		 
					row_data[rowInd] = {} ;
					row_data[rowInd].collId = currRow.data().colId;
					row_data[rowInd].url = make_url("/utils/thumb/"+row_data[rowInd].collId);
					row_data[rowInd].collStat = make_url("/library/coll_statistics/"+row_data[rowInd].collId);

					row_data[rowInd].img_cell = this;
					$.getJSON(row_data[rowInd].url, function(thumb_data){
						if (thumb_data.url){
							thumb = loadThumbs(thumb_data.url);
							$("td:eq(0)", row_data[rowInd].img_cell).empty();
							$("td:eq(0)", row_data[rowInd].img_cell).append(thumb);
							$("td:eq(0)", row_data[rowInd].img_cell).addClass('text-center');
						}else{
							$("td:eq(0)", row_data[rowInd].img_cell).html('No image available');
						}
					}).done(function(a,b) {
					    console.log( "Done: ",a, " ",b );
					}).fail(function( a, b){
					    console.log( "Fail: ",a, " ",b );
					});

					row_data[rowInd].collStat = make_url("/library/coll_statistics/"+row_data[rowInd].collId);
					$.getJSON(row_data[rowInd].collStat, function(stat_data){
						$("td:eq(2)", row_data[rowInd].img_cell).html(stat_data.titleDesc);
						shorten_text("long_text_" + row_data[rowInd].collId);
					}).done(function(a,b) {
					    console.log( "Done: ",a, " ",b );
					}).fail(function( a, b){
					    console.log( "Fail: ",a, " ",b );
					});
			*/
		    	}
			});
		});
	});

}

function init_documents_table(){

	if(!$("#documents_table").length) return;

//	var url = "./table_ajax/documents/"+window.location.pathname.replace(/^.*\/(\d+)$/, '$1');
	var url = make_url("/utils/table_ajax/documents/"+window.location.pathname.replace(/^.*\/(\d+)$/, '$1'));

	var ids = parse_path();	

	var columns =  [
		    //This column will be for our image which we will not get from the table_ajax/document view
		    { "data": "docId",
		      "defaultContent": '<span class="glyphicon glyphicon-refresh glyphicon-spin"></span>'},
		    { "data" : null, 
		      "searchable": false, 
		      "orderable": false},
		    { "data": null, 
		      "defaultContent": '<span class="glyphicon glyphicon-refresh glyphicon-spin"></span>',
		      "searchable": false, 
		      "orderable": false},
		    { "data": null,
		      "searchable": false },
		    { "data" : "nrOfPages", 
		      "searchable": false, 
		      "orderable": false}
		    
		    //{ "data": "new_key" },//if we want to add a new column in this table
        	];

	var datatable = init_datatable($("#documents_table"),url,columns);
			
	//redraw handled here: may an easier solution to get current docID after a sort/search exist but this one works fine for the moment
	$("#documents_table ").on( 'draw.dt', function () {
		
	    var api = new $.fn.DataTable.Api( "#documents_table" );
		row_data = [];
		//rowIdx is the index of this row before the sort/search, rowLoop contains the (current) idx of the row after the sort
		api.rows({page:'current'}).every( function ( rowIdx, tableLoop, rowLoop ) {

			var d = this.data();
		    this.invalidate('dom');
		    var currRow = this;
		    
/*		    console.log( "rowIdx: ", rowIdx);
		    console.log( "rowLoop: ", rowLoop);
		    console.log( "currRow: ", currRow.data().docId);*/
		    
		    //this way we can only go throug the indizes of the first page before the change during sort/search
		    $("#documents_table tbody tr").each(function(rowInd){
		    	
		    	//console.log( "rowInd: ", rowInd);
		    	if (rowLoop == rowInd){
		    				 
					row_data[rowInd] = {} ;
					row_data[rowInd].docId = currRow.data().docId;
					row_data[rowInd].url = make_url("/utils/thumb/"+ids['collId']+'/'+row_data[rowInd].docId);
					row_data[rowInd].img_cell = this;
					$.getJSON(row_data[rowInd].url, function(thumb_data){
						thumb = loadThumbs(thumb_data.url);
						$("td:eq(0)", row_data[rowInd].img_cell).empty();
						$("td:eq(0)", row_data[rowInd].img_cell).append(thumb);
						$("td:eq(0)", row_data[rowInd].img_cell).addClass('text-center');
					}).done(function(a,b) {
					    console.log( "Done: ",a, " ",b );
					}).fail(function( a, b){
					    console.log( "Fail: ",a, " ",b );
					});

					row_data[rowInd].stats = make_url("/library/statistics/"+ids['collId']+'/'+row_data[rowInd].docId);
					$.getJSON(row_data[rowInd].stats, function(stat_data){
						$("td:eq(2)", row_data[rowInd].img_cell).html(stat_data.titleDesc);
						$("td:eq(3)", row_data[rowInd].img_cell).html(stat_data.statString);
						$("td:eq(1)", row_data[rowInd].img_cell).html(stat_data.viewLinks);

						shorten_text("long_text_" + row_data[rowInd].docId);
					}).done(function(a,b) {
					    console.log( "Done: ",a, " ",b );
					}).fail(function( a, b){
					    console.log( "Fail: ",a, " ",b );
					});
			    }
		    });
		});
	});
}


function init_subscription(){

	$("#subscribe").on("click", function(){
		var colId = $(this).data("colid");
		var subs_url = make_url("/subscribe/"+colId);
		var link=this;
		console.log("SUBS_URL:",subs_url);
		$.getJSON(subs_url, function(response){
			$("#unsubscribe").removeClass("hide").show();
			$(link).hide();
		}).done(function(a,b) {
		    console.log( "Done: ",a, " ",b );
		}).fail(function( a, b){
		    console.log( "Fail: ",a, " ",b );
		});
		return false;
	});

	$("#unsubscribe").on("click", function(){
		var colId = $(this).data("colid");
		var unsubs_url = make_url("/unsubscribe/"+colId);
		var link=this;
		console.log("UNSUBS_URL:",unsubs_url);
		$.getJSON(unsubs_url, function(response){
			$("#subscribe").removeClass("hide").show();
			$(link).hide();
		}).done(function(a,b) {
		    console.log( "Done: ",a, " ",b );
		}).fail(function( a, b){
		    console.log( "Fail: ",a, " ",b );
		});
		return false;
	});

}

function init_thumbs(){

	$("#collections > div").each(function(){
		var div = this;
		colId = $(this).data("colid");
		//thumb_url = make_url("/utils/thumb/"+colId);
		thumb_url = appbase+"/utils/thumb/"+colId;

		$.getJSON(thumb_url, function(thumb_data){
			$("a", div).prepend('<img src="'+thumb_data.url+'"/>');
		}).done(function(a,b) {
		    console.log( "Done: ",a, " ",b );
		}).fail(function( a, b){
		    console.log( "Fail: ",a, " ",b );
		var wolpertinger_url = appbase+"/static/images/wolpertinger.jpg";
		    $("a", div).prepend('<img src="'+wolpertinger_url+'"/>');

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
//		thumb_url = make_url("/utils/thumb/"+colId+"/"+docId);
		thumb_url = appbase+"/utils/thumb/"+colId+"/"+docId;

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
