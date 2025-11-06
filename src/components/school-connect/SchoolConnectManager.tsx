import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, Image, Video, FileText, Link as LinkIcon, Heart, MessageCircle, 
  Share2, Flag, Pin, Eye, ThumbsUp, Send, Calendar, Users, Globe, Lock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Post {
  id: string;
  author: string;
  authorRole: string;
  authorAvatar?: string;
  content: string;
  mediaType?: "image" | "video" | "document" | "link";
  mediaUrl?: string;
  visibility: "public" | "class" | "group" | "private";
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isPinned?: boolean;
  isScheduled?: boolean;
  scheduledDate?: string;
  tags?: string[];
}

interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

const SchoolConnectManager = () => {
  const { toast } = useToast();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});

  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: "Principal Kumar",
      authorRole: "Principal",
      content: "Welcome to the new academic year! We're excited to begin this journey together. Please review the updated curriculum and reach out if you have any questions.",
      visibility: "public",
      timestamp: "2025-01-10T09:00:00Z",
      likes: 45,
      comments: 12,
      shares: 8,
      isPinned: true,
      tags: ["announcement", "academic-year"]
    },
    {
      id: "2",
      author: "Mrs. Sharma",
      authorRole: "Teacher",
      content: "Great work by Class 10-A on the science project! Photos from the presentation attached.",
      mediaType: "image",
      mediaUrl: "/placeholder.svg",
      visibility: "class",
      timestamp: "2025-01-09T14:30:00Z",
      likes: 28,
      comments: 6,
      shares: 2,
      tags: ["class-10a", "science"]
    }
  ]);

  const [comments, setComments] = useState<Comment[]>([
    {
      id: "c1",
      postId: "1",
      author: "Mr. Verma",
      content: "Looking forward to a great year!",
      timestamp: "2025-01-10T10:15:00Z",
      likes: 5,
      replies: [
        {
          id: "c1-r1",
          postId: "1",
          author: "Principal Kumar",
          content: "Thank you! Let's make it count.",
          timestamp: "2025-01-10T11:00:00Z",
          likes: 2,
          replies: []
        }
      ]
    }
  ]);

  const handleCommentInput = (postId: string, value: string) => {
    setCommentInputs(inputs => ({ ...inputs, [postId]: value }));
  };

  const handleAddComment = (postId: string) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;
    const newComment: Comment = {
      id: `c${Date.now()}`,
      postId,
      author: "You",
      content,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: []
    };
    setComments(prev => [newComment, ...prev]);
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments + 1 } : p));
    setCommentInputs(inputs => ({ ...inputs, [postId]: "" }));
    toast({ description: "Comment posted!" });
  };

  const handleCreatePost = () => {
    toast({
      title: "Post Created",
      description: "Your post has been published to the feed.",
    });
    setShowCreatePost(false);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
    toast({ description: "Post liked!" });
  };

  const handlePin = (postId: string) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, isPinned: !p.isPinned } : p));
    toast({ description: "Post pinned status updated" });
  };

  const handleReport = (postId: string) => {
    toast({
      title: "Post Reported",
      description: "This post has been flagged for review by moderators.",
      variant: "destructive"
    });
  };

  const visibilityIcons = {
    public: <Globe className="h-3 w-3" />,
    class: <Users className="h-3 w-3" />,
    group: <Users className="h-3 w-3" />,
    private: <Lock className="h-3 w-3" />
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">School Connect</h1>
          <p className="text-muted-foreground">Community feed and discussions</p>
        </div>
        <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Content</Label>
                <Textarea 
                  placeholder="What would you like to share with the community?"
                  className="min-h-[120px]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Visibility</Label>
                  <Select defaultValue="public">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Public (Everyone)
                        </div>
                      </SelectItem>
                      <SelectItem value="class">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Class Only
                        </div>
                      </SelectItem>
                      <SelectItem value="group">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Teachers Only
                        </div>
                      </SelectItem>
                      <SelectItem value="private">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Private
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Post Type</Label>
                  <Select defaultValue="text">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text Only</SelectItem>
                      <SelectItem value="image">With Image</SelectItem>
                      <SelectItem value="video">With Video</SelectItem>
                      <SelectItem value="document">With Document</SelectItem>
                      <SelectItem value="link">With Link</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Tags (comma separated)</Label>
                <Input placeholder="e.g., announcement, sports, academics" />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="schedule" className="rounded" />
                <Label htmlFor="schedule" className="cursor-pointer">Schedule for later</Label>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Image className="h-4 w-4 mr-2" />
                  Add Media
                </Button>
                <Button variant="outline" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  Add Document
                </Button>
              </div>

              <Button className="w-full" onClick={handleCreatePost}>
                <Send className="h-4 w-4 mr-2" />
                Publish Post
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="feed" className="space-y-4">
        <TabsList>
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="pinned">Pinned</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-4">
          {posts
            .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
            .map((post) => (
              <Card key={post.id} className={post.isPinned ? "border-primary" : ""}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Post Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={post.authorAvatar} />
                          <AvatarFallback>{post.author[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{post.author}</p>
                            <Badge variant="secondary" className="text-xs">
                              {post.authorRole}
                            </Badge>
                            {post.isPinned && (
                              <Pin className="h-3 w-3 text-primary fill-primary" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              {visibilityIcons[post.visibility]}
                              <span className="capitalize">{post.visibility}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleReport(post.id)}>
                        <Flag className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Post Content */}
                    <p className="text-sm leading-relaxed">{post.content}</p>

                    {/* Media Preview */}
                    {post.mediaType === "image" && post.mediaUrl && (
                      <div className="rounded-lg overflow-hidden border">
                        <img 
                          src={post.mediaUrl} 
                          alt="Post media" 
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    )}

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <Separator />

                    {/* Post Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-6">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleLike(post.id)}
                          className="gap-2"
                        >
                          <Heart className="h-4 w-4" />
                          <span>{post.likes}</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedPost(post)}
                          className="gap-2"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>{comments.filter(c => c.postId === post.id).length}</span>
                        </Button>

                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handlePin(post.id)}
                      >
                        <Pin className={`h-4 w-4 ${post.isPinned ? 'fill-primary text-primary' : ''}`} />
                      </Button>
                    </div>

                    {/* Add Comment Input */}
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        placeholder="Write a comment..."
                        value={commentInputs[post.id] || ""}
                        onChange={e => handleCommentInput(post.id, e.target.value)}
                        className="flex-1"
                        onKeyDown={e => { if (e.key === 'Enter') handleAddComment(post.id); }}
                      />
                      <Button size="sm" onClick={() => handleAddComment(post.id)}>
                        Post
                      </Button>
                    </div>

                    {/* Comments Preview */}
                    {comments.filter(c => c.postId === post.id).length > 0 && (
                      <div className="pt-4 border-t space-y-3">
                        {comments
                          .filter(c => c.postId === post.id)
                          .slice(0, 2)
                          .map((comment) => (
                            <div key={comment.id} className="space-y-2">
                              <div className="flex items-start gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="text-xs">
                                    {comment.author[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 bg-muted rounded-lg p-3">
                                  <p className="font-semibold text-sm">{comment.author}</p>
                                  <p className="text-sm mt-1">{comment.content}</p>
                                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                    <button className="hover:text-primary flex items-center gap-1">
                                      <ThumbsUp className="h-3 w-3" />
                                      {comment.likes}
                                    </button>
                                    <button className="hover:text-primary">Reply</button>
                                    <span>{new Date(comment.timestamp).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                              {/* Nested Replies */}
                              {comment.replies && comment.replies.map((reply) => (
                                <div key={reply.id} className="ml-10 flex items-start gap-2">
                                  <Avatar className="h-7 w-7">
                                    <AvatarFallback className="text-xs">
                                      {reply.author[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 bg-muted/60 rounded-lg p-2">
                                    <p className="font-semibold text-xs">{reply.author}</p>
                                    <p className="text-xs mt-1">{reply.content}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        <Dialog open={selectedPost?.id === post.id} onOpenChange={open => setSelectedPost(open ? post : null)}>
                          <DialogTrigger asChild>
                            <Button variant="link" size="sm" className="pl-0">
                              View all {comments.filter(c => c.postId === post.id).length} comments
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Comments</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                              {comments.filter(c => c.postId === post.id).length === 0 && (
                                <p className="text-muted-foreground text-center">No comments yet.</p>
                              )}
                              {comments
                                .filter(c => c.postId === post.id)
                                .map((comment) => (
                                  <div key={comment.id} className="space-y-2">
                                    <div className="flex items-start gap-2">
                                      <Avatar className="h-8 w-8">
                                        <AvatarFallback className="text-xs">
                                          {comment.author[0]}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 bg-muted rounded-lg p-3">
                                        <p className="font-semibold text-sm">{comment.author}</p>
                                        <p className="text-sm mt-1">{comment.content}</p>
                                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                          <button className="hover:text-primary flex items-center gap-1">
                                            <ThumbsUp className="h-3 w-3" />
                                            {comment.likes}
                                          </button>
                                          <span>{new Date(comment.timestamp).toLocaleDateString()}</span>
                                        </div>
                                      </div>
                                    </div>
                                    {/* Nested Replies */}
                                    {comment.replies && comment.replies.map((reply) => (
                                      <div key={reply.id} className="ml-10 flex items-start gap-2">
                                        <Avatar className="h-7 w-7">
                                          <AvatarFallback className="text-xs">
                                            {reply.author[0]}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 bg-muted/60 rounded-lg p-2">
                                          <p className="font-semibold text-xs">{reply.author}</p>
                                          <p className="text-xs mt-1">{reply.content}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 mt-4">
                              <Input
                                placeholder="Write a comment..."
                                value={commentInputs[post.id] || ""}
                                onChange={e => handleCommentInput(post.id, e.target.value)}
                                className="flex-1"
                                onKeyDown={e => { if (e.key === 'Enter') handleAddComment(post.id); }}
                              />
                              <Button size="sm" onClick={() => handleAddComment(post.id)}>
                                Post
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="pinned">
          <Card>
            <CardHeader>
              <CardTitle>Pinned Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {posts.filter(p => p.isPinned).length > 0 ? (
                  posts.filter(p => p.isPinned).map(post => (
                    <div key={post.id} className="p-4 border rounded-lg">
                      <p className="font-medium">{post.author}</p>
                      <p className="text-sm text-muted-foreground mt-1">{post.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">No pinned posts</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Content</TableHead>
                    <TableHead>Scheduled Date</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-muted-foreground">No scheduled posts</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moderation">
          <Card>
            <CardHeader>
              <CardTitle>Moderation Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Post</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Reported By</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-muted-foreground">No reports pending</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{posts.length}</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {posts.reduce((sum, p) => sum + p.likes + p.comments + p.shares, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Likes, comments & shares</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Reach</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">Users per post</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SchoolConnectManager;
