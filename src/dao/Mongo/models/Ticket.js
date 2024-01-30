const mongoose = require('mongoose');
const { Schema } = mongoose;

const TicketSchema = new Schema({
  code: {
    type: String,
    unique: true,
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const Ticket = mongoose.model('Ticket', TicketSchema);

module.exports = Ticket;
