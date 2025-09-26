import loadEnvironmentVariables from "@/utils/load-env-vars";

loadEnvironmentVariables();

import express from "express";
import routes from "@/routes";
import logger from "@/middlewares/logger";
import globalErrorHandler from "@/middlewares/error-handler";
import { PORT, ENVIRONMENT } from "@/utils/constants";

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to log requests
app.use(logger);

// Mount the routes
app.use(routes);

// Middleware to handle errors globaly
app.use(globalErrorHandler);

// Start the server
app.listen(PORT, () => console.log(`Server started on port ${PORT} in ${ENVIRONMENT} mode.`));
