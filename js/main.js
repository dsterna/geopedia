// GeoLocation 
console.log("always here");
let visitedPageIDs = new Array();
let x = document.getElementById("demo");


// create a simple instance
// by default, it only adds horizontal recognizers
var myElement = document.getElementById('article');
var hammertime = new Hammer(myElement);
let count=0;
hammertime.on('panleft', function(ev) {
    if(ev.dist > 100){
        myElement.style.opacity = 0.8
    }
    else if   (ev.dist > 150){
        myElement.style.opacity = 0.7
    }
    else if   (ev.dist > 200){
        myElement.style.opacity = 0.6
    }
    if(ev.isFinal){
        getLocation();
    }
	//
});

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
}
function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation, fetching location from IP."
            $.getJSON('https://api.ipify.org?format=json', function (data) {
                $.getJSON("http://ip-api.com/json/" + data.ip, function (data2) {
                    console.log(data2.lat, data2.lon)
                    sendToWiki(data2.lat, data2.lon);
                });
            });
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "GPS Location information is unavailable, fetching location from IP.";
            // Make API call to the GeoIP services
            $.getJSON('https://api.ipify.org?format=json', function (data) {
                $.getJSON("http://ip-api.com/json/" + data.ip, function (data2) {
                    console.log(data2.lat, data2.lon)
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

function sendToWiki(lat, long) {
    console.log(document.getElementById("map"));
    // let testURL = "https://sv.wikipedia.org/?curid=";
    let testURL = "https://en.wikipedia.org/w/api.php?action=query&prop=info&inprop=url&pageids="

    //let s= "&gscoord=37.786952%7C-122.399523"
    let coordStrig = "&gscoord=" + lat + "|" + long;
    let URL = "https://sv.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gslimit=10&format=json&origin=*"
    URL = URL + coordStrig;
    console.log(URL);
    let pageID;
    $.getJSON(URL, function (data) {
        console.log(data)
        
        let ary = data.query.geosearch.filter(y => !visitedPageIDs.includes(y.pageid));
        visitedPageIDs.push(ary[0].pageid)
        pageID = ary[0].pageid;
        let newURL = "https://sv.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&origin=*&pageids=" + pageID;
        $.getJSON(newURL, function (data2) {
            let head = document.getElementById("heading");
            let text = document.getElementById("wikiText");
            let page = data2.query.pages[pageID];
            console.log(page);
            head.innerHTML = page.title;
            text.innerHTML = page.extract;
            responsiveVoice.speak("Du befinner dig " + parseInt(ary[0].dist) + " meter från " + page.title + " . " + page.extract, "Swedish Male");
            console.log(visitedPageIDs);
        })
    });
}
