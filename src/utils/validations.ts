import { body, ValidationChain } from "express-validator"

const registerValdations: ValidationChain[] = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Please enter email")
    .isEmail()
    .withMessage("Invalid email")
    .escape(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password not found")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 2,
      minNumbers: 2,
      minSymbols: 2,
      minUppercase: 1,
    })
    .withMessage(
      `Please enter stong password.
         Password leangth should be minmum 8. 
         Should have minimum 2 lowercase characters. 
         Should have minimum 1 uppercase character. 
         Should have minimum 2 numbers. 
         Should have minimum 2 symbols`
    )
    .escape(),
]

export { registerValdations }
