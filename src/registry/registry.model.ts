import { Schema, model, Document } from 'mongoose'

/**
 * Interfaz que representa un registro de salida/entrada de alumno.
 */
export interface RegistryDocument extends Document {
  // Número de carné del alumno, p.ej. "2023179".
  studentCardNumber: string
  // Tipo de movimiento: "entry" cuando regresa, "exit" cuando sale.
  type: 'entry' | 'exit'
  // Fecha y hora en que se registró el movimiento.
  date: Date
}

const RegistrySchema = new Schema<RegistryDocument>({
  studentCardNumber: { type: String, required: true },
  type: { type: String, required: true, enum: ['entry', 'exit'] },
  date: { type: Date, default: () => new Date() },
})

export const Registry = model<RegistryDocument>('Registry', RegistrySchema)
