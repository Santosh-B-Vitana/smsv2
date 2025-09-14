import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";

interface ConductCertificateProps {
  studentName: string;
  className: string;
  schoolName: string;
  principalName: string;
  academicYear: string;
  conduct: string;
  issueDate: string;
  certificateNumber: string;
}

export function ConductCertificateTemplate({
  studentName,
  className,
  schoolName,
  principalName,
  academicYear,
  conduct,
  issueDate,
  certificateNumber
}: ConductCertificateProps) {
  const handleDownload = () => {
    const printContent = document.getElementById('conduct-certificate')?.innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent || '';
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-end mb-4">
        <Button onClick={handleDownload} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button onClick={() => window.print()} variant="outline">
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
      </div>

      <Card id="conduct-certificate" className="max-w-4xl mx-auto bg-white">
        <CardContent className="p-12">
          {/* Header with School Logo placeholder */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xs">LOGO</span>
            </div>
            <h1 className="text-3xl font-bold text-blue-800 mb-2">{schoolName}</h1>
            <p className="text-lg text-gray-600">CONDUCT CERTIFICATE</p>
          </div>

          {/* Certificate Body */}
          <div className="space-y-6 text-justify leading-relaxed">
            <div className="text-right text-sm text-gray-600">
              <p>Certificate No: {certificateNumber}</p>
              <p>Date: {issueDate}</p>
            </div>

            <div className="space-y-4">
              <p className="text-lg">
                <strong>TO WHOM IT MAY CONCERN</strong>
              </p>

              <p>
                This is to certify that <strong>{studentName}</strong> was a student of this school 
                in Class <strong>{className}</strong> during the academic year <strong>{academicYear}</strong>.
              </p>

              <p>
                During his/her stay in this institution, his/her <strong>CONDUCT</strong> and 
                <strong> CHARACTER</strong> was found to be <strong>{conduct.toUpperCase()}</strong>.
              </p>

              <p>
                I wish him/her all success in his/her future endeavors.
              </p>
            </div>

            {/* Signature Section */}
            <div className="flex justify-between items-end mt-12 pt-8">
              <div className="text-center">
                <div className="h-16 w-48 border-b border-gray-300 mb-2"></div>
                <p className="text-sm font-medium">Class Teacher</p>
              </div>
              
              <div className="text-center">
                <div className="w-24 h-24 border border-gray-300 mb-2 mx-auto">
                  <p className="text-xs text-gray-500 mt-8">School Seal</p>
                </div>
              </div>

              <div className="text-center">
                <div className="h-16 w-48 border-b border-gray-300 mb-2"></div>
                <p className="text-sm font-medium">Principal</p>
                <p className="text-sm text-gray-600">{principalName}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              This is a computer generated certificate and does not require signature
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}