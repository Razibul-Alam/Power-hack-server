const express=require('express')
const app=express()
const cors=require('cors')
const{MongoClient}=require('mongodb')
require("dotenv").config();
const{ObjectId}=require('mongodb')
const port=process.env.PORT || 5000
//  using middleware
app.use(cors())
app.use(express.json())
// database connect
const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aicgl.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// create a client connection
async function run() {
    try {
      // Connect the client to the server
      await client.connect();
      console.log('database connected')
      const database = client.db('Power-Hack');
    const billsCollection = database.collection('AllBills');
    // const userCollection=database.collection('users')

    // add bill
    app.post('/api/add-billing', async(req,res)=>{
        console.log('hit here')
        const billInfo=req.body
        console.log(billInfo)
        const insertedResult=await billsCollection.insertOne(billInfo)
        res.json(insertedResult)
        console.log(insertedResult)
    })
    // load all billings
    app.get('/api/billing-list', async(req,res)=>{
      const category=req.query.category
      const searchText=req.query.searchText
      console.log(category,searchText)
      const pageNumber=req.query.page
        let getAllBills=await billsCollection.find({}).skip(parseInt(10*pageNumber)).limit(10).toArray();
        const AllBills=await billsCollection.find({});
        let dataCount= await AllBills.count()
        
        if(searchText){
          const getBills=await billsCollection.find({}).limit(10).toArray();
           if(category=='email'){
            getAllBills=getBills.filter(bill=>bill.email.includes(searchText))
           }else if(category=='phone'){
            getAllBills=getBills.filter(bill=>bill.phone.includes(searchText))
           }else{
            getAllBills=getBills.filter(bill=>bill.name.includes(searchText))
           }
           dataCount=10
          res.send({dataCount,getAllBills})
        }else{
          res.send({dataCount,getAllBills})
        }
    })
    // load single bill
    app.get('/api/single-billing/:id', async(req,res)=>{
        const itemQuery=req.params.id
        const getSingleBill=await billsCollection.findOne({_id:ObjectId(itemQuery)});
        res.json(getSingleBill)
    })
     
    //  delete bill by id
    app.delete('/api/delete-billing/:id',async(req,res)=>{
        const removeId=req.params.id
        const deletedItem= await billsCollection.deleteOne({_id:ObjectId(removeId)})
        res.json(deletedItem)
    })
   // Edit billing
   app.put("/api/update-billing/:id", async (req, res) => {
    const filter = {_id: ObjectId(req.params.id) };
    console.log(filter);
    const updateStatus = {
      $set: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        ammount: req.body.ammount,
      },
    };
    const updateResult = await billsCollection.updateOne(
      filter,
      updateStatus
    );
    console.log(updateResult);
    res.json(updateResult);
  });
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

// server listening
app.listen(port,()=>{
    console.log('server is running')
})