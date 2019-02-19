
// GeoLocation 


var x = document.getElementById("demo");
function getLocation() {
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }

}
function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude;
    sendToWiki(position.coords.latitude, position.coords.longitude);
    console.log("här?")
}
function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
    }
    
}
function reqListener () {
    console.log(this.responseText);
}
function sendToWiki(lat, long) {

    let url = "https://sv.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gslimit=10&origin=*&format=json" +"&gscoord=" + long + "" + lat;
    console.log("https://sv.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=37.7891838%7C-122.4033522&gsradius=10000&gslimit=10&origin=*&format=json")
    console.log(url);
    let wiki = $.getJSON("https://sv.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=37.7891838%7C-122.4033522&gsradius=10000&gslimit=10&origin=*&format=json",
    function(data){ 
     console.log(data.query);
    })
    // let wiki = { "batchcomplete": "", "query": { "geosearch": [{ "pageid": 9292891, "ns": 0, "title": "140 New Montgomery", "lat": 37.786819444444, "lon": -122.39990555556, "dist": 36.7, "primary": "" }, { "pageid": 40377676, "ns": 0, "title": "New Montgomery Street", "lat": 37.78729, "lon": -122.40033, "dist": 80.3, "primary": "" }, { "pageid": 1544800, "ns": 0, "title": "Cartoon Art Museum", "lat": 37.787088, "lon": -122.40094, "dist": 125.4, "primary": "" }, { "pageid": 40413203, "ns": 0, "title": "222 Second Street", "lat": 37.78635, "lon": -122.39825, "dist": 130.4, "primary": "" }, { "pageid": 9297181, "ns": 0, "title": "101 Second Street", "lat": 37.788139, "lon": -122.399056, "dist": 138.2, "primary": "" }, { "pageid": 2183989, "ns": 0, "title": "Academy of Art University", "lat": 37.78785, "lon": -122.40065, "dist": 140.6, "primary": "" }, { "pageid": 24801569, "ns": 0, "title": "San Francisco Bay Area Planning and Urban Research Association", "lat": 37.78716, "lon": -122.4012, "dist": 149.2, "primary": "" }, { "pageid": 20004112, "ns": 0, "title": "The Montgomery (San Francisco)", "lat": 37.78762, "lon": -122.40112, "dist": 158.8, "primary": "" }, { "pageid": 6374316, "ns": 0, "title": "St. Regis Museum Tower", "lat": 37.7863, "lon": -122.4013, "dist": 172.2, "primary": "" }, { "pageid": 18679821, "ns": 0, "title": "California Historical Society", "lat": 37.786844444444, "lon": -122.40148055556, "dist": 172.4, "primary": "" }] } };
    
    // let nearbyPageId = wiki.query.geosearch[0].pageid;
    // let testURL = "https://sv.wikipedia.org/?curid=" + nearbyPageId;
    // console.log(testURL);
    console.log(lat, long);
}

 

