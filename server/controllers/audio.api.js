var express = require("express"),
  router = express.Router(),
  async = require("async"),
  fs   = require('fs'),
  config = require('../config/config'),
  [Audio, Tag] = require("../models/audio");

/* GET all audio. */
router.get("/", (req, res) => {
  Audio.find({})
  .populate('tags')
  .exec((error, audio) => {
    if (error) {
      res.status(500).send(error);
      return;
    }

    res.status(200).json(audio);
  });
});
/* GET all tags. */
router.get("/tags", (req, res) => {
  Tag.find({}, (error, tags) => {
    if (error) {
      res.status(500).send(error);
      return;
    }

    res.status(200).json(tags);
  });
});

/* Create an audio. */
router.post("/", (req, res) => {
  let data = req.body;
  let audio = new Audio({
    name: data.name,
    audioFile: data.audioFile,
    meta: {
      recordedOn: new Date(data.meta.recordedOn),
      recordedAt: data.meta.recordedAt
    },
    published: data.published || false
  });

  let tagsInserted = [];
  async.forEachOf(
    data.tags,
    (value, key, callback) => {
      if (value.hasOwnProperty("_id")) {
        // Update existing tag
        let tagsAudio = value.audio;
        if (tagsAudio instanceof Array) {
          tagsAudio.push(audio);
        } else {
          tagsAudio = [audio];
        }
        Tag.findByIdAndUpdate(
          value._id,
          { audio: tagsAudio },
          (error, tag) => {
            if (error) {
              console.error("Error occurred while saving tag " + tag.tag);
            } else {
              tagsInserted.push(tag);
              callback();
            }
          }
        );
      } else {
        // Add a new tag
        let slug = Tag.santizeTag(value.slug);
        let tag = new Tag({ tag: value.tag, slug: slug, audio: [audio] });
        tag.save((error, newtag) => {
          if (error) {
            console.error(
              "Issue while adding tag '" + encodeURIComponent(tag.tag) + "'"
            );
          } else {
            tagsInserted.push(newtag);
            callback();
          }
        });
      }
    },
    function(err) {
      console.log(tagsInserted);
      audio.tags = tagsInserted;
      audio.save(error => {
        if (error) {
          res.status(500).send(error);
          return;
        }
        res.status(201).json({
          message: "Audio created successfully"
        });
      });
    }
  );
});

// function addAudioTags(tagsData, audio) {
//   let tagsInserted = [];
//   async.forEachOf(
//     tagsData,
//     (value, key, callback) => {
//       let slug = Tag.santizeTag(value.slug);
//       let found = false;
//       Tag.findOne({ slug: slug }, (error, tags) => {
//         if (error) {
//           return callback(error);
//         }
//         if (tags != null) {
//           found = true;
//           let tagsAudio = [audio, ...tags.audio];
//           tags.update({ slug: slug }, { audio: tagsAudio }, error => {
//             if (error) {
//               console.error("Error occurred while saving tag " + tags.tag);
//             } else {
//               tagsInserted.push(tags);
//             }
//           });
//         }
//       });

//       if (!found) {
//         let tag = new Tag({ tag: value.tag, slug: slug, audio: [audio] });
//         tag.save(error => {
//           if (error) {
//             console.error(
//               "Issue while adding tag '" + encodeURIComponent(tag.tag) + "'"
//             );
//           } else {
//             tagsInserted.push(tag);
//           }
//         });
//       }
//     },
//     function(err) {
//       if (err) console.error(err.message);
//       return tagsInserted;
//     }
//   );
// }

// Create a tag
router.post("/tags", (req, res) => {
  let slug = Tag.santizeTag(req.body.tag);
  let tag = new Tag({ tag: req.body.tag, slug: slug });
  tag.save(error => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(201).json({
      message: "Tag created successfully"
    });
  });
});

/* GET tags by search string. */
router.get("/tags/search", (req, res) => {
  let searchStr = decodeURIComponent(req.query.name);
  Tag.find({ $text: { $search: searchStr } })
    .limit(10)
    .exec((error, tags) => {
      if (error) {
        res.status(500).send(error);
        return;
      }
      res.status(200).json(tags);
    });
});

/* GET one tag by tag. */
router.get("/tags/:tag", (req, res) => {
  let slug = Tag.santizeTag(decodeURIComponent(req.params.tag));
  Tag.findOne({ slug: slug }, (error, tags) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.status(200).json(tags);
  });
});

/* GET one audio by name. */
router.get("/name/:name", (req, res) => {
  Audio.findOne({ name: req.params.name }, (error, audio) => {
    if (error) {
      res.status(500).send(error);
      return;
    }

    res.status(200).json(audio);
  });
});

router.get("/playback/:id", (req, res) => {
  Audio.findById(req.params.id, (error, audio) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    if(audio.audioFile && audio.audioFile.name) {
      let filePath = config.upload_path + audio.audioFile.name;
      let stat = fs.statSync(filePath);
      res.writeHead(200, {
        "Content-Type": audio.audioFile.type || "audio/mpeg",
        "Content-Length": stat.size
      });

      // We replaced all the event handlers with a simple call to util.pump()
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.status(404).send("Audio file not found");
      return;
    }
  });
});

/* GET one audio by ID. */
router
  .route("/:id")
  .get((req, res) => {
    Audio.findById(req.params.id, (error, audio) => {
      if (error) {
        res.status(500).send(error);
        return;
      }
      res.status(200).json(audio);
    });
  })

  /* Update an audio. */
  .put((req, res) => {
    Audio.findById(req.params.id, function(error, audio) {
      if (error) {
        res.status(500).send(error);
        return;
      }

      const data = req.body;
      if (data.name) audio.name = data.name;
      if (data.audioFile) audio.audioFile = data.audioFile;
      if (data.published != null) audio.published = data.published;
      if (data.meta)
        audio.meta = {
          recordedOn: new Date(data.meta.recordedOn),
          recordedAt: data.meta.recordedAt
        };

      let tagErrors = [],
        tagsInserted = [];
      req.body.tags.forEach(function(item) {
        let slug = Tag.santizeTag(item.slug);
        let found = false;
        let tag = new Tag({ tag: item, slug: slug });
        Tag.findOne({ slug: slug }, (error, tags) => {
          if (error) {
            return callback();
          }
          found = true;
          if (tags.audio.indexOf(audio) === -1) {
            tags.audio = [audio, ...tags.audio];
            tags.save(error => {
              if (error)
                console.log("Error occurred while saving tag " + tags.tag);
            });
          }
        });
        if (!found) {
          tag.save(error => {
            if (error) {
              tagErrors.push(
                "Issue while adding tag '" + encodeURIComponent(tag.tag) + "'"
              );
            } else {
              tagsInserted.push(tag);
            }
          });
        }
      });
      audio.tags = tagsInserted;

      // save the audio
      audio.save(function(error) {
        if (error) {
          res.status(500).send(error);
          return;
        }

        res.status(200).json({
          message:
            "Audio updated successfully" + (tagErrors.length > 0)
              ? "<br />" + tagErrors.join("<br />")
              : ""
        });
      });
    });
  })

  /* delete an audio */
  .delete(function(req, res) {
    Audio.remove(
      {
        _id: req.params.id
      },
      function(error, audio) {
        if (error) {
          res.status(500).send(error);
          return;
        }
        // Remove all the related tags
        let cursor = Tag.aggregate([
            { $unwind: "$audio" },
            { $match: { "audio._id": audio._id } },
            { $group: { _id: "$_id", number: { $sum: 1 } } }
          ]),
          ids = cursor.map(function(doc) {
            if (doc.number < 2) return doc._id;
          });
        Tag.remove({ _id: { $in: ids } });

        res.status(200).json({
          message: "Audio successfully deleted"
        });
      }
    );
  });

module.exports = router;
