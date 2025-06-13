import mongoose from "mongoose"

const url = ``

export default async function connectDB(){
  try{
    await mongoose.connect(url, { useUnifiedTopology: true })
    console.log("DB connected")

  } catch(error){
   console.log(error)
  }
}

