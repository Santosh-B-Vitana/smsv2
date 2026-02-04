import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockApi, Staff } from "@/services/mockApi";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function StaffEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

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

  const handleChange = (field: keyof Staff, value: any) => {
    if (!staff) return;
    setStaff({ ...staff, [field]: value });
  };

  const handleArrayChange = (field: keyof Staff, value: string) => {
    if (!staff) return;
    const values = value.split(',').map(v => v.trim()).filter(v => v);
    setStaff({ ...staff, [field]: values });
  };

  const handleSave = async () => {
    if (!staff) return;
    setSaving(true);
    try {
      await mockApi.updateStaff(staff.id, staff);
      toast({
        title: "Success",
        description: "Staff profile updated successfully",
      });
      navigate(`/staff/${staff.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update staff profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading staff...</div>;
  }
  
  if (!staff) {
    return <div className="p-8 text-center text-red-500">Staff member not found.</div>;
  }

  return (
    <div className="container mx-auto p-4 lg:p-6 max-w-6xl">
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

      <Tabs defaultValue="personal" className="space-y-4">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 min-w-[500px]">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="identification">Identification</TabsTrigger>
            <TabsTrigger value="medical">Medical</TabsTrigger>
          </TabsList>
        </div>

        {/* Personal Tab */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name *</label>
                  <Input 
                    placeholder="Full Name" 
                    value={staff.name} 
                    onChange={e => handleChange("name", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date of Birth</label>
                  <Input 
                    type="date" 
                    value={staff.dob || ""} 
                    onChange={e => handleChange("dob", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gender</label>
                  <Select value={staff.gender || ""} onValueChange={value => handleChange("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nationality</label>
                  <Input 
                    placeholder="Nationality" 
                    value={staff.nationality || ""} 
                    onChange={e => handleChange("nationality", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Religion</label>
                  <Input 
                    placeholder="Religion" 
                    value={staff.religion || ""} 
                    onChange={e => handleChange("religion", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Marital Status</label>
                  <Select value={staff.maritalStatus || ""} onValueChange={value => handleChange("maritalStatus", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Unmarried">Unmarried</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Divorced">Divorced</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
        </TabsContent>

        {/* Professional Tab */}
        <TabsContent value="professional">
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Designation *</label>
                  <Input 
                    placeholder="Job Title" 
                    value={staff.designation} 
                    onChange={e => handleChange("designation", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department *</label>
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
                      <SelectItem value="Support Staff">Support Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subjects (comma-separated)</label>
                  <Input 
                    placeholder="e.g., Algebra, Geometry, Calculus" 
                    value={staff.subjects?.join(', ') || ""} 
                    onChange={e => handleArrayChange("subjects", e.target.value)} 
                  />
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
                  <label className="text-sm font-medium">Joining Date</label>
                  <Input 
                    type="date" 
                    value={staff.joiningDate} 
                    onChange={e => handleChange("joiningDate", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirmation Date</label>
                  <Input 
                    type="date" 
                    value={staff.confirmationDate || ""} 
                    onChange={e => handleChange("confirmationDate", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Employment Type</label>
                  <Select value={staff.employmentType || ""} onValueChange={value => handleChange("employmentType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time Permanent">Full-time Permanent</SelectItem>
                      <SelectItem value="Full-time Contract">Full-time Contract</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Temporary">Temporary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Working Days</label>
                  <Input 
                    placeholder="e.g., Monday to Friday" 
                    value={staff.workingDays || ""} 
                    onChange={e => handleChange("workingDays", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Leave Entitlement (Days/Year)</label>
                  <Input 
                    type="number" 
                    placeholder="Leave Entitlement" 
                    value={staff.leaveEntitlement || ""} 
                    onChange={e => handleChange("leaveEntitlement", parseInt(e.target.value) || 0)} 
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
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Primary Phone *</label>
                  <Input 
                    placeholder="Phone Number" 
                    value={staff.primaryPhone || staff.phone} 
                    onChange={e => handleChange("primaryPhone", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Secondary Phone</label>
                  <Input 
                    placeholder="Secondary Phone" 
                    value={staff.secondaryPhone || ""} 
                    onChange={e => handleChange("secondaryPhone", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Official Email *</label>
                  <Input 
                    placeholder="Official Email" 
                    value={staff.email} 
                    onChange={e => handleChange("email", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Personal Email</label>
                  <Input 
                    placeholder="Personal Email" 
                    value={staff.personalEmail || ""} 
                    onChange={e => handleChange("personalEmail", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Current Address *</label>
                  <Input 
                    placeholder="Current Address" 
                    value={staff.address} 
                    onChange={e => handleChange("address", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Permanent Address</label>
                  <Input 
                    placeholder="Permanent Address" 
                    value={staff.permanentAddress || ""} 
                    onChange={e => handleChange("permanentAddress", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Emergency Contact Name</label>
                  <Input 
                    placeholder="Emergency Contact Name" 
                    value={staff.emergencyContact || ""} 
                    onChange={e => handleChange("emergencyContact", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Emergency Contact Phone</label>
                  <Input 
                    placeholder="Emergency Contact Phone" 
                    value={staff.emergencyContactPhone || ""} 
                    onChange={e => handleChange("emergencyContactPhone", e.target.value)} 
                  />
                </div>
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
        </TabsContent>

        {/* Identification Tab */}
        <TabsContent value="identification">
          <Card>
            <CardHeader>
              <CardTitle>Identification Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Aadhar Number</label>
                  <Input 
                    placeholder="e.g., 1234-5678-9012" 
                    value={staff.aadharNumber || ""} 
                    onChange={e => handleChange("aadharNumber", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">PAN Number</label>
                  <Input 
                    placeholder="e.g., ABCD1234E" 
                    value={staff.panNumber || ""} 
                    onChange={e => handleChange("panNumber", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Passport Number</label>
                  <Input 
                    placeholder="Passport Number" 
                    value={staff.passportNumber || ""} 
                    onChange={e => handleChange("passportNumber", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">License Number</label>
                  <Input 
                    placeholder="License Number" 
                    value={staff.licenseNumber || ""} 
                    onChange={e => handleChange("licenseNumber", e.target.value)} 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <h3 className="font-semibold text-sm mt-4 mb-3">Bank Details</h3>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bank Account Number</label>
                  <Input 
                    placeholder="Account Number" 
                    value={staff.bankAccountNumber || ""} 
                    onChange={e => handleChange("bankAccountNumber", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bank Name</label>
                  <Input 
                    placeholder="Bank Name" 
                    value={staff.bankName || ""} 
                    onChange={e => handleChange("bankName", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">IFSC Code</label>
                  <Input 
                    placeholder="IFSC Code" 
                    value={staff.ifscCode || ""} 
                    onChange={e => handleChange("ifscCode", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Account Holder Name</label>
                  <Input 
                    placeholder="Account Holder Name" 
                    value={staff.accountHolderName || ""} 
                    onChange={e => handleChange("accountHolderName", e.target.value)} 
                  />
                </div>
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
        </TabsContent>

        {/* Medical Tab */}
        <TabsContent value="medical">
          <Card>
            <CardHeader>
              <CardTitle>Medical Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Blood Group</label>
                  <Select value={staff.bloodGroup || ""} onValueChange={value => handleChange("bloodGroup", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Blood Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Allergies</label>
                  <Input 
                    placeholder="Any allergies" 
                    value={staff.allergies || ""} 
                    onChange={e => handleChange("allergies", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Chronic Conditions</label>
                  <Input 
                    placeholder="Any chronic conditions" 
                    value={staff.chronicConditions || ""} 
                    onChange={e => handleChange("chronicConditions", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Doctor Name</label>
                  <Input 
                    placeholder="Doctor Name" 
                    value={staff.doctorName || ""} 
                    onChange={e => handleChange("doctorName", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Doctor Phone</label>
                  <Input 
                    placeholder="Doctor Phone" 
                    value={staff.doctorPhone || ""} 
                    onChange={e => handleChange("doctorPhone", e.target.value)} 
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-sm mb-4">Qualifications & Certifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Highest Qualification</label>
                    <Input 
                      placeholder="e.g., M.Sc, M.A" 
                      value={staff.highestQualification || ""} 
                      onChange={e => handleChange("highestQualification", e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">University</label>
                    <Input 
                      placeholder="University Name" 
                      value={staff.university || ""} 
                      onChange={e => handleChange("university", e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Passing Year</label>
                    <Input 
                      type="number" 
                      placeholder="e.g., 2014" 
                      value={staff.passingYear || ""} 
                      onChange={e => handleChange("passingYear", parseInt(e.target.value) || undefined)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Qualification</label>
                    <Input 
                      placeholder="e.g., M.Ed, Ph.D" 
                      value={staff.qualification || ""} 
                      onChange={e => handleChange("qualification", e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Additional Certifications (comma-separated)</label>
                    <Input 
                      placeholder="e.g., Certified Trainer, Quality Manager" 
                      value={staff.additionalCertifications?.join(', ') || ""} 
                      onChange={e => handleArrayChange("additionalCertifications", e.target.value)} 
                    />
                  </div>
                </div>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}