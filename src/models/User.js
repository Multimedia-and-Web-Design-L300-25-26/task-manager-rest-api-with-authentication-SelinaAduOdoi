import mongoose from "mongoose";


// Create User schema
// Fields:
// - name (String, required)
// - email (String, required, unique)
// - password (String, required, minlength 6)
// - createdAt (default Date.now)



const userSchema = new mongoose.Schema({
  // User's display name.
  name: {
    type: String,
    required: true,
    trim: true,
  },
  // User's email address for authentication and notifications.
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  // User's hashed password for authentication.
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  // Timestamp for when the user account was created.
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

export default User;