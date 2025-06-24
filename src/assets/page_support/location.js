// location.js
export function getCurrentLocation(successCallback, errorCallback) {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback)
  } else {
    console.error("Geolocation is not supported by this browser.")
    if (errorCallback) {
      errorCallback(new Error("Geolocation not supported"))
    }
  }
}