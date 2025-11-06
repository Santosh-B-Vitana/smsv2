import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Download, Plus, Filter, DollarSign, TrendingUp, TrendingDown, Wallet, Receipt, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Data Models
interface Account {
  id: string;
  name: string;
  type: "ASSET" | "LIABILITY" | "EQUITY" | "INCOME" | "EXPENSE";
  parent_account_id?: string;
  balance: number;
}

interface Transaction {
  id: string;
  account_id: string;
  amount: number;
  type: "DEBIT" | "CREDIT";
  category_id: string;
  date: string;
  description: string;
  source: "FEE" | "STORE" | "PETTY_CASH" | "DONATION" | "OTHER";
  receipt_url?: string;
}

interface Category {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  budget?: number;
}

interface PettyCashEntry {
  id: string;
  date: string;
  amount: number;
  purpose: string;
  approved_by: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  receipt_url?: string;
}

interface StoreSale {
  id: string;
  date: string;
  amount: number;
  items: number;
  payment_method: string;
}

export function WalletManager() {
  const [showAddStoreIncome, setShowAddStoreIncome] = useState(false);

  // Handler for Add Store Income
  const handleAddStoreIncome = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const amount = Number((form.elements.namedItem("amount") as HTMLInputElement).value);
    const category = (form.elements.namedItem("category") as HTMLSelectElement).value;
    const account = (form.elements.namedItem("account") as HTMLSelectElement).value;
    const source = "STORE" as Transaction["source"];
    const date = (form.elements.namedItem("date") as HTMLInputElement).value;
    const description = (form.elements.namedItem("description") as HTMLInputElement).value;
    setTransactions(prev => [
      ...prev,
      {
        id: (prev.length + 1).toString(),
        account_id: account,
        amount,
        type: "CREDIT",
        category_id: category,
        date,
        description,
        source,
      },
    ]);
    setShowAddStoreIncome(false);
    toast({ title: "Success", description: "Store income added successfully" });
    form.reset();
  };
  const [showAddExpense, setShowAddExpense] = useState(false);

  // Handler for Add Expense
  const handleAddExpense = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const amount = Number((form.elements.namedItem("amount") as HTMLInputElement).value);
    const category = (form.elements.namedItem("category") as HTMLSelectElement).value;
    const account = (form.elements.namedItem("account") as HTMLSelectElement).value;
    const source = (form.elements.namedItem("source") as HTMLSelectElement).value as Transaction["source"];
    const date = (form.elements.namedItem("date") as HTMLInputElement).value;
    const description = (form.elements.namedItem("description") as HTMLInputElement).value;
    setTransactions(prev => [
      ...prev,
      {
        id: (prev.length + 1).toString(),
        account_id: account,
        amount,
        type: "DEBIT",
        category_id: category,
        date,
        description,
        source,
      },
    ]);
    setShowAddExpense(false);
    toast({ title: "Success", description: "Expense added successfully" });
    form.reset();
  };
  const { toast } = useToast();
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showPettyCash, setShowPettyCash] = useState(false);
  const [showAddIncome, setShowAddIncome] = useState(false);
  // Handler for Add Income
  const handleAddIncome = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const amount = Number((form.elements.namedItem("amount") as HTMLInputElement).value);
    const category = (form.elements.namedItem("category") as HTMLSelectElement).value;
    const account = (form.elements.namedItem("account") as HTMLSelectElement).value;
    const source = (form.elements.namedItem("source") as HTMLSelectElement).value as Transaction["source"];
    const date = (form.elements.namedItem("date") as HTMLInputElement).value;
    const description = (form.elements.namedItem("description") as HTMLInputElement).value;
    setTransactions(prev => [
      ...prev,
      {
        id: (prev.length + 1).toString(),
        account_id: account,
        amount,
        type: "CREDIT",
        category_id: category,
        date,
        description,
        source,
      },
    ]);
    setShowAddIncome(false);
    toast({ title: "Success", description: "Income added successfully" });
    form.reset();
  };

  // Mock data
  const [accounts] = useState<Account[]>([
    { id: "1", name: "Cash", type: "ASSET", balance: 150000 },
    { id: "2", name: "Bank Account", type: "ASSET", balance: 500000 },
    { id: "3", name: "Fee Income", type: "INCOME", balance: 800000 },
    { id: "4", name: "Store Income", type: "INCOME", balance: 50000 },
    { id: "5", name: "Salaries", type: "EXPENSE", balance: 200000 },
    { id: "6", name: "Utilities", type: "EXPENSE", balance: 30000 },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "1", account_id: "3", amount: 50000, type: "CREDIT", category_id: "1", date: "2025-01-10", description: "Student fees collection", source: "FEE" },
    { id: "2", account_id: "4", amount: 5000, type: "CREDIT", category_id: "2", date: "2025-01-11", description: "Store sales", source: "STORE" },
    { id: "3", account_id: "5", amount: 100000, type: "DEBIT", category_id: "3", date: "2025-01-12", description: "Staff salaries", source: "OTHER" },
    { id: "4", account_id: "6", amount: 5000, type: "DEBIT", category_id: "4", date: "2025-01-13", description: "Electricity bill", source: "OTHER" },
  ]);

  const [categories] = useState<Category[]>([
    { id: "1", name: "Student Fees", type: "INCOME", budget: 1000000 },
    { id: "2", name: "Store Sales", type: "INCOME", budget: 100000 },
    { id: "3", name: "Staff Salaries", type: "EXPENSE", budget: 250000 },
    { id: "4", name: "Utilities", type: "EXPENSE", budget: 50000 },
    { id: "5", name: "Stationery", type: "EXPENSE", budget: 20000 },
  ]);

  const [pettyCash, setPettyCash] = useState<PettyCashEntry[]>([
    { id: "1", date: "2025-01-10", amount: 500, purpose: "Office supplies", approved_by: "Principal", status: "APPROVED" },
    { id: "2", date: "2025-01-11", amount: 300, purpose: "Courier charges", approved_by: "Admin", status: "PENDING" },
  ]);

  const [storeSales] = useState<StoreSale[]>([
    { id: "1", date: "2025-01-10", amount: 2500, items: 15, payment_method: "Cash" },
    { id: "2", date: "2025-01-11", amount: 3200, items: 20, payment_method: "Card" },
  ]);

  // Calculate KPIs
  const totalIncome = transactions.filter(t => t.type === "CREDIT").reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "DEBIT").reduce((sum, t) => sum + t.amount, 0);
  const cashOnHand = accounts.filter(a => a.type === "ASSET").reduce((sum, a) => sum + a.balance, 0);
  const netIncome = totalIncome - totalExpense;

  const handleAddTransaction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newTransaction: Transaction = {
      id: String(transactions.length + 1),
      account_id: formData.get("account") as string,
      amount: Number(formData.get("amount")),
      type: formData.get("type") as "DEBIT" | "CREDIT",
      category_id: formData.get("category") as string,
      date: formData.get("date") as string,
      description: formData.get("description") as string,
      source: formData.get("source") as Transaction["source"],
    };

    setTransactions([...transactions, newTransaction]);
    setShowAddTransaction(false);
    toast({ title: "Success", description: "Transaction added successfully" });
  };

  const handleAddPettyCash = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newEntry: PettyCashEntry = {
      id: String(pettyCash.length + 1),
      date: formData.get("date") as string,
      amount: Number(formData.get("amount")),
      purpose: formData.get("purpose") as string,
      approved_by: formData.get("approved_by") as string,
      status: "PENDING",
    };

    setPettyCash([...pettyCash, newEntry]);
    setShowPettyCash(false);
    toast({ title: "Success", description: "Petty cash entry added" });
  };

  const incomeCategories = categories.filter(c => c.type === "INCOME");
  const expenseCategories = categories.filter(c => c.type === "EXPENSE");

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Finance & Ledger</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="petty-cash">Petty Cash</TabsTrigger>
          <TabsTrigger value="store-income">Store Income</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cash on Hand</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{cashOnHand.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total available</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">MTD Income</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">₹{totalIncome.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">MTD Expenses</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">₹{totalExpense.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Income</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={cn("text-2xl font-bold", netIncome >= 0 ? "text-green-600" : "text-red-600")}>
                  ₹{netIncome.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Income Sources Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incomeCategories.map((cat) => {
                  const amount = transactions
                    .filter(t => t.category_id === cat.id && t.type === "CREDIT")
                    .reduce((sum, t) => sum + t.amount, 0);
                  const percentage = cat.budget ? (amount / cat.budget) * 100 : 0;

                  return (
                    <div key={cat.id}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{cat.name}</span>
                        <span className="text-sm">₹{amount.toLocaleString()} / ₹{cat.budget?.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Input placeholder="Search transactions..." className="w-64" />
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <Dialog open={showAddTransaction} onOpenChange={setShowAddTransaction}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Transaction</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddTransaction} className="space-y-4">
                  <div>
                    <Label>Type</Label>
                    <Select name="type" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DEBIT">Debit (Expense)</SelectItem>
                        <SelectItem value="CREDIT">Credit (Income)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Account</Label>
                    <Select name="account" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map(acc => (
                          <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select name="category" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Source</Label>
                    <Select name="source" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FEE">Fee</SelectItem>
                        <SelectItem value="STORE">Store</SelectItem>
                        <SelectItem value="PETTY_CASH">Petty Cash</SelectItem>
                        <SelectItem value="DONATION">Donation</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Amount</Label>
                    <Input type="number" name="amount" required />
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input type="date" name="date" required />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea name="description" required />
                  </div>
                  <Button type="submit" className="w-full">Add Transaction</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      {categories.find(c => c.id === transaction.category_id)?.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{transaction.source}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={transaction.type === "CREDIT" ? "default" : "destructive"}>
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell className={cn("text-right font-medium", 
                      transaction.type === "CREDIT" ? "text-green-600" : "text-red-600")}>
                      ₹{transaction.amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Income Tab */}
        <TabsContent value="income" className="space-y-4">
          <div className="flex justify-end mb-2">
            <Dialog open={showAddIncome} onOpenChange={setShowAddIncome}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Income
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Income</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddIncome} className="space-y-4">
                  <div>
                    <Label>Account</Label>
                    <Select name="account" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.filter(acc => acc.type === "INCOME").map(acc => (
                          <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select name="category" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(cat => cat.type === "INCOME").map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Source</Label>
                    <Select name="source" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FEE">Fee</SelectItem>
                        <SelectItem value="STORE">Store</SelectItem>
                        <SelectItem value="PETTY_CASH">Petty Cash</SelectItem>
                        <SelectItem value="DONATION">Donation</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Amount</Label>
                    <Input type="number" name="amount" required />
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input type="date" name="date" required />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea name="description" required />
                  </div>
                  <Button type="submit" className="w-full">Add Income</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Income Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Actual</TableHead>
                    <TableHead>Difference</TableHead>
                    <TableHead>Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incomeCategories.map((cat) => {
                    const actual = transactions
                      .filter(t => t.category_id === cat.id && t.type === "CREDIT")
                      .reduce((sum, t) => sum + t.amount, 0);
                    const difference = actual - (cat.budget || 0);
                    const percentage = cat.budget ? (actual / cat.budget) * 100 : 0;

                    return (
                      <TableRow key={cat.id}>
                        <TableCell className="font-medium">{cat.name}</TableCell>
                        <TableCell>₹{cat.budget?.toLocaleString()}</TableCell>
                        <TableCell>₹{actual.toLocaleString()}</TableCell>
                        <TableCell className={difference >= 0 ? "text-green-600" : "text-red-600"}>
                          ₹{difference.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-muted rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              />
                            </div>
                            <span className="text-sm">{percentage.toFixed(0)}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses" className="space-y-4">
          <div className="flex justify-end mb-2">
            <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Expense</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddExpense} className="space-y-4">
                  <div>
                    <Label>Account</Label>
                    <Select name="account" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.filter(acc => acc.type === "EXPENSE").map(acc => (
                          <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select name="category" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(cat => cat.type === "EXPENSE").map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Source</Label>
                    <Select name="source" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FEE">Fee</SelectItem>
                        <SelectItem value="STORE">Store</SelectItem>
                        <SelectItem value="PETTY_CASH">Petty Cash</SelectItem>
                        <SelectItem value="DONATION">Donation</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Amount</Label>
                    <Input type="number" name="amount" required />
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input type="date" name="date" required />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea name="description" required />
                  </div>
                  <Button type="submit" className="w-full">Add Expense</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Expense Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Spent</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenseCategories.map((cat) => {
                    const spent = transactions
                      .filter(t => t.category_id === cat.id && t.type === "DEBIT")
                      .reduce((sum, t) => sum + t.amount, 0);
                    const remaining = (cat.budget || 0) - spent;
                    const percentage = cat.budget ? (spent / cat.budget) * 100 : 0;

                    return (
                      <TableRow key={cat.id}>
                        <TableCell className="font-medium">{cat.name}</TableCell>
                        <TableCell>₹{cat.budget?.toLocaleString()}</TableCell>
                        <TableCell>₹{spent.toLocaleString()}</TableCell>
                        <TableCell className={remaining >= 0 ? "text-green-600" : "text-red-600"}>
                          ₹{remaining.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-muted rounded-full h-2">
                              <div
                                className={cn("h-2 rounded-full", 
                                  percentage > 100 ? "bg-red-600" : "bg-primary")}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              />
                            </div>
                            <span className="text-sm">{percentage.toFixed(0)}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Store Income Tab */}
        <TabsContent value="store-income" className="space-y-4">
          <div className="flex justify-end mb-2">
            <Dialog open={showAddStoreIncome} onOpenChange={setShowAddStoreIncome}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Store Income
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Store Income</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddStoreIncome} className="space-y-4">
                  <div>
                    <Label>Account</Label>
                    <Select name="account" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.filter(acc => acc.type === "INCOME").map(acc => (
                          <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select name="category" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(cat => cat.type === "INCOME").map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Amount</Label>
                    <Input type="number" name="amount" required />
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input type="date" name="date" required />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea name="description" required />
                  </div>
                  <Button type="submit" className="w-full">Add Store Income</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Store Income</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.filter(t => t.source === "STORE" && t.type === "CREDIT").map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{accounts.find(a => a.id === t.account_id)?.name}</TableCell>
                      <TableCell>{categories.find(c => c.id === t.category_id)?.name}</TableCell>
                      <TableCell>₹{t.amount.toLocaleString()}</TableCell>
                      <TableCell>{t.date}</TableCell>
                      <TableCell>{t.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Petty Cash Tab */}
        <TabsContent value="petty-cash" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={showPettyCash} onOpenChange={setShowPettyCash}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Petty Cash Entry
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Petty Cash Request</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddPettyCash} className="space-y-4">
                  <div>
                    <Label>Date</Label>
                    <Input type="date" name="date" required />
                  </div>
                  <div>
                    <Label>Amount</Label>
                    <Input type="number" name="amount" required />
                  </div>
                  <div>
                    <Label>Purpose</Label>
                    <Textarea name="purpose" required />
                  </div>
                  <div>
                    <Label>Approved By</Label>
                    <Input name="approved_by" required />
                  </div>
                  <Button type="submit" className="w-full">Submit Request</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Approved By</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pettyCash.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{entry.purpose}</TableCell>
                    <TableCell>₹{entry.amount.toLocaleString()}</TableCell>
                    <TableCell>{entry.approved_by}</TableCell>
                    <TableCell>
                      <Badge variant={
                        entry.status === "APPROVED" ? "default" : 
                        entry.status === "PENDING" ? "outline" : "destructive"
                      }>
                        {entry.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Store Income Tab */}
        <TabsContent value="store-income" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Store Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Items Sold</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {storeSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.date}</TableCell>
                      <TableCell>{sale.items}</TableCell>
                      <TableCell>{sale.payment_method}</TableCell>
                      <TableCell className="text-right">₹{sale.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-24">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-6 w-6" />
                    <span>Ledger Report</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-24">
                  <div className="flex flex-col items-center gap-2">
                    <Receipt className="h-6 w-6" />
                    <span>Trial Balance</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-24">
                  <div className="flex flex-col items-center gap-2">
                    <DollarSign className="h-6 w-6" />
                    <span>P&L Statement</span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
