import { useState, useEffect } from "react";
import { Plus, Search, Filter, Eye, Users, BadgeCheck, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card as UICard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge as UIBadge } from "@/components/ui/badge";
import { mockApi, Staff } from "../../services/mockApi";
import { StaffForm } from "./StaffForm";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export function StaffList({ staff, refreshStaff }: { staff: Staff[]; refreshStaff: () => void }) {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (staffMember: Staff) => {
    setEditingStaff(staffMember);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      try {
        setLoading(true);
        await mockApi.deleteStaff(id);
        await refreshStaff();
        setLoading(false);
        toast({
          title: "Success",
          description: "Staff member deleted successfully",
        });
      } catch (error) {
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to delete staff member",
          variant: "destructive",
        });
      }
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      setLoading(true);
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await mockApi.updateStaff(id, { status: newStatus });
      await refreshStaff();
      setLoading(false);
      toast({
        title: "Success",
        description: `Staff status updated to ${newStatus}`,
      });
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to update staff status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-muted rounded w-1/4"></div>
        <div className="h-64 bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('staffList.title')}</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t('staffList.addStaff')}
        </Button>
      </div>

  <UICard>
        <CardHeader>
          <CardTitle>{t('staffList.directory')}</CardTitle>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('staffList.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              {t('staffList.filter')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('staffList.name')}</TableHead>
                <TableHead>{t('staffList.designation')}</TableHead>
                <TableHead>{t('staffList.department')}</TableHead>
                <TableHead>{t('staffList.contact')}</TableHead>
                <TableHead>{t('staffList.status')}</TableHead>
                <TableHead>{t('staffList.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    {t('staffList.noStaffFound')}
                  </TableCell>
                </TableRow>
              ) : (
                filteredStaff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{member.designation}</TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell>
                      <UIBadge variant={member.status === 'active' ? 'default' : 'secondary'}>
                        {member.status === 'active' ? t('common.active') : t('common.inactive')}
                      </UIBadge>
                    </TableCell>
                    <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/staff/${member.id}`)}
                            className="flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4 mr-1" /> {t('common.manage')}
                          </Button>
                        </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
  </UICard>

      {showForm && (
        <StaffForm
          staff={editingStaff}
          onClose={() => {
            setShowForm(false);
            setEditingStaff(null);
          }}
          onSuccess={async () => {
            setLoading(true);
            await refreshStaff();
            setLoading(false);
            setShowForm(false);
            setEditingStaff(null);
          }}
        />
      )}
    </div>
  );
}
