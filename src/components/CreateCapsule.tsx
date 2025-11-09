import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Lock, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useWallet } from "@/hooks/useWallet";
import { saveCapsule } from "@/lib/capsuleStorage";
import { TimeCapsule } from "@/types/capsule";

export const CreateCapsule = () => {
  const [message, setMessage] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const { address } = useWallet();

  const handleCreate = () => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!message || !unlockDate) {
      toast.error("Please fill in all fields");
      return;
    }

    const unlockDateTime = new Date(unlockDate);
    if (unlockDateTime <= new Date()) {
      toast.error("Unlock date must be in the future");
      return;
    }

    const capsule: TimeCapsule = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message,
      unlockDate,
      createdAt: new Date().toISOString(),
      walletAddress: address,
      isLocked: true,
    };

    saveCapsule(capsule);
    
    toast.success("Time capsule created and encrypted!", {
      description: `Will unlock on ${unlockDateTime.toLocaleDateString()}`,
    });
    
    setMessage("");
    setUnlockDate("");
    
    // Trigger a custom event to refresh the vault
    window.dispatchEvent(new Event("capsule-created"));
  };

  return (
    <section id="create" className="py-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Create Your <span className="text-primary">Time Capsule</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Encrypt your message and set when it should be revealed
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          <div className="space-y-6">
            <div>
              <Label htmlFor="message" className="text-lg mb-2 block">
                Your Secret Message
              </Label>
              <Textarea
                id="message"
                placeholder="Write your message to the future..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[200px] text-base bg-background border-border focus:border-primary resize-none"
              />
            </div>

            <div>
              <Label htmlFor="unlock-date" className="text-lg mb-2 block flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent" />
                Unlock Date
              </Label>
              <Input
                id="unlock-date"
                type="datetime-local"
                value={unlockDate}
                onChange={(e) => setUnlockDate(e.target.value)}
                className="text-base bg-background border-border focus:border-primary"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            <Button
              onClick={handleCreate}
              className="w-full py-6 text-lg font-semibold bg-primary hover:bg-primary/90 gap-2"
            >
              <Lock className="w-5 h-5" />
              Encrypt & Lock
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
