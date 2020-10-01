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
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;



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