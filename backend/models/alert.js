const mongoose=require('mongoose')

const alertschema=new mongoose.Schema({
    disaster:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    severity:{
        type:String,
        required:true
    },
    timestamp: {
    type: Date,
    default: Date.now 
},

});



module.exports=mongoose.model('Alert',alertschema)