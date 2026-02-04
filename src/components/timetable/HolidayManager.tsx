import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Calendar, Sun } from "lucide-react";
import { toast } from "sonner";

interface Holiday {
  id: string;
  name: string;
  date: string;
  endDate?: string;
  type: 'public' | 'school' | 'optional';
  description?: string;
  academicYear: string;
}

export default function HolidayManager() {
  const [holidays, setHolidays] = useState<Holiday[]>([
    {
      id: '1',
      name: 'Republic Day',
      date: '2025-01-26',
      type: 'public',
      description: 'National holiday',
      academicYear: '2024-25'
    },
    {
      id: '2',
      name: 'Holi',
      date: '2025-03-14',
      type: 'public',
      description: 'Festival of colors',
      academicYear: '2024-25'
    },
    {
      id: '3',
      name: 'Summer Vacation',
      date: '2025-05-01',
      endDate: '2025-06-15',
      type: 'school',
      description: 'Annual summer break',
      academicYear: '2024-25'
    },
    {
      id: '4',
      name: 'Independence Day',
      date: '2025-08-15',
      type: 'public',
      description: 'National holiday',
      academicYear: '2024-25'
    },
    {
      id: '5',
      name: 'Diwali',
      date: '2025-10-20',
      endDate: '2025-10-22',
      type: 'public',
      description: 'Festival of lights',
      academicYear: '2024-25'
    }
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    endDate: '',
    type: 'school' as Holiday['type'],
    description: '',
    academicYear: '2024-25'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingHoliday) {
      // Update existing holiday
      setHolidays(holidays.map(h => 
        h.id === editingHoliday.id 
          ? { ...editingHoliday, ...formData, endDate: formData.endDate || undefined }
          : h
      ));
      toast.success('Holiday updated successfully');
    } else {
      // Create new holiday
      const newHoliday: Holiday = {
        id: Date.now().toString(),
        ...formData,
        endDate: formData.endDate || undefined
      };
      setHolidays([...holidays, newHoliday]);
      toast.success('Holiday added successfully');
    }

    resetForm();
  };

  const handleEdit = (holiday: Holiday) => {
    setEditingHoliday(holiday);
    setFormData({
      name: holiday.name,
      date: holiday.date,
      endDate: holiday.endDate || '',
      type: holiday.type,
      description: holiday.description || '',
      academicYear: holiday.academicYear
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setHolidays(holidays.filter(h => h.id !== id));
    toast.success('Holiday deleted successfully');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      date: '',
      endDate: '',
      type: 'school',
      description: '',
      academicYear: '2024-25'
    });
    setEditingHoliday(null);
    setDialogOpen(false);
  };

  const getTypeColor = (type: Holiday['type']) => {
    switch (type) {
      case 'public': return 'bg-blue-500';
      case 'school': return 'bg-green-500';
      case 'optional': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const sortedHolidays = [...holidays].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              Holiday Calendar
            </CardTitle>
            <CardDescription>
              Manage school holidays and public holidays for the academic year
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Holiday
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingHoliday ? 'Edit Holiday' : 'Add New Holiday'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingHoliday ? 'Update holiday details' : 'Add a new holiday to the calendar'}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Holiday Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Diwali, Summer Vacation"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="date">Start Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="endDate">End Date (Optional)</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        min={formData.date}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="type">Holiday Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: Holiday['type']) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public Holiday</SelectItem>
                        <SelectItem value="school">School Holiday</SelectItem>
                        <SelectItem value="optional">Optional Holiday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="academicYear">Academic Year *</Label>
                    <Select
                      value={formData.academicYear}
                      onValueChange={(value) => setFormData({ ...formData, academicYear: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2023-24">2023-24</SelectItem>
                        <SelectItem value="2024-25">2024-25</SelectItem>
                        <SelectItem value="2025-26">2025-26</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Optional notes about this holiday"
                      rows={3}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingHoliday ? 'Update Holiday' : 'Add Holiday'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Holiday Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedHolidays.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No holidays added yet. Click "Add Holiday" to create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedHolidays.map((holiday) => (
                    <TableRow key={holiday.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {holiday.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(holiday.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>
                        {holiday.endDate ? (
                          <span className="text-sm text-muted-foreground">
                            {Math.ceil((new Date(holiday.endDate).getTime() - new Date(holiday.date).getTime()) / (1000 * 60 * 60 * 24)) + 1} days
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">1 day</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`${getTypeColor(holiday.type)} text-white`}>
                          {holiday.type.charAt(0).toUpperCase() + holiday.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                        {holiday.description || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(holiday)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(holiday.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
