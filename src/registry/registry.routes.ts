// src/registry/registry.routes.ts
import { Router } from 'express'
import { registerMovement } from './registry.controller'
import { movementValidator } from '../middleware/validate-movement'

const router = Router()

/**
 * POST /v1/registries/registry
 * Permite al profesor registrar la salida/entrada de un alumno.
 */
router.post('/registry', movementValidator, registerMovement)

export default router
