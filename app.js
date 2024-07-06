// Load the express module
const express = require("express");
const mongoose = require("mongoose");
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  REDIS_URL,
  REDIS_PORT,
  SESSION_SECRET,
} = require("./config/config.js");

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const session = require("express-session");
const RedisStore = require("connect-redis").default;
const { createClient } = require("redis");
var cors = require("cors");

// Create a Redis client
const redisClient = createClient({
  url: `redis://${REDIS_URL}:${REDIS_PORT}`,
});

redisClient.connect().catch(console.error);

// Create an Express application
const app = express();

// Connect mongo-db
const mongoUri = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;
mongoose
  .connect(mongoUri)
  .then(() => console.log("Connected to the DB"))
  .catch((e) => console.log(e));
app.enable("trust proxy");

app.use(cors({}));
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set secure to true if using HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 10,
    },
  })
);

// App enable request body json
app.use(express.json());

app.use((req, res, next) => {
  console.log("Yeah it run");
  next();
});

// App route
app.get("/", (req, res) => {
  res.send("<h1>Hello, World</h1>");
});
app.use("/posts", postRouter);
app.use("/user", userRouter);

// Start the server and listen on port 3000
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
