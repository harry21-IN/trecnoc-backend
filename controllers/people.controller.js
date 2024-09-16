const Activity = require("../models/people.models");

/**
 * It's an async function that uses the Activity model to find all activities and then returns a status of 200 with the activities in the response body.
 */
const getPeople = async (req, res) => {
  try {
    const activities = await Activity.find();
    res.status(200).json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * It creates a new activity and saves it to the database.
 */
const addPeople = async (req, res) => {
  const activity = new Activity(req.body);

  try {
    const newActivity = await activity.save();
    res.status(201).json(newActivity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getPeople,
  addPeople,
};