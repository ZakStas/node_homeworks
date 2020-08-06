const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const usersRouter = require("./user/user.router");
const contactsRoutes = require("./contacts/contact.router");


const app = express();

const PORT = 3015;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));
app.use(express.json());
app.use('/images', express.static("./public/images"));
app.get('/', (req, res) => res.send("API contacts READY"));
app.use('/auth', usersRouter);
app.use('/contacts', contactsRoutes);


app.use((err, req, res, next) => {
	const { message, status } = err;

	res.status(status || 500).send(message);
});


mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
}, (err) => {
  if (err) { process.exit(1) }
  console.log("Contacts database connection successful!");
})
app.listen(PORT,() =>{
  console.log(`Server is running on port ${PORT}`);
});