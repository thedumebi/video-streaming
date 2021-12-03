const fs = require("fs");
const path = require("path");

const streamVideo = (req, res) => {
  // range is the part where you are in the video buffer currently
  const range = req.headers.range;
  // video id
  const videoId = req.params.id;
  if (!range) {
    res.status(400).send("Range not provided!");
  }
  // locate the video file (refer to Grid Fs for database storage)
  const videoPath = path.join(
    __dirname,
    "..",
    "..",
    `uploads/video/${videoId}`
  );
  const videoSize = fs.statSync(videoPath).size;
  // decide the chunk size to send with every concurrent request
  const chunkSize = Math.pow(10, 6); // 1mb
  // starting point of video we're sending
  const start = Number(range.replace(/\D/g, ""));
  /* determine the min value btw the min value btw start+chunk and video size length
   * because it's possible that start+chunk may be greater than the video length
   */
  const end = Math.min(start + chunkSize, videoSize - 1);
  // determine the content length
  const contentLength = end - start + 1;
  // generate headers
  const headers = {
    "Content-Range": `bytes ${start} -${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };
  // send a partial content response
  res.writeHead(206, headers);
  const videoStream = fs.createReadStream(videoPath, { start, end });
  // pipe the response
  videoStream.pipe(res);
};

module.exports = {
  streamVideo,
};
