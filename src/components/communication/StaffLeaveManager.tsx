import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, FileText, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockApi } from "../../services/mockApi";

interface StaffLeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  approvedBy?: string;
  comments?: string;
}

export function StaffLeaveManager() {
  const [leaves, setLeaves] = useState<StaffLeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  const [leaveData, setLeaveData] = useState({
    startDate: "",
    endDate: "",
    reason: ""
  });

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        // Mock data for leaves since API might not exist
        const mockLeaves: StaffLeaveRequest[] = [
          {
            id: "LEAVE001",
            staffId: "STAFF001",
            staffName: "John Doe",
            startDate: "2024-03-15",
            endDate: "2024-03-17",
            reason: "Medical leave",
            status: "approved",
            appliedDate: "2024-03-10",
            approvedBy: "Admin",
            comments: "Approved by administrator"
          }
        ];
        setLeaves(mockLeaves);
      } catch (error) {
        console.error("Failed to fetch leaves:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  const handleSubmitLeave = async () => {
    if (!leaveData.startDate || !leaveData.endDate || !leaveData.reason) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const newLeave: StaffLeaveRequest = {
        id: `LEAVE${String(leaves.length + 2).padStart(3, '0')}`,
        staffId: "STAFF001",
        staffName: "Current User",
        startDate: leaveData.startDate,
        endDate: leaveData.endDate,
        reason: leaveData.reason,
        status: "pending",
        appliedDate: new Date().toISOString().split('T')[0]
      };

      setLeaves(prev => [newLeave, ...prev]);
      setLeaveData({ startDate: "", endDate: "", reason: "" });
      setShowDialog(false);

      toast({
        title: "Success",
        description: "Leave request submitted successfully"
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to submit leave request",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-muted rounded w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display">Leave Management</h1>
          <p className="text-muted-foreground">Manage your leave requests</p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Apply for Leave
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Leave Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={leaveData.startDate}
                    onChange={(e) => setLeaveData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={leaveData.endDate}
                    onChange={(e) => setLeaveData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  value={leaveData.reason}
                  onChange={(e) => setLeaveData(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Enter reason for leave..."
                />
              </div>
              <Button onClick={handleSubmitLeave} className="w-full">
                Submit Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-bold">{leaves.length}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">
                  {leaves.filter(l => l.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">
                  {leaves.filter(l => l.status === 'approved').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">
                  {leaves.filter(l => 
                    new Date(l.appliedDate).getMonth() === new Date().getMonth()
                  ).length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leave Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>My Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date Range</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Comments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaves.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell>
                    {leave.startDate} to {leave.endDate}
                  </TableCell>
                  <TableCell>{leave.reason}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        leave.status === 'approved' ? 'default' : 
                        leave.status === 'rejected' ? 'destructive' : 'secondary'
                      }
                    >
                      {leave.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{leave.appliedDate}</TableCell>
                  <TableCell>{leave.comments || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}