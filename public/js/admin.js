
const navbar = document.getElementById('barra-nav')
navbar.style.display = 'none' // stilo para sacar la barra de nevegacion en el admin dashboard



// poner letra de usuario segun nombre
const nombreUser = document.getElementById('nombre-user')
const letraUser = document.getElementById('letra-user')

let letra = nombreUser.innerText
letraUser.innerHTML = letra.substring(0, 1).toUpperCase()

// poner el nombre del admin el titulo de la pestagna
const titulo = document.getElementById('titulo')
titulo.innerHTML = `Dashboard | ${nombreUser.innerText}`


// variables de los elementos a manejar
var infoAdmin = document.getElementById("info-admin");
let tareasAdmin = document.getElementById('tareas-admin')
const dashboard = document.getElementById('text-dashboard')
const ajouter = document.getElementById('text-ajouter')
const config = document.getElementById('text-config')
const quiter = document.getElementById('text-quiter')
const itemsQuiter = document.getElementById('quiter')

//variables para los items del menu del sidebar
const dashboardItems = document.getElementById('dashboard')
const ajouterItems = document.getElementById('ajouter')
const configItems = document.getElementById('config')
const quiterItems = document.getElementById('quiter')

// variable para los contenedores de las info del menu
const dashboardInfo = document.getElementById('dashboardInfo')
const ajouterInfo = document.getElementById('ajouterInfo')


//--INICIO DE FUNCIONES DE MANEJO DE ESTADOS DEL FRONTEN

function ToggleFuncion() {
  //funcion para le toggle de la barra de navegacion

  itemsQuiter.classList.toggle('quiter-reducido')
  dashboard.classList.toggle('display-items-hidden')
  ajouter.classList.toggle('display-items-hidden')
  config.classList.toggle('display-items-hidden')
  quiter.classList.toggle('display-items-hidden')

  tareasAdmin.classList.toggle('tareas-admin')
  tareasAdmin.classList.toggle('aumentar-tarea-admin')
  infoAdmin.classList.toggle("info-admin");
  infoAdmin.classList.toggle("reduccion-info-admin");
  console.log('click on menu button')
}

//funciones de los diferentes menus


function SelectDashboard() {
  // resaltar el elmento seleccionado
  dashboardItems.classList.add('items-select')
  configItems.classList.remove('items-select')
  ajouterItems.classList.remove('items-select')
  // mostrar info del elemento seleccionda
  dashboardInfo.classList.remove('display-info-hidden')
  ajouterInfo.classList.add('display-info-hidden')


}

function SelectAjouter() {
  // resaltar el elmento seleccionado
  ajouterItems.classList.add('items-select')
  dashboardItems.classList.remove('items-select')
  configItems.classList.remove('items-select')
  // monstrar info del elemento seleccionado
  dashboardInfo.classList.add('display-info-hidden')
  ajouterInfo.classList.remove('display-info-hidden')

}

function SelectConfig() {
  // resaltar el elmento seleccionado
  configItems.classList.add('items-select')
  ajouterItems.classList.remove('items-select')
  dashboardItems.classList.remove('items-select')
  // monstrar info del elemento seleccionado

}
//variables para los input del formulario add-user
let nombre = document.getElementsByName('nombre')[0]
let apellidos = document.getElementsByName('apellidos')[0]
const matricula = document.getElementsByName('matricula')[0]
const departamento = document.getElementsByName('departamento')[0]
//variables para los input del formulario edite-user
let nombreEdite = document.getElementById('nombre')
let apellidosEdite = document.getElementById('apellidos')
const matriculaEdite = document.getElementById('matricula')
const departamentoEdite = document.getElementById('departamento')
const jefe = document.getElementById('piloto')
const estado = document.getElementById('estado')
const id = document.getElementById('id')
//------------------------------------------------------------------------------
const alertaServidor = document.getElementById('alerta')// variable para el alerta
const alertaEdite = document.getElementById('alertaEdite')

//----------------------------------------------------------

function getUser() {
  fetch(`http://localhost:3001/list/user`)
    .then(res => res.json())
    .then(user => {
      body = ''
      for (i = 0; i < user.userFound.length; i++) {
        body += `
        <tr>
          <td scope="col">${user.userFound[i].matricula}</td>
          <td scope="col">${user.userFound[i].apellidos.toUpperCase()}</td>
          <td scope="col">${user.userFound[i].nombre.toUpperCase()}</td>
          <td scope="col">${user.userFound[i].departamento}</td>
          <td scope="col">${user.userFound[i].jefe}</td>
          <td scope="col">${user.userFound[i].fecha_de_alta}</td>
          <td scope="col">${user.userFound[i].creado_por.matricula}</td>
          <td scope="col" class="estado">${user.userFound[i].estado}</td>
          <td scope="col">
            <button data-bs-toggle="modal" data-bs-target="#editarUsuario" id="${user.userFound[i]._id}" class="boton-editar">Editer</button>
          </td>
          
        
       </tr>

        `
      }
      document.getElementById('tablaBody').innerHTML = body
    })
}

getUser()


function handleSubmit(event) {
  // funcion para manejar el formulario de agregar un nuevo usuario
  event.preventDefault()

  const data = {
    nombre: nombre.value,
    apellidos: apellidos.value,
    matricula: matricula.value,
    departamento:departamento.value
   
    
  }
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }

  fetch(`http://localhost:3001/register/user`, options)
    .then(res => res.json())
    .then(inf => {
      if (inf.alerta[0].text == 'exito') {
        alertaServidor.innerText = 'Nouvel utilisateur ajouté avec succès'
        alertaServidor.classList.remove('alert-danger')
        alertaServidor.classList.add('alert-success')
        alertaServidor.classList.remove('display-alerta')
        nombre.value = ''
        apellidos.value = ''
        departamento.value = 'none'
        matricula.value = ''
        getUser()
      } else {
        alertaServidor.classList.remove('alert-success')
        alertaServidor.classList.add('alert-danger')
        alertaServidor.classList.remove('display-alerta')
        alertaServidor.innerText = inf.alerta[0].text
        setTimeout(function(){
          alertaServidor.classList.add('display-alerta')
      }, 2000);
      }

    }).catch(err=>console.log(err))
    
}
 

function handleBusqueda(event){
  // funcion para realizar una busqueda de un usuario por su nombre 
  event.preventDefault()
  let parametro = document.getElementById('valorBusqueda').value
  const data = {
    valorBusqueda:parametro.toLowerCase()
  }
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }

  fetch(`http://localhost:3001/buscar/user`,options)
  .then(res => res.json())
  .then(user => {
    body = ''
    for (i = 0; i < user.userFound.length; i++) {
      body += `
      <tr>
        <td scope="col">${user.userFound[i].matricula}</td>
        <td scope="col">${user.userFound[i].apellidos.toUpperCase()}</td>
        <td scope="col">${user.userFound[i].nombre.toUpperCase()}</td>
        <td scope="col">${user.userFound[i].departamento}</td>
        <td scope="col">${user.userFound[i].jefe}</td>
        <td scope="col">${user.userFound[i].fecha_de_alta}</td>
        <td scope="col">${user.userFound[i].creado_por.matricula}</td>
        <td scope="col" class="estado">${user.userFound[i].estado}</td>
        <td scope="col">
          <button data-bs-toggle="modal" data-bs-target="#editarUsuario" id="${user.userFound[i]._id}" class="boton-editar">Editer</button>
        </td>
     </tr>

      `
    }
    document.getElementById('tablaBody').innerHTML = body
    
  })
}

// funcion para seleccionar el usuario a editar
document.addEventListener('click', e=>{
  let id = e.target.id

  if(id[0]=='6'){
    console.log(id)
    fetch(`http://localhost:3001/edite/user/${id}`)
      .then(res=>res.json())
      .then(usr=>{
       document.getElementById('departamento').value = usr.usuario.departamento
       document.getElementById('matricula').value = usr.usuario.matricula
       document.getElementById('apellidos').value = usr.usuario.apellidos
       document.getElementById('nombre').value = usr.usuario.nombre
       document.getElementById('estado').value = usr.usuario.estado
       document.getElementById('piloto').value = usr.usuario.jefe
       document.getElementById('id').value = usr.usuario._id
      })
  }else{
   
  }
})


function handleEditar(event) {
  // funcion para manejar el formulario de editar
  event.preventDefault()

  const data = {
    id: id.value,
    nombre: nombreEdite.value,
    apellidos: apellidosEdite.value,
    matricula: matriculaEdite.value,
    departamento:departamentoEdite.value,
    jefe:jefe.value,
    estado:estado.value
  }
  
  const respuesta = confirm('VOUS ETES SURE DES MODIFICATIONS?')
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }
  if(respuesta){
    fetch(`http://localhost:3001/edite/user`,options)
      .then(res => res.json())
      .then(usr=>{
        console.log(usr.respuesta)
        if(usr.respuesta.tipo=='exito'){
          console.log('guardado')
          alertaEdite.innerText = usr.respuesta.sms
          alertaEdite.classList.remove('alert-danger')
          alertaEdite.classList.add('alert-success')
          alertaEdite.classList.remove('display-alerta')
          getUser()
        }else{
          console.log(usr.respuesta.sms)
          alertaEdite.classList.remove('alert-success')
          alertaEdite.classList.add('alert-danger')
          alertaEdite.classList.remove('display-alerta')
          alertaEdite.innerText = usr.respuesta.sms
        }
        
      })

  }else{
    console.log('refusez')
  }
  



}


