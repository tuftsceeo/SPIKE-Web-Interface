
const getCredentials = (id, callback) => {

    const BASEURL = "https://tuftssimplerobotics.herokuapp.com/api";

    const endpoint = "/credentials";
    const URLconcat = BASEURL + endpoint + "/" + id;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", URLconcat, true);

    xhr.send();

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);
            let key = response.key;
            callback(key);
        }
        else if (this.status == 400) {
            throw new Error(this.responseText);
        }
    };
}