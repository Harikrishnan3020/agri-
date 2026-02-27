import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, ExternalLink, Film, Search, Youtube } from "lucide-react";
import { searchYouTubeVideo } from "@/services/youtube";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
    initialVideoUrl?: string;
    cropName?: string;
    diseaseName: string;
    className?: string;
}

// Extract video ID from any YouTube URL format
const extractVideoId = (url: string): string | null => {
    if (!url) return null;
    // Already an embed URL: https://www.youtube.com/embed/VIDEO_ID
    const embedMatch = url.match(/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch) return embedMatch[1];
    // Watch URL: https://www.youtube.com/watch?v=VIDEO_ID
    const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (watchMatch) return watchMatch[1];
    // Short URL: https://youtu.be/VIDEO_ID
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) return shortMatch[1];
    return null;
};

const buildEmbedUrl = (videoId: string) =>
    `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&autoplay=1`;

const buildThumbnailUrl = (videoId: string) =>
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

const buildWatchUrl = (videoId: string) =>
    `https://www.youtube.com/watch?v=${videoId}`;

export const VideoPlayer = ({
    initialVideoUrl,
    cropName,
    diseaseName,
    className,
}: VideoPlayerProps) => {
    const [videoId, setVideoId] = useState<string | null>(
        initialVideoUrl ? extractVideoId(initialVideoUrl) : null
    );
    const [isLoading, setIsLoading] = useState(!initialVideoUrl);
    const [isPlaying, setIsPlaying] = useState(false); // user clicked play
    const [thumbnailFailed, setThumbnailFailed] = useState(false);
    const [showEmbed, setShowEmbed] = useState(false); // NEW: toggle between thumbnail and iframe

    const searchQuery = `${cropName || ""} ${diseaseName} treatment guide`.trim();

    // When the prop changes (new scan result), reset and update
    useEffect(() => {
        const newId = initialVideoUrl ? extractVideoId(initialVideoUrl) : null;
        if (newId && newId !== videoId) {
            console.log(`[VideoPlayer] Setting video ID: ${newId} from URL: ${initialVideoUrl}`);
            setVideoId(newId);
            setIsPlaying(false);
            setIsLoading(false);
            setThumbnailFailed(false);
            setShowEmbed(false);
        }
    }, [initialVideoUrl]);

    // If no initial URL, search via YouTube API service
    useEffect(() => {
        if (!initialVideoUrl && !videoId) {
            console.log(`[VideoPlayer] No initial URL, searching for: "${searchQuery}"`);
            setIsLoading(true);
            searchYouTubeVideo(searchQuery).then((url) => {
                const id = extractVideoId(url);
                console.log(`[VideoPlayer] Search result - URL: ${url}, ID: ${id}`);
                setVideoId(id);
                setIsLoading(false);
            }).catch((err) => {
                console.error('[VideoPlayer] Search failed:', err);
                setIsLoading(false);
            });
        }
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black/40 backdrop-blur-md",
                className
            )}
        >
            {/* Header */}
            <div className="bg-white/5 px-4 py-3 border-b border-white/10 flex justify-between items-center">
                <h4 className="text-[10px] font-black text-white/90 flex items-center gap-2 uppercase tracking-tighter">
                    <Film className="w-3.5 h-3.5 text-emerald-400" />
                    <span>How to Cure: {diseaseName}</span>
                </h4>
                {videoId && (
                    <a
                        href={buildWatchUrl(videoId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-emerald-400 font-bold uppercase hover:text-emerald-300 transition-colors bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20"
                    >
                        Watch <ExternalLink className="w-2.5 h-2.5 ml-1 inline" />
                    </a>
                )}
            </div>

            {/* Video Container */}
            <div className="relative aspect-video bg-black w-full overflow-hidden">

                {/* ── Loading State ── */}
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20">
                        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
                        <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest">
                            Finding Best Video...
                        </p>
                    </div>
                )}

                {/* ── Thumbnail with Watch Button (Better UX - always works) ── */}  
                {!isLoading && videoId && (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center group">
                        {/* Thumbnail background */}
                        {!thumbnailFailed ? (
                            <img
                                src={buildThumbnailUrl(videoId)}
                                alt="Video thumbnail"
                                className="absolute inset-0 w-full h-full object-cover"
                                onError={() => setThumbnailFailed(true)}
                            />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/60 via-emerald-950/80 to-black" />
                        )}
                        
                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-black/40" />
                        
                        {/* Content */}
                        <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center">
                            {/* YouTube Icon */}
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="mb-4"
                            >
                                <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center shadow-2xl">
                                    <Youtube className="w-11 h-11 text-white" fill="currentColor" />
                                </div>
                            </motion.div>
                            
                            {/* Title */}
                            <h3 className="text-white font-bold text-lg mb-2">
                                How to Cure {diseaseName}
                            </h3>
                            <p className="text-white/70 text-sm mb-6 max-w-xs">
                                Learn treatment methods and disease control techniques
                            </p>
                            
                            {/* Watch Button */}
                            <motion.a
                                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${cropName || ''} ${diseaseName} how to cure treatment control`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full shadow-lg transition-all"
                            >
                                <Play className="w-5 h-5" fill="currentColor" />
                                Search YouTube for Cure
                                <ExternalLink className="w-4 h-4" />
                            </motion.a>
                            
                            {/* Alternative search link */}
                            <a
                                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 text-xs text-white/50 hover:text-white/80 transition-colors flex items-center gap-1"
                            >
                                <Search className="w-3 h-3" />
                                Search for more videos
                            </a>
                        </div>
                    </div>
                )}

                {/* ── No Video State ── */}
                {!isLoading && !videoId && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-emerald-900/40 via-zinc-950/80 to-black">
                        <div className="w-16 h-16 rounded-full bg-red-600/20 flex items-center justify-center mb-4 border-2 border-red-600/30">
                            <Youtube className="w-8 h-8 text-red-500" />
                        </div>
                        <h5 className="text-white font-bold text-sm mb-2">Treatment Video Guide</h5>
                        <p className="text-xs text-white/60 mb-6 max-w-[220px] mx-auto leading-relaxed">
                            Watch detailed treatment instructions on YouTube
                        </p>
                        <a
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-bold uppercase transition-all shadow-lg"
                        >
                            <Search className="w-4 h-4" />
                            Search YouTube
                        </a>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="bg-black/80 px-4 py-2.5 flex justify-between items-center border-t border-white/5">
                <div className="flex items-center gap-2">
                    <Youtube className="w-3.5 h-3.5 text-red-500" />
                    <p className="text-[9px] text-white/40 uppercase font-bold tracking-wider">
                        Video Guide Available
                    </p>
                </div>
                {videoId && (
                    <a
                        href={buildWatchUrl(videoId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[9px] font-black text-red-500 uppercase tracking-tighter hover:text-red-400 transition-colors flex items-center gap-1"
                    >
                        Open on YouTube <ExternalLink className="w-3 h-3" />
                    </a>
                )}
            </div>
        </motion.div>
    );
};
