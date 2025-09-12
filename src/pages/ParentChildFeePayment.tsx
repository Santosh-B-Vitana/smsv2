import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, Shield, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ParentChildFeePayment() {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("18500");

  // Mock data for the specific child
  const childInfo = {
    name: childId === "child_1" ? "Alice Johnson" : "Bob Johnson",
    class: childId === "child_1" ? "10-A" : "8-B",
    rollNo: childId === "child_1" ? "001" : "045",
    pendingAmount: childId === "child_1" ? 25000 : 15000,
  };

  const processPayment = () => {
    if (!selectedPaymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment gateway to proceed.",
        variant: "destructive",
      });
      return;
    }

    // Mock payment processing
    toast({
      title: "Payment Initiated",
      description: `Redirecting to ${selectedPaymentMethod} for payment of ₹${Number(paymentAmount).toLocaleString()}`,
    });

    // Simulate redirect delay
    setTimeout(() => {
      toast({
        title: "Payment Successful",
        description: `₹${Number(paymentAmount).toLocaleString()} paid successfully for ${childInfo.name}`,
      });
      navigate(`/parent-fees/${childId}`);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(`/parent-fees/${childId}`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Pay Fees - {childInfo.name}</h1>
          <p className="text-muted-foreground">
            Class {childInfo.class} • Roll No: {childInfo.rollNo}
          </p>
        </div>
      </div>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Fee Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Amount Section */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Payment Amount</Label>
              <Input
                id="amount"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter amount to pay"
                className="text-lg font-semibold"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Pending amount: ₹{childInfo.pendingAmount.toLocaleString()}
              </p>
            </div>

            {/* Payment Gateway Selection */}
            <div>
              <Label>Select Payment Gateway</Label>
              <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a payment gateway" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="razorpay">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">R</div>
                      Razorpay
                    </div>
                  </SelectItem>
                  <SelectItem value="payu">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-6 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">P</div>
                      PayU
                    </div>
                  </SelectItem>
                  <SelectItem value="paytm">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-6 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">PT</div>
                      Paytm
                    </div>
                  </SelectItem>
                  <SelectItem value="phonepe">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-6 bg-purple-600 rounded text-white text-xs flex items-center justify-center font-bold">PP</div>
                      PhonePe
                    </div>
                  </SelectItem>
                  <SelectItem value="gpay">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-6 bg-gray-800 rounded text-white text-xs flex items-center justify-center font-bold">G</div>
                      Google Pay
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Secure Payment</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Your payment is secured with industry-standard encryption. 
                  You will be redirected to the payment gateway to complete the transaction.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total Amount:</span>
              <span>₹{Number(paymentAmount).toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Button */}
          <Button 
            className="w-full py-6 text-lg" 
            onClick={processPayment}
            disabled={!selectedPaymentMethod || !paymentAmount}
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Pay ₹{Number(paymentAmount || 0).toLocaleString()}
          </Button>

          {/* Terms */}
          <p className="text-xs text-muted-foreground text-center">
            By proceeding with payment, you agree to our terms and conditions. 
            Payment once made cannot be refunded except in exceptional circumstances.
          </p>
        </CardContent>
      </Card>

      {/* Benefits of Online Payment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Why Pay Online?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm">Instant Confirmation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm">24/7 Availability</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm">Digital Receipts</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}