const Activity = require("../models/user.models");

/**
 * It's an async function that uses the Activity model to find all activities and then returns a status of 200 with the activities in the response body.
 */
const getActivities = async (req, res) => {
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
const addActivity = async (req, res) => {
  const activity = new Activity(req.body);

  try {
    const newActivity = await activity.save();
    res.status(201).json(newActivity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findOne({ id: req.params.id });

    if (!activity) {
      return res.status(404).json({ message: "Activity not found." });
    }

    activity.limit = req.body.limit;
    const updatedActivity = await activity.save();
    res.status(200).json(updatedActivity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getActivities,
  addActivity,
  updateActivity
};