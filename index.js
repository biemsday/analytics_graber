// Client ID and API key from the Developer Console
var CLIENT_ID = '980245746698-giol08o9qv8eu0p0t1l95bruq8232foe.apps.googleusercontent.com';
var API_KEY = 'AIzaSyCkK2ur2Ko82YQyJaJBjT0ojgkIt7TjaJ0';

var SHEET_ID = '1ExEZ42OGvvIXG5SQID21kSlNRyj-E00aqtFGyMEQ45o';

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
    try {
        gapi.load('client:auth2', initClient);
    } catch (e) {

    }

}

// init statment
function initClient() {
    try {
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
    } catch (e) {

    }

}

function updateSigninStatus(isSignedIn) {
    try {
        if (isSignedIn) {
            authorizeButton.style.display = 'none';
            signoutButton.style.display = 'block';
            listMajors();
        } else {
            authorizeButton.style.display = 'block';
            signoutButton.style.display = 'none';
        }
    } catch (e) {

    }
}

function handleAuthClick(event) {
    try {
        gapi.auth2.getAuthInstance().signIn();
    } catch (e) {

    }
}

function handleSignoutClick(event) {
    try {
        gapi.auth2.getAuthInstance().signOut();
    } catch (e) {

    }
}

function appendPre(message) {
    try {
        var pre = document.getElementById('content');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
    } catch (e) {

    }
}

function write_data(cell) {
    var values = [
        get_followers(),
    ];

    var body = {
        values: values
    };

    gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: 'C18',
        valueInputOption: 'RAW',
        resource: body
    }).then((response) => {
        var result = response.result;
        console.log(`${result.updatedCells} cells updated.`);
    });
}

function getSheets() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: 'C:C'
    }).then((response) => {
        var result = response.result;
        var numRows = result.values ? result.values.length : 0;

        write_data()

        console.log(`${numRows} rows retrieved.`);
    });
}