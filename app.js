const express=require("express");
const bodyParser=require("body-parser");
const app=express();
const mongoose=require("mongoose");
const { render } = require("ejs");
mongoose.connect("mongodb+srv://himank17mishra:123qweasdzxcQ!@cluster0.te1kxmj.mongodb.net/todolistDB",{useNewUrlParser: true});


 
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"));

var day=new Date();
var num=day.getDay();
var dayName=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

var task="";

var items=[];

var iteml={};

var dataItem="";
var listTopic="";


const itemSchema=new mongoose.Schema({
    item:String
}) 


const ItemList=mongoose.model("ItemList",itemSchema);





const ListSchema=new mongoose.Schema({
    name:String,
       
    lists:[itemSchema]
    
}) 

const a=new ItemList({item:"himank"});
const b=new ItemList({item:"mishra"});




const List=mongoose.model("List",ListSchema);

app.get("/:topic",function(req,res)
{
     const topicName=req.params.topic;
       
    List.findOne({name:topicName},function(err,foundList)
    {
           
       if(!err)
       {
           if(!foundList)
             { 
                  const topicArray=new List({
                      name:topicName,
                      lists:[]

                  })         
                   topicArray.save();
                    
                  
                    res.redirect("/"+topicName);  
                
             }
 

          else
          {
            //   console.log("does");
             res.render("list",{dayNum:topicName,list:foundList.lists});


          }


       }
    })





})

app.get("/",function(req,res)
{
    res.redirect("/today");
})


app.post("/",function(req,res)
{
    const itemDetail=req.body.newItem;
    const name_topic=req.body.subName;
   
    const workItem=new ItemList({
        item:itemDetail
    })    
   
   
    List.findOne({name:name_topic},function(err,foundOne)
    {
        if(!err)
         {
             if(foundOne)
             {

                 foundOne.lists.push(workItem);
                 foundOne.save();
                 console.log(foundOne.lists);
              
                }

          }

       })
    

     res.redirect("/"+name_topic);


});



app.post("/delete/:delTopic",function(req,res)
{
     const delTopic=req.params.delTopic;
     const delitem=req.body.del;
     
     List.findOne({name:delTopic},function(err,foundOne)
     {
         if(!err)
          {
              if(foundOne)
              {
                   

                  List.updateMany({name:delTopic},{$pull:{lists:{_id:delitem}}},function(err){});


               
                 }
 
           }
 
        })



        res.redirect("/"+delTopic);
     




});



app.post("/search",function(req,res)
{
   const Listing=req.body.reqList;
    res.redirect("/"+Listing);

})



let port=process.env.PORT||3000;

app.listen(port,function(){console.log("server running on port 3000")})