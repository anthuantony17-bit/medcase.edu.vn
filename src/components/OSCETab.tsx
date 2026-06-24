import React, { useState, useEffect, useRef } from "react";
import { Stethoscope, Clock, Send, MessageSquare, Shield, Activity, Heart, Eye, Check, Sparkles, Award, RotateCcw, AlertCircle, FileText } from "lucide-react";
import { OSCECase, OSCEMessage } from "../types";
import { OSCE_CASES } from "../data";

export const OSCETab: React.FC = () => {
  const [activeCase, setActiveCase] = useState<OSCECase>(OSCE_CASES[0]);
  const [osceMode, setOsceMode] = useState<"history" | "exam" | "labs" | "diagnosis">("history");
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(900); // 15 mins in seconds
  const [isTimerActive, setIsTimerActive] = useState(true);

  // Chat state
  const [messages, setMessages] = useState<OSCEMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isPatientTyping, setIsPatientTyping] = useState(false);

  // Exam and Lab states
  const [unlockedExamIds, setUnlockedExamIds] = useState<string[]>([]);
  const [unlockedLabIds, setUnlockedLabIds] = useState<string[]>([]);

  // Diagnosis submission state
  const [dxInput, setDxInput] = useState("");
  const [txInput, setTxInput] = useState("");
  const [osceGradeReport, setOsceGradeReport] = useState<any | null>(null);

  // Live feedback trackers
  const [historyProgress, setHistoryProgress] = useState(25);
  const [empathyScore, setEmpathyScore] = useState("A");
  const [liveFeedbackTips, setLiveFeedbackTips] = useState<string[]>([
    "Bắt đầu bằng việc hỏi lời chào thân mật và trấn an người bệnh đang đau đớn.",
    "Khai thác chi tiết thuộc tính PQRST của triệu chứng đau chính (vị trí, tính chất, hướng lan)."
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Case and chat messages
  useEffect(() => {
    // Set initial greeting
    const greetings: Record<string, string> = {
      "IM-402": "Bác sĩ ơi... Tôi đau ngực trái quá, khó thở nữa... Người mệt rã rời, cứu tôi với...",
      "SURG-201": "Dạ chào bác sĩ... Cái bụng hông bên phải của em đau quặn thốn quá, cả tối qua không ngủ được ạ."
    };

    setMessages([
      {
        id: "m-init",
        role: "patient",
        text: greetings[activeCase.id] || "Tôi mệt quá bác sĩ ơi...",
        timestamp: new Date()
      }
    ]);

    // Reset student exam interactions
    setTimeRemaining(900);
    setIsTimerActive(true);
    setUnlockedExamIds([]);
    setUnlockedLabIds([]);
    setDxInput("");
    setTxInput("");
    setOsceGradeReport(null);
    setHistoryProgress(25);
    setEmpathyScore("A");
    setLiveFeedbackTips([
      "Bắt đầu bằng lời chào thân mật và hỏi lý do vào viện tỉ mỉ.",
      "Khai thác đầy đủ thuộc tính cơ năng của triệu chứng đau (Vị trí, hướng lan, thời lượng)."
    ]);
  }, [activeCase]);

  // Timer countdown hook
  useEffect(() => {
    let interval: any = null;
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsTimerActive(false);
      handleTimeOutSubmit();
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPatientTyping]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleTimeOutSubmit = () => {
    alert("Hết giờ thi OSCE lâm sàng! Hệ thống đang tự động nộp bài và đánh giá.");
    handleSubmitExam();
  };

  // Student sends a question
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isPatientTyping) return;

    const studentMsg: OSCEMessage = {
      id: `std-${Date.now()}`,
      role: "student",
      text: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, studentMsg]);
    setInputText("");
    setIsPatientTyping(true);

    // Dynamic Live Feedback updates as patient is questioned
    updateLiveFeedback(textToSend);

    try {
      // Send chat history to backend for live simulated patient response
      const apiMessages = [...messages, studentMsg].map((m) => ({
        role: m.role,
        text: m.text
      }));

      const response = await fetch("/api/osce-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: activeCase.id,
          messages: apiMessages
        })
      });

      if (!response.ok) throw new Error("Connection failed");
      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: `pat-${Date.now()}`,
          role: "patient",
          text: data.response || "Tôi thấy mệt lắm bác sĩ ạ.",
          timestamp: new Date()
        }
      ]);
    } catch (err) {
      console.error(err);
      // Fallback
      setMessages((prev) => [
        ...prev,
        {
          id: `pat-${Date.now()}`,
          role: "patient",
          text: "Tôi mệt quá, ngực đau thắt bóp liên tục không dứt.",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsPatientTyping(false);
    }
  };

  // Update live progress and comments based on typed text
  const updateLiveFeedback = (text: string) => {
    const query = text.toLowerCase();
    
    // Check key clinical questions and upgrade history taking checklist
    let progressBoost = 0;
    let newTips = [...liveFeedbackTips];

    if (activeCase.id === "IM-402") {
      if ((query.includes("lan") || query.includes("bả vai") || query.includes("hàm")) && !messages.some(m => m.text.toLowerCase().includes("lan"))) {
        progressBoost += 15;
        newTips.push("✔️ Tốt: Đã khai thác hướng lan của đau ngực (vai trái, hàm dưới).");
      }
      if ((query.includes("bao lâu") || query.includes("bắt đầu") || query.includes("mấy tiếng")) && !messages.some(m => m.text.toLowerCase().includes("bao lâu"))) {
        progressBoost += 15;
        newTips.push("✔️ Tốt: Đã khai thác mốc khởi phát thời gian đau ngực.");
      }
      if ((query.includes("huyết áp") || query.includes("tiền sử") || query.includes("thuốc lá")) && !messages.some(m => m.text.toLowerCase().includes("tiền sử"))) {
        progressBoost += 15;
        newTips.push("✔️ Tốt: Đã khai thác tốt các yếu tố nguy cơ tim mạch.");
      }
      if (query.includes("đau như thế nào") || query.includes("đá đè") || query.includes("bóp")) {
        progressBoost += 10;
      }
      if (query.includes("dị ứng") && !messages.some(m => m.text.toLowerCase().includes("dị ứng"))) {
        progressBoost += 15;
        newTips = newTips.filter(t => !t.includes("nitroglycerin"));
        newTips.push("✔️ Xuất sắc: Đã hỏi tiền sử dị ứng thuốc trước khi lập phác đồ.");
      }
      
      // Empathy checks
      if (query.includes("xin lỗi") || query.includes("đồng cảm") || query.includes("đừng lo") || query.includes("bình tĩnh") || query.includes("trấn an")) {
        setEmpathyScore("A+");
        newTips.push("💖 Kỹ năng giao tiếp xuất sắc: Bác sĩ có thái độ thấu cảm, trấn an bệnh nhân lo âu tốt.");
      }
    } else {
      // Appendicitis surgical case
      if ((query.includes("di chuyển") || query.includes("đầu tiên") || query.includes("quanh rốn")) && !messages.some(m => m.text.toLowerCase().includes("rốn"))) {
        progressBoost += 20;
        newTips.push("✔️ Tốt: Khai thác đúng đặc điểm đau di chuyển từ rốn xuống hố chậu phải.");
      }
      if ((query.includes("kinh nguyệt") || query.includes("trễ kinh") || query.includes("có thai")) && !messages.some(m => m.text.toLowerCase().includes("kinh nguyệt"))) {
        progressBoost += 20;
        newTips.push("✔️ Tốt: Đã loại trừ chẩn đoán chửa ngoài tử cung vỡ ở bệnh nhân nữ trẻ.");
      }
      if (query.includes("sốt") || query.includes("nhiệt độ")) {
        progressBoost += 10;
      }
    }

    setHistoryProgress((prev) => Math.min(prev + progressBoost, 100));
    setLiveFeedbackTips(newTips);
  };

  const handleUnlockExam = (id: string) => {
    if (!unlockedExamIds.includes(id)) {
      setUnlockedExamIds((prev) => [...prev, id]);
    }
  };

  const handleUnlockLab = (id: string) => {
    if (!unlockedLabIds.includes(id)) {
      setUnlockedLabIds((prev) => [...prev, id]);
    }
  };

  // Submit diagnosis and grade OSCE
  const handleSubmitExam = () => {
    if (!dxInput.trim() || !txInput.trim()) {
      alert("Vui lòng điền Chẩn đoán sơ bộ và Hướng xử trí trước khi nộp bài thi.");
      return;
    }

    setIsTimerActive(false);

    // Compute grades based on unlocked elements & chat quality
    const hScore = historyProgress;
    const eScore = Math.min(30 + unlockedExamIds.length * 20, 100);
    const lScore = Math.min(30 + unlockedLabIds.length * 20, 100);
    
    // Evaluate clinical correctness of diagnosis
    let dxScore = 40;
    const dxLower = dxInput.toLowerCase();
    const txLower = txInput.toLowerCase();

    if (activeCase.id === "IM-402") {
      if (dxLower.includes("nhồi máu cơ tim") || dxLower.includes("stemi") || dxLower.includes("vành cấp")) {
        dxScore += 40;
      }
      if (dxLower.includes("vùng trước") || dxLower.includes("trước rộng")) {
        dxScore += 10;
      }
      // Treatment
      let txScore = 40;
      if (txLower.includes("can thiệp") || txLower.includes("pci") || txLower.includes("vàng") || txLower.includes("thông")) {
        txScore += 40;
      }
      if (txLower.includes("aspirin") || txLower.includes("kháng tiểu cầu") || txLower.includes("heparin")) {
        txScore += 15;
      }

      const totalOSCEAverage = Math.round((hScore + eScore + lScore + dxScore + txScore) / 5);

      setOsceGradeReport({
        score: totalOSCEAverage,
        checklist: {
          history: hScore,
          physical: eScore,
          diagnostics: lScore,
          clinicalDecision: dxScore,
          therapeuticPlan: txScore
        },
        strengths: [
          "Hỏi bệnh sử logic, hệ thống hóa triệu chứng rất tốt.",
          "Chỉ định đúng các cận lâm sàng cấp cứu (ECG 12 chuyển đạo, Troponin T siêu nhạy) giúp chẩn đoán xác định nhanh chóng.",
          "Chẩn đoán chính xác Nhồi máu cơ tim cấp thành trước rộng giờ thứ 2."
        ],
        weaknesses: [
          unlockedExamIds.length < 3 ? "Chưa thăm khám đầy đủ hệ hô hấp hoặc hệ mạch ngoại vi để loại trừ biến chứng." : "",
          !txLower.includes("aspirin") && !txLower.includes("clopidogrel") ? "Thiếu chỉ định dùng Kháng tiểu cầu kép (DAPT) ngay từ ban đầu." : "",
          "Cần ghi nhớ kiểm tra chống chỉ định của thuốc tiêu sợi huyết hoặc chống đông trước khi tiêm liều nạp."
        ].filter(Boolean)
      });

    } else {
      // Appendicitis SURG-201
      if (dxLower.includes("viêm ruột thừa") || dxLower.includes("ruột thừa cấp")) {
        dxScore += 50;
      }
      let txScore = 40;
      if (txLower.includes("mổ") || txLower.includes("phẫu thuật") || txLower.includes("nội soi")) {
        txScore += 50;
      }

      const totalOSCEAverage = Math.round((hScore + eScore + lScore + dxScore + txScore) / 5);

      setOsceGradeReport({
        score: totalOSCEAverage,
        checklist: {
          history: hScore,
          physical: eScore,
          diagnostics: lScore,
          clinicalDecision: dxScore,
          therapeuticPlan: txScore
        },
        strengths: [
          "Khai thác đúng diễn tiến di chuyển cơn đau hố chậu phải.",
          "Thực hiện nghiệm pháp phản ứng dội (Rebound) chuẩn xác.",
          "Chỉ định siêu âm bụng và công thức máu kịp thời."
        ],
        weaknesses: [
          !dxLower.includes("phân biệt") && "Nên chẩn đoán phân biệt thêm với viêm manh tràng hoặc u nang buồng trứng xoắn.",
          !txLower.includes("kháng sinh") && "Thiếu dự phòng kháng sinh trước mổ."
        ].filter(Boolean)
      });
    }
  };

  const handleRestartOSCE = () => {
    setActiveCase({ ...activeCase }); // triggers useEffect reset
  };

  return (
    <div className="space-y-6 pb-12" id="osce-tab-container">
      {/* 1. Case Header & Selector */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 font-extrabold text-sm">
            OSCE
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Ca thi hiện tại</span>
              <select
                id="case-selector"
                value={activeCase.id}
                onChange={(e) => {
                  const selected = OSCE_CASES.find((c) => c.id === e.target.value);
                  if (selected) setActiveCase(selected);
                }}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 text-xs font-bold text-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {OSCE_CASES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code}: {c.title}
                  </option>
                ))}
              </select>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight mt-0.5">
              {activeCase.code}: Bệnh nhân {activeCase.gender.toLowerCase()} {activeCase.age} tuổi - {activeCase.complaint}
            </h2>
          </div>
        </div>

        {/* Timer countdown and restart button */}
        <div className="flex items-center gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
          <div className="flex items-center space-x-2 bg-red-50 text-red-600 px-3.5 py-2 rounded-xl border border-red-100">
            <Clock className="h-4.5 w-4.5 animate-pulse" />
            <span className="font-mono font-bold text-sm sm:text-base">{formatTime(timeRemaining)}</span>
          </div>
          <button
            onClick={handleRestartOSCE}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
            title="Làm lại bài thi"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 2. Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left 3 columns: OSCE Active Board */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          
          {/* Sub-tabs selectors */}
          <div className="flex border-b border-slate-200 bg-white p-1 rounded-xl border" id="osce-sub-tabs">
            {[
              { id: "history", label: "Hỏi bệnh (History)", icon: MessageSquare },
              { id: "exam", label: "Thăm khám (Exam)", icon: Stethoscope },
              { id: "labs", label: "Chỉ định CLS (Labs)", icon: Activity },
              { id: "diagnosis", label: "Chẩn đoán & Xử trí", icon: Award }
            ].map((tab) => {
              const Icon = tab.icon;
              const isSel = osceMode === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`osce-subtab-${tab.id}`}
                  onClick={() => setOsceMode(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                    isSel
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sub-tab viewport */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex-1 flex flex-col min-h-[450px]">
            
            {/* History Mode (Chat Container) */}
            {osceMode === "history" && (
              <div className="flex flex-col flex-1 h-full" id="osce-chat-container">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-slate-500">AI Patient Simulator Active</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">Sinh viên hỏi bằng tiếng Việt tự do</span>
                </div>

                {/* Messages Log */}
                <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 max-h-[350px]">
                  {messages.map((m) => {
                    const isPatient = m.role === "patient";
                    return (
                      <div
                        key={m.id}
                        className={`flex ${isPatient ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl p-3 px-4 text-xs sm:text-sm shadow-xs ${
                            isPatient
                              ? "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/50"
                              : "bg-blue-600 text-white rounded-tr-none"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-8 mb-1">
                            <span className="text-[10px] font-black opacity-60 uppercase tracking-wider">
                              {isPatient ? `${activeCase.gender === "Nam" ? "Bệnh nhân" : "Bệnh nhi"} (${activeCase.age}T)` : "Bác sĩ Nguyễn Văn A"}
                            </span>
                            <span className="text-[9px] opacity-40">
                              {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="font-medium leading-relaxed whitespace-pre-line">{m.text}</p>
                        </div>
                      </div>
                    );
                  })}
                  
                  {isPatientTyping && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 border border-slate-200/50 rounded-2xl rounded-tl-none p-3 px-4 text-xs">
                        <span className="text-[10px] font-black opacity-60 uppercase tracking-wider block mb-1">Bệnh nhân</span>
                        <div className="flex items-center space-x-1 py-1.5 px-1">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400"></div>
                          <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400 delay-100"></div>
                          <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400 delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick-Ask Tag Suggestions */}
                <div className="mt-4 border-t border-slate-100 pt-3">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Gợi ý câu hỏi lâm sàng nhanh:</span>
                  <div className="flex flex-wrap gap-2">
                    {activeCase.id === "IM-402" ? (
                      <>
                        <button
                          onClick={() => handleSendMessage("Bác có đau ngực lan đi đâu không? Ví dụ như lan lên vai hay cánh tay trái?")}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-blue-200/60 transition-colors"
                        >
                          🧭 Đau lan đi đâu?
                        </button>
                        <button
                          onClick={() => handleSendMessage("Cơn đau ngực khởi phát đột ngột khi bác đang làm gì, và đau từ bao lâu rồi?")}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-blue-200/60 transition-colors"
                        >
                          ⏰ Cơn đau bao lâu rồi?
                        </button>
                        <button
                          onClick={() => handleSendMessage("Bác có bị khó thở, vã mồ hôi nhiều hay có cảm giác buồn nôn không?")}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-blue-200/60 transition-colors"
                        >
                          💦 Khó thở / Vã mồ hôi?
                        </button>
                        <button
                          onClick={() => handleSendMessage("Bác có tiền sử bị tăng huyết áp, tiểu đường, mỡ máu hay có hút thuốc lá không?")}
                          className="bg-teal-50 hover:bg-teal-100 text-teal-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-teal-200/60 transition-colors"
                        >
                          🚬 Tiền sử huyết áp, thuốc lá?
                        </button>
                        <button
                          onClick={() => handleSendMessage("Trong gia đình bác có ai bị đột tử, tai biến hay nhồi máu cơ tim sớm không?")}
                          className="bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-purple-200/60 transition-colors"
                        >
                          🏠 Tiền sử gia đình?
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleSendMessage("Cái bụng đau đầu tiên ở chỗ nào, rồi sau đó có di chuyển đi đâu không cháu?")}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-blue-200/60 transition-colors"
                        >
                          🧭 Đau di chuyển từ đâu?
                        </button>
                        <button
                          onClick={() => handleSendMessage("Cháu có cảm thấy gai gai sốt, chán ăn hay bị nôn ói gì từ hôm qua đến giờ không?")}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-blue-200/60 transition-colors"
                        >
                          🌡️ Sốt / Chán ăn / Nôn?
                        </button>
                        <button
                          onClick={() => handleSendMessage("Cháu hỏi thêm chút về phụ khoa, chu kỳ kinh nguyệt gần nhất là khi nào và có trễ kinh không?")}
                          className="bg-pink-50 hover:bg-pink-100 text-pink-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-pink-200/60 transition-colors"
                        >
                          🩸 Kinh nguyệt / Trễ kinh?
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Input form */}
                <div className="mt-3 flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500/15 focus-within:border-blue-500 transition-all">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputText)}
                    placeholder="Nhập câu hỏi lâm sàng cho bệnh nhân ảo..."
                    disabled={isPatientTyping}
                    className="flex-1 bg-transparent border-none py-2 px-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
                  />
                  <button
                    onClick={() => handleSendMessage(inputText)}
                    disabled={!inputText.trim() || isPatientTyping}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-300 transition-colors cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Exam Mode */}
            {osceMode === "exam" && (
              <div className="space-y-4" id="osce-exam-container">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Khám Thực Thể Lâm Sàng</h3>
                  <p className="text-xs text-slate-400 font-medium">Bấm vào từng thao tác để tiến hành thăm khám và nhận kết quả</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeCase.examManeuvers.map((maneuver) => {
                    const isUnlocked = unlockedExamIds.includes(maneuver.id);
                    return (
                      <div
                        key={maneuver.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isUnlocked
                            ? "bg-slate-50 border-slate-200"
                            : "bg-white border-slate-200 hover:border-blue-300 cursor-pointer shadow-xs hover:shadow-sm"
                        }`}
                        onClick={() => handleUnlockExam(maneuver.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs sm:text-sm font-bold text-slate-800">{maneuver.name}</span>
                          {isUnlocked ? (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                              <Check className="h-3 w-3" /> Đã khám
                            </span>
                          ) : (
                            <button className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md border border-blue-100">
                              Khám bệnh
                            </button>
                          )}
                        </div>
                        {isUnlocked ? (
                          <p className="text-xs text-slate-600 font-medium leading-relaxed bg-white p-2.5 rounded-lg border border-slate-100">
                            {maneuver.result}
                          </p>
                        ) : (
                          <div className="flex items-center justify-center py-4 text-slate-300 border border-dashed border-slate-100 rounded-lg text-xs font-semibold bg-slate-50/30">
                            Nhấp để lắng nghe hoặc quan sát
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Labs Mode */}
            {osceMode === "labs" && (
              <div className="space-y-4" id="osce-labs-container">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Yêu Cầu Cận Lâm Sàng Cấp Cứu</h3>
                  <p className="text-xs text-slate-400 font-medium">Lựa chọn chỉ định phù hợp để lấy kết quả xét nghiệm/hình ảnh học</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeCase.labTests.map((lab) => {
                    const isUnlocked = unlockedLabIds.includes(lab.id);
                    return (
                      <div
                        key={lab.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isUnlocked
                            ? "bg-slate-50 border-slate-200"
                            : "bg-white border-slate-200 hover:border-blue-300 cursor-pointer shadow-xs hover:shadow-sm"
                        }`}
                        onClick={() => handleUnlockLab(lab.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs sm:text-sm font-bold text-slate-800">{lab.name}</span>
                          {isUnlocked ? (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 border border-purple-100">
                              <Check className="h-3 w-3" /> Đã có kết quả
                            </span>
                          ) : (
                            <button className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md border border-blue-100">
                              Chỉ định xét nghiệm
                            </button>
                          )}
                        </div>
                        {isUnlocked ? (
                          <div className="space-y-2 bg-white p-3 rounded-lg border border-slate-100 text-xs">
                            <div className="flex justify-between font-mono">
                              <span className="font-bold text-slate-500">KẾT QUẢ:</span>
                              <span className="font-extrabold text-red-600">{lab.result}</span>
                            </div>
                            {lab.interpretation && (
                              <div className="text-[11px] font-semibold text-slate-600 border-t border-slate-100 pt-1.5 flex items-start gap-1">
                                <Sparkles className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                                <span>Phiên giải: {lab.interpretation}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center py-4 text-slate-300 border border-dashed border-slate-100 rounded-lg text-xs font-semibold bg-slate-50/30">
                            Nhấp để gửi yêu cầu chỉ định cấp cứu
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Diagnosis / Submission Mode */}
            {osceMode === "diagnosis" && (
              <div className="space-y-4 flex-1 flex flex-col justify-between" id="osce-diagnosis-container">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Báo Cáo Biện Luận & Quyết Định Điều Trị</h3>
                    <p className="text-xs text-slate-400 font-medium">Hoàn thiện biểu mẫu để kết thúc phiên thi OSCE lâm sàng</p>
                  </div>

                  {/* Input Fields */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Chẩn đoán xác định / Chẩn đoán sơ bộ & phân biệt:</label>
                      <input
                        type="text"
                        value={dxInput}
                        onChange={(e) => setDxInput(e.target.value)}
                        placeholder="Ví dụ: Nhồi máu cơ tim cấp vùng trước rộng giờ thứ 2 (STEMI)"
                        disabled={osceGradeReport !== null}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/15"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Hướng xử trí / Phác đồ điều trị khẩn cấp:</label>
                      <textarea
                        value={txInput}
                        onChange={(e) => setTxInput(e.target.value)}
                        placeholder="Ví dụ: Kích hoạt can thiệp mạch vành qua da (PCI), dùng kháng tiểu cầu kép Aspirin + Clopidogrel, chống đông Heparin..."
                        disabled={osceGradeReport !== null}
                        className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/15 resize-none"
                      ></textarea>
                    </div>
                  </div>

                  {/* Submission Button */}
                  {osceGradeReport === null && (
                    <button
                      id="submit-osce-button"
                      onClick={handleSubmitExam}
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/15 transition-all cursor-pointer"
                    >
                      <Check className="h-4.5 w-4.5" />
                      <span>Nộp bài thi OSCE và chấm điểm</span>
                    </button>
                  )}
                </div>

                {/* Grade Report Card Overlay */}
                {osceGradeReport && (
                  <div className="mt-4 border-t border-slate-100 pt-4 space-y-4 bg-slate-50/70 p-4 rounded-2xl border" id="osce-grade-report-card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-lg font-black">
                          {osceGradeReport.score}
                        </span>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Điểm thi OSCE</span>
                          <span className="text-xs font-extrabold text-emerald-800">
                            {osceGradeReport.score >= 80 ? "ĐẠT CHUẨN XUẤT SẮC" : "ĐẠT CHUẨN LÂM SÀNG"}
                          </span>
                        </div>
                      </div>

                      {/* Restart */}
                      <button
                        onClick={handleRestartOSCE}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-800 rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Thi lại</span>
                      </button>
                    </div>

                    {/* Breakdown grids */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[10px] sm:text-xs font-bold text-slate-700 bg-white p-3 rounded-xl border">
                      <div>
                        <span className="block text-slate-400 font-semibold">Hỏi bệnh</span>
                        <span className="text-sm font-black text-blue-600">{osceGradeReport.checklist.history}%</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-semibold">Thăm khám</span>
                        <span className="text-sm font-black text-teal-600">{osceGradeReport.checklist.physical}%</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-semibold">Cận lâm sàng</span>
                        <span className="text-sm font-black text-purple-600">{osceGradeReport.checklist.diagnostics}%</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-semibold">Chẩn đoán</span>
                        <span className="text-sm font-black text-amber-600">{osceGradeReport.checklist.clinicalDecision}%</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-semibold">Điều trị</span>
                        <span className="text-sm font-black text-indigo-600">{osceGradeReport.checklist.therapeuticPlan}%</span>
                      </div>
                    </div>

                    {/* Strengths & Weaknesses */}
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-xs font-extrabold text-emerald-800 flex items-center gap-1">💪 ĐIỂM SÁNG LÂM SÀNG:</h4>
                        <ul className="list-disc list-inside text-xs font-medium text-slate-600 space-y-1 mt-1 pl-1">
                          {osceGradeReport.strengths.map((s: string, idx: number) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>
                      {osceGradeReport.weaknesses.length > 0 && (
                        <div>
                          <h4 className="text-xs font-extrabold text-amber-800 flex items-center gap-1">⚠️ CẦN RÚT KINH NGHIỆM:</h4>
                          <ul className="list-disc list-inside text-xs font-medium text-slate-600 space-y-1 mt-1 pl-1">
                            {osceGradeReport.weaknesses.map((w: string, idx: number) => (
                              <li key={idx}>{w}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 column: Live Feedbacks & Vitals Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Live AI feedback panel */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Live AI Feedback</h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-extrabold text-slate-700 mb-1">
                  <span>Tiến độ khai thác bệnh sử</span>
                  <span>{historyProgress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${historyProgress}%` }}></div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
                <span className="font-bold text-slate-500">Kỹ năng giao tiếp & thấu cảm:</span>
                <span className="text-sm font-extrabold text-pink-600 bg-pink-50 border border-pink-100 px-2 py-0.5 rounded-md">
                  Cấp độ {empathyScore}
                </span>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gợi ý trực tiếp giảng viên:</span>
                <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
                  {liveFeedbackTips.map((tip, idx) => {
                    const isCheck = tip.startsWith("✔️") || tip.startsWith("💖");
                    return (
                      <div
                        key={idx}
                        className={`text-xs p-2 rounded-lg leading-relaxed font-semibold ${
                          isCheck
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-100/60"
                            : "bg-slate-50 text-slate-600 border border-slate-100"
                        }`}
                      >
                        {tip}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Vitals Sidebar display */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Dấu hiệu sinh tồn lâm sàng</h3>
            <div className="grid grid-cols-2 gap-3" id="osce-vitals-board">
              {[
                { name: "Huyết áp (BP)", val: activeCase.vitals.bp, icon: Activity, color: "text-red-500 bg-red-50" },
                { name: "Nhịp tim (HR)", val: activeCase.vitals.hr, icon: Heart, color: "text-rose-500 bg-rose-50" },
                { name: "Nhịp thở (RR)", val: activeCase.vitals.rr, icon: WindIcon, color: "text-blue-500 bg-blue-50" },
                { name: "Độ bão hòa (SpO2)", val: activeCase.vitals.spo2, icon: Shield, color: "text-teal-500 bg-teal-50" }
              ].map((vital) => {
                const Icon = vital.icon;
                return (
                  <div key={vital.name} className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 text-center">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider mb-1">{vital.name}</span>
                    <div className="flex items-center justify-center gap-1">
                      <Icon className={`h-3.5 w-3.5 ${vital.color.split(" ")[0]}`} />
                      <span className="text-xs sm:text-sm font-black text-slate-800">{vital.val}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-slate-100 mt-4 pt-3 flex flex-col space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                <span>Nhiệt độ (Temp):</span>
                <span className="text-slate-800">{activeCase.vitals.temp}</span>
              </div>
              <button 
                onClick={() => alert(`Đầy đủ thông tin sơ lược ca: ${activeCase.title}\nLý do vào viện: ${activeCase.complaint}\nBệnh nhân đang nằm ngửa tại giường bệnh, phòng cấp cứu, có thở máy hoặc thở oxy hỗ trợ nhẹ.`)}
                className="w-full text-center text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline pt-2 border-t border-slate-100 mt-2 cursor-pointer"
              >
                Xem bệnh án chi tiết
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple helper icon for Wind
const WindIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12.8 18a2.5 2.5 0 0 1-2.5 2.5 1 1 0 0 1-1-1 1.1 1.1 0 0 1 1-1h1.8" />
    <path d="M18 12a2.5 2.5 0 0 1-2.5 2.5 1 1 0 0 1-1-1 1.1 1.1 0 0 1 1-1H18a3 3 0 0 0 3-3 2.5 2.5 0 0 0-2.5-2.5 1 1 0 0 0-1 1 1.1 1.1 0 0 0 1 1H18" />
    <path d="M11 6a2.5 2.5 0 0 1-2.5 2.5 1 1 0 0 1-1-1 1.1 1.1 0 0 1 1-1H11a3 3 0 0 0 3-3 2.5 2.5 0 0 0-2.5-2.5 1 1 0 0 0-1 1 1.1 1.1 0 0 0 1 1H11" />
  </svg>
);
