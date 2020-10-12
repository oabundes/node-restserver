//
// Puerto
//

process.env.PORT = process.env.PORT || 3000;


//
// Entorno
//

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//
// Vencimiento del Token
// 60 seg
// 60 min
// 24 hrs
// 30 dias
process.env.CADUCIDAD_TOKEN = (Date.now() / 1000) + 60 * 30;



//
// SEED de autenticación
//

process.env.SEED = process.env.SEED || 'este_es_el_seed_desarrollo';

//
// Base de datos
//

let urlDB;

if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    // urlDB = 'mongodb+srv://admin:2oF1CniXZYpL9v4R@cluster0.1lhak.mongodb.net/cafe'
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


//
//Google Client ID
//

process.env.CLIENT_ID = process.env.CLIENT_ID || '806994355210-13j3qts5qgoen6jjpr40bf4sfejlee9e.apps.googleusercontent.com'