const express = require("express");
const multer = require('multer');
const path = require('path');
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const usersRouter = require("./user/user.router");
const contactsRoutes = require("./contacts/contactsRoutes");
const { json } = require("express");


const app = express();

const storage = multer.diskStorage({
	destination: './publics/image',
	filename: function(req, file, cb) {
		console.log('file', file);
		const { ext } = path.parse(file.originalname);
		cb(null, Date.now() + '_' + file.originalname);
	}
});

const upload = multer({
	storage
});

app.post(
	'/public',
	upload.single('avatar'),
	(req, res, next) => {
		console.log('req.file', req.file);
		console.log('req.body', req.body);

		res.status(200).send();
	}
);
// app.use(express.static('static'));

app.use('/images', express.static("./publics/image"));





// const fileFilter = (req, file, cb) => {
// 	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
// 		cb(null, true);
// 	} else {	
// 		cb('Type file is not access', false);
// 	}
// };

// const upload = multer({
// 	storage,
// 	// fileFilter,
// 	// limits: 5 //5Mb
// });



const PORT = 3015;
app.use(json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

app.use('/auth', usersRouter);
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
  useCreateIndex: true,
  useFindAndModify: false,
}, (err) => {
  if (err) { process.exit(1) }
  console.log("Contacts database connection successful!");
})
app.listen(PORT,() =>{
  console.log(`Server is running on port ${PORT}`);
});




















