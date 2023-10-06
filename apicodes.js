const express = require("express");
const Model = require("./schema");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();

app.post("/add", async (request, response) => {
  /*const newUser = new model(request.body);
  try {
    await newUser.save();
    response.send(newUser);
  } catch (error) {
    response.status(500).send(error);
}*/
  const client = new MongoClient("mongodb://localhost:27017");
  const { username, age, password } = request.body;
  client
    .db("Userdata")
    .collection("user")
    .insertOne({
      username: username,
      age: age,
      password: password,
    })
    .then((res) => {
      response.send(res);
      client.close();
    })
    .catch((err) => response.send(err));
});

app.put("/update", async (request, response) => {
  const client = new MongoClient("mongodb://localhost:27017");
  const { username, age } = request.body;
  client
    .db("Userdata")
    .collection("user")
    .updateOne({ username: username }, { $set: { age: age } })
    .then((res) => {
      response.send(res);
      client.close();
    })
    .catch((err) => response.send(err));
});

app.delete("/delete", async (request, response) => {
  const client = new MongoClient("mongodb://localhost:27017");
  client
    .db("Userdata")
    .collection("user")
    .deleteOne({ username: "Ram" })
    .then((res) => {
      response.send(res);
      client.close();
    })
    .catch((err) => response.send(err));
});

app.get("/getusers", async (request, response) => {
  const usersArray = await Model.find({});
  try {
    response.send(usersArray);
  } catch (error) {
    response.status(500).send(error);
  }
});
//loginApi

app.post("/login", async (request, response) => {
  const { username, password } = request.body;
  console.log(request.body);
  const client = new MongoClient("mongodb://localhost:27017");
  client
    .db("Userdata")
    .collection("samples")
    .findOne({ username: username })
    .then(async (resp) => {
      if (resp === null) {
        response.status(400).send("Invalid User");
      } else {
        const passwordMatch = await bcrypt.compare(password, resp.password);
        if (passwordMatch === true) {
          const payload = {
            username: username,
          };
          const jwtToken = jwt.sign(payload, "SECRET");
          response.json({ jwt_token: jwtToken });
        } else {
          response.status(401).send("Invalid Password");
        }
      }
    })
    .catch((err) => response.send(err));
});

//registerApi

app.post("/register", async (request, response) => {
  const { username, password } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const client = new MongoClient("mongodb://localhost:27017");
  client
    .db("Userdata")
    .collection("samples")
    .insertOne({ username: username, password: hashedPassword })
    .then((res) => {
      response.send(res);
      client.close();
    })
    .catch((err) => response.send(err));
});
module.exports = app;
