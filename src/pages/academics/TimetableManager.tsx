import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, Plus, Edit } from "lucide-react";
import { toast } from "sonner";

interface TimetableEntry {
  id: string;
  day: string;
  period: number;
  subject: string;
  teacher: string;
  startTime: string;
  endTime: string;
}

interface Timetable {
  classId: string;
  className: string;
  entries: TimetableEntry[];
}

export default function TimetableManager() {
  // Subjects divided into core and others
  const coreSubjects = ["English", "Hindi", "Mathematics", "Science", "Social Science", "EVS", "Sanskrit", "Computer Science"];
  const otherSubjects = ["General Knowledge", "Physical Education", "Games", "Art", "Music"];

  // Staff list (mocked, should fetch from API in real app)
  const staffList = [
    { id: "STAFF001", name: "Dr. Rajesh Sharma", designation: "Principal" },
    { id: "STAFF002", name: "Anil Kumar", designation: "Mathematics Teacher" },
    { id: "STAFF003", name: "Priya Singh", designation: "English Teacher" }
  ];

  // Dialog state and entry being edited/added
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add'|'edit'>('add');
  const [dialogDay, setDialogDay] = useState<string>("");
  const [dialogPeriod, setDialogPeriod] = useState<number>(1);
  const [dialogSubject, setDialogSubject] = useState<string>("");
  const [dialogStaff, setDialogStaff] = useState<string>("");

  // Open dialog for add/edit
  const openDialog = (mode: 'add'|'edit', day: string, period: number, entry?: TimetableEntry) => {
    setDialogMode(mode);
    setDialogDay(day);
    setDialogPeriod(period);
    setDialogSubject(entry?.subject || "");
    setDialogStaff(entry?.teacher || "");
    setDialogOpen(true);
  };

  // Save entry (add or edit)
  const handleSaveEntry = () => {
    if (!dialogSubject || !dialogStaff) {
      toast.error("Please select subject and staff");
      return;
    }
    const entry: TimetableEntry = {
      id: `${dialogDay}-${dialogPeriod}`,
      day: dialogDay,
      period: dialogPeriod,
      subject: dialogSubject,
      teacher: dialogStaff,
      startTime: getTimeSlot(dialogPeriod)?.start || "",
      endTime: getTimeSlot(dialogPeriod)?.end || ""
    };
    setTimetables(prev => {
      const updated = prev.map(tt => {
        if (tt.classId !== selectedClass) return tt;
        // Remove old entry for this day/period if exists
        const filtered = tt.entries.filter(e => !(e.day === dialogDay && e.period === dialogPeriod));
        return { ...tt, entries: [...filtered, entry] };
      });
      return updated;
    });
    setDialogOpen(false);
    toast.success(dialogMode === 'add' ? "Entry added" : "Entry updated");
  };

  // Edit handler
  const handleEditEntry = (day: string, period: number) => {
    const entry = getTimetableEntry(day, period);
    openDialog('edit', day, period, entry);
  };

  // Add handler
  const handleAddEntry = (day: string, period: number) => {
    openDialog('add', day, period);
  };
  const [selectedClass, setSelectedClass] = useState("");
  const [timetables, setTimetables] = useState<Timetable[]>([
    {
      classId: "1",
      className: "Class 1-A",
      entries: [
        {
          id: "1",
          day: "Monday",
          period: 1,
          subject: "Mathematics",
          teacher: "Ms. Sarah",
          startTime: "09:00",
          endTime: "09:40"
        },
        {
          id: "2",
          day: "Monday", 
          period: 2,
          subject: "English",
          teacher: "Mr. John",
          startTime: "09:40",
          endTime: "10:20"
        },
        {
          id: "3",
          day: "Monday",
          period: 3,
          subject: "Science",
          teacher: "Ms. Lisa",
          startTime: "10:40",
          endTime: "11:20"
        }
      ]
    }
  ]);

  const classes = [
    { id: "1", name: "Class 1-A" },
    { id: "2", name: "Class 1-B" },
    { id: "3", name: "Class 2-A" }
  ];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const periods = [1, 2, 3, 4, 5, 6, 7, 8];
  
  const timeSlots = [
    { period: 1, start: "09:00", end: "09:40" },
    { period: 2, start: "09:40", end: "10:20" },
    { period: 3, start: "10:40", end: "11:20" },
    { period: 4, start: "11:20", end: "12:00" },
    { period: 5, start: "01:00", end: "01:40" },
    { period: 6, start: "01:40", end: "02:20" },
    { period: 7, start: "02:20", end: "03:00" },
    { period: 8, start: "03:00", end: "03:40" }
  ];

  const currentTimetable = timetables.find(tt => tt.classId === selectedClass);

  const getTimetableEntry = (day: string, period: number) => {
    return currentTimetable?.entries.find(entry => 
      entry.day === day && entry.period === period
    );
  };

  const getTimeSlot = (period: number) => {
    return timeSlots.find(slot => slot.period === period);
  };

  const handleCreateTimetable = () => {
    if (!selectedClass) {
      toast.error("Please select a class first");
      return;
    }
    
    const className = classes.find(c => c.id === selectedClass)?.name || "";
    const newTimetable: Timetable = {
      classId: selectedClass,
      className,
      entries: []
    };
    
    setTimetables(prev => [...prev.filter(tt => tt.classId !== selectedClass), newTimetable]);
    toast.success("Timetable created successfully");
  };

  // (removed duplicate handleEditEntry)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Timetable Management
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage class timetables
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedClass && !currentTimetable && (
            <Button onClick={handleCreateTimetable}>
              <Plus className="h-4 w-4 mr-2" />
              Create Timetable
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!selectedClass ? (
          <div className="text-center py-8 text-muted-foreground">
            Please select a class to view or create timetable
          </div>
        ) : !currentTimetable ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No timetable found for {classes.find(c => c.id === selectedClass)?.name}
            </p>
            <Button onClick={handleCreateTimetable}>
              <Plus className="h-4 w-4 mr-2" />
              Create Timetable
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Period</TableHead>
                  <TableHead className="w-24">Time</TableHead>
                  {days.map((day) => (
                    <TableHead key={day} className="text-center min-w-32">
                      {day}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {periods.map((period) => {
                  const timeSlot = getTimeSlot(period);
                  return (
                    <TableRow key={period}>
                      <TableCell className="font-medium">{period}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {timeSlot ? `${timeSlot.start}-${timeSlot.end}` : "-"}
                      </TableCell>
                      {days.map((day) => {
                        const entry = getTimetableEntry(day, period);
                        return (
                          <TableCell key={`${day}-${period}`} className="text-center">
                            {entry ? (
                              <div className="space-y-1">
                                <div className="font-medium text-sm">{entry.subject}</div>
                                <div className="text-xs text-muted-foreground">{entry.teacher}</div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => handleEditEntry(day, period)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-2 text-xs"
                                onClick={() => handleAddEntry(day, period)}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add
                              </Button>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      {/* Add/Edit Timetable Entry Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{dialogMode === 'add' ? 'Add Timetable Entry' : 'Edit Timetable Entry'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <div className="font-semibold mb-1">Day</div>
              <div>{dialogDay}</div>
            </div>
            <div>
              <div className="font-semibold mb-1">Period</div>
              <div>{dialogPeriod}</div>
            </div>
            <div>
              <div className="font-semibold mb-1">Subject (Core)</div>
              <Select value={coreSubjects.includes(dialogSubject) ? dialogSubject : ""} onValueChange={setDialogSubject}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select core subject" /></SelectTrigger>
                <SelectContent>
                  {coreSubjects.map(sub => (
                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="font-semibold mb-1">Subject (Other)</div>
              <Select value={otherSubjects.includes(dialogSubject) ? dialogSubject : ""} onValueChange={setDialogSubject}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select other subject" /></SelectTrigger>
                <SelectContent>
                  {otherSubjects.map(sub => (
                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="font-semibold mb-1">Assign Staff</div>
              <Select value={dialogStaff} onValueChange={setDialogStaff}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select staff" /></SelectTrigger>
                <SelectContent>
                  {staffList.map(staff => (
                    <SelectItem key={staff.id} value={staff.name}>{staff.name} ({staff.designation})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveEntry}>{dialogMode === 'add' ? 'Add' : 'Save'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}