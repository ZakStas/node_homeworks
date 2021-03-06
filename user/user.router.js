const { Router } = require('express');
const {userRegister, userLogin, tokenValidate, logOut, getCurrentUser, updateAvatar, verificateEmail}  = require("./user.controller");
const {validateUser} = require("../helpers/validateUser")
const multer = require('multer');
const path = require('path');
const authRouter = Router();

const storage = multer.diskStorage({
  destination: './tmp',
  filename: (req, file, cb) => {
    const { ext } = path.parse(file.originalname);
    return cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

authRouter.get('/auth/verify/:verificationToken', validateUser, verificateEmail);


authRouter.post("/register", validateUser, userRegister) 
authRouter.post("/login", validateUser, userLogin) 

authRouter.post('/logout', tokenValidate, logOut)
authRouter.get('/users/current', tokenValidate, getCurrentUser)



authRouter.patch('/users/avatars',
tokenValidate,
  upload.single('avatar'),
  updateAvatar,
);

module.exports = authRouter;