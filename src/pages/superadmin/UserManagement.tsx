import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Eye, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockApi, User } from "@/services/mockApi";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [addDialog, setAddDialog] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const data = await mockApi.getUsers();
    setUsers(data);
  };

  const handleAddUser = async () => {
    if (newUser.name && newUser.email && newUser.role) {
      await mockApi.addUser({
        name: newUser.name,
        email: newUser.email,
        role: newUser.role as any,
        status: 'active',
        schoolId: newUser.schoolId
      });
      setAddDialog(false);
      setNewUser({});
      fetchUsers();
    }
  };

  const handleEditUser = async () => {
    if (editUser) {
      await mockApi.updateUser(editUser.id, {
        name: editUser.name,
        email: editUser.email,
        role: editUser.role,
        status: editUser.status,
        schoolId: editUser.schoolId
      });
      setEditUser(null);
      fetchUsers();
    }
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    await mockApi.updateUser(user.id, { status: newStatus });
    fetchUsers();
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'staff': return 'bg-green-100 text-green-800';
      case 'parent': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container-academic py-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-display">User Management</h1>
          <p className="text-muted-foreground mt-2">Manage system users and their permissions</p>
        </div>
        <Button onClick={() => setAddDialog(true)} className="w-full sm:w-auto hover-lift">
          <Plus className="h-4 w-4 mr-2" /> Add User
        </Button>
      </div>
      
      <Card className="dashboard-card hover-glow">
        <CardHeader className="border-b">
          <CardTitle className="text-heading">System Users</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-6 border-b bg-muted/30">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table className="academic-table">
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Role</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Last Login</TableHead>
                  <TableHead className="font-semibold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {search ? 'No users found matching your search.' : 'No users found.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map(user => (
                    <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.status === 'active' ? 'default' : 'secondary'}
                          className={user.status === 'active' ? 'status-active' : 'status-inactive'}
                        >
                          {user.status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => setSelectedUser(user)}
                            className="hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => setEditUser(user)}
                            className="hover:bg-amber-50 hover:text-amber-600"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleToggleStatus(user)}
                            className={
                              user.status === 'active' 
                                ? 'hover:bg-red-50 hover:text-red-600' 
                                : 'hover:bg-green-50 hover:text-green-600'
                            }
                          >
                            {user.status === 'active' ? 
                              <Trash2 className="h-4 w-4" /> : 
                              <Plus className="h-4 w-4" />
                            }
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input 
              placeholder="Full Name *" 
              value={newUser.name || ''} 
              onChange={e => setNewUser(u => ({ ...u, name: e.target.value }))} 
            />
            <Input 
              type="email"
              placeholder="Email Address *" 
              value={newUser.email || ''} 
              onChange={e => setNewUser(u => ({ ...u, email: e.target.value }))} 
            />
            <Select onValueChange={value => setNewUser(u => ({ ...u, role: value as any }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select Role *" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="parent">Parent</SelectItem>
              </SelectContent>
            </Select>
            <Input 
              placeholder="School ID (optional)" 
              value={newUser.schoolId || ''} 
              onChange={e => setNewUser(u => ({ ...u, schoolId: e.target.value }))} 
            />
            <Button 
              onClick={handleAddUser} 
              className="w-full"
              disabled={!newUser.name || !newUser.email || !newUser.role}
            >
              Add User
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-3">
              <div><strong>Name:</strong> {selectedUser.name}</div>
              <div><strong>Email:</strong> {selectedUser.email}</div>
              <div><strong>Role:</strong> {selectedUser.role.replace('_', ' ').toUpperCase()}</div>
              <div><strong>Status:</strong> {selectedUser.status}</div>
              <div><strong>School ID:</strong> {selectedUser.schoolId || 'N/A'}</div>
              <div><strong>Created:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</div>
              <div><strong>Last Login:</strong> {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString() : 'Never'}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editUser && (
            <div className="space-y-4">
              <Input 
                placeholder="Full Name" 
                value={editUser.name} 
                onChange={e => setEditUser(u => u ? { ...u, name: e.target.value } : u)} 
              />
              <Input 
                type="email"
                placeholder="Email Address" 
                value={editUser.email} 
                onChange={e => setEditUser(u => u ? { ...u, email: e.target.value } : u)} 
              />
              <Select value={editUser.role} onValueChange={value => setEditUser(u => u ? { ...u, role: value as any } : u)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                </SelectContent>
              </Select>
              <Select value={editUser.status} onValueChange={value => setEditUser(u => u ? { ...u, status: value as any } : u)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Input 
                placeholder="School ID" 
                value={editUser.schoolId || ''} 
                onChange={e => setEditUser(u => u ? { ...u, schoolId: e.target.value } : u)} 
              />
              <Button onClick={handleEditUser} className="w-full">
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}