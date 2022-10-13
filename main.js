const fs = require('fs');
const axios = require('axios');

const obj = JSON.parse(fs.readFileSync('./charlotte-routes.json', 'utf8'));
const ACCESS_TOKEN = "pk.eyJ1IjoiYXNoZXItbWFydmVsYnVzIiwiYSI6ImNsNzUzZXVtMTFuejMzd212amhvdjF1ZjAifQ.XrY31Bf1c__G4mOtw0kCjg"

function getURL(route) {
    return 'https://api.mapbox.com/optimized-trips/v1/mapbox/driving/' + route.map(e => e.join(',')).join(';') + `?access_token=${ACCESS_TOKEN}`;
}

var newObj = {
    school: obj.school,
    routes: [],
};

(async () => {
    await Promise.all(obj.routes.map(async route =>  {
        let closedRoute = [obj.school].concat(route);
        try {
            const response = await axios.get(getURL(closedRoute));
            newObj.routes.push(response.data.waypoints.map(e => e.location));
        } catch (error) {
            console.log(error.response.body);
        }
    }));

    try {
        fs.writeFileSync('./output.json', JSON.stringify(newObj));
        // file written successfully
    } catch (err) {
        console.error(err);
    }
})();
