import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, History, BookOpen, Clock, Trash2, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const UserProfile = () => {
  const navigate = useNavigate();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [contentHistory, setContentHistory] = useState<any[]>([]);

  useEffect(() => {
    const history = localStorage.getItem("edapt_history");
    if (history) {
      setContentHistory(JSON.parse(history));
    }
  }, [isHistoryOpen]);

  const loadContent = (content: any) => {
    localStorage.setItem("edapt_current", JSON.stringify(content));
    setIsHistoryOpen(false);
    navigate("/learning");
    toast.success("Content loaded successfully!");
  };

  const deleteContent = (contentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedHistory = contentHistory.filter(item => item.id !== contentId);
    localStorage.setItem("edapt_history", JSON.stringify(updatedHistory));
    setContentHistory(updatedHistory);
    toast.success("Content removed from history");
  };

  const clearAllHistory = () => {
    localStorage.removeItem("edapt_history");
    localStorage.removeItem("edapt_current");
    setContentHistory([]);
    setIsHistoryOpen(false);
    toast.success("All content history cleared");
  };

  const groupedContent = contentHistory.reduce((groups: any, item) => {
    const subject = item.subject;
    if (!groups[subject]) {
      groups[subject] = [];
    }
    groups[subject].push(item);
    return groups;
  }, {});

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/01.png" alt="User" />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Student</p>
              <p className="text-xs leading-none text-muted-foreground">
                Learning with Edapt
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsHistoryOpen(true)}>
            <History className="mr-2 h-4 w-4" />
            <span>Learning History</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/")}>
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Upload New Content</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Learning History</DialogTitle>
              {contentHistory.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearAllHistory}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {contentHistory.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Learning History</h3>
                <p className="text-muted-foreground mb-4">
                  Start your learning journey by uploading your first content
                </p>
                <Button onClick={() => {
                  setIsHistoryOpen(false);
                  navigate("/");
                }}>
                  Upload Content
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold">{contentHistory.length}</div>
                      <div className="text-sm text-muted-foreground">Total Sessions</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold">
                        {Object.keys(groupedContent).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Subjects</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold">
                        {contentHistory.filter(item => 
                          new Date(item.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                        ).length}
                      </div>
                      <div className="text-sm text-muted-foreground">This Week</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Content by Subject */}
                {Object.entries(groupedContent).map(([subject, contents]: [string, any]) => (
                  <div key={subject}>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      {subject}
                      <Badge variant="secondary">{contents.length} items</Badge>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {contents.map((item: any) => (
                        <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1" onClick={() => loadContent(item)}>
                                <CardTitle className="text-base">{item.title}</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {item.chapter}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => deleteContent(item.id, e)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0" onClick={() => loadContent(item)}>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              {new Date(item.createdAt).toLocaleDateString()}
                            </div>
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {item.content.substring(0, 120)}...
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};