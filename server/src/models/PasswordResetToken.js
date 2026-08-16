import mongoose from "mongoose";

const passwordResetTokenSchema =
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      tokenHash: {
        type: String,
        required: true,
        unique: true,
      },

      expiresAt: {
        type: Date,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );


/*
 * Automatically delete reset tokens
 * when expiresAt is reached.
 *
 * Do NOT add index: true to expiresAt
 * above because this TTL index already
 * creates the required index.
 */

passwordResetTokenSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
  }
);


const PasswordResetToken =
  mongoose.models.PasswordResetToken ||
  mongoose.model(
    "PasswordResetToken",
    passwordResetTokenSchema
  );


export default PasswordResetToken;