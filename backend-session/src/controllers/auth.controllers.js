import { database } from "../db/database.js"

export const inicioSesion = async (req,res) =>{
    const { username, password } = req.body;
    const connection = await database();
    try {
        const [rows] = await connection.query(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password]);
        if (rows.length > 0){
            const user = rows[0];

            req.session.userId = user.id;
            req.session.username = user.username;

            return res.json({
                message: "Inicio de sesión éxitoso",
                user: {id: user.id, username: user.username}
            });
        } else {
            return res.status(401).json({msg: "Las credenciales no coinciden"})
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error en el servidor");
    }
}

// Ruta para manejar el inicio de sesión
export const registroUser = async (req, res) => {
    const { username, password } = req.body;
    
    try{
    const connection  = await database();

    await connection.query(
        `INSERT INTO users (username, password) VALUES (?, ?)`, [username, password]
    );
    res.send("Registro éxitoso");

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
