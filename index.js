const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

require("dotenv").config();

const contactsRoutes = require("./pages/contactsRoutes");
const app = express();
const PORT = 3010;

app.use(express.json());
app.use(morgan("combined"));
app.use(cors());

app.get("/", (req, res) => res.send("API contacts READY"));

app.use("/", contactsRoutes);


app.listen(PORT,() =>{
  console.log(`Server is running on port ${PORT}`);
});




















