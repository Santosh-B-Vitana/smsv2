
import { forwardRef } from "react";
import { Award, School } from "lucide-react";

interface CertificateProps {
  type: 'bonafide' | 'conduct' | 'transfer' | 'character';
  studentName: string;
  studentId: string;
  class: string;
  issuedDate: string;
  certificateId: string;
}

export const CertificateTemplate = forwardRef<HTMLDivElement, CertificateProps>(
  ({ type, studentName, studentId, class: studentClass, issuedDate, certificateId }, ref) => {
    const getCertificateTitle = () => {
      switch (type) {
        case 'bonafide':
          return 'BONAFIDE CERTIFICATE';
        case 'conduct':
          return 'CONDUCT CERTIFICATE';
        case 'transfer':
          return 'TRANSFER CERTIFICATE';
        case 'character':
          return 'CHARACTER CERTIFICATE';
        default:
          return 'CERTIFICATE';
      }
    };

    const getCertificateContent = () => {
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      switch (type) {
        case 'bonafide':
          return `This is to certify that ${studentName} bearing Student ID ${studentId} is a bonafide student of our institution, currently studying in Class ${studentClass}. This certificate is issued for official purposes as requested.`;
        
        case 'conduct':
          return `This is to certify that ${studentName}, Student ID ${studentId}, studying in Class ${studentClass}, has maintained excellent conduct and behavior during their tenure at our institution. The student has shown good moral character and discipline.`;
        
        case 'transfer':
          return `This is to certify that ${studentName}, bearing Student ID ${studentId}, was a student of Class ${studentClass} in our institution. The student is hereby granted transfer certificate and is free to seek admission in any other institution of their choice.`;
        
        case 'character':
          return `This is to certify that ${studentName}, Student ID ${studentId}, studying in Class ${studentClass}, bears good moral character. During the period of study in our institution, the student has shown honesty, integrity, and good conduct.`;
        
        default:
          return '';
      }
    };

    return (
      <div ref={ref} className="bg-white p-12 max-w-4xl mx-auto" style={{ fontFamily: 'serif' }}>
        {/* Header */}
        <div className="text-center mb-8 border-b-2 border-gray-800 pb-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <School className="h-12 w-12 text-blue-800" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">VITANA SCHOOLS</h1>
              <p className="text-gray-600">Excellence in Education Since 1985</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <p>123 Education Street, Knowledge City, State - 12345</p>
            <p>Phone: +1 (555) 123-4567 | Email: info@vitanaSchools.edu</p>
          </div>
        </div>

        {/* Certificate Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-blue-50 px-6 py-3 rounded-lg border-2 border-blue-200">
            <Award className="h-8 w-8 text-blue-800" />
            <h2 className="text-2xl font-bold text-blue-800 tracking-wide">
              {getCertificateTitle()}
            </h2>
          </div>
        </div>

        {/* Certificate Number */}
        <div className="text-right mb-6">
          <p className="text-sm text-gray-600">
            Certificate No: <span className="font-semibold">{certificateId}</span>
          </p>
        </div>

        {/* Certificate Content */}
        <div className="mb-12">
          <p className="text-lg leading-relaxed text-gray-800 text-justify">
            {getCertificateContent()}
          </p>
        </div>

        {/* Student Details Table */}
        <div className="mb-12">
          <table className="w-full border-2 border-gray-300">
            <tbody>
              <tr className="border-b border-gray-300">
                <td className="px-4 py-3 font-semibold bg-gray-50 border-r border-gray-300 w-1/3">
                  Student Name:
                </td>
                <td className="px-4 py-3">{studentName}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="px-4 py-3 font-semibold bg-gray-50 border-r border-gray-300">
                  Student ID:
                </td>
                <td className="px-4 py-3">{studentId}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="px-4 py-3 font-semibold bg-gray-50 border-r border-gray-300">
                  Class:
                </td>
                <td className="px-4 py-3">{studentClass}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold bg-gray-50 border-r border-gray-300">
                  Date of Issue:
                </td>
                <td className="px-4 py-3">{issuedDate}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signatures */}
        <div className="flex justify-between items-end">
          <div className="text-center">
            <div className="mb-16"></div>
            <div className="border-t-2 border-gray-800 pt-2">
              <p className="font-semibold">Class Teacher</p>
              <p className="text-sm text-gray-600">Signature & Stamp</p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-24 h-24 rounded-full border-4 border-blue-800 flex items-center justify-center mb-4 mx-auto">
              <span className="text-blue-800 font-bold text-sm">SCHOOL<br />SEAL</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="mb-16"></div>
            <div className="border-t-2 border-gray-800 pt-2">
              <p className="font-semibold">Principal</p>
              <p className="text-sm text-gray-600">Signature & Stamp</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-300">
          <p className="text-center text-xs text-gray-500">
            This is a computer-generated certificate. For verification, please contact the school administration.
          </p>
        </div>
      </div>
    );
  }
);

CertificateTemplate.displayName = "CertificateTemplate";
