# YouTube Treatment Video Setup Guide

## 🎯 Overview

After diagnosing a crop disease, AgriYield shows **disease-specific treatment videos** from YouTube based on the exact disease detected. 

## 🔧 How It Works

When a disease is diagnosed (e.g., "Late Blight", "Powdery Mildew"), the app automatically:

1. **Searches YouTube** for videos specifically about curing/treating that disease
2. **Filters** for educational content with keywords like:
   - "how to treat [disease]"
   - "cure [disease]"
   - "control [disease]"
   - "prevention [disease]"
   - Prioritizes agricultural extension channels and universities
3. **Scores videos** based on relevance and educational value
4. **Shows "Watch on YouTube"** button to avoid embedding restrictions

## 📺 Video Search Strategy

### Priority 1: YouTube API Search (Most Accurate)
- Searches for: `"[crop] [disease] how to treat cure control prevention"`
- Filters for medium-length educational videos
- Scores based on title relevance and channel authority
- **Requires YouTube Data API v3 key**

### Priority 2: Groq AI Selection (Fast Fallback)
- Uses AI to pick from curated video library
- Works offline with pre-verified videos
- **Requires Groq API key** (for AI diagnosis anyway)

### Priority 3: Keyword Matching (Instant Fallback)
- Matches disease names to curated library
- No API required
- Limited to ~50 pre-verified videos

## ⚙️ Setup YouTube API (Recommended)

To get **real disease-specific treatment videos** for ANY disease:

### Step 1: Get YouTube Data API v3 Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable **YouTube Data API v3**:
   - Go to "APIs & Services" → "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy your API key

### Step 2: Add to Environment Variables

1. Create `.env` file in `farmlens-ai/` folder:
   ```bash
   cd farmlens-ai
   cp .env.example .env
   ```

2. Edit `.env` file and add your key:
   ```
   VITE_YOUTUBE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   VITE_GROQ_API_KEY=your_existing_groq_key_here
   ```

3. Restart the dev server:
   ```bash
   npm run dev
   ```

## ✅ Testing

1. Diagnose a crop disease (e.g., upload tomato leaf with late blight)
2. Scroll to "How to Cure: [Disease]" section
3. Check browser console for logs:
   ```
   [YouTube] Finding video for: "tomato late blight treatment guide"
   [YouTube API] Searching for: "tomato late blight how to treat cure control prevention"
   [YouTube API] Testing video (score: 18): "How to Treat Late Blight in Tomatoes"
   [YouTube] ✅ Using YouTube API result - disease-specific treatment video
   ```
4. Click "Watch on YouTube" to view the treatment video

## 📊 Video Quality Scoring

Videos are scored based on:

- **+10 points**: Educational channel (extension, university, agriculture)
- **+5 points**: Contains "treatment", "cure", or "control"
- **+3 points**: Contains "how to"

Top 5 scored videos are tested, best one is selected.

## 🎬 Example Searches

| Disease Diagnosed | Video Search Query |
|------------------|-------------------|
| Late Blight | `tomato late blight how to treat cure control prevention organic fungicide` |
| Powdery Mildew | `powdery mildew how to treat cure control prevention organic fungicide` |
| Bacterial Wilt | `bacterial wilt how to treat cure control prevention organic fungicide` |
| Leaf Curl | `leaf curl how to treat cure control prevention organic fungicide` |

## 🔄 Fallback Behavior

If YouTube API is not configured or fails:

1. **Groq AI** picks best video from curated library
2. **Keyword matching** finds pre-verified educational videos
3. **Manual search** button lets users search YouTube directly

## 📝 Notes

- **No API Key?** App still works with curated video library (50+ diseases covered)
- **Embedding blocked?** All videos use "Watch on YouTube" buttons (no iframe issues)
- **Privacy:** API calls go directly to YouTube (no data stored)
- **Quota:** YouTube API allows 10,000 free requests/day (sufficient for most farms)

## 🚀 Benefits

With YouTube API enabled:

✅ **Real disease-specific videos** for ANY crop disease  
✅ **Latest treatment methods** from agricultural experts  
✅ **Educational sources** (universities, extension services)  
✅ **Multiple languages** based on video availability  
✅ **Organic treatments** prioritized in search  

Without API key:

⚠️ Limited to curated library (still covers common diseases)  
⚠️ May show generic videos for rare diseases  
⚠️ No automatic discovery of new treatment methods  

## 🆘 Troubleshooting

**Problem**: Still seeing generic videos  
**Solution**: Check browser console for `[YouTube API]` logs - if missing, API key not loaded

**Problem**: "No API key found" in console  
**Solution**: Ensure `.env` file exists in `farmlens-ai/` (not root `AgriYield/`)

**Problem**: API errors in console  
**Solution**: Verify YouTube Data API v3 is enabled in Google Cloud Console

**Problem**: Quota exceeded  
**Solution**: YouTube API allows 10,000 requests/day - if exceeded, app falls back to curated library

---

**Made with ❤️ for Indian Farmers**  
*Powered by YouTube Data API v3, Groq AI, and Gemini AI*
