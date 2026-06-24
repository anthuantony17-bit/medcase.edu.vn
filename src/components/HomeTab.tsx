import React, { useState } from "react";
import { Brain, Stethoscope, FileText, Library, HelpCircle, Search, ArrowRight, Quote, Sparkles } from "lucide-react";

interface HomeTabProps {
  setActiveTab: (tab: string) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ setActiveTab }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const modules = [
    {
      id: "analysis",
      title: "AI Sửa Bệnh Án",
      desc: "Tải lên hoặc dán bệnh án để AI phân tích toàn diện. Đánh giá chất lượng bệnh sử, thăm khám, lập luận biện luận và chỉ định cận lâm sàng dựa trên các hướng dẫn điều trị chuẩn Bộ Y tế.",
      icon: Brain,
      color: "bg-blue-500 text-blue-500",
      bgColor: "bg-blue-50 border-blue-100",
      linkText: "Khám phá mô-đun",
      targetTab: "analysis"
    },
    {
      id: "osce",
      title: "Virtual OSCE Center",
      desc: "Trải nghiệm hỏi bệnh, thăm khám và xử trí bệnh nhân ảo độ trung thực cao. Hệ thống phản hồi trực tiếp (Live AI Feedback) ghi nhận kỹ năng giao tiếp y khoa và thấu cảm lâm sàng.",
      icon: Stethoscope,
      color: "bg-teal-500 text-teal-500",
      bgColor: "bg-teal-50 border-teal-100",
      linkText: "Vào phòng thi Ảo",
      targetTab: "osce"
    },
    {
      id: "documentation",
      title: "Clinical Documentation",
      desc: "Luyện tập viết bệnh án theo cấu trúc chuẩn SOAP. AI đóng vai trò người phản biện, chỉ ra các lỗi thuật ngữ, thiếu sót thông tin lâm sàng và đề xuất phương án tối ưu.",
      icon: FileText,
      color: "bg-purple-500 text-purple-500",
      bgColor: "bg-purple-50 border-purple-100",
      linkText: "Luyện soạn thảo",
      targetTab: "analysis"
    },
    {
      id: "library",
      title: "Clinical Case Library",
      desc: "Truy cập kho bệnh án phong phú thuộc nhiều chuyên khoa (Nội, Ngoại, Sản, Nhi). Xem chi tiết bệnh sử, biểu đồ sinh hiệu, cận lâm sàng và các bình luận lâm sàng chuyên sâu.",
      icon: Library,
      color: "bg-amber-500 text-amber-500",
      bgColor: "bg-amber-50 border-amber-100",
      linkText: "Truy cập Thư viện",
      targetTab: "library"
    },
    {
      id: "simulation",
      title: "Clinical Simulation",
      desc: "Mô phỏng các tình huống cấp cứu hồi sức thời gian thực. Đưa ra các quyết định xử trí nhanh chóng và theo dõi sự thay đổi tức thì của sinh hiệu bệnh nhân cấp cứu.",
      icon: HelpCircle,
      color: "bg-indigo-500 text-indigo-500",
      bgColor: "bg-indigo-50 border-indigo-100",
      linkText: "Khởi chạy mô phỏng",
      targetTab: "osce"
    }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().toLowerCase().includes("ngực") || searchQuery.trim().toLowerCase().includes("tim")) {
      setActiveTab("library");
    } else if (searchQuery.trim().toLowerCase().includes("mổ") || searchQuery.trim().toLowerCase().includes("bụng") || searchQuery.trim().toLowerCase().includes("ruột")) {
      setActiveTab("osce");
    } else {
      setActiveTab("library");
    }
  };

  return (
    <div className="space-y-12 pb-16" id="home-tab-container">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-radial from-blue-50 to-white py-16 sm:py-20 rounded-3xl border border-blue-50/50 p-6 sm:p-12">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl"></div>

        <div className="relative mx-auto max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-700/10">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Nền tảng Y khoa Lâm sàng AI số 1 Việt Nam</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Học lâm sàng - <span className="text-blue-600">Tư duy như bác sĩ</span> - Thực hành cùng AI
          </h1>
          
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-600 font-medium">
            Mô phỏng phòng thi OSCE Ảo chất lượng cao và Trợ lý hiệu đính bệnh án thông minh, giúp cá nhân hóa lộ trình học lâm sàng cho sinh viên Y khoa toàn quốc.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="mx-auto max-w-xl flex items-center bg-white p-1.5 rounded-2xl shadow-lg border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
            <div className="flex items-center pl-3 flex-1 text-slate-400">
              <Search className="h-5 w-5 mr-2" />
              <input
                type="text"
                placeholder="Tìm kiếm ca lâm sàng, bệnh án, quy trình..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-slate-800 placeholder-slate-400 focus:outline-none text-sm font-medium"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition duration-150"
            >
              Tìm kiếm
            </button>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setActiveTab("osce")}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/30 transition-all"
            >
              Bắt đầu học ngay
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <button
              onClick={() => setActiveTab("analysis")}
              className="inline-flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 px-6 py-3.5 text-sm font-bold text-slate-800 transition-all"
            >
              Xem Demo Sửa Bệnh Án
            </button>
          </div>
        </div>
      </section>

      {/* Core Modules Grid */}
      <section className="space-y-6">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Mô-đun Đào tạo Cốt lõi</h2>
          <p className="text-slate-500 font-medium text-sm sm:text-base">Các bài tập thực hành lâm sàng lâm bách khoa được trang bị AI</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="core-modules-grid">
          {modules.slice(0, 3).map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                className="flex flex-col justify-between p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-lg hover:border-slate-300 transition-all group"
                id={`module-card-${mod.id}`}
              >
                <div className="space-y-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${mod.bgColor} text-blue-600`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500 font-medium">
                    {mod.desc}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab(mod.targetTab)}
                  className="mt-6 inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                >
                  <span>{mod.linkText}</span>
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Secondary level modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.slice(3).map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                className="flex flex-col sm:flex-row items-start gap-4 p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-md hover:border-slate-300 transition-all group"
                id={`module-card-${mod.id}`}
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${mod.bgColor} text-blue-600`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-2 flex-1 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-500 font-medium mt-1">
                      {mod.desc}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab(mod.targetTab)}
                    className="mt-4 inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    <span>{mod.linkText}</span>
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Founder Quote Section */}
      <section className="rounded-3xl border border-slate-200 bg-slate-50/50 p-6 sm:p-10 flex flex-col md:flex-row items-center gap-8 shadow-xs">
        <div className="relative shrink-0" id="founder-photo-container">
          <div className="absolute inset-0 bg-blue-600 rounded-2xl rotate-3 scale-95 opacity-10"></div>
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnEsJmaAuWJLenUlLDZwNzcxykRun6Y4J_beYo1LozaWPsWGsaKb3l4UdANROvFU6RhTu0w2h2mVt_PmboI0xNvLAFgzcsI1sUbbaWkzg6agpnHXRo9H2FeHs4RoGB6pGqgfoAU9L1lZlb0Gd2GRMUPLHjYgIEI65abn5bz7BFLTDJzHTa58AEbGT3Xad-QCkpn9REE4pqo4QdS7BWQJSYwIU0TxlYG13yaloXUda_XCpETA5bS0wPJnOgI9n7ZcXRvZoxCGn7WJPe"
            alt="TRỊNH LÊ AN THUẬN, Sáng lập viên MEDCASEVN AI"
            className="relative h-40 w-40 rounded-2xl object-cover shadow-md border-2 border-white"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="space-y-4 flex-1">
          <Quote className="h-10 w-10 text-blue-200" />
          <blockquote className="text-base sm:text-lg font-medium text-slate-700 italic leading-relaxed">
            "MEDCASEVN AI ra đời với sứ mệnh làm cầu nối vững chắc giữa lý thuyết y khoa hàn lâm và thực tế lâm sàng sinh động. Bằng công nghệ trí tuệ nhân tạo tiên tiến, chúng tôi mong muốn cá nhân hóa hoàn toàn lộ trình rèn luyện tư duy biện luận lâm sàng, trang bị sự tự tin và y thuật chuẩn xác cho các bác sĩ tương lai."
          </blockquote>
          <div>
            <span className="block text-base font-extrabold text-slate-900">TRỊNH LÊ AN THUẬN</span>
            <span className="block text-xs font-bold uppercase tracking-wider text-blue-600">Sáng lập viên, MEDCASEVN AI</span>
          </div>
        </div>
      </section>
    </div>
  );
};
