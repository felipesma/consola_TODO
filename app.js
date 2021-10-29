const colors = require('colors');
const { guardarDB, leerDB } = require('./helpers/guardarArchivo');

const { inquirerMenu, 
        pausa,
        leerInput,
        listadoTareasBorrar,
        confirmar,
        mostrarListadoChecklist } = require('./helpers/inquirer');
const Tareas = require('./models/tareas');



const main = async() => {
    
    let opt = '';
    const tareas = new Tareas();

    const tareasDB = leerDB();

    if (tareasDB) { //Cargar tareas
        tareas.cargarTAreasFromArray(tareasDB);
    }

    do {

        //Esta función imprime el menú
        opt = await inquirerMenu();
        
        switch (opt) {
            case 1:
                //crear opción
                const desc = await leerInput('Descripción:');
                tareas.crearTarea(desc);
            break;

            case 2:
                tareas.listadoCompleto();
            break;

            case 3:
                tareas.listarPendientesCompletadas(true);
            break;

            case 4:
                tareas.listarPendientesCompletadas(false);
            break;

            case 5:
                 const ids = await mostrarListadoChecklist(tareas.listadoArr);
                 tareas.toggleCompletadas( ids )
            break;

            case 6:
                const id = await listadoTareasBorrar(tareas.listadoArr);
                if (id!==0){
                    const confirmacion = await confirmar('¿Estás seguro de borrar?');
                    if (confirmacion) {
                        tareas.borrarTareas(id)
                        console.log('Tarea borrada correctamente')
                    }
                }
            break;

        }

        guardarDB( tareas.listadoArr );

        await pausa();

    } while( opt !== 0);

}

main();