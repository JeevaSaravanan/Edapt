import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, FileText, Upload } from "lucide-react";
import { toast } from "sonner";

interface TextbookInputProps {
  onContentSubmit: (content: string) => void;
}

export const TextbookInput = ({ onContentSubmit }: TextbookInputProps) => {
  const [content, setContent] = useState(
    `Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water. This process generally involves the green pigment chlorophyll and generates oxygen as a by-product.

The process of photosynthesis can be divided into two main stages: the light-dependent reactions and the light-independent reactions (Calvin cycle). During light-dependent reactions, chlorophyll absorbs light energy and converts it into chemical energy in the form of ATP and NADPH. These reactions take place in the thylakoids of chloroplasts.

The Calvin cycle, also known as the dark reactions, occurs in the stroma of chloroplasts. Here, CO2 is fixed into organic molecules using the ATP and NADPH produced in the light reactions. The end product is glucose, which can be used by the plant for energy or stored as starch.

Photosynthesis is crucial for life on Earth as it produces the oxygen we breathe and forms the base of most food chains. It also helps regulate atmospheric CO2 levels, playing a vital role in climate regulation.`
  );

  const handleSubmit = () => {
    if (content.trim()) {
      onContentSubmit(content);
      toast.success("Content processed! Generating mindmap...");
    } else {
      toast.error("Please enter some textbook content first.");
    }
  };

  const handleSampleContent = () => {
    onContentSubmit(content);
    toast.success("Sample content loaded! Generating mindmap...");
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="w-5 h-5 text-primary" />
          Textbook Content
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste your textbook content here..."
          className="min-h-[300px] resize-none"
        />
        
        <div className="flex gap-2">
          <Button onClick={handleSubmit} className="flex-1">
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Mindmap
          </Button>
          <Button variant="outline" onClick={handleSampleContent}>
            <Upload className="w-4 h-4 mr-2" />
            Use Sample
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p className="font-medium mb-1">Tips for better results:</p>
          <ul className="space-y-1 text-xs">
            <li>• Include chapter titles and section headers</li>
            <li>• Break down complex concepts into paragraphs</li>
            <li>• Include key terms and definitions</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};