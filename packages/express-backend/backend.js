// backend.js
import express from "express";
import cors from "cors";
import userServices from "./user-services.js";

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

app.get("/users/:id", (req, res) => {
    const id = req.params["id"];
    userServices.findUserById(id).then((result) => {
        if (result === undefined || result === null)
            res.status(404).send("Resource not found.");
        else res.send({ users_list: result });
    });
});

app.post("/users", (req, res) => {
    const user = req.body;
    userServices.addUser(user).then((savedUser) => {
        if (savedUser) res.status(201).send(savedUser);
        else res.status(500).end();
    });
});

app.get("/users", (req, res) => {
    const name = req.query["name"];
    const job = req.query["job"];
    userServices
        .getUsers(name, job)
        .then((result) => {
            res.send({ users_list: result });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send("An error ocurred in the server.");
        });
});


app.delete("/users/:id", (req, res) => {
    const id = req.params.id;
    userServices
        .findUserById(id)
        .then((result) => {
            if (result) {
                // Remove the user from the list
                const updatedUserList = userServices.deleteUserById(id);

                // Send the updated user list as a response
                res.send({ users_list: updatedUserList });
            } else {
                // If the user with the provided ID doesn't exist
                res.status(404).send("User not found");
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send("An error occurred in the server.");
        });
});



app.get("/", (req, res) => {
    res.send("Hello Danny!");
});

app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}`
    );
});

