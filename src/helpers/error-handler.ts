import { validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'

export const validateFields = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    next(errors)
    return
  }
  next()
}

export const handleErrors = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.status === 400 || err.errors) {
    res.status(400).json({
      success: false,
      errors: err.errors,
    })
    return
  }
  res.status(500).json({
    success: false,
    message: err.message,
  })
  return
}
