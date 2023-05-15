import { body } from 'express-validator'

export const registervalidation = [
    body('email', 'Not correct email format').isEmail(),
    body('password', 'Not correct cound of characters in password').isLength({ min: 8 }),
    body('fullName', 'Not correct cound of characters in fullname').isLength({ min: 3 }),
    body('avatar', 'Not correct url format of avatar').optional().isURL(),
    body('buyList').optional(),
    body('sellList').optional()
]
export const createvalidation = [
    body('name', 'Not correct email format').isLength({ min: 3 }),
    body('price', 'Not correct url format of avatar').optional(),
    body('countBuyer').optional(),
]