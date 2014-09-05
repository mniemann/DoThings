
var newTodo;
var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var dueDate, todoContent, startX, startY, dataDis;
var todayView, tomorrowView, laterView, todayViewList, tomorrowViewList, laterViewList;
var todayAddButton, tomorrowAddButton, laterAddButton, todoStage, todoCal, textForm;
var helpView, notify, editFlag, editTodoId;

// get the touch starting point
function handleTouchStart(event) {
  var touches = event.changedTouches[0];
  startX = touches.pageX;
  startY = touches.pageY;
  event.preventDefault();
}

  // handle the end of a touch
function handleTouchEnd(event) {
  var touches = event.changedTouches[0];
  var distX = touches.pageX - startX;
  var distY = touches.pageY - startY;
  event.preventDefault();
  // this gets the todo ID for database access
  var todoId = parseInt(event.target.getAttribute("id"), 10);
  var tempList = document.getElementById(todoId);

  //a touch on an item marked done -> delete item
  if ((distX == 0) && (distY == 0)) {
    if (tempList.classList.contains("done")) {
      var objectStore = db.transaction(["todos"], "readwrite").objectStore("todos");
      tempList.parentNode.removeChild(tempList);
      var request = objectStore.delete(todoId);
      request.onsuccess = function(event) {
        console.log("Item deleted.");
      };
    }
    //a touch on any other item -> edit the item
    else {
      if (tempList.parentNode.id == "todayList") {
        tomorrowView.classList.add("hidden");
        laterView.classList.add("hidden");
        todayViewList.classList.add("hidden");
        todayAddButton.classList.add("hidden");
      }
      else if (tempList.parentNode.id == "tomorrowList") {
        todayView.classList.add("hidden");
        laterView.classList.add("hidden");
        tomorrowViewList.classList.add("hidden");
        tomorrowAddButton.classList.add("hidden");
      }
      else if (tempList.parentNode.id == "laterList") {
        todayView.classList.add("hidden");
        tomorrowView.classList.add("hidden");
        laterViewList.classList.add("hidden");
        laterAddButton.classList.add("hidden");
      }
      if (textForm.classList.contains("hidden")) {
        textForm.classList.remove("hidden");
      }
      var tempDate = new Date();
      dueDate = new Date(tempDate.getFullYear(),tempDate.getMonth(),tempDate.getDate());
      editFlag = 1;
      editTodoId = todoId;
      document.getElementById("todoText").value = tempList.innerHTML;
      }
    }
  // a swipe to right -> mark todo as done
  else if (((distX) > 100) && (Math.abs(distY) < 50)) {
    if (!tempList.classList.contains ("done")) {
      var objectStore = db.transaction(["todos"], "readwrite").objectStore("todos");
      var request = objectStore.get(todoId);
      request.onsuccess = function() {
        event.target.classList.add("done");
        var todo = request.result;
        todo.done = "yes";
        var requestUpdate = objectStore.put(todo);
        requestUpdate.onsuccess = function (){
          console.log("Item marked done.");
        };
      };
    }
  }
  // a swipe to left -> restore todo to not done
  else if (((distX) < -100) && (Math.abs(distY) < 50)) {
    if (tempList.classList.contains("done")) {
      var objectStore = db.transaction(["todos"], "readwrite").objectStore("todos");
      var request = objectStore.get(todoId);
      request.onsuccess = function() {
        event.target.classList.remove("done");
        var todo = request.result;
        todo.done = "no";
        var requestChange = objectStore.put(todo);
        requestChange.onsuccess = function (){
          console.log("Item restored.");
        };
      };
    }
  }
}

//show today's list
function toggleToday() {
  if (todayViewList.classList.contains("hidden")) {
    if (!textForm.classList.contains("hidden")) {
      document.getElementById("todoText").value = "";
      textForm.classList.add("hidden");
      todoStage.classList.add("hidden");
      dateDis.classList.add("hidden");
      todayAddButton.classList.remove("hidden");
      tomorrowView.classList.remove("hidden");
      laterView.classList.remove("hidden");

    }
    else {
      todayViewList.classList.remove("hidden");
    }
  }
  else {
    todayViewList.classList.add("hidden");
  }
}

//show tomorrow's list
function toggleTomorrow() {
  if (tomorrowViewList.classList.contains("hidden")) {
    if (!textForm.classList.contains("hidden")) {
      document.getElementById("todoText").value = "";
      textForm.classList.add("hidden");
      todoStage.classList.add("hidden");
      dateDis.classList.add("hidden");
      tomorrowAddButton.classList.remove("hidden");
      todayView.classList.remove("hidden");
      laterView.classList.remove("hidden");
    }
    else {
      tomorrowViewList.classList.remove("hidden");
    }
  }
  else {
    tomorrowViewList.classList.add("hidden");
  }
}

//show later list
function toggleLater() {
  if (laterViewList.classList.contains("hidden")) {
    if (!textForm.classList.contains("hidden")) {
      document.getElementById("todoText").value = "";
      textForm.classList.add("hidden");
      todoStage.classList.add("hidden");
      dateDis.classList.add("hidden");
      laterAddButton.classList.remove("hidden");
      todayView.classList.remove("hidden");
      tomorrowView.classList.remove("hidden");
    }
    else {
      laterViewList.classList.remove("hidden");
    }
  }
  else {
    laterViewList.classList.add("hidden");
  }
}

//function that allows user to enter a new todo
function addToday() {
  tomorrowView.classList.add("hidden");
  laterView.classList.add("hidden");
  todayViewList.classList.add("hidden");
  todayAddButton.classList.add("hidden");
  helpIcon.classList.add("hidden");
  if (textForm.classList.contains("hidden")) {
    textForm.classList.remove("hidden");
  }
  var tempDate = new Date();
  dueDate = new Date(tempDate.getFullYear(),tempDate.getMonth(),tempDate.getDate());
}

//function that allows the user to enter a new todo for tomorrow
function addTomorrow() {
  todayView.classList.add("hidden");
  laterView.classList.add("hidden");
  tomorrowViewList.classList.add("hidden");
  tomorrowAddButton.classList.add("hidden");
  if (textForm.classList.contains("hidden")) {
    textForm.classList.remove("hidden");
  }
  var tempDate = new Date();
  tempDate.setDate(tempDate.getDate() + 1);
  dueDate = new Date(tempDate.getFullYear(),tempDate.getMonth(),tempDate.getDate());
}

function addLater() {
  todayView.classList.add("hidden");
  tomorrowView.classList.add("hidden");
  laterViewList.classList.add("hidden");
  laterAddButton.classList.add("hidden");
  if (textForm.classList.contains("hidden")) {
    textForm.classList.remove("hidden");
  }
  tempDate = new Date();
  tempDate.setDate(tempDate.getDate() + 2);
  dueDate = new Date(tempDate.getFullYear(),tempDate.getMonth(),tempDate.getDate());
}

//function thats fired when a new todo title has been entered
function textChanged() {
  var dayOfWeek = days[dueDate.getDay()];
  var dayOfMonth = dueDate.getDate();
  var curYear = dueDate.getFullYear();
  var curMonth = dueDate.getMonth() + 1;
  document.getElementById("curDateDisplay").innerHTML = dayOfWeek+", "+curMonth+"/"+dayOfMonth+"/"+curYear;
  dateDis.classList.remove("hidden");
}

//function that opens the date picker
function openDatePicker () {
  if (dateDis.classList.contains("hidden")) {
    var dayOfWeek = days[dueDate.getDay()];
    var dayOfMonth = dueDate.getDate();
    var curYear = dueDate.getFullYear();
    var curMonth = dueDate.getMonth() + 1;
    document.getElementById("curDateDisplay").innerHTML = dayOfWeek+", "+curMonth+"/"+dayOfMonth+"/"+curYear;
    dateDis.classList.remove("hidden");
  }
  todoStage.classList.remove("hidden");
  todoCal.addEventListener("datetap", function(e){
    dueDate = e.detail.date;
    dayOfWeek = days[dueDate.getDay()];
    dayOfMonth = dueDate.getDate();
    curYear = dueDate.getFullYear();
    curMonth = dueDate.getMonth() + 1;
    document.getElementById("curDateDisplay").innerHTML = dayOfWeek+", "+curMonth+"/"+dayOfMonth+"/"+curYear;
  });
}

//function that saves the todo
function saveTodo() {
  var objectStore = db.transaction(["todos"], "readwrite").objectStore("todos");
  if (editFlag == 1) {
    var request = objectStore.get(editTodoId);
    request.onerror = function(event) {
      console.log("getting previous todo failed.", error);
    };
    request.onsuccess = function(event) {
      var altTodo = request.result;
      altTodo.title = document.getElementById("todoText").value;
      altTodo.due = dueDate;
      var updateRequest = objectStore.put(altTodo);
      updateRequest.onerror = function(event) {
        console.log("updating todo failed.", event);
      };
      updateRequest.onsuccess = function() {
        console.log("todo changed successfully");
        editFlag = 0;
        document.getElementById("todoText").value = "";
        textForm.classList.add("hidden");
        todoStage.classList.add("hidden");
        dateDis.classList.add("hidden");
        showAllLists();
        refreshTodoList();
      };
    };
  }
  else {
    newTodo = new Todo();
    newTodo.due = dueDate;
    newTodo.title = document.getElementById("todoText").value;
    newTodo.done = "no";
    newTodo.folder = "Personal";
    var request = objectStore.add(newTodo);
    request.onsuccess = function(event) {
      console.log("New item added/changed.");
      document.getElementById("todoText").value = "";
      textForm.classList.add("hidden");
      todoStage.classList.add("hidden");
      dateDis.classList.add("hidden");
      showAllLists();
      refreshTodoList();
    };
    request.onerror = function(event) {
      console.log("error adding new todo", event);
    };
  }
}

function showAllLists() {
  todayView.classList.remove("hidden");
  todayAddButton.classList.remove("hidden");
  tomorrowView.classList.remove("hidden");
  tomorrowAddButton.classList.remove("hidden");
  laterView.classList.remove("hidden");
  laterAddButton.classList.remove("hidden");
}

function showHelp() {
  var showScreen = document.getElementById("helpScreen");
  showScreen.classList.remove("hidden");
  showScreen.style.left = "0px";
}

function hideHelp() {
  //  helpView.classList.add("hidden");
  var showScreen = document.getElementById("helpScreen");
  showScreen.style.left = window.innerWidth.toString() + "px";
  showScreen.classList.add("hidden");
}

// the refreshTodoList function populates the lists when the app starts and updates
function refreshTodoList() {

//checking to see if the database is open
  if (!db) {
    console.log("Database is not ready yet");
    setTimeout(refreshTodoList, 1000);
    return;
  }
  console.log("Refreshing dodo list");
  var todayContainer = document.getElementById("todayList");
  var tomorrowContainer = document.getElementById("tomorrowList");
  var laterContainer = document.getElementById("laterList");

  //stripping empty list items from the todo lists
  while (todayContainer.hasChildNodes()) {
    todayContainer.removeChild(todayContainer.lastChild);
  }
  while (tomorrowContainer.hasChildNodes()) {
    tomorrowContainer.removeChild(tomorrowContainer.lastChild);
  }
  while (laterContainer.hasChildNodes()) {
    laterContainer.removeChild(laterContainer.lastChild);
  }
//get the db content and process according to date
  var objectStore = db.transaction("todos").objectStore("todos");
  objectStore.openCursor().onsuccess = function(event) {
    var cursor = event.target.result;
    if (cursor) {
      //get the information from the database
      var tdTitle = cursor.value.title;
      var dueDate = cursor.value.due;
      var tdDone = cursor.value.done;
      //get the current dates to compare due dates.
      var tempD = new Date();
      var today = new Date(tempD.getFullYear(),tempD.getMonth(),tempD.getDate());
      tempD.setDate(tempD.getDate() + 1);
      var tomorrow = new Date(tempD.getFullYear(),tempD.getMonth(),tempD.getDate());
      //create the list item for each todo
      var listItem = document.createElement("li");
      //set the list item ID to the database ID to later identify the item for update or delete
      listItem.setAttribute("id", cursor.value.id);
      //set overdue item
      if (today.getTime() > dueDate.getTime()) {
          listItem.style.listStyleImage = "url('icons/marker.png')";
        }
      var listItemTitle = document.createTextNode(tdTitle);
      listItem.appendChild(listItemTitle);
      //add the eventlisteners to each list item for future processing
      listItem.addEventListener("touchstart", handleTouchStart);
      listItem.addEventListener("touchend", handleTouchEnd);
      //sort list items based on due dates
      if (today.getTime() == dueDate.getTime() || (dueDate.getTime() < today.getTime()) ) {
        todayContainer.appendChild(listItem);
        if (tdDone != "no") {listItem.classList.add("done");}
      }
      else if (dueDate.getTime() == tomorrow.getTime()) {
        tomorrowContainer.appendChild(listItem);
        if (tdDone != "no") {listItem.classList.add("done");}
      }
      else if (dueDate.getTime() > tomorrow.getTime()) {
        laterContainer.appendChild(listItem);
        if (tdDone != "no") {listItem.classList.add("done");}
      }
      cursor.continue();
    }
    else {
      console.log("All items found.");
    }
  }
}

function handleVisibilityChange () {
  if (!document.hidden) {
    document.location.reload(true);
  }
}

//this starts the whole program
window.onload = function() {
  //create views of the titles
  todayView = document.getElementById("today");
  tomorrowView = document.getElementById("tomorrow");
  laterView = document.getElementById("later");

  //views of the todo lists
  todayViewList = document.getElementById("todo-today");
  tomorrowViewList = document.getElementById("todo-tomorrow");
  laterViewList = document.getElementById("todo-later");

  //views of add buttons
  todayAddButton = document.getElementById("todayAdd");
  tomorrowAddButton = document.getElementById("tomorrowAdd");
  laterAddButton = document.getElementById("laterAdd");

  //view of the calendar section
  todoStage = document.getElementById("dateSelection");
  todoCal = todoStage.querySelector("x-calendar");

  //view of the text entry form
  textForm = document.getElementById("textEntry");

  //make sure the place holder text appears
  document.getElementById("todoText").value = "";

  //display the date selection div
  dateDis = document.getElementById("dateDisplay");

  //the help screen
  helpView = document.getElementById("helpScreen");
  helpIcon = document.getElementById("help");

  //hiding all the lists for start up
  todayViewList.classList.add("hidden");
  tomorrowViewList.classList.add("hidden");
  laterViewList.classList.add("hidden");

  //event listeners for showing the lists
  document.getElementById("todayshow").addEventListener("click", toggleToday);
  document.getElementById("tomorrowshow").addEventListener("click", toggleTomorrow);
  document.getElementById("latershow").addEventListener("click", toggleLater);

  //event listeners for adding new todos
  todayAddButton.addEventListener("click", addToday);
  tomorrowAddButton.addEventListener("click", addTomorrow);
  laterAddButton.addEventListener("click", addLater);

  //event listeners to save a new todo
  document.getElementById("todoAdd").addEventListener("click", saveTodo);
  document.getElementById("todoText").addEventListener("input", textChanged);

  //event listener to display the date picker
  document.getElementById("when").addEventListener("click", openDatePicker);

  //event listeners for help screen and the plan you day screen
//  document.getElementById("now").addEventListener("click", planDay);
  helpIcon.addEventListener("click", showHelp);
  helpView.addEventListener("click", hideHelp);


//get the show started
  editFlag = 0;
  document.addEventListener("visibilitychange", handleVisibilityChange);
  refreshTodoList();
};

//Close database when app quits
window.onclose = function(){
  showAllLists();
  db.close;
};
