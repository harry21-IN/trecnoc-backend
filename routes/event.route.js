const express = require("express");
const router = express.Router();
const {
  getEvent,
  addEvent,
  updateEvent,
  deleteEvents,
  getSpecEvent,
  updateSignup,
} = require("../controllers/event.controller");


router.get("/getevent", getEvent);

router.get("/getspecevent/:_id", getSpecEvent);

router.post("/addevent", addEvent);

router.put("/eventupdate/:_id", updateEvent);

router.put("/eventupdatesignup/:_id", updateSignup);

router.delete("/deleteevents", deleteEvents);

module.exports = router;
