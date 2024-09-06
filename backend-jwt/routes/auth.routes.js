import { Router } from "express";
const router = Router();
import {registroUser, inicioSesion, validarSesion, cerrarSesion} from "../controllers/auth.controllers.js"

router.post('/register', registroUser)
router.post('/login', inicioSesion)
router.get('/session', validarSesion)
router.post('/logout', cerrarSesion)

export { router }