import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Book, BookOpen, AlertCircle, Plus, Search, Download, Upload, Filter, X, BookMarked, Calendar, FileText, Receipt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockApi } from "@/services/mockApi";
import { Skeleton } from "@/components/ui/skeleton";
import { PdfPreviewModal } from "@/components/common/PdfPreviewModal";
import { generateBookIssueReceipt, generateBookReturnReceipt } from "@/utils/libraryReceiptGenerator";
import { useSchool } from "@/contexts/SchoolContext";

interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publisher?: string;
  edition?: string;
  category: string;
  language?: string;
  pages?: number;
  publishedDate?: string;
  description?: string;
  totalCopies: number;
  availableCopies: number;
  location?: string;
  price?: number;
  status: 'available' | 'low' | 'unavailable';
}

interface BookIssue {
  id: string;
  bookId: string;
  bookTitle: string;
  studentId: string;
  studentName: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'issued' | 'returned' | 'overdue';
  fineAmount?: number;
}

interface Reservation {
  id: string;
  bookId: string;
  bookTitle: string;
  studentId: string;
  studentName: string;
  reservedAt: string;
  expiresAt: string;
  status: 'active' | 'fulfilled' | 'expired' | 'cancelled';
}

export function EnhancedLibraryManager() {
  const { toast } = useToast();
  const { schoolInfo } = useSchool();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [issues, setIssues] = useState<BookIssue[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [publisherFilter, setPublisherFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Dialogs
  const [addBookDialogOpen, setAddBookDialogOpen] = useState(false);
  const [reservationDialogOpen, setReservationDialogOpen] = useState(false);
  const [selectedBookForReservation, setSelectedBookForReservation] = useState<LibraryBook | null>(null);
  const [issueBookDialogOpen, setIssueBookDialogOpen] = useState(false);
  const [reserveBookDialogOpen, setReserveBookDialogOpen] = useState(false);
  const [editBookDialog, setEditBookDialog] = useState<LibraryBook | null>(null);
  const [returnDialog, setReturnDialog] = useState<BookIssue | null>(null);
  const [fineAmount, setFineAmount] = useState(0);
  const [editIssueDialog, setEditIssueDialog] = useState<BookIssue | null>(null);
  const [fulfillDialog, setFulfillDialog] = useState<Reservation | null>(null);
  const [editReservationDialog, setEditReservationDialog] = useState<Reservation | null>(null);
  
  // PDF preview modal
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfFileName, setPdfFileName] = useState("");
  
  // Issue/Reserve filters
  const [issueSearchTerm, setIssueSearchTerm] = useState("");
  const [issueClassFilter, setIssueClassFilter] = useState("all");
  const [issueSectionFilter, setIssueSectionFilter] = useState("all");
  const [reserveSearchTerm, setReserveSearchTerm] = useState("");
  const [reserveClassFilter, setReserveClassFilter] = useState("all");
  const [reserveSectionFilter, setReserveSectionFilter] = useState("all");
  
  // New book form
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    isbn: "",
    publisher: "",
    edition: "",
    category: "Fiction",
    language: "English",
    pages: "",
    publishedDate: "",
    description: "",
    totalCopies: "1",
    location: "Main Library",
    price: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const studentsList = await mockApi.getStudents();
      setStudents(studentsList);

      // Mock enhanced books data
      setBooks([
        {
          id: "BK001",
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          isbn: "978-0-06-112008-4",
          publisher: "J.B. Lippincott & Co.",
          edition: "50th Anniversary",
          category: "Fiction",
          language: "English",
          pages: 324,
          publishedDate: "1960-07-11",
          description: "A classic novel depicting racial injustice in the American South",
          totalCopies: 5,
          availableCopies: 3,
          location: "Main Library - Fiction Section",
          price: 499,
          status: 'available'
        },
        {
          id: "BK002",
          title: "Introduction to Algorithms",
          author: "Thomas H. Cormen",
          isbn: "978-0-262-03384-8",
          publisher: "MIT Press",
          edition: "3rd Edition",
          category: "Computer Science",
          language: "English",
          pages: 1312,
          publishedDate: "2009-07-31",
          description: "Comprehensive textbook on computer algorithms",
          totalCopies: 3,
          availableCopies: 1,
          location: "Main Library - Technical Section",
          price: 2499,
          status: 'low'
        },
        {
          id: "BK003",
          title: "Pride and Prejudice",
          author: "Jane Austen",
          isbn: "978-0-14-143951-8",
          publisher: "Penguin Classics",
          edition: "Reprint",
          category: "Fiction",
          language: "English",
          pages: 432,
          publishedDate: "1813-01-28",
          description: "A romantic novel of manners",
          totalCopies: 2,
          availableCopies: 0,
          location: "Main Library - Fiction Section",
          price: 299,
          status: 'unavailable'
        }
      ]);

      // Mock reservations
      setReservations([
        {
          id: "RES001",
          bookId: "BK003",
          bookTitle: "Pride and Prejudice",
          studentId: "STU001",
          studentName: "Aarav Gupta",
          reservedAt: "2024-01-15T10:00:00Z",
          expiresAt: "2024-01-22T10:00:00Z",
          status: 'active'
        }
      ]);

      // Mock existing issues
      setIssues([
        {
          id: "ISS001",
          bookId: "BK001",
          bookTitle: "To Kill a Mockingbird",
          studentId: "STU001",
          studentName: "Aarav Gupta",
          issueDate: "2024-01-10",
          dueDate: "2024-01-24",
          status: 'issued'
        }
      ]);

      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load library data",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const categories = Array.from(new Set(books.map(b => b.category)));
  const languages = Array.from(new Set(books.map(b => b.language || "English")));
  const publishers = Array.from(new Set(books.map(b => b.publisher || "Unknown")));

  const filteredBooks = books.filter(book => {
    const matchesSearch = !searchTerm || 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm);
    
    const matchesCategory = categoryFilter === "all" || book.category === categoryFilter;
    const matchesLanguage = languageFilter === "all" || book.language === languageFilter;
    const matchesPublisher = publisherFilter === "all" || book.publisher === publisherFilter;
    const matchesStatus = statusFilter === "all" || book.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesLanguage && matchesPublisher && matchesStatus;
  });

  const handleAddBook = () => {
    if (!newBook.title || !newBook.author || !newBook.isbn) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const book: LibraryBook = {
      id: `BK${Date.now()}`,
      title: newBook.title,
      author: newBook.author,
      isbn: newBook.isbn,
      publisher: newBook.publisher,
      edition: newBook.edition,
      category: newBook.category,
      language: newBook.language,
      pages: Number(newBook.pages) || undefined,
      publishedDate: newBook.publishedDate,
      description: newBook.description,
      totalCopies: Number(newBook.totalCopies),
      availableCopies: Number(newBook.totalCopies),
      location: newBook.location,
      price: Number(newBook.price) || undefined,
      status: 'available'
    };

    setBooks([...books, book]);
    setAddBookDialogOpen(false);
    setNewBook({
      title: "",
      author: "",
      isbn: "",
      publisher: "",
      edition: "",
      category: "Fiction",
      language: "English",
      pages: "",
      publishedDate: "",
      description: "",
      totalCopies: "1",
      location: "Main Library",
      price: ""
    });

    toast({
      title: "Success",
      description: "Book added successfully"
    });
  };

  const handleReserveBook = (studentId: string) => {
    if (!selectedBookForReservation) return;

    const student = students.find(s => s.id === studentId);
    const reservation: Reservation = {
      id: `RES${Date.now()}`,
      bookId: selectedBookForReservation.id,
      bookTitle: selectedBookForReservation.title,
      studentId: studentId,
      studentName: student?.name || "Unknown",
      reservedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active'
    };

    setReservations([...reservations, reservation]);
    setReservationDialogOpen(false);
    
    toast({
      title: "Success",
      description: `Book reserved for ${student?.name}`
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setLanguageFilter("all");
    setPublisherFilter("all");
    setStatusFilter("all");
  };
  
  const handleEditBook = (book: LibraryBook) => {
    setEditBookDialog(book);
  };
  
  const handleSaveEditBook = () => {
    if (!editBookDialog) return;
    setBooks(books.map(b => b.id === editBookDialog.id ? editBookDialog : b));
    setEditBookDialog(null);
    toast({ title: "Success", description: "Book updated successfully" });
  };
  
  const handleReserveFromCatalog = (book: LibraryBook) => {
    if (book.availableCopies > 0) {
      toast({ title: "Info", description: "Book is available, please issue it instead of reserving" });
      return;
    }
    setSelectedBookForReservation(book);
    setReservationDialogOpen(true);
  };
  
  const handleReturnBook = (issue: BookIssue) => {
    setReturnDialog(issue);
    // Calculate fine based on days overdue
    const today = new Date();
    const dueDate = new Date(issue.dueDate);
    const daysOverdue = Math.max(0, Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
    const calculatedFine = daysOverdue * 5; // ₹5 per day
    setFineAmount(calculatedFine);
  };
  
  const confirmReturn = () => {
    if (!returnDialog) return;
    
    const returnedIssue = {
      ...returnDialog,
      status: 'returned' as const,
      returnDate: new Date().toISOString().split('T')[0],
      fineAmount: fineAmount
    };
    
    setIssues(issues.map(i => i.id === returnDialog.id ? returnedIssue : i));
    setReturnDialog(null);
    
    // Generate return receipt
    try {
      const receiptDoc = generateBookReturnReceipt(
        {
          name: schoolInfo?.name || "School Library",
          address: schoolInfo?.address,
          phone: schoolInfo?.phone,
          email: schoolInfo?.email
        },
        {
          receiptNumber: `RET-${returnedIssue.id}`,
          date: new Date().toLocaleDateString(),
          studentName: returnedIssue.studentName,
          studentId: returnedIssue.studentId,
          bookTitle: returnedIssue.bookTitle,
          bookId: returnedIssue.bookId,
          issueDate: returnedIssue.issueDate,
          returnDate: returnedIssue.returnDate!,
          fineAmount: fineAmount
        }
      );

      const blob = receiptDoc.output('blob');
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setPdfFileName(`Library_Return_Receipt_${returnedIssue.id}.pdf`);
      setPdfPreviewOpen(true);
    } catch (error) {
      console.error('Error generating receipt:', error);
    }
    
    toast({ title: "Success", description: "Book returned successfully" });
  };
  
  const handleEditIssue = (issue: BookIssue) => {
    setEditIssueDialog(issue);
  };
  
  const handleSaveEditIssue = () => {
    if (!editIssueDialog) return;
    setIssues(issues.map(i => i.id === editIssueDialog.id ? editIssueDialog : i));
    setEditIssueDialog(null);
    toast({ title: "Success", description: "Issue updated successfully" });
  };
  
  const handleFulfillReservation = (reservation: Reservation) => {
    setFulfillDialog(reservation);
  };
  
  const confirmFulfill = () => {
    if (!fulfillDialog) return;
    setReservations(reservations.map(r => r.id === fulfillDialog.id ? {
      ...r,
      status: 'fulfilled'
    } : r));
    setFulfillDialog(null);
    toast({ title: "Success", description: "Reservation fulfilled successfully" });
  };
  
  const handleEditReservation = (reservation: Reservation) => {
    setEditReservationDialog(reservation);
  };
  
  const handleSaveEditReservation = () => {
    if (!editReservationDialog) return;
    setReservations(reservations.map(r => r.id === editReservationDialog.id ? editReservationDialog : r));
    setEditReservationDialog(null);
    toast({ title: "Success", description: "Reservation updated successfully" });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Library Management</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Books
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={addBookDialogOpen} onOpenChange={setAddBookDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Book
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Book</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Title *</Label>
                  <Input value={newBook.title} onChange={(e) => setNewBook({...newBook, title: e.target.value})} />
                </div>
                <div>
                  <Label>Author *</Label>
                  <Input value={newBook.author} onChange={(e) => setNewBook({...newBook, author: e.target.value})} />
                </div>
                <div>
                  <Label>ISBN *</Label>
                  <Input value={newBook.isbn} onChange={(e) => setNewBook({...newBook, isbn: e.target.value})} />
                </div>
                <div>
                  <Label>Publisher</Label>
                  <Input value={newBook.publisher} onChange={(e) => setNewBook({...newBook, publisher: e.target.value})} />
                </div>
                <div>
                  <Label>Edition</Label>
                  <Input value={newBook.edition} onChange={(e) => setNewBook({...newBook, edition: e.target.value})} />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={newBook.category} onValueChange={(v) => setNewBook({...newBook, category: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fiction">Fiction</SelectItem>
                      <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Literature">Literature</SelectItem>
                      <SelectItem value="Reference">Reference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Language</Label>
                  <Select value={newBook.language} onValueChange={(v) => setNewBook({...newBook, language: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Pages</Label>
                  <Input type="number" value={newBook.pages} onChange={(e) => setNewBook({...newBook, pages: e.target.value})} />
                </div>
                <div>
                  <Label>Published Date</Label>
                  <Input type="date" value={newBook.publishedDate} onChange={(e) => setNewBook({...newBook, publishedDate: e.target.value})} />
                </div>
                <div>
                  <Label>Total Copies</Label>
                  <Input type="number" value={newBook.totalCopies} onChange={(e) => setNewBook({...newBook, totalCopies: e.target.value})} />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input value={newBook.location} onChange={(e) => setNewBook({...newBook, location: e.target.value})} />
                </div>
                <div>
                  <Label>Price (₹)</Label>
                  <Input type="number" value={newBook.price} onChange={(e) => setNewBook({...newBook, price: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <Label>Description</Label>
                  <Textarea value={newBook.description} onChange={(e) => setNewBook({...newBook, description: e.target.value})} rows={3} />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setAddBookDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddBook}>Add Book</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{books.reduce((sum, b) => sum + b.totalCopies, 0)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {books.reduce((sum, b) => sum + b.availableCopies, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Currently Issued</CardTitle>
            <BookMarked className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {issues.filter(i => i.status === 'issued').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {issues.filter(i => i.status === 'overdue').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="catalog">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="catalog">Book Catalog</TabsTrigger>
          <TabsTrigger value="issues">Current Issues</TabsTrigger>
          <TabsTrigger value="reservations">Reservations</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by title, author, or ISBN..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  
                  <Select value={languageFilter} onValueChange={setLanguageFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Languages</SelectItem>
                      {languages.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="low">Low Stock</SelectItem>
                      <SelectItem value="unavailable">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>

                  {(searchTerm || categoryFilter !== "all" || languageFilter !== "all" || statusFilter !== "all") && (
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                      <X className="h-4 w-4 mr-1" />
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
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>ISBN</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Available/Total</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBooks.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell className="font-medium">{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell className="font-mono text-xs">{book.isbn}</TableCell>
                      <TableCell>{book.category}</TableCell>
                      <TableCell>{book.language}</TableCell>
                      <TableCell>
                        <span className={book.availableCopies === 0 ? "text-destructive font-medium" : ""}>
                          {book.availableCopies}/{book.totalCopies}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs">{book.location}</TableCell>
                      <TableCell>
                        <Badge variant={
                          book.status === 'available' ? 'default' :
                          book.status === 'low' ? 'secondary' : 'destructive'
                        }>
                          {book.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditBook(book)}>Edit</Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleReserveFromCatalog(book)}
                            disabled={book.availableCopies > 0}
                          >
                            Reserve
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={issueBookDialogOpen} onOpenChange={setIssueBookDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Issue Book
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Issue New Book</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label>Search Student</Label>
                      <Input 
                        placeholder="Search by name or ID..." 
                        value={issueSearchTerm}
                        onChange={(e) => setIssueSearchTerm(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Class</Label>
                      <Select value={issueClassFilter} onValueChange={setIssueClassFilter}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="1">Class 1</SelectItem>
                          <SelectItem value="2">Class 2</SelectItem>
                          <SelectItem value="3">Class 3</SelectItem>
                          <SelectItem value="4">Class 4</SelectItem>
                          <SelectItem value="5">Class 5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Section</Label>
                      <Select value={issueSectionFilter} onValueChange={setIssueSectionFilter}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Select Book</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a book" />
                      </SelectTrigger>
                      <SelectContent>
                        {books.filter(b => b.availableCopies > 0).map(book => (
                          <SelectItem key={book.id} value={book.id}>
                            {book.title} by {book.author} (Available: {book.availableCopies})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Select Student</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a student" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map(student => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name} - {student.class}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Issue Date</Label>
                      <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div>
                      <Label>Due Date</Label>
                      <Input type="date" />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIssueBookDialogOpen(false)}>Cancel</Button>
                    <Button onClick={() => {
                      toast({
                        title: "Success",
                        description: "Book issued successfully"
                      });
                      setIssueBookDialogOpen(false);
                    }}>Issue Book</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Current Book Issues</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="Search by student or book..." className="max-w-xs" />
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="1">Class 1</SelectItem>
                    <SelectItem value="2">Class 2</SelectItem>
                    <SelectItem value="3">Class 3</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sections</SelectItem>
                    <SelectItem value="A">Section A</SelectItem>
                    <SelectItem value="B">Section B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Return Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fine</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {issues.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell className="font-medium">{issue.bookTitle}</TableCell>
                      <TableCell>{issue.studentName}</TableCell>
                      <TableCell>{new Date(issue.issueDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(issue.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>{issue.returnDate ? new Date(issue.returnDate).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>
                        <Badge variant={
                          issue.status === 'issued' ? 'default' :
                          issue.status === 'overdue' ? 'destructive' : 'secondary'
                        }>
                          {issue.status}
                        </Badge>
                      </TableCell>
                      <TableCell>₹{issue.fineAmount || 0}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditIssue(issue)}>Edit</Button>
                          {issue.status !== 'returned' && (
                            <Button variant="outline" size="sm" onClick={() => handleReturnBook(issue)}>Return</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reservations" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={reserveBookDialogOpen} onOpenChange={setReserveBookDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Reserve Book
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Reserve Book</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label>Search Student</Label>
                      <Input 
                        placeholder="Search by name or ID..." 
                        value={reserveSearchTerm}
                        onChange={(e) => setReserveSearchTerm(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Class</Label>
                      <Select value={reserveClassFilter} onValueChange={setReserveClassFilter}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="1">Class 1</SelectItem>
                          <SelectItem value="2">Class 2</SelectItem>
                          <SelectItem value="3">Class 3</SelectItem>
                          <SelectItem value="4">Class 4</SelectItem>
                          <SelectItem value="5">Class 5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Section</Label>
                      <Select value={reserveSectionFilter} onValueChange={setReserveSectionFilter}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Select Book</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a book to reserve" />
                      </SelectTrigger>
                      <SelectContent>
                        {books.map(book => (
                          <SelectItem key={book.id} value={book.id}>
                            {book.title} by {book.author}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Select Student</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a student" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map(student => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name} - {student.class}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setReserveBookDialogOpen(false)}>Cancel</Button>
                    <Button onClick={() => {
                      toast({
                        title: "Success",
                        description: "Book reserved successfully"
                      });
                      setReserveBookDialogOpen(false);
                    }}>Reserve Book</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Active Reservations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="Search by student or book..." className="max-w-xs" />
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="1">Class 1</SelectItem>
                    <SelectItem value="2">Class 2</SelectItem>
                    <SelectItem value="3">Class 3</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sections</SelectItem>
                    <SelectItem value="A">Section A</SelectItem>
                    <SelectItem value="B">Section B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Reserved On</TableHead>
                    <TableHead>Expires On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.map((res) => (
                    <TableRow key={res.id}>
                      <TableCell className="font-medium">{res.bookTitle}</TableCell>
                      <TableCell>{res.studentName}</TableCell>
                      <TableCell>{new Date(res.reservedAt).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(res.expiresAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={res.status === 'active' ? 'default' : 'secondary'}>
                          {res.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditReservation(res)}>Edit</Button>
                          {res.status === 'active' && (
                            <Button variant="outline" size="sm" onClick={() => handleFulfillReservation(res)}>Fulfill</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Borrowing History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Return Date</TableHead>
                    <TableHead>Fine</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Mock data for borrowing history */}
                  <TableRow>
                    <TableCell className="font-medium">To Kill a Mockingbird</TableCell>
                    <TableCell>Aarav Gupta</TableCell>
                    <TableCell>01/10/2024</TableCell>
                    <TableCell>01/24/2024</TableCell>
                    <TableCell>01/22/2024</TableCell>
                    <TableCell>₹0</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Introduction to Algorithms</TableCell>
                    <TableCell>Ananya Sharma</TableCell>
                    <TableCell>11/15/2023</TableCell>
                    <TableCell>11/29/2023</TableCell>
                    <TableCell>11/28/2023</TableCell>
                    <TableCell>₹0</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Reservation Dialog */}
      <Dialog open={reservationDialogOpen} onOpenChange={setReservationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reserve Book: {selectedBookForReservation?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Student</Label>
              <Select onValueChange={handleReserveBook}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map(student => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} - {student.class}
                    </SelectItem>
                  ))
                  }
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Edit Book Dialog */}
      <Dialog open={!!editBookDialog} onOpenChange={() => setEditBookDialog(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
          </DialogHeader>
          {editBookDialog && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Title</Label>
                <Input value={editBookDialog.title} onChange={(e) => setEditBookDialog({...editBookDialog, title: e.target.value})} />
              </div>
              <div>
                <Label>Author</Label>
                <Input value={editBookDialog.author} onChange={(e) => setEditBookDialog({...editBookDialog, author: e.target.value})} />
              </div>
              <div>
                <Label>ISBN</Label>
                <Input value={editBookDialog.isbn} onChange={(e) => setEditBookDialog({...editBookDialog, isbn: e.target.value})} />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={editBookDialog.category} onValueChange={(v) => setEditBookDialog({...editBookDialog, category: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fiction">Fiction</SelectItem>
                    <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Total Copies</Label>
                <Input type="number" value={editBookDialog.totalCopies} onChange={(e) => setEditBookDialog({...editBookDialog, totalCopies: Number(e.target.value)})} />
              </div>
              <div>
                <Label>Available Copies</Label>
                <Input type="number" value={editBookDialog.availableCopies} onChange={(e) => setEditBookDialog({...editBookDialog, availableCopies: Number(e.target.value)})} />
              </div>
              <div className="col-span-2 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditBookDialog(null)}>Cancel</Button>
                <Button onClick={handleSaveEditBook}>Save</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Return Book Dialog */}
      <Dialog open={!!returnDialog} onOpenChange={() => setReturnDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Return Book</DialogTitle>
          </DialogHeader>
          {returnDialog && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Book:</span>
                  <span>{returnDialog.bookTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Student:</span>
                  <span>{returnDialog.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Issue Date:</span>
                  <span>{new Date(returnDialog.issueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Due Date:</span>
                  <span>{new Date(returnDialog.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
              <div>
                <Label>Fine Amount (₹)</Label>
                <Input 
                  type="number" 
                  value={fineAmount} 
                  onChange={(e) => setFineAmount(Number(e.target.value))}
                  placeholder="Auto-calculated: ₹5/day overdue"
                  disabled
                />
                {fineAmount > 0 && (
                  <p className="text-sm text-orange-600 mt-1">Late return fine will be collected</p>
                )}
              </div>
              {fineAmount > 0 && (
                <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <h3 className="font-semibold text-orange-900 dark:text-orange-200">Fine Applicable</h3>
                  </div>
                  <h3 className="font-semibold mb-2">Fine Receipt</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Student:</span>
                      <span>{returnDialog.studentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Book:</span>
                      <span>{returnDialog.bookTitle}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Fine Amount:</span>
                      <span>₹{fineAmount}</span>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setReturnDialog(null)}>Cancel</Button>
                {fineAmount > 0 && (
                  <Button variant="outline" onClick={() => window.print()}>Print Receipt</Button>
                )}
                <Button onClick={confirmReturn}>Confirm Return</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Edit Issue Dialog */}
      <Dialog open={!!editIssueDialog} onOpenChange={() => setEditIssueDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Issue</DialogTitle>
          </DialogHeader>
          {editIssueDialog && (
            <div className="space-y-4">
              <div>
                <Label>Due Date</Label>
                <Input 
                  type="date" 
                  value={editIssueDialog.dueDate} 
                  onChange={(e) => setEditIssueDialog({...editIssueDialog, dueDate: e.target.value})} 
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select 
                  value={editIssueDialog.status} 
                  onValueChange={(v: any) => setEditIssueDialog({...editIssueDialog, status: v})}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="issued">Issued</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditIssueDialog(null)}>Cancel</Button>
                <Button onClick={handleSaveEditIssue}>Save</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Fulfill Reservation Dialog */}
      <Dialog open={!!fulfillDialog} onOpenChange={() => setFulfillDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fulfill Reservation</DialogTitle>
          </DialogHeader>
          {fulfillDialog && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Book:</span>
                  <span>{fulfillDialog.bookTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Student:</span>
                  <span>{fulfillDialog.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Reserved On:</span>
                  <span>{new Date(fulfillDialog.reservedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to fulfill this reservation? The book will be issued to the student.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setFulfillDialog(null)}>Cancel</Button>
                <Button onClick={confirmFulfill}>Fulfill</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Edit Reservation Dialog */}
      <Dialog open={!!editReservationDialog} onOpenChange={() => setEditReservationDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Reservation</DialogTitle>
          </DialogHeader>
          {editReservationDialog && (
            <div className="space-y-4">
              <div>
                <Label>Expires On</Label>
                <Input 
                  type="date" 
                  value={editReservationDialog.expiresAt.split('T')[0]} 
                  onChange={(e) => setEditReservationDialog({...editReservationDialog, expiresAt: e.target.value})} 
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select 
                  value={editReservationDialog.status} 
                  onValueChange={(v: any) => setEditReservationDialog({...editReservationDialog, status: v})}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="fulfilled">Fulfilled</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditReservationDialog(null)}>Cancel</Button>
                <Button onClick={handleSaveEditReservation}>Save</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* PDF Preview Modal */}
      <PdfPreviewModal
        open={pdfPreviewOpen}
        onClose={() => setPdfPreviewOpen(false)}
        pdfUrl={pdfUrl}
        fileName={pdfFileName}
      />
    </div>
  );
}
