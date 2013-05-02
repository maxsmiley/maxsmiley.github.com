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
        directionsDisplay.setPanel(document.getElementById('map_canvas'));
		var d = document.getElementById("map_canvas")
		var newdiv = document.createElement('div');

		  newdiv.innerHTML = 'loveTRAIIIIN';

		  d.appendChild(newdiv);
	}
	function calcRoute() {
		var request;
		
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
		alert("lel");
		var trip = $.get("https://straight-trippin.herokuapp.com/get_trip?name=Roadtrip");
		alert("lel");
		var dests = trip["destinations"];
		var origin = dests.first();
		var destination = dests.last();
		dests = dest.splice(1, dest.length -1);
		var waypoints;
		var request;
		request["origin"] = origin;
		for(int i = 0; i < dest.length; i ++){
			waypoints[i]["location"]= dests[i];
			waypoints[i]["stopover"]= true;
		}
		request["waypoints"] = waypoints;
		request["destination"] = destination;
		request["tevelMode"] = google.maps.DirectionsTravelMode.DRIVING;
		request = JSON.stringify(request);
		alert("lel");
		alert(""+request);
		/*request = 
		{
       	origin: origin
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
		directionsService.route(request, function(result, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(result);
			}else{
			}
		});

	}

	//call the methods here
	initialize();
	calcRoute();
});