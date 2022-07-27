import mongoose from "mongoose";

try {
    await mongoose.connect(process.env.URI_MONGO);
    console.log("Conectado a DB 😅")
} catch (error) {
    console.log("Error de conexión a DB");
}