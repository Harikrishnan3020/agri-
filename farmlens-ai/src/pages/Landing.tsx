
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Leaf, ShieldCheck, TrendingUp, Zap, ChevronRight,
    Activity, Globe, Award, Smartphone,
    Sprout, Droplets, Sun, Wind, ArrowUpRight,
    ScanLine, BarChart3, Users, LucideIcon
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAppStore, type LeaderboardEntry } from "@/store/useAppStore";
import { translations, LanguageCode, type Translation } from "@/data/translations";

type LandingStrings = {
    navTechnology: string;
    navSolutions: string;
    navImpact: string;
    navCommunity: string;
    navSignIn: string;
    navGetStarted: string;
    systemBadge: string;
    heroHeadingLine1: string;
    heroHeadingLine2: string;
    heroSubheading: string;
    launchDashboard: string;
    farmersJoinedLabel: string;
    intelligenceTitle: string;
    intelligenceHighlight: string;
    neuralCardDesc: string;
    growthIndexTitle: string;
    growthIndexDesc: string;
    yieldRankLabel: string;
    globalLeagueTitle: string;
    globalLeagueDesc: string;
    noCultivators: string;
    offlineFirstTitle: string;
    offlineFirstDesc: string;
    reliefSupportTitle: string;
    reliefSupportDesc: string;
    precisionIrrigationTitle: string;
    precisionIrrigationDesc: string;
    yieldAnalyticsTitle: string;
    yieldAnalyticsDesc: string;
    acresMonitored: string;
    dataPoints: string;
    farmersEmpowered: string;
    insectsIdentified: string;
    readyToGrowPrefix: string;
    readyToGrowHighlight: string;
    ctaSubtitle: string;
    getStartedNow: string;
    footerDescription: string;
    footerPlatform: string;
    footerCompany: string;
    footerCropHealth: string;
    footerCommunityExchange: string;
    footerReliefSupport: string;
    footerAbout: string;
    footerCareers: string;
    footerContact: string;
    footerRights: string;
};


const landingTranslations: Partial<Record<LanguageCode, LandingStrings>> = {
    en: {
        navTechnology: "Technology",
        navSolutions: "Solutions",
        navImpact: "Impact",
        navCommunity: "Community",
        navSignIn: "Sign In",
        navGetStarted: "Get Started",
        systemBadge: "SYSTEM ONLINE_ v2.4",
        heroHeadingLine1: "PRECISION",
        heroHeadingLine2: "AGRICULTURE",
        heroSubheading: "The world's most advanced AI-powered farming companion. Detect diseases, predict yields, and connect to global markets instantly.",
        launchDashboard: "Launch Dashboard",
        farmersJoinedLabel: "Farmers Joined",
        intelligenceTitle: "INTELLIGENCE",
        intelligenceHighlight: "GROWN LOCALLY.",
        neuralCardDesc: "Real-time pathogen diagnosis using edge computing. 99.8% accuracy on early-stage blight detection.",
        growthIndexTitle: "Growth Index",
        growthIndexDesc: "Predictive success models.",
        yieldRankLabel: "Yield Rank",
        globalLeagueTitle: "Global League",
        globalLeagueDesc: "Compete with top cultivators.",
        noCultivators: "No active cultivators yet",
        offlineFirstTitle: "Offline-First Mode",
        offlineFirstDesc: "No internet? No problem. Core diagnostic models run directly on your device using WebAssembly.",
        reliefSupportTitle: "Relief Support",
        reliefSupportDesc: "Automated support disbursements triggered by satellite weather data, aligned with Govt schemes.",
        precisionIrrigationTitle: "Precision Irrigation",
        precisionIrrigationDesc: "IoT integration to optimize water usage based on soil moisture sensor arrays.",
        yieldAnalyticsTitle: "Yield Analytics",
        yieldAnalyticsDesc: "Historical data comparison to forecast harvest volume and quality metrics.",
        acresMonitored: "Acres Monitored",
        dataPoints: "Data Points",
        farmersEmpowered: "Farmers Empowered",
        insectsIdentified: "Insects Identified",
        readyToGrowPrefix: "READY TO",
        readyToGrowHighlight: "GROW?",
        ctaSubtitle: "Join the thousands of farmers transforming their crop yields with AgriYield AI driven insights.",
        getStartedNow: "Get Started Now",
        footerDescription: "Empowering the next generation of agriculture with artificial intelligence and blockchain technology.",
        footerPlatform: "Platform",
        footerCompany: "Company",
        footerCropHealth: "Crop Health",
        footerCommunityExchange: "Community Exchange",
        footerReliefSupport: "Relief Support",
        footerAbout: "About",
        footerCareers: "Careers",
        footerContact: "Contact",
        footerRights: "© 2024 FarmLens AI. All rights reserved.",
    },
    hi: {
        navTechnology: "प्रौद्योगिकी",
        navSolutions: "समाधान",
        navImpact: "प्रभाव",
        navCommunity: "समुदाय",
        navSignIn: "साइन इन",
        navGetStarted: "शुरू करें",
        systemBadge: "सिस्टम ऑनलाइन_ v2.4",
        heroHeadingLine1: "सटीक",
        heroHeadingLine2: "कृषि",
        heroSubheading: "दुनिया का सबसे उन्नत AI-संचालित कृषि साथी। रोग पहचानें, उपज का पूर्वानुमान लगाएं और तुरंत वैश्विक बाजारों से जुड़ें।",
        launchDashboard: "डैशबोर्ड खोलें",
        farmersJoinedLabel: "किसान जुड़े",
        intelligenceTitle: "बुद्धिमत्ता",
        intelligenceHighlight: "स्थानीय रूप से विकसित।",
        neuralCardDesc: "एज कंप्यूटिंग से रीयल-टाइम रोगजनक निदान। शुरुआती ब्लाइट पर 99.8% सटीकता।",
        growthIndexTitle: "विकास सूचकांक",
        growthIndexDesc: "पूर्वानुमानित सफलता मॉडल।",
        yieldRankLabel: "उपज रैंक",
        globalLeagueTitle: "वैश्विक लीग",
        globalLeagueDesc: "शीर्ष कृषकों से प्रतिस्पर्धा करें।",
        noCultivators: "अभी कोई सक्रिय कृषक नहीं",
        offlineFirstTitle: "ऑफलाइन-प्रथम मोड",
        offlineFirstDesc: "इंटरनेट नहीं? कोई बात नहीं। मुख्य निदान मॉडल आपके डिवाइस पर ही WebAssembly के साथ चलते हैं।",
        reliefSupportTitle: "राहत सहायता",
        reliefSupportDesc: "सरकारी योजनाओं के अनुरूप, उपग्रह मौसम डेटा से स्वतः सहायता वितरण।",
        precisionIrrigationTitle: "सटीक सिंचाई",
        precisionIrrigationDesc: "मृदा नमी सेंसर ऐरे के आधार पर जल उपयोग अनुकूल करने के लिए IoT एकीकरण।",
        yieldAnalyticsTitle: "उपज विश्लेषण",
        yieldAnalyticsDesc: "ऐतिहासिक डेटा तुलना से कटाई मात्रा और गुणवत्ता का पूर्वानुमान।",
        acresMonitored: "निगरानी की गई एकड़",
        dataPoints: "डेटा पॉइंट्स",
        farmersEmpowered: "सशक्त किसान",
        insectsIdentified: "पहचाने गए कीट",
        readyToGrowPrefix: "क्या आप",
        readyToGrowHighlight: "विकास के लिए तैयार हैं?",
        ctaSubtitle: "हजारों किसान AgriYield AI की अंतर्दृष्टि से अपनी उपज बदल रहे हैं।",
        getStartedNow: "अभी शुरू करें",
        footerDescription: "कृषि की नई पीढ़ी को कृत्रिम बुद्धिमत्ता और ब्लॉकचेन प्रौद्योगिकी से सशक्त बनाना।",
        footerPlatform: "प्लेटफॉर्म",
        footerCompany: "कंपनी",
        footerCropHealth: "फसल स्वास्थ्य",
        footerCommunityExchange: "समुदाय एक्सचेंज",
        footerReliefSupport: "राहत सहायता",
        footerAbout: "परिचय",
        footerCareers: "करियर",
        footerContact: "संपर्क",
        footerRights: "© 2024 FarmLens AI. सर्वाधिकार सुरक्षित।",
    },
    pa: {
        navTechnology: "ਤਕਨਾਲੋਜੀ",
        navSolutions: "ਹੱਲ",
        navImpact: "ਅਸਰ",
        navCommunity: "ਕਮਿਊਨਿਟੀ",
        navSignIn: "ਸਾਇਨ ਇਨ",
        navGetStarted: "ਸ਼ੁਰੂ ਕਰੋ",
        systemBadge: "ਸਿਸਟਮ ਔਨਲਾਈਨ_ v2.4",
        heroHeadingLine1: "ਪ੍ਰੀਸੀਜ਼ਨ",
        heroHeadingLine2: "ਕ੍ਰਿਸ਼ੀ",
        heroSubheading: "ਦੁਨੀਆ ਦਾ ਸਭ ਤੋਂ ਅਗੇਤਰੀ AI ਸਾਥੀ। ਰੋਗ ਪਛਾਣੋ, ਉਪਜ ਅਨੁਮਾਨੋ ਅਤੇ ਗਲੋਬਲ ਮਾਰਕੀਟਾਂ ਨਾਲ ਤੁਰੰਤ ਜੁੜੋ।",
        launchDashboard: "ਡੈਸ਼ਬੋਰਡ ਖੋਲ੍ਹੋ",
        farmersJoinedLabel: "ਕਿਸਾਨ ਜੁੜੇ",
        intelligenceTitle: "ਬੁੱਧੀਮਤਾ",
        intelligenceHighlight: "ਸਥਾਨਕ ਤੌਰ ਤੇ ਉੱਗੀ।",
        neuralCardDesc: "ਐਜ ਕੰਪਿਊਟਿੰਗ ਨਾਲ ਰੀਅਲ-ਟਾਈਮ ਰੋਗਜਣਕ ਨਿਦਾਨ। ਸ਼ੁਰੂਆਤੀ ਬਲਾਈਟ 'ਤੇ 99.8% ਸਹੀਤਾ।",
        growthIndexTitle: "ਵਿਕਾਸ ਸੂਚਕ",
        growthIndexDesc: "ਭਵਿੱਖਬਾਣੀ ਸਫਲਤਾ ਮਾਡਲ।",
        yieldRankLabel: "ਉਪਜ ਰੈਂਕ",
        globalLeagueTitle: "ਗਲੋਬਲ ਲੀਗ",
        globalLeagueDesc: "ਸ਼੍ਰੇਸ਼ਠ ਕਿਸਾਨਾਂ ਨਾਲ ਮੁਕਾਬਲਾ ਕਰੋ।",
        noCultivators: "ਹਾਲੇ ਕੋਈ ਸਰਗਰਮ ਕਿਸਾਨ ਨਹੀਂ",
        offlineFirstTitle: "ਆਫਲਾਈਨ-ਪਹਿਲਾ ਮੋਡ",
        offlineFirstDesc: "ਇੰਟਰਨੈੱਟ ਨਹੀਂ? ਕੋਈ ਗੱਲ ਨਹੀਂ। ਮੁੱਖ ਨਿਦਾਨ ਮਾਡਲ ਤੁਹਾਡੇ ਜੰਤਰ 'ਤੇ WebAssembly ਨਾਲ ਚਲਦੇ ਹਨ।",
        reliefSupportTitle: "ਰਾਹਤ ਸਹਾਇਤਾ",
        reliefSupportDesc: "ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ ਨਾਲ ਮਿਲਾਕਾਤ, ਸੈਟੇਲਾਈਟ ਮੌਸਮ ਡਾਟਾ ਤੋਂ ਆਟੋ ਸਹਾਇਤਾ ਵੰਡ।",
        precisionIrrigationTitle: "ਸਟੀਕ ਸਿੰਚਾਈ",
        precisionIrrigationDesc: "ਮਿੱਟੀ ਨਮੀ ਸੈਂਸਰਾਂ ਆਧਾਰਤ ਜਲ ਉਪਯੋਗਤਾ ਓਪਟੀਮਾਈਜੇਸ਼ਨ ਲਈ IoT ਇੰਟੀਗ੍ਰੇਸ਼ਨ।",
        yieldAnalyticsTitle: "ਉਪਜ ਵਿਸ਼ਲੇਸ਼ਣ",
        yieldAnalyticsDesc: "ਇਤਿਹਾਸਕ ਡਾਟਾ ਨਾਲ ਤੁਲਨਾ ਕਰ ਕੇ ਫਸਲ ਮਾਤਰਾ ਅਤੇ ਗੁਣਵੱਤਾ ਦਾ ਅਨੁਮਾਨ।",
        acresMonitored: "ਨਿਗਰਾਨੀ ਕੀਤੇ ਏਕੜ",
        dataPoints: "ਡਾਟਾ ਪੁਆਇੰਟਸ",
        farmersEmpowered: "ਸਸ਼ਕਤ ਕਿਸਾਨ",
        insectsIdentified: "ਪਛਾਣੇ ਕੀੜੇ",
        readyToGrowPrefix: "ਤਿਆਰ ਹੋ",
        readyToGrowHighlight: "ਵੱਧਣ ਲਈ?",
        ctaSubtitle: "ਹਜ਼ਾਰਾਂ ਕਿਸਾਨ AgriYield AI ਦੀਆਂ ਝਲਕਾਂ ਨਾਲ ਆਪਣੀ ਉਪਜ ਬਦਲ ਰਹੇ ਹਨ।",
        getStartedNow: "ਹੁਣੇ ਸ਼ੁਰੂ ਕਰੋ",
        footerDescription: "AI ਅਤੇ ਬਲੌਕਚੇਨ ਨਾਲ ਅਗਲੀ ਪੀੜ੍ਹੀ ਦੀ ਖੇਤੀ ਨੂੰ ਸਸ਼ਕਤ ਕਰਨਾ।",
        footerPlatform: "ਪਲੇਟਫਾਰਮ",
        footerCompany: "ਕੰਪਨੀ",
        footerCropHealth: "ਫਸਲ ਸਿਹਤ",
        footerCommunityExchange: "ਕਮਿਊਨਿਟੀ ਐਕਸਚੇਂਜ",
        footerReliefSupport: "ਰਾਹਤ ਸਹਾਇਤਾ",
        footerAbout: "ਬਾਰੇ",
        footerCareers: "ਕੈਰੀਅਰ",
        footerContact: "ਸੰਪਰਕ",
        footerRights: "© 2024 FarmLens AI. ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ ਹਨ।",
    },
    or: {
        navTechnology: "ପ୍ରଯୁକ୍ତି",
        navSolutions: "ସମାଧାନ",
        navImpact: "ପ୍ରଭାବ",
        navCommunity: "ସମୁଦାୟ",
        navSignIn: "ସାଇନ୍ ଇନ୍",
        navGetStarted: "ଆରମ୍ଭ କରନ୍ତୁ",
        systemBadge: "ସିଷ୍ଟମ ଅନଲାଇନ୍_ v2.4",
        heroHeadingLine1: "ପ୍ରିସିଜନ",
        heroHeadingLine2: "କୃଷି",
        heroSubheading: "ବିଶ୍ୱର ସବୁଠାରୁ ଅଗ୍ରଗାମୀ AI କୃଷି ସହଯୋଗୀ। ରୋଗ ଚିହ୍ନଟ, ଉତ୍ପାଦନ ପୂର୍ବାନୁମାନ ଏବଂ ତୁରନ୍ତ ଗ୍ଲୋବାଲ୍ ମାର୍କେଟ ସହ ଯୋଗାଯୋଗ।",
        launchDashboard: "ଡାଶବୋର୍ଡ ଖୋଲନ୍ତୁ",
        farmersJoinedLabel: "କୃଷକ ଯୋଗ ଦେଲେ",
        intelligenceTitle: "ବୁଦ୍ଧିମତା",
        intelligenceHighlight: "ସ୍ଥାନୀୟ ଭାବେ ବିକଶିତ।",
        neuralCardDesc: "ଏଜ୍ କମ୍ପ୍ୟୁଟିଂ ଦ୍ୱାରା ରିଅଲ୍-ଟାଇମ୍ ରୋଗଜଣକ ନିଦାନ। ପ୍ରାରମ୍ଭିକ ବ୍ଲାଇଟ୍‌ରେ 99.8% ସଠିକତା।",
        growthIndexTitle: "ବୃଦ୍ଧି ସୂଚକ",
        growthIndexDesc: "ପୂର୍ବାନୁମାନ ସଫଳତା ମଡେଲ୍।",
        yieldRankLabel: "ଉତ୍ପାଦନ ର୍ୟାଙ୍କ",
        globalLeagueTitle: "ଗ୍ଲୋବାଲ୍ ଲିଗ୍",
        globalLeagueDesc: "ଶୀର୍ଷ ଚାଷୀଙ୍କ ସହ ପ୍ରତିଯୋଗିତା କରନ୍ତୁ।",
        noCultivators: "ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ସକ୍ରିୟ ଚାଷୀ ନାହିଁ",
        offlineFirstTitle: "ଅଫଲାଇନ୍-ପ୍ରଥମ ମୋଡ୍",
        offlineFirstDesc: "ଇଣ୍ଟରନେଟ୍ ନାହିଁ? ସମସ୍ୟା ନାହିଁ। ମୂଳ ନିଦାନ ମଡେଲ୍ WebAssembly ସହ ଆପଣଙ୍କ ଡିଭାଇସରେ ଚାଲେ।",
        reliefSupportTitle: "ରିଲିଫ ସହାୟତା",
        reliefSupportDesc: "ସରକାରୀ ଯୋଜନା ସହ ସମନ୍ୱିତ ସ୍ୟାଟେଲାଇଟ୍ ଆବହାବା ତଥ୍ୟ ଆଧାରିତ ସ୍ୱୟଂଚାଳିତ ସହାୟତା ବଣ୍ଟନ।",
        precisionIrrigationTitle: "ସଠିକ ସିଚାଇ",
        precisionIrrigationDesc: "ମାଟି ନମି ସେନ୍ସର ଆଧାରିତ ଜଳ ବ୍ୟବହାର ଅପ୍ଟିମାଇଜେସନ ପାଇଁ IoT ସମନ୍ବୟ।",
        yieldAnalyticsTitle: "ଉପଜ ବିଶ୍ଳେଷଣ",
        yieldAnalyticsDesc: "ଇତିହାସିକ ତଥ୍ୟ ସହ ତୁଳନା କରି ଫସଲ ପରିମାଣ ଏବଂ ଗୁଣବତ୍ତା ପୂର୍ବାନୁମାନ।",
        acresMonitored: "ନିରୀକ୍ଷଣ କୃତ ଏକର",
        dataPoints: "ଡାଟା ପଏଣ୍ଟସ୍",
        farmersEmpowered: "ସଶକ୍ତ କୃଷକ",
        insectsIdentified: "ଚିହ୍ନଟ କୀଟ",
        readyToGrowPrefix: "ପ୍ରସ୍ତୁତ",
        readyToGrowHighlight: "ବୃଦ୍ଧି ପାଇଁ?",
        ctaSubtitle: "ହଜାର ଚାଷୀ AgriYield AI ର ଅନୁସନ୍ଧାନ ସହିତ ନିଜର ଉତ୍ପାଦନ ପରିବର୍ତ୍ତନ କରୁଛନ୍ତି।",
        getStartedNow: "ଏବେ ଆରମ୍ଭ କରନ୍ତୁ",
        footerDescription: "AI ଏବଂ ବ୍ଲକଚେନ୍ ସହ କୃଷିର ନୂତନ ପିଢିକୁ ସଶକ୍ତ କରିବା।",
        footerPlatform: "ପ୍ଲାଟଫର୍ମ",
        footerCompany: "କମ୍ପାନି",
        footerCropHealth: "ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ",
        footerCommunityExchange: "ସମୁଦାୟ ବିନିମୟ",
        footerReliefSupport: "ରିଲିଫ ସହାୟତା",
        footerAbout: "ପରିଚୟ",
        footerCareers: "କେରିଅର୍",
        footerContact: "ଯୋଗାଯୋଗ",
        footerRights: "© 2024 FarmLens AI. ସମସ୍ତ ଅଧିକାର ସଂରକ୍ଷିତ।",
    },
    as: {
        navTechnology: "প্ৰযুক্তি",
        navSolutions: "সমাধান",
        navImpact: "প্ৰভাৱ",
        navCommunity: "সমাজ",
        navSignIn: "চাইন ইন",
        navGetStarted: "আৰম্ভ কৰক",
        systemBadge: "ছিষ্টেম অনলাইন_ v2.4",
        heroHeadingLine1: "প্ৰিসিজন",
        heroHeadingLine2: "কৃষি",
        heroSubheading: "বিশ্বৰ আটাইতকৈ উন্নত AI কৃষি সংগী। ৰোগ চিনাক্ত কৰক, উৎপাদনৰ পূৰ্বাভাস কৰক আৰু তুৰন্ত গ্লোবেল বজাৰত সংযোগ হওক।",
        launchDashboard: "ডেচব'ৰ্ড খোলক",
        farmersJoinedLabel: "কৃষকে অংশ ল'লে",
        intelligenceTitle: "বুদ্ধিমত্তা",
        intelligenceHighlight: "স্থানীয়ভাৱে বৃদ্ধি।",
        neuralCardDesc: "এজ কম্পিউটিঙেৰে ৰিয়েল-টাইম ৰোগজীৱাণু নিৰ্ণয়। আৰম্ভণি ব্লাইটত 99.8% সঠিকতা।",
        growthIndexTitle: "বৃদ্ধিৰ সূচক",
        growthIndexDesc: "পূৰ্বাভাসমূলক সফলতা মডেল।",
        yieldRankLabel: "উৎপাদন ৰেংক",
        globalLeagueTitle: "গ্লোবেল লীগ",
        globalLeagueDesc: "শীৰ্ষ চাষীৰ সৈতে প্ৰতিযোগিতা কৰক।",
        noCultivators: "এতিয়ালৈকে কোনো সক্ৰিয় চাষী নাই",
        offlineFirstTitle: "অফলাইন-প্ৰথম ম'ড",
        offlineFirstDesc: "ইন্টাৰনেট নাই? সমস্যা নাই। মুখ্য নিৰ্ণয় মডেল আপোনাৰ ডিভাইচত WebAssembly-ৰে চলে।",
        reliefSupportTitle: "সহায় সঁহাৰি",
        reliefSupportDesc: "চৰকাৰী আঁচনিৰ সংগে মিলাই উপগ্ৰহ বতৰ তথ্যৰ পৰা স্বয়ংক্ৰিয় সহায় বিতৰণ।",
        precisionIrrigationTitle: "সঠিক সিঞ্চন",
        precisionIrrigationDesc: "মাটি আর্দ্ৰতা সেন্সৰে আধাৰিত পানী ব্যৱহাৰ অপ্টিমাইজেশ্যনৰ বাবে IoT সংহতি।",
        yieldAnalyticsTitle: "উৎপাদন এনালিটিক্স",
        yieldAnalyticsDesc: "ইতিহাসিক তথ্য তুলনা কৰি ফচল পৰিমাণ আৰু গুণগত মান পূৰ্বাভাস।",
        acresMonitored: "নীৰিক্ষিত একৰ",
        dataPoints: "ডাটা পইণ্ট",
        farmersEmpowered: "সক্ষম কৃষক",
        insectsIdentified: "চিনাক্ত কৰা পতংগ",
        readyToGrowPrefix: "সাজু",
        readyToGrowHighlight: "বঢ়িবলৈ?",
        ctaSubtitle: "হাজাৰ হাজাৰ কৃষকে AgriYield AI ৰ অন্তৰ্দৃষ্টিৰে নিজৰ উৎপাদন ৰূপান্তৰিত কৰিছে।",
        getStartedNow: "এতিয়াই আৰম্ভ কৰক",
        footerDescription: "AI আৰু ব্লকচেইনৰে কৃষিৰ পৰৱৰ্তী প্ৰজন্মক শক্তিশালী কৰা।",
        footerPlatform: "প্লেটফৰ্ম",
        footerCompany: "কোম্পানী",
        footerCropHealth: "ফচল স্বাস্থ্য",
        footerCommunityExchange: "সমাজ বিনিময়",
        footerReliefSupport: "সহায় সঁহাৰি",
        footerAbout: "পৰি-বিৱৰণ",
        footerCareers: "চাকৰি",
        footerContact: "যোগাযোগ",
        footerRights: "© 2024 FarmLens AI. সকলো অধিকাৰ সংৰক্ষিত।",
    },
};

// --- Components ---

const Navbar = ({ strings }: { strings: LandingStrings }) => {
    const navLinks = [
        { id: "technology", label: strings.navTechnology },
        { id: "solutions", label: strings.navSolutions },
        { id: "impact", label: strings.navImpact },
        { id: "community", label: strings.navCommunity },
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/50 backdrop-blur-xl border-b border-white/10"
        >
            <div className="flex items-center gap-2">
                <Link to="/" className="hover:opacity-80 transition-opacity">
                    <div className="w-9 h-9 rounded-[10px] bg-[#10b981] flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <Leaf className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                </Link>
                <span className="font-bold text-white tracking-tight text-lg underline-offset-4">AgriYield<span className="text-emerald-500">.AI</span></span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                {navLinks.map((item) => (
                    <a key={item.id} href={`#${item.id}`} className="hover:text-emerald-400 transition-colors">
                        {item.label}
                    </a>
                ))}
            </div>
            <div className="flex items-center gap-4">
                <Link to="/login" className="hidden md:block text-sm font-medium text-white hover:text-emerald-400 transition-colors">{strings.navSignIn}</Link>
                <Link to="/login">
                    <Button className="rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
                        {strings.navGetStarted}
                    </Button>
                </Link>
            </div>
        </motion.nav>
    );
};

const Hero = ({ strings }: { strings: LandingStrings }) => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <div className="relative min-h-[110vh] flex items-center justify-center overflow-hidden bg-[#020403]">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />

            {/* Ambient Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container relative z-10 px-6 pt-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-8 backdrop-blur-sm"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    {strings.systemBadge}
                </motion.div>

                <motion.h1
                    style={{ y: y1, opacity }}
                    className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white mb-6 leading-[0.9]"
                >
                    {strings.heroHeadingLine1} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-emerald-400 to-emerald-900">{strings.heroHeadingLine2}</span>
                </motion.h1>

                <motion.p
                    style={{ y: y1 }}
                    className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    {strings.heroSubheading}
                </motion.p>

                <motion.div
                    style={{ y: y2 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link to="/login">
                        <Button className="h-14 px-8 rounded-full bg-white text-black hover:bg-gray-200 font-semibold text-lg transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:scale-105">
                            {strings.launchDashboard}
                        </Button>
                    </Link>
                    <div className="flex items-center gap-4 px-6 py-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-black flex items-center justify-center text-[10px] text-white">
                                    <Users className="w-3 h-3" />
                                </div>
                            ))}
                        </div>
                        <span className="text-sm text-gray-300"><span className="text-white font-bold">50k+</span> {strings.farmersJoinedLabel}</span>
                    </div>
                </motion.div>
            </div>

            {/* 3D Floating Elements (Decorative) */}
            <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/3 left-[10%] w-64 h-64 border border-emerald-500/20 rounded-full flex items-center justify-center hidden lg:flex"
            >
                <div className="w-48 h-48 border border-emerald-500/10 rounded-full animate-pulse" />
            </motion.div>
        </div>
    );
};

const BentoGrid = ({ strings, common, leaderboard }: { strings: LandingStrings; common: Translation; leaderboard: LeaderboardEntry[] }) => {
    const topLeaderboard = leaderboard.slice(0, 3);

    return (
        <section className="py-32 bg-[#020403] relative z-20">
            <div className="container mx-auto px-6">
                <div className="mb-20">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">{strings.intelligenceTitle} <br /><span className="text-emerald-500">{strings.intelligenceHighlight}</span></h2>
                    <div className="h-1 w-40 bg-emerald-600" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
                    {/* Large Card - Crop Diagnosis */}
                    <motion.div
                        whileHover={{ scale: 0.99 }}
                        className="md:col-span-2 row-span-2 rounded-[2rem] border border-emerald-500/20 overflow-hidden relative group"
                        style={{ background: "linear-gradient(145deg, #0a1f0f 0%, #071510 100%)" }}
                    >
                        {/* Bright image — no dim overlay */}
                        <img
                            src="https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=2696&auto=format&fit=crop"
                            className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                            alt="Plant analysis"
                        />
                        {/* Only a bottom gradient for text legibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                        {/* Animated scan line across image */}
                        <motion.div
                            className="absolute inset-x-0 h-[2px] z-10 pointer-events-none"
                            style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.9), rgba(52,211,153,1), rgba(16,185,129,0.9), transparent)" }}
                            animate={{ top: ["5%", "95%", "5%"] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        />
                        {/* Scan glow */}
                        <motion.div
                            className="absolute inset-x-0 h-12 blur-xl z-10 pointer-events-none"
                            style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.3), transparent)" }}
                            animate={{ top: ["2%", "90%", "2%"] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        />

                        <div className="relative z-10 p-10 h-full flex flex-col justify-end">
                            <motion.div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                                style={{ background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 0 30px rgba(16,185,129,0.5)" }}
                                animate={{ boxShadow: ["0 0 20px rgba(16,185,129,0.4)", "0 0 50px rgba(16,185,129,0.7)", "0 0 20px rgba(16,185,129,0.4)"] }}
                                transition={{ duration: 2.5, repeat: Infinity }}
                            >
                                <ScanLine className="w-8 h-8 text-white" />
                            </motion.div>
                            <h3 className="text-3xl font-bold text-white mb-2">{common.neuralAgriCV}</h3>
                            <p className="text-gray-300 text-lg max-w-md">{strings.neuralCardDesc}</p>

                            {/* Overlay UI Mockup */}
                            <div className="absolute top-10 right-10 backdrop-blur-md border border-emerald-500/40 p-4 rounded-xl" style={{ background: "rgba(0,0,0,0.7)" }}>
                                <div className="flex items-center gap-3 text-emerald-400 text-sm font-mono mb-3">
                                    <motion.div
                                        className="w-2 h-2 rounded-full bg-emerald-400"
                                        animate={{ opacity: [1, 0.2, 1], scale: [1, 1.3, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    />
                                    SCANNING...
                                </div>
                                <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <motion.div
                                        animate={{ width: ["0%", "100%", "0%"] }}
                                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                        className="h-full rounded-full"
                                        style={{ background: "linear-gradient(90deg, #10b981, #34d399)" }}
                                    />
                                </div>
                                <div className="mt-3 flex gap-2">
                                    {["CNN", "98.8%", "BLIGHT"].map((tag, i) => (
                                        <motion.span
                                            key={tag}
                                            className="text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30 text-emerald-300"
                                            style={{ background: "rgba(16,185,129,0.1)" }}
                                            animate={{ opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                                        >
                                            {tag}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Small Card 1 - Market Futures */}
                    <motion.div
                        whileHover={{ scale: 0.98, borderColor: "rgba(245,158,11,0.5)" }}
                        className="rounded-[2rem] border border-white/10 p-8 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
                        style={{ background: "linear-gradient(145deg, #1a1000 0%, #0d0800 100%)" }}
                    >
                        {/* Animated background glow */}
                        <motion.div
                            className="absolute inset-0 pointer-events-none"
                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            style={{ background: "radial-gradient(ellipse at 30% 30%, rgba(245,158,11,0.15) 0%, transparent 70%)" }}
                        />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <motion.div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center border border-amber-500/30"
                                    style={{ background: "rgba(245,158,11,0.15)" }}
                                    animate={{ boxShadow: ["0 0 10px rgba(245,158,11,0.2)", "0 0 25px rgba(245,158,11,0.5)", "0 0 10px rgba(245,158,11,0.2)"] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <TrendingUp className="w-6 h-6 text-amber-400" />
                                </motion.div>
                                {/* Live ticker */}
                                <motion.div
                                    className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-green-500/30 text-green-400 text-xs font-mono"
                                    style={{ background: "rgba(34,197,94,0.1)" }}
                                    animate={{ opacity: [0.7, 1, 0.7] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <motion.div className="w-1.5 h-1.5 rounded-full bg-green-400" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
                                    LIVE
                                </motion.div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">{strings.growthIndexTitle}</h3>
                            <p className="text-sm text-gray-500">{strings.growthIndexDesc}</p>

                            {/* Impact display */}
                            <div className="mt-3 flex items-baseline gap-2">
                                <motion.span
                                    className="text-2xl font-bold text-emerald-400"
                                    animate={{ opacity: [0.8, 1, 0.8] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    98.5%
                                </motion.span>
                                <span className="text-xs text-emerald-400 font-semibold">▲ {strings.yieldRankLabel}</span>
                            </div>
                        </div>

                        {/* Animated SVG chart */}
                        <div className="relative h-20 mt-2">
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
                                {/* Filled area */}
                                <motion.path
                                    d="M0 50 Q 30 40, 50 35 T 90 20 T 130 15 T 170 8 T 200 5 V 60 H 0 Z"
                                    fill="url(#amberGrad)"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1 }}
                                />
                                {/* Line */}
                                <motion.path
                                    d="M0 50 Q 30 40, 50 35 T 90 20 T 130 15 T 170 8 T 200 5"
                                    fill="none"
                                    stroke="#f59e0b"
                                    strokeWidth="2"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
                                />
                                {/* Moving dot on line */}
                                <motion.circle
                                    r="3"
                                    fill="#f59e0b"
                                    filter="url(#glow)"
                                    animate={{ cx: [0, 50, 100, 150, 200], cy: [50, 35, 20, 8, 5] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                />
                                <defs>
                                    <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="rgba(245,158,11,0.3)" />
                                        <stop offset="100%" stopColor="rgba(245,158,11,0)" />
                                    </linearGradient>
                                    <filter id="glow">
                                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                        <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                                    </filter>
                                </defs>
                            </svg>
                        </div>
                    </motion.div>

                    {/* Small Card 2 - Global League */}
                    <motion.div
                        whileHover={{ scale: 0.98, borderColor: "rgba(168,85,247,0.5)" }}
                        className="rounded-[2rem] border border-white/10 p-8 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
                        style={{ background: "linear-gradient(145deg, #0d0a1a 0%, #080612 100%)" }}
                    >
                        {/* Animated background glow */}
                        <motion.div
                            className="absolute inset-0 pointer-events-none"
                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            style={{ background: "radial-gradient(ellipse at 70% 30%, rgba(168,85,247,0.2) 0%, transparent 70%)" }}
                        />

                        {/* Orbiting ring */}
                        <motion.div
                            className="absolute top-6 right-6 w-20 h-20 rounded-full border border-purple-500/20"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        >
                            <motion.div
                                className="absolute -top-1 left-1/2 w-2 h-2 rounded-full bg-purple-400"
                                style={{ boxShadow: "0 0 8px rgba(168,85,247,0.8)" }}
                            />
                        </motion.div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <motion.div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center border border-purple-500/30"
                                    style={{ background: "rgba(168,85,247,0.15)" }}
                                    animate={{ boxShadow: ["0 0 10px rgba(168,85,247,0.2)", "0 0 25px rgba(168,85,247,0.5)", "0 0 10px rgba(168,85,247,0.2)"] }}
                                    transition={{ duration: 2.5, repeat: Infinity }}
                                >
                                    <Globe className="w-6 h-6 text-purple-400" />
                                </motion.div>
                                {/* Animated rank badge */}
                                <motion.div
                                    className="text-3xl font-extrabold text-white"
                                    animate={{ scale: [1, 1.1, 1], textShadow: ["0 0 10px rgba(168,85,247,0.5)", "0 0 25px rgba(168,85,247,0.9)", "0 0 10px rgba(168,85,247,0.5)"] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    #1
                                </motion.div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">{strings.globalLeagueTitle}</h3>
                            <p className="text-sm text-gray-500">{strings.globalLeagueDesc}</p>
                        </div>

                        {/* Animated leaderboard rows using REAL store data */}
                        <div className="relative z-10 mt-3 space-y-2">
                            {topLeaderboard.map((row, i) => (
                                <motion.div
                                    key={row.rank}
                                    className="flex items-center justify-between px-3 py-1.5 rounded-lg border border-white/5"
                                    style={{ background: "rgba(255,255,255,0.03)" }}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + i * 0.15 }}
                                    whileHover={{ background: "rgba(168,85,247,0.1)", borderColor: "rgba(168,85,247,0.3)" }}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs font-bold w-4 ${i === 0 ? 'text-amber-400' : i === 1 ? 'text-gray-300' : 'text-orange-400'}`}>{row.rank}</span>
                                        <span className="text-xs text-gray-300">{row.name}</span>
                                    </div>
                                    <span className="text-xs font-mono text-purple-300">{row.score.toLocaleString()}</span>
                                </motion.div>
                            ))}
                            {topLeaderboard.length === 0 && (
                                <p className="text-[10px] text-gray-500 italic text-center py-2">{strings.noCultivators}</p>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

const FeatureShowcase = ({ icon: Icon, title, desc, index }: { icon: LucideIcon, title: string, desc: string, index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="group relative p-1 pointer-events-none" // pointer-events-none to prevent hover issues on wrapper
        >
            <div className="pointer-events-auto relative h-full bg-black border border-white/10 rounded-2xl p-8 overflow-hidden hover:border-emerald-500/50 transition-colors duration-500">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 mb-6 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30 transition-all">
                        <Icon className="w-6 h-6 text-gray-300 group-hover:text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">{desc}</p>
                </div>
            </div>
        </motion.div>
    );
}

const Features = ({ strings }: { strings: LandingStrings }) => {
    const list = [
        { icon: Smartphone, title: strings.offlineFirstTitle, desc: strings.offlineFirstDesc },
        { icon: ShieldCheck, title: strings.reliefSupportTitle, desc: strings.reliefSupportDesc },
        { icon: Droplets, title: strings.precisionIrrigationTitle, desc: strings.precisionIrrigationDesc },
        { icon: BarChart3, title: strings.yieldAnalyticsTitle, desc: strings.yieldAnalyticsDesc },
    ];

    return (
        <section className="py-24 bg-[#020403]">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {list.map((item, i) => (
                        <FeatureShowcase key={i} {...item} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const StatsTicker = ({ strings }: { strings: LandingStrings }) => {
    return (
        <div className="border-y border-white/10 bg-white/[0.02] py-12 overflow-hidden">
            <div className="container mx-auto px-6 flex flex-wrap justify-between items-center gap-8">
                {[
                    { label: strings.acresMonitored, val: "1.2M+" },
                    { label: strings.dataPoints, val: "500M+" },
                    { label: strings.farmersEmpowered, val: "50k+" },
                    { label: strings.insectsIdentified, val: "20k+" },
                ].map((stat, i) => (
                    <div key={i} className="flex flex-col">
                        <span className="text-4xl md:text-5xl font-bold text-white tracking-tighter">{stat.val}</span>
                        <span className="text-emerald-500 text-sm font-mono uppercase tracking-widest mt-2">{stat.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

const CTA = ({ strings }: { strings: LandingStrings }) => {
    return (
        <section className="relative py-32 bg-[#020403] overflow-hidden text-center">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-emerald-900/20 blur-[100px] rounded-full transform scale-150 opacity-20" />

            <div className="container relative z-10 px-6">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter"
                >
                    {strings.readyToGrowPrefix} <span className="text-emerald-500">{strings.readyToGrowHighlight}</span>
                </motion.h2>
                <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-12">
                    {strings.ctaSubtitle}
                </p>
                <Link to="/login">
                    <Button className="h-16 px-12 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xl font-bold shadow-2xl shadow-emerald-500/20 hover:scale-105 transition-all">
                        {strings.getStartedNow} <ArrowUpRight className="ml-2 w-6 h-6" />
                    </Button>
                </Link>
            </div>
        </section>
    );
};

const Footer = ({ strings }: { strings: LandingStrings }) => (
    <footer className="bg-black py-12 border-t border-white/10 text-gray-500 text-sm">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-[8px] bg-[#10b981] flex items-center justify-center text-white shadow-lg shadow-emerald-500/10">
                        <Leaf className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <span className="font-bold text-white text-lg">AgriYield <span className="text-emerald-500">AI</span></span>
                </div>
                <p className="max-w-xs leading-relaxed">
                    {strings.footerDescription}
                </p>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">{strings.footerPlatform}</h4>
                <ul className="space-y-2">
                    <li><a href="#" className="hover:text-emerald-400">{strings.footerCropHealth}</a></li>
                    <li><a href="#" className="hover:text-emerald-400">{strings.footerCommunityExchange}</a></li>
                    <li><a href="#" className="hover:text-emerald-400">{strings.footerReliefSupport}</a></li>
                </ul>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">{strings.footerCompany}</h4>
                <ul className="space-y-2">
                    <li><a href="#" className="hover:text-emerald-400">{strings.footerAbout}</a></li>
                    <li><a href="#" className="hover:text-emerald-400">{strings.footerCareers}</a></li>
                    <li><a href="#" className="hover:text-emerald-400">{strings.footerContact}</a></li>
                </ul>
            </div>
        </div>
        <div className="container mx-auto px-6 mt-12 pt-8 border-t border-white/5 text-center md:text-left">
            {strings.footerRights}
        </div>
    </footer>
);

const Landing = () => {
    const { selectedLanguage, leaderboard } = useAppStore();
    const lang = selectedLanguage as LanguageCode;
    const common = translations[lang];
    const strings = landingTranslations[lang] ?? landingTranslations.en!;

    return (
        <div className="bg-black min-h-screen text-white font-sans selection:bg-emerald-500/30">
            <Navbar strings={strings} />
            <Hero strings={strings} />
            <StatsTicker strings={strings} />
            <BentoGrid strings={strings} common={common} leaderboard={leaderboard} />
            <Features strings={strings} />
            <CTA strings={strings} />
            <Footer strings={strings} />
        </div>
    );
};

export default Landing;
