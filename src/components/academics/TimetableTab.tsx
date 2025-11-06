import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Teacher {
  id: string;
  name: string;
}

interface Period {
  id: string;
  name: string;
  teacherId?: string;
  isBreak?: boolean;
}

interface TimetableDay {
  periods: Period[];
}

const teachers: Teacher[] = [
  { id: "T1", name: "Mrs. Priya Singh" },
  { id: "T2", name: "Mr. Rahul Kumar" },
  { id: "T3", name: "Dr. Anita Sharma" },
  { id: "T4", name: "Mrs. Kavita Mehta" },
  { id: "T5", name: "Mr. Suresh Patel" },
  { id: "T6", name: "Ms. Ritu Jain" },
];

const defaultPeriods = [
  { id: "P1", name: "Period 1" },
  { id: "P2", name: "Period 2" },
  { id: "B1", name: "Short Break", isBreak: true },
  { id: "P3", name: "Period 3" },
  { id: "P4", name: "Period 4" },
  { id: "B2", name: "Lunch Break", isBreak: true },
  { id: "P5", name: "Period 5" },
  { id: "P6", name: "Period 6" },
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function TimetableTab() {
  const [timetable, setTimetable] = useState<Record<string, TimetableDay>>(() => {
    const obj: Record<string, TimetableDay> = {};
    days.forEach((day) => {
      obj[day] = { periods: defaultPeriods.map((p) => ({ ...p })) };
    });
    return obj;
  });
  const [editDialog, setEditDialog] = useState<{ open: boolean; day: string; period: Period | null }>({ open: false, day: "", period: null });
  const [editTeacherId, setEditTeacherId] = useState<string>("");
  const [editPeriodName, setEditPeriodName] = useState<string>("");
  const [isBreak, setIsBreak] = useState(false);

  const handleEdit = (day: string, period: Period) => {
    setEditDialog({ open: true, day, period });
    setEditTeacherId(period.teacherId || "");
    setEditPeriodName(period.name);
    setIsBreak(!!period.isBreak);
  };

  const handleSave = () => {
    if (!editDialog.period) return;
    setTimetable((prev) => {
      const updated = { ...prev };
      updated[editDialog.day].periods = updated[editDialog.day].periods.map((p) =>
        p.id === editDialog.period!.id
          ? { ...p, name: editPeriodName, teacherId: isBreak ? undefined : editTeacherId, isBreak }
          : p
      );
      return updated;
    });
    setEditDialog({ open: false, day: "", period: null });
  };

  const handleAddPeriod = (day: string) => {
    const newPeriod: Period = {
      id: `P${Date.now()}`,
      name: "New Period",
      teacherId: undefined,
      isBreak: false,
    };
    setTimetable((prev) => {
      const updated = { ...prev };
      updated[day].periods = [...updated[day].periods, newPeriod];
      return updated;
    });
  };

  const handleAddBreak = (day: string) => {
    const newBreak: Period = {
      id: `B${Date.now()}`,
      name: "Break",
      isBreak: true,
    };
    setTimetable((prev) => {
      const updated = { ...prev };
      updated[day].periods = [...updated[day].periods, newBreak];
      return updated;
    });
  };

  return (
    <div className="space-y-8">
      {days.map((day) => (
        <Card key={day} className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{day}</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleAddPeriod(day)}>Add Period</Button>
              <Button size="sm" variant="outline" onClick={() => handleAddBreak(day)}>Add Break</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timetable[day].periods.map((period) => (
                  <TableRow key={period.id}>
                    <TableCell>{period.name}</TableCell>
                    <TableCell>{period.isBreak ? "Break" : "Class"}</TableCell>
                    <TableCell>{period.isBreak ? "-" : teachers.find((t) => t.id === period.teacherId)?.name || ""}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(day, period)}>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
      <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ ...editDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Period</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={editPeriodName}
              onChange={(e) => setEditPeriodName(e.target.value)}
              placeholder="Enter period or break name"
            />
            <Select value={isBreak ? "break" : "class"} onValueChange={(val) => setIsBreak(val === "break")}> 
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="class">Class</SelectItem>
                <SelectItem value="break">Break</SelectItem>
              </SelectContent>
            </Select>
            {!isBreak && (
              <Select value={editTeacherId} onValueChange={setEditTeacherId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <div className="flex gap-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={() => setEditDialog({ open: false, day: "", period: null })}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
