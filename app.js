// if (process.env.NODE_ENV !== "PRODUCTION") {
//     require("dotenv").config();
// }

// const express = require("express"),
//     mongoose = require("mongoose"),
//     ejsMate = require("ejs-mate"),
//     path = require("path"),
//     session = require("express-session"),
//     flash = require("connect-flash"),
//     passport = require("passport"),
//     LocalStrategy = require("passport-local"),
//     mongoSanitize = require("express-mongo-sanitize"),
//     helmet = require("helmet"),
//     MongoStore = require("connect-mongo");

// const User = require("./models/user");

// const flightRoutes = require("./routes/flight");
// const authRoutes = require("./routes/auth");

// const dbUrl = process.env.dbURL || "mongodb://localhost:27017/avian";
// mongoose.connect(dbUrl, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//     useCreateIndex: true
// });

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "Connection Error:"));
// db.once("open", () => {
//     console.log("Database Connected");
// });

// const app = express();

// app.engine("ejs", ejsMate);
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// app.use(express.static(path.join(__dirname, "public")));
// app.use(express.urlencoded({ extended: true }));

// // Create session store
// const store = MongoStore.create({
//     mongoUrl: dbUrl,
//     secret: process.env.dbSECRET,
//     touchAfter: 24 * 60 * 60
// });

// store.on("error", function (err) {
//     console.log("Session Store Error", err);
// });

// // Session configuration
// const sessionConfig = {
//     store,
//     name: "sesh",
//     secret: process.env.seshSECRET,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         httpOnly: true,
//         // secure: true, // Uncomment if you're using HTTPS in production
//         expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
//         maxAge: 1000 * 60 * 60 * 24 * 7
//     }
// };

// // Use session middleware before flash
// app.use(session(sessionConfig));

// // Use flash middleware after session
// app.use(flash());

// app.use(mongoSanitize());
// app.use(helmet({ contentSecurityPolicy: false }));

// // Initialize passport and use session for persistent login
// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// // Middleware to pass user data and flash messages to all views
// app.use((req, res, next) => {
//     if (req.originalUrl !== "/login") req.session.returnTo = req.originalUrl;
//     res.locals.currentUser = req.user;
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
//     next();
// });

// // Routes
// app.use("/", flightRoutes);
// app.use("/", authRoutes);

// // Catch-all route handler
// app.all("*", (req, res, next) => {
//     res.redirect("/");
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.log(err.message);
//     req.flash("error", "Oh No, Something Went Wrong!");
//     res.redirect("/");
// });

// const port = process.env.PORT || "3000";
// app.listen(port, () => {
//     console.log(`Server live at ${port}`);
// });







if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config();
}

const express = require("express"),
    mongoose = require("mongoose"),
    ejsMate = require("ejs-mate"),
    path = require("path"),
    session = require("express-session"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    mongoSanitize = require("express-mongo-sanitize"),
    helmet = require("helmet"),
    MongoStore = require("connect-mongo");

const User = require("./models/user");

const flightRoutes = require("./routes/flight");
const authRoutes = require("./routes/auth");
//extra part
const PORT=process.env.PORT ||5800;
// MongoDB Atlas connection URL from environment variables
const dbUrl = process.env.dbURL || "mongodb://localhost:27017/avian"; // Fallback to local if no dbURL in .env
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
    console.log("Database Connected");
});

const app = express();

// EJS setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Create session store with MongoDB Atlas URL
const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret: process.env.dbSECRET,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (err) {
    console.log("Session Store Error", err);
});

// Session configuration
const sessionConfig = {
    store,
    name: "sesh",
    secret: process.env.seshSECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true, // Uncomment if you're using HTTPS in production
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

// Use session middleware before flash
app.use(session(sessionConfig));

// Use flash middleware after session
app.use(flash());

app.use(mongoSanitize());
app.use(helmet({ contentSecurityPolicy: false }));

// Initialize passport and use session for persistent login
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to pass user data and flash messages to all views
app.use((req, res, next) => {
    if (req.originalUrl !== "/login") req.session.returnTo = req.originalUrl;
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// Routes
app.use("/", flightRoutes);
app.use("/", authRoutes);

// Catch-all route handler
app.all("*", (req, res, next) => {
    res.redirect("/");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.log(err.message);
    req.flash("error", "Oh No, Something Went Wrong!");
    res.redirect("/");
});

const port = process.env.PORT || "5802";
// app.listen(port, () => {
//     console.log(`Server live at ${port}`);
app.listen(PORT, () => {
        console.log(`Server live at ${PORT}`);
});
