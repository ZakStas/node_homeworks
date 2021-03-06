const userModel = require("./user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require('path');
const Avatar = require('avatar-builder');
const fs = require('fs');
const fsPromise = fs.promises;
const sgMail = require('@sendgrid/mail');
const uuid = require('uuid');


const getUsers = async(req, res) => {
  const usersList = await userModel.find();
  res.send(usersList);
}

const userRegister = async(req, res) => {
  
  try {const {password, email} = req.body;
  
  const existUser = await userModel.findOne({email}); 
  if(existUser) {
  
    res.status(409).send('Email in use');
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
  fs.writeFileSync(`./public/${avatarBaseUrl}`, buffer, (err) => {
        if (err) throw err;
          fs.unlink(`./${avatarBasePath}`, (err) => {
          if (err) throw err;
          console.log(`./${avatarBasePath} was deleted`);
        });
       });
  });
 const avatarURL = `${process.env.SERVER_BASE_URL}/${avatarBaseUrl}`;

 const passwordHash = await bcrypt.hash(password, 10);
 
  const dbUser = await userModel.create({
    email,
    password: passwordHash,
    avatarURL: avatarURL,
  });

  res.status(201).send({
    id: dbUser._id,
    email: dbUser.email,
    subscription: dbUser.subscription,
    avatarURL: dbUser.avatarURL,
 });
}
catch (err) {console.log(err)};
};


const sendVerificationEmail = (email, verificationToken) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const message = {
    to: email,
    from: process.env.EMAIL,
    subject: 'Verification',
    text: `http://localhost:${process.env.PORT}/verify/${verificationToken}`,
    html: `<p>Press, <a href=http://localhost:${process.env.PORT}/auth/verify/${verificationToken}>click</a> to verify your email</p>`,
  };
  const verificateToken = uuid();
  sgMail.send(message);
};

const verificateEmail = async (req, res, next) => {
  try {
    const user = await model.findOne(req.params);

    if (!user) {
      return res.status(404).send('User not found');
    }

    await model.findByIdAndUpdate(user._id, { verificationToken: null });

    res.status(200).send('Welcome!!!');
  } catch (err) {
    next(err);
  }
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
    const user = await userModel.findById(req.id);
    const { avatarURL } = user;
    const avatarFileName = path.basename(avatarURL);
    const newAvatar = req.file.buffer;
    const avatarPath = path.join(
      __dirname,
      `../public/images/${avatarFileName}`
    );
    await fsPromises.writeFile(avatarPath, newAvatar);
    return res.status(200).json({
      avatarURL: avatarURL,
    });


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
  updateAvatar,
  verificateEmail
  }


