import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, X, ImageIcon, Camera } from "lucide-react";

interface ChatMessage {
  id: number;
  text: string;
  image?: string;
}

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const buttonLabel = (state?.button as string) || "";
  const autoCapture = state?.autoCapture as boolean;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState(buttonLabel);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showCapturePrompt, setShowCapturePrompt] = useState(!!autoCapture);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleCapturePromptClick = () => {
    setShowCapturePrompt(false);
    fileInputRef.current?.click();
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setCapturedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSend = () => {
    if (!inputText.trim() && !capturedImage) return;
    const newMessage: ChatMessage = {
      id: Date.now(),
      text: inputText.trim(),
      image: capturedImage || undefined,
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
    setCapturedImage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = inputText.trim().length > 0 || !!capturedImage;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-border px-4 py-3 bg-card">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Chat</h1>
      </header>

      {/* Full-screen capture prompt overlay */}
      {showCapturePrompt && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm cursor-pointer"
          onClick={handleCapturePromptClick}
        >
          <div className="rounded-full bg-primary p-6 mb-6 shadow-lg">
            <Camera className="h-12 w-12 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Tap to capture</h2>
          <p className="text-muted-foreground text-sm">Tap anywhere to open your camera</p>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <p className="text-center text-muted-foreground text-sm pt-12">
            Capture a photo and send it here.
          </p>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className="flex justify-end">
            <div className="max-w-[75%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-primary-foreground shadow-sm space-y-2">
              {msg.image && (
                <img
                  src={msg.image}
                  alt="Captured"
                  className="rounded-lg max-h-48 w-auto object-cover"
                />
              )}
              {msg.text && <p className="text-sm">{msg.text}</p>}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer box */}
      <div className="px-3 pb-3 pt-2">
        <div className="rounded-2xl border border-border bg-muted/40 shadow-sm">
          {/* Thumbnail + text area */}
          <div className="px-3 pt-3 pb-2">
            {capturedImage && (
              <div className="relative inline-block mb-2">
                <img
                  src={capturedImage}
                  alt="Preview"
                  className="h-14 w-14 rounded-lg object-cover border border-border shadow-sm"
                />
                <button
                  onClick={() => setCapturedImage(null)}
                  className="absolute -top-2 -right-2 rounded-full bg-destructive text-destructive-foreground p-0.5 shadow-md"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message…"
              rows={1}
              className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between px-3 pb-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
            </Button>

            <Button
              size="icon"
              className="h-8 w-8 shrink-0 rounded-full"
              disabled={!canSend}
              onClick={handleSend}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default Result;
