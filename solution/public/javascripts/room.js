let socket = io();
let reload = false;

function initRoom() {

    loadData();

    if (!reload) {
        socket.emit('create or join', roomNo, userName);
        storeImageData(roomNo, )
        reload = true;
    }

    document.getElementById('who_you_are').innerHTML = userName;
    document.getElementById('in_room').innerHTML= ' '+ roomNo;

    // socket communications
    socket.on('joined', function(room, userId){
        if (userId !== userName) {
            writeOnHistory('<b>' + userId + '</b>' + ' ' + 'joined room' + room);
        }
    });

    socket.on('chat', function(room, userId, chatText){
        let who = userId;
        if (userId === userName) who = 'Me';
        let text = '<b>' + who + '</b>' + ': ' + chatText;
        writeOnHistory(text);
        storeChatData(roomNo, text);
    });
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

async function loadData() {
    refreshChatHistory();

    // re-initiate global variables and retrieve data
    userName = localStorage.getItem('userName');
    roomNo = localStorage.getItem('room');
    image = localStorage.getItem('image');

    if (roomNo) {
        let cachedData;
        try {
            cachedData = await getCachedData(roomNo);
        } catch (err) {
            console.log(err)
        }

        if (cachedData.canvas) { // annotated
            initCanvas(socket, image, cachedData.canvas);
        }
        else if (image !== 'undefined') { // initialised
            initCanvas(socket, image);
        }
        else { // not inserted
            document.getElementById('annotation').style.display = 'none'
        }

        if (cachedData.kg) {
            for (let kg of cachedData.kg) {
                addRow(kg);
            }
        }

        if (cachedData.chatHistory) {
            for (let chat of cachedData.chatHistory) {
                writeOnHistory(chat, userName);
            }
        }

    }
}

function refreshChatHistory() {
    if (document.getElementById('history')!=null)
        document.getElementById('history').innerHTML='';
}

function goBack() {
    localStorage.clear();
    reload = false;
    window.location="/";
}