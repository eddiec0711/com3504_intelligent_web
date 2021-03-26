let userName = null;
let roomNo = null;
let imageUrl = null;
let socket= io();

let camera = null;
//let canvas = null;
let localMediaStream = null;
let ctx;

/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
function init() {

    // it sets up the interface so that userId and room are selected
    document.getElementById('initial_form').style.display = 'block';
    document.getElementById('chat_interface').style.display = 'none';

    socket.on('joined', function(room, userId){
        if (userId === userName) {
            hideLoginInterface(room, userId);
        }
        else {
            writeOnHistory('<b>' + userId + ' ' + '</b>' + 'joined room ' + room);
        }
        localStorage.setItem('room', room);
        localStorage.setItem('userName', userId);
    });

    socket.on('chat', function(room, userId, chatText){
        let who = userId;
        if (userId === userName) who = 'Me';

        var text = '<b>' + who + ': ' +'</b>' + chatText;
        writeOnHistory(text);
        storeCachedData(roomNo, imageUrl, text);
    });

    //check for db support
    if ('indexedDB' in window) {
        initDatabase();
    }
    else {
        console.log('This browser doesn\'t support IndexedDB');
    }
    loadData();
}

function takePic() {
    prepareVideo();
    document.getElementById('shotBtn').style.display = 'none';
    document.getElementById('uploadBtn').style.display = 'none';
    camera.style.display = 'block';
    canvas.style.display = 'none';
}

function prepareVideo() {
    camera = document.getElementById('cam');
    canvas = document.getElementById('frame');
    ctx = canvas.getContext('2d');
    camera.addEventListener('click', snapshot, false);
    navigator.getUserMedia({video: {facingMode: 'user'}}, function(stream) {
        // video.src = window.URL.createObjectURL(stream);
        camera.srcObject = stream;
        localMediaStream = stream;
    }, errorCallback);
}

function errorCallback() {console.log('error');}

function snapshot() {
    if (localMediaStream) {
        canvas.style.display = 'block';
        ctx.drawImage(camera, 0, 0);
        // document.getElementById('photo').src = canvas.toDataURL('image/png');
        camera.style.display = 'none';
        document.getElementById('shotBtn').style.display = 'block';
        document.getElementById('uploadBtn').style.display = 'block';
    }
}

function savePic() {
    console.log('saving picture');
}

function sendImage(userId, imageBlob) {
    var data = {userId: userId, imageBlob: imageBlob};
    $.ajax({
        dataType: "json",
        url: '/uploadpicture',
        type: "POST",
        data: data,
        success: function (data) {
            token = data.token;
            // go to next picture taking
            location.reload();
        },
        error: function (err) {
            alert('Error: ' + err.status + ':' + err.statusText);
        }
    });
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
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via  socket
 */
function sendChatText() {
    let chatText = document.getElementById('chat_input').value;
    socket.emit('chat', roomNo, userName, chatText);
    console.log("sending message: " + chatText);
}

/**
 * used to connect to a room. It gets the user name and room number from the
 * interface
 */
function connectToRoom() {
    roomNo = document.getElementById('roomNo').value;
    userName = document.getElementById('name').value;
    imageUrl= document.getElementById('image_url').value;
    if (!userName) userName = 'Unknown-' + Math.random();
    socket.emit('create or join', roomNo, userName);
    initCanvas(socket, imageUrl);
    hideLoginInterface(roomNo, userName);
}

/**
 * it appends the given html text to the history div
 * this is to be called when the socket receives the chat message (socket.on ('message'...)
 * @param text: the text to append
 */
function writeOnHistory(text) {
    console.log("Sending history " + text);
    if (text==='') return;
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);

    // scroll to the last element
    history.scrollTop = history.scrollHeight;
    document.getElementById('chat_input').value = '';
}

/**
 * it hides the initial form and shows the chat
 * @param room the selected room
 * @param userId the user name
 */
function hideLoginInterface(room, userId) {
    document.getElementById('initial_form').style.display = 'none';
    document.getElementById('chat_interface').style.display = 'block';
    document.getElementById('who_you_are').innerHTML= userId;
    document.getElementById('in_room').innerHTML= ' '+room;
}

async function loadData() {
    refreshChatHistory();
    var user = localStorage.getItem('userName');
    var room = localStorage.getItem('room');
    if (room) {
        try {
            let cachedData = await getCachedData(room);
            hideLoginInterface(room, user);
            for (let chat of cachedData.chatHistory) {
                writeOnHistory(chat);
            }
        } catch (error) {
            console.log(error);
        }
    }
}

function refreshChatHistory() {
    if (document.getElementById('history')!=null)
        document.getElementById('history').innerHTML='';
}


