import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, ShoppingCart, AlertTriangle, DollarSign, Pencil, Trash2, Receipt, Eye, Search, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { PdfPreviewModal } from "@/components/common/PdfPreviewModal";
import { generateStoreReceipt } from "@/utils/storeReceiptGenerator";
import { useSchool } from "@/contexts/SchoolContext";

interface Item {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  reorderLevel: number;
}

interface Sale {
  id: string;
  date: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  paymentMethod: string;
  studentName?: string;
  studentClass?: string;
  parentName?: string;
  parentPhone?: string;
}

export function StoreManager() {
  const [activeTab, setActiveTab] = useState("pos");
  const { t, language } = useLanguage();
  const { schoolInfo } = useSchool();
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddSale, setShowAddSale] = useState(false);
  
  // Inventory filters
  const [inventorySearch, setInventorySearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // Sales filters
  const [salesSearch, setSalesSearch] = useState("");
  const [salesDateFilter, setSalesDateFilter] = useState("");
  
  // Sale actions
  const [editSale, setEditSale] = useState<Sale | null>(null);
  const [showEditSaleDialog, setShowEditSaleDialog] = useState(false);
  const [deleteSaleId, setDeleteSaleId] = useState<string | null>(null);
  const [showDeleteSaleDialog, setShowDeleteSaleDialog] = useState(false);
  const [receiptSale, setReceiptSale] = useState<Sale | null>(null);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  
  // PDF preview modal
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfFileName, setPdfFileName] = useState("");

  const [items, setItems] = useState<Item[]>([
    { id: "1", sku: "UNI-001", name: "School Uniform (M)", category: "Uniform", price: 500, stock: 50, reorderLevel: 10 },
    { id: "2", sku: "BOOK-001", name: "Mathematics Textbook", category: "Books", price: 300, stock: 5, reorderLevel: 10 },
    { id: "3", sku: "STAT-001", name: "Notebook Pack (5)", category: "Stationery", price: 100, stock: 100, reorderLevel: 20 },
    { id: "4", sku: "UNI-002", name: "School Tie", category: "Uniform", price: 150, stock: 75, reorderLevel: 15 },
    { id: "5", sku: "STAT-002", name: "Pen Set (10)", category: "Stationery", price: 50, stock: 200, reorderLevel: 30 },
  ]);

  const [sales, setSales] = useState<Sale[]>([
    {
      id: "1",
      date: "2025-01-10",
      items: [{ name: "School Uniform (M)", qty: 2, price: 500 }],
      total: 1000,
      paymentMethod: "Cash",
    },
  ]);

  const [newSale, setNewSale] = useState({
    items: [{ itemId: "", qty: 1, price: 0 }],
    paymentMethod: "Cash",
    studentId: "",
    studentName: "",
    studentClass: "",
    studentSection: "",
    parentName: "",
    parentPhone: "",
  });

  const lowStockItems = items.filter(i => i.stock <= i.reorderLevel);
  const totalInventoryValue = items.reduce((sum, i) => sum + (i.price * i.stock), 0);
  const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
  
  // Filter inventory
  const filteredItems = items.filter(item => {
    const matchesSearch = !inventorySearch || 
      item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      item.sku.toLowerCase().includes(inventorySearch.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  
  // Filter sales
  const filteredSales = sales.filter(sale => {
    const matchesSearch = !salesSearch || 
      sale.studentName?.toLowerCase().includes(salesSearch.toLowerCase()) ||
      sale.parentName?.toLowerCase().includes(salesSearch.toLowerCase()) ||
      sale.id.toLowerCase().includes(salesSearch.toLowerCase());
    const matchesDate = !salesDateFilter || sale.date === salesDateFilter;
    return matchesSearch && matchesDate;
  });

  const handleAddSale = () => {
    const saleItems = newSale.items
      .filter(si => si.itemId)
      .map(si => {
        const item = items.find(i => i.id === si.itemId);
        return {
          name: item?.name || "",
          qty: si.qty,
          price: item?.price || 0,
        };
      });

    if (saleItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one item to the sale",
        variant: "destructive",
      });
      return;
    }

    const total = saleItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const sale: Sale = {
      id: `SALE${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      items: saleItems,
      total,
      paymentMethod: newSale.paymentMethod,
      studentName: newSale.studentName,
      studentClass: newSale.studentClass,
      parentName: newSale.parentName,
      parentPhone: newSale.parentPhone,
    };

    setSales([sale, ...sales]);
    
    // Update stock
    const updatedItems = [...items];
    newSale.items.forEach(si => {
      const itemIndex = updatedItems.findIndex(i => i.id === si.itemId);
      if (itemIndex !== -1) {
        updatedItems[itemIndex].stock -= si.qty;
      }
    });
    setItems(updatedItems);

    setShowAddSale(false);
    setNewSale({
      items: [{ itemId: "", qty: 1, price: 0 }],
      paymentMethod: "Cash",
      studentId: "",
      studentName: "",
      studentClass: "",
      studentSection: "",
      parentName: "",
      parentPhone: "",
    });

    toast({
      title: "Success",
      description: `Sale recorded: ₹${total.toLocaleString()}`,
    });

    // Auto-generate and show receipt
    setTimeout(() => handleViewReceipt(sale), 300);
  };

  const addSaleItem = () => {
    setNewSale({
      ...newSale,
      items: [...newSale.items, { itemId: "", qty: 1, price: 0 }],
    });
  };

  const updateSaleItem = (index: number, field: string, value: any) => {
    const updatedItems = [...newSale.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setNewSale({ ...newSale, items: updatedItems });
  };

  const removeSaleItem = (index: number) => {
    const updatedItems = newSale.items.filter((_, i) => i !== index);
    setNewSale({ ...newSale, items: updatedItems });
  };

  // Edit item handler
  const handleEditItem = (item: Item) => {
    setEditItem(item);
    setShowEditDialog(true);
  };

  // Save edited item
  const handleSaveEdit = () => {
    if (!editItem) return;
    setItems(items.map(i => i.id === editItem.id ? editItem : i));
    setShowEditDialog(false);
    toast({ title: "Item updated", description: `${editItem.name} updated successfully.` });
  };

  // Delete item handler
  const handleDeleteItem = (id: string) => {
    setDeleteItemId(id);
    setShowDeleteDialog(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (!deleteItemId) return;
    setItems(items.filter(i => i.id !== deleteItemId));
    setShowDeleteDialog(false);
    toast({ title: "Item deleted", description: `Item removed from inventory.` });
  };
  
  // Sale handlers
  const handleEditSale = (sale: Sale) => {
    setEditSale(sale);
    setShowEditSaleDialog(true);
  };
  
  const handleSaveSaleEdit = () => {
    if (!editSale) return;
    setSales(sales.map(s => s.id === editSale.id ? editSale : s));
    setShowEditSaleDialog(false);
    toast({ title: "Sale updated", description: "Sale updated successfully." });
  };
  
  const handleDeleteSale = (id: string) => {
    setDeleteSaleId(id);
    setShowDeleteSaleDialog(true);
  };
  
  const confirmDeleteSale = () => {
    if (!deleteSaleId) return;
    setSales(sales.filter(s => s.id !== deleteSaleId));
    setShowDeleteSaleDialog(false);
    toast({ title: "Sale deleted", description: "Sale removed from records." });
  };
  
  const handleViewReceipt = (sale: Sale) => {
    try {
      const receiptDoc = generateStoreReceipt(
        {
          name: schoolInfo?.name || "School Store",
          address: schoolInfo?.address,
          phone: schoolInfo?.phone,
          email: schoolInfo?.email
        },
        {
          receiptNumber: sale.id,
          date: sale.date,
          customerName: sale.studentName || sale.parentName,
          customerPhone: sale.parentPhone,
          items: sale.items,
          total: sale.total,
          paymentMethod: sale.paymentMethod
        }
      );

      const blob = receiptDoc.output('blob');
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setPdfFileName(`Store_Receipt_${sale.id}.pdf`);
      setPdfPreviewOpen(true);
    } catch (error) {
      console.error('Error generating receipt:', error);
      toast({
        title: "Error",
        description: "Failed to generate receipt",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-12">
      <div className="container mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {t('store.title')}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Manage inventory and record sales</p>
          </div>
          {activeTab === "inventory" && (
            <Dialog open={showAddItem} onOpenChange={setShowAddItem}>
              <DialogTrigger asChild>
                <Button className="shadow-lg hover:shadow-xl transition-all">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('store.addItem')}
                </Button>
              </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('store.addItem')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>{t('store.sku')}</Label>
                  <Input placeholder="e.g., UNI-001" />
                </div>
                <div>
                  <Label>{t('store.itemName')}</Label>
                  <Input />
                </div>
                <div>
                  <Label>{t('store.category')}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uniform">{t('store.uniform')}</SelectItem>
                      <SelectItem value="books">{t('store.books')}</SelectItem>
                      <SelectItem value="stationery">{t('store.stationery')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t('store.price')}</Label>
                  <Input type="number" />
                </div>
                <div>
                  <Label>{t('store.stock')}</Label>
                  <Input type="number" />
                </div>
                <Button className="w-full">{t('store.addItem')}</Button>
              </div>
            </DialogContent>
          </Dialog>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-primary shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{items.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Unique SKUs in inventory</p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-warning shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t('store.lowStockItems')}</CardTitle>
              <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{lowStockItems.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Need reordering</p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-primary shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t('store.totalValue')}</CardTitle>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">₹{totalInventoryValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Total inventory value</p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-success shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t('store.totalSales')}</CardTitle>
              <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">₹{totalSales.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">{sales.length} transactions</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-12 bg-muted/50">
            <TabsTrigger value="pos" className="text-base">Point of Sale</TabsTrigger>
            <TabsTrigger value="inventory" className="text-base">{t('store.inventory')}</TabsTrigger>
            <TabsTrigger value="sales" className="text-base">{t('store.sales')}</TabsTrigger>
          </TabsList>

          {/* POS Tab */}
          <TabsContent value="pos" className="space-y-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Product Selection */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Select Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <Input
                      placeholder="Search items by name or SKU..."
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                      className="mb-4"
                    />
                    
                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2">
                      {filteredItems.map((item) => (
                        <Card 
                          key={item.id} 
                          className="cursor-pointer hover:shadow-md transition-all hover:scale-[1.02] border-2 hover:border-primary/50"
                          onClick={() => {
                            const existingIndex = newSale.items.findIndex(si => si.itemId === item.id);
                            if (existingIndex >= 0) {
                              const updatedItems = [...newSale.items];
                              updatedItems[existingIndex].qty += 1;
                              setNewSale({ ...newSale, items: updatedItems });
                            } else {
                              setNewSale({
                                ...newSale,
                                items: [...newSale.items, { itemId: item.id, qty: 1, price: item.price }]
                              });
                            }
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm">{item.name}</h4>
                                <p className="text-xs text-muted-foreground">{item.sku}</p>
                              </div>
                              <Badge variant="outline" className="text-xs">{item.category}</Badge>
                            </div>
                            <div className="flex justify-between items-center mt-3">
                              <span className="text-lg font-bold text-primary">₹{item.price}</span>
                              <div className="flex items-center gap-2">
                                {item.stock === 0 ? (
                                  <Badge variant="destructive" className="text-xs">Out</Badge>
                                ) : item.stock <= item.reorderLevel ? (
                                  <Badge className="bg-warning/10 text-warning border-warning/30 text-xs">
                                    {item.stock} left
                                  </Badge>
                                ) : (
                                  <Badge className="bg-success/10 text-success border-success/30 text-xs">
                                    Stock: {item.stock}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right: Cart/Bill Summary */}
              <div className="space-y-4">
                <Card className="shadow-xl sticky top-4 border-2 border-primary/20">
                  <CardHeader className="bg-gradient-to-r from-primary to-primary/80">
                    <CardTitle className="flex items-center gap-2 text-white">
                      <ShoppingCart className="h-5 w-5" />
                      Current Bill
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    {/* Student/Parent Details */}
                    <div className="space-y-3 pb-4 border-b">
                      <div>
                        <Label className="text-xs">Student ID</Label>
                        <Input
                          placeholder="Student ID"
                          value={newSale.studentId}
                          onChange={(e) => setNewSale({ ...newSale, studentId: e.target.value })}
                          className="h-9"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Student Name</Label>
                          <Input
                            placeholder="Student name"
                            value={newSale.studentName}
                            onChange={(e) => setNewSale({ ...newSale, studentName: e.target.value })}
                            className="h-9"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Class</Label>
                          <Select value={newSale.studentClass} onValueChange={(value) => setNewSale({ ...newSale, studentClass: value })}>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Class 1</SelectItem>
                              <SelectItem value="2">Class 2</SelectItem>
                              <SelectItem value="3">Class 3</SelectItem>
                              <SelectItem value="4">Class 4</SelectItem>
                              <SelectItem value="5">Class 5</SelectItem>
                              <SelectItem value="6">Class 6</SelectItem>
                              <SelectItem value="7">Class 7</SelectItem>
                              <SelectItem value="8">Class 8</SelectItem>
                              <SelectItem value="9">Class 9</SelectItem>
                              <SelectItem value="10">Class 10</SelectItem>
                              <SelectItem value="11">Class 11</SelectItem>
                              <SelectItem value="12">Class 12</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Section</Label>
                          <Select value={newSale.studentSection} onValueChange={(value) => setNewSale({ ...newSale, studentSection: value })}>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select section" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A">Section A</SelectItem>
                              <SelectItem value="B">Section B</SelectItem>
                              <SelectItem value="C">Section C</SelectItem>
                              <SelectItem value="D">Section D</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Parent Phone</Label>
                          <Input
                            placeholder="Phone number"
                            value={newSale.parentPhone}
                            onChange={(e) => setNewSale({ ...newSale, parentPhone: e.target.value })}
                            className="h-9"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Parent Name</Label>
                        <Input
                          placeholder="Parent name"
                          value={newSale.parentName}
                          onChange={(e) => setNewSale({ ...newSale, parentName: e.target.value })}
                          className="h-9"
                        />
                      </div>
                    </div>

                    {/* Cart Items */}
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {newSale.items.filter(si => si.itemId).map((saleItem, index) => {
                        const item = items.find(i => i.id === saleItem.itemId);
                        if (!item) return null;
                        
                        return (
                          <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{item.name}</p>
                              <p className="text-xs text-muted-foreground">₹{item.price} each</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-7 w-7"
                                onClick={() => {
                                  if (saleItem.qty > 1) {
                                    updateSaleItem(index, 'qty', saleItem.qty - 1);
                                  } else {
                                    removeSaleItem(index);
                                  }
                                }}
                              >
                                -
                              </Button>
                              <span className="w-8 text-center font-semibold">{saleItem.qty}</span>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-7 w-7"
                                onClick={() => updateSaleItem(index, 'qty', saleItem.qty + 1)}
                              >
                                +
                              </Button>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => removeSaleItem(index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        );
                      })}
                      
                      {newSale.items.filter(si => si.itemId).length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-20" />
                          <p className="text-sm">No items added yet</p>
                          <p className="text-xs">Click on items to add to cart</p>
                        </div>
                      )}
                    </div>

                    {/* Total */}
                    <div className="pt-4 border-t space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Subtotal:</span>
                        <span className="text-lg font-bold">
                          ₹{newSale.items
                            .filter(si => si.itemId)
                            .reduce((sum, si) => {
                              const item = items.find(i => i.id === si.itemId);
                              return sum + (item?.price || 0) * si.qty;
                            }, 0)
                            .toLocaleString()}
                        </span>
                      </div>
                      
                      <div>
                        <Label className="text-xs">Payment Method</Label>
                        <Select value={newSale.paymentMethod} onValueChange={(value) => setNewSale({ ...newSale, paymentMethod: value })}>
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Cash">Cash</SelectItem>
                            <SelectItem value="Card">Card</SelectItem>
                            <SelectItem value="UPI">UPI</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button 
                        className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl"
                        onClick={handleAddSale}
                        disabled={newSale.items.filter(si => si.itemId).length === 0}
                      >
                        <Receipt className="mr-2 h-5 w-5" />
                        Complete Sale
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="inventory">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="flex-1 w-full">
                    <Input
                      placeholder={t('store.searchItems')}
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder={t('store.allCategories')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('store.allCategories')}</SelectItem>
                      <SelectItem value="Uniform">{t('store.uniform')}</SelectItem>
                      <SelectItem value="Books">{t('store.books')}</SelectItem>
                      <SelectItem value="Stationery">{t('store.stationery')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>{t('store.sku')}</TableHead>
                        <TableHead>{t('common.name')}</TableHead>
                        <TableHead>{t('store.category')}</TableHead>
                        <TableHead>{t('store.price')}</TableHead>
                        <TableHead>{t('store.stock')}</TableHead>
                        <TableHead>{t('common.status')}</TableHead>
                        <TableHead>{t('common.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/30">
                        <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.category}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold">₹{item.price}</TableCell>
                        <TableCell>{item.stock}</TableCell>
                        <TableCell>
                          {item.stock === 0 ? (
                            <Badge variant="destructive">Out of Stock</Badge>
                          ) : item.stock <= item.reorderLevel ? (
                            <Badge className="bg-warning/10 text-warning border-warning/30">Low Stock</Badge>
                          ) : (
                            <Badge className="bg-success/10 text-success border-success/30">In Stock</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="icon" variant="outline" onClick={() => handleEditItem(item)} title={t('common.edit')} className="h-8 w-8">
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="destructive" onClick={() => handleDeleteItem(item.id)} title={t('common.delete')} className="h-8 w-8">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>


          {/* Edit Item Dialog */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('common.edit')}</DialogTitle>
              </DialogHeader>
              {editItem && (
                <div className="space-y-4">
                  <div>
                    <Label>{t('store.sku')}</Label>
                    <Input value={editItem.sku} onChange={e => setEditItem({ ...editItem, sku: e.target.value })} />
                  </div>
                  <div>
                    <Label>{t('store.itemName')}</Label>
                    <Input value={editItem.name} onChange={e => setEditItem({ ...editItem, name: e.target.value })} />
                  </div>
                  <div>
                    <Label>{t('store.category')}</Label>
                    <Select value={editItem.category} onValueChange={v => setEditItem({ ...editItem, category: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Uniform">{t('store.uniform')}</SelectItem>
                        <SelectItem value="Books">{t('store.books')}</SelectItem>
                        <SelectItem value="Stationery">{t('store.stationery')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{t('store.price')}</Label>
                    <Input type="number" value={editItem.price} onChange={e => setEditItem({ ...editItem, price: Number(e.target.value) })} />
                  </div>
                  <div>
                    <Label>{t('store.stock')}</Label>
                    <Input type="number" value={editItem.stock} onChange={e => setEditItem({ ...editItem, stock: Number(e.target.value) })} />
                  </div>
                  <div>
                    <Label>{t('store.reorderLevel')}</Label>
                    <Input type="number" value={editItem.reorderLevel} onChange={e => setEditItem({ ...editItem, reorderLevel: Number(e.target.value) })} />
                  </div>
                  <div>
                    <Label>{t('common.status')}</Label>
                    <Select
                      value={editItem.stock <= editItem.reorderLevel ? (editItem.stock === 0 ? "Out of Stock" : "Low Stock") : "In Stock"}
                      onValueChange={v => {
                        let newStock = editItem.stock;
                        if (v === "Out of Stock") newStock = 0;
                        else if (v === "Low Stock") newStock = Math.max(1, editItem.reorderLevel);
                        else if (v === "In Stock") newStock = Math.max(editItem.reorderLevel + 1, editItem.stock || 1);
                        setEditItem({ ...editItem, stock: newStock });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="In Stock">In Stock</SelectItem>
                        <SelectItem value="Low Stock">Low Stock</SelectItem>
                        <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveEdit}>Save</Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Item</DialogTitle>
              </DialogHeader>
              <div>Are you sure you want to delete this item from inventory?</div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={showAddSale} onOpenChange={setShowAddSale}>
              <DialogTrigger asChild>
                <Button variant="default">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Record Sale
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto">
                <DialogHeader className="border-b pb-4">
                  <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                    <ShoppingCart className="h-6 w-6 text-primary" />
                    New Sale Transaction
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {/* Student/Parent Information Section */}
                  <div className="bg-muted/30 p-4 rounded-lg space-y-4">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Student & Parent Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Student ID</Label>
                        <Input 
                          value={newSale.studentId}
                          onChange={(e) => setNewSale({...newSale, studentId: e.target.value})}
                          placeholder="Enter student ID"
                        />
                      </div>
                      <div>
                        <Label>Student Name</Label>
                        <Input 
                          value={newSale.studentName}
                          onChange={(e) => setNewSale({...newSale, studentName: e.target.value})}
                          placeholder="Enter student name"
                        />
                      </div>
                      <div>
                        <Label>Class</Label>
                        <Select value={newSale.studentClass} onValueChange={(value) => setNewSale({...newSale, studentClass: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Class 1</SelectItem>
                            <SelectItem value="2">Class 2</SelectItem>
                            <SelectItem value="3">Class 3</SelectItem>
                            <SelectItem value="4">Class 4</SelectItem>
                            <SelectItem value="5">Class 5</SelectItem>
                            <SelectItem value="6">Class 6</SelectItem>
                            <SelectItem value="7">Class 7</SelectItem>
                            <SelectItem value="8">Class 8</SelectItem>
                            <SelectItem value="9">Class 9</SelectItem>
                            <SelectItem value="10">Class 10</SelectItem>
                            <SelectItem value="11">Class 11</SelectItem>
                            <SelectItem value="12">Class 12</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Section</Label>
                        <Select value={newSale.studentSection} onValueChange={(value) => setNewSale({...newSale, studentSection: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select section" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">Section A</SelectItem>
                            <SelectItem value="B">Section B</SelectItem>
                            <SelectItem value="C">Section C</SelectItem>
                            <SelectItem value="D">Section D</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Parent Name</Label>
                        <Input 
                          value={newSale.parentName}
                          onChange={(e) => setNewSale({...newSale, parentName: e.target.value})}
                          placeholder="Enter parent name"
                        />
                      </div>
                      <div>
                        <Label>Parent Phone Number</Label>
                        <Input 
                          value={newSale.parentPhone}
                          onChange={(e) => setNewSale({...newSale, parentPhone: e.target.value})}
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Items Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Items</h3>
                      <Button variant="outline" size="sm" onClick={addSaleItem}>
                        <Plus className="h-3 w-3 mr-1" />
                        Add Item
                      </Button>
                    </div>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                      {newSale.items.map((item, index) => {
                        const selectedItem = items.find(i => i.id === item.itemId);
                        const itemTotal = (selectedItem?.price || 0) * item.qty;
                        return (
                          <div key={index} className="flex gap-2 items-start bg-card p-3 rounded-lg border">
                            <div className="flex-1 grid grid-cols-3 gap-2">
                              <div className="col-span-2">
                                <Label className="text-xs">Item</Label>
                                <Select 
                                  value={item.itemId} 
                                  onValueChange={(v) => updateSaleItem(index, 'itemId', v)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select item" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {items.filter(i => i.stock > 0).map(i => (
                                      <SelectItem key={i.id} value={i.id}>
                                        {i.name} - ₹{i.price} (Stock: {i.stock})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="text-xs">Quantity</Label>
                                <Input 
                                  type="number" 
                                  min="1"
                                  max={selectedItem?.stock || 1}
                                  value={item.qty}
                                  onChange={(e) => updateSaleItem(index, 'qty', parseInt(e.target.value) || 1)}
                                />
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1 min-w-[120px]">
                              <Label className="text-xs">Subtotal</Label>
                              <div className="text-lg font-semibold">₹{itemTotal.toLocaleString()}</div>
                            </div>
                            {newSale.items.length > 1 && (
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => removeSaleItem(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Payment Section */}
                  <div className="bg-muted/30 p-4 rounded-lg space-y-4">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Payment Details</h3>
                    <div>
                      <Label>Payment Method</Label>
                      <Select value={newSale.paymentMethod} onValueChange={(v) => setNewSale({...newSale, paymentMethod: v})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cash">💵 Cash</SelectItem>
                          <SelectItem value="Card">💳 Card</SelectItem>
                          <SelectItem value="UPI">📱 UPI</SelectItem>
                          <SelectItem value="Online">🌐 Online</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Total Section */}
                  <div className="border-t-2 border-primary/20 pt-4">
                    <div className="flex justify-between items-center bg-primary/5 p-4 rounded-lg">
                      <span className="text-xl font-semibold">Grand Total:</span>
                      <span className="text-3xl font-bold text-primary">
                        ₹{newSale.items.reduce((sum, si) => {
                          const item = items.find(i => i.id === si.itemId);
                          return sum + ((item?.price || 0) * si.qty);
                        }, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="outline" onClick={() => setShowAddSale(false)}>Cancel</Button>
                    <Button onClick={handleAddSale} variant="default">
                      <Receipt className="h-4 w-4 mr-2" />
                      Complete Sale & Print Receipt
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <CardTitle className="flex-1">Sales History</CardTitle>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by student, parent, or ID..."
                      value={salesSearch}
                      onChange={(e) => setSalesSearch(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      value={salesDateFilter}
                      onChange={(e) => setSalesDateFilter(e.target.value)}
                      className="pl-8 w-40"
                    />
                  </div>
                  {(salesSearch || salesDateFilter) && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSalesSearch("");
                        setSalesDateFilter("");
                      }}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Student/Parent</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.date}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {sale.studentName && <div className="font-medium">{sale.studentName} {sale.studentClass && `(${sale.studentClass})`}</div>}
                          {sale.parentName && <div className="text-muted-foreground">{sale.parentName}</div>}
                          {sale.parentPhone && <div className="text-muted-foreground text-xs">{sale.parentPhone}</div>}
                          {!sale.studentName && !sale.parentName && "Walk-in"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {sale.items.map((item, i) => (
                            <div key={i} className="text-sm">
                              {item.name} x{item.qty}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{sale.paymentMethod}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">₹{sale.total.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="outline" onClick={() => handleEditSale(sale)} title="Edit Sale">
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="default" onClick={() => handleViewReceipt(sale)} title="View Receipt">
                            <Receipt className="w-3 h-3 mr-1" />
                            Receipt
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteSale(sale.id)} title="Delete Sale">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          {/* Edit Sale Dialog */}
          <Dialog open={showEditSaleDialog} onOpenChange={setShowEditSaleDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Sale</DialogTitle>
              </DialogHeader>
              {editSale && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Student Name</Label>
                      <Input value={editSale.studentName || ""} onChange={e => setEditSale({ ...editSale, studentName: e.target.value })} />
                    </div>
                    <div>
                      <Label>Class</Label>
                      <Input value={editSale.studentClass || ""} onChange={e => setEditSale({ ...editSale, studentClass: e.target.value })} />
                    </div>
                    <div>
                      <Label>Parent Name</Label>
                      <Input value={editSale.parentName || ""} onChange={e => setEditSale({ ...editSale, parentName: e.target.value })} />
                    </div>
                    <div>
                      <Label>Parent Phone</Label>
                      <Input value={editSale.parentPhone || ""} onChange={e => setEditSale({ ...editSale, parentPhone: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label>Payment Method</Label>
                    <Select value={editSale.paymentMethod} onValueChange={v => setEditSale({ ...editSale, paymentMethod: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Card">Card</SelectItem>
                        <SelectItem value="UPI">UPI</SelectItem>
                        <SelectItem value="Online">Online</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowEditSaleDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveSaleEdit}>Save</Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Delete Sale Dialog */}
          <Dialog open={showDeleteSaleDialog} onOpenChange={setShowDeleteSaleDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Sale</DialogTitle>
              </DialogHeader>
              <div>Are you sure you want to delete this sale record?</div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowDeleteSaleDialog(false)}>Cancel</Button>
                <Button variant="destructive" onClick={confirmDeleteSale}>Delete</Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Receipt Dialog */}
          <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Sale Receipt</DialogTitle>
              </DialogHeader>
              {receiptSale && (
                <div className="space-y-4" id="receipt-print-area">
                  <div className="text-center border-b pb-4">
                    <h2 className="text-2xl font-bold">School Store</h2>
                    <p className="text-sm text-muted-foreground">Receipt</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Receipt No:</span>
                      <span className="font-semibold">{receiptSale.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span>{receiptSale.date}</span>
                    </div>
                    {receiptSale.studentName && (
                      <div className="flex justify-between">
                        <span>Student:</span>
                        <span>{receiptSale.studentName} {receiptSale.studentClass && `(${receiptSale.studentClass})`}</span>
                      </div>
                    )}
                    {receiptSale.parentName && (
                      <div className="flex justify-between">
                        <span>Parent:</span>
                        <span>{receiptSale.parentName}</span>
                      </div>
                    )}
                    {receiptSale.parentPhone && (
                      <div className="flex justify-between">
                        <span>Phone:</span>
                        <span>{receiptSale.parentPhone}</span>
                      </div>
                    )}
                  </div>
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Items:</h3>
                    <div className="space-y-2">
                      {receiptSale.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span>{item.name} x{item.qty}</span>
                          <span>₹{(item.price * item.qty).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span>Payment Method:</span>
                      <Badge variant="outline">{receiptSale.paymentMethod}</Badge>
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-2">
                      <span>Total:</span>
                      <span>₹{receiptSale.total.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="text-center text-xs text-muted-foreground pt-4 border-t">
                    Thank you for your purchase!
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowReceiptDialog(false)}>Close</Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>

      {/* PDF Preview Modal */}
      <PdfPreviewModal
        open={pdfPreviewOpen}
        onClose={() => setPdfPreviewOpen(false)}
        pdfUrl={pdfUrl}
        fileName={pdfFileName}
      />
      </div>
    </div>
  );
}
