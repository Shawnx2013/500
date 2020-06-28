if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');

const mongoose = require('mongoose');
const db = mongoose.connection;

const indexRouter = require('./routes/indexRoute');
const photoRouter = require('./routes/photoRoute');
const commentRouter = require('./routes/commentRoute');

app.set('view engine', 'ejs');
app.set('views', __dirname+'/views');
app.set('layout', 'layouts/layout');

app.use(express.static('public'));
app.use(expressLayouts);
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}));

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to Mongoose'));

app.use('/', indexRouter);
app.use('/photos', photoRouter);
app.use('/comments', commentRouter);

app.listen(process.env.PORT|| 3000);
console.log("Server started");