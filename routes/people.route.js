const express = require("express");
const router = express.Router();
const {
  getPeople,
  addPeople,
} = require("../controllers/people.controller");



/* Creating a route for the get request. */
router.get("/getpeople", getPeople);
/* Creating a route for the post request. */
router.post("/addpeople", addPeople);



module.exports = router;