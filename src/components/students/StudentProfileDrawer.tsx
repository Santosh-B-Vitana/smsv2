import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dialog as RadixDialog } from "@radix-ui/react-dialog";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockApi, Student } from "../../services/mockApi";
import placeholderImg from '/placeholder.svg';

export function StudentProfileDrawer({ studentId, open, onClose }: {
  studentId: string | null;
  open: boolean;
  onClose: () => void;
}) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showReactivateDialog, setShowReactivateDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (open && studentId) {
      setLoading(true);
      mockApi.getStudent(studentId).then(setStudent).finally(() => setLoading(false));
    }
  }, [open, studentId]);

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full p-0">
        <DialogHeader className="p-6 border-b">
          <DialogTitle>Student Profile</DialogTitle>
        </DialogHeader>
        <div className="p-6 flex flex-col gap-6">
          {loading || !student ? (
            <div className="text-center text-muted-foreground">Loading...</div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <span className="inline-block w-20 h-20 rounded-full overflow-hidden bg-gray-200 border border-gray-300">
                    {student.photoUrl ? (
                      <img src={student.photoUrl} alt={student.name} className="w-full h-full object-cover" />
                    ) : (
                      <img src={placeholderImg} alt="No photo" className="w-full h-full object-cover opacity-60" />
                    )}
                  </span>
                  <label 
                    htmlFor={`photo-upload-${student.id}`} 
                    className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer hover:bg-primary/90 transition-colors"
                    title="Upload Photo"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </label>
                  <input
                    id={`photo-upload-${student.id}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file && student) {
                        try {
                          const photoUrl = await mockApi.uploadStudentPhoto(student.id, file);
                          setStudent({ ...student, photoUrl });
                        } catch (error) {
                          console.error('Failed to upload photo:', error);
                        }
                      }
                    }}
                  />
                </div>
                <div>
                  <div className="text-xl font-bold">{student.name}</div>
                  <div className="text-sm text-muted-foreground">Roll No: {student.rollNo}</div>
                  <Badge variant={student.status === 'active' ? 'default' : 'secondary'} className="mt-2">
                    {student.status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="font-semibold">Class & Section</div>
                  <div>{student.class}-{student.section}</div>
                </div>
                <div>
                  <div className="font-semibold">DOB</div>
                  <div>{student.dob}</div>
                </div>
                <div>
                  <div className="font-semibold">Guardian</div>
                  <div>{student.guardianName}</div>
                </div>
                <div>
                  <div className="font-semibold">Guardian Phone</div>
                  <div>{student.guardianPhone}</div>
                </div>
                <div>
                  <div className="font-semibold">Address</div>
                  <div>{student.address}</div>
                </div>
                <div>
                  <div className="font-semibold">Category</div>
                  <div>{student.category}</div>
                </div>
                <div>
                  <div className="font-semibold">Admission Date</div>
                  <div>{student.admissionDate}</div>
                </div>
                {student.previousSchool && (
                  <div>
                    <div className="font-semibold">Previous School</div>
                    <div>{student.previousSchool}</div>
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-6">
                <Button
                  variant="default"
                  disabled={actionLoading}
                  onClick={() => {
                    if (student) navigate(`/students/${student.id}/edit`);
                  }}
                >Edit</Button>
                {student.status === 'active' ? (
                  <Button
                    variant="destructive"
                    disabled={actionLoading}
                    onClick={async () => {
                      if (!student) return;
                      setActionLoading(true);
                      await mockApi.updateStudent(student.id, { status: 'inactive' });
                      setStudent({ ...student, status: 'inactive' });
                      setActionLoading(false);
                    }}
                  >Deactivate</Button>
                ) : (
                  <Button
                    variant="secondary"
                    disabled={actionLoading}
                    onClick={() => setShowReactivateDialog(true)}
                  >Reactivate</Button>
                )}
      {/* Reactivate Warning Dialog */}
      <RadixDialog open={showReactivateDialog} onOpenChange={setShowReactivateDialog}>
        <DialogContent className="max-w-sm w-full">
          <DialogHeader>
            <DialogTitle>Warning</DialogTitle>
          </DialogHeader>
          <div className="mb-4 text-yellow-700 font-semibold">Reactivating will admit the student again. Are you sure you want to proceed?</div>
          <div className="flex gap-4 justify-end">
            <Button variant="outline" onClick={() => setShowReactivateDialog(false)}>Cancel</Button>
            <Button
              variant="secondary"
              onClick={async () => {
                if (!student) return;
                setActionLoading(true);
                await mockApi.updateStudent(student.id, { status: 'active' });
                setStudent({ ...student, status: 'active' });
                setActionLoading(false);
                setShowReactivateDialog(false);
              }}
            >Reactivate</Button>
          </div>
        </DialogContent>
      </RadixDialog>
                <Button
                  variant="secondary"
                  disabled={actionLoading}
                  onClick={() => alert('TC generated (mock)!')}
                >Generate TC</Button>
                <Button
                  variant="secondary"
                  disabled={actionLoading}
                  onClick={() => alert('Report card generated (mock)!')}
                >Report Card</Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
