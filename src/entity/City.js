const { EntitySchema } = require("typeorm");

const City = new EntitySchema({
  name: "City",
  columns: {
    id: {
      type: "varchar",
      primary: true,
      
    },
    name: {
      type: "varchar",
    },
    lat: {
      type: "float",
    },
    lng: {
      type: "float",
    },
  },
});

module.exports = { City };