import { Button } from "@/components/ui/button";
import { Wallet, LogOut } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";

export const Header = () => {
  const { address, isConnecting, connectWallet, disconnectWallet, formatAddress } = useWallet();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-background rounded-full" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            FHE Time Capsule
          </span>
        </div>
        
        {address ? (
          <div className="flex items-center gap-2">
            <div className="px-3 py-2 rounded-lg bg-primary/10 border border-primary/30">
              <span className="text-sm font-mono text-primary">{formatAddress(address)}</span>
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={disconnectWallet}
              className="border-primary/50 hover:bg-primary/10 hover:border-primary"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button 
            variant="outline" 
            className="gap-2 border-primary/50 hover:bg-primary/10 hover:border-primary"
            onClick={connectWallet}
            disabled={isConnecting}
          >
            <Wallet className="w-4 h-4" />
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        )}
      </div>
    </header>
  );
};
