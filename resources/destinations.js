/*	Test Directions
	Purpose: play around with the google directions API and google maps api
*/
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

function alert_me(){
	console.log("blah!");
}
//I took most of this example from google. See:
//https://developers.google.com/maps/documentation/javascript/directions
//for more complete reference
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var destsinationdivs = new Array();
var destinationsArray = new Array();

function destinationsInits(){
	initialize();
	calcRoute();
}

function initialize() {
	console.log("initing...");
	directionsDisplay = new google.maps.DirectionsRenderer();
	var chicago = new google.maps.LatLng(41.850033, -87.6500523);
	var mapOptions = {
		zoom:7,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		center: chicago
	}
	map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
	directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('panel'));
	var d = document.getElementById("map_canvas");
	var newdiv = document.createElement('div');

	  newdiv.innerHTML = 'loveTRAIIIIN';

	  d.appendChild(newdiv);
}

function calcRoute() {
	
	//this is having some trouble (some same origin stuff...I bet it will work when)
	//it's hosted on a web server. It's the right general idea, though
	//check out the documentation of jquery get. it's pretty nice
	/*var direction_req = "http://localhost:5000/get_directions?trip_name=another_trip_id_string"
	$.get(direction_req, function(data, status){
		if(status == 400){
			request = data;
		}
	});
	*/
	var trip = null;
	var trip_request = $.getJSON( "https://straight-trippin.herokuapp.com/get_trip?name=Broadtrip", function() {
	  console.log( "retreival success" );
	})
	.done(function(data) { 
		//console.log( data ); 
		trip = data;//[0];
		console.log( trip);
		if(trip != null){
			//Update Google Map
			var dests = trip["destinations"];
			var origin = dests[0]["destination"];
			var destination = dests[dests.length - 1]["destination"];
			var waypoints = new Array();
			var request = {origin: undefined, 
		                   waypoints: undefined,
		                   destination: undefined,
		                   travelMode: undefined
		                   };
			request["origin"] = origin;
			for(var i = 0; i < dests.length; i ++){
				waypoints[i] = {location: undefined, 
				                stopover: undefined};
				waypoints[i]["location"]= dests[i]["destination"];
				waypoints[i]["stopover"]= true;
			}
			waypoints = waypoints.splice(1, waypoints.length -1);
			request["waypoints"] = waypoints;
			request["destination"] = destination;
			request["travelMode"] = google.maps.DirectionsTravelMode.DRIVING;
			console.log (request);
			directionsService.route(request, function(result, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(result);
				}
			});

			//Update Divs
			var divs = document.getElementById("dests");
			var add = document.getElementById("addtop")
			//For each destination, add a div
			for (var i = 0; i < dests.length; i ++){
				 //var topdiv = document.createElement("div");
				 var topdiv = document.createElement("div");
				 var id = "dest" + i;
				 topdiv.setAttribute("class", "dropdown");
				 topdiv.innerHTML = "<a onclick='toggle(\""+ id + "\");' >" + dests[i]["destination"] + "</a>";
				 //console.log(topdiv);
				 var dropdiv = document.createElement('div');
				 dropdiv.setAttribute("id", id);
				 dropdiv.setAttribute("style", "display: none");

				 var droplist = document.createElement('ul');
				 var fieldName;
				 for (fieldName in dests[i]){
				 	if(dests[i][fieldName] != '' && dests[i][fieldName] != null){
					 	var item = document.createElement('li');
					 	item.innerHTML = fieldName + " : " + dests[i][fieldName];
					 	droplist.appendChild(item);
					}
				 }
				 dropdiv.appendChild(droplist);

				 var deleteButton = document.createElement('input');
				 deleteButton.setAttribute("id", "delete"+i);
				 deleteButton.setAttribute("type", "submit");
				 deleteButton.setAttribute("value", "Delete");
				 deleteButton.setAttribute("onclick", "deleteDest(" + i + ")");
				 droplist.appendChild(deleteButton);

				 divs.insertBefore(topdiv, add);
				 divs.insertBefore(dropdiv, add);
				 destsinationdivs.push(topdiv);
				 destsinationdivs.push(dropdiv);
				 destinationsArray.push(dests[i]["destination"]);
			}
			

		}else{
			console.log("FAILURE");
		}
	})
	.fail(function() { console.log( "error" ); })
	.always(function() { console.log( "complete" ); });
	
}

function deleteDest(num){
	/*var ele = document.getElementById("divs");
	ele.removeChild(destsinationdivs[num]);
	destsinationdivs.remove(num);*/
	console.log("DELETE");
    console.log( destinationsArray[num].toString());
    $.post("http://straight-trippin.herokuapp.com/delete_destination", {"name":"Broadtrip"}, 
               {'destination':  destinationsArray[num].toString() })
	.done(function(data) { 
		console.log("sucessful delete");
	})
	.fail(function() { console.log( "error" ); })
	.always(function() { console.log( "tried to delete" ); });
	/*$.post("http://straight-trippin.herokuapp.com/delete_destination", {"name":"Broadtrip"}, 
               {'destination':  destinationsArray[num] })
		.done(function() {
			console.log("sucessful delete");
			calcRoute();
		 })
		.fail(function() { console.log( "error" ); })
		.always(function() { console.log( "delete data attempted" ); });*/
}

function addDest(){
	console.log("adding dest " + document.getElementById("dest-form").value);
	var add = {destination: document.getElementById("dest-form").value,
			   arrival: document.getElementById("arrival-form").value,
			   departure: document.getElementById("departure-form").value,
			   hotel: document.getElementById("hotel-form").value};
	add["destination"] = document.getElementById("dest-form").value;
	add["arrival"] = document.getElementById("arrival-form").value;
	add["departure"] = document.getElementById("departure-form").value;
	add["hotel"] = document.getElementById("hotel-form").value;

	
	if(add["destination"] != '' && add["destination"] != null){
		console.log("okay to send");
		var send = {"name":"Broadtrip", "destination": add};
		console.log(send);
		$.post("http://straight-trippin.herokuapp.com/add_destination", {"name":"Broadtrip", 
               "destination": JSON.stringify(add)})
		.done(function() {
			//Clean up add form
			document.getElementById("dest-form").value = '';
			document.getElementById("arrival-form").value = '';
			document.getElementById("departure-form").value = '';
			document.getElementById("hotel-form").value = '';
			toggle('add');

			//Refresh dests map
			var divs = document.getElementById("dests"); 
			for(var i = 0; i < destsinationdivs.length; i ++){
				divs.removeChild(destsinationdivs[i]);
			}
			destsinationdivs = new Array();
			destinationsArray = new Array();
			calcRoute();
		 })
		.fail(function() { console.log( "error" ); })
		.always(function() { console.log( "send data successfully" ); });


		
	}

}

$(document).ready(function(){
	$('#dest_form').submit(function(event){
		event.preventDefault();
		var $form = $(this),
		term = $form.find('#dest').val();
		console.log(term);
	});
destinationsInits();
});