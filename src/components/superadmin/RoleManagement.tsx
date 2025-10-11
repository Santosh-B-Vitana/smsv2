import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Users, Shield } from 'lucide-react';
import { mockApi } from '@/services/mockApi';
import type { SchoolRole, UserRole, User, SchoolInfo } from '@/services/mockApi';

interface RoleManagementProps {
  schoolId: string;
}

export function RoleManagement({ schoolId }: RoleManagementProps) {
  const [roles, setRoles] = useState<SchoolRole[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [schools, setSchools] = useState<SchoolInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleDialog, setRoleDialog] = useState({ open: false, role: null as SchoolRole | null });
  const [assignDialog, setAssignDialog] = useState(false);

  const modules = [
    'students', 'staff', 'fees', 'attendance', 'reports', 'settings',
    'admissions', 'examinations', 'library', 'transport', 'health'
  ];

  useEffect(() => {
    loadData();
  }, [schoolId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rolesData, userRolesData, usersData, schoolsData] = await Promise.all([
        mockApi.getSchoolRoles(schoolId),
        mockApi.getUserRoles(schoolId),
        mockApi.getUsers(),
        mockApi.getSchools()
      ]);
      setRoles(rolesData);
      setUserRoles(userRolesData);
      setUsers(usersData);
      setSchools(schoolsData);
    } catch (error) {
      console.error('Error loading role data:', error);
    }
    setLoading(false);
  };

  const handleSaveRole = async (roleData: any) => {
    try {
      if (roleDialog.role) {
        await mockApi.updateSchoolRole(roleDialog.role.id, roleData);
      } else {
        await mockApi.addSchoolRole({ ...roleData, schoolId });
      }
      loadData();
      setRoleDialog({ open: false, role: null });
    } catch (error) {
      console.error('Error saving role:', error);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      await mockApi.deleteSchoolRole(roleId);
      loadData();
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  const handleAssignRole = async (assignment: any) => {
    try {
      await mockApi.assignUserRole({ ...assignment, schoolId });
      loadData();
      setAssignDialog(false);
    } catch (error) {
      console.error('Error assigning role:', error);
    }
  };

  const getUserRoleName = (userId: string) => {
    const userRole = userRoles.find(ur => ur.userId === userId);
    if (!userRole) return 'No Role';
    const role = roles.find(r => r.id === userRole.roleId);
    return role?.roleName || 'Unknown Role';
  };

  const selectedSchool = schools.find(s => s.id === schoolId);

  if (loading) {
    return <div className="p-6">Loading role management...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Role Management</h2>
          <p className="text-muted-foreground">
            Manage roles and permissions for {selectedSchool?.name || 'Selected School'}
          </p>
        </div>
      </div>

      <Tabs defaultValue="roles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Roles & Permissions
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Assignments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roles">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>School Roles</CardTitle>
              <Button onClick={() => setRoleDialog({ open: true, role: null })}>
                <Plus className="h-4 w-4 mr-2" />
                Add Role
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role Name</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.roleName}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(role.permissions).map(([module, perms]) => (
                            <Badge key={module} variant="outline" className="text-xs">
                              {module}: {perms.read ? 'R' : ''}{perms.write ? 'W' : ''}{perms.delete ? 'D' : ''}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setRoleDialog({ open: true, role })}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteRole(role.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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

        <TabsContent value="assignments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>User Role Assignments</CardTitle>
              <Button onClick={() => setAssignDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Assign Role
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{getUserRoleName(user.id)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <RoleDialog
        open={roleDialog.open}
        role={roleDialog.role}
        modules={modules}
        onClose={() => setRoleDialog({ open: false, role: null })}
        onSave={handleSaveRole}
      />

      <AssignRoleDialog
        open={assignDialog}
        users={users}
        roles={roles}
        onClose={() => setAssignDialog(false)}
        onAssign={handleAssignRole}
      />
    </div>
  );
}

function RoleDialog({ 
  open, 
  role, 
  modules, 
  onClose, 
  onSave 
}: {
  open: boolean;
  role: SchoolRole | null;
  modules: string[];
  onClose: () => void;
  onSave: (data: any) => void;
}) {
  const [roleName, setRoleName] = useState('');
  const [permissions, setPermissions] = useState<any>({});

  useEffect(() => {
    if (role) {
      setRoleName(role.roleName);
      setPermissions(role.permissions);
    } else {
      setRoleName('');
      setPermissions(
        modules.reduce((acc, module) => ({
          ...acc,
          [module]: { read: false, write: false, delete: false }
        }), {})
      );
    }
  }, [role, modules]);

  const handlePermissionChange = (module: string, permission: string, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [permission]: value
      }
    }));
  };

  const handleSave = () => {
    onSave({ roleName, permissions });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{role ? 'Edit Role' : 'Add New Role'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <Label htmlFor="roleName">Role Name</Label>
            <Input
              id="roleName"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Enter role name"
            />
          </div>

          <div>
            <Label>Permissions</Label>
            <div className="grid gap-4 mt-2">
              {modules.map((module) => (
                <Card key={module}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base capitalize">{module}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-6">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={permissions[module]?.read || false}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(module, 'read', checked)
                          }
                        />
                        <Label>Read</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={permissions[module]?.write || false}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(module, 'write', checked)
                          }
                        />
                        <Label>Write</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={permissions[module]?.delete || false}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(module, 'delete', checked)
                          }
                        />
                        <Label>Delete</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>Save Role</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AssignRoleDialog({ 
  open, 
  users, 
  roles, 
  onClose, 
  onAssign 
}: {
  open: boolean;
  users: User[];
  roles: SchoolRole[];
  onClose: () => void;
  onAssign: (assignment: any) => void;
}) {
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const handleAssign = () => {
    if (selectedUser && selectedRole) {
      onAssign({ userId: selectedUser, roleId: selectedRole });
      setSelectedUser('');
      setSelectedRole('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Role to User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Select User</Label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Select Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.roleName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleAssign} disabled={!selectedUser || !selectedRole}>
              Assign Role
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}