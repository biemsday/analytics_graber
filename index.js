// Client ID and API key from the Developer Console
var CLIENT_ID = '980245746698-giol08o9qv8eu0p0t1l95bruq8232foe.apps.googleusercontent.com';
var API_KEY = 'AIzaSyCkK2ur2Ko82YQyJaJBjT0ojgkIt7TjaJ0';
var SHEET_ID = '1ExEZ42OGvvIXG5SQID21kSlNRyj-E00aqtFGyMEQ45o';
var SCOPE = 'https://www.googleapis.com/auth/drive';

var GoogleAuth;

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

function handleClientLoad() {
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    gapi.load('client:auth2', initClient);
}

function initClient() {
    // Retrieve the discovery document for version 3 of Google Drive API.
    // In practice, your app can retrieve one or more discovery documents.
    var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

    // Initialize the gapi.client object, which app uses to make API requests.
    // Get API key and client ID from API Console.
    // 'scope' field specifies space-delimited list of access scopes.
    gapi.client.init({
        'apiKey': API_KEY,
        'clientId': CLIENT_ID,
        'discoveryDocs': [discoveryUrl],
        'scope': SCOPE
    }).then(function() {
        GoogleAuth = gapi.auth2.getAuthInstance();

        // Listen for sign-in state changes.
        GoogleAuth.isSignedIn.listen(updateSigninStatus);

        // Handle initial sign-in state. (Determine if user is already signed in.)
        var user = GoogleAuth.currentUser.get();
        setSigninStatus();

        // Call handleAuthClick function when user clicks on
        //      "Sign In/Authorize" button.
        $('#sign-in-or-out-button').click(function() {
            handleAuthClick();
        });
        $('#revoke-access-button').click(function() {
            revokeAccess();
        });
    });
}

function handleAuthClick() {
    if (GoogleAuth.isSignedIn.get()) {
        // User is authorized and has clicked "Sign out" button.
        GoogleAuth.signOut();
    } else {
        // User is not signed in. Start Google auth flow.
        GoogleAuth.signIn();
    }
}

function revokeAccess() {
    GoogleAuth.disconnect();
}

function setSigninStatus(isSignedIn) {
    var user = GoogleAuth.currentUser.get();
    var isAuthorized = user.hasGrantedScopes(SCOPE);
    if (isAuthorized) {
        $('#sign-in-or-out-button').html('Sign out');
        $('#revoke-access-button').css('display', 'inline-block');
        $('#auth-status').html('You are currently signed in and have granted ' +
            'access to this app.');
    } else {
        $('#sign-in-or-out-button').html('Sign In/Authorize');
        $('#revoke-access-button').css('display', 'none');
        $('#auth-status').html('You have not authorized this app or you are ' +
            'signed out.');
    }
}

function updateSigninStatus(isSignedIn) {
    setSigninStatus();
}

function write_data() {
    var values = [
        get_followers(),
    ];

    var body = {
        values: values
    };

    gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: "'План'!C1:C1000",
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