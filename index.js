const express = require("express");
const app = express();
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const helmet = require("helmet")
const morgan = require("morgan")
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/posts");
const cors = require('cors');
 const multer = require('multer')
 const path  = require("path");


const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,"public/img");  //
  },
  filename:(req,file,cb)=>{
    cb(null, req.body.name); // 
  },
})
 
const upload = multer({storage})

app.post("/api/upload", upload.single("file"), (req,res)=>{
try {
  res.status(201).json("successifully uploaded");

} catch (err) {
  console.log(err);
}
})



const corsOptions ={
  origin:'http://localhost:3000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}


dotenv.config();


//this  is all about mongoose and at all this  is the gradle  build
mongoose 
 .connect(process.env.MONGO_URL, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
          })   
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err));

 app.use('/img', express.static(path.join(__dirname, "public/img")))  //

//  app.use('/images', express.static(path.join(__dirname, "public/images")))

//middelware
app.use(express.json());
app.use(helmet());
app.use(cors(corsOptions))
app.use(morgan('common'));




app.use("/api/users" , userRoute);
app.use("/api/auth" , authRoute);
app.use("/api/posts" , postRoute);



app.listen(8800,()=>{
    console.log("Backend server is runnning")
})