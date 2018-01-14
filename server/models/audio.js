// grab the things we need
var mongoose = require("./db");
var Schema = mongoose.Schema;

// create a schema
var tagSchema = new Schema({
  tag: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  audio: [{ type: mongoose.Schema.ObjectId, ref: "Audio" }]
});
tagSchema.index({tag: 'text'});

var audioSchema = new Schema({
  name: { type: String, required: true, unique: true },
  audioFile: { type: Object, required: true },
  published: Boolean,
  meta: {
    recordedOn: Date,
    recordedAt: String
  },
  tags: [{ type: mongoose.Schema.ObjectId, ref: "Tag" }],
  created_at: Date,
  updated_at: Date
});
audioSchema.index({name: 'text'});

tagSchema.statics.santizeTag = function(tag) {
  tag = tag.replace(/\W+/g, "-");
  tag = tag.replace(/-{2,}/g, "-");
  tag = tag.toLowerCase();
  return tag;
};

// on every save, add the date
audioSchema.pre("save", function(next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at) this.created_at = currentDate;

  next();
});

// the schema is useless so far
// we need to create a model using it
var Audio = mongoose.model("Audio", audioSchema);
var Tag = mongoose.model("Tag", tagSchema);

// make this available to our users in our Node applications
module.exports = [Audio, Tag];
