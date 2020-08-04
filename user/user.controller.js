const userModel = require("./user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require('path');
const Avatar = require('avatar-builder');
const fs = require('fs');
// const fsPromise = fs.promises;
// const imagemin = require('imagemin');
// const imageminJpegtran = require('imagemin-jpegtran');
// const imageminPngquant = require('imagemin-pngquant');

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

  const createUser = (req, res, next) => {
    try {
      const { password, email, subscription } = req.body;
      const passwordHash = await bcryptjs.hash(password, 8);

      const existingUser = await userModel.findUserByEmail(email);
      if (existingUser) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      const user = await userModel.create({
        email,
        password: passwordHash,
        subscription,
        avatarURL: avatarURL,
      });
      return res.status(201).json({
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      });
    } catch (error) {
      next(error);
    }
  }


  const avatar = Avatar.builder(
    Avatar.Image.margin(Avatar.Image.circleMask(Avatar.Image.identicon())),
    128,
    128,
    { cache: Avatar.Cache.lru() },
  );

  const avatarBasePath = `${process.env.STATIC_BASE_PATH}/${Date.now()}.png`
  const avatarBaseUrl = `${process.env.STATIC_BASE_URL}/${Date.now()}.png`;
  const newAvatar = avatar.create('gabriel').then(buffer => {
  fs.writeFileSync(`./${avatarBasePath}`, buffer);
  fs.rename(`./${avatarBasePath}`, `./public/${avatarBaseUrl}`, (err) => {
        if (err) throw err;
         console.log('Rename complete!');
       });
  });
 const avatarURL = `${process.env.SERVER_BASE_URL}/${avatarBaseUrl}`;


  const passwordHash = await bcrypt.hash(password, 10);
  
  const userToAdd = new userModel ({email, password: passwordHash});
  const dbUser = await userToAdd.save();
  

  res.status(201).send({
    id: dbUser._id,
    email: dbUser.email,
    subscription: dbUser.subscription,
    avatarURL: dbUser.avatarURL,
 });
}
catch (err) {console.log(err)};
};



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
    res.status(200).send({
      token: tokenUser,
      user: {
      email:userDb.email,
      subscription: userDb.subscription,
      avatarUrl: userDb.avatarURL,}
  });
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
      .send({ user: { 
        email: req.email, 
        subscription: req.subscription, 
        avatarUrl: req.avatarURL, } 
      });
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
      avatarUrl: req.avatarURL,
    });
  } catch (err) {
    next(err);
  }
};

const  updateAvatar = async (req, res, next) => {
  try {
    await this.minifyImage(req.file.path);

    const path = `http://localhost:${process.env.PORT}/images/${req.file.filename}`;

    await user.findByIdAndUpdate(req.id, { $set: { avatarURL: path } });

    res.status(200).send({ avatarURL: path });
  } catch (err) {
    next(err);
  }
};




module.exports = {
  userRegister, 
  getUsers, 
  userLogin, 
  tokenValidate, 
  logOut, 
  getCurrentUser, 
  updateSubscription, 
  createUser,
  updateAvatar
  }


