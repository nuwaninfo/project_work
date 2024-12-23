import { Request, Response, Router } from "express"
import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
//import { validateToken } from "../middleware/validateToken"
import { User, IUser } from "../models/User"

const router: Router = Router()

// Register a new user
router.post("/api/user/register", async (req: Request, res: Response) => {
  const email: string = req.body.email
  const password: string = req.body.password

  try {
    // Check wether a user is already exists with same email
    const existingUser: IUser | null = await User.findOne({
      email: req.body.email,
    })
    console.log(existingUser)
    if (existingUser) {
      return res.status(403).json({ email: "email already in use" })
    }

    const salt: string = bcrypt.genSaltSync(10)
    const hash: string = bcrypt.hashSync(password, salt)

    const user: IUser = new User({
      email: email,
      password: hash,
    })

    await user.save()

    //return res.status(200).json(newUser)
  } catch (error: any) {
    console.error(`Error during registration: ${error}`)
    return res.status(500).json({ error: "Internal Server Error" })
  }
})

export default router
