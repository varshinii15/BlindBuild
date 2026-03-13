require('dotenv').config();
const mongoose = require('mongoose');
const { Workshop, Slot } = require('./models/r2q2_workshop');

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  console.error("Please add MONGO_URI to your .env file.");
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    seedDB();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

const workshopsData = [
  {
    title: "Introduction to AI",
    description: "Learn the basics of Artificial Intelligence and Machine Learning.",
    slots: ["10:00 AM", "2:00 PM"]
  },
  {
    title: "Web Development Bootcamp",
    description: "Build your first full-stack web application from scratch.",
    slots: ["9:00 AM", "3:00 PM"]
  },
  {
    title: "Blockchain Fundamentals",
    description: "Understand the core concepts of blockchain and cryptocurrencies.",
    slots: ["11:00 AM", "4:00 PM"]
  },
  {
    title: "Cybersecurity Basics",
    description: "Learn how to protect systems and networks from digital attacks.",
    slots: ["1:00 PM", "5:00 PM"]
  },
  {
    title: "Cloud Computing with AWS",
    description: "Discover how to deploy and manage applications on AWS.",
    slots: ["10:30 AM", "3:30 PM"]
  }
];

async function seedDB() {
  try {
    for (const data of workshopsData) {
      // 1. Create the Workshop
      const workshop = new Workshop({
        title: data.title,
        description: data.description,
        slots: [] // Will populate after slots are created
      });
      await workshop.save();

      const slotIds = [];
      // 2. Create the Slots for this Workshop
      for (const time of data.slots) {
        const slot = new Slot({
          workshopId: workshop._id,
          time: time,
          available: true
        });
        await slot.save();
        slotIds.push(slot._id);
      }

      // 3. Update Workshop with the saved Slot ObjectIds
      workshop.slots = slotIds;
      await workshop.save();
      
      console.log(`Created workshop: ${workshop.title} with ${slotIds.length} slots.`);
    }

    console.log("Database seeded successfully!");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    mongoose.connection.close();
  }
}
