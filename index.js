import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors'; // Tambahkan ini

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Aktifkan CORS agar bisa diakses dari Blogger
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/generate', async (req, res) => {
  const { url } = req.body;
  const apiKey = process.env.SHORT_API_KEY;
  const domain = process.env.SHORT_DOMAIN;

  if (!url) return res.status(400).json({ error: 'Missing URL' });

  try {
    const response = await axios.post(
      'https://api.short.io/links',
      {
        originalURL: url,
        domain
      },
      {
        headers: {
          'Authorization': apiKey,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json({ shortLink: response.data.shortURL });
  } catch (error) {
    res.status(500).json({ error: error.response?.data || 'Unknown error' });
  }
});

app.get('/', (req, res) => {
  res.send('Short.io Link Generator is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
