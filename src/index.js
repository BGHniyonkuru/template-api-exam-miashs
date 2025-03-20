import 'dotenv/config'
import Fastify from 'fastify'
import { getCityInfos, addRecipe, deleteRecipe } from "./routes/cities.js";
import { submitForReview } from './submission.js'
import FastifySwagger from "@fastify/swagger";
import FastifySwaggerUi from "@fastify/swagger-ui";

const fastify = Fastify({ logger: true });

// 📌 Configuration Swagger
fastify.register(FastifySwagger, {
  openapi: {
    openapi: "3.0.0",
    info: {
      title: "Cities & Recipes API",
      description: "API permettant d'obtenir des informations sur les villes et d'ajouter des recettes associées.",
      version: "1.0.0",
    },
    servers: [
      {
        url: process.env.RENDER_EXTERNAL_URL || "http://localhost:3000",
        description: "Development server",
      },
    ],
  },
}).then(() => {
  return fastify.register(FastifySwaggerUi, {
    routePrefix: "/docs", // Accessible sur http://localhost:3000/docs
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
  });
});

// 📌 Route principale (Accueil API)
fastify.get("/", async (request, reply) => {
  reply.send({
    message: "Bienvenue sur l'API ! Consultez la documentation Swagger sur /docs",
  });
});

// 📌 Routes vers l'API
fastify.get("/cities/:cityId/infos", getCityInfos);
fastify.post("/cities/:cityId/recipes", addRecipe);
fastify.delete("/cities/:cityId/recipes/:recipeId", deleteRecipe);






fastify.listen(
  {
    port: process.env.PORT || 3000,
    host: process.env.RENDER_EXTERNAL_URL ? '0.0.0.0' : process.env.HOST || 'localhost',
  },
  function (err) {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }

    //////////////////////////////////////////////////////////////////////
    // Don't delete this line, it is used to submit your API for review //
    // everytime your start your server.                                //
    //////////////////////////////////////////////////////////////////////
    submitForReview(fastify)
  }
)



