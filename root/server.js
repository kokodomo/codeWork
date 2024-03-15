const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.options('*',cors());

// Middleware
app.use(bodyParser.json()); 
app.use(morgan('tiny'));
// Connect to MongoDB
mongoose.connect('mongodb+srv://admin:1234@cluster0.fx8abhk.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName : 'testCode'
}).then(()=>{
  console.log('database connection is ready...')
}).catch((err)=>{
  console.log('connect DB error',err)
});

const PersonalInfo = mongoose.model('PersonalInfo', {
  fullName: String,
  nickname: String,
  birthdate: Date,
  age: Number,
  gender: String,
});


// app.use(bodyParser.json());

// Routes
app.get('/api/personalinfo', async (req, res) => {
  try {
    const personalInfos = await PersonalInfo.find();
    res.json(personalInfos);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.post('/api/personalinfo', async (req, res) => {
  try {
    const personalInfo = new PersonalInfo(req.body);
    await personalInfo.save();
    res.status(201).send('Personal info added successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.put('/api/personalinfo/:id', async (req, res) => {
  try {
    await PersonalInfo.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).send('Personal info updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.delete('/api/personalinfo/:id', async (req, res) => {
  try {
    await PersonalInfo.findByIdAndDelete(req.params.id);
    res.status(200).send('Personal info deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});