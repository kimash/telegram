// export Schemas to web.js
module.exports.configureSchema = function(Schema, mongoose) {
    
    
    //telegram schema 
    var newCard = new Schema({
      to     : String, 
      from   : String,
      message   : String, 
      date      : { type: Date, default: Date.now }
    });

    // add schemas to Mongoose
    mongoose.model('newCard', newCard);

};