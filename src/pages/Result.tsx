import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const image = state?.image as string | undefined;
  const button = state?.button as string | undefined;

  if (!image) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">No photo captured.</p>
          <Button variant="default" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Go back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 py-10">
      <Button
        variant="ghost"
        className="self-start"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="rounded-xl overflow-hidden border shadow-lg max-w-md w-full">
        <img src={image} alt="Captured" className="w-full object-cover" />
      </div>

      <div className="bg-card border rounded-lg px-6 py-4 text-center shadow-sm">
        <p className="text-muted-foreground text-sm">Captured via</p>
        <p className="text-2xl font-bold mt-1">{button}</p>
      </div>
    </div>
  );
};

export default Result;
