var mongoose=require('mongoose');
var Schema=mongoose.Schema;
// 定义数据模型
var productSchema=new Schema({
    "productId":{type:String},
    "productName":String,
    "salePrice":Number,
    "productImage":String,
    "checked":String,
    "productNum":String


});

//输出商铺模型
module.exports=mongoose.model('Good',productSchema);