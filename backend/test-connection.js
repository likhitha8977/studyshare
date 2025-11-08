// MongoDB Connection Troubleshooting Script
// Run this with: node test-connection.js

require("dotenv").config();
const mongoose = require("mongoose");

console.log("🔍 Testing MongoDB Atlas Connection...\n");
console.log("📋 Node Version:", process.version);
console.log(
  "📋 MongoDB Driver Version:",
  require("mongoose/package.json").version
);
console.log("📋 Environment:", process.env.NODE_ENV || "development");
console.log("\n" + "=".repeat(50) + "\n");

// Test different connection configurations
const configs = [
  {
    name: "Config 1: With SSL options",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
    },
  },
  {
    name: "Config 2: Without SSL options",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  {
    name: "Config 3: With serverSelectionTimeoutMS",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    },
  },
];

async function testConnection(config) {
  try {
    console.log(`\n⏳ Testing: ${config.name}...`);

    await mongoose.connect(process.env.MONGO_URI, config.options);

    console.log("✅ SUCCESS! Connection established!");
    console.log("📊 Connection state:", mongoose.connection.readyState);
    console.log("🗄️  Database:", mongoose.connection.db.databaseName);

    // Test a simple query
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "📁 Collections:",
      collections.map((c) => c.name).join(", ") || "None yet"
    );

    await mongoose.disconnect();
    console.log("✅ Configuration works!\n");

    return true;
  } catch (err) {
    console.log("❌ FAILED:", err.message);
    try {
      await mongoose.disconnect();
    } catch (e) {
      // Ignore disconnect errors
    }
    return false;
  }
}

async function runTests() {
  console.log("🔧 Testing different MongoDB connection configurations...\n");

  for (const config of configs) {
    const success = await testConnection(config);
    if (success) {
      console.log("\n🎉 Found working configuration!");
      console.log("📝 Use these options in your server.js:");
      console.log(JSON.stringify(config.options, null, 2));
      return;
    }
    // Wait a bit between attempts
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  console.log("\n❌ All configurations failed.");
  console.log("\n🔍 Additional Troubleshooting Steps:");
  console.log("1. Check MongoDB Atlas Dashboard - Is your cluster running?");
  console.log("2. Network Access - Add 0.0.0.0/0 to allow all IPs");
  console.log("3. Database Access - Verify user credentials");
  console.log("4. Try updating Node.js to latest LTS version");
  console.log("5. Try: npm install mongoose@latest");
}

runTests()
  .then(() => {
    console.log("\n✅ Test completed!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("\n❌ Unexpected error:", err);
    process.exit(1);
  });
