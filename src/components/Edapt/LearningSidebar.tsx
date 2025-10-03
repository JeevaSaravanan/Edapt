import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Clock, ChevronRight, Plus } from "lucide-react";

export function LearningSidebar() {
  const navigate = useNavigate();
  const [currentContent, setCurrentContent] = useState<any>(null);
  const [contentHistory, setContentHistory] = useState<any[]>([]);

  useEffect(() => {
    const current = localStorage.getItem("edapt_current");
    const history = localStorage.getItem("edapt_history");
    
    if (current) {
      setCurrentContent(JSON.parse(current));
    }
    if (history) {
      setContentHistory(JSON.parse(history));
    }
  }, []);

  const loadContent = (content: any) => {
    localStorage.setItem("edapt_current", JSON.stringify(content));
    setCurrentContent(content);
    window.location.reload(); // Simple refresh to update the learning page
  };

  const addNewContent = () => {
    // Clear current content to show empty state
    localStorage.removeItem("edapt_current");
    setCurrentContent(null);
    window.location.reload();
  };

  return (
    <Sidebar className="w-80 border-r border-border">
      <SidebarHeader className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Learning Dashboard</h2>
          <SidebarTrigger />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Current Content */}
        {currentContent && (
          <SidebarGroup>
            <SidebarGroupLabel>Current Session</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">{currentContent.query || currentContent.title}</h3>
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    Active
                  </Badge>
                </div>
                <Progress value={75} className="h-2 mb-2" />
                <div className="text-xs text-muted-foreground">
                  Progress: Content Generated
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Learning History */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            Content Library
            <Button variant="ghost" size="sm" onClick={addNewContent}>
              <Plus className="w-4 h-4" />
            </Button>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentHistory.length === 0 ? (
                <div className="p-4 text-center">
                  <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No learning sessions yet
                  </p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={addNewContent}>
                    Start New Session
                  </Button>
                </div>
              ) : (
                contentHistory.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => loadContent(item)}
                      className={`w-full justify-start p-3 h-auto ${
                        currentContent?.id === item.id ? "bg-primary/10 text-primary" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-white" />
                          </div>
                        </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-medium truncate">{item.query || item.title}</h4>
                              <ChevronRight className="w-3 h-3 text-muted-foreground" />
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {new Date(item.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Study Statistics */}
        <SidebarGroup>
          <SidebarGroupLabel>Study Statistics</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-3 p-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Sessions:</span>
                <span className="font-medium">{contentHistory.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">This Week:</span>
                <span className="font-medium">
                  {contentHistory.filter(item => 
                    new Date(item.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  ).length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Queries:</span>
                <span className="font-medium">
                  {contentHistory.filter(item => item.query).length}
                </span>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}