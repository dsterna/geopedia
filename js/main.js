// GeoLocation 

let visitedPageIDs = new Array();
let numberOfResponses = 2;
let x = document.getElementById("demo");
var myElement = document.getElementById('article');
var hammertime = new Hammer(myElement);
let markers = new Array();

hammertime.on('panleft', function (ev) {
    if (ev.isFinal) {
        getLocation();
    }
});

function getLocation() {
    document.getElementById("startButton").innerHTML = " 🔊 Next 🔊";
    document.getElementById("swipeText").hidden = false;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
function showPosition(position) {

    sendToWiki(position.coords.latitude, position.coords.longitude);
}
function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation, fetching location from IP."
            $.getJSON('https://api.ipify.org?format=json', function (data) {
                $.getJSON("http://ip-api.com/json/" + data.ip, function (data2) {
                    sendToWiki(data2.lat, data2.lon);
                });
            });
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "GPS Location information is unavailable, fetching location from IP.";
            // Make API call to the GeoIP services
            $.getJSON('https://api.ipify.org?format=json', function (data) {
                $.getJSON("http://ip-api.com/json/" + data.ip, function (data2) {
                    sendToWiki(data2.lat, data2.lon);

                });
            });
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
    }
}
function mapMarker(lat, lon, pageLat, pageLon) {

    const myCustomColour = '#583470'
    const markerHtmlStyles = `
  background-color: ${myCustomColour};
  width: 2rem;
  height: 2rem;
  display: block;
  opacity: 0.5;
  left: -1.5rem;
  top: -1.5rem;
  position: relative;
  border-radius: 3rem 3rem 0;
  transform: rotate(45deg);
  border: 1px solid #FFFFFF`;

    const icon = L.divIcon({
        className: "my-custom-pin",
        iconAnchor: [0, 24],
        labelAnchor: [-6, 0],
        popupAnchor: [0, -36],
        html: `<span style="${markerHtmlStyles}" />`
    });
   
    map.fitBounds([
        [lat, lon],
        [pageLat, pageLon]
    ], { padding: [100, 100] });
   
    let LamMarker = new L.marker([pageLat, pageLon], { icon: icon })
    markers.push(LamMarker);
    LamMarker.addTo(map);
   
 
    
    if (markers.length > 1) {
        map.removeLayer(markers[0]);
        markers.shift();
       
     }
 }
function sendToWiki(lat, long) {
    let coordStrig = "&gscoord=" + lat + "|" + long;
    if (visitedPageIDs.length >= numberOfResponses) {
        numberOfResponses += 5;
    }
    let limitString = "&gslimit=" + numberOfResponses;
    let URL = "https://sv.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&format=json&origin=*" + coordStrig + limitString;
    let pages = new Array();
    $.getJSON(URL, function (data) {
        pages = data.query.geosearch.filter(y => !visitedPageIDs.includes(y.pageid));
        visitedPageIDs.push(pages[0].pageid)

        mapMarker(lat, long, pages[0].lat, pages[0].lon);
        let newURL = "https://sv.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&origin=*&pageids=" + pages[0].pageid;
        $.getJSON(newURL, function (data2) {
            let head = document.getElementById("heading");
            let text = document.getElementById("wikiText");
            let page = data2.query.pages[pages[0].pageid];
            head.innerHTML = page.title;
            text.innerHTML = page.extract;
            responsiveVoice.speak("Du befinner dig " + parseInt(pages[0].dist) + " meter från " + page.title + " . " + page.extract, "Swedish Male");

        })

    });

}
