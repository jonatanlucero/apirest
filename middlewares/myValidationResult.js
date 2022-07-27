//Creo mi propio middleware para el manejor de errores
//al usuar el export puedo usar el manejo de errores en los otros archivos de mi aplicación

import { validationResult } from "express-validator";
export const myValidationResult = (req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    next(); 
}