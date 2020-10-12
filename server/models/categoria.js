const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let categoriaSchema = new Schema({

    descripcion: {

        type: String,
        unique: true,
        required: [true, 'La descripción es requerida'],

    },

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },

    estado: {

        type: Boolean,
        default: true
    },

    // cantidad: {

    //     type:

    // }



});


categoriaSchema.methods.toJSON = function() {

    let categoria = this;
    let categoriaObject = categoria.toObject();
    delete categoriaObject.password;

    return categoriaObject;
}


categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unica***' });

module.exports = mongoose.model('Categoria', categoriaSchema);