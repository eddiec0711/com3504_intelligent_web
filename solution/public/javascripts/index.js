let userName;
let roomNo;
let imageUrl;
let socket= io();


/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
function init() {

    // setup interface to allow user to join room
    document.getElementById('initial_form').style.display = 'block';
    document.getElementById('chat_interface').style.display = 'none';


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

    // load data upon reloading the page
    loadData();

    // socket communications
    socket.on('joined', function(room, userId){
        if (userId === userName) {
            hideLoginInterface(room, userId);

            localStorage.setItem('room', room);
            localStorage.setItem('userName', userId);
            localStorage.setItem('image', imageUrl);
        }
        else {
            writeOnHistory('<b>' + userId + '</b>' + ' ' + 'joined room' + room);
        }
    });

    socket.on('chat', function(room, userId, chatText){
        let who = userId;
        if (userId === userName) who = 'Me';
        var text = '<b>' + who + '</b>' + ': ' + chatText;
        writeOnHistory(text);
        storeChatData(roomNo, text);
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
}

/**
 * used to connect to a room. It gets the user name and room number from the
 * interface
 */
function connectToRoom() {
    // variables definition
    roomNo = document.getElementById('roomNo').value;
    userName = document.getElementById('name').value;
    if (!userName) userName = 'Unknown-' + Math.random();
    imageUrl= document.getElementById('image_url').value;

    // setup room interface
    initCanvas(socket, imageUrl);
    hideLoginInterface(roomNo, userName);

    socket.emit('create or join', roomNo, userName);
}

/**
 * it appends the given html text to the history div
 * this is to be called when the socket receives the chat message (socket.on ('message'...)
 * @param text: the text to append
 */
function writeOnHistory(chatText) {
    // add new message to interface
    if (chatText==='') return;
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = chatText;
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

/**
 * hides chat interface and go back to initial form
 * reset localStorage to prevent reload
 */
function hideChatInterface() {
    document.getElementById('initial_form').style.display = 'block';
    document.getElementById('chat_interface').style.display = 'none';
    localStorage.clear();
}

async function loadData() {
    refreshChatHistory();

    // re-initiate global variables and retrieve data
    userName = localStorage.getItem('userName');
    roomNo = localStorage.getItem('room');
    imageUrl = localStorage.getItem('image');

    if (roomNo) {
        try {
            hideLoginInterface(roomNo, userName);

            let cachedData = await getCachedData(roomNo);

            initCanvas(socket, imageUrl, cachedData.canvas, true);

            for (let chat of cachedData.chatHistory) {
                writeOnHistory(chat, userName);
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


