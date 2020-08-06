const { Router } = require('express');
const {userRegister, userLogin, tokenValidate, logOut, getCurrentUser, updateAvatar}  = require("./user.controller");
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


authRouter.post("/register", validateUser, userRegister) //token is not
authRouter.post("/login", validateUser, userLogin) //token
 
authRouter.post('/logout', tokenValidate, logOut)
authRouter.get('/users/current', tokenValidate, getCurrentUser)

authRouter.patch('/users/avatars',
tokenValidate,
  upload.single('avatar'),
  updateAvatar,
);





module.exports = authRouter;