const express = require('express');
const path = require('path');

const app=express();
const PORT = 8000;

app.set("view engine","ejs");
app.set("views",path.resolve);

app.listen(PORT,()=>{
  console.log(`server start at https://localhost:${PORT}`)
});