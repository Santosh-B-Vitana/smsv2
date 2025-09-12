
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Megaphone, Calendar, Users, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AnnouncementForm } from "./AnnouncementForm";
import { AnnouncementList } from "./AnnouncementList";

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetAudience: string[];
  status: 'draft' | 'published' | 'scheduled' | 'expired';
  createdAt: string;
  scheduledDate?: string;
  expiryDate?: string;
  author: string;
}

const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Parent-Teacher Meeting',
    content: 'Parent-Teacher meeting scheduled for all classes on 15th December 2024. Please confirm your attendance.',
    priority: 'high',
    targetAudience: ['parents', 'students'],
    status: 'published',
    createdAt: '2024-12-01T10:00:00Z',
    author: 'Principal'
  },
  {
    id: '2',
    title: 'Winter Break Notice',
    content: 'School will be closed for winter break from 25th December 2024 to 2nd January 2025.',
    priority: 'medium',
    targetAudience: ['all'],
    status: 'published',
    createdAt: '2024-11-28T09:00:00Z',
    author: 'Admin'
  }
];

export function AnnouncementManager() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const { toast } = useToast();

  const handleSubmit = (announcementData: any) => {
    if (editingAnnouncement) {
      setAnnouncements(prev => prev.map(ann => 
        ann.id === editingAnnouncement.id ? { ...announcementData, id: editingAnnouncement.id } : ann
      ));
      setEditingAnnouncement(null);
    } else {
      setAnnouncements(prev => [...prev, announcementData]);
    }
    setShowForm(false);
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setAnnouncements(prev => prev.filter(ann => ann.id !== id));
    toast({
      title: "Success",
      description: "Announcement deleted successfully"
    });
  };

  const handleView = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
  };

  const getStats = () => {
    return {
      total: announcements.length,
      published: announcements.filter(a => a.status === 'published').length,
      scheduled: announcements.filter(a => a.status === 'scheduled').length,
      urgent: announcements.filter(a => a.priority === 'urgent').length
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display">Announcements</h1>
          <p className="text-muted-foreground">Manage school announcements and notifications</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Announcement
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Megaphone className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Published</p>
                <p className="text-2xl font-bold">{stats.published}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">{stats.scheduled}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Urgent</p>
                <p className="text-2xl font-bold">{stats.urgent}</p>
              </div>
              <Users className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">All Announcements</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <AnnouncementList
            announcements={announcements}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Announcement Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-background rounded-lg border p-4">
                  <div className="text-2xl font-bold text-primary">23</div>
                  <div className="text-sm text-muted-foreground">Total Announcements</div>
                </div>
                <div className="bg-background rounded-lg border p-4">
                  <div className="text-2xl font-bold text-green-600">95%</div>
                  <div className="text-sm text-muted-foreground">Read Rate</div>
                </div>
                <div className="bg-background rounded-lg border p-4">
                  <div className="text-2xl font-bold text-orange-600">5</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span className="text-sm">Parent Meeting announcement sent</span>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span className="text-sm">Holiday notice published</span>
                    <span className="text-xs text-muted-foreground">1 day ago</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
            </DialogTitle>
          </DialogHeader>
          <AnnouncementForm
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingAnnouncement(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!selectedAnnouncement} onOpenChange={() => setSelectedAnnouncement(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedAnnouncement?.title}</DialogTitle>
          </DialogHeader>
          {selectedAnnouncement && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Content:</p>
                <p>{selectedAnnouncement.content}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Priority: </span>
                  <span className="font-medium">{selectedAnnouncement.priority}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Status: </span>
                  <span className="font-medium">{selectedAnnouncement.status}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Audience: </span>
                  <span className="font-medium">{selectedAnnouncement.targetAudience.join(', ')}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Author: </span>
                  <span className="font-medium">{selectedAnnouncement.author}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
