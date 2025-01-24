import User from "./models/User.js";
import Service from "./models/Service.js";
import sequelize from "./db.js";
import bcrypt from "bcrypt";
// import sync from './sync.js';

async function runTest() {
    // await sequelize.sync({force: true})
    // console.log('database synced')

    // INSERT DATA
    const Data = {
        name: "bear",
        email: "bear@gmail.com",
        password: await bcrypt.hash('1010', 10),
        level: "admin"
    };

    const user = await User.create(Data);

    // SELECT DATA WHERE
    // const users = await User.findAll(
    //     {where: {
    //         name: "mike"
    //     }}
    // );
    // const userData = users[0].dataValues;
    // console.log(userData.id);

    // UPDATE DATA WHERE
    // try{const users = await User.update(
    //     {password: await bcrypt.hash("123", 10)},
    //     {
    //         where: {
    //             email: "mike@gmail.com",
    //         }
    //     }
    // );}
    // catch(err){
    //     console.log(err);
    // }
    

    // const result = await User.findAll()
    // console.log(result);

    //  DELETE DATA
    // await User.destroy({
    //     where: {
    //         email: "jon@gmail.com"
    //     }
    // })

    // await sequelize.close();
    console.log('finished')
}

runTest();