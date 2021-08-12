import Policy from "../../models/policies/policies.model";
import aboutus from "../../models/policies/aboutus.model";
import tandc from "../../models/policies/tandc.model";
import refundpolicy from "../../models/policies/refund.model";

export default{
    async setpolicy(req,res){
        const policy = new Policy({
            data:req.body.data
        });
        Policy.create(policy)
        .then((result) => res.json(result))
        .catch((err) => res.status(500).json(err));     
    },

    
    async getpolicy(req,res){
        Policy.find({})
        .sort({_id: -1})
        .limit(1)
        .then((result)=>{
            res.send(result);
        })
        .catch((err)=>{
            res.send(err);
        })
    
    },


    async settandc(req, res){
        const terms = new tandc({
            data: req.body.data
        });
        tandc.create(terms)
        .then((result)=>{
            res.send(result);
        })
        .catch((err)=>{
            res.send(err)
        })

    } ,

    async gettandc(req,res){
        tandc.find({})
        .sort({_id: -1})
        .limit(1)
        .then((result)=>{
            res.send(result);
        })
        .catch((err)=>{
            res.send(err);
        })
    
    },


    async setaboutus(req, res){
        const about = new aboutus({
            data: req.body.data
        });
        aboutus.create(about)
        .then((result)=>{
            res.send(result);
        })
        .catch((err)=>{
            res.send(err)
        })

    } ,

    async getaboutus(req,res){
        aboutus.find({})
        .sort({_id: -1})
        .limit(1)
        .then((result)=>{
            res.send(result);
        })
        .catch((err)=>{
            res.send(err);
        })
    
    },


    async setrefundpolicy(req, res){
        const refund = new refundpolicy({
            data: req.body.data
        });
        aboutus.create(refund)
        .then((result)=>{
            res.send(result);
        })
        .catch((err)=>{
            res.send(err)
        })

    } ,

    async getrefundpolicy(req,res){
        aboutus.find({})
        .sort({_id: -1})
        .limit(1)
        .then((result)=>{
            res.send(result);
        })
        .catch((err)=>{
            res.send(err);
        })
    
    },


}

