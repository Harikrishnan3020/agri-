
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore } from "@/store/useAppStore";
import { verifyProductImage } from "@/services/gemini";
import { createListing } from "@/services/marketplace";
import { toast } from "sonner";
import { Loader2, Camera, Upload, CheckCircle, AlertTriangle } from "lucide-react";
import type { MarketplaceListing } from "@/types/marketplace";

interface SellProductModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SellProductModal = ({ isOpen, onClose }: SellProductModalProps) => {
    const { addListing, user, updateUser, updateLeaderboard, t } = useAppStore();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<"details" | "verify" | "success">("details");

    // Form State
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [unit, setUnit] = useState("kg");
    const [category, setCategory] = useState("produce");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [description, setDescription] = useState("");

    // Verification Result
    const [verificationResult, setVerificationResult] = useState<{ verified: boolean, confidence: number, reasoning: string } | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleVerify = async () => {
        if (!title || !price || !imageFile) {
            toast.error(t.fillAllFieldsAndImage);
            return;
        }

        setLoading(true);
        try {
            const result = await verifyProductImage(imageFile, title);
            setVerificationResult(result);
            setStep("verify");

            if (result.verified) {
                toast.success(t.productVerifiedSuccess);
            } else {
                toast.warning(t.verificationUncertain);
            }
        } catch (error) {
            toast.error(t.verificationFailed);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!imagePreview) return;

        const newListing = {
            id: Date.now().toString(),
            title,
            seller: user?.name || "Farmer",
            price: parseFloat(price),
            unit,
            distance: "0.5km", // Mock distance for current user
            rating: 5.0, // New seller starts with high trust or add "New" badge logic later
            image: imagePreview,
            isVerified: verificationResult?.verified || false,
            deliveryAvailable: true,
            category: category as MarketplaceListing['category'],
            description
        };

        try {
            const created = await createListing(newListing);
            addListing(created);

            // Award +50 points for product listing
            const newScore = (user?.score || 0) + 50;
            updateUser({ score: newScore });
            updateLeaderboard(newScore);

            setStep("success");
            toast.success(t.productListedPoints);
        } catch (error) {
            toast.error(t.verificationFailed);
        }

        // Reset after delay
        setTimeout(() => {
            onClose();
            resetForm();
        }, 2000);
    };

    const resetForm = () => {
        setStep("details");
        setTitle("");
        setPrice("");
        setUnit("kg");
        setCategory("produce");
        setImageFile(null);
        setImagePreview(null);
        setVerificationResult(null);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md bg-zinc-900 border-emerald-500/20 text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-emerald-400">{t.shareWithCommunity}</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        {t.listProduceForExchange}
                    </DialogDescription>
                </DialogHeader>

                {step === "details" && (
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>{t.productName}</Label>
                            <Input
                                placeholder={t.egOrganicTomatoes}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="bg-black/20 border-white/10"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>{t.exchangeValue}</Label>
                                <Input
                                    type="number"
                                    placeholder="50"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="bg-black/20 border-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{t.unit}</Label>
                                <Select value={unit} onValueChange={setUnit}>
                                    <SelectTrigger className="bg-black/20 border-white/10">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                                        <SelectItem value="kg">{t.perKg}</SelectItem>
                                        <SelectItem value="ton">{t.perTon}</SelectItem>
                                        <SelectItem value="quintal">{t.perQuintal}</SelectItem>
                                        <SelectItem value="piece">{t.perPiece}</SelectItem>
                                        <SelectItem value="box">{t.perBox}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>{t.category}</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="bg-black/20 border-white/10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                                    <SelectItem value="produce">{t.freshProduce}</SelectItem>
                                    <SelectItem value="seeds">{t.seeds}</SelectItem>
                                    <SelectItem value="fertilizer">{t.fertilizer}</SelectItem>
                                    <SelectItem value="equipment">{t.equipment}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>{t.productImageRequired}</Label>
                            <div className="border-2 border-dashed border-emerald-500/30 rounded-xl p-4 text-center hover:bg-emerald-500/5 transition cursor-pointer relative overflow-hidden">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="h-32 w-full object-contain mx-auto rounded-md" />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-zinc-400">
                                        <Camera className="w-8 h-8 text-emerald-500" />
                                        <span className="text-sm">{t.clickToUploadPhoto}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {step === "verify" && verificationResult && (
                    <div className="py-4 space-y-4 text-center">
                        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 ${verificationResult.verified ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                            }`}>
                            {verificationResult.verified ? <CheckCircle className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                        </div>

                        <h3 className="text-lg font-bold text-white">
                            {verificationResult.verified ? t.productVerified : t.verificationWarning}
                        </h3>

                        <p className="text-sm text-zinc-300 bg-black/30 p-3 rounded-lg">
                            "{verificationResult.reasoning}"
                        </p>

                        <div className="text-xs text-zinc-500">
                            {t.confidenceLabel} {verificationResult.confidence}%
                        </div>

                        {!verificationResult.verified && (
                            <p className="text-xs text-amber-400/80">
                                {t.verifiedBadgeNote}
                            </p>
                        )}
                    </div>
                )}

                {step === "success" && (
                    <div className="py-8 text-center space-y-3">
                        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500 flex items-center justify-center mb-4 text-white animate-bounce">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">{t.listedSuccessfully}</h3>
                        <p className="text-zinc-400">{t.productVisibleInMarketplace}</p>
                    </div>
                )}

                <DialogFooter>
                    {step === "details" && (
                        <Button
                            onClick={handleVerify}
                            disabled={loading || !imageFile}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t.verifyListProduct}
                        </Button>
                    )}

                    {step === "verify" && (
                        <div className="flex gap-2 w-full">
                            <Button variant="outline" onClick={() => setStep("details")} className="flex-1 border-white/20 text-white hover:bg-white/10">
                                {t.editDetails}
                            </Button>
                            <Button onClick={handleSubmit} className="flex-1 bg-emerald-600 hover:bg-emerald-500">
                                {t.confirmListing}
                            </Button>
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
