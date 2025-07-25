import { Request, Response, NextFunction } from 'express'
import { Registry } from './registry.model'

/**
 * Registra la salida o entrada de un alumno.
 * Recibe en el body:
 * {
 *   studentCardNumber: string;
 *   movementType: 'entry' | 'exit';
 * }
 */
export const registerMovement = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { studentCardNumber, movementType } = req.body

    const newRecord = await Registry.create({
      studentCardNumber,
      movementType,
    })

    res.status(201).json({
      message: `Se ha registrado la ${movementType} del alumno con carné ${studentCardNumber}.`,
      record: newRecord,
    })
  } catch (error) {
    next(error)
  }
}
