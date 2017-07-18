function initMap() {
        var uluru = {lat: 40.6970755, lng: -73.9425913};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 16,
          center: uluru,
          mapTypeControl:false,
					scaleControl:false,
					streetViewControl:false,
					rotateControl:false,
					fullscreenControl:false
        });
        var marker = new google.maps.Marker({
          position: uluru,
          map: map
        });
}        