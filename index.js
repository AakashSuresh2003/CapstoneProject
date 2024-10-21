const dotenv = require("dotenv").config();
const express = require("express");
const ConnectDB = require("./src/db/database");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require("./src/routes/auth");
const employeeRouter = require("./src/routes/employee");
const hrRouter = require("./src/routes/hr");
const faRouter = require("./src/routes/finance");
const bodyParser = require("body-parser");
const YAML = require("yamljs");
const path = require('path')

const swaggerUi = require("swagger-ui-express");

app.use(express.static("public"));

app.use(express.json());
app.use('/public/css', express.static('public/css'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({origin:true,credentials:true}));

app.get("/", (req, res) => {
  res.status(200).json("Welcome to Employee Payroll API v8");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/employee", employeeRouter);
app.use("/api/v1/hr", hrRouter);
app.use("/api/v1/fa", faRouter);

ConnectDB();

const swaggerDocs = YAML.load(path.join(__dirname, '/swagger.yaml'));
const options = { customCssUrl: '/public/swagger-ui.css', customSiteTitle: "Payroll Management System - Swagger UI" };
app.use("/api-docs",swaggerUi.serve ,swaggerUi.setup(swaggerDocs,options));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger UI is running on http://localhost:${PORT}/api-docs`);
});
