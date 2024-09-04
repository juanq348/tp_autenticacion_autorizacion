import { database } from "../db/database.js"

export const inicioSesion = async (req,res) =>{
    const { username, password } = req.body;

    
}

// Ruta para manejar el inicio de sesión
export const registroUser = async (req, res) => {
    const { username, password } = req.body;
    
    try{
    const connection  = await database();

    await connection.query(
        `INSERT INTO users (username, password) VALUES (?, ?)`, [username, password]
    );
    res.send("Sesión iniciada con éxito");

    connection.end();
    } catch (error){
        console.error(error);
        res.status(500).send("Error en el servidor");
    }
};

// Ruta para obtener los datos de la sesión
export const obtenerDatos = 
async (req, res) => {
    try {
        const connection = await database();
        const results = await connection.query(`SELECT * FROM users`);
        res.json(results[0]);
        connection.end();
    } catch (error) {
        console.error(error);
        res.status(500).send("Error en el servidor");
    }
};

// Ruta para cerrar la sesión
export const cerrarSesion = 
async (req, res) => {
    console.log(req.session)
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Error al cerrar la sesión' });
        }
        res.clearCookie('connect.sid'); // Nombre de cookie por defecto para express-session
        return res.json({ message: 'Sesión cerrada exitosamente' });
    });
};
