
const API_KEY = "AIzaSyC6VPmKcds5GYY_d68T3QuO88RTSo9uQLs";
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function testKey() {
    console.log("Testing YouTube API Key (Secondary)...");
    try {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=tomato+blight&key=${API_KEY}&type=video&maxResults=1`;
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            console.log("SUCCESS! API Key is working.");
            console.log("Found video:", data.items?.[0]?.snippet?.title);
        } else {
            console.error("FAILURE! API Error:", data.error?.message);
            console.error("Reason:", data.error?.errors?.[0]?.reason);
        }
    } catch (e) {
        console.error("Network Error:", e.message);
    }
}

testKey();
