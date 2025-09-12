import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockApi, Student } from "@/services/mockApi";

export default function StudentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchStudent() {
      if (!id) return;
      const data = await mockApi.getStudent(id);
      setStudent(data);
      setLoading(false);
    }
    fetchStudent();
  }, [id]);

  const handleChange = (field: keyof Student, value: string) => {
    if (!student) return;
    setStudent({ ...student, [field]: value });
  };

  const handleSave = async () => {
    if (!student) return;
    setSaving(true);
    await mockApi.updateStudent(student.id, student);
    setSaving(false);
    navigate(`/students/${student.id}`);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading student...</div>;
  }
  if (!student) {
    return <div className="p-8 text-center text-red-500">Student not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Button variant="ghost" className="mb-4 flex items-center" onClick={() => navigate(-1)}>
        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Back
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Edit Student Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <Input value={student.name} onChange={e => handleChange("name", e.target.value)} placeholder="Full Name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Roll Number</label>
                <Input value={student.rollNo} onChange={e => handleChange("rollNo", e.target.value)} placeholder="Roll Number" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Class</label>
                <Input value={student.class} onChange={e => handleChange("class", e.target.value)} placeholder="Class" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Section</label>
                <Input value={student.section} onChange={e => handleChange("section", e.target.value)} placeholder="Section" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                <Input type="date" value={student.dob} onChange={e => handleChange("dob", e.target.value)} placeholder="Date of Birth" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Input value={student.category} onChange={e => handleChange("category", e.target.value)} placeholder="Category" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Admission Date</label>
                <Input type="date" value={student.admissionDate} onChange={e => handleChange("admissionDate", e.target.value)} placeholder="Admission Date" />
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">Guardian Name</label>
                <Input value={student.guardianName} onChange={e => handleChange("guardianName", e.target.value)} placeholder="Guardian Name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Guardian Phone</label>
                <Input value={student.guardianPhone} onChange={e => handleChange("guardianPhone", e.target.value)} placeholder="Guardian Phone" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <Input value={student.address} onChange={e => handleChange("address", e.target.value)} placeholder="Address" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Previous School</label>
                <Input value={student.previousSchool || ""} onChange={e => handleChange("previousSchool", e.target.value)} placeholder="Previous School" />
              </div>
            </div>
          </div>
          <Button onClick={handleSave} className="mt-8 w-full" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
