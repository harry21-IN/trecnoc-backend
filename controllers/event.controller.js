const Event = require("../models/event.models");

const getEvent = async (req, res) => {
  try {
    const events = await Event.find().sort({ timestamp: -1 });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSpecEvent = async (req, res) => {
  try {
    const eventId = req.params._id;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addEvent = async (req, res) => {
  const event = new Event(req.body);

  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateEvent = async (req, res) => {

  try {
    const event = await Event.findOne({ _id:req.params._id});

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    event.title = req.body.title;
    event.description = req.body.description;
    event.privacy = req.body.privacy;

    const updatedEvent = await event.save();
    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const updateSignup = async (req, res) => {

  try {
    const event = await Event.findOne({ _id:req.params._id});

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }
    event.signups = req.body.signups;

    const updatedEvent = await event.save();
    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const deleteEvents = async (req, res) => {
  const { ids } = req.body;

  try {
    const deletedEvents = await Event.deleteMany({ _id: { $in: ids } });

    if (deletedEvents.deletedCount === 0) {
      return res.status(404).json({ message: "No events found for deletion." });
    }

    res.status(200).json({ message: "Events deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = {
  getEvent,
  addEvent,
  updateEvent,
  deleteEvents,
  getSpecEvent,
  updateSignup
};
