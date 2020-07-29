const { Router } = require('express');
const {userRegister, userLogin, tokenValidate, logOut, getCurrentUser}  = require("./user.controller");
const {validateUser} = require("../helpers/validateUser")

const authRouter = Router();

authRouter.post("/register", validateUser, userRegister)
authRouter.post("/login", validateUser, userLogin)
authRouter.post("/login", validateUser, tokenValidate)
authRouter.post('/logout',  validateUser, logOut)
authRouter.get('/users/current', validateUser, getCurrentUser)




module.exports = authRouter;