
const Networking = require('Networking');
export const Diagnostics = require('Diagnostics');
// Base URL
const url = 'https://api.klurdy.com';

// Send the request to the url
export function fetch(url, requestOptions){
    return Networking.fetch(url).then(function (result) {
        if ((result.status >= 200) && (result.status < 300)) {
            return result.json();
        }
        throw new Error('HTTP status code - ' + result.status);
    
    })
}
