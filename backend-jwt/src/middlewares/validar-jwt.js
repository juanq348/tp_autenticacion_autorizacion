import jwt from 'jsonwebtoken';
import { variablesBd } from '../config/config.js';
import { database } from '../db/database.js';

// Middleware para verificar el token JWT
export default async (req, res, next) => {
    const connection = await database();
    console.log(req.session)
    console.log('-----------')
    console.log(req.cookies)
    const token = req.cookies.authToken || req.session.token;

    if (!token) {
        return res.status(403).json({ message: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, variablesBd.SECRET_KEY);

    // Se busca al usuario en la base de datos
    const [rows] = await connection.query(`SELECT * FROM users WHERE id = ?`, [decoded.userId]);
    const user = rows[0];

    if (!user) {
        return res.status(401).json({ message: 'Token inválido' });
    }

    req.user = user; // Agrega la información del usuario decodificada al request

    next();
};