let googleMapsScriptLoaded = false;

export function loadGoogleMaps(apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY, libraries = ['marker', 'places']) {
    return new Promise((resolve, reject) => {
        if (googleMapsScriptLoaded && window.google && window.google.maps) {
            resolve(window.google.maps);
            return;
        }

       // if script is there but not loaded yet
        if (document.querySelector('#google-maps-script')) {
            const checkInterval = setInterval(() => {
                if (window.google && window.google.maps) {
                    clearInterval(checkInterval);
                    googleMapsScriptLoaded = true;
                    resolve(window.google.maps);
                }
            }, 100);
            return;
        }

        // loading fresh script
        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries.join(',')}`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            googleMapsScriptLoaded = true;
            resolve(window.google.maps);
        };
        script.onerror = reject;

        document.head.appendChild(script);
    });
}