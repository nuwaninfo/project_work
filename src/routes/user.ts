import { Request, Response, Router } from "express"
import {
  Result,
  ValidationError,
  validationResult,
  matchedData,
} from "express-validator"
import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
//import { validateToken } from "../middleware/validateToken"
import { User, IUser } from "../models/User"
import { registerValdations } from "../utils/validations"
import { errorCreator } from "../utils/error-creator"

import dotenv from "dotenv"

const userRouter: Router = Router()
dotenv.config()

interface CustomRequest extends Request {
  user?: JwtPayload
}

// Register a new user
userRouter.post(
  "/register",
  registerValdations,
  async (req: Request, res: Response) => {
    try {
      // Validate and sanitize the incoming data
      const errors: Result<ValidationError> = validationResult(req)

      if (!errors.isEmpty()) {
        const errMsgArr: Record<string, string> = errorCreator(errors.array())

        // If there are errors show them to clint side
        return res.status(400).json({ errors: errMsgArr })
      }

      // Get the validated, sanitized data from req object
      const saitizedData: IUser = matchedData(req)

      const email: string = saitizedData.email
      const password: string = saitizedData.password

      // Check wether a user is already exists with same email
      const existingUser: IUser | null = await User.findOne({
        email: req.body.email,
      })

      // Send respose if user already exists
      if (existingUser) {
        return res.status(403).json({ email: "email already in use" })
      }

      // Generate salt
      const salt: string = bcrypt.genSaltSync(10)
      // Generate hash using above salt
      const hash: string = bcrypt.hashSync(password, salt)

      // Create a user object
      const user: IUser = new User({
        email: email,
        password: hash,
      })

      // Save user in the database
      await user.save()

      return res.status(200).json({ msg: "Registration is successful" })
    } catch (error: any) {
      console.error(`Error during registration: ${error}`)
      return res.status(500).json({ error: "Internal Server Error" })
    }
  }
)

userRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const email: string = req.body.email
    const password: string = req.body.password

    const user: IUser | null = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({ message: "Login failed" })
    }

    if (bcrypt.compareSync(password, user.password)) {
      const jwtPayload: JwtPayload = {
        _id: user._id,
        email: user.email,
      }
      const token: string = jwt.sign(jwtPayload, process.env.SECRET as string, {
        expiresIn: "30m",
      })

      return res.status(200).json({ success: true, token })
    }
    return res.status(401).json({ message: "Login failed" })
  } catch (error: any) {
    console.error(`Error during user login: ${error}`)
    return res.status(500).json({ error: "Internal Server Error" })
  }
})

// List all users
userRouter.get("/", async (req: Request, res: Response) => {
  try {
    const users: IUser[] = await User.find()
    return res.status(200).json(users)
  } catch (error: any) {
    console.log(`Error while fecthing users ${error}`)
    return res.status(500).json({ error: "Internal Server Error" })
  }
})

// Get one user
userRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const user: IUser | null = await User.findOne({ _id: req.params.id })
    return res.status(200).json(user)
  } catch (error: any) {
    console.log(`Error while fecthing an user ${error}`)
    return res.status(500).json({ error: "Internal Server Error" })
  }
})

// This api is used to validate token. The purpose of this is when user first
// access the web application, threre can be a token in front side but
// it may be invallid because of expiration. So user can  be directed to the login page
userRouter.post("/validate-token", (req: Request, res: Response) => {
  const token: string = req.body.token

  if (!token) return res.status(401).json({ message: "Token is missing" })

  try {
    const verified: JwtPayload = jwt.verify(
      token,
      process.env.SECRET as string
    ) as JwtPayload

    console.log(verified)
  } catch (error: any) {
    res.status(401).json({ message: "Access denied, missing token 2" })
  }
})

export default userRouter
