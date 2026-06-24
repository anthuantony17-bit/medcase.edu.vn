import { useState } from "react";
import { Header } from "./components/Header";
import { HomeTab } from "./components/HomeTab";
import { CaseAnalysisTab } from "./components/CaseAnalysisTab";
import { OSCETab } from "./components/OSCETab";
import { LibraryTab } from "./components/LibraryTab";
import { DashboardTab } from "./components/DashboardTab";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");

  return (
    <div className="min-h-screen bg-slate-50/40 text-slate-800 flex flex-col font-sans" id="app-viewport">
      {/* Sleek Navigation Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container Workspace */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "home" && <HomeTab setActiveTab={setActiveTab} />}
        {activeTab === "analysis" && <CaseAnalysisTab />}
        {activeTab === "osce" && <OSCETab />}
        {activeTab === "library" && <LibraryTab />}
        {activeTab === "dashboard" && <DashboardTab />}
      </main>

      {/* Humble Footer */}
      <footer className="w-full border-t border-slate-200/60 bg-white py-6 mt-12 text-center text-xs font-bold text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© 2026 MEDCASEVN AI. Tất cả quyền được bảo lưu.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-600 transition-colors">Hướng dẫn sử dụng</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-600 transition-colors">Điều khoản học vụ</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-600 transition-colors">Y đức chuẩn mực</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
