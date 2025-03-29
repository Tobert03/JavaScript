
const addButton = document.getElementById('addTodo');         
const taskInput = document.getElementById('Textfeld');        //hier werden const aus den HTML Objekten erstellt, damit man sie hier verwenden kann
const todoList = document.getElementById('todolist');


loadTasks();

function addTask(){

  const task = taskInput.value.trim();   //neue const task = der input aus dem Textfeld (trim entfernt leere Zeichen)

  if (task) {

    createTaskElement(task);             

    taskInput.value = '';               // Textfeld wird geleert

    saveTasks()
  }
}

addButton.addEventListener('click', addTask)     // bei einem Klick auf den Button wird die Funktion "addTask" ausgeführt

function createTaskElement(task){

  const listItem = document.createElement('li');    //neue const "listItem" wird erstellt und ist ein 'li' Element  (list item Element)
  listItem.textContent = task;                      // der Inhalt von listItem = task (der inhalt aus dem Textfeld)

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Löschen';                           //Knopf zum löschen von ToDos
  deleteButton.className = 'deleteTask';

  listItem.appendChild(deleteButton);

  deleteButton.addEventListener('click', function(){            //Funktion, wenn man den Knopf an klickt
    todoList.removeChild(listItem);                             // entfernt das entsprechende Element aus der Todo Liste
    saveTasks();                            // die Löschung muss auch im local Storage passieren, weshalb saceTasks durchgeführt werden muss
  });

  todoList.appendChild(listItem);                   //listItem wird zu todoList hinzugefügt und ist jetzt Sichtbar
}

function saveTasks(){                               //Funktion zum lokalen speichern

  let tasks = [];                                   // neuer Array namens tasks
  todoList.querySelectorAll('li').forEach(function(item){         //wählt alle 'li' Elemente aus der todoList und führt für jedes folgende funktion aus...
    tasks.push(item.textContent.replace('Löschen', '').trim());              // "pusht" alle ausgewählten Elemente in das Array 'tasks'
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));           //das Array tasks wird im JSON format im localStorage des Browsers gespeichert

  }

  function loadTasks(){                               //funktion um lokal gespeicherte ToDos zu laden

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];    // JSON Objekt wird wieder zu einem Array

    tasks.forEach(createTaskElement);                               // mit jedem tasks Element wird die Funktion createTaskElement durchgeführt
  }

  document.addEventListener("keydown", function(event){           //funktion, damit man per enter taste todos speichern kann
    if (event.key === "Enter"){
      addTask();
    }
  });

