import { useState } from "react";
import { Play, ExternalLink } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { translations, LanguageCode } from "@/data/translations";

export default function VideoTest() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [testVideoId, setTestVideoId] = useState("FHY6SGRDE4Q");

  const { selectedLanguage } = useAppStore();
  const lang = (selectedLanguage as LanguageCode) || "en";
  const t = translations[lang] ?? translations.en;
  const get = <K extends keyof typeof translations.en>(key: K) => {
    const val = (t as Record<string, string | undefined>)[key];
    return (val ?? translations.en[key]) as typeof translations.en[K];
  };

  const tips = [
    get("videoTestTipConsole"),
    get("videoTestTipPlay"),
    get("videoTestTipDifferent"),
    get("videoTestTipExtensions"),
    get("videoTestTipNetwork"),
  ];

  const testVideos = [
    { id: "FHY6SGRDE4Q", title: get("videoTestVideoTitle1") },
    { id: "gKFHqGM-vFw", title: get("videoTestVideoTitle2") },
    { id: "-pTRd_hbvdI", title: get("videoTestVideoTitle3") },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-green-900 to-teal-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-2">
            🎥 {get("videoTestTitle")}
          </h1>
          <p className="text-white/70 mb-6">
            {get("videoTestSubtitle")}
          </p>

          {/* Test Video Selector */}
          <div className="mb-6">
            <label className="text-white font-semibold mb-2 block">
              {get("videoTestSelect")}
            </label>
            <div className="flex gap-2 flex-wrap">
              {testVideos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => {
                    setTestVideoId(video.id);
                    setIsPlaying(false);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    testVideoId === video.id
                      ? "bg-emerald-500 text-white"
                      : "bg-white/20 text-white/80 hover:bg-white/30"
                  }`}
                >
                  {video.title}
                </button>
              ))}
            </div>
          </div>

          {/* Video Container */}
          <div className="relative aspect-video bg-black rounded-xl overflow-hidden mb-4">
            {!isPlaying ? (
              <div
                className="absolute inset-0 flex items-center justify-center cursor-pointer group"
                onClick={() => {
                  console.log("[VideoTest] Playing video:", testVideoId);
                  setIsPlaying(true);
                }}
              >
                <img
                  src={`https://img.youtube.com/vi/${testVideoId}/mqdefault.jpg`}
                  alt="Video thumbnail"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                <div className="relative z-10 w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl">
                  <Play className="w-10 h-10 text-red-600 ml-1" fill="currentColor" />
                </div>
              </div>
            ) : (
              <iframe
                key={testVideoId}
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${testVideoId}?autoplay=1&rel=0&modestbranding=1`}
                title="Test Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full border-0"
                onLoad={() => console.log("[VideoTest] iframe loaded successfully")}
                onError={(e) => console.error("[VideoTest] iframe error:", e)}
              />
            )}
          </div>

          {/* Video Info */}
          <div className="bg-black/30 rounded-lg p-4 mb-4">
            <p className="text-white/60 text-sm mb-2">
              <strong>{get("videoTestVideoId")}:</strong> {testVideoId}
            </p>
            <p className="text-white/60 text-sm mb-2">
              <strong>{get("videoTestEmbedUrl")}:</strong>{" "}
              <code className="text-emerald-400">
                https://www.youtube.com/embed/{testVideoId}
              </code>
            </p>
            <p className="text-white/60 text-sm">
              <strong>{get("videoTestStatus")}:</strong>{" "}
              {isPlaying ? (
                <span className="text-green-400">▶ {get("videoTestStatusPlaying")}</span>
              ) : (
                <span className="text-yellow-400">⏸ {get("videoTestStatusReady")}</span>
              )}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setIsPlaying(false)}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-all flex items-center gap-2"
            >
              {get("videoTestReset")}
            </button>
            <a
              href={`https://www.youtube.com/watch?v=${testVideoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
            >
              {get("videoTestOpen")} <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Troubleshooting Tips */}
          <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <h3 className="text-yellow-400 font-bold mb-2">
              🔧 {get("videoTestTroubleshoot")}
            </h3>
            <ul className="text-white/70 text-sm space-y-1 list-disc list-inside">
              {tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
