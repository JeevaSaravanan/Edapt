import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Edapt/Header";
import { Brain, Volume2, Video, ArrowRight } from "lucide-react";

const UploadPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Transform Learning with AI
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Ask any question and get interactive mindmaps, audio explanations, and animated videos
            </p>
            <Button size="lg" onClick={() => navigate("/learning")} className="text-lg px-8 py-6">
              Start Learning
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-card rounded-lg border shadow-soft">
              <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Interactive Mindmaps</h3>
              <p className="text-muted-foreground">
                Visualize complex concepts with AI-generated mindmaps that make learning intuitive and engaging.
              </p>
            </div>
            
            <div className="p-8 bg-card rounded-lg border shadow-soft">
              <div className="w-16 h-16 bg-gradient-learning rounded-lg flex items-center justify-center mb-6">
                <Volume2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Audio Explanations</h3>
              <p className="text-muted-foreground">
                Listen to AI-narrated explanations with customizable speed and voice for auditory learning.
              </p>
            </div>
            
            <div className="p-8 bg-card rounded-lg border shadow-soft">
              <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-6">
                <Video className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Animated Videos</h3>
              <p className="text-muted-foreground">
                Watch beautifully animated explanations that bring abstract concepts to life visually.
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold mb-8">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="font-semibold mb-2">Ask Your Question</h3>
                <p className="text-sm text-muted-foreground">
                  Enter any topic or question you want to learn about
                </p>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-semibold mb-2">AI Processing</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI analyzes and creates visual learning materials
                </p>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-semibold mb-2">Interactive Learning</h3>
                <p className="text-sm text-muted-foreground">
                  Explore mindmaps, listen to audio, or watch animations
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadPage;