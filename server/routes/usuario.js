const express = require('express');
const app = express();

app.get('/usuario', function(req, res) {
    res.json('Get Usuario LOCAL')
})


app.post('/usuario', function(req, res) {

    let body = req.body;
    res.json({

        persona: body
    })
})


app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;

    res.json({ id })
})

app.delete('/usuario', function(req, res) {
    res.json('Delete Usuario')
})
module.exports = app;