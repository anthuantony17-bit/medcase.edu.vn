import React from "react";
import { Stethoscope, Award, BookOpen, Brain, Activity, Search } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: "home", label: "Trang chủ", icon: Activity },
    { id: "analysis", label: "AI Sửa Bệnh Án", icon: Brain },
    { id: "osce", label: "Virtual OSCE", icon: Stethoscope },
    { id: "library", label: "Thư viện bệnh án", icon: BookOpen },
    { id: "dashboard", label: "Bảng điều khiển", icon: Award },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 shadow-xs backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <div 
          className="flex cursor-pointer items-center space-x-2" 
          onClick={() => setActiveTab("home")}
          id="brand-logo-container"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              MEDCASE<span className="text-blue-600">VN</span>
            </span>
            <span className="ml-1 rounded-sm bg-blue-100 px-1 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-700">
              AI
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex space-x-1" id="main-navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Active Student Badge / Profile */}
        <div className="flex items-center space-x-3" id="student-profile-badge">
          <div className="hidden lg:flex flex-col items-end text-right">
            <span className="text-xs font-semibold text-slate-500">Sinh viên Y6</span>
            <span className="text-sm font-bold text-slate-800">BS. Nguyễn Văn A</span>
          </div>
          <div className="relative">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDThjICqIeXsrWNECSzEHU2BNS-3Cw0hHmyHtQcbViXZDLmEQXwoMLsZ4_QkPKR__hDD10wY7jwmXfUSegnpXSK8j12Aw0Bbdl-dKd_YzyKxh49h5K-e9K6tWv6pqxkVhRNGTLFYNmSspKUYt03OO3SSf8pb7HdXgdoTTYtMKEUcUnD6FLzYjbTa6bQHQrgXKCv8QcBgx0az6N0HDJfOX2mNaimgnUdPzSlCKTEwxdpLpAz7831zPMzsk5SKDdrqwpFpmAlk601aknz"
              alt="BS. Nguyễn Văn A Avatar"
              className="h-10 w-10 rounded-full border border-slate-200 object-cover ring-2 ring-blue-50"
              referrerPolicy="no-referrer"
            />
            <div className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500"></div>
          </div>
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="flex md:hidden items-center justify-around border-t border-slate-100 bg-white/95 py-2 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center space-y-0.5 text-xs font-medium transition-colors ${
                isActive ? "text-blue-600" : "text-slate-500"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="scale-90">{item.label.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
