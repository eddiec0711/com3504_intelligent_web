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

    // load all images and authors
    getImages(null);
}

/**
 * generate random room number
 */
function generateRoom() {
    roomNo = Math.round(Math.random() * 10000);
    document.getElementById('roomNo').value = 'R' + roomNo;
}

/**
 * connect user to room
 * add simple data to localStorage
 */
async function connectToRoom() {
    // variables definition
    roomNo = document.getElementById('roomNo').value;
    userName = document.getElementById('name').value;
    if (!userName) userName = 'Unknown-' + Math.random();
    let imageUrl = document.getElementById('imageUrl').value

    // load image information to init indexeddb
    let imageData;
    if (imageUrl) { // url supplied
        imageData = {filepath: imageUrl};
    }
    else if (getSelectedImg()) { // chosen server image
        imageData = JSON.parse(getSelectedImg());
    }

    if (roomNo) {
        // key values stored in localStorage temporarily
        localStorage.setItem('room', roomNo);
        localStorage.setItem('userName', userName);

        await storeChatData(roomNo + userName, []);
        if (imageData) {
            await storeImageData(roomNo + userName, imageData);
        }

        window.location = "/room"
    }
    else {
        alert('Room number missing')
    }
}

/**
 * get selected image to create room
 */
function getSelectedImg() {
    let form = document.getElementById('loginForm');
    let checked = form.querySelector('input[name=selected]:checked');
    if (checked) {
        return checked.value;
    }
}

/**
 * ajax query to retrieve image records
 * return all images if no author selected - called in init()
 * @param author
 */
function getImages(author) {
    let data = {author: author}
    $.ajax({
        dataType: "json",
        url: '/get_images',
        data: data,
        type: "POST",
        success: function (dataR) {
            listImages(dataR)
            if (!author) {
                listAuthors(dataR);
            }
        },
        error: function (err) {
            console.log('Error: ' + err.status + ': ' + err.statusText);
        }
    });
}

/**
 * generate row interface from getImages()
 */
function listImages(records) {
    let container = document.getElementById('imageContainer')
    container.innerHTML = '';
    for (let record of records) {
        let blob = record.filepath;

        let img = document.createElement('img');
        let radio = document.createElement('input');
        let row = document.createElement('div');
        let label1 = document.createElement('label');
        let label2 = document.createElement('label');

        row.className = 'form-check border-bottom';

        radio.setAttribute('type', 'radio')
        radio.setAttribute('name', 'selected')
        radio.value = JSON.stringify(record);

        img.setAttribute('id', 'picture');
        img.src = blob;

        label1.className = 'form-label p-3';
        label1.innerHTML = 'Title: ' + record.title;
        label2.className = 'form-label p-3';
        label2.innerHTML = 'Author: ' + record.author;

        row.appendChild(radio);
        row.appendChild(img);
        row.appendChild(label1);
        row.appendChild(label2);
        container.appendChild(row);
    }
}

/**
 * generate dropdown interface for author list
 */
function listAuthors(authors) {
    let dropdown = document.getElementById('authorList')
    let records = [...new Set(authors.map(a => a.author))];

    for (let author of records) {

        let row = document.createElement('li');
        let name = document.createElement('div');

        name.className = "dropdown-item";
        name.innerHTML = author;
        name.onclick = function() {
            document.getElementById('author').innerHTML = author;
            getImages(author);
        }

        row.appendChild(name);
        dropdown.appendChild(row);
    }
}

/**
 * redirect page
 */
function toUpload() {
    window.location="/upload"
}
