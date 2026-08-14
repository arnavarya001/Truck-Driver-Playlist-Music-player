const express = require('express');
const ytdl = require('@distube/ytdl-core');
const cors = require('cors');

const app = express();
app.use(cors());

// YouTube Audio Proxy Stream Endpoint
app.get('/api/stream', async (req, res) => {
  try {
    const videoId = req.query.id;
    if (!videoId) {
      return res.status(400).send('Video ID is required');
    }

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Accept-Ranges', 'bytes');

    // Extracting audio only and piping directly to browser
    ytdl(videoUrl, {
      filter: 'audioonly',
      quality: 'highestaudio',
      highWaterMark: 1 << 25
    }).pipe(res);

  } catch (error) {
    console.error('Streaming error:', error);
    res.status(500).send('Error streaming audio');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Bypass Proxy Server running on http://localhost:${PORT}`);
});
