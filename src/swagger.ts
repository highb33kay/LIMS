import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "LIMS API End Point Documentation",
      version: "1.0.0",
      description: "API for LIMS API End Point Documentation",
    },
    servers: [
      {
        url: "http://localhost:3000/",
        description: "Local server",
      },
      {
        url: "#",
        description: "Live server",
      },
    ],
    license: {
      name: "Apache 2.0",
      url: "https://www.apache.org/licenses/LICENSE-2.0.html",
    },
  },
  apis: ["./src/routes/*.route.ts"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
