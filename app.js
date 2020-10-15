
let express = require("express");
let path = require("path");

let tables = [];
let waitingList = [];

const PORT = 3000;


let app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.get("/reserve", function(req, res) {
    res.sendFile(path.join(__dirname, "reserve.html"));
  });

app.get("/tables", function(req, res) {
      res.sendFile(path.join(__dirname, "tables.html"));
  });

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "home.html"));
  });


app.get("/api/tables", function(req, res) {
    return res.json(tables).status(200);
  });

app.get("/api/waitlist", function(req, res) {
    return res.json(waitingList).status(200);
  }); 
  

app.get("/api/tables/:id", function(req, res) {
    var chosen = req.params.id;
  
    for (var i = 0; i < tables.length; i++) {
      if (chosen === tables[i].id) {
        return res.json(characters[i]).status(200);
      }
    }
    return res.json(false).status(404);
  });


app.delete("/api/tables/:id", (req, res) => {
    let id = req.params.id;
    tables = tables.filter((item) => item.id != id);
  
    if (waitingList.length >= 1) {
        tables.push(waitingList[0]);
        waitingList.shift();
    }
    return res
        .json({
          message: "The reservation was checked off successfully.",
        })
        .status(200);
  });


  app.delete("/api/clear", (req, res) => {
    tables = [];
    while (tables.length < 5 && waitingList.length > 0 ){
        tables.push(waitingList[0]);
        waitingList.shift();
    }
    return res
    .json({
      message: "Tables where cleared",
    })
    .status(200);
  });

  app.post("/api/reserve", (req, res) => {
    let reservation = req.body;
    let isUnique = true;
    
    tables.forEach((item) => {
        if(reservation.id === item.id){
        isUnique = false;
        return res.json({
          message: "The reservation with this id already exists",
        })
        .status(400);
        }
        
    });

    waitingList.forEach((item) => {
        if(reservation.id === item.id){
          isUnique = false;
        return res.json({
          message: "The reservation with this id already exists",
        })
        .status(400);

        }
        
    });
    if(isUnique){
    if(tables.length < 5){
        tables.push(reservation);
        res.json({
            message: "The reservation was added successfully.",
            data : tables,
            })
            .status(200);
    }else{
        waitingList.push(reservation);
        res.json({
            message: "Tables are full, you're reservation has been added to the waiting list.",
            data : waitingList,
            })
            .status(200);
    }
  }

  });

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
  