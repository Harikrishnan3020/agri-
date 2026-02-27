import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Globe,
    Bell,
    Shield,
    Moon,
    ChevronRight,
    Check,
    Trash2,
    LogOut,
    Info,
    Languages,
    Lock,
    Database,
    Wifi,
    HelpCircle,
    Mail,
    Star,
    Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { translations, LanguageCode } from "@/data/translations";
import { toast } from "sonner";

const LANGUAGES = [
    { code: "en", name: "English", native: "English", flag: "🇬🇧" },
    { code: "hi", name: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
    { code: "ta", name: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
    { code: "te", name: "Telugu", native: "తెలుగు", flag: "🇮🇳" },
    { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", flag: "🇮🇳" },
    { code: "ml", name: "Malayalam", native: "മലയാളം", flag: "🇮🇳" },
    { code: "mr", name: "Marathi", native: "मराठी", flag: "🇮🇳" },
    { code: "gu", name: "Gujarati", native: "ગુજરાતી", flag: "🇮🇳" },
    { code: "bn", name: "Bengali", native: "বাংলা", flag: "🇮🇳" },
];

const Settings = () => {
    const navigate = useNavigate();
    const { 
        selectedLanguage, 
        setLanguage, 
        user, 
        logout, 
        scanHistory,
        clearScanHistory,
        notificationsEnabled,
        setNotificationsEnabled,
        darkMode,
        setDarkMode,
    } = useAppStore();
    const t = translations[selectedLanguage as LanguageCode] || translations.en;

    const [showLangPicker, setShowLangPicker] = useState(false);

    const handleLanguageSelect = (code: string) => {
        setLanguage(code);
        setShowLangPicker(false);
        const langName = LANGUAGES.find(l => l.code === code)?.native || LANGUAGES.find(l => l.code === code)?.name;
        toast.success(`${t.languageChanged} ${langName}!`);
    };

    const handleClearHistory = () => {
        if (confirm(t.clearHistoryConfirm)) {
            clearScanHistory();
            toast.success(t.historyCleared);
        }
    };

    const handleToggleNotifications = () => {
        setNotificationsEnabled(!notificationsEnabled);
        toast.success(notificationsEnabled ? t.notificationsDisabled : t.notificationsEnabled);
    };

    const selectedLangInfo = LANGUAGES.find(l => l.code === selectedLanguage) || LANGUAGES[0];

    const SettingsRow = ({
        icon: Icon,
        title,
        subtitle,
        value,
        onClick,
        danger = false,
        showArrow = true
    }: {
        icon: React.ElementType;
        title: string;
        subtitle?: string;
        value?: string;
        onClick?: () => void;
        danger?: boolean;
        showArrow?: boolean;
    }) => (
        <button
            onClick={onClick}
            className={`w-full p-4 flex items-center gap-3 text-left hover:bg-white/5 transition-colors ${danger ? "text-red-400" : ""}`}
        >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${danger ? "bg-red-500/10" : "bg-white/10"}`}>
                <Icon className={`w-4.5 h-4.5 ${danger ? "text-red-400" : "text-white/50"}`} />
            </div>
            <div className="flex-1 min-w-0">
                <div className={`text-sm font-semibold ${danger ? "text-red-400" : "text-white/90"}`}>{title}</div>
                {subtitle && <div className="text-xs text-white/40 mt-0.5">{subtitle}</div>}
            </div>
            {value && <span className="text-xs text-emerald-400 font-medium">{value}</span>}
            {showArrow && <ChevronRight className="w-4 h-4 text-white/20 flex-shrink-0" />}
        </button>
    );

    return (
        <div
            className="min-h-screen pb-24"
            style={{ background: "linear-gradient(160deg, #0a1a0f 0%, #0d2318 40%, #071510 100%)" }}
        >
            {/* Header */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="sticky top-0 z-40 border-b border-white/10 px-4 py-4 flex items-center gap-3"
                style={{ background: "rgba(7,21,10,0.90)", backdropFilter: "blur(20px)" }}
            >
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="rounded-xl text-white/70 hover:text-white hover:bg-white/10"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-base font-bold text-white">{t.settingsTitle}</h1>
            </motion.header>

            <div className="px-4 py-5 space-y-4">

                {/* Account Info */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-white/10 p-4 flex items-center gap-3"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-xl font-bold">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-white font-bold">{user?.name || "Farmer"}</h2>
                        <p className="text-white/40 text-sm truncate">{user?.email || "No email set"}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 font-semibold">
                                {scanHistory.length} scans • {user?.score || 0} pts
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Preferences */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-2xl border border-white/10 overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                >
                    <div className="px-4 py-3 border-b border-white/5">
                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider flex items-center gap-2">
                            <Languages className="w-3.5 h-3.5" /> {t.appPreferences}
                        </h3>
                    </div>
                    <div className="divide-y divide-white/5">
                        <SettingsRow
                            icon={Globe}
                            title={t.appLanguage}
                            subtitle={t.changeDisplayLanguage}
                            value={`${selectedLangInfo.flag} ${selectedLangInfo.native}`}
                            onClick={() => setShowLangPicker(!showLangPicker)}
                        />
                    </div>

                    {/* Language Picker */}
                    {showLangPicker && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            className="border-t border-white/10 overflow-hidden"
                        >
                            <div className="p-3 grid grid-cols-1 gap-1">
                                {LANGUAGES.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => handleLanguageSelect(lang.code)}
                                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors ${selectedLanguage === lang.code
                                            ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
                                            : "text-white/70 hover:bg-white/5"}`}
                                    >
                                        <span>{lang.flag} {lang.name} <span className="text-white/40">({lang.native})</span></span>
                                        {selectedLanguage === lang.code && <Check className="w-4 h-4 text-emerald-400" />}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Notifications & Appearance */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="rounded-2xl border border-white/10 overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                >
                    <div className="px-4 py-3 border-b border-white/5">
                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider flex items-center gap-2">
                            <Bell className="w-3.5 h-3.5" /> {t.notificationsAppearance}
                        </h3>
                    </div>
                    <div className="divide-y divide-white/5">
                        <div className="p-4 flex items-center justify-between">
                            <div>
                                <div className="text-sm font-semibold text-white/90">{t.farmAlerts}</div>
                                <div className="text-xs text-white/40 mt-0.5">{t.pestWarningsWeatherAlerts}</div>
                            </div>
                            <button
                                onClick={handleToggleNotifications}
                                className={`relative w-11 h-6 rounded-full transition-colors ${notificationsEnabled ? "bg-emerald-600" : "bg-white/20"}`}
                            >
                                <span
                                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${notificationsEnabled ? "translate-x-6" : "translate-x-1"}`}
                                />
                            </button>
                        </div>
                        <div className="p-4 flex items-center justify-between">
                            <div>
                                <div className="text-sm font-semibold text-white/90 flex items-center gap-2">
                                    <Moon className="w-4 h-4" /> {t.darkMode}
                                </div>
                                <div className="text-xs text-white/40 mt-0.5">{t.currentlyAlwaysEnabled}</div>
                            </div>
                            <button
                                onClick={() => {
                                    setDarkMode(!darkMode);
                                    toast.info("Dark mode is always enabled in this version");
                                }}
                                className={`relative w-11 h-6 rounded-full transition-colors ${darkMode ? "bg-emerald-600" : "bg-white/20"}`}
                            >
                                <span
                                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${darkMode ? "translate-x-6" : "translate-x-1"}`}
                                />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Privacy & Data */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="rounded-2xl border border-white/10 overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                >
                    <div className="px-4 py-3 border-b border-white/5">
                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider flex items-center gap-2">
                            <Lock className="w-3.5 h-3.5" /> {t.privacyData}
                        </h3>
                    </div>
                    <div className="divide-y divide-white/5">
                        <SettingsRow
                            icon={Database}
                            title={t.dataUsage}
                            subtitle={`${scanHistory.length} ${t.scansStored} • ${(scanHistory.length * 0.5).toFixed(1)} MB`}
                            onClick={() => toast.info(t.scansStoredMB.replace('{count}', scanHistory.length.toString()).replace('{size}', (scanHistory.length * 0.5).toFixed(1)))}
                        />
                        <SettingsRow
                            icon={Wifi}
                            title={t.offlineMode}
                            subtitle={t.accessScanHistoryOffline}
                            value={t.available}
                            onClick={() => toast.success(t.offlineModeEnabled)}
                        />
                        <SettingsRow
                            icon={Download}
                            title={t.exportData}
                            subtitle={t.downloadScanHistoryCSV}
                            onClick={() => {
                                const csvContent = [
                                    ["Date", "Disease", "Crop", "Severity", "Confidence"],
                                    ...scanHistory.map(scan => [
                                        new Date(scan.date).toLocaleDateString(),
                                        scan.disease,
                                        scan.crop,
                                        scan.severity,
                                        `${scan.confidence}%`
                                    ])
                                ].map(row => row.join(",")).join("\n");
                                
                                const blob = new Blob([csvContent], { type: 'text/csv' });
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `agriyield-scans-${new Date().toISOString().split('T')[0]}.csv`;
                                a.click();
                                toast.success(t.scanHistoryExported);
                            }}
                        />
                    </div>
                </motion.div>

                {/* Help & Support */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-2xl border border-white/10 overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                >
                    <div className="px-4 py-3 border-b border-white/5">
                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider flex items-center gap-2">
                            <HelpCircle className="w-3.5 h-3.5" /> {t.helpSupport}
                        </h3>
                    </div>
                    <div className="divide-y divide-white/5">
                        <SettingsRow
                            icon={HelpCircle}
                            title={t.helpCenter}
                            subtitle={t.faqsTutorials}
                            onClick={() => toast.info(t.helpCenterComingSoon)}
                        />
                        <SettingsRow
                            icon={Mail}
                            title={t.contactSupport}
                            subtitle={t.getHelpFromTeam}
                            onClick={() => {
                                window.location.href = "mailto:support@agriyield.ai?subject=Support Request";
                            }}
                        />
                        <SettingsRow
                            icon={Star}
                            title={t.rateAgriYield}
                            subtitle={t.shareYourFeedback}
                            onClick={() => toast.success(t.thankYouRatingComingSoon)}
                        />
                    </div>
                </motion.div>

                {/* Account Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-2xl border border-white/10 overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                >
                    <div className="px-4 py-3 border-b border-white/5">
                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider flex items-center gap-2">
                            <Shield className="w-3.5 h-3.5" /> Account
                        </h3>
                    </div>
                    <div className="divide-y divide-white/5">
                        <SettingsRow
                            icon={Info}
                            title={t.aboutAgriYield}
                            subtitle={t.versionInfo}
                            onClick={() => toast.info(t.agriYieldSmartFarming)}
                        />
                        <SettingsRow
                            icon={Trash2}
                            title={t.clearScanHistory}
                            subtitle={t.deleteAllScanRecords}
                            onClick={handleClearHistory}
                            danger
                        />
                        <SettingsRow
                            icon={LogOut}
                            title={t.logOut}
                            subtitle={t.signOutOfAccount}
                            onClick={() => { logout(); navigate("/login"); }}
                            danger
                        />
                    </div>
                </motion.div>

                {/* App Version */}
                <div className="text-center py-4">
                    <p className="text-white/20 text-xs">{t.madeWithLoveForFarmers}</p>
                    <p className="text-white/10 text-[10px] mt-1">{t.poweredByAI}</p>
                </div>
            </div>
        </div>
    );
};

export default Settings;
