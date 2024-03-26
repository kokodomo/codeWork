const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.options("*", cors());

// Middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));
// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://admin:1234@cluster0.fx8abhk.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "testCode",
    }
  )
  .then(() => {
    console.log("database connection is ready...");
  })
  .catch((err) => {
    console.log("connect DB error", err);
  });

const PersonalInfo = mongoose.model("PersonalInfo", {
  fullName: String,
  nickname: String,
  birthdate: String,
  age: Number,
  gender: String,
});

// app.use(bodyParser.json());

// Routes
app.get("/api/personalinfo", async (req, res) => {
  try {
    const personalInfos = await PersonalInfo.find();
    res.json(personalInfos);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.get("/api/personalinfo/:id", async (req, res) => {
  try {
    const personalInfo = await PersonalInfo.findById(req.params.id);
    if (!personalInfo) {
      return res
        .status(404)
        .json({ message: "Personal information not found" });
    }
    res.json(personalInfo);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.post("/api/personalinfo", async (req, res) => {
  try {
    const { userId, fullName, nickname, birthdate, age, gender } = req.body;
    const personalInfo = new PersonalInfo({
      userId,
      fullName,
      nickname,
      birthdate,
      age,
      gender,
    });
    await personalInfo.save();
    res.json(personalInfo);
  } catch (error) {
    console.error("Error adding personal info:", error);
    res.status(500).json({ message: "Failed to add personal info" });
  }
});

app.put("/api/personalinfo/:id", async (req, res) => {
  try {
    await PersonalInfo.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).send("Personal info updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.delete("/api/personalinfo/:id", async (req, res) => {
  const userId = req.params.id; // Extract the userId from request parameters
  try {
    // Use mongoose to delete the user with the specified ID
    // console.log()
    await PersonalInfo.deleteOne({ _id: userId });
    res
      .status(200)
      .json({ status: "OK", message: "Personal info deleted successfully" });
  } catch (error) {
    console.error("Error deleting personal info:", error);
    res.status(500).json({ status: "Error", message: "Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
