import { Clock, Unlock, Lock, Trash2, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { useWallet } from "@/hooks/useWallet";
import { getCapsulesByWallet, deleteCapsule } from "@/lib/capsuleStorage";
import { TimeCapsule } from "@/types/capsule";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const CapsuleVault = () => {
  const { address } = useWallet();
  const [capsules, setCapsules] = useState<TimeCapsule[]>([]);
  const [selectedCapsule, setSelectedCapsule] = useState<TimeCapsule | null>(null);

  const loadCapsules = () => {
    if (address) {
      const userCapsules = getCapsulesByWallet(address);
      setCapsules(userCapsules);
    } else {
      setCapsules([]);
    }
  };

  useEffect(() => {
    loadCapsules();
    
    const handleCapsuleCreated = () => {
      loadCapsules();
    };
    
    window.addEventListener("capsule-created", handleCapsuleCreated);
    return () => window.removeEventListener("capsule-created", handleCapsuleCreated);
  }, [address]);

  const handleDelete = (id: string) => {
    deleteCapsule(id);
    loadCapsules();
    toast.success("Time capsule deleted");
  };

  const handleView = (capsule: TimeCapsule) => {
    const now = new Date();
    const unlockDate = new Date(capsule.unlockDate);
    
    if (now >= unlockDate) {
      setSelectedCapsule(capsule);
    } else {
      toast.error("This capsule is still locked!");
    }
  };

  return (
    <>
      <section id="vault" className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Your <span className="text-accent">Vault</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Encrypted time capsules waiting to be unlocked
            </p>
          </div>

          {!address ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Connect your wallet to view your time capsules
              </p>
            </div>
          ) : capsules.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No time capsules yet. Create your first one above!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {capsules.map((capsule) => (
                <CapsuleCard 
                  key={capsule.id} 
                  capsule={capsule}
                  onDelete={handleDelete}
                  onView={handleView}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Dialog open={!!selectedCapsule} onOpenChange={() => setSelectedCapsule(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Time Capsule Unlocked! 🎉</DialogTitle>
            <DialogDescription>
              Created on {selectedCapsule && new Date(selectedCapsule.createdAt).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 p-6 bg-secondary/30 rounded-lg">
            <p className="text-foreground whitespace-pre-wrap">{selectedCapsule?.message}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface CapsuleCardProps {
  capsule: TimeCapsule;
  onDelete: (id: string) => void;
  onView: (capsule: TimeCapsule) => void;
}

const CapsuleCard = ({ capsule, onDelete, onView }: CapsuleCardProps) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const unlockDate = new Date(capsule.unlockDate);
      const difference = unlockDate.getTime() - now.getTime();

      if (difference <= 0) {
        setIsUnlocked(true);
        return "Ready to unlock!";
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);

      return `${days}d ${hours}h ${minutes}m`;
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000);

    return () => clearInterval(interval);
  }, [capsule.unlockDate]);

  const preview = capsule.message.length > 50 
    ? capsule.message.substring(0, 50) + "..." 
    : capsule.message;

  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all hover:scale-105 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-2">
            {new Date(capsule.unlockDate).toLocaleDateString()}
          </p>
          <p className="text-foreground line-clamp-2">{preview}</p>
        </div>
        {isUnlocked ? (
          <Unlock className="w-5 h-5 text-primary" />
        ) : (
          <Lock className="w-5 h-5 text-accent animate-glow-pulse" />
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-accent" />
            <span className={`font-mono ${!isUnlocked ? "text-accent animate-countdown-glow" : "text-primary"}`}>
              {timeLeft}
            </span>
          </div>
          <div className="flex gap-2">
            {isUnlocked && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onView(capsule)}
                className="h-8 w-8 hover:bg-primary/10"
              >
                <Eye className="w-4 h-4" />
              </Button>
            )}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(capsule.id)}
              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
