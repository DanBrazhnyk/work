import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import signUpRouter from "./signup.js"
import loginRouter from "./login.js"


import addReportRouter from "./addReports.js"
import editReportRouter from "./editReport.js"
import deleteReportRouter from "./deleteReport.js"
import getReportsRouter from "./getReports.js"

import addCommentRouter from "./addComments.js"
import editCommentRouter from "./editComments.js"
import getCommentsRouter from "./getComments.js"
import deleteCommentRouter from "./deleteComments.js"

import getTypeOfReportRouter from "./getTypeOfReport.js"
import getPriorityRouter from "./getPriority.js"
import getLocationRouter from "./getLocation.js"
import getStatusRouter from "./getStatus.js"
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use(signUpRouter);
app.use(loginRouter);


app.use(addReportRouter);
app.use(editReportRouter);
app.use(deleteReportRouter);
app.use(getReportsRouter);

app.use(addCommentRouter);
app.use(editCommentRouter);
app.use(deleteCommentRouter);
app.use(getCommentsRouter);

app.use(getTypeOfReportRouter);
app.use(getPriorityRouter);
app.use(getLocationRouter);
app.use(getStatusRouter);


app.listen(process.env.DB_PORT, () => {
  console.log("Server is running on port 8081");
});
