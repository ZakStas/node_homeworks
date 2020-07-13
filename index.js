const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const contactsRoutes = require("./contacts/contactsRoutes");
const app = express();
const PORT = 3015;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));
app.use('/contacts', contactsRoutes);

app.use((err, req, res, next) => {
	const { message, status } = err;

	res.status(status || 500).send(message);
});

app.get("/", (req, res) => res.send("API contacts READY"));
app.use("/", contactsRoutes);

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}, (err) => {
  if (err) { process.exit(1) }
  console.log("Contacts database connection successful!");
})
app.listen(PORT,() =>{
  console.log(`Server is running on port ${PORT}`);
});




















