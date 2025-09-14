
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MessageSquare, Send, Mail, Phone, Users, Plus, Search, Filter, Timer, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockApi, Student, Staff } from "../../services/mockApi";

interface Message {
  id: string;
  subject: string;
  content: string;
  recipients: string[];
  recipientType: 'students' | 'staff' | 'parents' | 'custom';
  sender: string;
  sentAt: string;
  status: 'sent' | 'scheduled' | 'draft';
  type: 'sms' | 'email' | 'notification';
  scheduledFor?: string;
}

interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'sms' | 'email' | 'notification';
  category: 'attendance' | 'fees' | 'exam' | 'general';
}

export function CommunicationManager() {
  const [students, setStudents] = useState<Student[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [customSearchTerm, setCustomSearchTerm] = useState("");
  const [selectedCustomRecipients, setSelectedCustomRecipients] = useState<{id: string, name: string, email: string, type: string}[]>([]);
  const { toast } = useToast();

  // Form states
  const [messageSubject, setMessageSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [messageType, setMessageType] = useState<'sms' | 'email' | 'notification'>('email');
  const [recipientType, setRecipientType] = useState<'students' | 'staff' | 'parents' | 'custom'>('students');
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [autoNotifications, setAutoNotifications] = useState({
    attendance: true,
    fees: true,
    exams: true,
    announcements: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsData, staffData] = await Promise.all([
          mockApi.getStudents(),
          mockApi.getStaff()
        ]);
        setStudents(studentsData);
        setStaff(staffData);
        
        // Mock messages data
        const mockMessages: Message[] = [
          {
            id: 'MSG001',
            subject: 'Monthly Fee Reminder',
            content: 'Dear parent, this is a reminder that the monthly fee is due by the end of this month.',
            recipients: ['parent1@email.com', 'parent2@email.com'],
            recipientType: 'parents',
            sender: 'admin@school.edu',
            sentAt: '2024-01-15T10:00:00Z',
            status: 'sent',
            type: 'email'
          },
          {
            id: 'MSG002',
            subject: 'Staff Meeting Tomorrow',
            content: 'Reminder: Staff meeting scheduled for tomorrow at 3 PM in the conference room.',
            recipients: ['staff1@school.edu', 'staff2@school.edu'],
            recipientType: 'staff',
            sender: 'admin@school.edu',
            sentAt: '2024-01-14T14:30:00Z',
            status: 'sent',
            type: 'email'
          }
        ];
        setMessages(mockMessages);

        // Mock templates data
        const mockTemplates: NotificationTemplate[] = [
          {
            id: 'TPL001',
            name: 'Fee Reminder',
            subject: 'Fee Payment Reminder',
            content: 'Dear {parent_name}, your child {student_name}\'s fee payment is due. Please make the payment by {due_date}.',
            type: 'email',
            category: 'fees'
          },
          {
            id: 'TPL002',
            name: 'Attendance Alert',
            subject: 'Attendance Alert',
            content: 'Your child {student_name} was absent today ({date}). Please contact the school if this is an error.',
            type: 'sms',
            category: 'attendance'
          }
        ];
        setTemplates(mockTemplates);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const sendMessage = async () => {
    if (!messageSubject || !messageContent) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const recipients = recipientType === 'custom' 
        ? selectedCustomRecipients.map(r => r.email)
        : selectedRecipients;

      const newMessage: Message = {
        id: `MSG${String(messages.length + 1).padStart(3, '0')}`,
        subject: messageSubject,
        content: messageContent,
        recipients,
        recipientType,
        sender: 'admin@school.edu',
        sentAt: new Date().toISOString(),
        status: scheduledDate ? 'scheduled' : 'sent',
        type: messageType,
        scheduledFor: scheduledDate ? `${scheduledDate}T${scheduledTime}:00Z` : undefined
      };

      setMessages(prev => [...prev, newMessage]);
      
      // Reset form
      setMessageSubject("");
      setMessageContent("");
      setSelectedRecipients([]);
      setSelectedCustomRecipients([]);
      setCustomSearchTerm("");
      setScheduledDate("");
      setScheduledTime("");

      toast({
        title: "Success",
        description: scheduledDate ? "Message scheduled successfully" : "Message sent successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const getRecipientsList = () => {
    switch (recipientType) {
      case 'students':
        return students.map(s => ({ 
          id: s.id, 
          name: s.name, 
          email: `${s.name.toLowerCase().replace(' ', '.')}@student.school.edu`,
          type: 'student'
        }));
      case 'staff':
        return staff.map(s => ({ id: s.id, name: s.name, email: s.email, type: 'staff' }));
      case 'parents':
        return students.map(s => ({ 
          id: s.id, 
          name: `${s.guardianName} (Parent of ${s.name})`, 
          email: `${s.guardianName.toLowerCase().replace(' ', '.')}@parent.email.com`,
          type: 'parent'
        }));
      default:
        return [];
    }
  };

  const getAllRecipients = () => {
    const allStaff = staff.map(s => ({ 
      id: s.id, 
      name: s.name, 
      email: s.email,
      type: 'staff',
      designation: s.designation
    }));
    
    const allParents = students.map(s => ({ 
      id: `parent-${s.id}`, 
      name: `${s.guardianName} (Parent of ${s.name})`, 
      email: `${s.guardianName.toLowerCase().replace(' ', '.')}@parent.email.com`,
      type: 'parent',
      child: s.name,
      class: s.class
    }));

    return [...allStaff, ...allParents];
  };

  const getClassRecipients = () => {
    const classes = [...new Set(students.map(s => `${s.class}-${s.section}`))];
    return classes.map(classSection => {
      const [className, section] = classSection.split('-');
      const classStudents = students.filter(s => s.class === className && s.section === section);
      return {
        id: `class-${classSection}`,
        name: `Class ${className} ${section} (${classStudents.length} students)`,
        email: `class-${classSection}@school.edu`,
        type: 'class',
        studentCount: classStudents.length,
        students: classStudents
      };
    });
  };

  const filteredCustomRecipients = getAllRecipients().filter(recipient =>
    recipient.name.toLowerCase().includes(customSearchTerm.toLowerCase()) ||
    recipient.email.toLowerCase().includes(customSearchTerm.toLowerCase()) ||
    ('class' in recipient && recipient.class?.toLowerCase().includes(customSearchTerm.toLowerCase())) ||
    ('designation' in recipient && recipient.designation?.toLowerCase().includes(customSearchTerm.toLowerCase()))
  );

  const filteredClassRecipients = getClassRecipients().filter(classItem =>
    classItem.name.toLowerCase().includes(customSearchTerm.toLowerCase())
  );

  const addCustomRecipient = (recipient: any) => {
    if (recipient.type === 'class') {
      // Add all parents of students in the class
      const classParents = recipient.students.map((student: any) => ({
        id: `parent-${student.id}`,
        name: `${student.guardianName} (Parent of ${student.name})`,
        email: `${student.guardianName.toLowerCase().replace(' ', '.')}@parent.email.com`,
        type: 'parent'
      }));
      setSelectedCustomRecipients(prev => {
        const existing = prev.filter(r => !classParents.some((cp: any) => cp.id === r.id));
        return [...existing, ...classParents];
      });
    } else {
      setSelectedCustomRecipients(prev => {
        if (prev.some(r => r.id === recipient.id)) return prev;
        return [...prev, recipient];
      });
    }
  };

  const removeCustomRecipient = (recipientId: string) => {
    setSelectedCustomRecipients(prev => prev.filter(r => r.id !== recipientId));
  };

  const filteredMessages = messages.filter(message =>
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-display">Communication Center</h1>
          <p className="text-muted-foreground">Manage SMS, email notifications and announcements</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Messages</p>
                <p className="text-2xl font-bold">{messages.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sent Today</p>
                <p className="text-2xl font-bold">
                  {messages.filter(m => 
                    new Date(m.sentAt).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
              <Send className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">
                  {messages.filter(m => m.status === 'scheduled').length}
                </p>
              </div>
              <Timer className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Templates</p>
                <p className="text-2xl font-bold">{templates.length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Communication Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="compose" className="space-y-4">
            <TabsList>
              <TabsTrigger value="compose">Compose Message</TabsTrigger>
              <TabsTrigger value="history">Message History</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="settings">Auto Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="compose" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="messageType">Message Type</Label>
                    <Select value={messageType} onValueChange={(value: any) => setMessageType(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select message type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="recipientType">Recipients</Label>
                    <Select value={recipientType} onValueChange={(value: any) => setRecipientType(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipient type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="students">All Students</SelectItem>
                        <SelectItem value="parents">All Parents</SelectItem>
                        <SelectItem value="staff">All Staff</SelectItem>
                        <SelectItem value="custom">Custom Selection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={messageSubject}
                      onChange={(e) => setMessageSubject(e.target.value)}
                      placeholder="Enter message subject"
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">Message Content</Label>
                    <Textarea
                      id="content"
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      placeholder="Enter your message here..."
                      className="min-h-32"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="scheduleDate">Schedule Date (Optional)</Label>
                      <Input
                        id="scheduleDate"
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="scheduleTime">Schedule Time</Label>
                      <Input
                        id="scheduleTime"
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        disabled={!scheduledDate}
                      />
                    </div>
                  </div>

                  <Button onClick={sendMessage} className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    {scheduledDate ? 'Schedule Message' : 'Send Message'}
                  </Button>
                </div>

                {recipientType === 'custom' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Custom Recipients Selection</Label>
                      <Badge variant="outline">
                        {selectedCustomRecipients.length} selected
                      </Badge>
                    </div>

                    {/* Universal Search Bar */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search students, parents, staff, or classes..."
                        value={customSearchTerm}
                        onChange={(e) => setCustomSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Selected Recipients */}
                    {selectedCustomRecipients.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Selected Recipients:</Label>
                        <div className="border rounded-lg p-3 max-h-32 overflow-y-auto bg-muted/50">
                          <div className="flex flex-wrap gap-2">
                            {selectedCustomRecipients.map((recipient) => (
                              <Badge key={recipient.id} variant="secondary" className="flex items-center gap-1">
                                <span className="text-xs">{recipient.type}</span>
                                {recipient.name}
                                <button
                                  onClick={() => removeCustomRecipient(recipient.id)}
                                  className="ml-1 hover:text-destructive"
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <Tabs defaultValue="individuals" className="space-y-4">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="individuals">Individuals</TabsTrigger>
                        <TabsTrigger value="classes">Classes</TabsTrigger>
                      </TabsList>

                      <TabsContent value="individuals" className="space-y-2">
                        <div className="border rounded-lg max-h-96 overflow-y-auto">
                          {filteredCustomRecipients.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground">
                              No recipients found matching your search.
                            </div>
                          ) : (
                            filteredCustomRecipients.map((recipient) => (
                              <div key={recipient.id} className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-muted/50">
                                <div className="flex items-center space-x-3">
                                  <Badge variant="outline" className="text-xs">
                                    {recipient.type}
                                  </Badge>
                                  <div>
                                    <p className="font-medium text-sm">{recipient.name}</p>
                                    <p className="text-xs text-muted-foreground">{recipient.email}</p>
                                    {'class' in recipient && recipient.class && (
                                      <p className="text-xs text-muted-foreground">Class: {recipient.class}</p>
                                    )}
                                    {'designation' in recipient && recipient.designation && (
                                      <p className="text-xs text-muted-foreground">Role: {recipient.designation}</p>
                                    )}
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => addCustomRecipient(recipient)}
                                  disabled={selectedCustomRecipients.some(r => r.id === recipient.id)}
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add
                                </Button>
                              </div>
                            ))
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="classes" className="space-y-2">
                        <div className="border rounded-lg max-h-96 overflow-y-auto">
                          {filteredClassRecipients.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground">
                              No classes found matching your search.
                            </div>
                          ) : (
                            filteredClassRecipients.map((classItem) => (
                              <div key={classItem.id} className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-muted/50">
                                <div className="flex items-center space-x-3">
                                  <Badge variant="outline" className="text-xs">
                                    class
                                  </Badge>
                                  <div>
                                    <p className="font-medium text-sm">{classItem.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      Will send to parents of {classItem.studentCount} students
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => addCustomRecipient(classItem)}
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add All
                                </Button>
                              </div>
                            ))
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search messages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Sent At</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell className="font-medium">{message.subject}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {message.type.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{message.recipients.length} recipients</TableCell>
                      <TableCell>
                        {new Date(message.sentAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            message.status === 'sent' ? 'default' : 
                            message.status === 'scheduled' ? 'secondary' : 'outline'
                          }
                        >
                          {message.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Message Templates</h3>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Template
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <Card key={template.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <Badge variant="outline">{template.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">{template.subject}</p>
                      <p className="text-sm">{template.content.substring(0, 100)}...</p>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="outline">Use</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Automatic Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="attendance-notifications">Attendance Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send automatic notifications to parents when students are absent
                      </p>
                    </div>
                    <Switch
                      id="attendance-notifications"
                      checked={autoNotifications.attendance}
                      onCheckedChange={(checked) => 
                        setAutoNotifications(prev => ({ ...prev, attendance: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="fee-notifications">Fee Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send automatic fee payment reminders
                      </p>
                    </div>
                    <Switch
                      id="fee-notifications"
                      checked={autoNotifications.fees}
                      onCheckedChange={(checked) => 
                        setAutoNotifications(prev => ({ ...prev, fees: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="exam-notifications">Exam Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send automatic exam schedule and result notifications
                      </p>
                    </div>
                    <Switch
                      id="exam-notifications"
                      checked={autoNotifications.exams}
                      onCheckedChange={(checked) => 
                        setAutoNotifications(prev => ({ ...prev, exams: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="announcement-notifications">Announcement Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send automatic notifications for new announcements
                      </p>
                    </div>
                    <Switch
                      id="announcement-notifications"
                      checked={autoNotifications.announcements}
                      onCheckedChange={(checked) => 
                        setAutoNotifications(prev => ({ ...prev, announcements: checked }))
                      }
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
