var express = require("express");
const { graphqlHTTP } = require("express-graphql");
var cors = require("cors");
const FBAuth = require("./middlewares/FBAuth");

var app = express();

const graphqlSchema = require("./graphql/schema/index");
const graphqlResolvers = require("./graphql/resolvers/index");

app.use(cors());

app.use((req, res, next) => {
  if (!req.headers.authorization)
    idToken = req.headers.authorization = "Bearer dummyToken2";
  next();
});

app.use(FBAuth);

// dummy authentication for now

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
  })
);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(5000);
