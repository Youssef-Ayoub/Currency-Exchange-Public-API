const express = require("express");
const rateLimit = require("express-rate-limit");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Apply rate limiting middleware
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15, // limit each IP to 15 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});

// Apply rate limiting to all requests
app.use(limiter);

// Define routes and handlers

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/api/currency-conversion", async (req, res) => {
  // Define currencies and API request options
  const fromCurrency = "aed";
  const toCurrencies = ["usd", "inr"];
  const requestOptions = {
    method: "POST",
    url: "https://api.apyhub.com/data/convert/currency/multiple",
    headers: {
      "Content-Type": "application/json",
      "apy-token":
        "APY0jV47e68fhF8XaUYdR4piRPqabwjprJelWTE2nldkI9E9y97O2ozmv0BZO6mTb9DjGTHsm",
    },
    data: { source: fromCurrency, targets: toCurrencies },
  };

  try {
    // Make request to external API
    const response = await axios.request(requestOptions);

    // Return response data to client
    res.json(response.data);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Error fetching exchange rates" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
