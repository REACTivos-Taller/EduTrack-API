// src/registry/registry.routes.ts
import { Router } from 'express'
import { addRegistry } from './registry.controller'
import { registryValidator } from '../middleware/validate-registry'

const router = Router()

/**
 * POST /v1/registries/registry
 * Permite al profesor registrar la salida/entrada de un alumno.
 */
router.post('/add', registryValidator, addRegistry)

export default router
