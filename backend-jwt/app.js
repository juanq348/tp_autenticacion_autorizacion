// server.js
import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import cors from 'cors';
import morgan from 'morgan';
import { variablesBd } from './src/config/config.js';
import router from './src/routes/auth.routes.js'

const app = express();

app.use(cors({
    origin: ['http://localhost:5500', 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: variablesBd.SECRET_SESSION, // Cambia esto por una clave secreta en producción
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Usar 'true' si usas HTTPS
}));

app.use(router);

// Servidor escuchando
app.listen(variablesBd.PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${variablesBd.PORT}`);
});
