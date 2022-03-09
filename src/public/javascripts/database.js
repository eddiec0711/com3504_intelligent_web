let G11DB;

const CHAT_DB_NAME= 'db_chatroom';
const CHAT_STORE_NAME= 'store_chat';

/**
 * inits indexeddb
 * called in homepage
 */
async function initDatabase(){
    if (!G11DB) {
        G11DB = await idb.openDB(CHAT_DB_NAME, 1, {
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
        console.log('G11 indexedDB created');
    }
}

/**
 * store chat data
 * initialise room when user enter one
 * @param roomNo
 * @param chatText
 */
async function storeChatData(roomNo, chatText) {
    if (!G11DB)
        await initDatabase();
    if (G11DB) {
        try {
            let tx = await G11DB.transaction(CHAT_STORE_NAME, 'readwrite');
            let store = await tx.objectStore(CHAT_STORE_NAME);
            let index = await store.index('room');
            let record = await index.get(roomNo);

            if (!record) {
                record = {room: roomNo, chatHistory: []};
            }
            else {
                record.chatHistory = record.chatHistory.concat(chatText);
            }
            console.log(record);

            await store.put(record)
            await tx.complete;
        } catch(error) {
            console.log(error);
        };
    }
}

/**
 * initialise image when user enter room
 * - detailed data from server / image url
 *
 * or
 *
 * update image canvas when user draw
 * - canvas (annotated image)
 *
 * @param roomNo
 * @param imageData
 */
async function storeImageData(roomNo, imageData) {
    if (!G11DB)
        await initDatabase();
    if (G11DB) {
        try {
            let tx = await G11DB.transaction(CHAT_STORE_NAME, 'readwrite');
            let store = await tx.objectStore(CHAT_STORE_NAME);
            let index = await store.index('room');
            let record = await index.get(roomNo);

            if (!record) {
                record = {room: roomNo, image: imageData}
            }
            else if (!record.image) {
                record.image = imageData;
            }
            else {
                record.image.canvas = imageData.canvas;
            }
            console.log(record);

            await store.put(record);
            await tx.complete;
        } catch (error) {
            console.log(error);
        }
    }
}

/**
 * store knowledge graph data
 * @param roomNo
 * @param chatText
 */
async function storeKGData(roomNo, kgData) {
    if (!G11DB)
        await initDatabase();
    if (G11DB) {
        try {
            let tx = await G11DB.transaction(CHAT_STORE_NAME, 'readwrite');
            let store = await tx.objectStore(CHAT_STORE_NAME);
            let index = await store.index('room');
            let record = await index.get(roomNo);

            if (!record) {
                record = {room: roomNo, kg: kgData};
            }
            if (!record.kg) {
                record.kg = [kgData];
            }
            else {
                record.kg = record.kg.concat(kgData);
            }
            console.log(record)

            await store.put(record)
            await tx.complete;
        } catch(error) {
            console.log(error);
        };
    }
}

/**
 * clear knowledge graph
 * @param roomNo
 * @returns {Promise<void>}
 */
async function clearKGData(roomNo) {
    if (!G11DB)
        await initDatabase();
    try {
        let tx = await G11DB.transaction(CHAT_STORE_NAME, 'readwrite');
        let store = await tx.objectStore(CHAT_STORE_NAME);
        let index = await store.index('room');
        let record = await index.get(roomNo);

        if (record.kg) {
            record.kg = [];
        }

        await store.put(record);
        await tx.complete;
    } catch(error) {
        console.log(error);
    }
}


/**
 * return room data
 * @param roomNo
 * @returns {Promise<*>}
 */
async function getCachedData(roomNo) {
    if (!G11DB)
        await initDatabase();
    try {
        console.log('fetching ' + roomNo);
        let tx = G11DB.transaction(CHAT_STORE_NAME, 'readonly');
        let store = await tx.objectStore(CHAT_STORE_NAME);
        let index = await store.index('room');
        let record = await index.get(roomNo);

        await tx.complete;
        return record;
    } catch (error) {
        console.log(error);
    }
}
