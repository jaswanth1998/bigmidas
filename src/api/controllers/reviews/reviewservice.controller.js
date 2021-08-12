import Joi from 'joi';
import Reviews from '../../models/reviews/reviewservice.model';
import HttpStatus from "http-status-codes";

import multer from 'multer';


export default {

  async createshopcat(req,res){
  //Validate the Request 

  let schema =new Reviews({
    service_id:req.body.service_id,
    review:req.body.review,
    customer_id:req.body.customer_id,
    rating:req.body.rating,
  });
     
            Reviews.create(schema)
          .then(Users=> res.json(Users)) 
          .catch(err=>res.status(500).json(err)); 
      
      
  },
  findAll(req,res,next){
    var s = req.protocol + '://' + req.get('host') ;

 
    Reviews.aggregate([
      {
          $addFields : {
            convertedId2: s,
              convertedId1: { $toObjectId: "$category" },
              convertedId2: { $toObjectId: "$vendorid" },
              // nameFilter: {
              //   $concat: [s,'/',"$doc"],
              // },
            }  },
            { 
              $lookup: {
             from: "shoplisting-cats",
             localField: "convertedId1",
             foreignField: "_id",
             as: "get_cateogires"
          }
          },  
          { 
            $lookup: {
           from: "vendor-details",
           localField: "convertedId2",
           foreignField: "_id",
           as: "vendor_details"
        }
        },  
          {
              $project:{
                  shop_name : '$shop_name',
                  city : '$city',
                  area : '$area',
                  address : '$address',
                  cat_name : '$get_cateogires.cat_name',
                  createddate : '$createddate',
                  pan_adhaar : '$pan_adhaar',
                  trade_licence : '$trade_licence',
                  fssai_licence : '$fssai_licence',
                  vendor: '$vendor_details.name'

              }
          },
          {
              $unwind : '$cat_name'
          },
          {
            $unwind : '$vendor'
        }
          

  ]) .then(vechicle => res.json(vechicle));

},
Updatecat(req,res){

    let {id} = req.params;

    let schema =new Reviews({
      service_id:req.body.service_id,
    review:req.body.review,
    customer_id:req.body.customer_id,
    rating:req.body.rating,
    });
  
  Reviews.updateOne({_id:id},schema,{multi: true})

    .then(client => res.json(client))

    .catch(err=> res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));

},  
Delete(req,res){
    let {id} = req.params;    
    Reviews.findByIdAndRemove(id)
.then(client =>{
   if(!client){
       return res.status(HttpStatus.NOT_FOUND).json({err:'Could not delete any Invoice '});
   }
   return res.json(client);
})
.catch(err=> res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));

},
  
};