const mongoose=require('mongoose');

const mapSchema=new mongoose.Schema({
    address:{
        type:String,
        required:true
    },

    name:{
        type:String,
        required:true
    },

    severity:{
        type:String,
        required:true

    }

})

