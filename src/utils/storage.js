const storage = localStorage
export default {
    set(key, value) {
        storage.setItem(key, value)
    },
    get(key) {
        return storage.getItem(key)
    },
    remove(key) {
        storage.removeItem(key)
    }
}