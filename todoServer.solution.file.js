const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname));

function findIndex(arr, id) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) return i;
  }
  return -1;
}

function removeAtIndex(arr, index) {
  //How remove Index function is working..
  let newArray = [];
  for (let i = 0; i < arr.length; i++) {
    if (i !== index) newArray.push(arr[i]);
  }
  return newArray;
}

app.get("/todos", (req, res) => {
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data)); //It converts the string to JSON .. from file or BE we read in string formate... if remove parse we get response in string formate
  });
});

app.get("/todos/:id", (req, res) => {
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) throw err;
    const todos = JSON.parse(data);
    const todoIndex = findIndex(todos, parseInt(req.params.id));
    if (todoIndex === -1) {
      res.status(404).send();
    } else {
      res.json(todos[todoIndex]);
    }
  });
});

app.post("/todos", (req, res) => {
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) throw err;
    const files = JSON.parse(data);
    
    const indx = files.length;
    const newTodo = {
      // id: Math.floor(Math.random() * 1000000), // unique random id
      id: indx,
      title: req.body.title,
      description: req.body.description,
    };
    fs.readFile("todos.json", "utf8", (err, data) => {
      if (err) throw err;
      const todos = JSON.parse(data);
      todos.push(newTodo);
      fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
        if (err) throw err;
        res.status(201).json(newTodo);
      });
    });
  });
});

app.put("/todos/:id", (req, res) => {
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) throw err;
    let todos = JSON.parse(data);
    let todoIndex = findIndex(todos, parseInt(req.params.id));
    if (todoIndex === -1) {
      res.status(404).send();
    } else {
      const updatedTodo = {
        id: todos[todoIndex].id,
        title: req.body.title,
        description: req.body.description,
      };
      todos[todoIndex] = updatedTodo;
      fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
        if (err) throw err;
        res.status(200).json(updatedTodo);
      });
    }
  });
});

app.delete("/todos/:id", (req, res) => {
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) throw err;

    let todosData = JSON.parse(data); // Use a different variable name

    const todoIndex = findIndex(todosData, parseInt(req.params.id));

    if (todoIndex === -1) {
      res.status(404).send();
    } else {
      todosData = removeAtIndex(todosData, todoIndex);

      fs.writeFile("todos.json", JSON.stringify(todosData), (err) => {
        if (err) throw err;
        res.status(200).send();
      });
    }
  });
});

app.get('/', (req, res)=>{
  res.sendFile(path.join(__dirname, "index.html"));
})

// for all other routes, return 404

app.listen(3000);

// module.exports = app;
