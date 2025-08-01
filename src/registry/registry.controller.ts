import { Request, Response, NextFunction } from 'express'
import { Registry } from './registry.model.js'

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
    const { studentCardNumber, type, classroom } = req.body

    const newRecord = await Registry.create({
      studentCardNumber,
      type,
      classroom,
    })

    res.status(201).json({
      message: `Se ha registrado la ${type} del alumno ${studentCardNumber} en el salón ${classroom}.`,
      record: newRecord,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Obtiene registros de alumnos filtrados por salón, número de carné o rango de fechas.
 * Query params opcionales:
 *  - classroom: string
 *  - studentCardNumber: string (7 dígitos)
 *  - startDate: string 'YYYY-MM-DD'
 *  - duration: number (días)
 */
export const getRegistries = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { classroom, studentCardNumber, startDate, duration } = req.query
    const filter: any = {}

    if (classroom) filter.classroom = classroom as string
    if (studentCardNumber) filter.studentCardNumber = studentCardNumber as string

    // Filtrado por fecha en campo `date`
    const now = new Date()
    const dateFilter: any = {}
    if (startDate) {
      const start = new Date(startDate as string)
      if (duration) {
        const days = parseInt(duration as string, 10)
        const end = new Date(start.getTime() + days * 86_400_000)
        dateFilter.$gte = start
        dateFilter.$lte = end
      } else {
        dateFilter.$gte = start
      }
    } else if (duration) {
      const days = parseInt(duration as string, 10)
      const start = new Date(now.getTime() - days * 86_400_000)
      dateFilter.$gte = start
      dateFilter.$lte = now
    }
    if (Object.keys(dateFilter).length) {
      filter.date = dateFilter
    }

    const records = await Registry.find(filter).sort({ date: -1 })
    res.json({ records })
  } catch (error) {
    next(error)
  }
}
