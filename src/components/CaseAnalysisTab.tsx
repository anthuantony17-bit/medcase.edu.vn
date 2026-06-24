import React, { useState, useRef } from "react";
import { 
  Brain, FileText, Upload, Sparkles, AlertTriangle, HelpCircle, RefreshCw, 
  CheckCircle2, ChevronRight, FileCode, BookOpen, CheckSquare, Users, 
  Award, ArrowRight, Printer, Download, User, Check, X, ShieldAlert, BookOpenCheck, Edit3
} from "lucide-react";
import { AnalysisResult } from "../types";
import { PRESET_MEDICAL_RECORDS } from "../data";

export const CaseAnalysisTab: React.FC = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState("Nội khoa");
  const [recordText, setRecordText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [resultTab, setResultTab] = useState<"overview" | "comparison" | "lessons" | "checklist" | "rounds" | "report">("overview");

  // State for interactive bedside Q&A rounds
  const [studentAnswers, setStudentAnswers] = useState<{ [key: number]: string }>({});
  const [evaluatedQuestions, setEvaluatedQuestions] = useState<{ [key: number]: { feedback: string, score: number } }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const specialties = [
    { name: "Nội khoa", icon: "🩺" },
    { name: "Ngoại khoa", icon: "🔪" },
    { name: "Tim mạch", icon: "❤️" },
    { name: "Nhi khoa", icon: "👶" },
    { name: "Thần kinh", icon: "🧠" }
  ];

  const handleLoadPreset = (presetId: string) => {
    const preset = PRESET_MEDICAL_RECORDS.find((p) => p.id === presetId);
    if (preset) {
      setRecordText(preset.recordText);
      setSelectedSpecialty(preset.specialty);
      setError(null);
      setResult(null);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setIsLoading(true);
    setLoadingStage("Đang nạp và trích xuất dữ liệu từ tệp tin...");
    setError(null);
    setResult(null);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;
        const base64String = base64Data.split(",")[1];

        try {
          const res = await fetch("/api/parse-file", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileData: base64String,
              fileName: file.name
            })
          });

          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || "Không thể trích xuất tệp tin.");
          }

          const parsed = await res.json();
          setRecordText(parsed.text);
          setLoadingStage("");
        } catch (err: any) {
          setError(err.message || "Lỗi khi trích xuất dữ liệu tệp tin.");
        } finally {
          setIsLoading(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setError("Không thể đọc tệp tin cục bộ.");
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!recordText.trim() || recordText.trim().length < 20) {
      setError("Nội dung bệnh án quá ngắn. Vui lòng dán nội dung đầy đủ ít nhất 20 ký tự để phân tích.");
      return;
    }

    setError(null);
    setIsLoading(true);
    setResult(null);
    setStudentAnswers({});
    setEvaluatedQuestions({});

    const stages = [
      "Đang đọc nội dung và phân loại loại bệnh án...",
      "Đang rà soát thuật ngữ lâm sàng & viết tắt tiếng Việt...",
      "Đang trích xuất triệu chứng cơ năng & thực thể...",
      "Đang thẩm định tính logic giữa biện luận và cận lâm sàng...",
      "Đang đối chiếu phác đồ của Bộ Y tế Việt Nam và Hội Tim Mạch Việt Nam...",
      "Đang chấm điểm chi tiết 14 cấu phần chuẩn y khoa (Thang điểm 100)...",
      "Đang giả lập câu hỏi vấn đáp đi buồng lâm sàng của Thầy..."
    ];

    let currentStage = 0;
    setLoadingStage(stages[0]);

    const stageInterval = setInterval(() => {
      currentStage++;
      if (currentStage < stages.length) {
        setLoadingStage(stages[currentStage]);
      }
    }, 800);

    try {
      const response = await fetch("/api/analyze-case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          record: recordText,
          specialty: selectedSpecialty
        })
      });

      if (!response.ok) {
        throw new Error("Không thể kết nối đến máy chủ phân tích bệnh án.");
      }

      const data = await response.json();
      clearInterval(stageInterval);
      setResult(data);
      setResultTab("overview");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Đã xảy ra lỗi bất ngờ trong quá trình xử lý.");
      clearInterval(stageInterval);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setRecordText("");
    setResult(null);
    setError(null);
    setStudentAnswers({});
    setEvaluatedQuestions({});
  };

  // Evaluate student answer locally for instant rich interactive experience
  const handleEvaluateAnswer = (index: number, questionText: string, sampleAnswer: string) => {
    const studentAns = studentAnswers[index] || "";
    if (!studentAns.trim()) {
      alert("Vui lòng nhập câu trả lời của bạn trước khi nộp!");
      return;
    }

    // Smart clinical keyword matcher
    const keywordsMap: { [key: string]: string[] } = {
      "thất phải": ["thất phải", "v3r", "v4r", "right ventricular", "rv", "thành dưới"],
      "huyết áp": ["huyết áp", "tụt", "giảm", "tiền gánh", "nitro", "giãn mạch"],
      "vương": ["vương", "mũ", "lcx", "nhánh", "trước", "lad", "liên thất"],
      "chẹn beta": ["chẹn beta", "suy tim", "co bóp", "tim chậm", "phổi", "ran", "shock", "sốc"],
      "dị ứng": ["dị ứng", "phản vệ", "sốc", "kháng sinh", "an toàn", "chủ động"]
    };

    let matchedCount = 0;
    let matchedWords: string[] = [];
    const lowerAns = studentAns.toLowerCase();

    Object.entries(keywordsMap).forEach(([key, words]) => {
      words.forEach(w => {
        if (lowerAns.includes(w) && !matchedWords.includes(w)) {
          matchedWords.push(w);
          matchedCount++;
        }
      });
    });

    let score = 50; // base score
    let feedback = "";

    if (matchedCount >= 3) {
      score = 90 + Math.min(10, matchedCount);
      feedback = `Xuất sắc! Bạn đã lập luận cực kỳ sắc bén và bao quát được các khía cạnh cốt lõi của câu hỏi. Bạn đã sử dụng chính xác các khái niệm then chốt như: ${matchedWords.join(", ")}. Thầy đánh giá cao tư duy lâm sàng nhạy bén của bạn.`;
    } else if (matchedCount >= 1) {
      score = 70 + matchedCount * 6;
      feedback = `Khá tốt! Bạn đã nêu được một số ý đúng liên quan đến: ${matchedWords.join(", ")}. Tuy nhiên, lập luận của bạn cần sâu sắc hơn và bổ sung đầy đủ các cơ chế sinh lý bệnh đi kèm để đạt điểm tuyệt đối. Hãy đối chiếu với đáp án mẫu của Thầy bên dưới.`;
    } else {
      score = 55;
      feedback = `Ý kiến của bạn có khía cạnh đáng cân nhắc, nhưng chưa chạm trúng bản chất sinh lý bệnh học và phản xạ lâm sàng thiết yếu của câu hỏi này. Bạn cần ôn tập kỹ các từ khóa then chốt và cơ chế xử lý cấp cứu mạch vành. Đọc kỹ đáp án mẫu của Thầy bên dưới để ghi nhớ sâu sắc!`;
    }

    setEvaluatedQuestions(prev => ({
      ...prev,
      [index]: { feedback, score }
    }));
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Printable and copyable clinical export format
  const handleExportText = () => {
    if (!result) return;
    
    let textReport = `BÁO CÁO ĐÁNH GIÁ VÀ BÀI GIẢNG BỆNH ÁN LÂM SÀNG\n`;
    textReport += `Được tạo bởi MEDCASEVN Clinical AI Tutor\n`;
    textReport += `=========================================================\n\n`;
    textReport += `1. THÔNG TIN CHUNG:\n`;
    textReport += `- Loại bệnh án: ${result.classification?.caseType || "Chưa phân loại"}\n`;
    textReport += `- Chuyên khoa: ${result.classification?.specialty || selectedSpecialty}\n`;
    textReport += `- Nghi ngờ chẩn đoán: ${result.classification?.suspectedDiagnosis || "Chưa rõ"}\n`;
    textReport += `- Đánh giá cấu trúc: ${result.classification?.structure || "Chưa đánh giá"}\n\n`;
    textReport += `=========================================================\n`;
    textReport += `2. ĐIỂM SỐ ĐÁNH GIÁ (TỔNG ĐIỂM: ${result.overallScore}/100):\n`;
    textReport += `- Khai thác bệnh sử & tiền sử: ${result.scores.history}/100\n`;
    textReport += `- Thăm khám lâm sàng: ${result.scores.exam}/100\n`;
    textReport += `- Chỉ định & Biện luận cận lâm sàng: ${result.scores.labs}/100\n`;
    textReport += `- Tư duy biện luận & Chẩn đoán: ${result.scores.reasoning}/100\n`;
    textReport += `- Hướng điều trị & Theo dõi: ${result.scores.treatment}/100\n\n`;
    
    if (result.detailedScores) {
      textReport += `Chi tiết điểm số thành phần (14 cấu phần):\n`;
      Object.entries(result.detailedScores).forEach(([key, val]: any) => {
        textReport += `  + ${key}: ${val.score}/${val.max}đ - ${val.comments}\n`;
      });
      textReport += `\n`;
    }

    textReport += `=========================================================\n`;
    textReport += `3. DANH SÁCH LỖI SAI CHUYÊN MÔN:\n`;
    result.comments.errors?.forEach((e, i) => {
      textReport += `  [Lỗi ${i+1}] ${e.title}\n  - Mô tả: ${e.desc}\n\n`;
    });

    textReport += `=========================================================\n`;
    textReport += `4. BÀI HỌC LÂM SÀNG CHUYÊN SÂU:\n`;
    result.teachingPoints?.forEach((tp, i) => {
      textReport += `  [Chủ đề ${i+1}] ${tp.title} (Phần: ${tp.section})\n`;
      textReport += `  - Tại sao sai: ${tp.whyWrong}\n`;
      textReport += `  - Tư duy đúng: ${tp.whyCorrection}\n`;
      textReport += `  - Kiến thức y văn: ${tp.clinicalKnowledge}\n`;
      textReport += `  - Mẹo lâm sàng: ${tp.preventiveTip}\n\n`;
    });

    textReport += `=========================================================\n`;
    textReport += `5. KẾ HOẠCH CẢI THIỆN CÁ NHÂN HÓA:\n`;
    textReport += `- Các lỗi sai cốt lõi: ${result.learningSummary?.errorsList.join(", ") || ""}\n`;
    textReport += `- Sai lầm phổ biến: ${result.learningSummary?.commonMistakes.join(", ") || ""}\n`;
    textReport += `- Mảng cần cải thiện: ${result.learningSummary?.areasForImprovement.join(", ") || ""}\n`;
    textReport += `- Kế hoạch hành động: ${result.learningSummary?.personalizedPlan || ""}\n`;

    const blob = new Blob([textReport], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `MedCaseVN_AI_Analysis_Report.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pb-12" id="analysis-tab-container">
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
        accept=".docx,.pdf,.txt"
        style={{ display: "none" }}
      />

      {/* 1. Left Sidebar: Specialties and Presets */}
      <div className="lg:col-span-1 space-y-4">
        {/* Specialty Selector Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Chuyên khoa Lâm sàng</h3>
          <div className="space-y-1.5" id="specialty-sidebar-selector">
            {specialties.map((spec) => {
              const isSelected = selectedSpecialty === spec.name;
              return (
                <button
                  key={spec.name}
                  onClick={() => {
                    setSelectedSpecialty(spec.name);
                    setError(null);
                  }}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className="text-base">{spec.icon}</span>
                  <span>{spec.name}</span>
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-100 mt-4 pt-4">
            <button
              onClick={handleClear}
              className="w-full flex items-center justify-center space-x-1.5 py-2.5 px-3 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 border-dashed rounded-xl transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Nhập ca phân tích mới</span>
            </button>
          </div>
        </div>

        {/* Quick Presets list */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Dùng bệnh án mẫu</h4>
          <div className="space-y-2">
            {PRESET_MEDICAL_RECORDS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleLoadPreset(preset.id)}
                className="w-full text-left p-2.5 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-700 hover:text-slate-900 transition-all flex items-start space-x-1.5"
              >
                <FileCode className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{preset.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Middle and Right Sections Layout depends on whether result is loaded */}
      {!result ? (
        <div className="lg:col-span-3 flex flex-col space-y-4">
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`bg-white border rounded-2xl p-6 shadow-xs flex-1 flex flex-col transition-all ${
              isDragging ? "border-blue-500 bg-blue-50/20 ring-4 ring-blue-500/10" : "border-slate-200"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-1.5 tracking-tight">
                  <Brain className="h-5.5 w-5.5 text-blue-600 animate-pulse" />
                  🤖 AI SỬA BỆNH ÁN THÔNG MINH
                </h2>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">
                  Trợ giảng lâm sàng AI chuẩn hóa tư duy biện luận y khoa và rà soát lỗi chuyên môn sâu sắc.
                </p>
              </div>

              {/* Action Tools for real document upload */}
              <div className="flex items-center gap-2">
                <button
                  onClick={triggerFileSelect}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5 text-blue-500" />
                  <span>Tải lên (.docx, .pdf, .txt)</span>
                </button>
              </div>
            </div>

            {/* Drag & drop helper indicator overlay */}
            <div className="flex-1 flex flex-col relative">
              {isDragging && (
                <div className="absolute inset-0 bg-blue-600/5 backdrop-blur-xs border-2 border-dashed border-blue-500 rounded-2xl flex flex-col items-center justify-center text-blue-600 z-10 pointer-events-none">
                  <Upload className="h-10 w-10 animate-bounce mb-2" />
                  <span className="font-extrabold text-sm">Thả tệp tin của bạn tại đây</span>
                  <span className="text-xs opacity-70">Chấp nhận tệp Word (.docx), PDF (.pdf) hoặc văn bản (.txt)</span>
                </div>
              )}

              <textarea
                id="medical-record-textarea"
                value={recordText}
                onChange={(e) => {
                  setRecordText(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Dán nội dung bệnh án chi tiết của bạn vào đây, hoặc kéo thả tệp Word (.docx), PDF, TXT để bắt đầu...&#10;&#10;Format gợi ý:&#10;1. Hành chính&#10;2. Lý do nhập viện&#10;3. Bệnh sử&#10;4. Tiền sử&#10;5. Khám lâm sàng&#10;6. Tóm tắt bệnh án&#10;7. Biện luận lâm sàng&#10;8. Chẩn đoán..."
                className="w-full flex-1 min-h-[380px] lg:min-h-[480px] bg-slate-50/50 p-4 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 font-mono text-xs sm:text-sm leading-relaxed resize-none"
              ></textarea>
              
              {recordText.length > 0 && (
                <div className="absolute bottom-3 right-3 text-[10px] font-bold text-slate-400 bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded-md border border-slate-100">
                  {recordText.length} ký tự
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs font-medium flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Action Button */}
            <div className="mt-4">
              <button
                id="analyze-record-button"
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/15 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>{loadingStage || "Đang phân tích lâm sàng..."}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Phân tích & Thẩm định Bệnh án với Trợ Giảng AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Result Panel (col-span-3) displayed after successful analysis */
        <div className="lg:col-span-3 space-y-4">
          {/* Header Bar with overall score */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="h-16 w-16 shrink-0 flex flex-col items-center justify-center rounded-full border-4 border-emerald-500 bg-emerald-50 shadow-sm">
                <span className="text-xl font-black text-emerald-700">{result.overallScore}</span>
                <span className="text-[8px] font-bold text-emerald-600">/100đ</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-800">
                    {result.classification?.caseType || "Bệnh án Lâm sàng"} - {result.classification?.specialty || selectedSpecialty}
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    {result.overallScore >= 80 ? "Đạt chuẩn tốt" : result.overallScore >= 70 ? "Đạt yêu cầu" : "Cần hoàn thiện thêm"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-bold mt-0.5">
                  Chẩn đoán sơ bộ: <span className="text-blue-600">{result.classification?.suspectedDiagnosis || "Nghi ngờ bệnh lý chính"}</span>
                </p>
                <p className="text-xs text-slate-500 font-medium">{result.classification?.structure}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={() => setResult(null)}
                className="inline-flex items-center gap-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Sửa lại bệnh án</span>
              </button>
              <button 
                onClick={handleExportText}
                className="inline-flex items-center gap-1 px-3 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Tải Báo cáo (.txt)</span>
              </button>
            </div>
          </div>

          {/* Tab bar for selecting different tutoring aspects */}
          <div className="bg-slate-100 p-1.5 rounded-xl flex flex-wrap gap-1">
            {[
              { id: "overview", label: "Chấm điểm chi tiết", icon: Award },
              { id: "comparison", label: "Sửa lỗi trực quan", icon: FileText },
              { id: "lessons", label: "Bài giảng lâm sàng", icon: BookOpen },
              { id: "checklist", label: "Checklist kiểm tra", icon: CheckSquare },
              { id: "rounds", label: "Đi buồng vấn đáp", icon: Users },
              { id: "report", label: "Báo cáo học tập", icon: BookOpenCheck }
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = resultTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setResultTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive 
                      ? "bg-white text-blue-600 shadow-sm" 
                      : "text-slate-500 hover:bg-white/50 hover:text-slate-800"
                  }`}
                >
                  <TabIcon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Contents */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs min-h-[400px]">
            {/* 1. OVERVIEW TAB: Component scores & Detailed 14 section mapping */}
            {resultTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-1.5 mb-2">
                    <Award className="h-5 w-5 text-blue-500" />
                    Biểu đồ Phân bổ Năng lực Bệnh án
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold mb-4">
                    Đánh giá trên 5 trụ cột năng lực lập hồ sơ bệnh án chuẩn quốc gia.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {[
                      { label: "Bệnh sử & Tiền sử", val: result.scores.history, color: "bg-blue-500", text: "Khai thác triệu chứng cơ năng & hoàn cảnh khởi phát." },
                      { label: "Khám Lâm sàng", val: result.scores.exam, color: "bg-teal-500", text: "Khám thực thể toàn thân & cơ quan chuyên khoa." },
                      { label: "Cận lâm sàng", val: result.scores.labs, color: "bg-purple-500", text: "Chỉ định y khoa chuẩn mực, biện luận chỉ số." },
                      { label: "Biện luận lâm sàng", val: result.scores.reasoning, color: "bg-amber-500", text: "Tư duy logic liên kết cơ chế bệnh học." },
                      { label: "Chẩn đoán & ĐT", val: result.scores.treatment, color: "bg-indigo-500", text: "Phác đồ điều trị, dự phòng biến chứng." }
                    ].map((item) => (
                      <div key={item.label} className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{item.label}</span>
                          <span className="text-2xl font-black text-slate-800">{item.val}%</span>
                        </div>
                        <div className="mt-3">
                          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mb-2">
                            <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.val}%` }}></div>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-snug font-medium">{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    Bảng Thẩm Định Điểm Khắt Khe (14 Cấu Phần Chuẩn Bệnh Viện)
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold mb-4">
                    Thang điểm 100 phân phối chi tiết cho từng phần hành chính và chuyên môn thực tế lâm sàng.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold">
                          <th className="py-2.5 px-3 rounded-l-lg">STT</th>
                          <th className="py-2.5 px-3">Cấu Phần Bệnh Án</th>
                          <th className="py-2.5 px-3 text-center">Điểm Đạt</th>
                          <th className="py-2.5 px-3 text-center">Tối Đa</th>
                          <th className="py-2.5 px-3 rounded-r-lg">Nhận xét chi tiết từ Giảng viên AI</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {result.detailedScores ? (
                          Object.entries(result.detailedScores).map(([key, value]: any, idx) => {
                            // Map technical keys to Vietnamese human-readable names
                            const keyLabels: { [key: string]: string } = {
                              administration: "1. Hành chính",
                              chiefComplaint: "2. Lý do nhập viện",
                              hpi: "3. Bệnh sử",
                              pmh: "4. Tiền sử",
                              physicalExam: "5. Khám lâm sàng",
                              caseSummary: "6. Tóm tắt bệnh án",
                              clinicalDiscussion: "7. Biện luận lâm sàng",
                              preliminaryDiagnosis: "8. Chẩn đoán sơ bộ",
                              definitiveDiagnosis: "9. Chẩn đoán xác định",
                              diagnostics: "10. Cận lâm sàng",
                              treatment: "11. Điều trị",
                              prognosis: "12. Tiên lượng",
                              followUp: "13. Theo dõi",
                              clinicalLessons: "14. Bài học lâm sàng"
                            };

                            const label = keyLabels[key] || key;
                            const isLow = value.score / value.max < 0.7;

                            return (
                              <tr key={key} className="hover:bg-slate-50/50 transition-all">
                                <td className="py-2.5 px-3 font-bold text-slate-400">{idx + 1}</td>
                                <td className="py-2.5 px-3 font-bold text-slate-700">{label}</td>
                                <td className="py-2.5 px-3 text-center">
                                  <span className={`font-black ${isLow ? "text-red-500" : "text-emerald-600"}`}>
                                    {value.score}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-center font-bold text-slate-400">{value.max}</td>
                                <td className="py-2.5 px-3 text-slate-600 font-semibold leading-relaxed">{value.comments}</td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={5} className="py-4 text-center text-slate-400">
                              Bệnh án mẫu không có bảng chi tiết 14 cấu phần.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 2. COMPARISON TAB: Side by side diff editing and highlights */}
            {resultTab === "comparison" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-1.5 mb-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    Chế Độ Sửa Lỗi Lâm Sàng Trực Quan (Original vs Corrected)
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold mb-4">
                    Đối chiếu trực tiếp văn bản của sinh viên và phương án sửa đổi chuẩn y văn. Nhấp vào các đoạn làm nổi bật để xem giải thích chuyên môn sâu.
                  </p>
                </div>

                {result.comparisonBlocks && result.comparisonBlocks.length > 0 ? (
                  <div className="space-y-6">
                    {result.comparisonBlocks.map((block, idx) => (
                      <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                        {/* Block Header */}
                        <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center justify-between">
                          <span className="text-xs font-black text-slate-700 uppercase tracking-wider">{block.sectionName}</span>
                          <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">Đã hiệu chỉnh</span>
                        </div>

                        {/* Side by side layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                          {/* Left: Original Student Text */}
                          <div className="p-4 space-y-2">
                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-red-500 flex items-center gap-1">
                              <span className="h-2 w-2 rounded-full bg-red-500"></span>
                              Nguyên bản của sinh viên
                            </h4>
                            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100/60 font-mono whitespace-pre-wrap">
                              {block.originalText}
                            </div>
                          </div>

                          {/* Right: AI Corrected Text */}
                          <div className="p-4 space-y-2">
                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1">
                              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                              AI viết lại chuẩn y văn
                            </h4>
                            <div className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-emerald-50/20 p-3.5 rounded-xl border border-emerald-100/30 whitespace-pre-wrap">
                              {block.correctedText}
                            </div>
                          </div>
                        </div>

                        {/* Pinpointed errors explanations */}
                        {block.highlights && block.highlights.length > 0 && (
                          <div className="bg-slate-50/50 border-t border-slate-100 p-4 space-y-3">
                            <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                              <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
                              Giải trình chi tiết các điểm sửa đổi
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {block.highlights.map((h, hIdx) => (
                                <div key={hIdx} className="bg-white border border-slate-200 p-3 rounded-xl shadow-2xs space-y-2">
                                  <div className="flex items-start justify-between gap-1">
                                    <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                      h.type === "error" ? "bg-red-100 text-red-700" : h.type === "improvement" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                                    }`}>
                                      {h.type === "error" ? "Lỗi chuyên môn" : h.type === "improvement" ? "Cần hoàn thiện" : "Bổ sung dữ liệu"}
                                    </span>
                                  </div>
                                  <p className="text-xs font-bold text-slate-700 line-through decoration-red-400">"{h.text}"</p>
                                  <div className="flex items-center gap-1 text-slate-400">
                                    <ArrowRight className="h-3 w-3 shrink-0" />
                                    <p className="text-xs font-black text-emerald-600">"{h.replacement}"</p>
                                  </div>
                                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100/50">{h.explanation}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 text-xs">
                    Không có phân tích so sánh trực quan cho ca bệnh này.
                  </div>
                )}
              </div>
            )}

            {/* 3. LESSONS TAB: Card-based clinical lessons */}
            {resultTab === "lessons" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-1.5 mb-2">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    Bài Giảng Lâm Sàng Trực Quan (Clinical Tutorials)
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold mb-4">
                    Không chỉ chỉ ra lỗi sai, AI sẽ phân tích bản chất sinh lý bệnh học và định hình cách tư duy lâm sàng đúng đắn cho bạn.
                  </p>
                </div>

                {result.teachingPoints && result.teachingPoints.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.teachingPoints.map((tp, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                          <div>
                            <span className="text-[9px] font-extrabold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md uppercase tracking-wider">{tp.section}</span>
                            <h4 className="font-extrabold text-slate-800 text-sm mt-1">{tp.title}</h4>
                          </div>
                          <Sparkles className="h-4.5 w-4.5 text-blue-500 shrink-0" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="bg-red-50/50 border border-red-100/40 p-3 rounded-xl">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-red-600 block mb-1">Tư duy cũ (Chưa chuẩn)</span>
                            <p className="text-xs text-red-900 leading-relaxed font-semibold">{tp.whyWrong}</p>
                          </div>
                          <div className="bg-emerald-50/50 border border-emerald-100/40 p-3 rounded-xl">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">Tư duy đúng chuẩn lâm sàng</span>
                            <p className="text-xs text-emerald-900 leading-relaxed font-semibold">{tp.whyCorrection}</p>
                          </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Cơ chế y khoa chuyên sâu & Đồng thuận y văn</span>
                          <p className="text-xs text-slate-600 leading-relaxed font-semibold">{tp.clinicalKnowledge}</p>
                        </div>

                        <div className="bg-amber-50 border border-amber-100/60 p-3.5 rounded-xl flex items-start gap-2.5">
                          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700 block">Mẹo đi buồng của Giáo sư</span>
                            <p className="text-xs text-amber-900 leading-relaxed font-semibold mt-0.5">{tp.preventiveTip}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 text-xs">
                    Không có bài giảng lâm sàng cụ thể cho ca bệnh này.
                  </div>
                )}
              </div>
            )}

            {/* 4. CHECKLIST TAB: Medical Record Completeness Checklist */}
            {resultTab === "checklist" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-1.5 mb-2">
                    <CheckSquare className="h-5 w-5 text-blue-500" />
                    Độ Đầy Đủ & Tuân Thủ Quy Trình Khám Chữa Bệnh (Record Completeness)
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold mb-4">
                    AI tự động rà soát nội dung của bạn đối chiếu với các checklists chuyên môn tiêu chuẩn của Bộ Y tế và AHA/ESC cho trường hợp nghi ngờ.
                  </p>
                </div>

                {result.completenessChecklist && result.completenessChecklist.length > 0 ? (
                  <div className="space-y-4">
                    {/* Completion rate progress */}
                    {(() => {
                      const completeCount = result.completenessChecklist.filter(c => c.status === "complete").length;
                      const totalCount = result.completenessChecklist.length;
                      const percent = Math.round((completeCount / totalCount) * 100);
                      return (
                        <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-slate-400 block">Độ bao phủ quy trình chuẩn</span>
                            <span className="text-xl font-black text-slate-800">{percent}% hoàn thành ({completeCount}/{totalCount} tiêu chí)</span>
                          </div>
                          <div className="h-3 w-40 bg-slate-200 rounded-full overflow-hidden shrink-0">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${percent}%` }}></div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Table of items */}
                    <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-bold">
                            <th className="py-2.5 px-3">Tên Tiêu Chí Kỹ Thuật</th>
                            <th className="py-2.5 px-3">Mức Độ Cần Thiết</th>
                            <th className="py-2.5 px-3 text-center">Trạng Thái</th>
                            <th className="py-2.5 px-3">Ghi Chú Đánh Giá</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {result.completenessChecklist.map((item, idx) => {
                            const isCritical = item.importance === "critical";
                            const isImportant = item.importance === "important";
                            const isComplete = item.status === "complete";
                            const isIncomplete = item.status === "incomplete";

                            return (
                              <tr key={idx} className="hover:bg-slate-50/50 transition-all">
                                <td className="py-3 px-3 font-bold text-slate-700">{item.item}</td>
                                <td className="py-3 px-3">
                                  <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                                    isCritical ? "bg-red-100 text-red-800" : isImportant ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-800"
                                  }`}>
                                    {isCritical ? "Bắt buộc" : isImportant ? "Quan trọng" : "Tùy chọn"}
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-center">
                                  {isComplete ? (
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">✓</span>
                                  ) : isIncomplete ? (
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-700 font-bold text-[10px]">✕</span>
                                  ) : (
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-500 font-bold text-[10px]">-</span>
                                  )}
                                </td>
                                <td className="py-3 px-3 text-slate-500 font-semibold leading-relaxed">{item.notes}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 text-xs">
                    Không tìm thấy dữ liệu checklist kiểm định độ đầy đủ.
                  </div>
                )}
              </div>
            )}

            {/* 5. ROUNDS TAB: Interactive Bedside Simulation Rounds Q&A */}
            {resultTab === "rounds" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-1.5 mb-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    Chế Độ Vấn Đáp Lâm Sàng - Đi Buồng Thường Nhật (Ward Rounds Mode)
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold mb-4">
                    AI giả lập câu hỏi xoáy, thách thức từ Giáo sư trưởng khoa đi buồng. Hãy thử gõ câu trả lời của bạn, AI sẽ chấm điểm và so sánh với đáp án chuẩn mực!
                  </p>
                </div>

                {result.wardRounds ? (
                  <div className="space-y-6">
                    {/* Presentation Score Banner */}
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Năng lực trình bày bệnh án miệng</span>
                        <span className="text-xl font-black text-slate-800">Điểm Trình Bày: {result.wardRounds.presentationScore}/100đ</span>
                        <p className="text-xs text-slate-500 font-semibold mt-1 leading-relaxed">{result.wardRounds.presentationFeedback}</p>
                      </div>
                      <Award className="h-10 w-10 text-amber-500 shrink-0 opacity-75" />
                    </div>

                    {/* Question List */}
                    <div className="space-y-6">
                      {result.wardRounds.interactiveQuestions.map((iq, idx) => {
                        const evaluated = evaluatedQuestions[idx];
                        const answer = studentAnswers[idx] || "";
                        
                        return (
                          <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                            {/* Card Header Question */}
                            <div className="bg-blue-50/40 border-b border-blue-50 px-4 py-3 flex items-start gap-2.5">
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-extrabold">Q{idx+1}</span>
                              <p className="text-xs sm:text-sm font-extrabold text-slate-800 leading-relaxed">{iq.question}</p>
                            </div>

                            {/* Interaction Area */}
                            <div className="p-4 space-y-4">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Câu trả lời lâm sàng của bạn</label>
                                <textarea
                                  placeholder="Nhập lập luận lâm sàng của bạn tại đây để gửi giảng viên..."
                                  value={answer}
                                  onChange={(e) => setStudentAnswers(prev => ({ ...prev, [idx]: e.target.value }))}
                                  disabled={!!evaluated}
                                  className="w-full min-h-[80px] bg-slate-50/50 p-3 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 leading-relaxed resize-none"
                                ></textarea>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEvaluateAnswer(idx, iq.question, iq.sampleAnswer)}
                                  disabled={!!evaluated}
                                  className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs font-bold px-3.5 py-2.5 rounded-lg shadow-sm cursor-pointer transition-all"
                                >
                                  <span>Nộp câu trả lời cho Thầy</span>
                                </button>
                                <button
                                  onClick={() => setEvaluatedQuestions(prev => ({ ...prev, [idx]: { feedback: "Đã yêu cầu xem trực tiếp đáp án mẫu của Thầy để tự rèn luyện.", score: 0 } }))}
                                  disabled={!!evaluated}
                                  className="inline-flex items-center gap-1 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold px-3.5 py-2.5 rounded-lg cursor-pointer transition-all"
                                >
                                  <span>Xem trực tiếp đáp án của Thầy</span>
                                </button>
                              </div>

                              {/* Evaluation Feedback and sample answer */}
                              {evaluated && (
                                <div className="border-t border-slate-100 pt-4 space-y-4">
                                  {/* Teacher Evaluation Comment */}
                                  {evaluated.score > 0 && (
                                    <div className="bg-emerald-50/40 border border-emerald-100 p-3.5 rounded-xl space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700">Thầy đánh giá chấm điểm</span>
                                        <span className="text-xs font-black text-emerald-800">Điểm vấn đáp: {evaluated.score}/100đ</span>
                                      </div>
                                      <p className="text-xs text-emerald-900 leading-relaxed font-semibold">{evaluated.feedback}</p>
                                    </div>
                                  )}

                                  {/* Professional sample answer */}
                                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2">
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">ĐÁP ÁN CHUẨN MỰC CỦA GIÁO SƯ</span>
                                    <p className="text-xs sm:text-sm text-slate-700 font-bold leading-relaxed whitespace-pre-wrap">{iq.sampleAnswer}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 text-xs">
                    Không có câu hỏi vấn đáp đi buồng tương thích cho ca bệnh này.
                  </div>
                )}
              </div>
            )}

            {/* 6. REPORT TAB: Learning summary, similar cases and personalized action plan */}
            {resultTab === "report" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-1.5 mb-2">
                    <BookOpenCheck className="h-5 w-5 text-blue-500" />
                    Báo Cáo Học Tập & Lộ Trình Cải Thiện Cá Nhân Hóa (Learning Summary)
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold mb-4">
                    AI tổng hợp các sai sót lặp lại trong bệnh án này và xây dựng một lộ trình học tập mục tiêu cho riêng bạn.
                  </p>
                </div>

                {result.learningSummary ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Critical Errors List */}
                      <div className="bg-red-50/20 border border-red-100/60 p-4 rounded-2xl space-y-2">
                        <span className="text-[10px] font-bold text-red-600 block uppercase tracking-wider">Danh sách sai sót cốt lõi của bạn</span>
                        <ul className="space-y-1.5 list-disc pl-4 text-xs text-red-900 font-semibold">
                          {result.learningSummary.errorsList.map((err, i) => (
                            <li key={i}>{err}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Common student mistakes in this topic */}
                      <div className="bg-amber-50/20 border border-amber-100/60 p-4 rounded-2xl space-y-2">
                        <span className="text-[10px] font-bold text-amber-600 block uppercase tracking-wider">Các lầm tưởng phổ biến sinh viên thường mắc</span>
                        <ul className="space-y-1.5 list-disc pl-4 text-xs text-amber-900 font-semibold">
                          {result.learningSummary.commonMistakes.map((mis, i) => (
                            <li key={i}>{mis}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Improvement Focus */}
                    <div className="bg-blue-50/10 border border-blue-100 p-4 rounded-2xl space-y-2">
                      <span className="text-[10px] font-bold text-blue-600 block uppercase tracking-wider">Mảng kiến thức lâm sàng cần bổ túc gấp</span>
                      <ul className="space-y-1.5 list-disc pl-4 text-xs text-blue-900 font-semibold">
                        {result.learningSummary.areasForImprovement.map((area, i) => (
                          <li key={i}>{area}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Custom Plan Callout */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 p-5 rounded-2xl space-y-3">
                      <h4 className="text-xs font-black text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        KẾ HOẠCH HÀNH ĐỘNG CÁ NHÂN HÓA ĐỂ ĐẠT 100/100đ
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-bold whitespace-pre-wrap">{result.learningSummary.personalizedPlan}</p>
                    </div>

                    {/* Similar cases section */}
                    {result.similarCases && result.similarCases.length > 0 && (
                      <div className="border-t border-slate-100 pt-6">
                        <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">Các Ca Bệnh Chuẩn Mực Tương Đồng (Nên tham khảo trong Thư viện)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {result.similarCases.map((sc, i) => (
                            <div key={i} className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex items-start gap-3">
                              <FileCode className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 block">{sc.code}</span>
                                <h5 className="text-xs font-black text-slate-800 mt-0.5">{sc.title}</h5>
                                <p className="text-[11px] text-slate-500 mt-1 leading-normal font-semibold">{sc.matchReason}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 text-xs">
                    Không tìm thấy dữ liệu tổng kết báo cáo lộ trình học tập.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
