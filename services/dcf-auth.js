const nodeFetch = require("node-fetch");
const config = require("../config");
const {LOGIN_GOV, NIH} = require("../constants/idp-constants");
const loginGovRegex = new RegExp(/(?:.){1}(@login.gov){1}\b/i);
const nihRegex = new RegExp(/(?:.){1}(@nih.gov){1}\b/i);

const validateResponseOrThrow= (res)=> {
    if (res.status != 200) throw new Error("eRA Commons access token failed to create because of invalid access code or unauthorized access");
}

const client = config.DCF;

async function getDCFToken(code, redirectURi) {
    console.log(client.TOKEN_URL)
    const response = await nodeFetch(client.TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            code: code,
            redirect_uri: redirectURi,
            grant_type: "authorization_code",
            client_id: client.CLIENT_ID,
            client_secret: client.CLIENT_SECRET,
            scope: "openid"
        })
    });
    const jsonResponse = await response.json();
    validateResponseOrThrow(response);
    return jsonResponse.access_token;
}

async function dcfLogout(tokens) {
    console.log(client.LOGOUT_URL)
    console.log(Buffer.from(client.CLIENT_ID + ':' + client.CLIENT_SECRET).toString('base64'))

    const result = await nodeFetch(client.LOGOUT_URL, {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(client.CLIENT_ID + ':' + client.CLIENT_SECRET).toString('base64')
        },
        body: new URLSearchParams({
            id_token: tokens,
            next:client.REDIRECT_URL,
            force_era_global_logout: true
        })
    });
    return result;
}


async function dcfUserInfo(accessToken) {
    console.log(client.LOGOUT_URL)
    const result = await nodeFetch(client.USERINFO_URL, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ` + accessToken
        }
    });
    return result.json();
}


module.exports = {
    getDCFToken,
    decLogout,
    decUserInfo,
};