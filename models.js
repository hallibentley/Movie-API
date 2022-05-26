//mongoose is an object document mapper//
const mongoose = require('mongoose');
//bcrypt is used to hash passwords//
const bcrypt = require('bcrypt');



let movieSchema = mongoose.Schema({
  Title: {type: String, required: true},
  Description: {type: String, required: true},
  Genre: {
    Name: String,
    Description: String
  },
  Director: {
    Name: String,
    Description: String,
    Birth: String,
    Death: String
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean
});



let userSchema = mongoose.Schema({
  Username: {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String, required: true},
  Birthday: Date,
  FavoriteMovies: [{type: mongoose.Schema.Types.ObjectID, ref: 'Movie'}]
});

userSchema.statics.hashPassword = (password) =>
{
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.Password);
};



//creating models with the schemas we defined above//
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

//exporting models to use in index.js file//
module.exports.Movie = Movie;
module.exports.User = User;
