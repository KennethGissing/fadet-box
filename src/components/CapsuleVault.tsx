import { Clock, Unlock, Lock } from "lucide-react";
import { useState, useEffect } from "react";

interface Capsule {
  id: string;
  preview: string;
  unlockDate: Date;
  isLocked: boolean;
}

export const CapsuleVault = () => {
  const [capsules] = useState<Capsule[]>([
    {
      id: "1",
      preview: "My hopes and dreams for 2025...",
      unlockDate: new Date("2025-01-01T00:00:00"),
      isLocked: true,
    },
    {
      id: "2",
      preview: "Remember this moment forever...",
      unlockDate: new Date("2026-06-15T12:00:00"),
      isLocked: true,
    },
    {
      id: "3",
      preview: "To my future self: Don't forget...",
      unlockDate: new Date("2024-12-31T23:59:59"),
      isLocked: false,
    },
  ]);

  return (
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capsules.map((capsule) => (
            <CapsuleCard key={capsule.id} capsule={capsule} />
          ))}
        </div>
      </div>
    </section>
  );
};

const CapsuleCard = ({ capsule }: { capsule: Capsule }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = capsule.unlockDate.getTime() - now.getTime();

      if (difference <= 0) {
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
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [capsule.unlockDate]);

  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all hover:scale-105 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-2">
            {capsule.unlockDate.toLocaleDateString()}
          </p>
          <p className="text-foreground line-clamp-2">{capsule.preview}</p>
        </div>
        {capsule.isLocked ? (
          <Lock className="w-5 h-5 text-accent animate-glow-pulse" />
        ) : (
          <Unlock className="w-5 h-5 text-primary" />
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-accent" />
          <span className={`font-mono ${capsule.isLocked ? "text-accent animate-countdown-glow" : "text-primary"}`}>
            {timeLeft}
          </span>
        </div>
      </div>
    </div>
  );
};
