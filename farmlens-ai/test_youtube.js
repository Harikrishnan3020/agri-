import fs from 'fs';
import https from 'https';

// Simple .env parser since dotenv is not installed
const envFile = fs.readFileSync('.env', 'utf8');
const envConfig = envFile.split('\n').reduce((acc, line) => {
    const [key, value] = line.split('=');
    if (key && value) {
        acc[key.trim()] = value.trim();
    }
    return acc;
}, {});

const API_KEY = envConfig.VITE_YOUTUBE_API_KEY;

if (!API_KEY) {
    console.error("Error: VITE_YOUTUBE_API_KEY not found in .env file");
    process.exit(1);
}

const query = "agricultural disease treatment";
const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${API_KEY}&type=video&maxResults=1&videoEmbeddable=true`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const jsonData = JSON.parse(data);

            if (jsonData.error) {
                console.error("YouTube API Error:", jsonData.error.message);
                console.log("\n--- Fallback Mechanism ---");
                console.log("Since the API failed, using a fallback video as per application logic:");
                console.log("Title: 5 Tips To Treat Tomato Blight (The ADHD Gardener)");
                console.log("URL: https://www.youtube.com/embed/eHEaR9veuEg");
            } else if (jsonData.items && jsonData.items.length > 0) {
                const item = jsonData.items[0];
                console.log("Title:", item.snippet.title);
                console.log("Video ID:", item.id.videoId);
                console.log("URL:", `https://www.youtube.com/embed/${item.id.videoId}`);
            } else {
                console.log("No video found for the query.");
            }
        } catch (e) {
            console.error("Error parsing response:", e.message);
            console.log("Raw response:", data);
        }
    });
}).on('error', (err) => {
    console.error("Network Error: " + err.message);
});
