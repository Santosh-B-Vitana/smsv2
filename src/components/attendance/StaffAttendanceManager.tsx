import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { mockApi, Staff } from "@/services/mockApi";
import { useNavigate } from "react-router-dom";
import { Calendar, CalendarDays, Check, Edit2, FileText, Filter, Search, UserCheck, UserX, Clock } from "lucide-react";

interface StaffAttendanceEntryUI {
  staffId: string;
  status: 'present' | 'leave' | 'late' | 'none';
  reason?: string;
}

export function StaffAttendanceManager() {
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [staff, setStaff] = useState<Staff[]>([]);
  const [entries, setEntries] = useState<Record<string, StaffAttendanceEntryUI>>({});
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [historyStaffId, setHistoryStaffId] = useState<string>("");
  const [history, setHistory] = useState<any[]>([]);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [leaveStaffId, setLeaveStaffId] = useState<string>("");
  const [leaveFrom, setLeaveFrom] = useState<string>("");
  const [leaveTo, setLeaveTo] = useState<string>("");
  const [leaveReason, setLeaveReason] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const list = await mockApi.getStaff();
      setStaff(list);
    })();
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [date]);

  const fetchAttendance = async () => {
    const res = await mockApi.getStaffAttendanceByDate(date);
    const map: Record<string, StaffAttendanceEntryUI> = {};
    res.forEach((r: any) => {
      map[r.staffId] = { staffId: r.staffId, status: r.status, reason: r.reason } as StaffAttendanceEntryUI;
    });
    setEntries(map);
  };

  const subjects = useMemo(() => {
    const set = new Set<string>();
    staff.forEach(s => s.subjects?.forEach(sub => set.add(sub)));
    return Array.from(set);
  }, [staff]);

  const filteredStaff = useMemo(() => {
    return staff.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
      const matchesDept = deptFilter === 'all' ? true : (
        deptFilter === 'Academic' ? s.department !== 'Administration' :
        deptFilter === 'Non Academic' ? s.department === 'Administration' :
        deptFilter === 'Sports' ? s.department === 'Sports' : true
      );
      const matchesSubject = subjectFilter === 'all' ? true : s.subjects?.includes(subjectFilter);
      return matchesSearch && matchesDept && matchesSubject;
    });
  }, [staff, search, deptFilter, subjectFilter]);

  const markStatus = async (staffId: string, status: 'present' | 'leave' | 'late', reason?: string) => {
    await mockApi.markStaffAttendance({ staffId, date, status, reason });
    setEntries(prev => ({ ...prev, [staffId]: { staffId, status, reason } }));
    toast({ title: "Attendance updated" });
  };

  const openLeaveDialog = (sid: string) => {
    setLeaveStaffId(sid);
    setLeaveFrom(date);
    setLeaveTo(date);
    setLeaveReason("");
    setLeaveDialogOpen(true);
  };

  const submitLeave = async () => {
    if (!leaveStaffId || !leaveFrom || !leaveTo) return;
    await mockApi.addStaffLeave({ staffId: leaveStaffId, type: 'Casual', from: leaveFrom, to: leaveTo, status: 'pending', reason: leaveReason });
    // Also mark the selected day as leave
    await markStatus(leaveStaffId, 'leave', leaveReason);
    setLeaveDialogOpen(false);
    toast({ title: "Leave applied" });
  };

  const loadHistory = async (sid: string) => {
    setHistoryStaffId(sid);
    const h = await mockApi.getStaffAttendanceHistory(sid);
    setHistory(h);
  };

  const daysSelected = useMemo(() => {
    if (!leaveFrom || !leaveTo) return 0;
    const a = new Date(leaveFrom);
    const b = new Date(leaveTo);
    return Math.max(1, Math.round((+b - +a)/(1000*60*60*24)) + 1);
  }, [leaveFrom, leaveTo]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Staff Attendance</h1>
        <div className="flex items-center gap-2">
          <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-auto" />
          <Button variant="secondary" onClick={() => navigate('/student-attendance')}>Manage Student Attendance</Button>
        </div>
      </div>

      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="history">Attendance History</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-col gap-3">
                <span>Mark Attendance</span>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    <Input placeholder="Search staff..." value={search} onChange={e => setSearch(e.target.value)} className="w-56" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <Select value={deptFilter} onValueChange={setDeptFilter}>
                      <SelectTrigger className="w-40"><SelectValue placeholder="Department" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="Academic">Academic</SelectItem>
                        <SelectItem value="Non Academic">Non Academic</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                      <SelectTrigger className="w-40"><SelectValue placeholder="Subject" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        {subjects.map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="ml-auto">
                    <Dialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="secondary"><CalendarDays className="h-4 w-4 mr-2" /> Leave Management</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Apply Leave</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <div className="text-sm mb-1">Staff</div>
                            <Select value={leaveStaffId} onValueChange={setLeaveStaffId}>
                              <SelectTrigger><SelectValue placeholder="Select staff" /></SelectTrigger>
                              <SelectContent>
                                {staff.map(s => (
                                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <div className="text-sm mb-1">From</div>
                            <Input type="date" value={leaveFrom} onChange={e => setLeaveFrom(e.target.value)} />
                          </div>
                          <div>
                            <div className="text-sm mb-1">To</div>
                            <Input type="date" value={leaveTo} onChange={e => setLeaveTo(e.target.value)} />
                          </div>
                          <div className="sm:col-span-2">
                            <div className="text-sm mb-1">Reason</div>
                            <Input placeholder="Reason" value={leaveReason} onChange={e => setLeaveReason(e.target.value)} />
                          </div>
                          <div className="sm:col-span-2 text-sm text-muted-foreground">Days: {daysSelected}</div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setLeaveDialogOpen(false)}>Cancel</Button>
                          <Button onClick={submitLeave}>Submit</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Subjects</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.map(s => {
                      const entry = entries[s.id] || { staffId: s.id, status: 'none' } as StaffAttendanceEntryUI;
                      return (
                        <TableRow key={s.id}>
                          <TableCell className="font-medium">{s.name}</TableCell>
                          <TableCell>{s.department}</TableCell>
                          <TableCell>{s.subjects?.join(', ') || '-'}</TableCell>
                          <TableCell className="capitalize">{entry.status === 'none' ? '—' : entry.status}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              <Button size="sm" variant={entry.status === 'present' ? 'default' : 'outline'} onClick={() => markStatus(s.id, 'present')}><UserCheck className="h-4 w-4 mr-1" /> Present</Button>
                              <Button size="sm" variant={entry.status === 'leave' ? 'destructive' : 'outline'} onClick={() => openLeaveDialog(s.id)}><UserX className="h-4 w-4 mr-1" /> On Leave</Button>
                              <Button size="sm" variant={entry.status === 'late' ? 'secondary' : 'outline'} onClick={() => markStatus(s.id, 'late')}><Clock className="h-4 w-4 mr-1" /> Late</Button>
                              <Button size="sm" variant="ghost" onClick={() => loadHistory(s.id)}><FileText className="h-4 w-4 mr-1" /> View History</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Select value={historyStaffId} onValueChange={(v) => loadHistory(v)}>
                  <SelectTrigger className="w-64"><SelectValue placeholder="Select staff" /></SelectTrigger>
                  <SelectContent>
                    {staff.map(s => (<SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              {historyStaffId ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Reason</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.map((h) => (
                        <TableRow key={`${h.staffId}-${h.date}`}>
                          <TableCell>{h.date}</TableCell>
                          <TableCell className="capitalize">{h.status}</TableCell>
                          <TableCell>{h.reason || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">Select a staff member to view history.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
