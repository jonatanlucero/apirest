import 'dotenv/config' //para que todos los archivos puedan acceder a las variables de entorno 
import './database/dbconnect.js';
import authRouter from './routes/auth.route.js'
import express from 'express'; //puede usar el import porque coloque en el package.json type: module
const app = express();

//se habilita urlencoded para leer las solicitudes de los formularios.. en el caso de la api no es necesario.
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); //lo habilitamos a express para que pueda leer los json
app.use("/api/v1", authRouter); //para usar el middleware que creamos
app.get("/", (req, res) =>{
    console.log("😀");
    res.json({ok: "hola"})
})


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => 
    console.log("Funcionando 🔥🔥")
);

