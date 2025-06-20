export function getCurrentLocation(successCallback, errorCallback) {

if ("geolocation" in navigator) {
    // geolocation supported
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

    function successCallback(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log("Latitude:", latitude, "Longitude:", longitude);

    }

    function errorCallback(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                console.error("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                console.error("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                console.error("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                console.error("An unknown error occurred.");
                break;
        }
    }
} 
else {
    // geolocation not supported
    console.log("Geolocation is not supported by this browser.");
}

}

