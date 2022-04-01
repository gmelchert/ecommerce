window.indexedDB = window.indexedDB
window.IDBTransaction = window.IDBTransaction
window.IDBKeyRange = window.IDBKeyRange

var db
const idb = window.indexedDB.open('idb', 1)

idb.onsuccess = event => {
    db = event.target.result
    //console.log(event)
}

idb.onerror = event => {
    //console.log(event)
}

idb.onupgradeneeded = event => {
    db = event.target.result
    const tabelas = ['carrinho']
    const chaves = ['id']
    tabelas.forEach((e, i) => db.createObjectStore(e, { keyPath: chaves[i], autoIncrement: true }))
}

/**
 * @param {coluna} col 
 * @param {valores} obj 
 */
function writeDB(col, obj) {
    const transaction = db.transaction([col], 'readwrite')
    const objectStore = transaction.objectStore(col)
    const request = objectStore.put(obj)
    return request.complete
}

async function readDB(col) {
    return new Promise((resolve, reject) => {
        try {
            const transaction = db.transaction([col], 'readonly')
            const objectStore = transaction.objectStore(col)
            const request = objectStore.getAll()
            request.onsuccess = e => {
                resolve(e.target.result)
            }
        } catch (err) {
            throw err
        }
    })
    
}

function deleteDB(col, id) {
    const transaction = db.transaction([col], 'readwrite')
    const objectStore = transaction.objectStore(col)
    const request = objectStore.delete(id)
    return request.complete
}

