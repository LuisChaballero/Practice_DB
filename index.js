let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let jsonParser = bodyParser.json(); //middleware
let { StudentList} = require('./model'); //importar StudentList desde model.js 
let jwt = require('jsonwebtoken');
let {DATABASE_URL, PORT} = require( './config'); //importa las dos variables desde config.js


let app = express();

//Esto es para que funcione el fetch() de repl.it
/*
app.use(function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
    if (req.method === "OPTIONS") {
        return res.send(204);
    }

}); */


app.use(express.static('public')); // Significa que va a haber una parte publica
app.use(morgan('dev'));

let estudiantes = [{
        nombre: "Miguel",
        apellido: "Ángeles",
        matricula: 1730939
    },
    {
        nombre: "Erick",
        apellido: "González",
        matricula: 1039859
    },
    {
        nombre: "Victor",
        apellido: "Villareal",
        matricula: 1039863
    },
    {
        nombre: "Victor",
        apellido: "Cardenas",
        matricula: 1282598
    }
];

// Endpoint 1
//First simple get

// Endpoint 2
app.get('/api/getById', (req, res) => {
    let id = req.query.id;

    let result = estudiantes.find((elemento) => {
        if (elemento.matricula == id) {
            return elemento;
        }
    });

    if (result) {
        return res.status(200).json(result);
    } else {
        res.statusMessage = "El alumno no se encuentra en la lista";
        return res.status(404).send();
    }
});

// Endpoint 3 getByName/:name
app.get('/api/getByName/:name', (req, res) => {
    let name = req.params.name;

    StudentList.findStudentByName(name)
        .then( student => {
            if (!student.length){
                res.statusMessage = "Alumno no encontrado";
                return res.status(404).send();               
            }
            else{
                return res.status(200).json(student);           
            }

        })
        .catch( error => {
            return Error (error);

        });
});
/* Primer ejemplo de un post
app.post( '/api/newStudent', jsonParser, ( req, res) =>{
    console.log( req.body );
    res.status(200).json({});
    
}); */
/*

//Hacer POST
// url = /api/newStudent
// Validar que el request tenga nombre, apellido y matricula. Arrojar un 406 si falta uno
// Matricula debe ser unica. Arrojar 409 si ya existe matricula
// En el exito agregar el estudiante a la lista. Regresar res con status 201 y el estudiante agregado
app.post('/api/newStudent', jsonParser, (req, res) => {
    console.log(req.body);

    let Fname = req.body.nombre;
    let Lname = req.body.apellido;
    let id = req.body.matricula;
    // using == "" also works 
    if (Fname === undefined || Lname === undefined || id === undefined) {
        res.statusMessage = "Datos incompletos";
        return res.status(406).send();
    }

    estudiantes.filter((elemento) => {
        if (elemento.matricula == id) {
            res.statusMessage = "Estudiante ya esta en la lista";
            return res.status(409).send();
        }
    });

    //console.log( req.body );
    res.statusMessage = "Estudiante agregado"
    return res.status(201).json({});

}); */


/* Hacer PUT
 url = /api/updateStudent/:id  --> req.params
 Validar que:
 a) Que el request tenga matricula y alguno de los siguientes: nombre, apellido
    Arrojar 406 si falta alguno.
 b) Que el parametro id coincida con la matricula del body.
    Arrojar 409 si no son iguales.

 c) Que el id a modificar exista en el arreglo de estudiantes
    Arrojar 404 si no se encuentra.
 En exito, actualizar el estudiante. Regresar res con status 202 y el estudiante modificado.

*/

/* Hacer DELETE
 url = /api/deleteStudent?id=matricula   --> req.query
 Hay que validar que:
 a) Que el request tenga la matricula
    Arrojar 406 si no se encuetra.
 b) Que el parametro id coincida con la matricula del body.
    Arrojar 409 si no son iguales.
 c) Que el id a eliminar exista en el arreglo de estudiantes
    Arrojar 404 si no se encuentra
 En exito, borrar el estudiante de la lista. Regresar status 204 (No se regresa nada)

*/
/*
app.listen()
*/
//Nuevos Endpoints 

app.get('/api/students', (req, res) => {
    //res -->  la respuesta que vamos a enviar

    StudentList.getAll()
        //Como es una promesa, tiene que esperar a una respuesta
        //Por eso se usa .then()
        .then(studentList => {
            return res.status(200).json(studentList);
        })
        .catch(error => {
            res.statusMessage = "Hubo un error de conexion"
            //se tiene que enviar algo para que funcione -> .send()
            return res.status(400).send();
        });


    //res.status( 200 ).json( estudiantes ); sin usar studentList 
    // http://localhost:8080/api/students
});

//Mongoose POST
app.post('/api/newStudent', jsonParser, (req, res) => {
    
    let nNombre = req.body.nombre;
    let nApellido = req.body.apellido;
    let nMatricula = req.body.matricula;
/*
    if (nNombre == "" || nApellido == "" || nMatricula == ""){
        res.statusMessage = "Datos Faltantes para agregar estudiante";
        return res.status(400).send();
    } */

    if (nNombre == undefined || nApellido == undefined || nMatricula == undefined){
        res.statusMessage = "Datos Faltantes para agregar estudiante";
        return res.status(406).send();
    }

    StudentList.findStudentByMatr(nMatricula)
        .then( result => {
            if (!result.length){
                console.log("nuevo");
                let nuevoEstudiante = {
                    nombre: nNombre,
                    apellido: nApellido,
                    matricula: nMatricula
                }
                StudentList.createNewStudent(nuevoEstudiante)
                    .then( student => {
                        res.statusMessage = "Estudiante agregado a la base de datos";
                        return res.status(201).send(student);
                    })
                    .catch( error => {
                        return Error( error );
                    });
            }
            else{
                res.statusMessage = "Estudiante ya se encuentra en la base de datos";
                return res.status(409).send();
            }
        })      
});
/*
url = /api/updateStudent/:id  --> req.params
Validar que:
a) Que el request tenga matricula y alguno de los siguientes: nombre, apellido
   Arrojar 406 si falta alguno.
b) Que el parametro id coincida con la matricula del body.
   Arrojar 409 si no son iguales.

c) Que el id a modificar exista en el arreglo de estudiantes
   Arrojar 404 si no se encuentra.
En exito, actualizar el estudiante. Regresar res con status 202 y el estudiante modificado.*/
app.put('/api/updateStudent/:id', jsonParser, ( req, res ) => {
    let id = req.params.id;
    let nMatricula = req.body.matricula;
    let nNombre = req.body.nombre;
    let nApellido = req.body.apellido;

    if(nMatricula != undefined && (nNombre != undefined || nApellido != undefined)){
        if(id == nMatricula){
            let updatedStudent ={}

            if (nNombre != ""){
                updatedStudent.nombre = nNombre;
            }
    
            if (nApellido != ""){
                updatedStudent.apellido = nApellido;
            }

            StudentList.updateStudent(id, updatedStudent)
                .then( result => {
                    console.log("hola")
                    console.log(result);
                    if (result){
                        return res.status(200).json(result);                  
                    }
                    else{
                        res.statusMessage = "Alumno no encontrado con dicha matricula";
                        return res.status(404).send();
                    }

                })
                .catch( error => {
                    return Error( error );
                });

        }
        else{
            res.statusMessage = "Id no coincide con matricula";
            return res.status(409).send();
        }
    }
    else{
        res.statusMessage = "Parametros incompletos";
        return res.status(406).send();

    }

});

/* Hacer DELETE
 url = /api/deleteStudent?id=matricula   --> req.query
 Hay que validar que:
 a) Que el request tenga la matricula
    Arrojar 406 si no se encuetra.
 b) Que el parametro id coincida con la matricula del body.
    Arrojar 409 si no son iguales.
 c) Que el id a eliminar exista en el arreglo de estudiantes
    Arrojar 404 si no se encuentra
 En exito, borrar el estudiante de la lista. Regresar status 204 (No se regresa nada)

*/
app.delete('/api/deleteStudent', ( req, res ) => {
    id = req.query.id;

    if( id != ""){
        StudentList.deleteStudent(id)
            .then( result =>{
                    console.log(result);

                if (result.length > 0){
                    return res.status(204).send();                         
                }
                else{               
                    res.statusMessage = "Estudiante no encontrado";
                    return res.status(404).send();
                }
            })
            .catch( (error) => {
                return Error (error);
            });
    }
    else{
        res.statusMessage = "Matricula no dada";
        return res.status(406).send();
    }
});

// Endpoint de login sin base de datos

app.post('/api/login', jsonParser, ( req, res) => {

    let user = req.body.user;
    let password = req.body.password;

    //Validar el usuario en la BD antes de generar el token

    let data = {
        user
    };
    //token tiene: duracion de vida, informacion que quieres guardar encriptada, formato

    let token = jwt.sign(data, 'secret', {
        expiresIn: 60 * 5
    });

    return res.status(200).json( {token} );

});

//Ir a "Authorization" y seleccionar "Bearer token" y poner el token
app.get('/api/validate', (req, res) =>{
    let token = req.headers.authorization;
    token = token.replace('Bearer ','');
    jwt.verify( token, 'secret', (err, user) =>{
        if ( err ){
            res.statusMessage = "Token no valido";
            return res.status(400).send();
        }

        console.log(user);
        return res.status(200).json({ message : "Exito"});
    });
    //console.log(req.headers)
  
    // En el success del fetch del login guardar el token (usar localStorage).
    // localStorage.setItem('token', 'vIJBKJbkfe...');
    // localStorage.getItem('token');

});



let server;

function runServer(port, databaseUrl) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, response => {
            // Si hay un response del mongoose.connect
            // significa que fallo algo
            if (response) {
                return reject(response);
            } else {
                server = app.listen(port, () => {
                        console.log("App is running on port " + port);
                        resolve();
                    })
                    .on('error', err => {
                        mongoose.disconnect();
                        return reject(err);
                    })
            }
        });
    });
}

function closeServer() {
    return mongoose.disconnect()
        .then(() => {
            return new Promise((resolve, reject) => {
                console.log('Closing the server');
                server.close(err => {
                    if (err) {
                        return reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        });
}

runServer( PORT, DATABASE_URL );

module.exports = { app, runServer, closeServer}