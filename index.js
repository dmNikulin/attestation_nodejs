const express = require('express');
const app = express();
const joi = require('joi');
const fs = require('fs');
const path = require('path');
const pathToJson = path.join(__dirname, 'users.json');
const jsonFile = fs.readFileSync('users.json', 'utf-8');

const users = [];

// const jsonText = JSON.stringify(fs.readFileSync(pathToJson, 'utf-8'));
// const jsonObj = JSON.parse(fs.readFileSync(pathToJson, 'utf-8'));
// console.log(jsonObj);

let uniqueId = 0;
app.use(express.json())

function errType() {
    console.log('sadasd')
}

const userSchema = joi.object({
    firstName: joi.string().min(2).required(),
    secondName: joi.string().min(2).required(),
    city: joi.string().min(2),
    age: joi.number().min(0).required()
})


app.get('/users', function(req, res) {
    const unparseJson = JSON.parse(fs.readFileSync(pathToJson, 'utf-8'));
    res.send(unparseJson);
})

app.get('/users/:id', function(req, res) {
    const unparseJson = JSON.parse(fs.readFileSync(pathToJson, 'utf-8'));

    const userID = +req.params.id;
    const user = unparseJson.find((user) => user.id === userID);
    if (user) {
        res.send(user);
    } else {
        res.status(404);
        res.send(null);
    }
})

app.post('/users', function(req, res) {
    const result = userSchema.validate(req.body);
    if (result.error) {
        return res.status(404).send({ error: result.error.details });
    }
    uniqueId += 1;
    

    if (jsonFile.toString().length === 0) {
        console.log('Empty');
        
        uniqueId = 1;

        const newUser = {
            id: uniqueId,
            ...req.body
        };
        
        users.push(newUser);

        fs.writeFile(pathToJson, JSON.stringify(users, null, 2), function(error){
            if(error) {
                return console.log(error);
            }
            console.log("Файл успешно записан");
        });
    }else {
        const unparseJson = JSON.parse(fs.readFileSync(pathToJson, 'utf-8'));
        uniqueId = (unparseJson.length) + 1;

        const newUser = {
            id: uniqueId,
            ...req.body
        };

        unparseJson.push(newUser);
    
        fs.writeFile('users.json', JSON.stringify(unparseJson, null, 2), function(error){
            if (error) {
                return console.log(error);
            }
            console.log("Файл успешно записан");
        });
    }

    res.send({ id: uniqueId });
})

app.put('/users/:id', function(req, res) {
    const unparseJson = JSON.parse(fs.readFileSync(pathToJson, 'utf-8'));
    const result = userSchema.validate(req.body);

    if (result.error) {
        return res.status(404).send({ error: result.error.details });
    }
    const userID = +req.params.id;

    const user = unparseJson.find((user) => user.id === userID);
    if (user) {
        const { firstName, secondName, city, age } = req.body;
        user.firstName = firstName;
        user.secondName = secondName;
        user.city = city;
        user.age = age;

        unparseJson.splice((userID - 1), 1, user);

        fs.writeFile('users.json', JSON.stringify(unparseJson, null, 2), function(error){
            if (error) {
                return console.log(error);
            }
            console.log("Файл успешно записан");
        });
        res.send(user);
    } else {
        res.status(404);
        res.send(null);
    }
})

app.delete('/users/:id', function(req, res) {
    const unparseJson = JSON.parse(fs.readFileSync(pathToJson, 'utf-8'));
    const userID = +req.params.id;
    const user = unparseJson.find((user) => user.id === userID);
    if (user) {
        const newUnParse = unparseJson.filter((item) => item.id !== userID);

        fs.writeFile('users.json', JSON.stringify(newUnParse, null, 2), function(error){
            if (error) {
                return console.log(error);
            }
            console.log("Файл успешно записан");
        });

        res.send(user);
    } else {
        res.status(404);
        res.send(null);
    }
})



app.listen(3000);