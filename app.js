
    //db
var mongoose = require('mongoose'),
    User = require("../valentine/models/user");

mongoose.connect("mongodb+srv://admin:admin@valentine-abe6i.mongodb.net/test?retryWrites=true&w=majority", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log('connected to db');
}).catch(err => {
    console.log('error: ' + err);
});
