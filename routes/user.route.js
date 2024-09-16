const express = require("express");
const router = express.Router();
const {
  getActivities,
  addActivity,
  updateActivity
} = require("../controllers/user.controller");



/* Creating a route for the get request. */
router.get("/user", getActivities);
/* Creating a route for the post request. */
router.post("/users", addActivity);
router.put("/updateuser/:id",updateActivity);

module.exports = router;