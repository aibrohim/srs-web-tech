const express = require("express");
const path = require("path");

const app = express();

const PORT = 3000;

app.set("view engine", "ejs")
app.set("views", path.resolve(__dirname, "views"))

app.use(express.static(path.resolve(__dirname, "public")))
app.use(express.urlencoded({extended: true}))

const userRouter = require("./routes/users");
app.use("/students", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
