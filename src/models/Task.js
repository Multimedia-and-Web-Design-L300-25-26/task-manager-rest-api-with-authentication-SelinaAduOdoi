import mongoose from "mongoose";

// Create Task schema
// Fields:
// - title (String, required)
// - description (String)
// - completed (Boolean, default false)
// - owner (ObjectId, ref "User", required)
// - createdAt (default Date.now)

const taskSchema = new mongoose.Schema({
	// Short title for the task item.
	title: {
		type: String,
		required: true,
		trim: true,
	},
	// Optional additional details.
	description: {
		type: String,
		default: "",
		trim: true,
	},
	// Completion status for future task tracking workflows.
	completed: {
		type: Boolean,
		default: false,
	},
	// Owner links each task to exactly one authenticated user.
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	// Timestamp used for ordering and traceability.
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Task = mongoose.model("Task", taskSchema);

export default Task;