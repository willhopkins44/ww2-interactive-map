export async function ajaxRequest(path) {
    let xhttp = new XMLHttpRequest();

    return new Promise( (resolve, reject) => {
        xhttp.onload = () => {
            if (xhttp.status == 200) {
                resolve(xhttp.responseText);
            } else {
                reject('Error ' + xhttp.status);
            }
        }

        xhttp.open('GET', path);
        xhttp.send();
    })
}

export async function ajaxPost() {
    let xhttp = new XMLHttpRequest();

    return new Promise ( (resolve, reject) => {
        xhttp.onload = () => {
            if (xhttp.status == 200) {
                resolve(xhttp.responseText);
            } else {
                reject('Error ' + xhttp.status);
            }
        }

        xhttp.open('POST', process.env.host + '/post')
        xhttp.send();
    })
}