import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CreditCard, Receipt, Download, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FeeBreakdown {
  tuitionFee: number;
  examFee: number;
  libraryFee: number;
  transportFee: number;
  miscFee: number;
}

interface Transaction {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: string;
  receiptNo: string;
}

export default function ParentChildFeeDetails() {
  const { childId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock data - in real app, fetch based on childId
  const [childData] = useState({
    id: "child_1",
    name: "Alice Johnson",
    class: "10-A",
    rollNo: "001",
    totalDue: 50000,
    pendingAmount: 25000,
    nextDueDate: "2025-09-30"
  });

  const [feeBreakdown] = useState<FeeBreakdown>({
    tuitionFee: 35000,
    examFee: 5000,
    libraryFee: 2000,
    transportFee: 6000,
    miscFee: 2000
  });

  const [transactions] = useState<Transaction[]>([
    {
      id: "txn_001",
      date: "2025-08-15",
      amount: 25000,
      method: "Online Payment",
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
    },
    {
      id: "txn_003",
      date: "2025-06-05",
      amount: 15000,
      method: "Bank Transfer",
      status: "Completed",
      receiptNo: "REC003"
    }
  ]);

  const handlePayNow = () => {
    navigate(`/parent-fees/${childId}/pay`);
  };

  const handleDownloadReceipt = (receiptNo: string) => {
    toast({
      title: "Receipt Downloaded",
      description: `Receipt ${receiptNo} has been downloaded successfully.`
    });
  };

  const getTotalPaid = () => {
    return transactions.reduce((total, txn) => 
      txn.status === "Completed" ? total + txn.amount : total, 0
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate("/parent-fees")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Fees
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{childData.name} - Fee Details</h1>
          <p className="text-muted-foreground">
            Class {childData.class} • Roll No: {childData.rollNo}
          </p>
        </div>
      </div>

      {/* Fee Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Total Fees</p>
              <p className="text-xl font-bold">₹{childData.totalDue.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Paid Amount</p>
              <p className="text-xl font-bold text-green-600">₹{getTotalPaid().toLocaleString()}</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Pending Amount</p>
              <p className="text-xl font-bold text-orange-600">₹{childData.pendingAmount.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Next Due Date</p>
              <p className="text-sm font-medium">{childData.nextDueDate}</p>
              {childData.pendingAmount > 0 && (
                <Button size="sm" className="mt-2 w-full" onClick={handlePayNow}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay Now
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="breakdown" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="breakdown">Fee Breakdown</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown">
          <Card>
            <CardHeader>
              <CardTitle>Fee Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(feeBreakdown).map(([key, amount]) => (
                  <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{amount.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span>₹{Object.values(feeBreakdown).reduce((sum, amount) => sum + amount, 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">₹{transaction.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                        <p className="text-xs text-muted-foreground">{transaction.method}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={transaction.status === "Completed" ? "default" : "secondary"}>
                        {transaction.status}
                      </Badge>
                      {transaction.status === "Completed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadReceipt(transaction.receiptNo)}
                        >
                          <Receipt className="h-4 w-4 mr-2" />
                          Receipt
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}