import { body } from 'express-validator'
import { validateFields, handleErrors } from '../helpers/error-handler'

/**
 * Validador para registrar movimiento de alumnos.
 * Comprueba existencia y formato de studentCardNumber y movementType.
 */
export const movementValidator = [
  // studentCardNumber: debe existir, ser string y contener exactamente 7 dígitos
  body('studentCardNumber', 'Número de carné requerido').notEmpty().isString(),
  body('studentCardNumber', 'El número de carné debe tener 7 dígitos numéricos').matches(
    /^[0-9]{7}$/,
  ),
  // movementType: debe existir y ser 'entry' o 'exit'
  body('movementType', 'Tipo de movimiento requerido').notEmpty().isIn(['entry', 'exit']),

  validateFields,
  handleErrors,
]
