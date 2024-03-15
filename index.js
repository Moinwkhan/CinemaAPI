const express = require("express");
const app = express();
const port = 3000;
const models = require("./models/model");
const cors = require("cors");
const nodemailer = require("nodemailer"); 

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// email send code
const sendMail = async (toEmail) => { 
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "moinwkhan21@gmail.com",
        pass: "ruaocobykdbdxfhl",
      },
    });

    const info = await transporter.sendMail({
      from: "moinwkhan21@gmail.com",
      to: toEmail,
      subject: "Hello ✔",
      text: "Hello world?",
      html: "<b>Happy coding</b>",
    });
    console.log(`Message Id ${info.messageId}`);
    return "Successfully sent email";
  } catch (error) {
    console.log(error.message);
    throw new Error("Failed to send email");
  }
};

// Endpoint for handling signup submissions
app.post("/signup", async (req, res) => {
  try {
    const userExists = await models.User.findOne({ name: req.body.name });
    if (userExists) {
      return res.status(409).send("User already exists");
    }

    const userData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    const newUser = new models.User(userData);

    await newUser.save();

    await sendMail(req.body.email); 

    console.log("Signup stored");
    res.status(201).send("Signup successful");
  } catch (error) {
    console.log(`Error ${error.message}`);
    res.status(500).send("Error signing up");
  }
});

// Endpoint for handling Login submissions
app.post("/login", async (req, res) => {
  try {
    console.log("Login request received");
    console.log("Request Body:", req.body);

    const user = await models.User.findOne({ name: req.body.name });

    if (user) {
      console.log("User found:", user);

      if (user.password === req.body.password) {
        console.log("Login successful");
        res.status(200).send("Login Successfully");
      } else {
        console.log("Wrong password");
        res.status(401).send("Wrong password");
      }
    } else {
      console.log("User not found");
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.log(`Error ${error.message}`);
    res.status(500).send("Error logging in");
  }
});

const start = () => {
  app.listen(port, () => {
    console.log("Server is connected");
  });
};

start();
