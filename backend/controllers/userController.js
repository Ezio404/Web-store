import {redis} from "../lib/redis.js";
import {User,comparePassword} from "../models/usermodel.js";
import jwt from "jsonwebtoken";



const generateToken = (userId) => {
  const accesstoken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshtoken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  })
  return {accesstoken,refreshtoken};
};

const storerefreshtoken = async (userId,refreshtoken) => {
  await redis.set(`refreshtoken:${userId}`, refreshtoken,"EX",7*24*60*60);
};


const setCookies = (res,accesstoken,refreshtoken) => {
  res.cookie("accesstoken", accesstoken, {
    httpOnly: true,
    secure:process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15*60*1000
  })
  res.cookie("refreshtoken", refreshtoken, {
    httpOnly: true,
    secure:process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7*24*60*60*1000
  })
}

export const signup = async (req, res) => {
try {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if(userExists){
    return res.status(400).json({message: "User already exists"});
  };

  const user = await User.create({name,email,password});



  // authenticate
  const {accesstoken,refreshtoken} = generateToken(user._id);
  await storerefreshtoken(user._id,refreshtoken);

  setCookies(res,accesstoken,refreshtoken);

  res.status(201).json({user:{
    _id: user._id,
    name: user.name,
    email: user.email,
  },message: "User created successfully"});

} catch (error) {
  res.status(500).json({message: error.message});
}
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshtoken;
    if(refreshToken){
    const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
    await redis.del(`refresh_token:${decoded.userId}`);
    }
    res.clearCookie("accesstoken");
    res.clearCookie("refreshtoken");
    res.json({message: "User logged out successfully"});

  } catch (error) {
    res.status(500).json({message: error.message});
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).send("user not found")
    }
    const isMatch = comparePassword(password,user.password);
    
    if (!isMatch) {
      return res.status(400).send('invalid password')
    }
    const { accesstoken, refreshtoken } = generateToken(user._id);
    await storerefreshtoken(user._id, refreshtoken);
    setCookies(res, accesstoken, refreshtoken);

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      }, message: "User logged in successfully"
    });
  } catch (error) {
      console.log('Login error:', error.message);
      res.status(500).send('Internal server error')
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshtoken;
  if(!refreshToken){
    return res.status(401).json({message: "no refresh token provided"});
  }
  const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
  console.log(decoded);
  const storedtoken = await redis.get(`refreshtoken:${decoded.userId}`);
  
  console.log(storedtoken);
  if(storedtoken!== refreshToken){
   return res.status(401).json({message:'invalid refresh token'}) 
  };

  const accesstoken = jwt.sign({userId: decoded.userId},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"15m"});

  res.cookie("accesstoken",accesstoken,{
      httpOnly: true,
      secure:process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15*60*1000
  });


  res.json({message:"token refreshed successfully"})

} catch(error) {
res.status(500).json({error: error.message})
}
};

export const getprofile = async (req, res) => {
  res.json(req.user);
}

