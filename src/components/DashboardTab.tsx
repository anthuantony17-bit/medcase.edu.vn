import React from "react";
import { Award, BookOpen, Clock, Heart, Shield, Stethoscope, Zap, BrainCircuit, Activity, Calendar, HelpCircle } from "lucide-react";
import { StudentStats } from "../types";
import { INITIAL_STUDENT_STATS } from "../data";

export const DashboardTab: React.FC = () => {
  const stats: StudentStats = INITIAL_STUDENT_STATS;

  // Map icon names to Lucide icons
  const iconMap: Record<string, any> = {
    BrainCircuit: BrainCircuit,
    Stethoscope: Stethoscope,
    HeartHandshake: Heart,
    Zap: Zap,
  };

  return (
    <div className="space-y-8 pb-12" id="dashboard-tab-container">
      {/* 1. Header Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="dashboard-metrics-summary-grid">
        {[
          { label: "Giờ học lâm sàng", val: `${stats.learningHours} giờ`, desc: "Tích lũy học trực tuyến", icon: Clock, color: "text-blue-600 bg-blue-50 border-blue-100" },
          { label: "Số ca đã luyện", val: `${stats.casesStudied} ca`, desc: "Hoàn thành mô phỏng", icon: BookOpen, color: "text-teal-600 bg-teal-50 border-teal-100" },
          { label: "Điểm OSCE trung bình", val: `${stats.avgOSCEScore}/100`, desc: "Cấp độ lâm sàng Giỏi", icon: Stethoscope, color: "text-purple-600 bg-purple-50 border-purple-100" },
          { label: "Chất lượng bệnh án", val: `${stats.docQualityScore}%`, desc: "Điểm hiệu đính SOAP", icon: Award, color: "text-amber-600 bg-amber-50 border-amber-100" }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex items-start gap-3 sm:gap-4">
              <div className={`flex h-10 sm:h-12 w-10 sm:w-12 shrink-0 items-center justify-center rounded-xl ${item.color.split(" ")[1]} ${item.color.split(" ")[0]} border ${item.color.split(" ")[2]}`}>
                <Icon className="h-5 sm:h-6 w-5 sm:w-6" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block truncate">{item.label}</span>
                <span className="text-base sm:text-xl font-black text-slate-800 block">{item.val}</span>
                <span className="text-[9px] sm:text-xs font-medium text-slate-400 block truncate">{item.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Middle Section Grid: Progress & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Progress by specialty (span 7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight mb-4 flex items-center gap-1.5">
              <Activity className="h-4.5 w-4.5 text-blue-600" />
              Tiến độ học tập theo Chuyên khoa
            </h3>
            
            <div className="space-y-4" id="dashboard-specialty-progress-list">
              {stats.specialtyProgress.map((spec) => {
                const percent = Math.round((spec.completed / spec.total) * 100);
                return (
                  <div key={spec.name} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <span className={`h-2.5 w-2.5 rounded-full ${spec.color}`}></span>
                        {spec.name}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">
                        {spec.completed}/{spec.total} ca ({percent}%)
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${spec.color} rounded-full`} style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Achievements Badges (Thành tích lập luận) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight mb-4 flex items-center gap-1.5">
              <Award className="h-4.5 w-4.5 text-blue-600" />
              Danh hiệu & Thành tích lâm sàng
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="dashboard-achievements-badges-grid">
              {stats.achievements.map((ach) => {
                const IconComp = iconMap[ach.iconName] || Award;
                return (
                  <div key={ach.id} className={`p-4 rounded-xl border flex items-start gap-3 transition-transform hover:-translate-y-0.5 ${ach.color}`}>
                    <div className="shrink-0 p-2 rounded-lg bg-white shadow-xs">
                      <IconComp className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-800">{ach.title}</h4>
                      <p className="text-[10px] sm:text-xs leading-normal font-medium text-slate-500">{ach.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Timeline Actions (span 5) */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs h-full flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight mb-4 flex items-center gap-1.5">
                <Calendar className="h-4.5 w-4.5 text-blue-600" />
                Hoạt động gần đây
              </h3>
              
              <div className="relative border-l-2 border-slate-100 pl-4 space-y-6 ml-2" id="dashboard-activity-timeline">
                {stats.recentActivities.map((act) => (
                  <div key={act.id} className="relative">
                    {/* Timeline bullet indicator */}
                    <span className={`absolute -left-[23px] top-1 flex h-2 w-2 rounded-full ring-4 ring-white ${
                      act.type === "osce"
                        ? "bg-teal-500"
                        : act.type === "analysis"
                        ? "bg-blue-500"
                        : "bg-purple-500"
                    }`}></span>

                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                          {act.title}
                        </h4>
                        {act.score && (
                          <span className="shrink-0 text-[10px] font-black px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md border border-emerald-200/50">
                            {act.score}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Print overview report card */}
            <div className="border-t border-slate-100 mt-6 pt-4 text-center">
              <button 
                onClick={() => alert("Đang trích xuất Bảng điểm lâm sàng chuẩn hóa Y khoa... Tệp PDF sẵn sàng tải về trong vài giây.")}
                className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-blue-600 rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                <Activity className="h-4 w-4" />
                <span>Trích xuất bảng điểm lâm sàng chuẩn (PDF)</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
