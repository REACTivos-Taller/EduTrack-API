import { Router } from 'express'
import { addRegistry, getRegistries } from './registry.controller'
import { registryValidator, registryQueryValidator } from '../middleware/validate-registry'

const router = Router()

/**
 * POST /v1/registries/registry
 * Permite al profesor registrar la salida/entrada de un alumno.
 */
router.post('/registry', registryValidator, addRegistry)

/**
 * GET /v1/registries
 * Obtiene registros filtrados.
 */
router.get('/', registryQueryValidator, getRegistries)

export default router
