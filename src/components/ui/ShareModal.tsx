import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Share2, Facebook, Linkedin, Send, Copy, Check, X } from 'lucide-react';

interface ShareModalProps {
  title: string;
  url: string;
  children: React.ReactNode;
}

export function ShareModal({ title, url, children }: ShareModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
  };


  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const handleSocialShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {children}
      </div>
      
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div 
            className="absolute inset-0" 
            onClick={handleOverlayClick}
          />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Share this article
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Social Media Buttons */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Share on Social Media</Label>
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    onClick={() => handleSocialShare('facebook')}
                    variant="outline"
                    className="flex items-center justify-center gap-2 w-full"
                  >
                    <Facebook className="h-4 w-4 text-blue-600" />
                    Facebook
                  </Button>
                  
                  <Button
                    onClick={() => handleSocialShare('linkedin')}
                    variant="outline"
                    className="flex items-center justify-center gap-2 w-full"
                  >
                    <Linkedin className="h-4 w-4 text-blue-700" />
                    LinkedIn
                  </Button>
                  
                  <Button
                    onClick={() => handleSocialShare('telegram')}
                    variant="outline"
                    className="flex items-center justify-center gap-2 w-full"
                  >
                    <Send className="h-4 w-4 text-blue-500" />
                    Telegram
                  </Button>
                </div>
              </div>

              {/* Copy Link Section */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Copy Link</Label>
                <div className="flex gap-2">
                  <Input
                    value={url}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    size="sm"
                    className="px-3"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {copied && (
                  <p className="text-sm text-green-600">Link copied to clipboard!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
