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

const router: Router = Router()

// Register a new user
router.post(
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

      return res.status(200).json(user)
    } catch (error: any) {
      console.error(`Error during registration: ${error}`)
      return res.status(500).json({ error: "Internal Server Error" })
    }
  }
)

// List all users
router.get("/", async (req: Request, res: Response) => {
  try {
    const users: IUser[] = await User.find()
    return res.status(200).json(users)
  } catch (error: any) {
    console.log(`Error while fecthing users ${error}`)
    return res.status(500).json({ error: "Internal Server Error" })
  }
})

// Get one user
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const user: IUser | null = await User.findOne({ _id: req.params.id })
    return res.status(200).json(user)
  } catch (error: any) {
    console.log(`Error while fecthing an user ${error}`)
    return res.status(500).json({ error: "Internal Server Error" })
  }
})

export default router
