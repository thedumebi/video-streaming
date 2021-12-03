const router = require("express").Router();
const { streamVideo } = require("../controllers/video");

router.get("/:id", streamVideo);

module.exports = router;
