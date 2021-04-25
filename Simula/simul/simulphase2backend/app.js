var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');

var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var getUser = require('./routes/getUser');
var getProjectsRouter = require('./routes/getProjects');
var createProjectRouter = require('./routes/createProject');
var getProjectDetailsRouter = require('./routes/getProjectDetails');
var updateDetailsRouter = require('./routes/updateDetails');
var addStagesRouter = require('./routes/addStages');
var addRolesRouter = require('./routes/addRoles');
var addCollabs = require('./routes/addCollabs');
var completeProjectRouter = require('./routes/completeProject');
var closeProjectRouter = require('./routes/closeProject');
var submitCommentRouter = require('./routes/submitComment');
var getStageCommentsRouter = require('./routes/getStageComments')
var resetPasswordRouter = require('./routes/resetPassword');
var forgotPasswordRouter = require('./routes/forgotPassword');
var uploadImageRouter = require('./routes/uploadImage');
var getImagesRouter = require('./routes/getImages');
var getPinterestInfoRouter = require('./routes/getPinterestInfo')
var addPinterestBoardRouter = require('./routes/addPinterestBoard')
var getStagesRouter = require('./routes/getStages');
var addSingleStageRouter = require("./routes/addSingleStage")
var directorLoginRouter = require('./routes/directorLogin');
var directorRegisterRouter = require('./routes/directorSignup');
var shareProjectRouter = require('./routes/shareProject')
var directorResetPasswordRouter = require('./routes/directorResetPassword');
var directorForgotPasswordRouter = require('./routes/directorForgotPassword');

var app = express();



const options = require('./knexfile.js');
const knex = require('knex')(options);

//Enable POST
var helmet = require("helmet");


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


morgan.token("req", function(req, res) {
  JSON.stringify(req.headers);
});
morgan.token("res", function(req, res) {
  const headers = {};
  res.getHeaderNames().map(h => (headers[h] = res.getHeader(h)));
  return JSON.stringify(headers);
});

app.use((req, res, next) => {
  req.db = knex
  next()
})

app.use('/', loginRouter);
app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use('/user', getUser);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/projects', getProjectsRouter);
app.use('/createproject', createProjectRouter);
app.use('/getprojectdetails', getProjectDetailsRouter);
app.use('/updatedetails', updateDetailsRouter);
app.use('/addstages', addStagesRouter);
app.use('/addRoles', addRolesRouter);
app.use('/addcollabs', addCollabs);
app.use('/completeproject', completeProjectRouter);
app.use('/closeproject', closeProjectRouter);
app.use('/submitcomment', submitCommentRouter)
app.use('/getstages', getStagesRouter)
app.use('/getstagecomments', getStageCommentsRouter)
app.use('/resetpassword', resetPasswordRouter)
app.use('/forgotpassword', forgotPasswordRouter)
app.use('/uploadimage', uploadImageRouter)
app.use('/getimages', getImagesRouter)
app.use('/getpinterestinfo', getPinterestInfoRouter)
app.use('/addpinterestboard', addPinterestBoardRouter)
app.use('/addsinglestage', addSingleStageRouter)
app.use('/directorlogin', directorLoginRouter)
app.use('/directorregister', directorRegisterRouter)
app.use('/shareproject', shareProjectRouter)
app.use('/directorresetpassword', directorResetPasswordRouter)
app.use('/directorforgotpassword', directorForgotPasswordRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;