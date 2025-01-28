// Requerir los módulos
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import routerEstudiantes from './routers/estudiante_routes.js';
import routerAdmin from './routers/administrador_routes.js';
// Inicializaciones
const app = express()
dotenv.config()

// Configuraciones 
console.log('NODE_ENV:', process.env.NODE_ENV)
app.set('port',process.env.port || 3000)
app.use(cors())

// Middlewares 
app.use(express.json())


// Variables globales

// Rutas 
app.use('/api',routerEstudiantes)
app.use('/api',routerAdmin)



// Manejo de una ruta que no sea encontrada
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))



// Exportar la instancia de express por medio de app
export default  app