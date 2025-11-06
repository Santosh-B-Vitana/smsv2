import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { mockRoleApi, Role, Permission } from '@/services/mockRoleApi';
import { PERMISSION_MODULES } from '@/services/permissionModules';
import { Edit, Trash2, Plus, Save, Shield, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ConfigurationSettings() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [addError, setAddError] = useState('');
  const [showNewRoleDialog, setShowNewRoleDialog] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    mockRoleApi.getRoles().then((data) => {
      setRoles(data);
      setLoading(false);
    });
  }, []);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
  };

  const handlePermissionChange = (permName: string, key: keyof Permission, value: boolean) => {
    if (!selectedRole) return;
    setSelectedRole({
      ...selectedRole,
      permissions: selectedRole.permissions.map((p) =>
        p.name === permName ? { ...p, [key]: value } : p
      ),
    });
  };

  const handleSave = async () => {
    if (!selectedRole) return;
    setLoading(true);
    await mockRoleApi.updateRole(selectedRole.id, selectedRole);
    setRoles((prev) => prev.map((r) => (r.id === selectedRole.id ? selectedRole : r)));
    setLoading(false);
    toast({
      title: "Success",
      description: "Permissions updated successfully",
    });
  };

  const handleEditRole = (role: Role, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingRole(role);
    setNewRoleName(role.name);
    setNewRoleDesc(role.description || '');
    setShowNewRoleDialog(true);
  };

  const handleDeleteRole = async (role: Role) => {
    setLoading(true);
    try {
      await mockRoleApi.deleteRole(role.id);
      setRoles((prev) => prev.filter((r) => r.id !== role.id));
      if (selectedRole?.id === role.id) {
        setSelectedRole(null);
      }
      toast({
        title: "Success",
        description: `Role "${role.name}" deleted successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete role",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRoleToDelete(null);
    }
  };

  // All modules for permissions (flattened)
  const ALL_MODULES = PERMISSION_MODULES.flatMap(g => g.modules);

  // Ensure every role has all modules as permissions
  const ensureAllPermissions = (role: Role): Role => {
    const perms = [...role.permissions];
    ALL_MODULES.forEach((mod) => {
      if (!perms.find((p) => p.name === mod)) {
        perms.push({ name: mod, canView: false, canAdd: false, canEdit: false, canDelete: false });
      }
    });
    return { ...role, permissions: perms };
  };

  // On roles load, ensure all permissions
  React.useEffect(() => {
    if (roles.length) {
      setRoles(roles.map(ensureAllPermissions));
    }
    // eslint-disable-next-line
  }, [roles.length]);

  const handleAddRole = async () => {
    setAddError('');
    if (!newRoleName.trim()) {
      setAddError('Role name is required');
      return;
    }
    setLoading(true);
    
    if (editingRole) {
      // Update existing role
      const updatedRole = {
        ...editingRole,
        name: newRoleName,
        description: newRoleDesc,
      };
      await mockRoleApi.updateRole(editingRole.id, updatedRole);
      setRoles((prev) => prev.map((r) => (r.id === editingRole.id ? updatedRole : r)));
      if (selectedRole?.id === editingRole.id) {
        setSelectedRole(updatedRole);
      }
      toast({
        title: "Success",
        description: `Role "${newRoleName}" updated successfully`,
      });
    } else {
      // Add new role
      const newRole: Role = {
        id: Date.now().toString(),
        name: newRoleName,
        description: newRoleDesc,
        active: true,
        permissions: ALL_MODULES.map((mod) => ({
          name: mod,
          canView: mod === 'Dashboard',
          canAdd: false,
          canEdit: false,
          canDelete: false,
        })),
      };
      await mockRoleApi.addRole(newRole);
      setRoles((prev) => [...prev, newRole]);
      setSelectedRole(newRole);
      toast({
        title: "Success",
        description: `Role "${newRoleName}" created successfully`,
      });
    }
    
    setNewRoleName('');
    setNewRoleDesc('');
    setEditingRole(null);
    setShowNewRoleDialog(false);
    setLoading(false);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Role & Permissions Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure roles and their associated permissions
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Roles List */}
        <Card className="w-full lg:w-1/3 border-border">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Roles</CardTitle>
              <Button 
                size="sm" 
                onClick={() => {
                  setEditingRole(null);
                  setNewRoleName('');
                  setNewRoleDesc('');
                  setShowNewRoleDialog(true);
                }}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                New Role
              </Button>
            </div>
            <CardDescription>Select a role to manage permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {roles.map((role) => {
              const activePermissions = role.permissions.filter(p => p.canView || p.canAdd || p.canEdit || p.canDelete).length;
              return (
                <div
                  key={role.id}
                  className={`group p-4 rounded-lg cursor-pointer transition-all border ${
                    selectedRole?.id === role.id 
                      ? 'bg-primary/5 border-primary shadow-sm' 
                      : 'hover:bg-muted/50 border-border'
                  }`}
                  onClick={() => handleRoleSelect(role)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground flex items-center gap-2">
                        {role.name}
                        <Badge variant="secondary" className="text-xs">
                          {activePermissions} active
                        </Badge>
                      </div>
                      {role.description && (
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {role.description}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={(e) => handleEditRole(role, e)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRoleToDelete(role);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Add/Edit Role Dialog */}
        <Dialog open={showNewRoleDialog} onOpenChange={(open) => {
          setShowNewRoleDialog(open);
          if (!open) {
            setEditingRole(null);
            setNewRoleName('');
            setNewRoleDesc('');
            setAddError('');
          }
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingRole ? 'Edit Role' : 'Add New Role'}</DialogTitle>
              <DialogDescription>
                {editingRole ? 'Update the role details' : 'Create a new role with custom permissions'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Role Name</label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter role name"
                  value={newRoleName}
                  onChange={e => setNewRoleName(e.target.value)}
                  disabled={loading}
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description (Optional)</label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter description"
                  value={newRoleDesc}
                  onChange={e => setNewRoleDesc(e.target.value)}
                  disabled={loading}
                />
              </div>
              {addError && <div className="text-sm text-destructive">{addError}</div>}
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowNewRoleDialog(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddRole} 
                disabled={loading || !newRoleName.trim()}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {editingRole ? 'Update Role' : 'Create Role'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!roleToDelete} onOpenChange={(open) => !open && setRoleToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the role "{roleToDelete?.name}". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => roleToDelete && handleDeleteRole(roleToDelete)}
                disabled={loading}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {/* Permissions Panel */}
        <Card className="w-full lg:w-2/3 border-border">
          <CardHeader>
            <CardTitle className="text-xl">
              {selectedRole ? `Permissions for ${selectedRole.name}` : 'Permissions'}
            </CardTitle>
            <CardDescription>
              {selectedRole 
                ? 'Configure module access and actions for this role' 
                : 'Select a role to configure permissions'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedRole ? (
              <div className="space-y-4">
                <Accordion type="multiple" defaultValue={PERMISSION_MODULES.map((_, i) => `group-${i}`)} className="space-y-3">
                  {PERMISSION_MODULES.map((group, groupIndex) => {
                    const groupPermissions = selectedRole.permissions.filter(p => 
                      group.modules.includes(p.name)
                    );
                    const activeCount = groupPermissions.filter(p => 
                      p.canView || p.canAdd || p.canEdit || p.canDelete
                    ).length;
                    
                    return (
                      <AccordionItem 
                        key={group.group} 
                        value={`group-${groupIndex}`}
                        className="border border-border rounded-lg overflow-hidden"
                      >
                        <AccordionTrigger className="px-4 py-3 bg-muted/50 hover:bg-muted hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-2">
                            <span className="font-semibold text-foreground">{group.group}</span>
                            <Badge variant="secondary" className="text-xs">
                              {activeCount} / {group.modules.length} active
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-0">
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-border bg-muted/30">
                                  <th className="text-left p-3 font-medium text-muted-foreground">Module</th>
                                  <th className="p-3 font-medium text-muted-foreground">View</th>
                                  <th className="p-3 font-medium text-muted-foreground">Add</th>
                                  <th className="p-3 font-medium text-muted-foreground">Edit</th>
                                  <th className="p-3 font-medium text-muted-foreground">Delete</th>
                                </tr>
                              </thead>
                              <tbody>
                                {group.modules.map((mod) => {
                                  const perm = selectedRole.permissions.find((p) => p.name === mod) || { 
                                    name: mod, 
                                    canView: false, 
                                    canAdd: false, 
                                    canEdit: false, 
                                    canDelete: false 
                                  };
                                  const hasAnyPermission = perm.canView || perm.canAdd || perm.canEdit || perm.canDelete;
                                  
                                  return (
                                    <tr 
                                      key={mod} 
                                      className={`border-b border-border last:border-0 hover:bg-muted/30 transition-colors ${
                                        hasAnyPermission ? 'bg-primary/5' : ''
                                      }`}
                                    >
                                      <td className="p-3 font-medium">{mod}</td>
                                      {(['canView', 'canAdd', 'canEdit', 'canDelete'] as (keyof Permission)[]).map((key) => (
                                        <td key={key} className="text-center p-3">
                                          <div className="flex justify-center">
                                            <Switch
                                              checked={!!perm[key]}
                                              onCheckedChange={(val) => handlePermissionChange(mod, key, val as boolean)}
                                            />
                                          </div>
                                        </td>
                                      ))}
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
                
                <div className="flex justify-end pt-4 border-t border-border">
                  <Button 
                    onClick={handleSave} 
                    disabled={loading}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Permissions
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Shield className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground text-lg">Select a role to configure permissions</p>
                <p className="text-muted-foreground text-sm mt-1">Choose a role from the list to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
