const express = require("express");
const app = express();
app.use(express.json());
//app.use('/api', require('./api'));

const {
  client,
  seed,
  sync,
} = require("./db");



app.use((err,req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send({error: err.message ? err.message : err });
});


const init = async()=> {
  const PORT = process.env.PORT || 3000;
  await client.connect();
  console.log('connected to database');

  if(process.env.SYNC){
    await seed()
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  });
};

init();
