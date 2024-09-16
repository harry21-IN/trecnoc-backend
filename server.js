const express = require("express");
const mongoose = require("mongoose");

const { utcToZonedTime, subMinutes , addHours } = require("date-fns-tz");
const { format } = require("date-fns");
const ics = require('ics');


const UserRouter = require("./routes/user.route");
const EventRouter = require("./routes/event.route");
const PeopleRouter = require("./routes/people.route");
const nodemailer = require("nodemailer");

const app = express();

require("dotenv").config();

const PORT = 8888;
const MONGODB_URI = process.env.MONGODB_URI;
app.use((req, res, next) => {
  const allowedOrigins = ['https://trecnoc.vercel.app', 'https://trecnoc.vercel.app/']; // Add your trusted domain here
  const origin = req.get('origin');

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  } else {
    res.status(403).json({ error: 'Unauthorized origin' });
  }
});
app.use(express.json());
app.use("/api", UserRouter);
app.use("/api", EventRouter);
app.use("/api", PeopleRouter);

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
};

app.post("/api/sendEmail", async (req, res) => {
  try {
    const { recipientEmails, subject, message, eventTime, eventSubject, eventDescription, eventTimezone,eventOrganizer } = req.body;

    const eventTimeT = new Date(eventTime);
    // const eventTimeT = utcToZonedTime(eventTimeUTC, eventTimezone);
    const eventStartTime = formatDate(eventTimeT);
    const eventEndTime = formatDate(eventTimeT);

    // Build the iCalendar event as a string
    const icsEvent = 
`BEGIN:VCALENDAR
CALSCALE:GREGORIAN
X-WR-TIMEZONE:${eventTimezone}
METHOD:PUBLISH
PRODID:-//Test Cal//EN
VERSION:2.0
TZID:${eventTimezone}
X-LIC-LOCATION:${eventTimezone}
BEGIN:VEVENT
DTSTART;TZID="${eventTimezone}":${eventStartTime}
DTEND;TZID="${eventTimezone}":${eventEndTime}
SUMMARY:${eventSubject}
DESCRIPTION:${eventDescription}
ORGANIZER: ${eventOrganizer}
END:VEVENT
END:VCALENDAR`;

    // Send the email with the iCalendar event as an attachment
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "trecnocevents@gmail.com",
        pass: "oxpmuqyhmaqshknu",
      },
    });

    const mailOptions = {
      from: {
        name: 'From TrecNoc',
        address: 'trecnocevents@gmail.com',
      },
      replyTo: 'trecnocevents@gmail.com',
      to: recipientEmails,
      subject,
      text: message,
      attachments: [{
        filename: 'event.ics',
        content: icsEvent,
      }],
    };

    await transporter.sendMail(mailOptions);
    console.log(mailOptions);

    res.status(200).json({ message: "Email sent successfully!" });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: "Failed to send email." });
  }
});




function getServerTimeZone() {
  try {
    const serverTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return serverTimeZone;
  } catch (error) {
    console.error("Error getting server time zone:", error);
    // You can provide a default time zone here in case of an error
    return "Your_Default_Time_Zone";
  }
}
const serverTimeZone = getServerTimeZone()

async function updateEventStatusAndSendEmails(serverTimeZone) {

  try {

    const Event = require("./models/event.models");
    const events = await Event.find();

    for (const event of events) {
      const eventDateTime = new Date(event.date);


      const eventDateTimeUTC = utcToZonedTime(
        eventDateTime,
        "UTC"
      );

      const serverTime = utcToZonedTime(new Date(), event.timezone);

      if (serverTime > eventDateTimeUTC) {
        await Event.updateOne({ _id: event._id }, { $set: { status: "inactive" } });

      }
    }
  } catch (error) {
    console.error("Error updating event status and sending emails:", error);
  }
}


mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log("Server started on port " + PORT));

    setInterval(() => updateEventStatusAndSendEmails(serverTimeZone), 1000);
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
