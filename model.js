//
let mongoose = require( 'mongoose');

mongoose.Promise = global.Promise;

//La definicion del esquema de la coleccion del estudiante
let studentCollection = mongoose.Schema({
    nombre: {type: String},
    apellido: {type: String},
    matricula: {
        type: Number,
        required: true,
        unique: true 
    }
});

//La conexion a la base de datos
let Student = mongoose.model( 'students', studentCollection );

//StudentList es donde vienen los querys
let StudentList = {
    getAll : function(){
        return Student.find()
            .then( students => {
                return students;
            })
            .catch( error => {
                return Error(error);
            });
    }
};

module.exports = {
    StudentList
};

