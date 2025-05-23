import { pool } from "../database.js";

export const Login = async (request, response, next) => {

    try {
        const { nickname, senha } = request.body;


        const [usuario] = await pool.query(`SELECT * FROM Login WHERE nickname = ? AND senha = ?`, [nickname, senha]);

        if (usuario.length > 0) {
            return response.status(200).json({
                success: true,
                message: "Login autorizado",
                user: usuario[0]
            });
        }

        return response.status(401).json({
            success: false,
            message: "Credenciais inválidas"
        });

    } catch (error) {
        console.error('Erro no login:', error);
        return response.status(500).json({
            success: false,
            message: "Erro interno do servidor"
        });
    }

};

export const UserType = async (request, response, next) => {

    try {
        const { nickname } = request.body;


        const [user] = await pool.query(`SELECT * FROM Login WHERE nickname = ?`, [nickname]);

        if (user.length > 0) {

            const [cliente] = await pool.query(`SELECT idCliente FROM Cliente WHERE idLogin = ?`, [user[0].idLogin]);

            const [consultor] = await pool.query(`SELECT idConsultor FROM Consultor WHERE idLogin = ?`, [user[0].idLogin]);


            //RETORNA 0 = CONSULTOR  ;  1 = CLIENTE

            if (cliente.length > 0) {

                //console.log("dentro do cliente backend " + cliente[0].idCliente);

                return response.status(200).json({
                    success: true,
                    message: "1",
                    user: cliente[0].idCliente
                });
            }

            if (consultor.length > 0) {

                //console.log("dentro do consultor backend " + consultor[0].idConsultor);

                return response.status(200).json({
                    success: true,
                    message: "0",
                    user: consultor[0].idConsultor
                });
            }

            return response.status(401).json({
                success: false,
                message: "ADMIN"
            });
        }

        return response.status(401).json({
            success: false,
            message: "Não usuário com este nickname!"
        });


    } catch (error) {
        console.error('Erro:', error);
        return response.status(500).json({
            success: false,
            message: "Erro interno do servidor"
        });
    }

};