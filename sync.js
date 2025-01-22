import sequelize from './db.js';
import './relation.js';
import Reps from './models/Reps.js';

async function sync(){
    try {
        await sequelize.authenticate();
        console.log("Connection Success");

        //Sinkronisasi Model
        await sequelize.sync({ froce: true});
        console.log("Model has been synchronized");

        //Menutup Koneksi
        await sequelize.close();
    } catch(err) {
        console.log(err);
    }
};

sync();