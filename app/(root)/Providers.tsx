"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {children}
      </LocalizationProvider>
    </ClerkProvider>
  );
};
export default Providers;
