import express from "express";
import customerController from "../api/controllers/customer/customer.controller";
import vendorController from "../api/controllers/vendor/vendor.controller";
import ShoplistingController from "../api/controllers/categories/shop-listing-cat.controller";
import ShoplistingSubController from "../api/controllers/categories/shop-listing-sub-cat.controller";
import VehiclelistingController from "../api/controllers/categories/vehicle-listing-cat.controller";
import Servicecatcontroller from "../api/controllers/categories/service-cat.controller";

import VehiclelistingSubController from "../api/controllers/categories/vehicle-listing-sub-cat.controller";

import shopController from "../api/controllers/listings/shoplisting.controller";
import vehicleController from "../api/controllers/listings/vehiclelisting.controller";
import serviceController from "../api/controllers/listings/servicelisting.controller";

import reviewController from "../api/controllers/reviews/reviewservice.controller";
import reviewshopController from "../api/controllers/reviews/reviewshop.controller";
import vehicleshopController from "../api/controllers/reviews/reviewvehicle.controller";

import subscriptionController from "../api/controllers/subscriptions/subscriptons.controller";
import subscriptionplanController from "../api/controllers/subscriptions/subscriptonplans.controller";

import subscriptionServiceController from "../api/controllers/subscriptions/subscriptons-service.controller";
import subscriptionplanServiceController from "../api/controllers/subscriptions/subscriptonplans-service.controller";

import subscriptionVehicleController from "../api/controllers/subscriptions/subscriptions-vehicle.controller";
import subscriptionplanVehicleController from "../api/controllers/subscriptions/subscriptionplans-vehicle.controller";

import serviceorderController from "../api/controllers/orders/serviceorders.controller";

import productsController from "../api/controllers/products/products.controller";
import addressController from "../api/controllers/customer/customeraddress.controller";

import orderController from "../api/controllers/orders/orders.controller";
import vehicleorderController from "../api/controllers/orders/vehicleorders.controller";

import wishlistController from "../api/controllers/wishlist/wishlist.controller";
import cartController from "../api/controllers/cart/cart.controller";

import adminController from "../api/controllers/admin/admin.controller";

import shopactiveController from "../api/controllers/active/shopactive.controller";
import serviceactiveController from "../api/controllers/active/serviceactive.controller";
import vehicleactiveController from "../api/controllers/active/vehicleactive.controller";

import BannerController from "../api/controllers/banners/banner.controller";
import customerIssueController from "../api/controllers/customer/customerissue.controller";
import messageController from "../api/controllers/messages/message.controller";
import notificatonController from "../api/controllers/messages/notification.controller";

import vendorpageController from "../api/controllers/pages/pages.controller";
import customerpageController from "../api/controllers/pages/customerpages.controller";

import youtubeController from "../api/controllers/youtube/youtube.controller";

import passport from "passport";
import policiesController from "../api/controllers/policies/policies.controller";
import bannerController from "../api/controllers/banners/banner.controller";

//const storage = require("../api/helpers/storage");

export const router = express.Router();
const upload = require("../api/middleware/upload");
const uploaddoc = require("../api/middleware/upload-doc");


//Customer
router.post(
  "/customer/signup",

  customerController.signup
);
router.post("/customer/login", customerController.login);
router.post("/customer/loginbyemail", customerController.loginbyemail);
router.post("/changepassword", customerController.changepassword);
router.post("/changepasswordbyemail", customerController.changepasswordemail);
// router.post("/customer/loginwithm", customerController.loginWithmobile);
router.put(
  "/customer/update/:id",

  customerController.editcustomer
);
router.get("/customer/:id", customerController.getcustbyid);
router.delete("/deletecustomer/:id", customerController.deleteCustomer);


//get all customers
router.get("/allcustomers", customerController.getallcustomers);

//send message to customers
router.post("/messages", messageController.sendtoAll);
router.post("/messagesingle", messageController.sendtoSpecific);
router.post("/messagesven", messageController.sendtoAllVend);
router.post("/messagesingleven", messageController.sendtoSpecificVend);
router.get("/allmessages", messageController.allNotifications);

//notificatonController
router.post("/notification", notificatonController.notification);
router.post("/customernotification", notificatonController.usernotification);
router.delete("/notification/:id", notificatonController.deletenotification);
router.post("/sendnotification", notificatonController.sendnotification);
router.post("/sendnotificationtocustomer", notificatonController.sendnotificationtocustomer);
router.get("/sendnotificationtoall/:msg", notificatonController.sendnotificationtoall);
router.get("/sendnotificationtoallcustomers/:msg", notificatonController.sendnotificationtoallcustomers);
router.get("/addmsg/:id",notificatonController.addmessages);
router.get("/getcustmsg/:id",notificatonController.addcustmessages);


//=========================================// 
//customer address
router.post("/customeraddress", addressController.addAddress);
router.post("/testcustomeraddress", addressController.addAddress1);
router.put("/editaddress/:id", addressController.editAddress);
router.get("/getaddress/:id", addressController.getAddress);
router.delete("/deleteaddress/:id", addressController.delAddress);

//==========================================//
//vendor
router.post("/vendor/signup", vendorController.signup);
router.post("/vendor/login", vendorController.login);
router.get("/vendor/:id", vendorController.getvendorbyid);
router.get("/allvendors", vendorController.getallvendors);
router.delete("/deletevendor/:id", vendorController.deletevendor);
router.put("/editactivevendor/:id",  upload.single("image"),vendorController.editvendorActive);
router.put("/updateaboutus/:id", vendorController.updateaboutus);
router.put("/storedistance/:id", vendorController.storedistance);
router.put("/servicedistance/:id", vendorController.servicedistance);
router.put("/vehicledistance/:id", vendorController.vehicledistance);
router.put("/updatedeliverytype/:id", vendorController.updatedeliverytype);
router.post("/updateprofilepic",
upload.single("profilepic"),
vendorController.updateprofilepic);
//=========================================//
//Shop-listing category
router.post(
  "/shoplist/cat",
  upload.single("avatar"),
  ShoplistingController.createshopcat
);
// router.get("/shoplist/cat", ShoplistingController.findAll);
router.get("/shoplist/cat", BannerController.findAll1);
router.put(
  "/shoplist/cat/:id",
  upload.single("avatar"),
  ShoplistingController.Updatecat);
router.put("/shoplist/cat1/:id", ShoplistingController.Updatecat1);
router.delete("/shoplist/cat/:id", ShoplistingController.Delete);

//=========================================//
//Shop-listing sub category
router.post("/shoplist-sub/cat", ShoplistingSubController.createshopcat);
router.get("/shoplist-sub/cat/:id", ShoplistingSubController.findAll);
router.get("/shoplist-sub/cat", ShoplistingSubController.findAllSubCat);
router.get("/shoplist-sub/cat1/:id", ShoplistingSubController.findAllSubCat1);

router.put("/shoplist-sub/cat/:id", ShoplistingSubController.Updatecat);
router.delete("/shoplist-sub/cat/:id", ShoplistingSubController.Delete);

//=========================================//
//Vechicle-listing category
router.post(
  "/vehiclelist/cat",
  upload.single("avatar"),
  VehiclelistingController.createshopcat
);
router.get("/vehiclelist/cat", VehiclelistingController.findAll);
router.put(
  "/vehiclelist/cat/:id",
  upload.single("avatar"),
  VehiclelistingController.Updatecat
);
// router.get("/getvehicledetails/:id",VehiclelistingController)
router.put("/vehiclelist/cat1/:id", VehiclelistingController.Updatecat1);
router.delete("/vehiclelist/cat/:id", VehiclelistingController.Delete);

//=========================================//
//Service-listing category
router.post(
  "/service/cat",
  upload.single("avatar"),
  Servicecatcontroller.createshopcat
);
router.get("/service/cat", Servicecatcontroller.findAll);
router.put(
  "/service/cat/:id",
  upload.single("avatar"),
  Servicecatcontroller.Updatecat
);
router.put(  "/service/cat1/:id",

    Servicecatcontroller.Updatecat1
  );
router.delete("/service/cat/:id", Servicecatcontroller.Delete);

//=========================================//
//Vechicle-listing sub category
router.post("/vehiclelist-sub/cat", VehiclelistingSubController.createshopcat);
router.get("/vehiclelist-sub/cat", VehiclelistingSubController.findAllSubCat);
router.get("/vehiclelist-sub/cat1/:id", VehiclelistingSubController.findAllSubCat1);
router.get("/vehiclelist-sub/cat/:id", VehiclelistingSubController.findAll);
router.put("/vehiclelist-sub/cat/:id", VehiclelistingSubController.Updatecat);
router.delete("/vehiclelist-sub/cat/:id", VehiclelistingSubController.Delete);

//=========================================//
//Shop-listing
router.post(
  "/shoplist",
  uploaddoc.fields([
    { name: "pan_adhaar" },
    { name: "trade_licence" },
    { name: "fssai_licence" },
    { name: "images" },
  ]),
  
  shopController.createshopcat
);
router.get("/deletestoreimage/:id/:path", shopController.getshopimage);
router.post("/addstoreimages", uploaddoc.fields([{name:"images"}]),  shopController.addshopimages);
// router.get("/storelocationdetails/:id", shopController.getlocationdetails);
router.get("/getshopcat/:id", shopController.getshopcat);
router.put("/updatestorelocationdetails/:id", shopController.updatelocationdetails);
router.get("/shoplist", shopController.findAll);
router.get("/shoplist/:id", shopController.findAll1);
router.get("/getshopdetails/:id", shopController.getshopdetails);
router.get("/editshopactive/:id",shopController.editactive);
router.get("/getshopactive/:id",shopController.getactive);


router.put("/shoplist/:id", shopController.Updatecat);
router.get("/shopreviews/:id", shopController.findreviews);
router.put(
  "/shoplist/:id",
  uploaddoc.fields([
    { name: "pan_adhaar" },
    { name: "trade_licence" },
    { name: "fssai_licence" },
    { name: "images" },
  ]),
  shopController.Updatecat
);
router.get("/shopvendorbycat/:id", shopController.findvendordbycat);

router.delete("/shoplist/:id", shopController.Delete);

//=========================================//
//Vehicle-listing
router.get("/deletevehicleimage/:id/:path", vehicleController.getvehicleimage);
router.post(
  "/vehiclelist",
  uploaddoc.fields([
    { name: "pan_adhaar" },
    { name: "driving_license" },
    { name: "rc" },
    { name: "fc" },
    { name: "insurance" },
    { name: "images" },
  ]),
  vehicleController.createshopcat
);
router.get("/getvehicledetails/:id", vehicleController.getvehicledetails);
router.get("/getvehiclelocation/:id", vehicleController.getlocationdetails);
router.post("/addvehicleimages", uploaddoc.fields([{name:"images"}]),  vehicleController.addvehicleimages);
router.get("/getvehicleactive/:id", vehicleController.getactive);
router.get("/editvehicleactive/:id", vehicleController.editactive);
router.get("/vehiclelist", vehicleController.findAll);
router.get("/vehiclelist/:id", vehicleController.findAll1);
router.get("/vehiclevendordetails/:id", vehicleController.findvendordetails);
router.get("/vehiclevendorbycat/:id", vehicleController.findvendordbycat);
router.get("/updatedriverlocation/:id", vehicleController.updatedriverlocation);

// router.get("/vehicleorders/:vendorid", vehicleController.findOrders);
router.get("/vehiclereviews/:id", vehicleController.findreviews);
router.put(
  "/vehiclelist/:id",
  uploaddoc.single("doc"),
  upload.single("photo"),
  vehicleController.Updatecat
);
router.delete("/vehiclelist/:id", vehicleController.Delete);

//=========================================//
//Service-listing
router.post(
  "/servicelist",
  // upload.single("pan_adhaar"),
  uploaddoc.fields([
    { name: "pan_adhaar" },
    { name: "images" },
  ]),
  serviceController.createshopcat
);
router.get("/deleteserviceimage/:id/:path", serviceController.getserviceimage);
router.get("/getservicedetails/:id", serviceController.getservicedetails);
router.post("/addserviceimages", uploaddoc.fields([{name:"images"}]),  serviceController.addserviceimages);
router.get("/getservicelocation/:id", serviceController.getlocationdetails);
router.get("/servicelist", serviceController.findAll);
router.get("/getserviceactive/:id", serviceController.getactive);
router.put("/updatelocationdetails/:id", serviceController.updatelocationdetails);
router.get("/editserviceactive/:id", serviceController.editactive);
router.get("/servicevendordetails/:id", serviceController.findvendordetails);
router.get("/servicevendorbycat/:id", serviceController.findvendordbycat);
router.get("/servicelist/:id", serviceController.findAll1);
router.get("/servicereviews/:id", serviceController.findreviews);
router.put(
  "/servicelist/:id",
  upload.single("pan_adhaar"),
  serviceController.Updatecat
);
router.delete("/servicelist/:id", serviceController.Delete);
// router.get("/serviceorders/:vendorid", serviceController.findOrders);

//=========================================//
//products
router.post(
  "/products",
  upload.array("prodphoto", 10),
  productsController.createProduct
);
router.get("/allproducts", productsController.getallProducts);
router.get("/productbyid/:id",productsController.getProductbyid);
router.get(
  "/getprodbycategory/:category",
  productsController.getProductsByCategory
);
router.get(
  "/getproductsbyvendor/:vendorid",
  productsController.getProductsByVendor
);
router.get(
  "/getproductsbyshop/:shopid",
  productsController.getProductsByShop
);
router.get("/getproductvendorid/:id", productsController.getproductvendorid);

router.put(
  "/editproduct/:id",
  upload.array("prodphoto", 10),
  productsController.editProducts
);
router.delete("/deleteproduct/:id", productsController.deleteProducts);

//=========================================//
//orders
router.post("/orders", orderController.addorder);
router.post("/multipleorders", orderController.addmultipleorder);
router.get("/ordersbyvendor/:vendorid", orderController.ordersByVendor);
router.get("/ordersbyustomer/:id", orderController.ordersByCustomer);
router.get("/allshoporders", orderController.allOrders);
router.post("/updatestoreorderstatus",orderController.updatestatus);
router.post("/updatequantity",orderController.updateqty);
//=========================================//
//vehicle orders
router.post("/vehicleorders", vehicleorderController.createorder);
router.get("/allvehicleorders", vehicleorderController.getVehicleOrders);
router.get("/vehicleordersbycustomerid/:customerid", vehicleorderController.OrderbyCustomer);
router.post("/updatevehicleorderstatus",vehicleorderController.updatestatus);
router.get("/vehicleorders/:vendorid", vehicleorderController.VehicleOrderbyid1);
router.post("/getdistance",vehicleorderController.getDistance);

//=========================================//
//Service orders
router.post("/serviceorders", serviceorderController.createorder);
router.post("/updateserviceorderstatus",serviceorderController.updatestatus);
router.get("/serviceorderbycus/:customerid", serviceorderController.orderbycustomer);
router.get("/getserviceorders/:id", serviceorderController.getServiceOrderbyId);
router.get("/serviceorders/:vendorid", serviceorderController.Serviceorderbyid1);
router.get("/allserviceorders", serviceorderController.getSericeOrders);
//=========================================//
//reviews
router.post("/reviewservice", reviewController.createshopcat);
router.get("/reviews", reviewController.findAll);

router.post("/reviewsshop", reviewshopController.createshopcat);
router.post("/reviewsvehicle", vehicleshopController.createshopcat);

//=========================================//
//Subscriptions-shops
router.post("/subscription", subscriptionController.createshopcat);
router.get("/subscription/:id", subscriptionController.findAll);
router.get("/subscriptionplan", subscriptionplanController.findAll);
router.put("/editshopsubscription/:id", subscriptionController.Updatecat);
router.get("/subscriptionshops", subscriptionController.findAllShops);
router.get("/allshopsubs", subscriptionController.findallsubs);
router.post("/subscriptionplan", subscriptionplanController.createshopcat);
router.put("/editsubscriptionplan/:id", subscriptionplanController.Updateplan);
router.delete("/deletesubscriptionplan/:id", subscriptionplanController.Delete);

//=========================================//
//Subscriptions-service
router.post(
  "/subscription-service",
  subscriptionServiceController.createshopcat
);
router.get("/subscription-service/:id", subscriptionServiceController.findAll);
router.get(
  "/subscriptionplan-service",
  subscriptionplanServiceController.findAll
);
router.put(
  "/editservicesubscription/:id",
  subscriptionServiceController.Updatecat
);
router.post(
  "/subscriptionplan-service",
  subscriptionplanServiceController.createshopcat
);

router.get("/allsubscribedservices", subscriptionServiceController.findallsubs);
router.put(
  "/editsubscriptionplan-service/:id",
  subscriptionplanServiceController.Updateplan
);
router.delete(
  "/deletesubscriptionplan-service/:id",
  subscriptionplanServiceController.Delete
);

//=========================================//
//Subscriptions-vehicle
router.post(
  "/subscription-vehicle",
  subscriptionVehicleController.createshopcat
);
router.get("/subscription-vehicle/:id", subscriptionVehicleController.findAll);
router.get(
  "/subscriptionplan-vehicle",
  subscriptionplanVehicleController.findAll
);
router.put(
  "/editvehiclesubscription/:id",
  subscriptionVehicleController.Updatecat
);
router.post(
  "/subscriptionplan-vehicle",
  subscriptionplanVehicleController.createshopcat
);
router.get("/allsubscribedvehicles", subscriptionVehicleController.findallsubs);
router.put(
  "/editsubscriptionplan-vehicle/:id",
  subscriptionplanVehicleController.Updateplan
);
router.delete(
  "/deletesubscriptionplan-vehicle/:id",
  subscriptionplanVehicleController.Delete
);

//=========================================//
//Wishlist
router.post("/wishlist", wishlistController.createWishlist);
router.get("/getwishlistbyid/:id", wishlistController.getwishlistbyid);
router.post("/setshopwishlist", wishlistController.setshopwishlist);
router.post("/setvehiclewishlist", wishlistController.setvehiclewishlist);
router.post("/setservicewishlist", wishlistController.setservicewishlist);
router.get("/getshopwishlistbyid/:id", wishlistController.getshopwishlist);
router.get("/getvehiclewishlistbyid/:id", wishlistController.getvehiclewishlist);
router.get("/getservicewishlistbyid/:id", wishlistController.getservicewishlist);
//=========================================//
//Add to Cart
router.post("/addtocart", cartController.addtoCart);
router.get("/getcart", cartController.getCartProducts);
router.get("/getcart/:id", cartController.getCartProductsbycus);
router.delete(
    "/cart/:id",
    cartController.deleteCart
  );

//=========================================//
//Admin
router.post("/adminregister", adminController.adminRegister),
  router.post("/adminlogin", adminController.adminLogin);
router.get("/admincount", adminController.getallcount);
router.get("/getAdminUsers", adminController.adminUsers);
router.post("/deleteadmin",adminController.deleteadmin)

//=========================================//
//Shop Active
router.post("/shopactive", shopactiveController.createactive);
router.get("/getshopactive/:id", shopactiveController.getactive);
router.put("/editshopactive/:id", shopactiveController.editactive);
router.get("/getallshopactive/:id", shopactiveController.getallactive);
router.delete("/deleteshopactive/:id", shopactiveController.Delete);

//=========================================//
//Service Active
router.post("/serviceactive", serviceactiveController.createactive);
router.get("/getserviceactive/:id", serviceactiveController.getactive);
router.put("/editserviceactive/:id", serviceactiveController.editactive);
router.get("/getallserviceactive/:id", serviceactiveController.getallactive);
router.delete("/deleteserviceactive/:id", serviceactiveController.Delete);

//=========================================//
//Vehicle Active
router.post("/vehicleactive", vehicleactiveController.createactive);
// router.get("/getvehicleactive/:id", vehicleactiveController.getactive);
// router.put("/editvehicleactive/:id", vehicleactiveController.editactive);
router.get("/getallvehicleactive/:id", vehicleactiveController.getallactive);
router.delete("/deletevehicleactive/:id", vehicleactiveController.Delete);

//=========================================//
//Banners
router.post(
  "/banner",
  upload.single("banner_image"),
  BannerController.createshopcat
);
router.get("/banner", BannerController.findAll);
router.get("/banner/:id", BannerController.getbyid);
router.get("/banners/:id", BannerController.getallbannertype);

router.put(
  "/banner/:id",
  upload.single("banner_image"),
  BannerController.Updatecat
);

router.put("/bannername/:id", BannerController.Updatecat_name);
router.delete("/banner/:id", BannerController.Delete);

//=========================================//
//Customer Issue
router.post("/customerissue", customerIssueController.addIssue);
router.get("/allissues", customerIssueController.getIssues);
router.put("/editissue/:id", customerIssueController.editIssue);
router.delete("/deleteissue/:id", customerIssueController.Delete);

//=========================================//
//Vendor Pages
router.post("/addvendorpage", vendorpageController.createpage);
router.get("/getvendorpages", vendorpageController.findAll);
router.get("/getpagesbyid/:id", vendorpageController.getpagesbyid);
router.put("/editvendorpage/:id", vendorpageController.Updatepage);
router.delete("/deletevendorpage/:id", vendorpageController.Delete);

//=========================================//
//Customer Pages
router.post("/addcustomerpage", customerpageController.createpage);
router.get("/getcustomerpages", customerpageController.findAll);
router.put("/editcustomerpage/:id", customerpageController.Updatepage);
router.delete("/deletecustomerpage/:id", customerpageController.Delete);

//=========================================//
//Youtube
router.post("/addvideo", youtubeController.addvideo);
router.get("/getvideos", youtubeController.getallvideos);
router.get("/getvideos/:id", youtubeController.getallvideosbycat);

router.put("/editvideo/:id", youtubeController.editVideo); 
router.delete("/deletevideo/:id", youtubeController.deleteVideo);

//=========================================//
//Policies & terms & conditions.
router.post("/setpolicy",policiesController.setpolicy);
router.post("/setaboutus",policiesController.setaboutus);
router.post("/settermsandconditions",policiesController.settandc);
router.post("/setrefundpolicy",policiesController.setrefundpolicy);
router.get("/getpolicy",policiesController.getpolicy);
router.get("/getaboutus",policiesController.getaboutus);
router.get("/gettermsandconditions",policiesController.gettandc);
router.get("/getrefundpolicy",policiesController.getrefundpolicy);