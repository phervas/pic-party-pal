import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

const buttons = [
  { id: 1, label: "Button A", variant: "default" as const },
  { id: 2, label: "Button B", variant: "secondary" as const },
  { id: 3, label: "Button C", variant: "accent" as const },
];

const Index = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeButtonRef = useRef<string>("");

  const handleCapture = (buttonLabel: string) => {
    activeButtonRef.current = buttonLabel;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      navigate("/result", {
        state: { image: dataUrl, button: activeButtonRef.current },
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-6">
      <h1 className="text-3xl font-bold tracking-tight">Take a Photo</h1>
      <p className="text-muted-foreground text-center max-w-xs">
        Choose a button to open the camera, snap a photo, and see the result.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        {buttons.map((btn) => (
          <Button
            key={btn.id}
            variant={btn.variant}
            size="lg"
            className="w-full gap-2 text-lg h-14"
            onClick={() => handleCapture(btn.label)}
          >
            <Camera className="h-5 w-5" />
            {btn.label}
          </Button>
        ))}
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

export default Index;
