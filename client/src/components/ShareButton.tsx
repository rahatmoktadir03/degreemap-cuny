import React, { useState } from "react";
import { Share2, Check } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";

interface ShareButtonProps {
  roadmapId: string;
  roadmapTitle: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ roadmapId, roadmapTitle }) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/roadmap/public/${roadmapId}`;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        // Use native share if available
        await navigator.share({
          title: roadmapTitle,
          text: `Check out my ${roadmapTitle} roadmap created on DegreeMap!`,
          url: shareUrl,
        });
        toast.success("Roadmap shared successfully!");
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error("Share failed:", error);
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error("Failed to share or copy link");
      }
    }
  };

  return (
    <Button
      onClick={handleShare}
      variant="default"
      size="sm"
      className="gap-2"
      title="Share this roadmap"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Copied!
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          Share
        </>
      )}
    </Button>
  );
};
