import { body, query } from 'express-validator'
import { validateFields, handleErrors } from '../helpers/error-handler.js'

/**
 * Validador para registrar movimiento de alumnos.
 * Comprueba existencia y formato de studentCardNumber y movementType.
 */
export const registryValidator = [
  // studentCardNumber: debe existir, ser string y contener exactamente 7 dígitos
  body('studentCardNumber', 'Número de carné requerido').notEmpty().isString(),
  body('studentCardNumber', 'El número de carné debe tener 7 dígitos numéricos').matches(
    /^[0-9]{7}$/,
  ),
  // movementType: debe existir y ser 'entry' o 'exit'
  body('type', 'Tipo de movimiento requerido').notEmpty().isIn(['entry', 'exit']),
  // classroom: debe existir y ser un string
  body('classroom', 'Salón requerido').notEmpty().isString(),

  validateFields,
  handleErrors,
]

/**
 * Valida GET /v1/registries
 */
export const registryQueryValidator = [
  query('classroom').optional().isString().withMessage('Salón inválido'),
  query('studentCardNumber')
    .optional()
    .matches(/^[0-9]{7}$/)
    .withMessage('Carné debe tener 7 dígitos'),
  query('startDate').optional().isISO8601().withMessage('Fecha inválida'),
  query('duration').optional().isInt({ min: 1 }).withMessage('Duración inválida'),
  validateFields,
]
