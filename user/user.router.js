const { Router } = require('express');
const {userRegister, userLogin, tokenValidate, logOut, getCurrentUser}  = require("./user.controller");
const {validateUser} = require("../helpers/validateUser")

const authRouter = Router();

authRouter.post("/register", validateUser, userRegister)
authRouter.post("/login", validateUser, userLogin)
authRouter.post("/login", validateUser, tokenValidate)
authRouter.post('/logout',  validateUser, logOut)
authRouter.get('/users/current', validateUser, getCurrentUser)
authRouter.patch('/users/avatars',
  upload.single('avatar'),
  validateUser.validateToken,
  validateUser.updateAvatar,
);

module.exports = authRouter;