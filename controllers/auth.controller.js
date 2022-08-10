// import { validationResult } from "express-validator";
import {User} from '../models/User.js';
import jwt  from 'jsonwebtoken';
import { generateRefreshToken, generateToken } from '../utils/generateToken.js';

export const register = async (req, res) =>{
    // const errors = validationResult(req);
    // if(!errors.isEmpty()){
    //     return res.status(400).json({errors: errors.array()})
    // }  
    console.log(req.body);
    // res.json({ok: 'Register'})
    const {email, password} = req.body;
    try {
        //alternativa 2 .. busca otro usuario
        let user = await User.findOne({email}) //el modelo .findOne, es el modelo que tiene la capacidad de buscar en la base de datos
        if(user) throw{ code: 11000} //el throw es un return
        user = new User({email: email, password: password})
        await user.save();
        //mandar jwt


        //return res.json({ok: true})
        return res.status(201).json({ok: true})

    } catch (error) {
        console.log(error.code);
        //alternativa por defecto mongoose
        if(error.code === 11000){
            return res.status(400).json({error: 'llave duplicada'})
        }
    }
};

export const login = async(req, res) => {
    const {email, password} = req.body;
    console.log(req.body)
    try { 
        let user = await User.findOne({email})
        if(!user) throw new Error("El usuario no existe")

        const repuestaPassword = await user.comparePassword(password);
        if(!repuestaPassword)
            return res.status(403).json({error: "contraseña incorrecta"});
        
        //GENERAR TOKEN CON JWT
        const {token, expiresIn} = generateToken(user.id)
        generateRefreshToken(user.id, res)
        // res.cookie("token", token, {
        //     httpOnly: true,
        //     secure: false
        //     // secure: !(process.env.MODO === "developer")
        // })

        return res.json({token, expiresIn});

    } catch (error) {
        return res.status(500).json({error: error.message})
    }
    res.json({ok: 'Login'})
};

export const infoUser = async (req, res) => {
    try {
        const user = await User.findById(req.uid).lean() //con lean devuelve un objeto plano .. es un metodo de mongoose
        return res.json({email: user.email})
    } catch (error) {
        return res.status(500).json({error: 'Error de servidor'})
        // console.log(error)
    }
}

export const refreshToken = (req, res) => {
    try {
        // console.log(req)
        const refreshTokenCookie = req.cookies.refreshToken;
        if(!refreshTokenCookie) throw new Error("no existe el token")
        const {uid} = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);
        const {token, expiresIn} = generateToken(uid);
        return res.json({token, expiresIn})
    } catch (error) {
        console.log(error.message)
        
    }
}

export const logout = (req, res) =>{
    res.clearCookie('refreshToken');
    res.json({ok: true})
}