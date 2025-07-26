// const mongoose = require("mongoose");
// const initData = require("./data.js");
// const Listing = require("../models/listing.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// main()
//   .then(() => {
//     console.log("connected to DB");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// async function main() {
//   await mongoose.connect(MONGO_URL);
// };

// const initDB = async () => {
//   // await Listing.deleteMany({});
//   initData.data=initData.data.map((obj)=>({...obj,owner:"677d83003eb4c7876f65602b"}));
//   await Listing.insertMany(initData.data);
//   console.log("data was initialized");
// };

// initDB();







// working but not showing correct location on map
// const mongoose = require("mongoose");
// const initData = require("./data.js");
// const Listing = require("../models/listing.js");
// const User = require("../models/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// main()
//   .then(() => {
//     console.log("connected to DB");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// async function main() {
//   await mongoose.connect(MONGO_URL);
// }

// const initDB = async () => {
//   await Listing.deleteMany({});
//   await User.deleteMany({});

//   const user = new User({ email: "student@gmail.com", username: "delta-student" });
//   const registeredUser = await User.register(user, "helloworld");

//   initData.data = initData.data.map((obj) => ({
//     ...obj,
//     owner: registeredUser._id,
//     geometry: {
//       type: "Point",
//       coordinates: [77.5946, 12.9716], // default dummy location
//     },
//   }));

//   await Listing.insertMany(initData.data);
//   console.log("✅ Data was initialized");
// };

// initDB();





const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
require("dotenv").config(); // needed to access process.env.MAP_TOKEN
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  await User.deleteMany({});

  const user = new User({ email: "student@gmail.com", username: "delta-student" });
  const registeredUser = await User.register(user, "helloworld");

  const listingsWithGeo = [];

  for (let obj of initData.data) {
    const geoData = await geocodingClient.forwardGeocode({
      query: obj.location,
      limit: 1,
    }).send();

    const newListing = {
      ...obj,
      owner: registeredUser._id,
      geometry: geoData.body.features[0]?.geometry || {
        type: "Point",
        coordinates: [0, 0],
      },
    };

    listingsWithGeo.push(newListing);
  }

  await Listing.insertMany(listingsWithGeo);
  console.log("✅ Data with real geolocation was initialized");
};

initDB();
