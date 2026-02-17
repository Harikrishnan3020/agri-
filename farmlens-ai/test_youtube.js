
import https from 'https';

const API_KEY = "AIzaSyCK690NbB79W7bKwaLo-HCec_F0HjIv6dw";
const query = "agricultural disease treatment";
const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${API_KEY}&type=video&maxResults=1&videoEmbeddable=true`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log(data);
    });
}).on('error', (err) => {
    console.error("Error: " + err.message);
});
