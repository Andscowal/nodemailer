const express = require("express");
const bodyParser = require("body-parser");
const expHbs = require("express-handlebars");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();

//View Engine Setup
app.engine("handlebars", expHbs());
app.set("view engine", "handlebars");

//Static Folder
app.use("/public", express.static(path.join(__dirname, "/public")));

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("contact");
});

app.post("/send", (req, res) => {
  const output = `
  <p>You have a new contact request</p>
  <h3>Contact Details</h3>
  <ul>
    <li>Name: ${req.body.name}</li>
    <li>Company: ${req.body.company}</li>
    <li>Email: ${req.body.email}</li>
    <li>Phone: ${req.body.phone}</li>
  </ul>
  <h3>Message:</h3>
  <p>${req.body.message}</p>
  `;
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "test@email.com", // generated ethereal user
      pass: "password123" // generated ethereal password
    }
    //If running from localhost, include
    // tls: {
    //   rejectUnauthorized: false
    // }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Nodemailer Contact" <nodemail@email.com>', // sender address
    to: "test@email.com testsfriend@email.com", // list of receivers
    subject: "Node Contact Request", // Subject line
    text: "Hello world?", // plain text body
    html: output // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.render("contact", { msg: "Email has been sent" });
  });
});

app.listen(3000, () => {
  console.log("Server started.");
});
