const express = require("express");
const app = express();
const cors = require("cors");
const allowedOrigins = ["https://zeitgeistrpr.com"];
const authRoutes = require("./routes/auth");
const caRoutes = require("./routes/ca");
const eventsRoutes = require("./routes/events");
const userRoutes = require("./routes/user");
const announcementRoutes = require("./routes/announcements")

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        // If the origin is in the allowed list or it's not provided (e.g., for local requests)
        callback(null, true);
      } else {
        // If the origin is not allowed
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());

app.use(caRoutes);
app.use(authRoutes);
app.use(eventsRoutes);
app.use(userRoutes);
app.use(announcementRoutes);

app.listen(5000, () => {
  console.log("Running on " + 5000);
});
