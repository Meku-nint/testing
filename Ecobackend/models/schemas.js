import mongoose, { Schema } from 'mongoose'
const userSchema=new mongoose.Schema({
    full_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }})
const electronicSchema=new mongoose.Schema({
   desc:{
        type:String,
        required:true
    },
    category:{
      type:String,
      required:true
    },
    image_url:{
        type:String,
        required:true,
        unique:true
    },
    price:{
        type:Number,
        required:true
    }
})
const clothSchema= new mongoose. Schema({
desc:{
    type:String,
    required:true
},
price:{
    type:Number,
    required:true
},
category:{
    type:String,
    required:true
},
image_url:{
    type:String,
    required:true,
}})
const foodSchema=new mongoose.Schema({
    food_name:{
        type:String,
        required:true
    },
    food_image:{
      type:String,
      required:true
    },
    category:{
        type:String,
        required:true
    }
})
const User=mongoose.model('User',userSchema);
const Electronic=mongoose.model('Electronic',electronicSchema);
const Cloth=mongoose.model('Cloth',clothSchema);
const Food=mongoose.model('Food',foodSchema);
export {User,Electronic,Cloth,Food}