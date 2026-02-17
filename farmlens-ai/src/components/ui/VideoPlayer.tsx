import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ExternalLink, AlertCircle, Loader2, TrendingUp, Film } from "lucide-react";
import { searchYouTubeVideo } from "@/services/youtube";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
    initialVideoUrl?: string;
    cropName?: string;
    diseaseName: string;
    className?: string;
}

type VideoState = "loading" | "loaded" | "error" | "fallback";

export const VideoPlayer = ({
    initialVideoUrl,
    cropName,
    diseaseName,
    className
}: VideoPlayerProps) => {
    const [videoUrl, setVideoUrl] = useState<string | null>(initialVideoUrl || null);
    const [videoState, setVideoState] = useState<VideoState>("loading");
    const [retryCount, setRetryCount] = useState(0);

    // Function to construct YouTube watch URL from embed URL
    const getWatchUrl = useCallback((embedUrl: string) => {
        return embedUrl.replace("embed/", "watch?v=");
    }, []);

    // Function to validate if video URL is accessible
    const validateVideoUrl = useCallback(async (url: string): Promise<boolean> => {
        return new Promise((resolve) => {
            const timeout = setTimeout(() => {
                resolve(false);
            }, 5000); // 5 second timeout

            const testFrame = document.createElement('iframe');
            testFrame.style.display = 'none';
            testFrame.src = url;

            testFrame.onload = () => {
                clearTimeout(timeout);
                document.body.removeChild(testFrame);
                resolve(true);
            };

            testFrame.onerror = () => {
                clearTimeout(timeout);
                document.body.removeChild(testFrame);
                resolve(false);
            };

            document.body.appendChild(testFrame);

            // Fallback: assume it's valid after a short delay
            setTimeout(() => {
                if (document.body.contains(testFrame)) {
                    clearTimeout(timeout);
                    document.body.removeChild(testFrame);
                    resolve(true);
                }
            }, 2000);
        });
    }, []);

    // Function to search for alternative video
    const searchAlternativeVideo = useCallback(async () => {
        setVideoState("loading");

        // Create search queries with fallback options
        const searchQueries = [
            `${cropName || ''} ${diseaseName} treatment`.trim(),
            `${diseaseName} treatment agriculture`.trim(),
            `how to treat ${diseaseName}`.trim(),
            `${diseaseName} disease management`.trim(),
        ];

        for (const query of searchQueries) {
            try {
                console.log(`Searching YouTube for: ${query}`);
                const result = await searchYouTubeVideo(query);

                if (result) {
                    // Validate the found video
                    const isValid = await validateVideoUrl(result);
                    if (isValid) {
                        setVideoUrl(result);
                        setVideoState("loaded");
                        return;
                    }
                }
            } catch (error) {
                console.warn(`Search failed for query: ${query}`, error);
            }
        }

        // If all searches fail, show fallback
        setVideoState("fallback");
    }, [cropName, diseaseName, validateVideoUrl]);

    // Initial load effect
    useEffect(() => {
        const initializeVideo = async () => {
            // If no initial URL provided, show fallback immediately with search option
            if (!initialVideoUrl) {
                console.log("No initial video URL, showing fallback with search");
                setVideoState("fallback");
                return;
            }

            setVideoState("loading");

            // Try to validate the initial URL
            const isValid = await validateVideoUrl(initialVideoUrl);

            if (isValid) {
                setVideoUrl(initialVideoUrl);
                setVideoState("loaded");
            } else {
                // If initial URL fails, try searching for alternative
                console.warn("Initial video URL failed to load, searching for alternative...");
                await searchAlternativeVideo();
            }
        };

        initializeVideo();
    }, [initialVideoUrl, searchAlternativeVideo, validateVideoUrl]);

    // Retry function
    const handleRetry = useCallback(async () => {
        setRetryCount(prev => prev + 1);
        await searchAlternativeVideo();
    }, [searchAlternativeVideo]);

    // Iframe load handlers
    const handleIframeLoad = useCallback(() => {
        setVideoState("loaded");
    }, []);

    const handleIframeError = useCallback(async () => {
        console.error("Video iframe failed to load");

        if (retryCount < 2) {
            // Automatically retry with alternative search
            await searchAlternativeVideo();
        } else {
            setVideoState("error");
        }
    }, [retryCount, searchAlternativeVideo]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className={cn("rounded-xl overflow-hidden border border-border shadow-sm", className)}
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-muted to-muted/50 px-4 py-3 border-b border-border flex justify-between items-center">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <Film className="w-4 h-4" />
                    Treatment Video Guide
                </h4>

                {videoUrl && videoState === "loaded" && (
                    <a
                        href={getWatchUrl(videoUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1 font-medium"
                    >
                        Open in YouTube <ExternalLink className="w-3 h-3" />
                    </a>
                )}
            </div>

            {/* Video Content */}
            <div className="relative aspect-video bg-gradient-to-br from-black/90 via-black/80 to-black/90">
                <AnimatePresence mode="wait">
                    {videoState === "loading" && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center text-white"
                        >
                            <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
                            <p className="text-sm font-medium">Loading video...</p>
                            <p className="text-xs text-muted-foreground mt-1">Searching for the best content</p>
                        </motion.div>
                    )}

                    {videoState === "loaded" && videoUrl && (
                        <motion.iframe
                            key="video"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            width="100%"
                            height="100%"
                            src={videoUrl}
                            title="Treatment Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            onLoad={handleIframeLoad}
                            onError={handleIframeError}
                            className="absolute inset-0 w-full h-full"
                        />
                    )}

                    {videoState === "error" && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                                <AlertCircle className="w-8 h-8 text-red-500" />
                            </div>
                            <h5 className="text-white font-semibold mb-2">Video Temporarily Unavailable</h5>
                            <p className="text-sm text-gray-400 mb-4 max-w-sm">
                                We couldn't load the treatment video at this time. Please try again or search YouTube manually.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleRetry}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium flex items-center gap-2"
                                >
                                    <TrendingUp className="w-4 h-4" />
                                    Try Again
                                </button>
                                <a
                                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${cropName || ''} ${diseaseName} treatment`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm font-medium flex items-center gap-2"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Search YouTube
                                </a>
                            </div>
                        </motion.div>
                    )}

                    {videoState === "fallback" && (
                        <motion.div
                            key="fallback"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5"
                        >
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 backdrop-blur-sm border border-primary/20">
                                <Play className="w-10 h-10 text-primary" />
                            </div>
                            <h5 className="text-foreground font-bold text-lg mb-2">
                                {diseaseName} Treatment
                            </h5>
                            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                                No specific video available right now. Search YouTube for detailed treatment guides and expert advice.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                                <a
                                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${cropName || ''} ${diseaseName} treatment`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Search on YouTube
                                </a>
                                <button
                                    onClick={handleRetry}
                                    className="flex-1 px-4 py-3 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                                >
                                    <TrendingUp className="w-4 h-4" />
                                    Retry
                                </button>
                            </div>

                            {/* Helpful tips */}
                            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border max-w-sm">
                                <p className="text-xs font-semibold text-foreground mb-2">💡 Search Tips:</p>
                                <ul className="text-xs text-muted-foreground space-y-1 text-left">
                                    <li>• Try "{diseaseName} organic treatment"</li>
                                    <li>• Look for "{diseaseName} prevention"</li>
                                    <li>• Search "{cropName || 'crop'} disease management"</li>
                                </ul>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};
