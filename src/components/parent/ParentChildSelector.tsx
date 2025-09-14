import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "lucide-react";

interface Child {
  id: string;
  name: string;
  class: string;
  rollNo: string;
}

interface ParentChildSelectorProps {
  onChildSelect: (childId: string) => void;
  selectedChildId?: string;
}

const mockChildren: Child[] = [
  { id: "child1", name: "Alice Johnson", class: "10-A", rollNo: "001" },
  { id: "child2", name: "Bob Johnson", class: "8-B", rollNo: "045" }
];

export function ParentChildSelector({ onChildSelect, selectedChildId }: ParentChildSelectorProps) {
  const selectedChild = mockChildren.find(child => child.id === selectedChildId);

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Select Child</h3>
              <p className="text-sm text-muted-foreground">Choose which child's information to view</p>
            </div>
          </div>
          <div className="w-64">
            <Select value={selectedChildId} onValueChange={onChildSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select a child" />
              </SelectTrigger>
              <SelectContent>
                {mockChildren.map((child) => (
                  <SelectItem key={child.id} value={child.id}>
                    {child.name} - Class {child.class}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {selectedChild && (
          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex gap-4 text-sm">
              <span><strong>Name:</strong> {selectedChild.name}</span>
              <span><strong>Class:</strong> {selectedChild.class}</span>
              <span><strong>Roll No:</strong> {selectedChild.rollNo}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}