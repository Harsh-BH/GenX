require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.28", // Specify Solidity version
  networks: {
    hardhat: {}, // Default local network
    Amoy: { // Polygon Mumbai Testnet
      url: "https://rpc-amoy.polygon.technology", // RPC URL for Mumbai
      accounts: ["YOUR_PRIVATE_KEY"], // Replace with your wallet private key
    },
    polygonMainnet: { // Polygon Mainnet
      url: "https://rpc-mainnet.maticvigil.com", // RPC URL for Mainnet
      accounts: ["93c1718e7026ee1bca39ab34ef3927b91bae858c5d7ba41526a372b56fa08196"], // Replace with your wallet private key
    },
  },
  etherscan: {
    apiKey: {
      Amoy: "JT9K486S4C6FY1E6W57RG5PH4I7PTPYPEV", // Replace with your Polygonscan API key for Mumbai
      polygon: "JT9K486S4C6FY1E6W57RG5PH4I7PTPYPEV", // Replace with your Polygonscan API key for Mainnet
    },
  },
};
