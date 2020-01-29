//
let mongoose = require( 'mongoose');
//mongoose.set('useFindAndModify', false);

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
    },
    findStudentByMatr : function( matr ){
        return Student.find({matricula: matr })
            .then( student => {
                return student;
            })
            .catch( error => {
                return Error( error );
            });
    },
    findStudentByName : function( name ){
        return Student.find({nombre: name })
            .then( student => {
                return student;
            })
            .catch( error => {
                return Error( error );
            });
    },
    createNewStudent : function ( elemento ){
        return Student.create( elemento )
            .then (student =>{
                return student;
            })
            .catch( error => {
                return Error( error );
            });
    },
    updateStudent : function ( matr, datos){

        return Student.findOneAndUpdate( {matricula: matr}, datos )
            .then ( result => {
                return result;
            })
            .catch( error => {
                return Error( error );
            });

    },
    deleteStudent : function ( matr ){
        return Student.remove( {matricula: matr} )
        .then ( result => {
            return result;
        })
        .catch( error => {
            return Error( error );
        });

    }

}

module.exports = {
    StudentList
};

