import fs from 'fs';
import https from 'https';

// Simple .env parser
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
    console.error("❌ Error: VITE_YOUTUBE_API_KEY not found in .env file");
    process.exit(1);
}

console.log("🔑 YouTube API Key:", API_KEY.substring(0, 20) + "...");
console.log("\n🔍 Testing YouTube API Search...\n");

const testQueries = [
    "tomato late blight treatment",
    "rice blast disease control",
    "wheat rust fungicide application"
];

let currentIndex = 0;

function testQuery(query) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${API_KEY}&type=video&maxResults=3&videoEmbeddable=true&relevanceLanguage=en`;

    console.log(`📝 Query: "${query}"`);
    
    https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            try {
                const jsonData = JSON.parse(data);

                if (jsonData.error) {
                    console.error("❌ YouTube API Error:", jsonData.error.message);
                    console.error("   Code:", jsonData.error.code);
                    console.error("   Details:", jsonData.error.errors?.[0]?.reason || "N/A");
                } else if (jsonData.items && jsonData.items.length > 0) {
                    console.log(`✅ Found ${jsonData.items.length} videos:`);
                    jsonData.items.forEach((item, i) => {
                        console.log(`\n   ${i + 1}. ${item.snippet.title}`);
                        console.log(`      Video ID: ${item.id.videoId}`);
                        console.log(`      URL: https://www.youtube.com/embed/${item.id.videoId}`);
                        console.log(`      Channel: ${item.snippet.channelTitle}`);
                    });
                } else {
                    console.log("⚠️  No videos found for this query.");
                }
                
                console.log("\n" + "─".repeat(80) + "\n");
                
                // Test next query
                currentIndex++;
                if (currentIndex < testQueries.length) {
                    setTimeout(() => testQuery(testQueries[currentIndex]), 1000);
                } else {
                    console.log("✅ All tests completed!");
                }
            } catch (e) {
                console.error("❌ Error parsing response:", e.message);
                console.log("Raw response:", data);
            }
        });
    }).on('error', (err) => {
        console.error("❌ Network Error:", err.message);
    });
}

// Start testing
testQuery(testQueries[currentIndex]);
