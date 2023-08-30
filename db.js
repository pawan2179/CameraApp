let openRequest = indexedDB.open("myDatabase");
let db;

openRequest.addEventListener("success", (event) => {
    db = openRequest.result;
});

openRequest.addEventListener("error", (event) => {

});

openRequest.addEventListener("upgradeneeded", (event) => {
    db = openRequest.result;

    db.createObjectStore("video", {keyPath: "id"});
    db.createObjectStore("image", {keyPath: "id"});
});
