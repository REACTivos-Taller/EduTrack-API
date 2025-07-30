import { Router } from 'express'
import { addRegistry, getRegistries } from './registry.controller.js'
import { registryValidator, registryQueryValidator } from '../middleware/validate-registry.js'

const router = Router()

/**
 * POST /v1/registries/registry
 * Permite al profesor registrar la salida/entrada de un alumno.
 */
router.post('/add', registryValidator, addRegistry)

/**
 * GET /v1/registries
 * Obtiene registros filtrados.
 */
router.get('', registryQueryValidator, getRegistries)

export default router
