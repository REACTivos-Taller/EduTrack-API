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
export const addRegistry = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { studentCardNumber, type } = req.body

    const newRecord = await Registry.create({
      studentCardNumber,
      type,
    })

    res.status(201).json({
      message: `Se ha registrado la ${type} del alumno con carné ${studentCardNumber}.`,
      record: newRecord,
    })
  } catch (error) {
    next(error)
  }
}
