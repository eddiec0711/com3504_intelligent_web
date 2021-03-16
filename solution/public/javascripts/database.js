let db;

const CHAT_DB_NAME= 'db_chatroom';
const CHAT_STORE_NAME= 'store_chat';

/**
 * it inits the database
 */
async function initDatabase(){
    if (!db) {
        db = await idb.openDB(CHAT_DB_NAME, 2, {
            upgrade(upgradeDb, oldVersion, newVersion) {
                if (!upgradeDb.objectStoreNames.contains(CHAT_STORE_NAME)) {
                    let chatDB = upgradeDb.createObjectStore(CHAT_STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    chatDB.createIndex('room', 'room', {unique: false});
                    chatDB.createIndex('image', 'image', {unique: false});
                    chatDB.createIndex('chatHistory', 'chatHistory', {unique: false, multiEntry: true});
                }
            }
        });
        console.log('db created');
    }
}

/**
 * it saves the content for a chat in localStorage
 * @param room
 * @param chatObject
 */
async function storeCachedData(roomNo, imageUrl, chatText) {
    console.log('inserting: '+ chatText );
    if (!db)
        await initDatabase();
    if (db) {
        try{
            let tx = await db.transaction(CHAT_STORE_NAME, 'readwrite');
            let store = await tx.objectStore(CHAT_STORE_NAME);
            let index = await store.index('room');
            let record = await index.get([roomNo, imageUrl]);
            if (record === undefined) {
                await store.put({room: roomNo, image: imageUrl, chatHistory: [chatText]})
                console.log("chatroom initialized")
            } else {
                record.chatHistory = record.chatHistory.concat(chatText);
                await store.put(record)
            }
            await tx.complete;
        } catch(error) {
            console.log(error);
            // localStorage.setItem(roomNo, JSON.stringify(chatText));
        };
    }
    else localStorage.setItem(roomNo, JSON.stringify(chatText));
}

/**
 * it retrieves the chat data for a room from the database
 * @param room
 * @param image
 * @returns {*}
 */
async function getCachedData(roomNo, imageUrl) {
    if (!db)
        await initDatabase();
    if (db) {
        try {
            console.log('fetching: ' + roomNo);
            let tx = db.transaction(CHAT_STORE_NAME, 'readonly');
            let store = await tx.objectStore(CHAT_STORE_NAME);
            let index = await store.index('room', 'imageUrl');
            let readingsList = await index.get([roomNo, imageUrl]);
            await tx.complete;
            let finalResults=[];
            if (readingsList && readingsList.length > 0) {
                finalResults.push(readingsList);
                return finalResults;
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        const value = localStorage.getItem(roomNo);
        let finalResults=[];
        if (value == null)
            return finalResults;
        else finalResults.push(value);
        return finalResults;
    }
}
