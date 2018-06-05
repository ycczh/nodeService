var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');
var Goods=require('../models/goods');
var Schema=mongoose.Schema;

//连接mongodb数据库
mongoose.connect('mongodb://127.0.0.1:27017/goods');
//监听数据库连接状态
mongoose.connection.on('connected',function(){
    console.log('数据库连接成功');
});
mongoose.connection.on('error',function(){
    console.log('数据库连接失败');
});
mongoose.connection.on('disconnected',function(){
    console.log('数据库连接失败');
});
//查询商品列表
router.get('/list',function(req,res,next){
    //带分页查询
    var page=parseInt(req.param('page'));
    var pageSize=parseInt(req.param('pageSize'));
    var priceLevel=req.param("priceLevel");
    var sort=req.param('sort');
    var skip=(page-1)*pageSize;
    var priceGt = '',priceLte = '';
    var params={};
    if(priceLevel!="all"){
        switch(priceLevel){
            case '0':priceGt=0;priceLte=100;break;
            case '1':priceGt=100;priceLte=500;break;
            case '2':priceGt=500;priceLte=1000;break;
            case '3':priceGt=1000;priceLte=5000;break;
        };
         params={
            salePrice:{
              $gt:priceGt,
              $lte:priceLte
            }
        };
    }
   
    var goodsModel=Goods.find(params).skip(skip).limit(pageSize);
    goodsModel.sort({'salePrice':sort});
    goodsModel.exec(function(err,doc){
        if(err){
            return res.json({
                status:'1',
                msg:err.message
            });
        }else{
            return res.json({
                status:'0',
                msg:'',
                result:{
                    count:doc.length,
                    list:doc
                }
            });
        }
    })

});

//添加购物车
router.post('/addcart',function(req,res,next){
    var userId="1",productId=req.body.productId;
    var User = require('../models/user');
    User.findOne({userId:userId},function(err,userDoc){
    var userId = '1',productId = req.body.productId;
    var User = require('../models/user');
    User.findOne({userId:userId}, function (err,userDoc) {
    if(err){
        res.json({
            status:"1",
            msg:err.message
        })
    }else{
        console.log("userDoc:"+userDoc);
        if(userDoc){
            var goodsItem = '';
            userDoc.cartList.forEach(function (item) {
                if(item.productId == productId){
                    goodsItem = item;
                    item.productNum ++;
                }
            });
            if(goodsItem){
                userDoc.save(function (err2,doc2) {
                if(err2){
                    res.json({
                    status:"1",
                    msg:err2.message
                    })
                }else{
                    res.json({
                    status:'0',
                    msg:'',
                    result:'suc'
                    })
                }
                })
            }else{
                Goods.findOne({productId:productId}, function (err1,doc) {
                if(err1){
                    res.json({
                    status:"1",
                    msg:err1.message
                    })
                }else{
                    if(doc){
                        doc.productNum=1;
                        doc.checked = "1";
                        userDoc.cartList.push(doc);
                        userDoc.save(function (err2,doc2) {
                            if(err2){
                                res.json({
                                    status:"1",
                                    msg:err2.message
                                })
                                }else{
                                res.json({
                                    status:'0',
                                    msg:'',
                                    result:'suc'
                                })
                            }
                        })
                    }
                }
                });
            }
        }
    }
  })
     })

})


module.exports=router;
