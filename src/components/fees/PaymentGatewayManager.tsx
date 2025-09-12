
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CreditCard, IndianRupee, Smartphone, Building, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentGateway {
  id: string;
  name: string;
  type: 'razorpay' | 'payu' | 'paytm' | 'phonepe' | 'gpay' | 'upi';
  status: 'active' | 'inactive';
  fees: number; // percentage
  supportedMethods: string[];
}

export function PaymentGatewayManager() {
  const [gateways] = useState<PaymentGateway[]>([
    {
      id: "1",
      name: "Razorpay",
      type: "razorpay",
      status: "active",
      fees: 2.3,
      supportedMethods: ["Credit Card", "Debit Card", "UPI", "Net Banking", "Wallets"]
    },
    {
      id: "2", 
      name: "PayU",
      type: "payu",
      status: "inactive",
      fees: 2.5,
      supportedMethods: ["Credit Card", "Debit Card", "UPI", "Net Banking"]
    },
    {
      id: "3",
      name: "Paytm",
      type: "paytm", 
      status: "inactive",
      fees: 2.4,
      supportedMethods: ["UPI", "Paytm Wallet", "Net Banking"]
    },
    {
      id: "4",
      name: "PhonePe",
      type: "phonepe",
      status: "inactive", 
      fees: 1.9,
      supportedMethods: ["UPI", "PhonePe Wallet"]
    }
  ]);

  const { toast } = useToast();

  const handleGatewayToggle = (gatewayId: string, enabled: boolean) => {
    toast({
      title: "Gateway Status Updated",
      description: `Payment gateway ${enabled ? 'activated' : 'deactivated'} successfully`,
    });
  };

  const handleTestPayment = (gateway: PaymentGateway) => {
    toast({
      title: "Test Payment Initiated",
      description: `Testing ${gateway.name} integration...`,
    });
  };

  const getGatewayIcon = (type: PaymentGateway['type']) => {
    switch (type) {
      case 'razorpay':
        return <CreditCard className="h-5 w-5" />;
      case 'payu':
        return <Building className="h-5 w-5" />;
      case 'paytm':
      case 'phonepe':
        return <Smartphone className="h-5 w-5" />;
      default:
        return <IndianRupee className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Payment Gateway Management</h2>
        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
          <AlertCircle className="h-3 w-3 mr-1" />
          Backend Integration Required
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gateways.map((gateway) => (
          <Card key={gateway.id} className={`border-2 ${gateway.status === 'active' ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getGatewayIcon(gateway.type)}
                  <CardTitle className="text-lg">{gateway.name}</CardTitle>
                </div>
                <Badge variant={gateway.status === 'active' ? 'default' : 'secondary'}>
                  {gateway.status === 'active' ? <CheckCircle className="h-3 w-3 mr-1" /> : null}
                  {gateway.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Transaction Fee:</span>
                <span className="font-medium">{gateway.fees}%</span>
              </div>
              
              <div>
                <span className="text-sm font-medium">Supported Methods:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {gateway.supportedMethods.map((method) => (
                    <Badge key={method} variant="outline" className="text-xs">
                      {method}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor={`toggle-${gateway.id}`}>Enable Gateway</Label>
                <Switch 
                  id={`toggle-${gateway.id}`}
                  checked={gateway.status === 'active'}
                  onCheckedChange={(checked) => handleGatewayToggle(gateway.id, checked)}
                />
              </div>

              <div className="space-y-2">
                <Input placeholder="API Key" type="password" disabled />
                <Input placeholder="Secret Key" type="password" disabled />
              </div>

              <Button 
                onClick={() => handleTestPayment(gateway)}
                variant="outline" 
                className="w-full"
                disabled={gateway.status !== 'active'}
              >
                Test Integration
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Integration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-900">Backend Integration Required</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    To activate payment gateways, connect your project to Supabase for secure API key storage and payment processing.
                  </p>
                  <ul className="text-sm text-orange-700 mt-2 space-y-1">
                    <li>• Secure storage of gateway credentials</li>
                    <li>• Payment transaction logging</li>
                    <li>• Automatic fee calculation and notifications</li>
                    <li>• Integration with Indian payment providers</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
