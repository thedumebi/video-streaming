const express = require("express");
const { cors } = require("./middleware");

const app = express();

// middleware
app.use(cors);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "index.html");
});

// video route
app.use("/video", require("./routes"));

const PORT = process.env.PORT || 4400;

app.listen(PORT, () => {
  console.log("\x1b[33m%s\x1b[1m", `Server started on port ${PORT}`);
});
