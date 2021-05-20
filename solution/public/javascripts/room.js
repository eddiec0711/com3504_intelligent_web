let socket = io();

function initRoom() {

    loadData();

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
    socket.emit('create or join', roomNo, userName);

    if (roomNo) {
        try {
            let cachedData = await getCachedData(roomNo);
            console.log(cachedData)

            if (cachedData.image) {
                if (cachedData.image.canvas) {
                    initCanvas(socket, cachedData.image, true);
                }
                else {
                    initCanvas(socket, cachedData.image, false);
                }
            }
            else {
                document.getElementById('annotation').style.display = 'none';
            }

            if (cachedData.chatHistory) {
                for (let chat of cachedData.chatHistory) {
                    writeOnHistory(chat, userName);
                }
            }

            if (cachedData.kg) {
                graphs = cachedData.kg;
                for (let kg of cachedData.kg) {
                    addRow(kg);
                }
            }

        } catch (err) {
            console.log(err);
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