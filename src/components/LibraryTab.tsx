import React, { useState, useEffect, useRef } from "react";
import { 
  BookOpen, Search, Sparkles, User, ShieldAlert, Heart, Activity, 
  FileText, CheckCircle, GraduationCap, Stethoscope, Send, Brain, 
  Sliders, ChevronRight, AlertTriangle, ClipboardCheck, HelpCircle, 
  Info, Layers, CheckSquare, MessageSquare, ListCollapse, ArrowRight
} from "lucide-react";
import { LibraryCase } from "../types";
import { LIBRARY_CASES } from "../data";
import { SPECIALTIES, DISEASE_TOPICS, generateDetailedCase } from "../libraryData";

interface SpecialtyItem {
  id: string;
  name: string;
  icon: string;
  numBệnhÁn: number;
  numCases: number;
  numBàiHọc: number;
}

interface TreeCategory {
  id: string;
  name: string;
  icon: string;
  specialties: SpecialtyItem[];
}

const SPECIALTY_TREE: TreeCategory[] = [
  {
    id: "noi-khoa",
    name: "NỘI KHOA",
    icon: "🩺",
    specialties: [
      { id: "im-card", name: "Tim mạch", icon: "❤️", numBệnhÁn: 45, numCases: 135, numBàiHọc: 30 },
      { id: "im-pulm", name: "Hô hấp", icon: "🫁", numBệnhÁn: 33, numCases: 99, numBàiHọc: 25 },
      { id: "im-gi", name: "Tiêu hóa", icon: "🍽️", numBệnhÁn: 33, numCases: 99, numBàiHọc: 25 },
      { id: "im-endo", name: "Nội tiết", icon: "🩸", numBệnhÁn: 27, numCases: 81, numBàiHọc: 20 },
      { id: "im-neuro", name: "Thần kinh", icon: "🧠", numBệnhÁn: 24, numCases: 72, numBàiHọc: 18 },
      { id: "im-neph", name: "Thận tiết niệu", icon: "💧", numBệnhÁn: 27, numCases: 81, numBàiHọc: 20 },
      { id: "im-hem", name: "Huyết học", icon: "🩸", numBệnhÁn: 12, numCases: 36, numBàiHọc: 10 },
      { id: "im-inf", name: "Truyền nhiễm", icon: "🦠", numBệnhÁn: 18, numCases: 54, numBàiHọc: 15 },
      { id: "im-gen", name: "Cơ xương khớp", icon: "🦴", numBệnhÁn: 15, numCases: 45, numBàiHọc: 12 },
      { id: "im-allergy", name: "Dị ứng miễn dịch", icon: "🛡️", numBệnhÁn: 9, numCases: 27, numBàiHọc: 8 }
    ]
  },
  {
    id: "ngoai-khoa",
    name: "NGOẠI KHOA",
    icon: "🔪",
    specialties: [
      { id: "surg-gen", name: "Ngoại tổng quát", icon: "🩺", numBệnhÁn: 24, numCases: 72, numBàiHọc: 16 },
      { id: "surg-ortho", name: "Chấn thương chỉnh hình", icon: "🦴", numBệnhÁn: 15, numCases: 45, numBàiHọc: 12 },
      { id: "surg-thoracic", name: "Ngoại lồng ngực", icon: "🫁", numBệnhÁn: 6, numCases: 18, numBàiHọc: 5 },
      { id: "surg-neuro", name: "Ngoại thần kinh", icon: "🧠", numBệnhÁn: 6, numCases: 18, numBàiHọc: 5 },
      { id: "surg-urology", name: "Ngoại niệu", icon: "💧", numBệnhÁn: 6, numCases: 18, numBàiHọc: 5 }
    ]
  },
  {
    id: "nhi-khoa",
    name: "NHI KHOA",
    icon: "👶",
    specialties: [
      { id: "ped-pulm", name: "Hô hấp nhi", icon: "🫁", numBệnhÁn: 9, numCases: 27, numBàiHọc: 8 },
      { id: "ped-gi", name: "Tiêu hóa nhi", icon: "🍼", numBệnhÁn: 9, numCases: 27, numBàiHọc: 8 },
      { id: "ped-card", name: "Tim mạch nhi", icon: "❤️", numBệnhÁn: 6, numCases: 18, numBàiHọc: 6 },
      { id: "ped-neonatal", name: "Sơ sinh", icon: "👶", numBệnhÁn: 9, numCases: 27, numBàiHọc: 8 }
    ]
  },
  {
    id: "san-phu-khoa",
    name: "SẢN PHỤ KHOA",
    icon: "🤰",
    specialties: [
      { id: "obgyn-preeclampsia", name: "Tiền sản giật", icon: "🤰", numBệnhÁn: 6, numCases: 18, numBàiHọc: 5 },
      { id: "obgyn-eclampsia", name: "Sản giật", icon: "🤰", numBệnhÁn: 6, numCases: 18, numBàiHọc: 5 },
      { id: "obgyn-ectopic", name: "Thai ngoài tử cung", icon: "🤰", numBệnhÁn: 6, numCases: 18, numBàiHọc: 5 },
      { id: "obgyn-postpartum", name: "Băng huyết sau sinh", icon: "🤰", numBệnhÁn: 6, numCases: 18, numBàiHọc: 5 }
    ]
  },
  {
    id: "tai-mui-hong",
    name: "TAI MŨI HỌNG",
    icon: "👂",
    specialties: [
      { id: "ent-sinusitis", name: "Viêm xoang", icon: "👃", numBệnhÁn: 6, numCases: 18, numBàiHọc: 5 },
      { id: "ent-otitis", name: "Viêm tai giữa", icon: "👂", numBệnhÁn: 6, numCases: 18, numBàiHọc: 5 },
      { id: "ent-laryngitis", name: "Viêm thanh quản", icon: "🗣️", numBệnhÁn: 6, numCases: 18, numBàiHọc: 5 },
      { id: "ent-polyp", name: "Polyp mũi", icon: "👃", numBệnhÁn: 6, numCases: 18, numBàiHọc: 5 }
    ]
  },
  {
    id: "mat",
    name: "MẮT",
    icon: "👁️",
    specialties: [
      { id: "oph-glaucoma", name: "Glaucoma", icon: "👁️", numBệnhÁn: 6, numCases: 18, numBàiHọc: 5 },
      { id: "oph-cataract", name: "Đục thủy tinh thể", icon: "👁️", numBệnhÁn: 6, numCases: 18, numBàiHọc: 5 },
      { id: "oph-conjunctivitis", name: "Viêm kết mạc", icon: "👁️", numBệnhÁn: 6, numCases: 18, numBàiHọc: 5 }
    ]
  },
  {
    id: "da-lieu",
    name: "DA LIỄU",
    icon: "🧴",
    specialties: [
      { id: "derm-atopic", name: "Viêm da cơ địa", icon: "🧴", numBệnhÁn: 6, numCases: 18, numBàiHọc: 5 },
      { id: "derm-psoriasis", name: "Vảy nến", icon: "🧴", numBệnhÁn: 6, numCases: 18, numBàiHọc: 5 },
      { id: "derm-zona", name: "Zona", icon: "🧴", numBệnhÁn: 6, numCases: 18, numBàiHọc: 5 },
      { id: "derm-urticaria", name: "Mày đay", icon: "🧴", numBệnhÁn: 6, numCases: 18, numBàiHọc: 5 }
    ]
  },
  {
    id: "ung-buou",
    name: "UNG BƯỚU",
    icon: "🎗️",
    specialties: [
      { id: "onc-lung", name: "Ung thư phổi", icon: "🎗️", numBệnhÁn: 6, numCases: 18, numBàiHọc: 5 },
      { id: "onc-liver", name: "Ung thư gan", icon: "🎗️", numBệnhÁn: 6, numCases: 18, numBàiHọc: 5 },
      { id: "onc-colorectal", name: "Ung thư đại trực tràng", icon: "🎗️", numBệnhÁn: 6, numCases: 18, numBàiHọc: 5 },
      { id: "onc-breast", name: "Ung thư vú", icon: "🎗️", numBệnhÁn: 6, numCases: 18, numBàiHọc: 5 }
    ]
  },
  {
    id: "hoi-suc-cap-cuu",
    name: "HỒI SỨC CẤP CỨU",
    icon: "🚨",
    specialties: [
      { id: "ic-septic-shock", name: "Sốc nhiễm khuẩn", icon: "🚨", numBệnhÁn: 6, numCases: 18, numBàiHọc: 5 },
      { id: "ic-anaphylaxis", name: "Sốc phản vệ", icon: "🚨", numBệnhÁn: 6, numCases: 18, numBàiHọc: 5 },
      { id: "ic-cardiac-arrest", name: "Ngừng tuần hoàn", icon: "🚨", numBệnhÁn: 6, numCases: 18, numBàiHọc: 5 },
      { id: "ic-ards", name: "ARDS", icon: "🚨", numBệnhÁn: 6, numCases: 18, numBàiHọc: 5 }
    ]
  },
  {
    id: "y-hoc-gia-dinh",
    name: "Y HỌC GIA ĐÌNH",
    icon: "🏠",
    specialties: [
      { id: "fm-hypertension", name: "Tăng huyết áp", icon: "🏠", numBệnhÁn: 6, numCases: 18, numBàiHọc: 5 },
      { id: "fm-diabetes", name: "Đái tháo đường", icon: "🏠", numBệnhÁn: 6, numCases: 18, numBàiHọc: 5 },
      { id: "fm-copd", name: "COPD", icon: "🏠", numBệnhÁn: 6, numCases: 18, numBàiHọc: 5 },
      { id: "fm-chronic", name: "Theo dõi bệnh mạn", icon: "🏠", numBệnhÁn: 6, numCases: 18, numBàiHọc: 5 }
    ]
  }
];

const getDiseaseTopicsForSpecialty = (specialtyId: string) => {
  switch (specialtyId) {
    case "im-card":
      return DISEASE_TOPICS.filter(t => t.specialtyId === "im-card");
    case "im-pulm":
      return DISEASE_TOPICS.filter(t => t.specialtyId === "im-pulm" && t.id !== "onc-lung-cancer" && t.id !== "lung-cancer");
    case "im-gi":
      return DISEASE_TOPICS.filter(t => t.specialtyId === "im-gi" && t.id !== "onc-liver-cancer" && t.id !== "hcc" && t.id !== "onc-colorectal-cancer" && t.id !== "colorectal-cancer");
    case "im-endo":
      return DISEASE_TOPICS.filter(t => t.specialtyId === "im-endo");
    case "im-neuro":
      return DISEASE_TOPICS.filter(t => t.specialtyId === "im-neuro");
    case "im-neph":
      return DISEASE_TOPICS.filter(t => t.specialtyId === "im-neph");
    case "im-hem":
      return DISEASE_TOPICS.filter(t => t.specialtyId === "im-hem");
    case "im-inf":
      return DISEASE_TOPICS.filter(t => t.specialtyId === "im-inf");
    case "im-gen": // Cơ xương khớp
      return DISEASE_TOPICS.filter(t => ["acute-gout", "rheumatoid-arthritis", "osteoporosis"].includes(t.id));
    case "im-allergy": // Dị ứng miễn dịch
      return DISEASE_TOPICS.filter(t => ["sle", "drug-allergy"].includes(t.id));
      
    case "surg-gen":
      return DISEASE_TOPICS.filter(t => ["peritonitis", "perforated-viscus", "inguinal-hernia", "anorectal-abscess"].includes(t.id));
    case "surg-ortho":
      return DISEASE_TOPICS.filter(t => t.specialtyId === "surg-ortho" || ["femoral-fracture", "forearm-fracture", "tibia-fracture", "shoulder-dislocation", "spinal-injury"].includes(t.id));
    case "surg-thoracic":
      return DISEASE_TOPICS.filter(t => t.specialtyId === "surg-thoracic");
    case "surg-neuro":
      return DISEASE_TOPICS.filter(t => t.specialtyId === "surg-neuro");
    case "surg-urology":
      return DISEASE_TOPICS.filter(t => t.specialtyId === "surg-urology");

    case "ped-pulm":
      return DISEASE_TOPICS.filter(t => ["pediatric-pneumonia", "ped-bronchiolitis"].includes(t.id));
    case "ped-gi":
      return DISEASE_TOPICS.filter(t => ["acute-diarrhea", "ped-intussusception"].includes(t.id));
    case "ped-card":
      return DISEASE_TOPICS.filter(t => ["ped-vsd", "ped-tof"].includes(t.id));
    case "ped-neonatal":
      return DISEASE_TOPICS.filter(t => ["ped-jaundice", "ped-neonatal-sepsis"].includes(t.id));

    case "obgyn-preeclampsia":
      return DISEASE_TOPICS.filter(t => t.id === "preeclampsia");
    case "obgyn-eclampsia":
      return DISEASE_TOPICS.filter(t => t.id === "eclampsia");
    case "obgyn-ectopic":
      return DISEASE_TOPICS.filter(t => t.id === "ectopic-pregnancy");
    case "obgyn-postpartum":
      return DISEASE_TOPICS.filter(t => t.id === "postpartum-hemorrhage");

    case "ent-sinusitis":
      return DISEASE_TOPICS.filter(t => t.id === "sinusitis");
    case "ent-otitis":
      return DISEASE_TOPICS.filter(t => t.id === "otitis-media");
    case "ent-laryngitis":
      return DISEASE_TOPICS.filter(t => t.id === "ent-laryngitis");
    case "ent-polyp":
      return DISEASE_TOPICS.filter(t => t.id === "ent-nasal-polyp");

    case "oph-glaucoma":
      return DISEASE_TOPICS.filter(t => t.id === "glaucoma");
    case "oph-cataract":
      return DISEASE_TOPICS.filter(t => t.id === "cataract");
    case "oph-conjunctivitis":
      return DISEASE_TOPICS.filter(t => t.id === "conjunctivitis");

    case "derm-atopic":
      return DISEASE_TOPICS.filter(t => t.id === "atopic-dermatitis");
    case "derm-psoriasis":
      return DISEASE_TOPICS.filter(t => t.id === "psoriasis");
    case "derm-zona":
      return DISEASE_TOPICS.filter(t => t.id === "zona");
    case "derm-urticaria":
      return DISEASE_TOPICS.filter(t => t.id === "urticaria");

    case "onc-lung":
      return DISEASE_TOPICS.filter(t => ["onc-lung-cancer", "lung-cancer"].includes(t.id));
    case "onc-liver":
      return DISEASE_TOPICS.filter(t => ["onc-liver-cancer", "hcc"].includes(t.id));
    case "onc-colorectal":
      return DISEASE_TOPICS.filter(t => ["onc-colorectal-cancer", "colorectal-cancer"].includes(t.id));
    case "onc-breast":
      return DISEASE_TOPICS.filter(t => t.id === "onc-breast-cancer");

    case "ic-septic-shock":
      return DISEASE_TOPICS.filter(t => t.id === "ic-septic-shock");
    case "ic-anaphylaxis":
      return DISEASE_TOPICS.filter(t => t.id === "ic-anaphylaxis");
    case "ic-cardiac-arrest":
      return DISEASE_TOPICS.filter(t => t.id === "ic-cardiac-arrest");
    case "ic-ards":
      return DISEASE_TOPICS.filter(t => t.id === "ic-ards");

    case "fm-hypertension":
      return DISEASE_TOPICS.filter(t => t.id === "fm-hypertension");
    case "fm-diabetes":
      return DISEASE_TOPICS.filter(t => t.id === "fm-diabetes");
    case "fm-copd":
      return DISEASE_TOPICS.filter(t => t.id === "fm-copd");
    case "fm-chronic":
      return DISEASE_TOPICS.filter(t => t.id === "fm-chronic-care");

    default:
      return DISEASE_TOPICS.filter(t => t.specialtyId === specialtyId);
  }
};

export const LibraryTab: React.FC = () => {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<"preset" | "dynamic">("dynamic");
  const [activeSectionTab, setActiveSectionTab] = useState<"record" | "rounds" | "ai_explain" | "ai_chat">("record");
  
  // Customization Settings for 1000+ Ca Bệnh
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string>("all");
  const [selectedTopicId, setSelectedTopicId] = useState<string>("hypertension");
  const [customAge, setCustomAge] = useState<number>(65);
  const [customGender, setCustomGender] = useState<"Nam" | "Nữ">("Nam");
  const [customSeverity, setCustomSeverity] = useState<"Điển hình" | "Nặng" | "Biến chứng">("Điển hình");
  
  // Collapsible category tree state
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "noi-khoa": true,
    "ngoai-khoa": false,
    "nhi-khoa": false,
    "san-phu-khoa": false,
    "tai-mui-hong": false,
    "mat": false,
    "da-lieu": false,
    "ung-buou": false,
    "hoi-suc-cap-cuu": false,
    "y-hoc-gia-dinh": false
  });

  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"All" | "Acute" | "Chronic">("All");
  
  // Selected Case (Active State)
  const [selectedCase, setSelectedCase] = useState<LibraryCase>(LIBRARY_CASES[0]);

  // AI Chat Q&A State
  const [chatMessages, setChatMessages] = useState<{ role: "student" | "ai"; text: string; timestamp: Date }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Quick AI explain states
  const [activeAiExplainTab, setActiveAiExplainTab] = useState<"pathophysiology" | "diagnostics" | "diagnosis" | "treatment">("pathophysiology");

  // Load default topic parameters when topic changes
  useEffect(() => {
    const topic = DISEASE_TOPICS.find(t => t.id === selectedTopicId);
    if (topic) {
      setCustomAge(topic.defaultAge);
      setCustomGender(topic.defaultGender);
    }
  }, [selectedTopicId]);

  // Handle Dynamic Case Generation
  const handleGenerateCase = () => {
    const generated = generateDetailedCase(selectedTopicId, customAge, customGender, customSeverity);
    setSelectedCase(generated);
    // Reset Q&A history
    setChatMessages([
      {
        role: "ai",
        text: `Xin chào! Thầy là trợ lý lâm sàng AI của ca bệnh **${generated.title}**. Em có câu hỏi nào về cơ chế bệnh sinh, chỉ số cận lâm sàng, lý do đưa ra chẩn đoán hay phác đồ điều trị của ca bệnh này không? Hãy gửi câu hỏi cho thầy nhé!`,
        timestamp: new Date()
      }
    ]);
    setActiveSectionTab("record");
  };

  // Generate dynamic case initially if dynamic mode is active
  useEffect(() => {
    if (activeTab === "dynamic") {
      handleGenerateCase();
    } else {
      setSelectedCase(LIBRARY_CASES[0]);
    }
  }, [activeTab]);

  // Filter Disease Topics based on Specialty & Search
  const activeSpecialtyTopics = selectedSpecialtyId === "all"
    ? DISEASE_TOPICS
    : getDiseaseTopicsForSpecialty(selectedSpecialtyId);

  const filteredTopics = activeSpecialtyTopics.filter((topic) => {
    const matchesSearch = 
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.symptoms.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      topic.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase())) ||
      topic.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeFilter === "All" || topic.category === activeFilter;
    
    return matchesSearch && matchesTab;
  });

  // Filter Presets (original 4 static cases)
  const filteredPresets = LIBRARY_CASES.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeFilter === "All" || c.category === activeFilter;

    return matchesSearch && matchesTab;
  });

  // Handle Q&A send to /api/library-chat
  const handleSendQuestion = async () => {
    if (!chatInput.trim()) return;
    const userText = chatInput;
    setChatInput("");
    
    const newMessages = [...chatMessages, { role: "student" as const, text: userText, timestamp: new Date() }];
    setChatMessages(newMessages);
    setIsAiTyping(true);

    try {
      const response = await fetch("/api/library-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseTitle: selectedCase.title,
          caseDetails: selectedCase,
          messages: newMessages.map(m => ({
            role: m.role,
            text: m.text
          }))
        })
      });

      const data = await response.json();
      setChatMessages([...newMessages, { role: "ai", text: data.response || "Không nhận được phản hồi.", timestamp: new Date() }]);
    } catch (err) {
      console.error(err);
      setChatMessages([...newMessages, { role: "ai", text: "Lỗi kết nối đến máy chủ lâm sàng AI. Vui lòng thử lại.", timestamp: new Date() }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAiTyping]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12" id="library-tab-container">
      
      {/* 1. Left Catalog Column (span 4) */}
      <div className="lg:col-span-4 space-y-4">
        
        {/* Module Header and Search Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
              <BookOpen className="h-5 w-5 text-blue-600" />
              📚 THƯ VIỆN BỆNH ÁN MẪU
            </h3>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full animate-pulse">
              {LIBRARY_CASES.length} Bệnh án
            </span>
          </div>

          {/* Database Mode Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-extrabold text-slate-600">
            <button
              onClick={() => setActiveTab("dynamic")}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "dynamic" ? "bg-white text-blue-700 shadow-xs" : "hover:text-slate-900"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Khởi tạo Ca bệnh ({LIBRARY_CASES.length})
            </button>
            <button
              onClick={() => setActiveTab("preset")}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "preset" ? "bg-white text-blue-700 shadow-xs" : "hover:text-slate-900"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              Bệnh án sẵn có ({LIBRARY_CASES.length})
            </button>
          </div>
          
          {/* Search bar */}
          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 focus-within:ring-2 focus-within:ring-blue-500/15 focus-within:border-blue-500 focus-within:bg-white transition-all">
            <Search className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Tìm triệu chứng, chẩn đoán, từ khóa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none placeholder-slate-400 font-medium"
            />
          </div>

          {/* Filtering tabs */}
          <div className="flex bg-slate-50 border border-slate-100 rounded-lg p-0.5 text-xs font-bold text-slate-600">
            {[
              { id: "All", label: "Tất cả" },
              { id: "Acute", label: "Cấp tính (Acute)" },
              { id: "Chronic", label: "Mạn tính (Chronic)" }
            ].map((tab) => {
              const isSel = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`flex-1 py-1.5 rounded-md transition-all ${
                    isSel ? "bg-white text-blue-600 shadow-xs" : "hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Mode Navigation & Lists */}
        {activeTab === "dynamic" ? (
          <div className="space-y-4">
            {/* Specialty Collapsible Tree Directory */}
            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs space-y-2 max-h-[380px] overflow-y-auto" id="library-specialty-tree">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                🌳 Cây chuyên khoa lâm sàng
              </span>
              <div className="space-y-1.5 text-xs">
                {/* Option for All Specialties */}
                <button
                  onClick={() => {
                    setSelectedSpecialtyId("all");
                    setSelectedTopicId(DISEASE_TOPICS[0].id);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl border flex items-center justify-between font-extrabold transition-all duration-200 cursor-pointer ${
                    selectedSpecialtyId === "all"
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-slate-50 border-slate-100 hover:border-slate-200 text-slate-700"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" /> Tất cả chuyên khoa
                  </span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold ${
                    selectedSpecialtyId === "all" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                  }`}>
                    {DISEASE_TOPICS.length} bệnh
                  </span>
                </button>

                {/* Specialty Categories */}
                {SPECIALTY_TREE.map((cat) => {
                  const isExpanded = !!expandedCategories[cat.id];
                  return (
                    <div key={cat.id} className="border border-slate-100/80 rounded-xl overflow-hidden bg-slate-50/30">
                      <button
                        onClick={() => toggleCategory(cat.id)}
                        className="w-full text-left px-3 py-2 bg-slate-50/80 hover:bg-slate-100/80 flex items-center justify-between font-extrabold text-slate-700 border-b border-slate-100 cursor-pointer transition-colors duration-150"
                      >
                        <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                          <span className="text-sm">{cat.icon}</span> {cat.name}
                        </span>
                        <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
                      </button>

                      {isExpanded && (
                        <div className="p-1 space-y-0.5 bg-white border-t border-slate-50">
                          {cat.specialties.map((spec) => {
                            const isSel = selectedSpecialtyId === spec.id;
                            return (
                              <button
                                key={spec.id}
                                onClick={() => {
                                  setSelectedSpecialtyId(spec.id);
                                  const specTopics = getDiseaseTopicsForSpecialty(spec.id);
                                  if (specTopics.length > 0) {
                                    setSelectedTopicId(specTopics[0].id);
                                  }
                                }}
                                className={`w-full text-left px-2.5 py-2 rounded-lg border transition-all duration-150 cursor-pointer flex flex-col gap-0.5 ${
                                  isSel
                                    ? "bg-blue-50/70 border-blue-300 shadow-2xs text-blue-900"
                                    : "bg-white border-transparent hover:border-slate-100 hover:bg-slate-50/50 text-slate-600"
                                }`}
                              >
                                <div className="flex items-center justify-between w-full font-bold">
                                  <span className="flex items-center gap-1.5 text-[11px]">
                                    <span className="text-xs">{spec.icon}</span> {spec.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-[8px] font-bold text-slate-400 mt-0.5">
                                  <span className="text-blue-600 bg-blue-50 px-1 py-0.2 rounded-sm">{spec.numBệnhÁn} bệnh án</span>
                                  <span>•</span>
                                  <span className="text-indigo-600 bg-indigo-50 px-1 py-0.2 rounded-sm">{spec.numCases} case</span>
                                  <span>•</span>
                                  <span className="text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded-sm">{spec.numBàiHọc} bài</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Topics list */}
            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs max-h-[380px] overflow-y-auto space-y-2" id="library-case-catalog-list">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                Danh sách bệnh ({filteredTopics.length})
              </span>

              {/* Specialty Stat Banner (as requested) */}
              {(() => {
                const activeNode = SPECIALTY_TREE.flatMap(cat => cat.specialties).find(s => s.id === selectedSpecialtyId);
                if (!activeNode) return null;
                return (
                  <div className="mx-1 mb-3 bg-gradient-to-br from-slate-50 to-blue-50/20 border border-blue-100 rounded-xl p-2.5 space-y-2">
                    <div className="flex items-center justify-between border-b border-blue-100/50 pb-1">
                      <span className="text-[9px] font-black text-blue-900 uppercase tracking-wider flex items-center gap-1">
                        {activeNode.icon} {activeNode.name}
                      </span>
                      <span className="text-[8px] text-slate-400 font-bold">Chỉ số học liệu</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-center">
                      <div className="p-1 bg-white rounded-lg border border-blue-50/50 shadow-2xs">
                        <span className="block text-[8px] text-slate-400 font-bold">BỆNH ÁN</span>
                        <span className="text-[10px] font-black text-blue-700">{activeNode.numBệnhÁn} mẫu</span>
                      </div>
                      <div className="p-1 bg-white rounded-lg border border-blue-50/50 shadow-2xs">
                        <span className="block text-[8px] text-slate-400 font-bold">CASE CLS</span>
                        <span className="text-[10px] font-black text-indigo-700">{activeNode.numCases} case</span>
                      </div>
                      <div className="p-1 bg-white rounded-lg border border-blue-50/50 shadow-2xs">
                        <span className="block text-[8px] text-slate-400 font-bold">BÀI HỌC</span>
                        <span className="text-[10px] font-black text-emerald-700">{activeNode.numBàiHọc} bài</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {filteredTopics.length > 0 ? (
                filteredTopics.map((topic) => {
                  const isSel = selectedTopicId === topic.id;
                  const specName = SPECIALTIES.find(s => s.id === topic.specialtyId)?.name || "Nội khoa";
                  return (
                    <div
                      key={topic.id}
                      onClick={() => setSelectedTopicId(topic.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSel
                          ? "bg-blue-50/70 border-blue-400 shadow-xs"
                          : "bg-white border-slate-100 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-slate-400">{topic.code}</span>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-md font-extrabold uppercase tracking-wider ${
                          topic.category === "Acute"
                            ? "bg-red-50 text-red-700 border border-red-100"
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}>
                          {topic.category === "Acute" ? "Cấp" : "Mạn"}
                        </span>
                      </div>
                      <h4 className={`text-xs sm:text-sm font-extrabold mt-1 leading-snug ${isSel ? "text-blue-800" : "text-slate-800"}`}>
                        {topic.title}
                      </h4>
                      <p className="text-[10px] font-semibold text-slate-500 mt-1 flex items-center justify-between">
                        <span>{specName}</span>
                        <span className="text-[9px] text-blue-500 hover:underline flex items-center gap-0.5 font-extrabold">
                          Tùy chỉnh <ChevronRight className="h-3 w-3" />
                        </span>
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs font-semibold">
                  Không tìm thấy bệnh lý nào khớp.
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Presets List (Original cases) */
          <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs max-h-[500px] overflow-y-auto space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 block mb-1">
              Bệnh án mẫu định sẵn ({filteredPresets.length})
            </span>
            {filteredPresets.map((c) => {
              const isSel = selectedCase.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCase(c)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSel
                      ? "bg-blue-50/60 border-blue-400 shadow-xs"
                      : "bg-white border-slate-100 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400">{c.code}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                      c.category === "Acute"
                        ? "bg-red-100 text-red-700 border border-red-200/50"
                        : "bg-amber-100 text-amber-700 border border-amber-200/50"
                    }`}>
                      {c.category === "Acute" ? "Cấp" : "Mạn"}
                    </span>
                  </div>
                  <h4 className={`text-xs sm:text-sm font-extrabold mt-1.5 leading-snug ${isSel ? "text-blue-800" : "text-slate-800"}`}>
                    {c.title}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-2 text-[11px] font-semibold text-slate-500">
                    <span>{c.specialty}</span>
                    <span>•</span>
                    <span>{c.gender} {c.age}T</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Right Workspace (span 8) */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Customization Dashboard Control Panel - Only visible for Dynamic Mode */}
        {activeTab === "dynamic" && (
          <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-5 shadow-md space-y-4 relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 translate-x-6 -translate-y-6">
              <Sliders className="h-44 w-44 rotate-12" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-3 gap-2">
              <div>
                <span className="text-[10px] font-extrabold text-blue-300 uppercase tracking-widest flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5" /> Bảng điều khiển khởi tạo ca bệnh
                </span>
                <h4 className="text-sm font-black mt-0.5 text-white">
                  Tùy biến các tham số lâm sàng để tạo bệnh án chuẩn y khoa
                </h4>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-extrabold self-start sm:self-auto">
                Tạo nhanh 1000+ kịch bản
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
              {/* Gender Parameter */}
              <div className="space-y-1.5">
                <label className="text-white/60 font-bold">Giới tính bệnh nhân</label>
                <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 font-extrabold">
                  {["Nam", "Nữ"].map((g) => (
                    <button
                      key={g}
                      onClick={() => setCustomGender(g as any)}
                      className={`flex-1 py-1.5 rounded-lg transition-all ${
                        customGender === g ? "bg-white text-slate-900" : "hover:bg-white/5 text-white"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Parameter */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-white/60 font-bold">
                  <span>Tuổi bệnh nhân</span>
                  <span className="text-blue-300 font-extrabold">{customAge} tuổi</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={customAge}
                    onChange={(e) => setCustomAge(Number(e.target.value))}
                    className="w-full accent-blue-500 h-1 bg-white/20 rounded-lg cursor-pointer"
                  />
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={customAge}
                    onChange={(e) => setCustomAge(Number(e.target.value))}
                    className="w-12 bg-white/5 border border-white/10 rounded-lg p-1 text-center text-xs font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Severity Parameter */}
              <div className="space-y-1.5">
                <label className="text-white/60 font-bold">Thể lâm sàng / Mức độ</label>
                <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 font-extrabold">
                  {["Điển hình", "Nặng", "Biến chứng"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setCustomSeverity(s as any)}
                      className={`flex-1 py-1.5 text-[10px] rounded-lg transition-all ${
                        customSeverity === s ? "bg-white text-slate-900" : "hover:bg-white/5 text-white"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleGenerateCase}
                className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-blue-500/10 cursor-pointer transition-all"
              >
                <Sparkles className="h-4 w-4 text-blue-200 animate-spin" />
                Khởi tạo Bệnh Án Chi Tiết
              </button>
            </div>
          </div>
        )}

        {/* Selected Case Workspace Dashboard */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6" id="library-case-detail-workspace">
          
          {/* Active Case Title and Details */}
          <div className="border-b border-slate-100 pb-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                {selectedCase.code}
              </span>
              <span className="text-xs font-extrabold text-slate-500">Chuyên khoa: {selectedCase.specialty}</span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-bold text-slate-400">{selectedCase.gender} {selectedCase.age} tuổi</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
              {selectedCase.title}
            </h2>
          </div>

          {/* Clinical Case Section Navigation Tabs */}
          <div className="flex border-b border-slate-100 overflow-x-auto text-xs font-extrabold text-slate-500 gap-1 sm:gap-2 pb-0.5">
            <button
              onClick={() => setActiveSectionTab("record")}
              className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeSectionTab === "record" ? "border-blue-600 text-blue-600 font-black" : "border-transparent hover:text-slate-800"
              }`}
            >
              <FileText className="h-4 w-4" />
              Bệnh Án 16 Phần
            </button>
            <button
              onClick={() => setActiveSectionTab("rounds")}
              className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeSectionTab === "rounds" ? "border-blue-600 text-blue-600 font-black" : "border-transparent hover:text-slate-800"
              }`}
            >
              <ClipboardCheck className="h-4 w-4" />
              Chuyên Đề Đi Buồng
            </button>
            <button
              onClick={() => setActiveSectionTab("ai_explain")}
              className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeSectionTab === "ai_explain" ? "border-blue-600 text-blue-600 font-black" : "border-transparent hover:text-slate-800"
              }`}
            >
              <Brain className="h-4 w-4 text-blue-500" />
              AI Giải Thích Chuyên Sâu
            </button>
            <button
              onClick={() => setActiveSectionTab("ai_chat")}
              className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap relative ${
                activeSectionTab === "ai_chat" ? "border-blue-600 text-blue-600 font-black" : "border-transparent hover:text-slate-800"
              }`}
            >
              <MessageSquare className="h-4 w-4 text-emerald-500" />
              Hỏi Đáp Lâm Sàng AI
              <span className="absolute top-0 right-0 h-1.5 w-1.5 bg-emerald-500 rounded-full"></span>
            </button>
          </div>

          {/* TAB CONTENT: Standard 16-Section Hospital Medical Record */}
          {activeSectionTab === "record" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl p-3">
                <span className="text-xs font-extrabold text-slate-600 flex items-center gap-1.5">
                  <Info className="h-4 w-4 text-blue-600" />
                  Mẫu bệnh án chuẩn y khoa ban hành bởi Bộ Y Tế Việt Nam
                </span>
                <span className="text-[10px] text-slate-400 font-bold hidden sm:inline">ICD-10 quy chuẩn</span>
              </div>

              {/* Grid Layout of the 16 clinical sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
                
                {/* Left Panel: Primary Admission & Patient Information */}
                <div className="space-y-5">
                  
                  {/* 1. Hành chính */}
                  <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 space-y-2">
                    <h4 className="font-extrabold text-blue-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-blue-600" />
                      1. Hành chính (Administration)
                    </h4>
                    <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-line font-medium font-mono">
                      {selectedCase.administrationText || `Họ và tên: NGUYỄN VĂN MẪU\nTuổi: ${selectedCase.age}\nGiới tính: ${selectedCase.gender}\nĐịa chỉ: TP. Hồ Chí Minh`}
                    </p>
                  </div>

                  {/* 2. Lý do nhập viện */}
                  <div className="bg-red-50/40 p-4 rounded-xl border border-red-100/70 space-y-2">
                    <h4 className="font-extrabold text-red-900 uppercase tracking-wider text-[11px] border-b border-red-200/50 pb-1.5 flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                      2. Lý do nhập viện (Chief Complaint)
                    </h4>
                    <p className="text-xs leading-relaxed font-bold text-slate-900 italic">
                      "{selectedCase.reasonForAdmissionText || selectedCase.reasonForAdmission}"
                    </p>
                  </div>

                  {/* 3. Bệnh sử */}
                  <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 space-y-2">
                    <h4 className="font-extrabold text-blue-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-blue-600" />
                      3. Bệnh sử (HPI)
                    </h4>
                    <p className="text-xs leading-relaxed text-slate-700 font-medium whitespace-pre-line">
                      {selectedCase.hpiText || selectedCase.historyOfPresentIllness}
                    </p>
                  </div>

                  {/* 4. Tiền sử */}
                  <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 space-y-2">
                    <h4 className="font-extrabold text-blue-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                      <ShieldAlert className="h-3.5 w-3.5 text-blue-600" />
                      4. Tiền sử (Past Medical History)
                    </h4>
                    <p className="text-xs leading-relaxed text-slate-700 font-medium whitespace-pre-line">
                      {selectedCase.pmhText || selectedCase.pastMedicalHistory}
                    </p>
                  </div>

                  {/* 5. Khám lâm sàng */}
                  <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 space-y-2">
                    <h4 className="font-extrabold text-blue-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                      <Heart className="h-3.5 w-3.5 text-blue-600" />
                      5. Khám lâm sàng (Physical Examination)
                    </h4>
                    <p className="text-xs leading-relaxed text-slate-700 font-medium whitespace-pre-line">
                      {selectedCase.physicalExamText || selectedCase.physicalExamSummary}
                    </p>
                  </div>

                  {/* 6. Tóm tắt bệnh án */}
                  <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 space-y-2">
                    <h4 className="font-extrabold text-blue-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                      <ClipboardCheck className="h-3.5 w-3.5 text-blue-600" />
                      6. Tóm tắt bệnh án (Case Summary)
                    </h4>
                    <p className="text-xs leading-relaxed text-slate-700 font-medium whitespace-pre-line">
                      {selectedCase.caseSummaryText || "Bệnh nhân có hội chứng và triệu chứng dương tính nổi bật của chuyên khoa."}
                    </p>
                  </div>

                  {/* 7. Biện luận lâm sàng */}
                  <div className="bg-blue-50/40 p-4 rounded-xl border border-blue-100 space-y-2 col-span-1 md:col-span-2">
                    <h4 className="font-extrabold text-blue-900 uppercase tracking-wider text-[11px] border-b border-blue-200 pb-1.5 flex items-center gap-1.5">
                      <Brain className="h-3.5 w-3.5 text-blue-600" />
                      7. Biện luận lâm sàng (Clinical Discussion)
                    </h4>
                    <p className="text-xs leading-relaxed text-slate-800 font-semibold whitespace-pre-line">
                      {selectedCase.clinicalDiscussionText || "Biện luận chẩn đoán dựa trên nguy cơ dịch tễ học, triệu chứng học lâm sàng và các chẩn đoán phân biệt chính."}
                    </p>
                  </div>

                </div>

                {/* Right Panel: Diagnosis, Diagnostics & Interventions */}
                <div className="space-y-5">
                  
                  {/* Vitals snapshot */}
                  <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 space-y-3">
                    <h4 className="font-extrabold text-blue-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <Activity className="h-3.5 w-3.5" /> Dấu hiệu sinh tồn lúc vào viện
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-center text-[11px] font-bold">
                      <div className="p-1.5 bg-white/5 rounded-lg border border-white/10">
                        <span className="block text-[8px] text-white/50 uppercase">Huyết áp</span>
                        <span>{selectedCase.vitals.bp}</span>
                      </div>
                      <div className="p-1.5 bg-white/5 rounded-lg border border-white/10">
                        <span className="block text-[8px] text-white/50 uppercase">Mạch / Tần số</span>
                        <span>{selectedCase.vitals.hr}</span>
                      </div>
                      <div className="p-1.5 bg-white/5 rounded-lg border border-white/10">
                        <span className="block text-[8px] text-white/50 uppercase">Nhịp thở</span>
                        <span>{selectedCase.vitals.rr}</span>
                      </div>
                      <div className="p-1.5 bg-white/5 rounded-lg border border-white/10">
                        <span className="block text-[8px] text-white/50 uppercase">SpO2</span>
                        <span>{selectedCase.vitals.spo2}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold text-center">
                      Thân nhiệt: <span className="text-white">{selectedCase.vitals.temp}</span>
                    </p>
                  </div>

                  {/* 8. Chẩn đoán sơ bộ */}
                  <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 space-y-1.5">
                    <h4 className="font-extrabold text-amber-900 uppercase tracking-wider text-[11px] border-b border-amber-200 pb-1.5">
                      8. Chẩn đoán sơ bộ (Preliminary Diagnosis)
                    </h4>
                    <p className="text-xs font-black text-amber-950">
                      {selectedCase.preliminaryDiagnosisText || `Chẩn đoán sơ bộ: Theo dõi ${selectedCase.title}`}
                    </p>
                  </div>

                  {/* 9. Chẩn đoán xác định */}
                  <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 space-y-1.5">
                    <h4 className="font-extrabold text-emerald-900 uppercase tracking-wider text-[11px] border-b border-emerald-200 pb-1.5 flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                      9. Chẩn đoán xác định (Definitive Diagnosis)
                    </h4>
                    <p className="text-xs font-black text-emerald-950 uppercase">
                      {selectedCase.definitiveDiagnosisText || `Chẩn đoán xác định: ${selectedCase.title}`}
                    </p>
                  </div>

                  {/* 10. Cận lâm sàng */}
                  <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 space-y-2">
                    <h4 className="font-extrabold text-blue-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1.5">
                      10. Cận lâm sàng (Ancillary Tests)
                    </h4>
                    <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-line font-medium mb-2">
                      {selectedCase.diagnosticsText || "Bao gồm các xét nghiệm huyết học, sinh hóa máu, điện tâm đồ hoặc hình ảnh học đặc hiệu."}
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[11px] border-collapse bg-white border border-slate-100 rounded-lg">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[9px]">
                            <th className="p-2">Tên Xét nghiệm</th>
                            <th className="p-2">Kết quả</th>
                            <th className="p-2">Ý nghĩa</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                          {selectedCase.labsAndDiagnostics.map((lab, i) => (
                            <tr key={i}>
                              <td className="p-2 font-bold">{lab.testName}</td>
                              <td className="p-2 text-red-600 font-mono font-bold">{lab.result}</td>
                              <td className="p-2 text-slate-500 font-medium">{lab.interpretation}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 11. Điều trị */}
                  <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 space-y-2">
                    <h4 className="font-extrabold text-blue-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                      <Stethoscope className="h-3.5 w-3.5 text-blue-600" />
                      11. Điều trị (Treatment & Interventions)
                    </h4>
                    <p className="text-xs leading-relaxed text-slate-700 font-semibold whitespace-pre-line">
                      {selectedCase.treatmentText || selectedCase.aiClinicalInsight}
                    </p>
                  </div>

                  {/* 12. Tiên lượng */}
                  <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 space-y-1.5">
                    <h4 className="font-extrabold text-blue-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1.5">
                      12. Tiên lượng (Prognosis)
                    </h4>
                    <p className="text-xs leading-relaxed text-slate-700 font-medium whitespace-pre-line">
                      {selectedCase.prognosisText || "Tốt nếu can thiệp kịp thời, cần theo dõi đề phòng tái phát."}
                    </p>
                  </div>

                  {/* 13. Theo dõi */}
                  <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 space-y-1.5">
                    <h4 className="font-extrabold text-blue-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1.5">
                      13. Theo dõi (Follow-up & Monitoring)
                    </h4>
                    <p className="text-xs leading-relaxed text-slate-700 font-medium whitespace-pre-line">
                      {selectedCase.followUpText || "Theo dõi dấu hiệu sinh tồn và tuân thủ điều trị ngoại trú."}
                    </p>
                  </div>

                </div>

              </div>

              {/* Bottom Large Panels for Clinical Education */}
              <div className="border-t border-slate-150 pt-5 space-y-5">
                
                {/* 14. Bài học lâm sàng */}
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-2">
                  <h4 className="font-extrabold text-blue-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4 text-blue-600" />
                    14. Bài học lâm sàng đắt giá (Clinical Lessons)
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-800 font-medium whitespace-pre-line">
                    {selectedCase.clinicalLessonsText || "1. Nhận biết triệu chứng lâm sàng cốt lõi sớm.\n2. Cận lâm sàng luôn đi kèm lập luận thực tế."}
                  </p>
                </div>

                {/* 15. Những lỗi sinh viên thường mắc */}
                <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-100 space-y-2">
                  <h4 className="font-extrabold text-amber-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    15. Những lỗi sinh viên thường mắc (Common Student Errors)
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-800 font-medium whitespace-pre-line">
                    {selectedCase.commonStudentErrorsText || "1. Đọc chẩn đoán mà không có lập luận logic.\n2. Không chuẩn bị đầy đủ các chẩn đoán loại trừ."}
                  </p>
                </div>

                {/* 16. Mẹo trình bệnh án ghi điểm */}
                <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100 space-y-2">
                  <h4 className="font-extrabold text-emerald-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    16. Mẹo ghi điểm khi trình bệnh án trước hội đồng (Tips for Case Presentation)
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-800 font-medium whitespace-pre-line">
                    {selectedCase.presentationTipsText || "Hãy tự tin dẫn dắt bắt đầu bằng mốc thời gian vàng và các hội chứng tích cực đầu tiên."}
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* TAB CONTENT: Specialty Rounds (Chuyên đề đi buồng) */}
          {activeSectionTab === "rounds" && (
            <div className="space-y-6">
              
              {/* Checklist */}
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 sm:p-5 space-y-3">
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-blue-600" />
                  BẢNG KIỂM / CHECKLIST ĐI BUỒNG LÂM SÀNG
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  Những việc sinh viên cần kiểm tra kỹ trước khi thầy cô đến giảng bài bên giường bệnh
                </p>
                <div className="space-y-2.5 pt-2">
                  {(selectedCase.wardRoundsChecklist || [
                    "Đọc kỹ toàn bộ hồ sơ bệnh án cũ và các kết quả xét nghiệm vừa cập nhật.",
                    "Đo lại các dấu hiệu sinh tồn cốt lõi: mạch, huyết áp, nhiệt độ.",
                    "Chuẩn bị sẵn sàng ống nghe và máy đo huyết áp bên mình.",
                    "Xin phép bệnh nhân và hỏi thăm sơ bộ mức độ cải thiện triệu chứng trong buổi sáng.",
                    "Kiểm tra lại các đường truyền hoặc ống dẫn lưu nếu có hoạt động bình thường."
                  ]).map((item, index) => (
                    <div key={index} className="flex items-start gap-2.5 text-xs text-slate-700 font-semibold">
                      <CheckSquare className="h-4.5 w-4.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Questions & Sample Answers */}
              <div className="space-y-4">
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-amber-600" />
                  CÂU HỎI THƯỜNG GẶP & CÂU TRẢ LỜI MẪU (VẤN ĐÁP)
                </h3>
                <div className="space-y-3.5">
                  {(selectedCase.commonTeacherQuestions || [
                    {
                      question: "Em hãy nêu cơ chế của cơn đau đặc trưng trên bệnh nhân này?",
                      answer: "Thưa thầy cô, cơ chế xuất phát từ sự bít tắc và căng giãn áp lực lòng cơ quan, kích thích trực tiếp thụ thể cảm giác tạng dấn truyền về hệ thần kinh trung ương."
                    },
                    {
                      question: "Tại sao cận lâm sàng đầu tay lại quan trọng hơn xét nghiệm đắt tiền trong trường hợp này?",
                      answer: "Thưa thầy cô, vì cận lâm sàng đầu tay (như siêu âm ổ bụng hoặc ECG) giúp cung cấp kết quả cực kỳ nhanh chóng để ra quyết định can thiệp thời gian vàng, giúp giảm thiểu biến chứng tử vong cho người bệnh."
                    }
                  ]).map((qa, index) => (
                    <div key={index} className="bg-slate-50 rounded-xl p-4 border border-slate-150 space-y-2">
                      <p className="text-xs font-black text-slate-900 flex gap-2">
                        <span className="text-amber-600">Q{index + 1}:</span> {qa.question}
                      </p>
                      <div className="bg-white border border-slate-100 rounded-lg p-3 text-xs font-semibold text-slate-700 leading-relaxed flex gap-2">
                        <span className="text-emerald-600 shrink-0">Đáp án mẫu:</span>
                        <p>{qa.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coping with Difficult Questions */}
              <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 sm:p-5 space-y-2">
                <h4 className="font-black text-amber-900 text-xs flex items-center gap-1.5">
                  <AlertTriangle className="h-4.5 w-4.5 text-amber-600" />
                  MẸO TRẢ LỜI KHI BỊ HỎI KHÓ (COPING TIPS)
                </h4>
                <p className="text-xs text-amber-950 font-semibold leading-relaxed whitespace-pre-line">
                  {selectedCase.difficultQuestionTips || "Khi bị hỏi các biến chứng khó hoặc cơ chế sâu chưa thuộc bài, hãy bình tĩnh: Trước hết đồng ý với câu hỏi, sau đó phân tích các yếu tố cấp cứu hàng đầu trước (Đường thở - Hô hấp - Tuần hoàn), sau đó hứa sẽ bổ sung kiến thức từ sách chuyên luận sâu để trả lời thầy cô tốt hơn."}
                </p>
              </div>

            </div>
          )}

          {/* TAB CONTENT: AI Deep Explanations (AI giải thích chuyên sâu) */}
          {activeSectionTab === "ai_explain" && (
            <div className="space-y-6">
              <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-extrabold text-slate-600 gap-1">
                {[
                  { id: "pathophysiology", label: "Cơ chế bệnh sinh", icon: Brain },
                  { id: "diagnostics", label: "Cận lâm sàng chuyên sâu", icon: Activity },
                  { id: "diagnosis", label: "Lập luận chẩn đoán", icon: CheckCircle },
                  { id: "treatment", label: "Tối ưu hóa điều trị", icon: Stethoscope }
                ].map((item) => {
                  const isSel = activeAiExplainTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveAiExplainTab(item.id as any)}
                      className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap text-[10px] sm:text-xs ${
                        isSel ? "bg-white text-blue-700 shadow-xs font-black" : "hover:text-slate-900"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {item.label}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Content Block */}
              <div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-5 space-y-3 min-h-[180px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-blue-800 font-extrabold mb-2.5">
                    <Sparkles className="h-4.5 w-4.5 text-blue-600 animate-bounce" />
                    <span className="uppercase text-xs tracking-wider">
                      {activeAiExplainTab === "pathophysiology" ? "AI giải thích Bệnh sinh" :
                       activeAiExplainTab === "diagnostics" ? "AI giải thích Cận lâm sàng" :
                       activeAiExplainTab === "diagnosis" ? "AI giải thích Lập luận Chẩn đoán" :
                       "AI giải thích Tối ưu hóa Điều trị"}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed whitespace-pre-line">
                    {activeAiExplainTab === "pathophysiology" ? (selectedCase.aiPathophysiology || selectedCase.aiClinicalInsight) :
                     activeAiExplainTab === "diagnostics" ? (selectedCase.aiDiagnosticsExplanation || "Hệ thống xét nghiệm máu và hình ảnh giúp đánh giá trực quan nhất mức độ hoại tử.") :
                     activeAiExplainTab === "diagnosis" ? (selectedCase.aiDiagnosisExplanation || "Chẩn đoán xác định dựa trên tiêu chuẩn vàng y văn kết hợp lâm sàng phong phú.") :
                     (selectedCase.aiTreatmentExplanation || "Điều trị tuân thủ chặt chẽ theo hướng dẫn quốc tế và Bộ Y Tế Việt Nam.")}
                  </p>
                </div>

                <div className="border-t border-blue-100/50 pt-3 flex justify-between items-center text-[10px] text-blue-600 font-extrabold uppercase">
                  <span>MEDCASEVN CLINICAL ENGINE</span>
                  <span className="flex items-center gap-1">
                    Cập nhật chuẩn y văn mới nhất <ChevronRight className="h-3 w-3 animate-ping" />
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: Interactive Q&A Chat Box */}
          {activeSectionTab === "ai_chat" && (
            <div className="space-y-4">
              <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-emerald-600" />
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase">HỎI ĐÁP CHUYÊN SÂU CÙNG AI LÂM SÀNG</h4>
                    <p className="text-[10px] text-slate-500 font-bold">Hãy hỏi AI về cơ chế bệnh sinh, cận lâm sàng, chẩn đoán, điều trị của ca bệnh hiện tại</p>
                  </div>
                </div>
                <span className="text-[9px] bg-emerald-500 text-white px-2 py-0.5 rounded font-extrabold">ONLINE</span>
              </div>

              {/* Chat Message Scroll Area */}
              <div className="border border-slate-200 rounded-2xl h-[320px] overflow-y-auto p-4 bg-slate-50 space-y-4 text-xs">
                {chatMessages.map((msg, index) => {
                  const isAi = msg.role === "ai";
                  return (
                    <div
                      key={index}
                      className={`flex ${isAi ? "justify-start" : "justify-end"}`}
                    >
                      <div className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs font-semibold leading-relaxed whitespace-pre-line ${
                        isAi 
                          ? "bg-white text-slate-800 border border-slate-100 rounded-tl-none" 
                          : "bg-blue-600 text-white rounded-tr-none"
                      }`}>
                        <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold mb-1">
                          <span>{isAi ? "Giảng viên AI" : "Sinh viên Y khoa"}</span>
                        </div>
                        <p className="text-xs sm:text-sm">{msg.text}</p>
                      </div>
                    </div>
                  );
                })}
                
                {isAiTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-100 text-slate-500 rounded-2xl p-3.5 rounded-tl-none flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-500 animate-spin" />
                      <span className="text-[11px] font-bold animate-pulse">Giảng viên AI đang soạn câu trả lời chuyên sâu...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Area */}
              <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 focus-within:ring-2 focus-within:ring-blue-500/15 focus-within:border-blue-500 transition-all">
                <input
                  type="text"
                  placeholder="Hỏi thầy: Tại sao Troponin tăng? Hay Cơ chế đau ngực của ca này là gì?..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendQuestion()}
                  className="w-full bg-transparent border-none py-3 text-xs sm:text-sm text-slate-800 focus:outline-none font-medium placeholder-slate-400"
                />
                <button
                  onClick={handleSendQuestion}
                  className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white p-2 rounded-lg cursor-pointer transition-all ml-2"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
