
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { mockApi, Student } from "../../services/mockApi";
import { useToast } from "@/hooks/use-toast";

interface StudentFormProps {
  student?: Student | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function StudentForm({ student, onClose, onSuccess }: StudentFormProps) {
  const [formData, setFormData] = useState({
    // Basic Info
    name: student?.name || "",
    preferredName: student?.preferredName || "",
    admissionNo: student?.admissionNo || "",
    class: student?.class || "",
    section: student?.section || "",
    rollNo: student?.rollNo || "",
    dob: student?.dob || "",
    placeOfBirth: student?.placeOfBirth || "",
    gender: student?.gender || "",
    nationality: student?.nationality?.[0] || "",
    status: student?.status || "active",
    admissionDate: student?.admissionDate || "",
    
    // Identification
    aadharNumber: student?.aadharNumber || "",
    panNumber: student?.panNumber || "",
    passportNumber: student?.passportNumber || "",
    visaType: student?.visaType || "",
    visaExpiry: student?.visaExpiry || "",
    
    // Contact
    address: student?.address || "",
    permanentAddress: student?.permanentAddress || "",
    primaryPhone: student?.primaryPhone || "",
    secondaryPhone: student?.secondaryPhone || "",
    email: student?.email || "",
    
    // Guardian (backward compatibility)
    guardianName: student?.guardianName || "",
    guardianPhone: student?.guardianPhone || "",
    guardianOccupation: student?.guardians?.[0]?.occupation || "",
    guardianEmail: student?.guardians?.[0]?.email || "",
    guardianAadhar: student?.guardians?.[0]?.aadharNumber || "",
    guardianPan: student?.guardians?.[0]?.panNumber || "",
    
    // Academic
    previousSchool: student?.previousSchool || "",
    previousClass: student?.previousClass || "",
    transferReason: student?.transferReason || "",
    category: student?.category || "General",
    
    // Medical
    bloodGroup: student?.bloodGroup || "",
    allergies: student?.allergies || "",
    chronicConditions: student?.chronicConditions || "",
    medications: student?.medications || "",
    emergencyContact: student?.emergencyContact || "",
    emergencyPhone: student?.emergencyPhone || "",
    doctorName: student?.doctorName || "",
    doctorPhone: student?.doctorPhone || "",
    
    // Consent
    photoConsent: student?.photoConsent || false,
    mediaConsent: student?.mediaConsent || false,
    medicalConsent: student?.medicalConsent || false,
    
    // Additional
    languageProficiency: student?.languageProficiency?.join(", ") || "",
    specialNeeds: student?.specialNeeds || "",
    transportRequired: student?.transportRequired || false,
    hostelRequired: student?.hostelRequired || false,
    
    siblings: student?.siblings || []
  });

  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(student?.photoUrl || null);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    mockApi.getStudents().then(students => {
      const filtered = student ? students.filter(s => s.id !== student.id) : students;
      setAllStudents(filtered);
    });
  }, [student]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const studentData: any = {
        ...formData,
        gender: formData.gender || undefined,
        nationality: formData.nationality ? [formData.nationality] : [],
        languageProficiency: formData.languageProficiency ? formData.languageProficiency.split(",").map(l => l.trim()) : [],
        guardians: [{
          name: formData.guardianName,
          relation: 'guardian' as const,
          occupation: formData.guardianOccupation,
          phone: formData.guardianPhone,
          email: formData.guardianEmail,
          aadharNumber: formData.guardianAadhar,
          panNumber: formData.guardianPan,
        }]
      };

      if (student) {
        await mockApi.updateStudent(student.id, studentData);
        if (photoFile) {
          await mockApi.uploadStudentPhoto(student.id, photoFile);
        }
        toast({ title: "Success", description: "Student updated successfully" });
      } else {
        const created = await mockApi.createStudent(studentData as any);
        if (photoFile) {
          await mockApi.uploadStudentPhoto(created.id, photoFile);
        }
        toast({ title: "Success", description: "Student added successfully" });
      }
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save student",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {student ? "Edit Student" : "Add New Student"}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="identification">ID</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="guardian">Guardian</TabsTrigger>
                <TabsTrigger value="academic">Academic</TabsTrigger>
                <TabsTrigger value="medical">Medical</TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="photo">Photo</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-full overflow-hidden bg-muted border">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <img src="/placeholder.svg" alt="No photo" className="w-full h-full object-cover opacity-60" />
                      )}
                    </div>
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setPhotoFile(file);
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => setPhotoPreview(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="preferredName">Preferred Name</Label>
                    <Input
                      id="preferredName"
                      value={formData.preferredName}
                      onChange={(e) => setFormData({...formData, preferredName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="admissionNo">Admission Number</Label>
                    <Input
                      id="admissionNo"
                      value={formData.admissionNo}
                      onChange={(e) => setFormData({...formData, admissionNo: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dob">Date of Birth *</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({...formData, dob: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="placeOfBirth">Place of Birth</Label>
                    <Input
                      id="placeOfBirth"
                      value={formData.placeOfBirth}
                      onChange={(e) => setFormData({...formData, placeOfBirth: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input
                      id="nationality"
                      value={formData.nationality}
                      onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                      placeholder="e.g., Indian"
                    />
                  </div>
                  <div>
                    <Label htmlFor="class">Class *</Label>
                    <Select value={formData.class} onValueChange={(value) => setFormData({...formData, class: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 12}, (_, i) => (
                          <SelectItem key={i+1} value={String(i+1)}>{i+1}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="section">Section *</Label>
                    <Select value={formData.section} onValueChange={(value) => setFormData({...formData, section: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                      <SelectContent>
                        {['A', 'B', 'C', 'D'].map(section => (
                          <SelectItem key={section} value={section}>{section}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="rollNo">Roll Number *</Label>
                    <Input
                      id="rollNo"
                      value={formData.rollNo}
                      onChange={(e) => setFormData({...formData, rollNo: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="admissionDate">Admission Date *</Label>
                    <Input
                      id="admissionDate"
                      type="date"
                      value={formData.admissionDate}
                      onChange={(e) => setFormData({...formData, admissionDate: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="OBC">OBC</SelectItem>
                        <SelectItem value="SC">SC</SelectItem>
                        <SelectItem value="ST">ST</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              {/* Identification Tab */}
              <TabsContent value="identification" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="aadharNumber">Aadhar Number (Student)</Label>
                    <Input
                      id="aadharNumber"
                      value={formData.aadharNumber}
                      onChange={(e) => setFormData({...formData, aadharNumber: e.target.value})}
                      placeholder="XXXX-XXXX-XXXX"
                      maxLength={14}
                    />
                  </div>
                  <div>
                    <Label htmlFor="panNumber">PAN Number (If applicable)</Label>
                    <Input
                      id="panNumber"
                      value={formData.panNumber}
                      onChange={(e) => setFormData({...formData, panNumber: e.target.value})}
                      placeholder="ABCDE1234F"
                      maxLength={10}
                    />
                  </div>
                  <div>
                    <Label htmlFor="passportNumber">Passport Number</Label>
                    <Input
                      id="passportNumber"
                      value={formData.passportNumber}
                      onChange={(e) => setFormData({...formData, passportNumber: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="visaType">Visa Type (for international students)</Label>
                    <Input
                      id="visaType"
                      value={formData.visaType}
                      onChange={(e) => setFormData({...formData, visaType: e.target.value})}
                      placeholder="e.g., Student Visa"
                    />
                  </div>
                  <div>
                    <Label htmlFor="visaExpiry">Visa Expiry Date</Label>
                    <Input
                      id="visaExpiry"
                      type="date"
                      value={formData.visaExpiry}
                      onChange={(e) => setFormData({...formData, visaExpiry: e.target.value})}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Contact Tab */}
              <TabsContent value="contact" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="address">Current/Local Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="permanentAddress">Permanent Address</Label>
                  <Textarea
                    id="permanentAddress"
                    value={formData.permanentAddress}
                    onChange={(e) => setFormData({...formData, permanentAddress: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primaryPhone">Primary Phone</Label>
                    <Input
                      id="primaryPhone"
                      type="tel"
                      value={formData.primaryPhone}
                      onChange={(e) => setFormData({...formData, primaryPhone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="secondaryPhone">Secondary Phone</Label>
                    <Input
                      id="secondaryPhone"
                      type="tel"
                      value={formData.secondaryPhone}
                      onChange={(e) => setFormData({...formData, secondaryPhone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Guardian Tab */}
              <TabsContent value="guardian" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guardianName">Guardian Name *</Label>
                    <Input
                      id="guardianName"
                      value={formData.guardianName}
                      onChange={(e) => setFormData({...formData, guardianName: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="guardianPhone">Guardian Phone *</Label>
                    <Input
                      id="guardianPhone"
                      type="tel"
                      value={formData.guardianPhone}
                      onChange={(e) => setFormData({...formData, guardianPhone: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="guardianEmail">Guardian Email</Label>
                    <Input
                      id="guardianEmail"
                      type="email"
                      value={formData.guardianEmail}
                      onChange={(e) => setFormData({...formData, guardianEmail: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="guardianOccupation">Occupation</Label>
                    <Input
                      id="guardianOccupation"
                      value={formData.guardianOccupation}
                      onChange={(e) => setFormData({...formData, guardianOccupation: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="guardianAadhar">Guardian Aadhar Number</Label>
                    <Input
                      id="guardianAadhar"
                      value={formData.guardianAadhar}
                      onChange={(e) => setFormData({...formData, guardianAadhar: e.target.value})}
                      placeholder="XXXX-XXXX-XXXX"
                      maxLength={14}
                    />
                  </div>
                  <div>
                    <Label htmlFor="guardianPan">Guardian PAN Number</Label>
                    <Input
                      id="guardianPan"
                      value={formData.guardianPan}
                      onChange={(e) => setFormData({...formData, guardianPan: e.target.value})}
                      placeholder="ABCDE1234F"
                      maxLength={10}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                    <Input
                      id="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                    <Input
                      id="emergencyPhone"
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="siblings">Siblings in School</Label>
                  <Select 
                    value="" 
                    onValueChange={(value) => {
                      if (value && !formData.siblings?.includes(value)) {
                        setFormData({...formData, siblings: [...(formData.siblings || []), value]});
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sibling (if any)" />
                    </SelectTrigger>
                    <SelectContent>
                      {allStudents
                        .filter(s => !formData.siblings?.includes(s.id))
                        .map(s => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name} - Class {s.class}-{s.section}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {formData.siblings && formData.siblings.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {formData.siblings.map(siblingId => {
                        const sibling = allStudents.find(s => s.id === siblingId);
                        return sibling ? (
                          <div key={siblingId} className="flex items-center justify-between p-2 bg-muted rounded">
                            <span className="text-sm">{sibling.name} - Class {sibling.class}-{sibling.section}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setFormData({
                                ...formData, 
                                siblings: formData.siblings?.filter(id => id !== siblingId)
                              })}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Academic Tab */}
              <TabsContent value="academic" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="previousSchool">Previous School</Label>
                    <Input
                      id="previousSchool"
                      value={formData.previousSchool}
                      onChange={(e) => setFormData({...formData, previousSchool: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="previousClass">Previous Class/Grade</Label>
                    <Input
                      id="previousClass"
                      value={formData.previousClass}
                      onChange={(e) => setFormData({...formData, previousClass: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="transferReason">Transfer Reason</Label>
                    <Textarea
                      id="transferReason"
                      value={formData.transferReason}
                      onChange={(e) => setFormData({...formData, transferReason: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="languageProficiency">Language Proficiency</Label>
                    <Input
                      id="languageProficiency"
                      value={formData.languageProficiency}
                      onChange={(e) => setFormData({...formData, languageProficiency: e.target.value})}
                      placeholder="e.g., English, Hindi, Tamil (comma separated)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="specialNeeds">Special Educational Needs</Label>
                    <Input
                      id="specialNeeds"
                      value={formData.specialNeeds}
                      onChange={(e) => setFormData({...formData, specialNeeds: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="transportRequired"
                      checked={formData.transportRequired}
                      onCheckedChange={(checked) => setFormData({...formData, transportRequired: checked as boolean})}
                    />
                    <Label htmlFor="transportRequired">Transport Required</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hostelRequired"
                      checked={formData.hostelRequired}
                      onCheckedChange={(checked) => setFormData({...formData, hostelRequired: checked as boolean})}
                    />
                    <Label htmlFor="hostelRequired">Hostel Required</Label>
                  </div>
                </div>
              </TabsContent>

              {/* Medical Tab */}
              <TabsContent value="medical" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Select value={formData.bloodGroup} onValueChange={(value) => setFormData({...formData, bloodGroup: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                          <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="allergies">Allergies</Label>
                    <Input
                      id="allergies"
                      value={formData.allergies}
                      onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                      placeholder="e.g., Peanuts, Dust"
                    />
                  </div>
                  <div>
                    <Label htmlFor="chronicConditions">Chronic Conditions</Label>
                    <Input
                      id="chronicConditions"
                      value={formData.chronicConditions}
                      onChange={(e) => setFormData({...formData, chronicConditions: e.target.value})}
                      placeholder="e.g., Asthma, Diabetes"
                    />
                  </div>
                  <div>
                    <Label htmlFor="medications">Regular Medications</Label>
                    <Input
                      id="medications"
                      value={formData.medications}
                      onChange={(e) => setFormData({...formData, medications: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="doctorName">Family Doctor Name</Label>
                    <Input
                      id="doctorName"
                      value={formData.doctorName}
                      onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="doctorPhone">Doctor Phone</Label>
                    <Input
                      id="doctorPhone"
                      type="tel"
                      value={formData.doctorPhone}
                      onChange={(e) => setFormData({...formData, doctorPhone: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-3 mt-4 p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold">Consent & Permissions</h4>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="photoConsent"
                      checked={formData.photoConsent}
                      onCheckedChange={(checked) => setFormData({...formData, photoConsent: checked as boolean})}
                    />
                    <Label htmlFor="photoConsent">Photo/Video Consent (for school use)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mediaConsent"
                      checked={formData.mediaConsent}
                      onCheckedChange={(checked) => setFormData({...formData, mediaConsent: checked as boolean})}
                    />
                    <Label htmlFor="mediaConsent">Media Consent (for publication/social media)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="medicalConsent"
                      checked={formData.medicalConsent}
                      onCheckedChange={(checked) => setFormData({...formData, medicalConsent: checked as boolean})}
                    />
                    <Label htmlFor="medicalConsent">Medical Emergency Consent</Label>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 justify-end pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : student ? "Update" : "Add"} Student
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
