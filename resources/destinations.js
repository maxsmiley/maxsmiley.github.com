/*	Test Directions
	Purpose: play around with the google directions API and google maps api
*/

function alert_me(){
	console.log("blah!");
}

$(document).ready(function(){
	$('#dest_form').submit(function(event){
		event.preventDefault();
		var $form = $(this),
		term = $form.find('#dest').val();
		console.log(term);
	});
	
	//I took most of this example from google. See:
	//https://developers.google.com/maps/documentation/javascript/directions
	//for more complete reference
	var directionsDisplay;
	var directionsService = new google.maps.DirectionsService();
	var map;

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
		var d = document.getElementById("map_canvas")
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
		var trip_request = $.getJSON( "https://straight-trippin.herokuapp.com/get_trip?name=Roadtrip", function() {
		  console.log( "retreival success" );
		})
		.done(function(data) { 
			//console.log( data ); 
			trip = data;//[0];
			console.log( trip);
			if(trip != null){
				var dests = trip["destinations"];
				var origin = dests[0];
				var destination = dests[trip.length -1];
				dests = dests.splice(1, dests.length -1);
				var waypoints = trip["waypoints"];
				var request = {origin: undefined, 
			                   waypoints: undefined,
			                   destination: undefined,
			                   travelMode: undefined
			                   };
				request["origin"] = origin;
				for(var i = 0; i < dests.length; i ++){
					waypoints[i]["location"]= dests[i];
					waypoints[i]["stopover"]= true;
				}
				request["waypoints"] = waypoints;
				request["destination"] = destination;
				request["travelMode"] = google.maps.DirectionsTravelMode.DRIVING;
				directionsService.route(request, function(result, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					directionsDisplay.setDirections(result);
					}
				});
			}else{
				console.log("FAILURE");
			}
		})
		.fail(function() { console.log( "error" ); })
		.always(function() { console.log( "complete" ); });
		

		
		/*var trip;
		console.log("requesting..");
		var direction_req = "https://straight-trippin.herokuapp.com/get_trip?name=Roadtrip";
		$.get(direction_req, function(data, status){
			if(status == 200 || status == ){
				trip = data;
				console.log(trip);
				var dests = trip["destinations"];
				var origin = dests.first();
				var destination = dests.last();
				dests = dest.splice(1, dest.length -1);
				var waypoints;
				var request;
				request["origin"] = origin;
				for(var i = 0; i < dest.length; i ++){
					waypoints[i]["location"]= dests[i];
					waypoints[i]["stopover"]= true;
				}
				request["waypoints"] = waypoints;
				request["destination"] = destination;
				request["tevelMode"] = google.maps.DirectionsTravelMode.DRIVING;
					directionsService.route(request, function(result, status) {
					if (status == google.maps.DirectionsStatus.OK) {
						directionsDisplay.setDirections(result);
					}
				});
			}
		});*/

		/*console.log("done.");
		var request = 
		{
	       	origin: "Chicago, IL",
	        waypoints: [
			    {
			      location:"Joplin, MO",
			      stopover:true
			    },{
			      location:"Oklahoma City, OK",
			      stopover:true
			    }],
	       destination: 'New York',
	       travelMode: google.maps.DirectionsTravelMode.DRIVING
     	};*/
   
		/*{
		  origin: "Chicago, IL",
		  destination: "Los Angeles, CA",
		  waypoints: [
		    {
		      location:"Joplin, MO",
		      stopover:false
		    },{
		      location:"Oklahoma City, OK",
		      stopover:true
		    }],
		  provideRouteAlternatives: false,
		  travelMode: TravelMode.DRIVING,
		  unitSystem: UnitSystem.IMPERIAL
		};*/
		
	}
		
		

	//call the methods here
	initialize();
	calcRoute();
});