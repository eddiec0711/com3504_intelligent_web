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
    return checked.value;
}


/**
 * called during onload()
 * allow filtering with author
 * retrieve all images in server
 */
function getImgs(author) {
    $.ajax({
        dataType: "json",
        url: '/get_image',
        data: author,
        type: "POST",
        success: function (dataR) {
            listImgs(dataR.file)
        },
        error: function (err) {
            console.log('Error: ' + err.status + ':' + err.statusText);
        }
    });
}

/**
 * called in getPic()
 * show images retrieved
 */
function listImgs(blobs) {
    let container = document.getElementById('imageContainer')
    for (let blob of blobs) {
        let img = document.createElement('img');
        let radio = document.createElement('input');
        let row = document.createElement('div');

        row.className = 'form-check border-bottom';

        radio.setAttribute('type', 'radio')
        radio.setAttribute('name', 'selected')
        radio.value = blob;

        img.setAttribute('id', 'picture');
        img.width = 300;
        img.src = blob;

        row.appendChild(radio);
        row.appendChild(img);
        container.appendChild(row);
    }
    $('input[name="selected"]').first().prop('checked', true)

}

function toUpload() {
    window.location="/upload"
}
