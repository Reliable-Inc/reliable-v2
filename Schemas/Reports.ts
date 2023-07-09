import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ReportsSchema = new Schema({
  BugTitle: {
    type: String,
    required: true
  },
  BugDescription: {
    type: String,
    required: true
  },
  BugExpectation: {
    type: String,
    required: true
  },
  ReportedBy: {
    type: String,
    required: true
  },
  ReportedPfp: {
    type: String,
    required: true
  },
  ReportedDate: {
    type: String,
    required: false,
    default: formatDate
  }
});

function formatDate() {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = new Intl.DateTimeFormat('en', { month: 'long' }).format(date);
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

const Report = model('Report', ReportsSchema);

export default Report;
