import { Router } from "express"
const router  = Router()

import { inicioSesion, obtenerDatos, cerrarSesion, registroUser } from "../controllers/auth.controllers.js"

router.post('/register', registroUser)
router.post('/login', inicioSesion)
router.get('/session', obtenerDatos)
router.post('/logout', cerrarSesion)

export {router}