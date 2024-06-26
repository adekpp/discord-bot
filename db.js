require("dotenv").config();
const PocketBase = require("pocketbase/cjs");

const db = new PocketBase(process.env.DATABASE); // Replace with your PocketBase URL

module.exports = {
  db,
};
