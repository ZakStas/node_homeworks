const jwt = require("jsonwebtoken");

const authorize = async function (req, res, next) {
    const authHeader = req.headers.authorization;
  const token = authHeader.replace("Bearer ", "");

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET); // { id: user._id }
  } catch (err) {
    return res.status(401).send("Authorization failed");
  }

  const user = await User.findById(payload.id);

  req.user = user;

  next();
}

const authorizeWithCookies = async function (req, res, next) {
    const token = req.cookies.token;
  
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).send("Authorization failed");
    }
  
    const user = await User.findById(payload.id);
  
    req.user = user;
  
    next();
  };

  module.exports ={
    authorizeWithCookies, 
    authorize
  }