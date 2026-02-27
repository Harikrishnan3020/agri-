/**
 * Find and verify embeddable YouTube videos for crop diseases
 */

import fs from 'fs';
import https from 'https';

const envFile = fs.readFileSync('.env', 'utf8');
const envConfig = envFile.split('\n').reduce((acc, line) => {
    const [key, value] = line.split('=');
    if (key && value) {
        acc[key.trim()] = value.trim();
    }
    return acc;
}, {});

const YOUTUBE_API_KEY = envConfig.VITE_YOUTUBE_API_KEY;

// Diseases to search for
const searchQueries = [
    "early blight prevention agricultural education",
    "powdery mildew control farming tutorial",
    "organic sustainable farming practices",
    "bacterial blight treatment agriculture",
    "leaf curl disease control",
    "wheat rust disease management",
    "tomato disease treatment guide",
    "potato disease prevention"
];

async function searchAndVerify(query) {
    return new Promise((resolve) => {
        const searchQuery = encodeURIComponent(query);
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&key=${YOUTUBE_API_KEY}&type=video&maxResults=10&videoEmbeddable=true&videoSyndicated=true&relevanceLanguage=en`;
        
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', async () => {
                try {
                    const json = JSON.parse(data);
                    if (json.items && json.items.length > 0) {
                        // Check each video
                        for (const item of json.items.slice(0, 3)) {
                            const videoId = item.id.videoId;
                            const verified = await verifyVideo(videoId);
                            if (verified.embeddable) {
                                resolve({
                                    query,
                                    videoId,
                                    title: item.snippet.title,
                                    channel: item.snippet.channelTitle,
                                    ...verified
                                });
                                return;
                            }
                        }
                    }
                    resolve(null);
                } catch (err) {
                    resolve(null);
                }
            });
        }).on('error', () => resolve(null));
    });
}

async function verifyVideo(videoId) {
    return new Promise((resolve) => {
        const url = `https://www.googleapis.com/youtube/v3/videos?part=status,snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`;
        
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.items && json.items.length > 0) {
                        const video = json.items[0];
                        resolve({
                            embeddable: video.status.embeddable,
                            privacyStatus: video.status.privacyStatus,
                            title: video.snippet.title
                        });
                    } else {
                        resolve({ embeddable: false });
                    }
                } catch {
                    resolve({ embeddable: false });
                }
            });
        }).on('error', () => resolve({ embeddable: false }));
    });
}

console.log("🔍 Searching for embeddable videos...\n");

async function findVideos() {
    const results = [];
    
    for (const query of searchQueries) {
        console.log(`Searching: "${query}"`);
        const result = await searchAndVerify(query);
        if (result) {
            console.log(`  ✅ Found: ${result.videoId} - ${result.title.substring(0, 50)}...\n`);
            results.push(result);
        } else {
            console.log(`  ❌ No embeddable video found\n`);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log("\n═══════════════════════════════════════════════════════");
    console.log("📋 EMBEDDABLE VIDEOS FOUND:");
    console.log("═══════════════════════════════════════════════════════\n");
    
    results.forEach(r => {
        console.log(`"${r.query}": {`);
        console.log(`  id: "${r.videoId}",`);
        console.log(`  title: "${r.title}"`);
        console.log(`},\n`);
    });
}

findVideos();
