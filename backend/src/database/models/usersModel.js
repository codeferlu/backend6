const database = require('../dbConfig');
const { handleHashPassword } = require('../../utils/utils')

const addUser = async (email, password, role) => {

    try {

        const passwordHash = await handleHashPassword(password)

        const consulta = "INSERT INTO usuarios (id, email, password, role) values (DEFAULT, $1, $2,$3) RETURNING *;"
        const values = [email, passwordHash, role]

        const { rowCount } = await database.query(consulta, values)

        if (rowCount) {

            return {
                msg: 'Usuario registrado'
            }

        } else {
            return {
                msg: 'Usuario no registrado'
            }
        }

    } catch (error) {
        const customError = new Error('Error generado en la base de datos en la query de addUser')

        customError.code = 404;
        customError.origin = 'DATABASE'
        customError.type = 'Register User'

        throw customError
    }

}

const getUserByEmail = async (email) => {
    const consulta = "SELECT * FROM usuarios WHERE email = $1;"
    const values = [email]

    const { rows } = await database.query(consulta, values)

    const user = rows[0];

    return user.email
}

const getPasswordUserByEmail = async (email) => {
    const consulta = "SELECT * FROM usuarios WHERE email = $1;"
    const values = [email]

    const { rows } = await database.query(consulta, values)

    const user = rows[0];

    return user.password
}




const UsersCollection = {
    getPasswordUserByEmail,
    getUserByEmail,
    addUser
}



module.exports = {
    UsersCollection
}