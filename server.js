const app = require("./index");

const port = 3000;

// start up a server
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
