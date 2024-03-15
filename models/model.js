const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://moinwkhan21:task123@cluster0.cvfd3wg.mongodb.net/cluster0?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });

// Schema for users
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});


// Define models
const User = mongoose.model("User", userSchema);

module.exports = { User };
