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

console.log("════════════════════════════════════════════════════════");
console.log("🔍 YouTube Video Playback Diagnostic Tool");
console.log("════════════════════════════════════════════════════════\n");

async function diagnoseVideoPlayback() {
    const testQuery = "tomato late blight treatment";
    
    console.log("Step 1: Searching for videos...\n");
    
    const searchQuery = encodeURIComponent(testQuery);
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&key=${API_KEY}&type=video&maxResults=5&videoEmbeddable=true&relevanceLanguage=en`;

    return new Promise((resolve) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', async () => {
                try {
                    const jsonData = JSON.parse(data);
                    
                    if (jsonData.error) {
                        console.error("❌ API Error:", jsonData.error.message);
                        resolve(false);
                        return;
                    }
                    
                    if (!jsonData.items || jsonData.items.length === 0) {
                        console.log("⚠️  No videos found");
                        resolve(false);
                        return;
                    }
                    
                    console.log(`✅ Found ${jsonData.items.length} embeddable videos\n`);
                    console.log("Step 2: Checking video details...\n");
                    
                    // Get first video
                    const firstVideo = jsonData.items[0];
                    const videoId = firstVideo.id.videoId;
                    const videoTitle = firstVideo.snippet.title;
                    
                    console.log("Selected Video:");
                    console.log("  Title:", videoTitle);
                    console.log("  Video ID:", videoId);
                    console.log("  Channel:", firstVideo.snippet.channelTitle);
                    console.log("\nStep 3: Verifying embed status...\n");
                    
                    // Check video details for additional embed info
                    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=status,contentDetails,player&id=${videoId}&key=${API_KEY}`;
                    
                    https.get(detailsUrl, (detailsRes) => {
                        let detailsData = '';
                        detailsRes.on('data', (chunk) => { detailsData += chunk; });
                        detailsRes.on('end', () => {
                            try {
                                const details = JSON.parse(detailsData);
                                
                                if (details.items && details.items.length > 0) {
                                    const video = details.items[0];
                                    const status = video.status;
                                    
                                    console.log("Video Status:");
                                    console.log("  Embeddable:", status.embeddable ? "✅ Yes" : "❌ No");
                                    console.log("  Public Watch Allowed:", status.publicStatsViewable ? "✅ Yes" : "⚠️  Limited");
                                    console.log("  Privacy Status:", status.privacyStatus);
                                    
                                    console.log("\n📺 Embed URLs:");
                                    console.log("  Standard:", `https://www.youtube.com/embed/${videoId}`);
                                    console.log("  With params:", `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`);
                                    console.log("  Watch URL:", `https://www.youtube.com/watch?v=${videoId}`);
                                    
                                    if (status.embeddable) {
                                        console.log("\n✅ This video CAN be embedded!");
                                        console.log("\n📋 Recommended iframe code:");
                                        console.log(`\n<iframe
  width="100%"
  height="100%"
  src="https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0"
  title="${videoTitle.replace(/"/g, '&quot;')}"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowfullscreen
  referrerpolicy="no-referrer-when-downgrade"
></iframe>\n`);
                                        
                                        console.log("\n🔧 Troubleshooting Tips:");
                                        console.log("1. Make sure the iframe is inside a container with proper dimensions");
                                        console.log("2. Check browser console for any CSP (Content Security Policy) errors");
                                        console.log("3. Ensure your app allows YouTube domain in CSP headers");
                                        console.log("4. Test the URL directly: https://www.youtube.com/embed/" + videoId);
                                        console.log("5. Check if browser extensions are blocking the iframe");
                                        console.log("6. Try opening in incognito mode to rule out extension issues");
                                        
                                    } else {
                                        console.log("\n❌ This video CANNOT be embedded (despite embeddable filter)");
                                        console.log("   This can happen if the video owner changed embed settings.");
                                    }
                                    
                                    resolve(true);
                                } else {
                                    console.log("❌ Could not fetch video details");
                                    resolve(false);
                                }
                            } catch (e) {
                                console.error("❌ Error parsing video details:", e.message);
                                resolve(false);
                            }
                        });
                    }).on('error', (err) => {
                        console.error("❌ Network error:", err.message);
                        resolve(false);
                    });
                    
                } catch (e) {
                    console.error("❌ Error:", e.message);
                    resolve(false);
                }
            });
        }).on('error', (err) => {
            console.error("❌ Network error:", err.message);
            resolve(false);
        });
    });
}

diagnoseVideoPlayback().then(() => {
    console.log("\n════════════════════════════════════════════════════════");
    console.log("Diagnostic complete!");
    console.log("════════════════════════════════════════════════════════\n");
});
