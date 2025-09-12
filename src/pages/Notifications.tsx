import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const mockNotifications = [
  { id: 1, title: "School Closed Tomorrow", content: "Due to weather conditions, the school will remain closed tomorrow." },
  { id: 2, title: "Fee Payment Reminder", content: "Please pay the term fees by September 15th." },
  { id: 3, title: "Parent-Teacher Meeting", content: "Parent-Teacher meeting scheduled for September 20th at 10:00 AM." }
];

export default function Notifications() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Notifications</h1>
      {mockNotifications.map(n => (
        <Card key={n.id} className="mb-4">
          <CardHeader>
            <CardTitle>{n.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div>{n.content}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
