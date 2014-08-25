// initialize the whole database system
var db;
var dbName = "todos";
var dbVersion = 1;

var request = indexedDB.open(dbName, dbVersion);

request.onerror = function (event) {
  console.log("Database didn't open.", event);
};
request.onsuccess = function (event) {
  console.log("Database opened.");
  db = event.target.result;
};

request.onupgradeneeded = function (event) {

  console.log("Running onupgradeneeded");

  var db = event.target.result;

  if (!db.objectStoreNames.contains("todos")) {
    console.log("Creating objectStore for todos");

    var objectStore = db.createObjectStore("todos", {keyPath: "id", autoIncrement: true });
    objectStore.createIndex("title", "title", {unique: false});
    objectStore.createIndex("due", "due", {unique: false});
    objectStore.createIndex("done", "done", {unique: false});
    objectStore.createIndex("folder", "folder", {unique: false});
    console.log("objectstore is ready");

    var sampleTodo1 = new Todo();
    sampleTodo1.title = "Something to do today.";
    objectStore.add(sampleTodo1);
  }
};

// create a new todo object
function Todo() {
  this.title = "Untitled task";
  var tempDate = new Date();
  this.due = new Date(tempDate.getFullYear(),tempDate.getMonth(),tempDate.getDate());
  this.done = "no";
  this.folder = "Personal";
}
