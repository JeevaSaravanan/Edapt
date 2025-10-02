import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/components/Edapt/UserProfile";
import { Brain, BookOpen, Lightbulb } from "lucide-react";

export const Header = () => {
  const location = useLocation();
  const [currentContent, setCurrentContent] = useState<any>(null);

  useEffect(() => {
    const current = localStorage.getItem("edapt_current");
    if (current) {
      setCurrentContent(JSON.parse(current));
    }
  }, [location]);

  return (
    <header className="bg-card border-b border-border shadow-soft">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Edapt</h1>
              <p className="text-sm text-muted-foreground">AI-Powered Visual Learning</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {currentContent && (
              <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  {currentContent.subject} • {currentContent.chapter}
                </span>
              </div>
            )}
            <Button variant="outline" size="sm">
              <Lightbulb className="w-4 h-4 mr-2" />
              Get AI Help
            </Button>
            <UserProfile />
          </div>
        </div>
      </div>
    </header>
  );
};