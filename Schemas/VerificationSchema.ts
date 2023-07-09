const mongoose = require('mongoose');

const verificationRoleSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  roleId: { type: String, required: true },
});

const VerificationRole = mongoose.model(
  'verificationRole',
  verificationRoleSchema
);

export default VerificationRole;
