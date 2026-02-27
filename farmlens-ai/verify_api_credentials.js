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

console.log("═══════════════════════════════════════════════════════════");
console.log("🔐 YouTube API Key Credential Verification");
console.log("═══════════════════════════════════════════════════════════\n");

if (!API_KEY) {
    console.error("❌ Error: VITE_YOUTUBE_API_KEY not found in .env file");
    process.exit(1);
}

console.log("✅ API Key Found:", API_KEY.substring(0, 20) + "..." + API_KEY.slice(-5));
console.log("✅ API Key Length:", API_KEY.length, "characters");
console.log("\n─────────────────────────────────────────────────────────\n");

// Test 1: Check if key is valid with a simple search
function testSearchAPI() {
    console.log("🔍 Test 1: Testing Search API Permission...\n");
    
    const query = "agriculture farming";
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${API_KEY}&type=video&maxResults=1`;

    return new Promise((resolve) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    
                    if (jsonData.error) {
                        console.error("❌ Search API Error:");
                        console.error("   Message:", jsonData.error.message);
                        console.error("   Code:", jsonData.error.code);
                        console.error("   Status:", jsonData.error.status);
                        if (jsonData.error.errors) {
                            jsonData.error.errors.forEach(err => {
                                console.error("   Reason:", err.reason);
                                console.error("   Domain:", err.domain);
                            });
                        }
                        resolve({ success: false, error: jsonData.error });
                    } else if (jsonData.items) {
                        console.log("✅ Search API is working!");
                        console.log("   Found:", jsonData.items.length, "video(s)");
                        console.log("   API has proper search permissions");
                        resolve({ success: true });
                    }
                } catch (e) {
                    console.error("❌ Parse Error:", e.message);
                    resolve({ success: false, error: e.message });
                }
            });
        }).on('error', (err) => {
            console.error("❌ Network Error:", err.message);
            resolve({ success: false, error: err.message });
        });
    });
}

// Test 2: Check video details API
function testVideoDetailsAPI() {
    console.log("\n─────────────────────────────────────────────────────────\n");
    console.log("🎥 Test 2: Testing Video Details API Permission...\n");
    
    const videoId = "FHY6SGRDE4Q"; // A known video ID
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${API_KEY}`;

    return new Promise((resolve) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    
                    if (jsonData.error) {
                        console.error("❌ Video Details API Error:");
                        console.error("   Message:", jsonData.error.message);
                        resolve({ success: false, error: jsonData.error });
                    } else if (jsonData.items && jsonData.items.length > 0) {
                        console.log("✅ Video Details API is working!");
                        console.log("   Video Title:", jsonData.items[0].snippet.title);
                        console.log("   Can retrieve video information");
                        resolve({ success: true });
                    }
                } catch (e) {
                    console.error("❌ Parse Error:", e.message);
                    resolve({ success: false, error: e.message });
                }
            });
        }).on('error', (err) => {
            console.error("❌ Network Error:", err.message);
            resolve({ success: false, error: err.message });
        });
    });
}

// Test 3: Check quota and usage info
function testQuotaInfo() {
    console.log("\n─────────────────────────────────────────────────────────\n");
    console.log("📊 Test 3: Quota Information...\n");
    
    console.log("ℹ️  YouTube Data API v3 Daily Quota: 10,000 units");
    console.log("ℹ️  Search API call cost: 100 quota units");
    console.log("ℹ️  Video details call cost: 1 quota unit");
    console.log("ℹ️  Estimated searches per day: ~100 searches");
    
    return Promise.resolve({ success: true });
}

// Run all tests
async function runAllTests() {
    const test1 = await testSearchAPI();
    const test2 = await testVideoDetailsAPI();
    const test3 = await testQuotaInfo();
    
    console.log("\n═══════════════════════════════════════════════════════════");
    console.log("📋 FINAL VERIFICATION RESULTS");
    console.log("═══════════════════════════════════════════════════════════\n");
    
    if (test1.success && test2.success) {
        console.log("✅ API KEY IS VALID AND HAS PROPER CREDENTIALS");
        console.log("✅ YouTube Data API v3 is fully accessible");
        console.log("✅ Search permission: Granted");
        console.log("✅ Video details permission: Granted");
        console.log("\n✨ Your API key is ready to use in the application!");
    } else {
        console.log("❌ API KEY HAS ISSUES");
        if (!test1.success) {
            console.log("❌ Search API: Failed");
        }
        if (!test2.success) {
            console.log("❌ Video Details API: Failed");
        }
        console.log("\n⚠️  Please check your API key configuration in Google Cloud Console");
        console.log("   1. Ensure YouTube Data API v3 is enabled");
        console.log("   2. Check API key restrictions");
        console.log("   3. Verify billing is enabled (if required)");
    }
    
    console.log("\n═══════════════════════════════════════════════════════════\n");
}

runAllTests();
