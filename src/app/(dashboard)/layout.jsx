
'use client';
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }) {

  return (
    <div className="flex h-screen bg-slate-900 text-white flex-col">
      <Header 
        onImportClick={() => {}}
        onExportClick={() => {}}
        isTeamEmpty={true}
        onAuthClick={() => {}}
        onLoadClick={() => {}}
      />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex p-6 gap-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}