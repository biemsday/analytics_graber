// Client ID and API key from the Developer Console
var CLIENT_ID = '980245746698-giol08o9qv8eu0p0t1l95bruq8232foe.apps.googleusercontent.com';
var API_KEY = 'AIzaSyCkK2ur2Ko82YQyJaJBjT0ojgkIt7TjaJ0';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

//followers count
async function get_followers(window) {
    'use strict';

    let response = await fetch('https://www.instagram.com/basova.yana/?__a=1');
    try {
        if (response.ok) {
            let json = await response.json();
            var return_result = json.graphql.user.edge_followed_by.count
            console.log(return_result)
        } else {
            alert('Ошибка HTTP: ' + response.status);
        }
    } catch (e) {
        console.log(e + ' - f() - followers count')
    }
}


var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

// onload init gapi
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

// init statment
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function() {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, function(error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        listMajors();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}
//custom event gss
function listMajors() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1ExEZ42OGvvIXG5SQID21kSlNRyj-E00aqtFGyMEQ45o',
        range: 'План Data!A2:A10',
    }).then(function(response) {
        var range = response.result;
        if (range.values.length > 0) {
            appendPre('Name, Major:');
            for (i = 0; i < range.values.length; i++) {
                var row = range.values[i];
                // Print columns A and E, which correspond to indices 0 and 4.
                appendPre(row[0] + ', ' + row[4]);
            }
        } else {
            appendPre('No data found.');
        }
    }, function(response) {
        appendPre('Error: ' + response.result.error.message);
    });
}