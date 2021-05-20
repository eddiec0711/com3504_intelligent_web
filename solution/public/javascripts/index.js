let userName;
let roomNo;
let image;

/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
function init() {

    // check for service worker support
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(function(reg) {
            // registration worked
            console.log('Registration succeeded. Scope is ' + reg.scope);
        }).catch(function(error) {
            // registration failed
            console.log('Registration failed with ' + error);
        });
    }

    // check for db support
    if ('indexedDB' in window) {
        initDatabase();
    }
    else {
        console.log('This browser doesn\'t support IndexedDB');
    }

    // load image list
    getImgs(null);

    // load authors list
    getAuthors();
}

/**
 * called to generate a random room number
 * This is a simplification. A real world implementation would ask the server to generate a unique room number
 * so to make sure that the room number is not accidentally repeated across uses
 */
function generateRoom() {
    roomNo = Math.round(Math.random() * 10000);
    document.getElementById('roomNo').value = 'R' + roomNo;
}

/**
 * used to connect to a room
 * get input username, room number
 * and selected image
 */
function connectToRoom() {
    // variables definition
    roomNo = document.getElementById('roomNo').value;
    userName = document.getElementById('name').value;
    if (!userName) userName = 'Unknown-' + Math.random();
    image = getSelectedImg();

    if (roomNo) {
        localStorage.setItem('room', roomNo);
        localStorage.setItem('userName', userName);
        storeImageData(roomNo, image);
        window.location = "/room"
    }
}

function getSelectedImg() {
    let form = document.getElementById('loginForm');
    let checked = form.querySelector('input[name=selected]:checked');
    if (checked) {
        return checked.value;
    }
}


/**
 * called during onload()
 * allow filtering with author
 * retrieve all images in server
 */
function getImgs(author) {
    let data = {author: author}
    $.ajax({
        dataType: "json",
        url: '/get_images',
        data: data,
        type: "POST",
        success: function (dataR) {
            listImgs(dataR)
            console.log(dataR)
        },
        error: function (err) {
            console.log('Error: ' + err.status + ': ' + err.statusText);
        }
    });
}

/**
 * called in getPic()
 * show images retrieved
 */
function listImgs(records) {
    let container = document.getElementById('imageContainer')
    for (let record of records) {
        let blob = record.filepath;

        let img = document.createElement('img');
        let radio = document.createElement('input');
        let row = document.createElement('div');

        row.className = 'form-check border-bottom';

        radio.setAttribute('type', 'radio')
        radio.setAttribute('name', 'selected')
        radio.value = blob;

        img.setAttribute('id', 'picture');
        img.src = blob;

        row.appendChild(radio);
        row.appendChild(img);
        container.appendChild(row);
    }
}

function getAuthors() {
    $.ajax({
        dataType: "json",
        url: '/get_authors',
        type: "POST",
        success: function (dataR) {
            console.log(dataR)
            listAuthors(dataR);
        },
        error: function (err) {
            console.log('Error: ' + err.status + ': ' + err.statusText);
        }
    });
}

function listAuthors(authors) {
    let dropdown = document.getElementById('authorList')
    for (let author of authors) {
        let row = document.createElement('li');
        let name = document.createElement('a');

        name.className = "dropdown-item";
        name.innerHTML = author.author;

        row.appendChild(name);
        dropdown.appendChild(row);
    }
}

function toUpload() {
    window.location="/upload"
}
