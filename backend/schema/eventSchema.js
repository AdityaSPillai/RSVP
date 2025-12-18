import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: String, // Storing as string relative to UI input for simplicity as per plan
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Conference', 'Workshop', 'Meetup', 'Party', 'Sports', 'Music', 'Other'],

    default: 'Other'
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  image: {
    type: String,
    default: ''
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

const EventModel = mongoose.model("Event", eventSchema);

export default EventModel;
