import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockApi, Staff } from "@/services/mockApi";
import { ArrowLeft } from "lucide-react";

export default function StaffEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchStaff() {
      if (!id) return;
      const staffList = await mockApi.getStaff();
      const staffMember = staffList.find(s => s.id === id);
      setStaff(staffMember || null);
      setLoading(false);
    }
    fetchStaff();
  }, [id]);

  const handleChange = (field: keyof Staff, value: string | number) => {
    if (!staff) return;
    setStaff({ ...staff, [field]: value });
  };

  const handleSave = async () => {
    if (!staff) return;
    setSaving(true);
    await mockApi.updateStaff(staff.id, staff);
    setSaving(false);
    navigate(`/staff/${staff.id}`);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading staff...</div>;
  }
  
  if (!staff) {
    return <div className="p-8 text-center text-red-500">Staff member not found.</div>;
  }

  return (
    <div className="container mx-auto p-4 lg:p-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Button 
          onClick={() => navigate(`/staff/${staff.id}`)} 
          variant="outline" 
          size="sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Edit Staff Profile</h1>
          <p className="text-muted-foreground">Update staff member information</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input 
                placeholder="Full Name" 
                value={staff.name} 
                onChange={e => handleChange("name", e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input 
                placeholder="Email Address" 
                value={staff.email} 
                onChange={e => handleChange("email", e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input 
                placeholder="Phone Number" 
                value={staff.phone} 
                onChange={e => handleChange("phone", e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Designation</label>
              <Input 
                placeholder="Job Title" 
                value={staff.designation} 
                onChange={e => handleChange("designation", e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select value={staff.department} onValueChange={value => handleChange("department", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="History">History</SelectItem>
                  <SelectItem value="Physical Education">Physical Education</SelectItem>
                  <SelectItem value="Arts">Arts</SelectItem>
                  <SelectItem value="Administration">Administration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Experience (Years)</label>
              <Input 
                type="number" 
                placeholder="Years of Experience" 
                value={staff.experience || ""} 
                onChange={e => handleChange("experience", parseInt(e.target.value) || 0)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Qualification</label>
              <Input 
                placeholder="Educational Qualification" 
                value={staff.qualification || ""} 
                onChange={e => handleChange("qualification", e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Joining Date</label>
              <Input 
                type="date" 
                value={staff.joiningDate} 
                onChange={e => handleChange("joiningDate", e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Salary</label>
              <Input 
                type="number" 
                placeholder="Monthly Salary" 
                value={staff.salary || ""} 
                onChange={e => handleChange("salary", parseInt(e.target.value) || 0)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={staff.status} onValueChange={value => handleChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Address</label>
            <Input 
              placeholder="Full Address" 
              value={staff.address} 
              onChange={e => handleChange("address", e.target.value)} 
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button onClick={handleSave} disabled={saving} className="flex-1">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate(`/staff/${staff.id}`)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}