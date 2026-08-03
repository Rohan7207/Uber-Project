const http = require("http"); // Import http module to create server
const app = require("./src/app");
const PORT = process.env.PORT || 3000; // Use environment variable PORT or default to 3000
const connectDB = require("./src/db/db");

connectDB(); // Connect to database which is local database afterwards we will connect to actual database.

const server = http.createServer(app); // Create server using app

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
