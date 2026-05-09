import React, { useState } from "react";

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
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error("Share failed:", error);
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition font-medium text-sm whitespace-nowrap"
      title="Share this roadmap"
    >
      {copied ? "✓ Copied!" : "🔗 Share"}
    </button>
  );
};
