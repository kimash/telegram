var express = require('express');
var ejs = require('ejs');
var app = express.createServer(express.logger());

var mongoose = require('mongoose'); // include Mongoose MongoDB library
var schema = mongoose.Schema; 

/************ DATABASE CONFIGURATION **********/
app.db = mongoose.connect(process.env.MONGOLAB_URI); //connect to the mongolabs database - local server uses .env file

// Include models.js - this file includes the database schema and defines the models used
require('./models').configureSchema(schema, mongoose);

// Define your DB Model variables
var Card = mongoose.model('Card');
/************* END DATABASE CONFIGURATION *********/

/*********** SERVER CONFIGURATION *****************/
app.configure(function() {
    
    /*********************************************************************************
        Configure the template engine
        We will use EJS (Embedded JavaScript) https://github.com/visionmedia/ejs
        
        Using templates keeps your logic and code separate from your HTML.
        We will render the html templates as needed by passing in the necessary data.
    *********************************************************************************/

    app.set('view engine','ejs');  // use the EJS node module
    app.set('views',__dirname+ '/views'); // use /views as template directory
    app.set('view options',{layout:true}); // use /views/layout.html to manage your main header/footer wrapping template
    app.register('html',require('ejs')); //use .html files in /views

    /******************************************************************
        The /static folder will hold all css, js and image assets.
        These files are static meaning they will not be used by
        NodeJS directly. 
        
        In your html template you will reference these assets
        as yourdomain.heroku.com/img/cats.gif or yourdomain.heroku.com/js/script.js
    ******************************************************************/
    app.use(express.static(__dirname + '/static'));
    
    //parse any http form post
    app.use(express.bodyParser());
    
    /**** Turn on some debugging tools ****/
    app.use(express.logger());
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

});
/*********** END SERVER CONFIGURATION *****************/


valentineImages = ['telegram.jpg'];

//cardArray = []; // this array will hold card data from forms

app.get('/', function(request, response) {
    var templateData = { 
        pageTitle : 'Compose a Telegram',
        message : 'Hello Dynamic Web Class!',
        images : valentineImages
    };
    
    response.render("card_form.html",templateData);
});

app.post('/', function(request, response){
    console.log("Inside app.post('/')");
    console.log("form received and includes")
    console.log(request.body);
    
    // Simple data object to hold the form data
    newCard = new Card();
    
    /*{
        to : request.body.to,
        from : request.body.from,
        message : request.body.message,
        image : 'telegram.jpg'
    };*/
    
    newCard.to = request.body.to;
    newCard.from = request.body.from;
    newCard.message = request.body.message;
    newCard.image = 'telegram.jpg';
    
    //changes all "." to "-STOP" like in a real telegram
    newCard.message = newCard.message.replace(/\./g,"-STOP-")
    
    newCard.save();
    
    // Put this newCard object into the cardArray
    //cardArray.push(newCard);
    
    // Get the position of the card in the cardArray
    //cardNumber = cardArray.length - 1;
    
    //response.redirect('/card/' + cardNumber);
});


app.get('/card/:cardNumber', function(request, response){
    
    // Get the card from cardArray
    cardData = cardArray[request.params.cardNumber]
    
    if (cardData != undefined) {
        
        // Render the card_display template - pass in the cardData
        response.render("card_display.html", cardData);
        
    } else {
        // card not found. show the 'Card not found' template
        response.render("card_not_found.html");
        
    }
    
});





// Make server turn on and listen at defined PORT (or port 3000 if is not defined)
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});