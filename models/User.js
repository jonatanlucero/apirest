import bcryptjs from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        index: {unique: true},
    },
    password: {
        type: String,
        required: true,
    }
});

//Esto es el esquema.. podemos hacer que antes de grabar en la base de datos
//se hashee la contraseña
//el hasheo de la contraseña solo se debe hacer una vez al momento de grabar la contraseña o al actualizarla
userSchema.pre("save", async function(next) { //uso una función para poder usar el valor de this el cual contiene user y password
    const user = this;
    if(!user.isModified("password")) return next(); //si el password no se modifica no se pasa al proceso de hash
    try {
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(user.password, salt);
        next()

    } catch (error) {
        console.log(error);
        throw new Error('Fallo en el hash de la contreaseña');
    }
})

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcryptjs.compare(candidatePassword, this.password);
}

export const User = mongoose.model("user", userSchema) //con el export lo exporto para poder usarlo en los otros archivos