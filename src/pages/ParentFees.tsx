import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, CreditCard, Eye, Receipt, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface Child {
  id: string;
  name: string;
  class: string;
  rollNo: string;
  avatar?: string;
  totalDue: number;
  pendingAmount: number;
  nextDueDate: string;
}

interface ChildFeeDetails {
  [childId: string]: {
    feeBreakdown: {
      tuitionFee: number;
      examFee: number;
      libraryFee: number;
      transportFee: number;
      miscFee: number;
    };
    transactionHistory: {
      id: string;
      date: string;
      amount: number;
      method: string;
      status: string;
      receiptNo: string;
    }[];
  };
}

export default function ParentFees() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Mock data for children - in real app, this would come from user context or API
  const [children] = useState<Child[]>([
    {
      id: "child_1",
      name: "Alice Johnson",
      class: "10-A",
      rollNo: "001",
      totalDue: 50000,
      pendingAmount: 25000,
      nextDueDate: "2025-09-30"
    },
    {
      id: "child_2",
      name: "Bob Johnson",
      class: "8-B",
      rollNo: "045",
      totalDue: 45000,
      pendingAmount: 15000,
      nextDueDate: "2025-09-30"
    }
  ]);

  const [childFeeDetails] = useState<ChildFeeDetails>({
    child_1: {
      feeBreakdown: {
        tuitionFee: 35000,
        examFee: 5000,
        libraryFee: 2000,
        transportFee: 6000,
        miscFee: 2000
      },
      transactionHistory: [
        {
          id: "txn_001",
          date: "2025-08-15",
          amount: 25000,
          method: "Online",
          status: "Completed",
          receiptNo: "REC001"
        },
        {
          id: "txn_002",
          date: "2025-07-10",
          amount: 20000,
          method: "Cash",
          status: "Completed",
          receiptNo: "REC002"
        }
      ]
    },
    child_2: {
      feeBreakdown: {
        tuitionFee: 30000,
        examFee: 5000,
        libraryFee: 2000,
        transportFee: 6000,
        miscFee: 2000
      },
      transactionHistory: [
        {
          id: "txn_003",
          date: "2025-08-20",
          amount: 30000,
          method: "Online",
          status: "Completed",
          receiptNo: "REC003"
        }
      ]
    }
  });

  const handleViewChild = (childId: string) => {
    navigate(`/parent-fees/${childId}`);
  };

  const getTotalPendingForParent = () => {
    return children.reduce((total, child) => total + child.pendingAmount, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Fee Management</h1>
        <p className="text-muted-foreground">
          Manage fees and payments for your children
        </p>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Fee Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Total Children</p>
              <p className="text-2xl font-bold">{children.length}</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Total Pending</p>
              <p className="text-2xl font-bold text-orange-600">₹{getTotalPendingForParent().toLocaleString()}</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Next Due Date</p>
              <p className="text-sm font-medium">September 30, 2025</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Children Fee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children.map((child) => (
          <Card key={child.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{child.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Class {child.class} • Roll: {child.rollNo}
                  </p>
                </div>
                <Badge variant={child.pendingAmount > 0 ? "destructive" : "default"}>
                  {child.pendingAmount > 0 ? "Pending" : "Paid"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Fees</p>
                  <p className="font-semibold">₹{child.totalDue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Pending</p>
                  <p className="font-semibold text-orange-600">₹{child.pendingAmount.toLocaleString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Next Due Date</p>
                  <p className="font-semibold">{child.nextDueDate}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleViewChild(child.id)}
                  className="flex-1"
                  size="sm"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                {child.pendingAmount > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/parent-fees/${child.id}/pay`)}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}