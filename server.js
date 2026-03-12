const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const round1Routes = require("./routes/round1Routes");
const r2q1Routes = require("./routes/r2q1_Routes");
const r2q2Routes = require("./routes/r2q2_Routes");
const r2q4Routes = require("./routes/r2q4_Routes");
const r2q5Routes = require("./routes/r2q5_Routes");
const r2q6Routes = require("./routes/r2q6_Routes");


// Connect to MongoDB 
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost/blindbuild")
  .then(() => console.log("🚀 Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));




const app = express();
app.use(express.json());



// Root route
app.get("/", (req, res) => {
  res.send("🚀 BlindBuild API running...");
});
app.post("/debug", (req,res)=>{
  res.json({msg:"debug working"});
});
// Routes
app.use("/api/round1", round1Routes);
app.use("/api/round2/eve-reg", r2q1Routes);
app.use("/api/round2/w-s", r2q2Routes);
app.use("/api/round2/check-in", r2q4Routes);
app.use("/api/round2/f-r", r2q5Routes);
app.use("/api/round2/l-f", r2q6Routes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});