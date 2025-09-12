
import { useAuth } from "@/contexts/AuthContext";
import { CommunicationManager } from "../components/communication/CommunicationManager";
import StaffCommunicationManager from "../components/communication/StaffCommunicationManager";

export default function Communication() {
  const { user } = useAuth();
  
  // Show different communication interfaces based on user role
  if (user?.role === 'staff') {
    return <StaffCommunicationManager />;
  }
  
  return <CommunicationManager />;
}
