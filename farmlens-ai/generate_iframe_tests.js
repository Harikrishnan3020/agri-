/**
 * Test actual iframe embedding (not just API status)
 * This will generate HTML files to test if videos really work
 */

import fs from 'fs';

// Test known working educational videos
const testVideos = [
    // Try videos from educational/government channels known to allow embedding
    { id: "ZSPkcpGmflE", name: "Penn State Extension - Late Blight" },
    { id: "mn-c23CJNe8", name: "Tomato Disease Guide" },
    { id: "3g-lrRYGduI", name: "Plant Disease Management" },
    { id: "BvBvSW1vj8s", name: "Organic Farming" },
    { id: "EYTlql02gOw", name: "Crop Protection Guide" },
    // Fallback reliable educational content
    { id: "dQw4w9WgXcQ", name: "Test Video 1" }, // Known embeddable
    { id: "jNQXAC9IVRw", name: "Test Video 2" }, // "Me at the zoo" - first YouTube video
];

console.log("🧪 Generating iframe test files...\n");

testVideos.forEach((video, index) => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test: ${video.name}</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            background: #0a0f0a;
            color: white;
            font-family: system-ui;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        h1 {
            color: #10b981;
        }
        .video-wrapper {
            position: relative;
            width: 100%;
            padding-bottom: 56.25%; /* 16:9 */
            margin: 20px 0;
            background: #000;
            border-radius: 12px;
            overflow: hidden;
        }
        iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 0;
        }
        .info {
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.3);
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
        }
        .status {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 5px;
            font-weight: bold;
            margin-top: 10px;
        }
        .success { background: #10b981; color: white; }
        .error { background: #ef4444; color: white; }
        a {
            color: #10b981;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎥 Video Embed Test: ${video.name}</h1>
        
        <div class="info">
            <strong>Video ID:</strong> ${video.id}<br>
            <strong>Embed URL:</strong> <code>https://www.youtube.com/embed/${video.id}</code><br>
            <strong>Watch URL:</strong> <a href="https://www.youtube.com/watch?v=${video.id}" target="_blank">Open on YouTube</a>
            <div id="status" class="status">Testing...</div>
        </div>

        <div class="video-wrapper">
            <iframe
                id="videoFrame"
                src="https://www.youtube.com/embed/${video.id}?autoplay=0&rel=0&modestbranding=1"
                title="${video.name}"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
                referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
        </div>

        <div class="info">
            <h3>✅ If you can see and play the video above:</h3>
            <p>This video ID (${video.id}) works and can be used in the app!</p>
            
            <h3>❌ If you see "Video unavailable":</h3>
            <p>This video cannot be embedded. Try another one.</p>
        </div>

        <p><a href="test_${index === 0 ? testVideos.length - 1 : index - 1}.html">← Previous</a> | 
           <a href="test_${index === testVideos.length - 1 ? 0 : index + 1}.html">Next →</a></p>
    </div>

    <script>
        // Simple test to detect if iframe loaded
        const iframe = document.getElementById('videoFrame');
        const status = document.getElementById('status');
        
        iframe.onload = function() {
            status.textContent = '✅ Iframe Loaded';
            status.className = 'status success';
        };
        
        iframe.onerror = function() {
            status.textContent = '❌ Failed to Load';
            status.className = 'status error';
        };
        
        setTimeout(() => {
            if (status.textContent === 'Testing...') {
                status.textContent = '⚠️ May have issues';
                status.className = 'status error';
            }
        }, 5000);
    </script>
</body>
</html>`;

    fs.writeFileSync(`test_${index}.html`, html);
    console.log(`✅ Created test_${index}.html - ${video.name} (${video.id})`);
});

// Create index file
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Video Embed Tests</title>
    <style>
        body {
            margin: 0;
            padding: 40px;
            background: #0a0f0a;
            color: white;
            font-family: system-ui;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        h1 { color: #10b981; }
        .test-list {
            list-style: none;
            padding: 0;
        }
        .test-list li {
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.3);
            margin: 10px 0;
            padding: 15px;
            border-radius: 8px;
        }
        .test-list a {
            color: #10b981;
            text-decoration: none;
            font-weight: bold;
            font-size: 18px;
        }
        .test-list a:hover {
            text-decoration: underline;
        }
        .video-id {
            color: #888;
            font-family: monospace;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎥 YouTube Video Embed Tests</h1>
        <p>Click each link to test if the video actually works in an iframe:</p>
        
        <ul class="test-list">
            ${testVideos.map((video, i) => `
            <li>
                <a href="test_${i}.html">Test ${i + 1}: ${video.name}</a><br>
                <span class="video-id">ID: ${video.id}</span>
            </li>
            `).join('')}
        </ul>
        
        <div style="margin-top: 40px; padding: 20px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px;">
            <h3>📝 Instructions:</h3>
            <ol>
                <li>Open each test file in your browser</li>
                <li>Check if the video plays (not "Video unavailable")</li>
                <li>Note which video IDs work</li>
                <li>We'll update the app with working videos only</li>
            </ol>
        </div>
    </div>
</body>
</html>`;

fs.writeFileSync('test_index.html', indexHtml);
console.log(`\n✅ Created test_index.html (main index)\n`);

console.log("═══════════════════════════════════════════════════════");
console.log("📋 Next Steps:");
console.log("═══════════════════════════════════════════════════════");
console.log("1. Open test_index.html in your browser");
console.log("2. Click through each test");
console.log("3. Note which videos ACTUALLY play");
console.log("4. Report back the working video IDs");
console.log("\nWe'll then update the app with ONLY working videos.\n");
