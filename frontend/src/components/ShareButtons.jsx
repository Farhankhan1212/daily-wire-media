import { FiFacebook, FiTwitter, FiLinkedin, FiLink } from "react-icons/fi";
import { useState } from "react";

const ShareButtons = ({ title, url }) => {
  const [copied, setCopied] = useState(false);
  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${url}` : url;

  const links = [
    { icon: FiFacebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}` },
    { icon: FiTwitter, href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}` },
    { icon: FiLinkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}` },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="dateline mr-1">Share</span>
      {links.map(({ icon: Icon, href }, i) => (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 border border-ink/15 dark:border-paper/15 rounded-full hover:border-crimson hover:text-crimson transition-colors"
        >
          <Icon size={15} />
        </a>
      ))}
      <button
        onClick={handleCopy}
        className="p-2 border border-ink/15 dark:border-paper/15 rounded-full hover:border-crimson hover:text-crimson transition-colors"
        aria-label="Copy link"
      >
        <FiLink size={15} />
      </button>
      {copied && <span className="text-xs text-crimson">Copied!</span>}
    </div>
  );
};

export default ShareButtons;
