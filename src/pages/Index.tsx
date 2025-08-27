import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download, QrCode as QrCodeIcon } from 'lucide-react';
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
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent mb-2">
            QR Code Generator
          </h1>
        </div>

        <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-2xl transition-smooth hover:shadow-xl">
          <CardHeader>
            <Input
              id="text-input"
              type="text"
              placeholder="Enter text, URL, or message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="text-lg h-12 transition-smooth focus:ring-2 focus:ring-primary/50"
            />
          </ CardHeader>
          <CardContent className="space-y-6">

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

            {isGenerating && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;