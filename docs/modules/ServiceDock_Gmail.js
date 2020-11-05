/*
Project Name: SPIKE Prime Web Interface
File name: ServiceDock_Gmail.js
Author: Jeremy Jung
Last update: 7/26/20
Description: HTML Element definition for <service-gmail> to be used in ServiceDocks
Credits/inspirations:
History:
    Created by Jeremy on 7/26/20
LICENSE: MIT
(C) Tufts Center for Engineering Education and Outreach (CEEO)
*/

class servicegmail extends HTMLElement {

    constructor() {
        super();

        this.active = false; // whether the service was activated
        this.service = new Service_Gmail(); // instantiate a service object ( one object per button )
        this.proceed = false; // if there are credentials input
        this.APIKey;
        this.clientID;

        // Create a shadow root
        var shadow = this.attachShadow({ mode: 'open' });

        /* wrapper definition and CSS */

        var wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'wrapper');
        wrapper.setAttribute("style", "width: 50px; height: 50px; position: relative; margin-top: 10px;")

        /* ServiceDock button definition and CSS */

        var button = document.createElement("button");
        button.setAttribute("id", "sl_button");
        button.setAttribute("class", "SD_button");

        var imageRelPath = "./modules/views/gmailserviceIcon.png" // relative to the document in which a servicespike is created ( NOT this file )
        var length = 50; // for width and height of button
        var buttonBackgroundColor = "#A2E1EF" // background color of the button
        var buttonStyle = "width:" + length + "px; height:" + length + "px; background: url(" + imageRelPath + ") no-repeat; background-size: 50px 50px; background-color:" + buttonBackgroundColor
            + "; border: none; background-position: center; cursor: pointer; border-radius: 10px; position: relative; margin: 4px 0px; "
        button.setAttribute("style", buttonStyle);

        /* status circle definition and CSS */

        var status = document.createElement("div");
        status.setAttribute("class", "status");
        var length = 20; // for width and height of circle
        var statusBackgroundColor = "red" // default background color of service (inactive color)
        var posLeft = 30;
        var posTop = 20;
        var statusStyle = "border-radius: 50%; height:" + length + "px; width:" + length + "px; background-color:" + statusBackgroundColor +
            "; position: relative; left:" + posLeft + "px; top:" + posTop + "px;";
        status.setAttribute("style", statusStyle);

        /* event listeners */

        button.addEventListener("mouseleave", function (event) {
            button.style.backgroundColor = "#A2E1EF";
            button.style.color = "#000000";
        });

        button.addEventListener("mouseenter", function (event) {
            button.style.backgroundColor = "#FFFFFF";
            button.style.color = "#000000";
        })

        // when ServiceDock button is double clicked
        this.addEventListener("click", async function () {
            if (!this.active) {
                this.popUpBox();
            }

            // check active flag so once activated, the service doesnt reinit
            if ( !this.active && this.proceed ) {

                console.log("activating service");

                var initSuccessful = await this.service.init(this.APIKey, this.clientID);
                if (initSuccessful) {
                    this.active = true;
                    status.style.backgroundColor = "green";
                }
            }
        });


        shadow.appendChild(wrapper);
        button.appendChild(status);
        wrapper.appendChild(button);

    }

    /* Ask user for API credentials */
    popUpBox() {
        
        /* API credentials list (add for API accordingly)*/
        var APIKeyExists = false;
        var clientIDExists = false;

        var APIKeyResult = prompt("Please enter your Gmail API Key:", "AIzaSyCAYc49qBvn6aY2nPPskx5yqx811kzDubU");
        var clientIDResult = prompt("Please enter your Gmail API client ID:", "488852657628-hdh5rfov7mm1n5ta4lcpcr3gk1n4890m.apps.googleusercontent.com");
        
        // API key
        if (APIKeyResult == null || APIKeyResult == "") {
            console.log("You inserted no API key")
            APIKeyExists = false;
        }
        else {
            APIKeyExists = true;
            this.APIKey = APIKeyResult;
        }

        // client ID
        if ( clientIDResult == null || clientIDResult == "" ) {
            console.log("You inserted no client ID");
            clientIDExists = false;
        }
        else {
            clientIDExists = true;
            this.clientID = clientIDResult;
        }

        if ( APIKeyExists && clientIDExists ) {
            this.proceed = true;
        }

    }

    /* for Service's API credentials */

    static get observedAttributes() {
        return ["apikey", "clientid"];
    }

    get apikey() {
        return this.getAttribute("apikey");
    }

    get clientid() {
        return this.getAttribute("clientid");
    }

    set apikey(val) {
        if (val) {
            this.setAttribute("apikey", val);
        }
        else {
            this.removeAttribute("apikey");
        }
    }

    set clientid(val) {
        if (val) {
            this.setAttribute("clientid", val);
        }
        else {
            this.removeAttribute("clientid");
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if ( name == "apikey" ) {
            this.APIKey = newValue;
        }
        else if ( name == "clientid" ) {
            this.clientID = newValue;
        }
    }

    /* get the Service_SPIKE object */
    getService() {
        return this.service;
    }

    /* get whether the ServiceDock button was clicked */
    getClicked() {
        return this.active;
    }

}

// when defining custom element, the name must have at least one - dash 
window.customElements.define('service-gmail', servicegmail);

/*
Project Name: SPIKE Prime Web Interface
File name: Service_Gmail.js
Author: Jeremy Jung
Last update: 7/26/20
Description: Google API service library.
Credits/inspirations:
History:
    Created by Jeremy on 7/26/20
LICENSE: MIT
(C) Tufts Center for Engineering Education and Outreach (CEEO)
Note:
- Needs to be used with a tuftsceeo account
- Currently supporting: Gmail

https://github.com/google/google-api-javascript-client/blob/master/docs/start.md
https://developers.google.com/gmail/api/quickstart/js?authuser=1
https://console.developers.google.com/apis/credentials/consent/edit?authuser=1&project=dogwood-seeker-284007&supportedpurview=project&duration=P1D
*/

function Service_Gmail() {

    //////////////////////////////////////////
    //                                      //
    //          Global Variables            //
    //                                      //
    //////////////////////////////////////////

    // Client ID and API key from the Developer Console
    var CLIENT_ID = 'CLIENT ID';
    var API_KEY = 'API KEY';

    var googleSignedIn = false;

    var funcAtInit = undefined; // function to call after init

    var userEmailAddr;

    var serviceActive = false;

    //////////////////////////////////////////
    //                                      //
    //           Public Functions           //
    //                                      //
    //////////////////////////////////////////

    /* init() - initialize service
    *
    * Parameters:
    * APIKeyInput
    * clientIDInput
    * 
    * Effect:
    * - executes the callback function
    *
    * Note:
    * This function needs to be executed after executeAfterInit() but before all other functions
    */
    async function init(APIKeyInput, clientIDInput) {

        if ( APIKeyInput !== undefined ) {
            API_KEY = APIKeyInput;
        } 
        if ( clientIDInput !== undefined ) {
            CLIENT_ID = clientIDInput;
        }

        // initialize Google API client  load the auth2 library and API client library.
        await gapi.load("client:auth2", initClient);

        await sleep(2000); // wait for service to init

        getUserEmail();

        // call funcAtInit if defined
        if (funcAtInit !== undefined) {
            funcAtInit();
        }
        return true;
    }

    /* executeAfterInit() - get the callback function to execute after service is initialized
    *
    * Parameter:
    * {callback} (function) - function to execute after initialization
    * 
    * Effect:
    * - assigns global variable funcAtInit a pointer to callback function
    * 
    * Note:
    * This function needs to be executed before calling init()
    */
    function executeAfterInit(callback) {
        funcAtInit = callback;
    }

    /* getLabels()
    *
    */
    function getLabels() {
        var result = listLabels();
        console.log("labels", result.labels);
    }

    /* readLatestUnread() - get the content of the latest unread message in inbox
    * 
    * Returns:
    * {toReturn} (string) decoded content of the latest unread message in inbox
    */
    async function readLatestUnread() {
        var params = {
            "q": "is:unread",
            "labelIds": ["INBOX"]
        }
        var msgInfo = await listMessagesID(params);

        var id = msgInfo.messages[0].id; // get the info of the latest message

        var msgBodyInfo = await readMessage(id);

        var rawMessage = msgBodyInfo.payload.body.data;

        var d = rawMessage.replace(/-/g, '+').replace(/_/g, '/');
        var decoded = base64.decode(d)

        toReturn = decoded;

        return toReturn;
    }

    /* readLatestUnreadFrom() - get the content of the latest unread message from an email address
    *
    * Parameter:
    * {emailAddr} (string) - the address that sent the email
    *
    * Returns:
    * {toReturn} (string) decoded content of the latest unread message in inbox
    */
    async function readLatestUnreadFrom(emailAddr) {

        var toReturn;

        var query = "from: " + emailAddr + " is:unread";

        var params = {
            "q": query,
            "labelIds": ["INBOX"]
        }

        var msgInfo = await listMessagesID(params);

        var id = msgInfo.messages[0].id; // get the info of the latest message

        var msgBodyInfo = await readMessage(id);

        var rawMessage;

        if (msgBodyInfo.payload.parts !== undefined) {
            rawMessage = msgBodyInfo.payload.parts[0].body.data;
        }
        else if (msgBodyInfo.payload.body.data) {
            rawMessage = msgBodyInfo.payload.body.data;
        }

        var d = rawMessage.replace(/-/g, '+').replace(/_/g, '/');

        var decoded = base64.decode(d)

        toReturn = decoded;

        return toReturn;
    }

    /* readRandomMessage() - get the content of a random message in the inbox
    *
    * Returns:
    * {toReturn} (string) decoded content of the message
    */
    async function readRandomMessage() {

        var params = {
            "labelIds": ["INBOX"]
        }

        var msgInfo = await listMessagesID(params);
        console.log("msgInfo", msgInfo);

        var randIndex = Math.floor((Math.random() * length));
        var id = msgInfo.messages[randIndex].id; // get the info of the latest message

        var msgBodyInfo = await readMessage(id);
        console.log("msgBodyInfo", msgBodyInfo);

        var rawMessage;

        if (msgBodyInfo.payload.parts !== undefined) {
            rawMessage = msgBodyInfo.payload.parts[0].body.data;
        }
        else if (msgBodyInfo.payload.body.data) {
            rawMessage = msgBodyInfo.payload.body.data;
        }

        var d = rawMessage.replace(/-/g, '+').replace(/_/g, '/');
        var decoded = base64.decode(d);

        toReturn = decoded;

        return toReturn;
    }

    /* readRandomThread() - get a random thread in the inbox
    * 
    * Note: for testing purposes
    */
    async function readRandomThread() {
        var params = {
            "labelIds": ["INBOX"]
        }

        var msgInfo = await listMessagesID(params);
        console.log("msgInfo", msgInfo);

        var randIndex = Math.floor((Math.random() * length));
        var id = msgInfo.messages[randIndex].threadId; // get the info of the latest message

        var threadBodyInfo = await readThread(id);
        console.log("threadBodyInfo", threadBodyInfo);

    }

    /* sendMessage() - send a GMail message
    *
    * Parameters:
    * {messageInput} (string) - ASCII message to send
    * {recipient} (string) - recipient's email address
    * {subject} (string) - subject of the message
    */
    async function sendMessage(messageInput, recipient, subject) {

        var fromLine = "From: " + userEmailAddr + "\r\n";
        var toLine = "To: " + recipient + "\r\n";
        var subjectLine = "Subject: " + subject + "\r\n\r\n";
        var messageLine = messageInput;
        var messageRFC = fromLine + toLine + subjectLine + messageLine;

        var encoded = window.btoa(messageRFC);

        //replace so UTF-8 encoded Unicode characters may be used within the header.
        var encodedGoogle = encoded.replace(/-/g, '+').replace(/_/g, '/');

        var msgInfo = await requestMessageSend(encodedGoogle);

        console.log("message Sent", msgInfo);

    }

    /* signOut() - sign a Google user out
    */
    async function signOut() {
        gapi.auth2.getAuthInstance().signOut();
    }

    /* isActive() - get whether the Service was initialized or not
    *
    * Returns:
    * {serviceActive} (boolean) - whether Service was initialized or not
    */
    function isActive() {
        return serviceActive;
    }

    /* getUserEmail() - get the email address of the signed in Google User
    *
    */
    async function getUserEmail() {

        var requestInfo = {};
        requestInfo["path"] = "https://www.googleapis.com/gmail/v1/users/me/profile";

        var profile = await sendGAPIrequest(requestInfo);

        var emailAddr = profile.emailAddress;
        userEmailAddr = emailAddr;

        return emailAddr; 

    }

    //////////////////////////////////////////
    //                                      //
    //          Private Functions           //
    //                                      //
    //////////////////////////////////////////

    /* signInProcess() - sign the user in
    *
    * Parameters:
    * {isSignedIn} (boolean) - whether Google user is signed in or not
    * {cb} (function) - callback
    * 
    * Effect:
    * - shows consent screen when signing in
    */
    function signInProcess(isSignedIn, cb) {
        // if Google user already signed in
        if (isSignedIn) {
            googleSignedIn = true;
        } else {
            // prompt user to sign in
            gapi.auth2.getAuthInstance().signIn();
        }
        cb(googleSignedIn);
    }

    /* initClient() - initialize google API client
    */
    function initClient() {
        gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            scope: 'https://mail.google.com/'
        }).then(function () {
            signInProcess(gapi.auth2.getAuthInstance().isSignedIn.get(), function () {
                console.log("googleSignedIn", googleSignedIn);
                console.log("Signed in")
            });
        })
    }


    //sleep function
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /* requestMessageSend() - make Send message API request
    *
    * Parameters:
    * {rawMessageInput} (string) - base64url encoded message in RFC 2822
    *
    * Effect:
    * - Sends API request
    */
    async function requestMessageSend(rawMessageInput) {

        var toReturn;

        var requestInfo = {};
        requestInfo["path"] = "https://www.googleapis.com/gmail/v1/users/me/messages/send";
        requestInfo["method"] = "POST";
        requestInfo["body"] = { "raw": rawMessageInput };
        //var message =  {"message": {"raw": rawMessageInput}};
        //requestInfo["body"] = message;
        console.log(rawMessageInput)

        toReturn = await sendGAPIrequest(requestInfo);

        return toReturn;
    }

    /* listMessagesID() - list the ID information of all messages
    *
    * Parameters:
    * {paramsInput} (object) - parameters for the request
    *
    * Effect:
    * - Sends API request
    */
    async function listMessagesID(paramsInput) {

        var toReturn;

        var requestInfo = {};
        requestInfo["path"] = "https://www.googleapis.com/gmail/v1/users/me/messages";
        if (paramsInput != undefined) {
            requestInfo["params"] = paramsInput
        }

        toReturn = await sendGAPIrequest(requestInfo);

        return toReturn;
    }

    /* readMessage() - read the message given an ID
    *
    * Parameters:
    * {messageID} (string) - ID of the message to read
    *
    * Effect:
    * - Sends API request
    */
    async function readMessage(messageID) {

        var toReturn;

        var requestInfo = {};
        requestInfo["path"] = "https://www.googleapis.com/gmail/v1/users/me/messages/" + messageID;
        requestInfo["params"] = { "format": "full" };

        toReturn = await sendGAPIrequest(requestInfo);

        return toReturn;

    }

    /* readThread() - read the message given a ThreadID
    *
    * Parameters:
    * {threadID} (string) - ThreadID of the message to read
    *
    * Effect:
    * - Sends API request
    */
    async function readThread(threadID) {
        var toReturn;

        var requestInfo = {};
        requestInfo["path"] = "https://www.googleapis.com/gmail/v1/users/me/threads/" + threadID;
        requestInfo["params"] = { "format": "full" };
        toReturn = await sendGAPIrequest(requestInfo);

        return toReturn;

    }

    /* listLabels() - list the labels in the inbox
    *
    * Effect:
    * - Sends API request
    */
    async function listLabels() {

        var toReturn;

        var requestInfo = {};
        requestInfo["path"] = "https://www.googleapis.com/gmail/v1/users/me/labels";
        toReturn = await sendGAPIrequest(requestInfo);

        return toReturn;
    }

    /* sendGAPIrequest - Helper function for sending the Google API request
    *
    * Parameters - 
    * - {options} (Object) - Information to put in request
    * options = { "path": path, "params": params, "method": method, "body": body, "headers": headers }
    * - {callback} (Function) - callback function
    *
    * Effect:
    * - Sends API request
    */
    async function sendGAPIrequest(options) {
        var toReturn;
        await gapi.client.request(
            options
        ).then(function (response) {
            toReturn = response.result;
        }, function (error) {
            console.log(error);
            throw Error("Error at sendGAPIrequest", error);
        })

        return toReturn;

    }

    return {
        init: init,
        executeAfterInit: executeAfterInit,
        getLabels: getLabels,
        readLatestUnread, readLatestUnread,
        readLatestUnreadFrom, readLatestUnreadFrom,
        readRandomMessage: readRandomMessage,
        readRandomThread: readRandomThread,
        sendMessage: sendMessage,
        signOut: signOut,
        isActive: isActive,
        getUserEmail: getUserEmail
    
    }
}


















var gapi = window.gapi = window.gapi || {}; gapi._bs = new Date().getTime(); (function () {/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
    var g = this || self, h = function (a) { return a }; var m = function () { this.g = "" }; m.prototype.toString = function () { return "SafeStyle{" + this.g + "}" }; m.prototype.a = function (a) { this.g = a }; (new m).a(""); var n = function () { this.f = "" }; n.prototype.toString = function () { return "SafeStyleSheet{" + this.f + "}" }; n.prototype.a = function (a) { this.f = a }; (new n).a("");/*
 gapi.loader.OBJECT_CREATE_TEST_OVERRIDE &&*/
    var q = window, v = document, aa = q.location, ba = function () { }, ca = /\[native code\]/, x = function (a, b, c) { return a[b] = a[b] || c }, da = function (a) { a = a.sort(); for (var b = [], c = void 0, d = 0; d < a.length; d++) { var e = a[d]; e != c && b.push(e); c = e } return b }, C = function () { var a; if ((a = Object.create) && ca.test(a)) a = a(null); else { a = {}; for (var b in a) a[b] = void 0 } return a }, D = x(q, "gapi", {}); var E; E = x(q, "___jsl", C()); x(E, "I", 0); x(E, "hel", 10); var F = function () { var a = aa.href; if (E.dpo) var b = E.h; else { b = E.h; var c = /([#].*&|[#])jsh=([^&#]*)/g, d = /([?#].*&|[?#])jsh=([^&#]*)/g; if (a = a && (c.exec(a) || d.exec(a))) try { b = decodeURIComponent(a[2]) } catch (e) { } } return b }, ea = function (a) { var b = x(E, "PQ", []); E.PQ = []; var c = b.length; if (0 === c) a(); else for (var d = 0, e = function () { ++d === c && a() }, f = 0; f < c; f++)b[f](e) }, G = function (a) { return x(x(E, "H", C()), a, C()) }; var H = x(E, "perf", C()), K = x(H, "g", C()), fa = x(H, "i", C()); x(H, "r", []); C(); C(); var L = function (a, b, c) { var d = H.r; "function" === typeof d ? d(a, b, c) : d.push([a, b, c]) }, N = function (a, b, c) { b && 0 < b.length && (b = M(b), c && 0 < c.length && (b += "___" + M(c)), 28 < b.length && (b = b.substr(0, 28) + (b.length - 28)), c = b, b = x(fa, "_p", C()), x(b, c, C())[a] = (new Date).getTime(), L(a, "_p", c)) }, M = function (a) { return a.join("__").replace(/\./g, "_").replace(/\-/g, "_").replace(/,/g, "_") }; var O = C(), P = [], S = function (a) { throw Error("Bad hint" + (a ? ": " + a : "")); }; P.push(["jsl", function (a) { for (var b in a) if (Object.prototype.hasOwnProperty.call(a, b)) { var c = a[b]; "object" == typeof c ? E[b] = x(E, b, []).concat(c) : x(E, b, c) } if (b = a.u) a = x(E, "us", []), a.push(b), (b = /^https:(.*)$/.exec(b)) && a.push("http:" + b[1]) }]); var ia = /^(\/[a-zA-Z0-9_\-]+)+$/, T = [/\/amp\//, /\/amp$/, /^\/amp$/], ja = /^[a-zA-Z0-9\-_\.,!]+$/, ka = /^gapi\.loaded_[0-9]+$/, la = /^[a-zA-Z0-9,._-]+$/, pa = function (a, b, c, d) { var e = a.split(";"), f = e.shift(), l = O[f], k = null; l ? k = l(e, b, c, d) : S("no hint processor for: " + f); k || S("failed to generate load url"); b = k; c = b.match(ma); (d = b.match(na)) && 1 === d.length && oa.test(b) && c && 1 === c.length || S("failed sanity: " + a); return k }, ra = function (a, b, c, d) {
        a = qa(a); ka.test(c) || S("invalid_callback"); b = U(b); d = d && d.length ? U(d) : null; var e =
            function (f) { return encodeURIComponent(f).replace(/%2C/g, ",") }; return [encodeURIComponent(a.pathPrefix).replace(/%2C/g, ",").replace(/%2F/g, "/"), "/k=", e(a.version), "/m=", e(b), d ? "/exm=" + e(d) : "", "/rt=j/sv=1/d=1/ed=1", a.b ? "/am=" + e(a.b) : "", a.i ? "/rs=" + e(a.i) : "", a.j ? "/t=" + e(a.j) : "", "/cb=", e(c)].join("")
    }, qa = function (a) {
        "/" !== a.charAt(0) && S("relative path"); for (var b = a.substring(1).split("/"), c = []; b.length;) {
            a = b.shift(); if (!a.length || 0 == a.indexOf(".")) S("empty/relative directory"); else if (0 < a.indexOf("=")) {
                b.unshift(a);
                break
            } c.push(a)
        } a = {}; for (var d = 0, e = b.length; d < e; ++d) { var f = b[d].split("="), l = decodeURIComponent(f[0]), k = decodeURIComponent(f[1]); 2 == f.length && l && k && (a[l] = a[l] || k) } b = "/" + c.join("/"); ia.test(b) || S("invalid_prefix"); c = 0; for (d = T.length; c < d; ++c)T[c].test(b) && S("invalid_prefix"); c = V(a, "k", !0); d = V(a, "am"); e = V(a, "rs"); a = V(a, "t"); return { pathPrefix: b, version: c, b: d, i: e, j: a }
    }, U = function (a) { for (var b = [], c = 0, d = a.length; c < d; ++c) { var e = a[c].replace(/\./g, "_").replace(/-/g, "_"); la.test(e) && b.push(e) } return b.join(",") },
        V = function (a, b, c) { a = a[b]; !a && c && S("missing: " + b); if (a) { if (ja.test(a)) return a; S("invalid: " + b) } return null }, oa = /^https?:\/\/[a-z0-9_.-]+\.google(rs)?\.com(:\d+)?\/[a-zA-Z0-9_.,!=\-\/]+$/, na = /\/cb=/g, ma = /\/\//g, sa = function () { var a = F(); if (!a) throw Error("Bad hint"); return a }; O.m = function (a, b, c, d) { (a = a[0]) || S("missing_hint"); return "https://apis.google.com" + ra(a, b, c, d) }; var W = decodeURI("%73cript"), X = /^[-+_0-9\/A-Za-z]+={0,2}$/, ta = function (a, b) { for (var c = [], d = 0; d < a.length; ++d) { var e = a[d], f; if (f = e) { a: { for (f = 0; f < b.length; f++)if (b[f] === e) break a; f = -1 } f = 0 > f } f && c.push(e) } return c }, ua = function () { var a = E.nonce; return void 0 !== a ? a && a === String(a) && a.match(X) ? a : E.nonce = null : v.querySelector ? (a = v.querySelector("script[nonce]")) ? (a = a.nonce || a.getAttribute("nonce") || "", a && a === String(a) && a.match(X) ? E.nonce = a : E.nonce = null) : null : null }, wa = function (a) {
            if ("loading" != v.readyState) va(a);
            else { var b = ua(), c = ""; null !== b && (c = ' nonce="' + b + '"'); a = "<" + W + ' src="' + encodeURI(a) + '"' + c + "></" + W + ">"; v.write(Y ? Y.createHTML(a) : a) }
        }, va = function (a) { var b = v.createElement(W); b.setAttribute("src", Y ? Y.createScriptURL(a) : a); a = ua(); null !== a && b.setAttribute("nonce", a); b.async = "true"; (a = v.getElementsByTagName(W)[0]) ? a.parentNode.insertBefore(b, a) : (v.head || v.body || v.documentElement).appendChild(b) }, xa = function (a, b) {
            var c = b && b._c; if (c) for (var d = 0; d < P.length; d++) {
                var e = P[d][0], f = P[d][1]; f && Object.prototype.hasOwnProperty.call(c,
                    e) && f(c[e], a, b)
            }
        }, za = function (a, b, c) { ya(function () { var d = b === F() ? x(D, "_", C()) : C(); d = x(G(b), "_", d); a(d) }, c) }, Ba = function (a, b) {
            var c = b || {}; "function" == typeof b && (c = {}, c.callback = b); xa(a, c); b = a ? a.split(":") : []; var d = c.h || sa(), e = x(E, "ah", C()); if (e["::"] && b.length) {
                a = []; for (var f = null; f = b.shift();) { var l = f.split("."); l = e[f] || e[l[1] && "ns:" + l[0] || ""] || d; var k = a.length && a[a.length - 1] || null, w = k; k && k.hint == l || (w = { hint: l, c: [] }, a.push(w)); w.c.push(f) } var y = a.length; if (1 < y) {
                    var z = c.callback; z && (c.callback = function () {
                        0 ==
                            --y && z()
                    })
                } for (; b = a.shift();)Aa(b.c, c, b.hint)
            } else Aa(b || [], c, d)
        }, Aa = function (a, b, c) {
            a = da(a) || []; var d = b.callback, e = b.config, f = b.timeout, l = b.ontimeout, k = b.onerror, w = void 0; "function" == typeof k && (w = k); var y = null, z = !1; if (f && !l || !f && l) throw "Timeout requires both the timeout parameter and ontimeout parameter to be set"; k = x(G(c), "r", []).sort(); var Q = x(G(c), "L", []).sort(), I = [].concat(k), ha = function (u, A) {
                if (z) return 0; q.clearTimeout(y); Q.push.apply(Q, p); var B = ((D || {}).config || {}).update; B ? B(e) : e && x(E, "cu",
                    []).push(e); if (A) { N("me0", u, I); try { za(A, c, w) } finally { N("me1", u, I) } } return 1
            }; 0 < f && (y = q.setTimeout(function () { z = !0; l() }, f)); var p = ta(a, Q); if (p.length) {
                p = ta(a, k); var r = x(E, "CP", []), t = r.length; r[t] = function (u) { if (!u) return 0; N("ml1", p, I); var A = function (J) { r[t] = null; ha(p, u) && ea(function () { d && d(); J() }) }, B = function () { var J = r[t + 1]; J && J() }; 0 < t && r[t - 1] ? r[t] = function () { A(B) } : A(B) }; if (p.length) {
                    var R = "loaded_" + E.I++; D[R] = function (u) { r[t](u); D[R] = null }; a = pa(c, p, "gapi." + R, k); k.push.apply(k, p); N("ml0", p, I); b.sync ||
                        q.___gapisync ? wa(a) : va(a)
                } else r[t](ba)
            } else ha(p) && d && d()
        }, Ca; var Da = null, Z = g.trustedTypes; if (Z && Z.createPolicy) try { Da = Z.createPolicy("gapi#gapi", { createHTML: h, createScript: h, createScriptURL: h }) } catch (a) { g.console && g.console.error(a.message) } Ca = Da; var Y = Ca; var ya = function (a, b) { if (E.hee && 0 < E.hel) try { return a() } catch (c) { b && b(c), E.hel--, Ba("debug_error", function () { try { window.___jsl.hefn(c) } catch (d) { throw c; } }) } else try { return a() } catch (c) { throw b && b(c), c; } }; D.load = function (a, b) { return ya(function () { return Ba(a, b) }) }; K.bs0 = window.gapi._bs || (new Date).getTime(); L("bs0"); K.bs1 = (new Date).getTime(); L("bs1"); delete window.gapi._bs;
}).call(this);
gapi.load("", { callback: window["gapi_onload"], _c: { "jsl": { "ci": { "deviceType": "desktop", "oauth-flow": { "authUrl": "https://accounts.google.com/o/oauth2/auth", "proxyUrl": "https://accounts.google.com/o/oauth2/postmessageRelay", "disableOpt": true, "idpIframeUrl": "https://accounts.google.com/o/oauth2/iframe", "usegapi": false }, "debug": { "reportExceptionRate": 0.05, "forceIm": false, "rethrowException": false, "host": "https://apis.google.com" }, "enableMultilogin": true, "googleapis.config": { "auth": { "useFirstPartyAuthV2": true } }, "isPlusUser": false, "inline": { "css": 1 }, "disableRealtimeCallback": false, "drive_share": { "skipInitCommand": true }, "csi": { "rate": 0.01 }, "client": { "cors": false }, "isLoggedIn": true, "signInDeprecation": { "rate": 0.0 }, "include_granted_scopes": true, "llang": "en", "iframes": { "youtube": { "params": { "location": ["search", "hash"] }, "url": ":socialhost:/:session_prefix:_/widget/render/youtube?usegapi\u003d1", "methods": ["scroll", "openwindow"] }, "ytsubscribe": { "url": "https://www.youtube.com/subscribe_embed?usegapi\u003d1" }, "plus_circle": { "params": { "url": "" }, "url": ":socialhost:/:session_prefix::se:_/widget/plus/circle?usegapi\u003d1" }, "plus_share": { "params": { "url": "" }, "url": ":socialhost:/:session_prefix::se:_/+1/sharebutton?plusShare\u003dtrue\u0026usegapi\u003d1" }, "rbr_s": { "params": { "url": "" }, "url": ":socialhost:/:session_prefix::se:_/widget/render/recobarsimplescroller" }, ":source:": "3p", "playemm": { "url": "https://play.google.com/work/embedded/search?usegapi\u003d1\u0026usegapi\u003d1" }, "savetoandroidpay": { "url": "https://pay.google.com/gp/v/widget/save" }, "blogger": { "params": { "location": ["search", "hash"] }, "url": ":socialhost:/:session_prefix:_/widget/render/blogger?usegapi\u003d1", "methods": ["scroll", "openwindow"] }, "evwidget": { "params": { "url": "" }, "url": ":socialhost:/:session_prefix:_/events/widget?usegapi\u003d1" }, "partnersbadge": { "url": "https://www.gstatic.com/partners/badge/templates/badge.html?usegapi\u003d1" }, "dataconnector": { "url": "https://dataconnector.corp.google.com/:session_prefix:ui/widgetview?usegapi\u003d1" }, "surveyoptin": { "url": "https://www.google.com/shopping/customerreviews/optin?usegapi\u003d1" }, ":socialhost:": "https://apis.google.com", "shortlists": { "url": "" }, "hangout": { "url": "https://talkgadget.google.com/:session_prefix:talkgadget/_/widget" }, "plus_followers": { "params": { "url": "" }, "url": ":socialhost:/_/im/_/widget/render/plus/followers?usegapi\u003d1" }, "post": { "params": { "url": "" }, "url": ":socialhost:/:session_prefix::im_prefix:_/widget/render/post?usegapi\u003d1" }, ":gplus_url:": "https://plus.google.com", "signin": { "params": { "url": "" }, "url": ":socialhost:/:session_prefix:_/widget/render/signin?usegapi\u003d1", "methods": ["onauth"] }, "rbr_i": { "params": { "url": "" }, "url": ":socialhost:/:session_prefix::se:_/widget/render/recobarinvitation" }, "share": { "url": ":socialhost:/:session_prefix::im_prefix:_/widget/render/share?usegapi\u003d1" }, "plusone": { "params": { "count": "", "size": "", "url": "" }, "url": ":socialhost:/:session_prefix::se:_/+1/fastbutton?usegapi\u003d1" }, "comments": { "params": { "location": ["search", "hash"] }, "url": ":socialhost:/:session_prefix:_/widget/render/comments?usegapi\u003d1", "methods": ["scroll", "openwindow"] }, ":im_socialhost:": "https://plus.googleapis.com", "backdrop": { "url": "https://clients3.google.com/cast/chromecast/home/widget/backdrop?usegapi\u003d1" }, "visibility": { "params": { "url": "" }, "url": ":socialhost:/:session_prefix:_/widget/render/visibility?usegapi\u003d1" }, "autocomplete": { "params": { "url": "" }, "url": ":socialhost:/:session_prefix:_/widget/render/autocomplete" }, "additnow": { "url": "https://apis.google.com/marketplace/button?usegapi\u003d1", "methods": ["launchurl"] }, ":signuphost:": "https://plus.google.com", "ratingbadge": { "url": "https://www.google.com/shopping/customerreviews/badge?usegapi\u003d1" }, "appcirclepicker": { "url": ":socialhost:/:session_prefix:_/widget/render/appcirclepicker" }, "follow": { "url": ":socialhost:/:session_prefix:_/widget/render/follow?usegapi\u003d1" }, "community": { "url": ":ctx_socialhost:/:session_prefix::im_prefix:_/widget/render/community?usegapi\u003d1" }, "sharetoclassroom": { "url": "https://www.gstatic.com/classroom/sharewidget/widget_stable.html?usegapi\u003d1" }, "ytshare": { "params": { "url": "" }, "url": ":socialhost:/:session_prefix:_/widget/render/ytshare?usegapi\u003d1" }, "plus": { "url": ":socialhost:/:session_prefix:_/widget/render/badge?usegapi\u003d1" }, "family_creation": { "params": { "url": "" }, "url": "https://families.google.com/webcreation?usegapi\u003d1\u0026usegapi\u003d1" }, "commentcount": { "url": ":socialhost:/:session_prefix:_/widget/render/commentcount?usegapi\u003d1" }, "configurator": { "url": ":socialhost:/:session_prefix:_/plusbuttonconfigurator?usegapi\u003d1" }, "zoomableimage": { "url": "https://ssl.gstatic.com/microscope/embed/" }, "appfinder": { "url": "https://gsuite.google.com/:session_prefix:marketplace/appfinder?usegapi\u003d1" }, "savetowallet": { "url": "https://pay.google.com/gp/v/widget/save" }, "person": { "url": ":socialhost:/:session_prefix:_/widget/render/person?usegapi\u003d1" }, "savetodrive": { "url": "https://drive.google.com/savetodrivebutton?usegapi\u003d1", "methods": ["save"] }, "page": { "url": ":socialhost:/:session_prefix:_/widget/render/page?usegapi\u003d1" }, "card": { "url": ":socialhost:/:session_prefix:_/hovercard/card" } } }, "h": "m;/_/scs/apps-static/_/js/k\u003doz.gapi.en.cDdhVphf8T0.O/am\u003dwQc/d\u003d1/ct\u003dzgms/rs\u003dAGLTcCPgxnVLH-m1Wb1NpO4DLY9DNtv-bQ/m\u003d__features__", "u": "https://apis.google.com/js/api.js", "hee": true, "fp": "40e311032f69167abdbc28a2945cbe12bded4ed0", "dpo": false }, "fp": "40e311032f69167abdbc28a2945cbe12bded4ed0", "annotation": ["interactivepost", "recobar", "signin2", "autocomplete", "profile"], "bimodal": ["signin", "share"] } });

/*
 * Copyright (c) 2010 Nick Galbreath
 * http://code.google.com/p/stringencoders/source/browse/#svn/trunk/javascript
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/* base64 encode/decode compatible with window.btoa/atob
 *
 * window.atob/btoa is a Firefox extension to convert binary data (the "b")
 * to base64 (ascii, the "a").
 *
 * It is also found in Safari and Chrome.  It is not available in IE.
 *
 * if (!window.btoa) window.btoa = base64.encode
 * if (!window.atob) window.atob = base64.decode
 *
 * The original spec's for atob/btoa are a bit lacking
 * https://developer.mozilla.org/en/DOM/window.atob
 * https://developer.mozilla.org/en/DOM/window.btoa
 *
 * window.btoa and base64.encode takes a string where charCodeAt is [0,255]
 * If any character is not [0,255], then an DOMException(5) is thrown.
 *
 * window.atob and base64.decode take a base64-encoded string
 * If the input length is not a multiple of 4, or contains invalid characters
 *   then an DOMException(5) is thrown.
 */
var base64 = {};
base64.PADCHAR = '=';
base64.ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

base64.makeDOMException = function () {
    // sadly in FF,Safari,Chrome you can't make a DOMException
    var e, tmp;

    try {
        return new DOMException(DOMException.INVALID_CHARACTER_ERR);
    } catch (tmp) {
        // not available, just passback a duck-typed equiv
        // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Error
        // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Error/prototype
        var ex = new Error("DOM Exception 5");

        // ex.number and ex.description is IE-specific.
        ex.code = ex.number = 5;
        ex.name = ex.description = "INVALID_CHARACTER_ERR";

        // Safari/Chrome output format
        ex.toString = function () { return 'Error: ' + ex.name + ': ' + ex.message; };
        return ex;
    }
}

base64.getbyte64 = function (s, i) {
    // This is oddly fast, except on Chrome/V8.
    //  Minimal or no improvement in performance by using a
    //   object with properties mapping chars to value (eg. 'A': 0)
    var idx = base64.ALPHA.indexOf(s.charAt(i));
    if (idx === -1) {
        throw base64.makeDOMException();
    }
    return idx;
}

base64.decode = function (s) {
    // convert to string
    s = '' + s;
    var getbyte64 = base64.getbyte64;
    var pads, i, b10;
    var imax = s.length
    if (imax === 0) {
        return s;
    }

    if (imax % 4 !== 0) {
        throw base64.makeDOMException();
    }

    pads = 0
    if (s.charAt(imax - 1) === base64.PADCHAR) {
        pads = 1;
        if (s.charAt(imax - 2) === base64.PADCHAR) {
            pads = 2;
        }
        // either way, we want to ignore this last block
        imax -= 4;
    }

    var x = [];
    for (i = 0; i < imax; i += 4) {
        b10 = (getbyte64(s, i) << 18) | (getbyte64(s, i + 1) << 12) |
            (getbyte64(s, i + 2) << 6) | getbyte64(s, i + 3);
        x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff, b10 & 0xff));
    }

    switch (pads) {
        case 1:
            b10 = (getbyte64(s, i) << 18) | (getbyte64(s, i + 1) << 12) | (getbyte64(s, i + 2) << 6);
            x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff));
            break;
        case 2:
            b10 = (getbyte64(s, i) << 18) | (getbyte64(s, i + 1) << 12);
            x.push(String.fromCharCode(b10 >> 16));
            break;
    }
    return x.join('');
}

base64.getbyte = function (s, i) {
    var x = s.charCodeAt(i);
    if (x > 255) {
        throw base64.makeDOMException();
    }
    return x;
}

base64.encode = function (s) {
    if (arguments.length !== 1) {
        throw new SyntaxError("Not enough arguments");
    }
    var padchar = base64.PADCHAR;
    var alpha = base64.ALPHA;
    var getbyte = base64.getbyte;

    var i, b10;
    var x = [];

    // convert to string
    s = '' + s;

    var imax = s.length - s.length % 3;

    if (s.length === 0) {
        return s;
    }
    for (i = 0; i < imax; i += 3) {
        b10 = (getbyte(s, i) << 16) | (getbyte(s, i + 1) << 8) | getbyte(s, i + 2);
        x.push(alpha.charAt(b10 >> 18));
        x.push(alpha.charAt((b10 >> 12) & 0x3F));
        x.push(alpha.charAt((b10 >> 6) & 0x3f));
        x.push(alpha.charAt(b10 & 0x3f));
    }
    switch (s.length - imax) {
        case 1:
            b10 = getbyte(s, i) << 16;
            x.push(alpha.charAt(b10 >> 18) + alpha.charAt((b10 >> 12) & 0x3F) +
                padchar + padchar);
            break;
        case 2:
            b10 = (getbyte(s, i) << 16) | (getbyte(s, i + 1) << 8);
            x.push(alpha.charAt(b10 >> 18) + alpha.charAt((b10 >> 12) & 0x3F) +
                alpha.charAt((b10 >> 6) & 0x3f) + padchar);
            break;
    }
    return x.join('');
}