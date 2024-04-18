// backend.js
import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

const users = {
    users_list: [
        {
            id: "xyz789",
            name: "Charlie",
            job: "Janitor"
        },
        {
            id: "abc123",
            name: "Mac",
            job: "Bouncer"
        },
        {
            id: "ppp222",
            name: "Mac",
            job: "Professor"
        },
        {
            id: "yat999",
            name: "Dee",
            job: "Aspring actress"
        },
        {
            id: "zap555",
            name: "Dennis",
            job: "Bartender"
        },
    ]
};

const findUserByName = (name) => {
    return users["users_list"].filter(
        (user) => user["name"] === name
    );
};

const findUserById = (id) =>
    users["users_list"].find((user) => user["id"] === id);

const findUsersByNameAndJob = (name, job) => {
    return users["users_list"].filter(
        (user) => user["name"] === name && user["job"] === job
    );
};

const addUser = (user) => {
    users["users_list"].push(user);
    return user;
};

const deleteUserById = (id) => {
    const index = users["users_list"].findIndex((user) => user["id"] === id);
    if (index !== -1) {
        users["users_list"].splice(index, 1);
        return true; // User deleted successfully
    }
    return false; // User not found
};

// Function to generate a random ID with 3 characters and 3 numbers
function generateRandomId() {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const nums = '0123456789';

    let randomId = '';

    // Generate 3 random characters
    for (let i = 0; i < 3; i++) {
        randomId += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Generate 3 random numbers
    for (let i = 0; i < 3; i++) {
        randomId += nums.charAt(Math.floor(Math.random() * nums.length));
    }

    return randomId;
}

app.get("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    let result = findUserById(id);
    if (result === undefined) {
        res.status(404).send("Resource not found.");
    } else {
        res.send(result);
    }
});

app.post("/users", (req, res) => {
    const userToAdd = req.body;
    // Generate a random ID for the user
    const randomId = generateRandomId();

    // Assign the generated ID to the user object
    userToAdd.id = randomId;
    addUser(userToAdd);
    res.status(201).json(userToAdd);
});

// Existing route to get all users or filter by name
app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job; // New: Get job query parameter
    if (name != undefined) {
        let result;
        if (job != undefined) {
            result = findUsersByNameAndJob(name, job);
        } else {
            result = findUserByName(name);
        }
        result = { users_list: result };
        res.send(result);
    } else {
        res.send(users);
    }
});

app.delete("/users/:id", (req, res) => {
    const id = req.params.id;
    const deleted = deleteUserById(id);
    if (deleted) {
        res.sendStatus(204); // Send 204 No Content status
    } else {
        res.status(404).send("User not found");
    }
});


app.get("/", (req, res) => {
    res.send("Hello Danny!");
});

app.get("/users", (req, res) => {
    res.send(users);
});

app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}`
    );
});



