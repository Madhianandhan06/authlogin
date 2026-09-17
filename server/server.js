import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
dotenv.config({ path: new URL('../.env', import.meta.url) });
dotenv.config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "madhi-secret";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
await connectDB();
await User.init();

app.get('/', (req, res) => {
  res.send('Server is running')
})


// // ---------------- SIGNUP ----------------
// app.post("/signup", async (req, res) => {
//   const email = req.body.email?.trim().toLowerCase();
//   const { password } = req.body;

//   if (!email || !password) {
//     return res.status(401).json({
//       message: "Invalid credentials",
//     });
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = await User.create({
//       email,
//       password: hashedPassword,
//     });

//     res.status(201).json({
//       message: "Account created",
//       user: newUser,
//     });
//   } catch (error) {
//     if (error.code === 11000) {
//       return res.status(400).json({
//         message: "Email already exists",
//       });
//     }
//     throw error;
//   }
// });

// // ---------------- LOGIN ----------------
// app.post("/login", async (req, res) => {
//   const email = req.body.email?.trim().toLowerCase();
//   const { password } = req.body;

//   const user = await User.findOne({ email });

//   const isMatch = user && await bcrypt.compare(password, user.password);
//   if (!user || !isMatch) {
//     return res.status(401).json({
//       message: "Invalid credentials",
//     });
//   }

//   const token = jwt.sign(
//     { userId: user._id, email: user.email },
//     JWT_SECRET,
//     { expiresIn: "1d" }
//   );

//   res.json({
//     message: "Login successful",
//     token,
//   });
// });

// // ---------------- AUTH ----------------
// function auth(req, res, next) {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).json({
//       message: "Token missing",
//     });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     req.user = jwt.verify(token, JWT_SECRET);
//     next();
//   } catch {
//     return res.status(401).json({
//       message: "Invalid token",
//     });
//   }
// }

// // ---------------- PROFILE ----------------
// app.get("/profile", auth, async (req, res) => {
//   const user = await User.findById(req.user.userId).select("-password");

//   res.json(user);
// });

app.post('/api/signup', async (req, res) => {
  const email = req.body.email?.trim().toLowerCase()
  const name = req.body.name?.trim()
  const { password } = req.body

  if(!name || !email || !password){
    return res.status(401).json({
      message: `Invalid credentials`
    })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    })

    const safeUser = newUser.toObject()
    delete safeUser.password

    const token = jwt.sign(
      {email},
      JWT_SECRET,
      {expiresIn : '1d'}
    )
    res.status(201).json({
      message: `Account created`,
      user: safeUser,
      token
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: `Email already exists`
      })
    }

    console.error('Signup failed:', error)
    res.status(500).json({
      message: `Unable to create account`
    })
  }
})

function auth(req, res, next){
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: 'Token missing' })
  }

  const token = authHeader.split(' ')[1]

  try {
    req.user = jwt.verify(token, JWT_SECRET)
  } catch {
    return res.status(401).json({ message: 'Invalid token' })
  }

  next()
}
app.post('/api/login', async (req, res) => {

  const email = req.body.email?.trim().toLowerCase();
  const { password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // return the document copy of deleted password field
  const safeUser = user.toObject();
  delete safeUser.password;

  const token = jwt.sign(
    { email: user.email },
    JWT_SECRET,
    { expiresIn: '1d' }
  )

  res.status(200).json({
    user: safeUser,
    token
  })
})

if (process.env.NODE_ENV !== 'production' || process.env.RENDER) {
  const port = process.env.PORT || 3000
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}

export default app
