let db;

const CHAT_DB_NAME= 'db_chatroom';
const CHAT_STORE_NAME= 'store_chat';

/**
 * it inits the database
 */
async function initDatabase(){
    if (!db) {
        db = await idb.openDB(CHAT_DB_NAME, 1, {
            upgrade(upgradeDb, oldVersion, newVersion) {
                if (!upgradeDb.objectStoreNames.contains(CHAT_STORE_NAME)) {
                    let chatDB = upgradeDb.createObjectStore(CHAT_STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    chatDB.createIndex('room', 'room', {unique: false});
                }
            }
        });
        console.log('db created');
    }
}

/**
 * it saves the content for a room in localStorage
 * @param room
 * @param chatObject
 */
async function storeCachedData(roomNo, imageUrl, chatText) {
    if (!db)
        await initDatabase();
    if (db) {
        try{
            let tx = await db.transaction(CHAT_STORE_NAME, 'readwrite');
            let store = await tx.objectStore(CHAT_STORE_NAME);
            let index = await store.index('room');
            let record = await index.get(roomNo);

            if (record === undefined) {
                await store.put({room: roomNo, image: imageUrl, chatHistory: [chatText]})
            } else {
                record.chatHistory = record.chatHistory.concat(chatText);
                await store.put(record)
            }
            await tx.complete;
        } catch(error) {
            console.log(error);
        };
    }
}

/**
 * it retrieves the chat data for a room from the database
 * @param room\
 * @returns {*}
 */
async function getCachedData(roomNo) {
    if (!db)
        await initDatabase();
    if (db) {
        console.log('fetching ' + roomNo);
        try {
            let tx = db.transaction(CHAT_STORE_NAME, 'readonly');
            let store = await tx.objectStore(CHAT_STORE_NAME);
            let index = await store.index('room');
            let record = await index.get(roomNo);
            await tx.complete;
            return record;
        } catch (error) {
            console.log(error);
        }
    }
}
