const userModel = require("./user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getUsers = async(req, res) => {
  const usersList = await userModel.find();
  res.send(usersList);
}

const userRegister = async(req, res) => {
  
  try {const {password, email} = req.body;
  
  const existUser = await userModel.findOne ({email});
  
  if(existUser) {
  
    res.status(409).send('Email in use');
  }
  const passwordHash = await bcrypt.hash(password, 10);
  
  const userToAdd = new userModel ({email, password: passwordHash});
  const dbUser = await userToAdd.save();
  

  res.status(201).send(
  {
    id: dbUser._id,
    email: dbUser.email,
    subscription: dbUser.subscription,
  }
);
}
catch (err) {console.log(err)};
}

const userLogin = async(req, res) => {
  try {const {password, email} = req.body;
  console.log(password)
  const userDb = await userModel.findOne ({email});
  console.log(userDb)
  if(!userDb) {
   return res.status(400).send("user did not pass validation");
  }
  const compareUser = bcrypt.compare(password, userDb.password) 
  if(!compareUser){res.status(401).send("Email or password is wrong");}
    const tokenUser = jwt.sign({id:userDb._id}, process.env.JWT_SECRET)
    await userModel.findOneAndUpdate({_id: userDb._id}, {token:tokenUser}, {new:true})
    res.status(200).send(
      {token: tokenUser,
      user: {
        email:userDb.email,
        subscription: userDb.subscription}
  })
}
catch (err) {
  }
}

const tokenValidate = async(req, res, next) => {
  try {
    const authorizationHeader = req.get("Authorization") || "";
    const token = authorizationHeader.replace("Bearer ", "");

    const tokenVerify = await jwt.verify(token, process.env.JWT_SECRET).id;

    const user = await userModel.findById(tokenVerify);

    if (!user || !user.token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    req.id = user._id;
    req.email = user.email;
    req.subscription = user.subscription;

    next();
  } catch (err) {
    next(err);
  }
};

const logOut = async(req, res, next) =>  {
  try {
    await userModel.findByIdAndUpdate(req.id, { token: null });

    res.status(209).send();
  } catch (err) {
    next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    res
      .status(200)
      .send({ user: { email: req.email, subscription: req.subscription } });
  } catch (err) {
    next(err);
  }
};

const updateSubscription = async (req, res, next) => {
  try {
    await userModel.findByIdAndUpdate(req.id, {
      subscription: req.body.subscription,
    });

    res.status(200).send({
      id: req.id,
      email: req.email,
      subscription: req.body.subscription,
    });
  } catch (err) {
    next(err);
  }
};


module.exports = {userRegister, getUsers, userLogin, tokenValidate, logOut, getCurrentUser, updateSubscription}


