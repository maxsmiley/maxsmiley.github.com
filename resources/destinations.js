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
		directionsDisplay = new google.maps.DirectionsRenderer();
		var chicago = new google.maps.LatLng(41.850033, -87.6500523);
		var mapOptions = {
			zoom:7,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			center: chicago
		}
		map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
		directionsDisplay.setMap(map);
	}
	function calcRoute() {
		var request;
		
		//this is having some trouble (some same origin stuff...I bet it will work when)
		//it's hosted on a web server. It's the right general idea, though
		//check out the documentation of jquery get. it's pretty nice
		var direction_req = "http://localhost:5000/get_directions?trip_name=another_trip_id_string"
		$.get(direction_req, function(data, status){
			if(status == 400){
				request = data;
			}
		});
		directionsService.route(request, function(result, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(result);
			}
		});
	}

	//call the methods here
	initialize();
	calcRoute();
});