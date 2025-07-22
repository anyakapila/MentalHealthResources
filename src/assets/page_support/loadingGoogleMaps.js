let mapsLibLoaded = null;

export function loadGoogleMaps() {
  if (!mapsLibLoaded) {
    mapsLibLoaded = google.maps.importLibrary('maps');
  }
  return mapsLibLoaded;
}