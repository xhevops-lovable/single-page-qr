import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Download, QrCode as QrCodeIcon, Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [text, setText] = useState('');
  const [qrDataURL, setQrDataURL] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (text.trim()) {
      generateQR();
    } else {
      setQrDataURL('');
    }
  }, [text]);

  const generateQR = async () => {
    if (!text.trim()) return;
    
    setIsGenerating(true);
    try {
      const url = await QRCode.toDataURL(text, {
        width: 300,
        margin: 2,
        color: {
          dark: '#1e1b4b',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      });
      setQrDataURL(url);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate QR code. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQR = () => {
    if (!qrDataURL) return;
    
    const link = document.createElement('a');
    link.download = `qrcode-${Date.now()}.png`;
    link.href = qrDataURL;
    link.click();
    
    toast({
      title: 'Success!',
      description: 'QR code downloaded successfully.'
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="p-3 rounded-xl gradient-primary glow-primary">
              <QrCodeIcon className="w-8 h-8 text-primary-foreground" />
            </div>
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent mb-2">
            QR Code Generator
          </h1>
          <p className="text-muted-foreground text-lg">
            Transform any text into a beautiful QR code instantly
          </p>
        </div>

        {/* Main Card */}
        <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-2xl transition-smooth hover:shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Generate Your QR Code</CardTitle>
            <CardDescription>
              Enter any text, URL, or message below to create your QR code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Input Section */}
            <div className="space-y-2">
              <Label htmlFor="text-input" className="text-sm font-medium">
                Text to encode
              </Label>
              <Input
                id="text-input"
                type="text"
                placeholder="Enter text, URL, or message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="text-lg h-12 transition-smooth focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* QR Code Display */}
            {qrDataURL && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="relative group">
                    <div className="absolute -inset-1 gradient-primary rounded-xl blur opacity-25 group-hover:opacity-40 transition-smooth"></div>
                    <div className="relative bg-white p-4 rounded-xl">
                      <img
                        src={qrDataURL}
                        alt="Generated QR Code"
                        className="w-full max-w-xs transition-bounce hover:scale-105"
                      />
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                <div className="flex justify-center">
                  <Button
                    onClick={downloadQR}
                    className="gradient-primary hover:scale-105 transition-bounce text-lg px-8 py-3 glow-primary"
                    size="lg"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download PNG
                  </Button>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isGenerating && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}

            {/* Empty State */}
            {!text.trim() && !isGenerating && (
              <div className="text-center py-12 text-muted-foreground">
                <QrCodeIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Enter some text to generate a QR code</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Generate unlimited QR codes • Free to use • Instant download</p>
        </div>
      </div>
    </div>
  );
};

export default Index;