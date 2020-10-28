window.onload = function() {
    // var getLocation = window.navigator.geolocation.getCurrentPosition(changeView(position), (error) =>{console.log(error)})
    var map;
    var dir;
    var currentLocation;
    var mouseClickLocation;
    var marker, currentLocationMarker, isMarked;
    map = L.map('map', { // initialize map, with Dubai set displayed on map if no user location available
      layers: MQ.mapLayer(),
      center: [ 25.196099, 55.281245], // [longtitude, latitude] of Dubai
      zoom: 12,
    });

    dir = MQ.routing.directions();
    var routeLayer = MQ.routing.routeLayer({
        directions: dir,
        fitBounds: true
    })
    map.addLayer(routeLayer);
   
    map.locate({setView: true, watch: true}).on('locationfound', function(e) {
        currentLocation = [e.latitude, e.longitude];
        // currentLocationMarker = 
        // dir.route({ // add beginning and end markers on the map
        //     locations: [
        //         currentLocation[0] + ',' + currentLocation[1],
        //         (currentLocation[0]) + 0.00005 + ',' + currentLocation[1],
        //     ]
        // });
    });
    
    map.on('click', function(e) {
        if (isMarked) { // reset markers on click and when already clicked
            map.removeLayer(routeLayer);
            dir = MQ.routing.directions();
            routeLayer = MQ.routing.routeLayer({
                directions: dir,
                fitBounds: true
            })
            // map.removeLayer(marker);
            map.addLayer(routeLayer);
        }
        mouseClickLocation =  e.latlng;
        // marker = L.marker(mouseClickLocation);
        // marker.addTo(map);
        isMarked = true;
        dir.route({
            locations: [
                currentLocation[0] + ',' + currentLocation[1],
                mouseClickLocation.lat + ',' + mouseClickLocation.lng
            ]
        });
    });

    var setLocationInterval = window.setInterval(sendLocation, 1000);

    function sendLocation() {
        console.log('sending location');
        if (mouseClickLocation != undefined) {
            var locationData = {
                current: currentLocation,
                destination: mouseClickLocation
            }
            $.ajax({
                type: "POST",
                url: "10.0.1.42:8080",
                crossOrigin: null,
                // data: locationData
            }).done(function(response){
                    console.log("success");
                });
        }

    }
//     map.on('dragend', function(e) {
//         mouseClickLocation =  e.latlng;
//         marker = L.marker(mouseClickLocation);
//         marker.addTo(map);
//         dir.route({
//             locations: [
//                 currentLocation[0] + ',' + currentLocation[1],
//                 mouseClickLocation.lat + ',' + mouseClickLocation.lng
//             ]
//         });
//     });
}