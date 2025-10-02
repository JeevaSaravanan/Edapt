import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/Edapt/Header";
import { Upload, FileText, Sparkles, BookOpen } from "lucide-react";
import { toast } from "sonner";

const UploadPage = () => {
  const navigate = useNavigate();
  const [textContent, setTextContent] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [title, setTitle] = useState("");

  const sampleContent = `Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water. This process generally involves the green pigment chlorophyll and generates oxygen as a by-product.

The process of photosynthesis can be divided into two main stages: the light-dependent reactions and the light-independent reactions (Calvin cycle). During light-dependent reactions, chlorophyll absorbs light energy and converts it into chemical energy in the form of ATP and NADPH. These reactions take place in the thylakoids of chloroplasts.

The Calvin cycle, also known as the dark reactions, occurs in the stroma of chloroplasts. Here, CO2 is fixed into organic molecules using the ATP and NADPH produced in the light reactions. The end product is glucose, which can be used by the plant for energy or stored as starch.

Photosynthesis is crucial for life on Earth as it produces the oxygen we breathe and forms the base of most food chains. It also helps regulate atmospheric CO2 levels, playing a vital role in climate regulation.`;

  const handleSubmit = (content: string) => {
    if (!content.trim() || !subject.trim() || !chapter.trim() || !title.trim()) {
      toast.error("Please fill in all fields and add content");
      return;
    }

    // Save to localStorage (dummy data storage)
    const contentData = {
      id: Date.now().toString(),
      title,
      subject,
      chapter,
      content,
      createdAt: new Date().toISOString()
    };

    const existingHistory = JSON.parse(localStorage.getItem("edapt_history") || "[]");
    localStorage.setItem("edapt_history", JSON.stringify([contentData, ...existingHistory]));
    localStorage.setItem("edapt_current", JSON.stringify(contentData));

    toast.success("Content uploaded successfully!");
    navigate("/learning");
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setTextContent(content);
        toast.success("Text file uploaded successfully!");
      };
      reader.readAsText(file);
    } else if (file.type === "application/pdf") {
      toast.info("Processing PDF file...");
      try {
        // Create a temporary file path for the PDF
        const formData = new FormData();
        formData.append('file', file);
        
        // For now, we'll simulate PDF text extraction
        // In a real app, you'd use a PDF parsing library or backend service
        const reader = new FileReader();
        reader.onload = (e) => {
          // Placeholder: In production, use proper PDF parsing
          toast.success("PDF uploaded! Note: Full PDF parsing requires backend integration.");
          setTextContent("PDF content will be extracted here. For now, please use the paste text option or upload a .txt file.");
        };
        reader.readAsArrayBuffer(file);
      } catch (error) {
        toast.error("Failed to process PDF file");
      }
    } else {
      toast.error("Please upload a valid text or PDF file");
    }
  };

  const useSample = () => {
    setTextContent(sampleContent);
    setSubject("Biology");
    setChapter("Chapter 3");
    setTitle("Photosynthesis Process");
    toast.success("Sample content loaded!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Upload Your Learning Content
            </h1>
            <p className="text-xl text-muted-foreground">
              Transform your textbook content into interactive visual learning experiences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Content Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Content Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Photosynthesis Process"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Biology"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="chapter">Chapter</Label>
                  <Input
                    id="chapter"
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    placeholder="e.g., Chapter 3"
                  />
                </div>

                <Button onClick={useSample} variant="outline" className="w-full">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Use Sample Data
                </Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Upload Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="text" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text">Paste Text</TabsTrigger>
                    <TabsTrigger value="file">Upload File</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="text" className="space-y-4">
                    <Textarea
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      placeholder="Paste your textbook content here..."
                      className="min-h-[300px] resize-none"
                    />
                  </TabsContent>
                  
                  <TabsContent value="file" className="space-y-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <Label htmlFor="file-upload" className="cursor-pointer">
                        <span className="text-lg font-medium text-foreground">
                          Click to upload a file
                        </span>
                        <p className="text-sm text-muted-foreground mt-2">
                          Supports .txt and .pdf files up to 10MB
                        </p>
                      </Label>
                      <Input
                        id="file-upload"
                        type="file"
                        accept=".txt,.pdf,application/pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                    {textContent && (
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          File content loaded ({textContent.length} characters)
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
                
                <Button 
                  onClick={() => handleSubmit(textContent)} 
                  className="w-full mt-4"
                  disabled={!textContent.trim() || !subject.trim() || !chapter.trim() || !title.trim()}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start Learning Journey
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-card rounded-lg border shadow-soft">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Easy Upload</h3>
              <p className="text-sm text-muted-foreground">
                Upload PDF or text files, or paste content directly from your textbooks.
              </p>
            </div>
            
            <div className="p-6 bg-card rounded-lg border shadow-soft">
              <div className="w-12 h-12 bg-gradient-learning rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">AI Processing</h3>
              <p className="text-sm text-muted-foreground">
                Advanced AI transforms your content into interactive learning materials.
              </p>
            </div>
            
            <div className="p-6 bg-card rounded-lg border shadow-soft">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Visual Learning</h3>
              <p className="text-sm text-muted-foreground">
                Experience your content through mindmaps and interactive visualizations.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadPage;