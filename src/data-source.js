const { DataSource } = require("typeorm");
const { User } = require("./entity/User");
const{City} = require("./entity/City");

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "./db.sqlite",
  synchronize: true,
  logging: false,
  entities: [User,City]
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });



module.exports = { AppDataSource };