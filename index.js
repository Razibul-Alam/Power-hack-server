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
    const userCollection=database.collection('users')
    // add bill
    app.post('/api/add-billing', async(req,res)=>{
        console.log('hit here')
        const billInfo=req.body
        console.log(billInfo)
        const insertedResult=await billsCollection.insertOne(billInfo)
        res.json(insertedResult)
        console.log(insertedResult)
    })
    // add user
    app.post('/addUser', async(req,res)=>{
        const user=req.body
        console.log(user)
        const insertedResult=await userCollection.insertOne(user)
        res.json(insertedResult)
    })
    // load allevents
    app.get('/allbills', async(req,res)=>{
        const getAllBills=await billsCollection.find({}).toArray();
        res.json(getAllBills)
    })
    // load all bookings by email
    app.get('/getOrdersByEmail', async(req,res)=>{
        const queryEmail=req.query.email;
        console.log(queryEmail)
        const getOrders=await orderCollection.find({email:queryEmail}).toArray();
        res.json(getOrders)
    })
    // load single item
    app.get('/singleid/:id', async(req,res)=>{
        const itemQuery=req.params.id
        const getSingleBill=await billsCollection.findOne({_id:ObjectId(itemQuery)});
        res.json(getSingleBill)
    })
     
    //  delete an item by id
    app.delete('/removeBill/:id',async(req,res)=>{
        const removeId=req.params.id
        // console.log(removeId)
        const deletedItem= await billsCollection.deleteOne({_id:ObjectId(removeId)})
        // console.log(deletedItem)
        res.json(deletedItem)
    })
   // Edit gov jobs
   app.put("/updatebill/:id", async (req, res) => {
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

app.get('/',(req,res)=>{
    res.send('welcome to car point')
})
// server listening
app.listen(port,()=>{
    console.log('server is running')
})