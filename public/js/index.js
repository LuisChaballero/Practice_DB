//import { response } from "express";

function loadStudents(){
    let url = "/api/students";
    let settings = {
        method : "GET"
    };
    fetch(url, settings)
        .then( response => {
            if( response.ok ){
                return response.json();
            }
        })
        .then( responseJSON => {
            displayResults( responseJSON);
        });
}
/*
function addStudent(){
    $.ajax({
        url: '/api/newStudent',
        method: "POST",
        data: JSON.stringify({nombre: "A", apellido: "S", matricula: 123 }),
        contentType: "application/json",
        dataType: "json",
        success: function()
        error: 
    });
}
*/
function displayResults(responseJSON){
    $('#studentList').empty();
    for(let i=0; i < responseJSON.length; i++){
         $('#studentList').append(`
            <li>
                ${responseJSON[i].nombre} ${responseJSON[i].apellido}
            </li>
         
         `);
    }

}
/*
function fetch(){
    $.ajax({
        url: url,
        method: "POST",
        data: JSON.stringify({nombre: "Alfredo", apellido: "Salazar"}),
        contentType: "application/json",
        dataType: "json",
        success:
    })
}  */

function init(){
    loadStudents();
}

init();