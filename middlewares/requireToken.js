import jwt from "jsonwebtoken";

export const requireToken = (req, res, next) =>{
    try {
        // console.log('holis')
        let token = req.headers?.authorization;
        // let token =   req.cookies.token;
        // console.log('el token es'+token)
        if(!token) throw new Error("no existe token");
        token = token.split(" ")[1];
        // console.log('el token es: '+token)
        const {uid} = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;
        // console.log(payload)

        next() //lo uso para que siga el siguiente middleware
    } catch (error) {
        console.log(error.message)
        const tokenVerificationError = {
            "invalid signature": "La firma JWT no es válida",
            "jwt expired": "JWT Expirado",
            "invalid token": "Token no valido",
            "No bearer": "Utiliza formato Bearer",
            "jwt malformed": "JWT Mal formado",
            "jwt must be provided": "Debe enviar token"
        }
        return res
            .status(401)
            .send({error: tokenVerificationError[error.message]});
        }
}