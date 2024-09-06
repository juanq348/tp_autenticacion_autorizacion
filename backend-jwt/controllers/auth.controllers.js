import { database } from '../db/database.js';
import generarJwt from '../helpers/generar-jwt.js';
import validarJwt from '../middlewares/validar-jwt.js';

const app = express();
app.use(express.json());

export const registroUser = async (req,res) => {
    const connection = await database();
    const { username, password } = req.body;

    try {
        const [rows] = await connection.query(`SELECT * FROM users WHERE username = ?`, [username]);
        const user = rows[0];

        if(user){
            return res.status(400).json({msg:"El usuario ya existe"});
        }

        await connection.query(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, password]);

        return res.json({msg: "Se ha registrado con éxito"})
    } catch (error) {
        return res.status(500).json({msg:"Error inesperado"});
    }
};

export const inicioSesion =  async (req, res) => {
    const { username, password } = req.body;
    const connection = await database();

    try {
        const[rows] = await connection.query(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password])
        const user = rows[0];

        if(!user){
            return res.status(401).json({msg:"Las credenciales no coinciden"});
        }

        const token = await generarJwt(user.id);
        req.session.token = token;

        res.cookie('authToken', token,{
            httpOnly: true,
            secure: false,
            maxAge: 3600000
        })

        return res.json({msg:"Inicio de sesión éxitoso"})
    } catch (error) {
        console.error(error);
        return res.status(500).json({msg:"Error inesperado"});
    }
};

export const validarSesion = [
    validarJwt,
    async (req, res) => {
        console.log(req.user);
        return res.json({ msg: "Acceso permitido a área protegida", user: req.user });
    }
];

export const cerrarSesion =  (req, res) => {
    try {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ message: 'Error al cerrar sesión' });
            }

            res.clearCookie('authToken');
            return res.json({ message: 'Cierre de sesión exitoso' });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error Inesperado' });
    }
};