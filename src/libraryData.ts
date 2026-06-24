import { LibraryCase } from "./types";

export interface SpecialtyInfo {
  id: string;
  name: string;
  subSpecialty?: string;
  description: string;
}

export interface DiseaseTopic {
  id: string;
  title: string;
  code: string;
  category: "Acute" | "Chronic";
  specialtyId: string;
  symptoms: string[];
  keywords: string[];
  defaultAge: number;
  defaultGender: "Nam" | "Nữ";
}

// All 16 specialties requested
export const SPECIALTIES: SpecialtyInfo[] = [
  { id: "im-gen", name: "Nội tổng quát", subSpecialty: "General Medicine", description: "Bệnh lý nội khoa tổng hợp, tự miễn, cơ xương khớp và lão khoa." },
  { id: "im-card", name: "Tim mạch", subSpecialty: "Cardiology", description: "Bệnh lý hệ tim mạch, mạch vành, van tim, suy tim và loạn nhịp." },
  { id: "im-pulm", name: "Hô hấp", subSpecialty: "Pulmonology", description: "Bệnh lý đường hô hấp, hen, COPD, viêm phổi và bệnh màng phổi." },
  { id: "im-gi", name: "Tiêu hóa", subSpecialty: "Gastroenterology", description: "Bệnh lý thực quản, dạ dày, tá tràng, gan mật, tụy và ruột." },
  { id: "im-endo", name: "Nội tiết", subSpecialty: "Endocrinology", description: "Rối loạn đường huyết, đái tháo đường, tuyến giáp và thượng thận." },
  { id: "im-neuro", name: "Thần kinh", subSpecialty: "Neurology", description: "Tai biến mạch máu não, động kinh, viêm não và sa sút trí tuệ." },
  { id: "im-neph", name: "Thận tiết niệu", subSpecialty: "Nephrology & Urology", description: "Tổn thương thận cấp, bệnh thận mạn, viêm cầu thận, sỏi thận." },
  { id: "im-hem", name: "Huyết học", subSpecialty: "Hematology", description: "Thiếu máu, xuất huyết giảm tiểu cầu, thalassemia, bạch cầu cấp." },
  { id: "im-inf", name: "Truyền nhiễm", subSpecialty: "Infectious Diseases", description: "Các bệnh truyền nhiễm nhiệt đới, sốt xuất huyết, uốn ván, dại, sepsis." },
  { id: "surg-gen", name: "Ngoại tổng quát", subSpecialty: "General Surgery", description: "Cấp cứu ngoại khoa tiêu hóa, viêm ruột thừa, thủng tạng rỗng, tắc ruột." },
  { id: "surg-ortho", name: "Chấn thương chỉnh hình", subSpecialty: "Orthopedics", description: "Chấn thương xương khớp, gãy cổ xương đùi, trật khớp, gãy chi." },
  { id: "pediatrics", name: "Nhi khoa", subSpecialty: "Pediatrics", description: "Bệnh lý đặc thù ở trẻ em: sốt co giật, tiêu chảy, tay chân miệng, sởi." },
  { id: "obgyn", name: "Sản phụ khoa", subSpecialty: "Obstetrics & Gynecology", description: "Tiền sản giật, sản giật, thai ngoài tử cung, băng huyết sau sinh." },
  { id: "dermatology", name: "Da liễu", subSpecialty: "Dermatology", description: "Bệnh lý da liễu, zona, vảy nến, viêm da cơ địa, mày đay." },
  { id: "ent", name: "Tai Mũi Họng", subSpecialty: "Otolaryngology", description: "Viêm tai giữa, viêm amidan mủ, viêm xoang cấp, viêm họng." },
  { id: "ophthalmology", name: "Mắt", subSpecialty: "Ophthalmology", description: "Glocom, đục thủy tinh thể, viêm màng bồ đào, viêm kết mạc." },
  { id: "im-allergy", name: "Dị ứng miễn dịch", subSpecialty: "Allergy & Immunology", description: "Dị ứng thuốc, lupus ban đỏ, dị ứng kháng sinh." },
  { id: "surg-thoracic", name: "Ngoại lồng ngực", subSpecialty: "Thoracic Surgery", description: "Tràn mủ màng phổi, chấn thương ngực kín." },
  { id: "surg-neuro", name: "Ngoại thần kinh", subSpecialty: "Neurosurgery", description: "Máu tụ ngoài màng cứng, chấn thương sọ não dập não." },
  { id: "surg-urology", name: "Ngoại niệu", subSpecialty: "Urologic Surgery", description: "Sỏi kẹt niệu quản, phì đại tuyến tiền liệt, bí tiểu cấp." },
  { id: "oncology", name: "Ung bướu", subSpecialty: "Oncology", description: "Ung thư phổi, ung thư gan, ung thư đại trực tràng, ung thư vú." },
  { id: "emergency", name: "Hồi sức cấp cứu", subSpecialty: "Emergency Medicine", description: "Sốc nhiễm khuẩn, sốc phản vệ, ngừng tuần hoàn, ARDS." },
  { id: "family-medicine", name: "Y học gia đình", subSpecialty: "Family Medicine", description: "Quản lý tăng huyết áp mạn, đái tháo đường mạn, COPD mạn tại cộng đồng." }
];

// All 108 core diseases covering all requested topics
export const DISEASE_TOPICS: DiseaseTopic[] = [
  // Tim mạch (15)
  { id: "hypertension", title: "Tăng huyết áp vô căn", code: "IM-CARD-01", category: "Chronic", specialtyId: "im-card", symptoms: ["Đau đầu vùng chẩm", "Chóng mặt", "Nóng bừng mặt", "Hồi hộp"], keywords: ["tăng huyết áp", "vô căn", "phì đại thất trái", "acei", "statin"], defaultAge: 58, defaultGender: "Nam" },
  { id: "hyplicative-crisis", title: "Cơn tăng huyết áp cấp cứu", code: "IM-CARD-02", category: "Acute", specialtyId: "im-card", symptoms: ["Huyết áp > 180/120 mmHg", "Nhức đầu dữ dội", "Mờ mắt", "Đau ngực"], keywords: ["tăng huyết áp cấp cứu", "nicardipine", "tổn thương cơ quan đích", "bão huyết áp"], defaultAge: 62, defaultGender: "Nữ" },
  { id: "stemi-anterior", title: "Nhồi máu cơ tim cấp (STEMI) trước bên giờ thứ 3", code: "IM-CARD-03", category: "Acute", specialtyId: "im-card", symptoms: ["Đau bóp nghẹt sau xương ức", "Vã mồ hôi lạnh", "Khó thở", "Lan cánh tay trái"], keywords: ["stemi", "mạch vành", "st chênh lên", "troponin", "lad", "pci"], defaultAge: 65, defaultGender: "Nam" },
  { id: "stemi-inferior", title: "Nhồi máu cơ tim cấp (STEMI) thành dưới giờ thứ 4", code: "IM-CARD-04", category: "Acute", specialtyId: "im-card", symptoms: ["Đau thượng vị", "Buồn nôn", "Vã mồ hôi", "Nhịp tim chậm"], keywords: ["stemi thành dưới", "rca", "st chênh d2 d3 avf", "troponin", "pci"], defaultAge: 68, defaultGender: "Nam" },
  { id: "nstemi", title: "Hội chứng mạch vành cấp không ST chênh lên (NSTEMI)", code: "IM-CARD-05", category: "Acute", specialtyId: "im-card", symptoms: ["Đau ngực khi nghỉ kéo dài", "Mệt mỏi", "Vả mồ hôi", "Khó thở nhẹ"], keywords: ["nstemi", "mạch vành", "st chênh xuống", "t âm", "troponin", "dapt"], defaultAge: 60, defaultGender: "Nam" },
  { id: "stable-angina", title: "Đau thắt ngực ổn định CCS III", code: "IM-CARD-06", category: "Chronic", specialtyId: "im-card", symptoms: ["Đau ngực khi gắng sức", "Cơn đau giảm khi nghỉ", "Cảm giác nặng ngực"], keywords: ["đau thắt ngực ổn định", "gắng sức", "hẹp mạch vành", "nitrate", "betablocker"], defaultAge: 63, defaultGender: "Nam" },
  { id: "acute-heart-failure", title: "Suy tim cấp (Hen tim / Phù phổi cấp)", code: "IM-CARD-07", category: "Acute", specialtyId: "im-card", symptoms: ["Khó thở dữ dội phải ngồi dậy", "Ran ẩm dâng lên nhanh", "Khạc bọt hồng", "Tím môi"], keywords: ["suy tim cấp", "phù phổi cấp", "hen tim", "furosemide", "bnp", "oxygong"], defaultAge: 72, defaultGender: "Nam" },
  { id: "chronic-heart-failure", title: "Suy tim mạn tính NYHA III", code: "IM-CARD-08", category: "Chronic", specialtyId: "im-card", symptoms: ["Khó thở khi nằm đầu thấp", "Phù mềm hai chân", "Gan to", "Tĩnh mạch cổ nổi"], keywords: ["suy tim mạn", "nyha", "bnp", "uptrust", "sglt2i", "ef giảm"], defaultAge: 69, defaultGender: "Nữ" },
  { id: "atrial-fibrillation", title: "Rung nhĩ đáp ứng thất nhanh", code: "IM-CARD-09", category: "Chronic", specialtyId: "im-card", symptoms: ["Hồi hộp đánh trống ngực", "Nhịp tim hoàn toàn không đều", "Hụt hơi", "Mệt mỏi"], keywords: ["rung nhĩ", "loạn nhịp", "mất sóng p", "noac", "digoxin", "chads-vasc"], defaultAge: 70, defaultGender: "Nữ" },
  { id: "atrial-flutter", title: "Cuồng nhĩ block nhĩ thất 2:1", code: "IM-CARD-10", category: "Chronic", specialtyId: "im-card", symptoms: ["Đánh trống ngực liên tục", "Hơi thở ngắn", "Chóng mặt nhẹ", "Tức ngực nhẹ"], keywords: ["cuồng nhĩ", "sóng f răng cưa", "block nhĩ thất", "amiodarone", "triệt đốt rf"], defaultAge: 64, defaultGender: "Nam" },
  { id: "av-block", title: "Block nhĩ thất độ III (AV block cấp 3)", code: "IM-CARD-11", category: "Acute", specialtyId: "im-card", symptoms: ["Ngất xỉu (cơn Stokes-Adams)", "Nhịp tim rất chậm < 40 ck/p", "Chóng mặt", "Mệt lả"], keywords: ["av block dộ 3", "nhịp chậm", "phân ly nhĩ thất", "tạo nhịp tạm thời", "atropine"], defaultAge: 75, defaultGender: "Nam" },
  { id: "infective-endocarditis", title: "Viêm nội tâm mạc nhiễm khuẩn van động mạch chủ", code: "IM-CARD-12", category: "Acute", specialtyId: "im-card", symptoms: ["Sốt kéo dài", "Âm thổi tâm trương mới", "Tổn thương Janeway ở tay", "Lách to"], keywords: ["viêm nội tâm mạc", "nhiễm khuẩn", "cấy máu", "sốt kéo dài", "duke criteria"], defaultAge: 45, defaultGender: "Nam" },
  { id: "pericarditis", title: "Viêm màng ngoài tim cấp tính do virus", code: "IM-CARD-13", category: "Acute", specialtyId: "im-card", symptoms: ["Đau ngực tăng khi nằm ngửa", "Đau giảm khi cúi người", "Tiếng cọ màng tim", "Sốt nhẹ"], keywords: ["viêm màng ngoài tim", "tiếng cọ màng tim", "st chênh lên lan tỏa", "nsaid", "colchicine"], defaultAge: 32, defaultGender: "Nam" },
  { id: "mitral-stenosis", title: "Hẹp van hai lá khít hậu thấp", code: "IM-CARD-14", category: "Chronic", specialtyId: "im-card", symptoms: ["Khó thở khi gắng sức", "Ho ra máu rải rác", "Rung tâm trương ở mỏm", "Tiếng T1 đanh"], keywords: ["hẹp van hai lá", "rung tâm trương", "t1 đanh", "hậu thấp", "suy tim phải"], defaultAge: 44, defaultGender: "Nữ" },
  { id: "mitral-regur", title: "Hở van hai lá nặng do sa lá van", code: "IM-CARD-15", category: "Chronic", specialtyId: "im-card", symptoms: ["Khó thở khi nằm", "Âm thổi tâm thu 3/6 ở mỏm lan nách", "Mệt mỏi", "Hồi hộp"], keywords: ["hở van hai lá", "sa lá van", "thổi tâm thu", "suy tim trái", "sửa van tim"], defaultAge: 52, defaultGender: "Nam" },

  // Hô hấp (11)
  { id: "cap", title: "Viêm phổi cộng đồng (CAP) mức độ nặng", code: "IM-PULM-01", category: "Acute", specialtyId: "im-pulm", symptoms: ["Sốt cao rét run", "Ho khạc đờm rỉ sắt", "Đau ngực kiểu màng phổi", "Thở nhanh co kéo"], keywords: ["viêm phổi", "cap", "curb-65", "đông đặc", "ceftriaxone", "levofloxacin"], defaultAge: 61, defaultGender: "Nam" },
  { id: "hap", title: "Viêm phổi bệnh viện (HAP) sau thở máy", code: "IM-PULM-02", category: "Acute", specialtyId: "im-pulm", symptoms: ["Sốt cao muộn", "Đờm mủ đục hôi", "Ran ẩm rải rác phổi", "SpO2 tụt sâu"], keywords: ["viêm phổi bệnh viện", "hap", "đa kháng", "pseudomonas", "piperacillin", "vancomycin"], defaultAge: 67, defaultGender: "Nam" },
  { id: "copd-exacerbation", title: "Đợt cấp Bệnh phổi tắc nghẽn mạn tính (COPD) Anthonisen I", code: "IM-PULM-03", category: "Acute", specialtyId: "im-pulm", symptoms: ["Khó thở tăng nặng", "Đờm đục vàng xanh", "Tăng lượng đờm khạc", "Thở co kéo"], keywords: ["copd đợt cấp", "anthonisen", "lồng ngực hình thùng", "khí phế thũng", "combivent"], defaultAge: 73, defaultGender: "Nam" },
  { id: "bronchial-asthma", title: "Cơn hen phế quản cấp mức độ trung bình", code: "IM-PULM-04", category: "Acute", specialtyId: "im-pulm", symptoms: ["Khó thở thì thở ra", "Thở khò khè nghe rõ", "Ho khan thành cơn về đêm", "Ran rít ran ngáy"], keywords: ["hen phế quản", "khó thở thở ra", "ran rít", "wheezing", "salbutamol", "budesonide"], defaultAge: 28, defaultGender: "Nữ" },
  { id: "pulmonary-tb", title: "Lao phổi tiến triển AFB dương tính", code: "IM-PULM-05", category: "Chronic", specialtyId: "im-pulm", symptoms: ["Ho khạc đờm > 2 tuần", "Sốt nhẹ về chiều", "Sụt cân nhanh", "Đổ mồ hôi trộm"], keywords: ["lao phổi", "afb", "sốt về chiều", "phác đồ rhze", "ho ra máu"], defaultAge: 42, defaultGender: "Nam" },
  { id: "pneumothorax", title: "Tràn khí màng phổi tự phát nguyên phát", code: "IM-PULM-06", category: "Acute", specialtyId: "im-pulm", symptoms: ["Đau ngực đột ngột như dao đâm", "Khó thở nhanh nông", "Rì rào phế nang mất", "Gõ vang trống"], keywords: ["tràn khí màng phổi", "tam chứng galliard", "gõ vang trống", "dẫn lưu màng phổi"], defaultAge: 22, defaultGender: "Nam" },
  { id: "pleural-effusion", title: "Tràn dịch màng phổi dịch tiết do lao", code: "IM-PULM-07", category: "Chronic", specialtyId: "im-pulm", symptoms: ["Đau ngực khi hít sâu", "Ho khan khi thay đổi tư thế", "Hội chứng 3 giảm", "Sốt nhẹ"], keywords: ["tràn dịch màng phổi", "dịch tiết", "hội chứng 3 giảm", "chọc dịch màng phổi"], defaultAge: 29, defaultGender: "Nam" },
  { id: "lung-abscess", title: "Áp xe phổi do vi khuẩn kị khí", code: "IM-PULM-08", category: "Acute", specialtyId: "im-pulm", symptoms: ["Sốt cao dao động", "Ho khạc đờm lượng nhiều thối", "Đau ngực", "Vẻ mặt nhiễm trùng"], keywords: ["áp xe phổi", "khạc đờm hôi", "mức nước hơi", "kị khí", "clindamycin"], defaultAge: 50, defaultGender: "Nam" },
  { id: "bronchiectasis", title: "Giãn phế quản bội nhiễm", code: "IM-PULM-09", category: "Chronic", specialtyId: "im-pulm", symptoms: ["Ho khạc đờm mủ lượng nhiều", "Ho ra máu rải rác", "Phổi nghe nhiều ran ẩm", "Móng tay khum"], keywords: ["giãn phế quản", "khạc đờm mủ", "ran ẩm to hạt", "hrct ngực", "vỗ rung"], defaultAge: 55, defaultGender: "Nữ" },
  { id: "pulmonary-embolism", title: "Thuyên tắc phổi (Pulmonary Embolism) nguy cơ trung bình", code: "IM-PULM-10", category: "Acute", specialtyId: "im-pulm", symptoms: ["Khó thở đột ngột", "Đau ngực kiểu màng phổi", "Ho ra máu đỏ tươi", "Nhịp tim nhanh"], keywords: ["thuyên tắc phổi", "d-dimer", "chụp ctpa", "huyết khối tĩnh mạch sâu", "heparin"], defaultAge: 59, defaultGender: "Nữ" },
  { id: "lung-cancer", title: "Ung thư biểu mô tuyến của phổi giai đoạn IV", code: "IM-PULM-11", category: "Chronic", specialtyId: "im-pulm", symptoms: ["Ho khan kéo dài", "Ho ra máu lẫn đờm", "Sụt cân nặng", "Khó thở âm ỉ"], keywords: ["ung thư phổi", "biểu mô tuyến", "hạch thượng đòn", "chụp ct ngực", "egfr"], defaultAge: 64, defaultGender: "Nam" },

  // Tiêu hóa (11)
  { id: "gastritis", title: "Viêm dạ dày cấp do HP", code: "IM-GI-01", category: "Acute", specialtyId: "im-gi", symptoms: ["Đau tức vùng thượng vị", "Ợ chua, ợ hơi", "Buồn nôn sau ăn", "Đầy bụng"], keywords: ["viêm dạ dày", "hp", "thượng vị", "nội soi dạ dày", "ppi", "amoxicillin"], defaultAge: 32, defaultGender: "Nữ" },
  { id: "peptic-ulcer", title: "Loét hành tá tràng tiến triển HP (+)", code: "IM-GI-02", category: "Chronic", specialtyId: "im-gi", symptoms: ["Đau thượng vị lúc đói", "Đau giảm sau ăn", "Đầy hơi", "Chậm tiêu"], keywords: ["loét tá tràng", "thượng vị đói", "nội soi", "ppi", "hp clomet"], defaultAge: 40, defaultGender: "Nam" },
  { id: "upper-gi-bleeding", title: "Xuất huyết tiêu hóa trên do loét dạ dày Forrest Ib", code: "IM-GI-03", category: "Acute", specialtyId: "im-gi", symptoms: ["Nôn ra máu đen / bã cà phê", "Tiêu phân đen hôi", "Chóng mặt khi thay đổi tư thế", "Da xanh"], keywords: ["xuất huyết tiêu hóa trên", "loét dạ dày", "forrest ib", "phân đen", "ppi truyền tĩnh mạch"], defaultAge: 48, defaultGender: "Nam" },
  { id: "lower-gi-bleeding", title: "Xuất huyết tiêu hóa dưới do xuất huyết túi thừa đại tràng", code: "IM-GI-04", category: "Acute", specialtyId: "im-gi", symptoms: ["Tiêu máu đỏ tươi lượng nhiều", "Đau quặn bụng dưới", "Mệt mỏi", "Mạch nhanh"], keywords: ["xuất huyết tiêu hóa dưới", "túi thừa", "tiêu máu đỏ", "nội soi đại tràng"], defaultAge: 66, defaultGender: "Nam" },
  { id: "decompensated-cirrhosis", title: "Xơ gan mất bù Child-Pugh C do rượu", code: "IM-GI-05", category: "Chronic", specialtyId: "im-gi", symptoms: ["Bụng to cổ trướng", "Vàng da vàng mắt", "Phù hai chân", "Sao mạch và lòng bàn tay son"], keywords: ["xơ gan mất bù", "cổ trướng", "child-pugh c", "sao mạch", "báng bụng", "spironolactone"], defaultAge: 56, defaultGender: "Nam" },
  { id: "ascites", title: "Cổ trướng tự do lượng nhiều do xơ gan", code: "IM-GI-06", category: "Chronic", specialtyId: "im-gi", symptoms: ["Bụng căng tức khó thở khi nằm", "Rốn lồi", "Gõ đục vùng thấp", "Tuần hoàn bàng hệ"], keywords: ["cổ trướng", "gõ đục vùng thấp", "chọc hút dịch báng", "albumin", "saag"], defaultAge: 54, defaultGender: "Nam" },
  { id: "acute-pancreatitis", title: "Viêm tụy cấp thể phù do tăng Triglyceride", code: "IM-GI-07", category: "Acute", specialtyId: "im-gi", symptoms: ["Đau bụng thượng vị đột ngột dữ dội", "Đau lan ra sau lưng", "Nôn ói nhiều không giảm đau", "Bụng chướng"], keywords: ["viêm tụy cấp", "triglyceride", "lipase", "amylase", "ct bụng balthazar", "bù dịch"], defaultAge: 38, defaultGender: "Nam" },
  { id: "acute-cholecystitis", title: "Viêm túi mật cấp do sỏi", code: "IM-GI-08", category: "Acute", specialtyId: "im-gi", symptoms: ["Đau tức hạ sườn phải lan vai phải", "Sốt cao rét run", "Murphy (+)", "Buồn nôn"], keywords: ["viêm túi mật", "sỏi túi mật", "murphy sign", "siêu âm bụng", "mổ nội soi"], defaultAge: 49, defaultGender: "Nữ" },
  { id: "cholelithiasis", title: "Sỏi ống mật chủ biến chứng nhiễm trùng đường mật", code: "IM-GI-09", category: "Acute", specialtyId: "im-gi", symptoms: ["Đau hạ sườn phải", "Sốt cao", "Vàng da vàng mắt rõ", "Gan to đau"], keywords: ["sỏi ống mật chủ", "tam chứng charcot", "vàng da", "ercp", "nhiễm trùng đường mật"], defaultAge: 51, defaultGender: "Nam" },
  { id: "hcc", title: "Ung thư biểu mô tế bào gan (HCC) trên nền xơ gan HBV", code: "IM-GI-10", category: "Chronic", specialtyId: "im-gi", symptoms: ["Đau âm ỉ hạ sườn phải", "Sụt cân", "Ăn uống kém", "Vàng da nhẹ"], keywords: ["hcc", "ung thư gan", "afp", "mri gan", "tace", "hbv"], defaultAge: 53, defaultGender: "Nam" },
  { id: "colorectal-cancer", title: "Ung thư đại tràng sigma biến chứng bán tắc ruột", code: "IM-GI-11", category: "Chronic", specialtyId: "im-gi", symptoms: ["Tiêu lỏng lẫn máu mũi", "Táo bón xen kẽ tiêu chảy", "Đau quặn bụng trái", "Sụt cân"], keywords: ["ung thư đại tràng", "bán tắc ruột", "nội soi đại tràng", "cea", "mổ cắt đại tràng"], defaultAge: 62, defaultGender: "Nam" },

  // Nội tiết (9)
  { id: "diabetes-t1", title: "Đái tháo đường type 1 phát hiện lần đầu", code: "IM-ENDO-01", category: "Chronic", specialtyId: "im-endo", symptoms: ["Ăn nhiều, uống nhiều", "Tiểu nhiều, gầy sút cân nhanh", "Mệt mỏi suy kiệt"], keywords: ["đái tháo đường type 1", "insulin", "peptid c", "đường huyết", "trẻ tuổi"], defaultAge: 16, defaultGender: "Nữ" },
  { id: "diabetes-t2", title: "Đái tháo đường type 2 biến chứng mạch máu ngoại vi", code: "IM-ENDO-02", category: "Chronic", specialtyId: "im-endo", symptoms: ["Tê bì hai bàn chân", "Uống nhiều tiểu nhiều", "Mờ mắt", "Vết loét chân chậm lành"], keywords: ["đái tháo đường type 2", "hba1c", "biến chứng mạch máu", "metformin", "loét bàn chân"], defaultAge: 55, defaultGender: "Nam" },
  { id: "dka", title: "Đái tháo đường biến chứng Toan ceton (DKA)", code: "IM-ENDO-03", category: "Acute", specialtyId: "im-endo", symptoms: ["Khó thở sâu kiểu Kussmaul", "Mất nước nặng môi se", "Hơi thở mùi táo chín", "Lơ mơ"], keywords: ["toan ceton", "dka", "insulin truyền", "anion gap", "kali máu", "bù dịch"], defaultAge: 22, defaultGender: "Nữ" },
  { id: "hhs", title: "Hội chứng tăng áp lực thẩm thấu do tăng đường huyết (HHS)", code: "IM-ENDO-04", category: "Acute", specialtyId: "im-endo", symptoms: ["Đường huyết rất cao > 33 mmol/L", "Lơ mơ hôn mê", "Mất nước cực độ", "Mạch nhanh nhỏ"], keywords: ["hhs", "tăng thẩm thấu", "mất nước", "insulin", "truyền dịch natri 0.9%"], defaultAge: 74, defaultGender: "Nam" },
  { id: "hypoglycemia", title: "Hạ đường huyết do quá liều Insulin", code: "IM-ENDO-05", category: "Acute", specialtyId: "im-endo", symptoms: ["Vã mồ hôi đầm đìa", "Bủn rủn chân tay", "Đói cồn cào", "Hồi hộp", "Lơ mơ"], keywords: ["hạ đường huyết", "insulin", "glucose ưu trương", "vã mồ hôi"], defaultAge: 61, defaultGender: "Nam" },
  { id: "hyperthyroidism", title: "Cường giáp trạng do bệnh Basedow", code: "IM-ENDO-06", category: "Chronic", specialtyId: "im-endo", symptoms: ["Bướu cổ phình to", "Mắt lồi", "Tay run tần số cao", "Sụt cân dù ăn nhiều", "Sợ nóng"], keywords: ["cường giáp", "basedow", "tsh giảm FT4 tăng", "kháng giáp tổng hợp", "methimazole"], defaultAge: 31, defaultGender: "Nữ" },
  { id: "hypothyroidism", title: "Suy giáp sau phẫu thuật cắt giáp toàn phần", code: "IM-ENDO-07", category: "Chronic", specialtyId: "im-endo", symptoms: ["Mệt mỏi chậm chạp", "Sợ lạnh", "Táo bón kéo dài", "Da khô dày phù niêm"], keywords: ["suy giáp", "tsh tăng FT4 giảm", "levothyroxine", "sợ lạnh"], defaultAge: 45, defaultGender: "Nữ" },
  { id: "thyroid-storm", title: "Cơn bão giáp trạng cấp tính (Thyroid Storm)", code: "IM-ENDO-08", category: "Acute", specialtyId: "im-endo", symptoms: ["Sốt cao > 40 độ C", "Nhịp tim cực nhanh > 140 ck/p", "Kích động vật vã", "Suy tim cấp"], keywords: ["bão giáp", "tử vong cao", "propylthiouracil", "lugol", "propranolol", "hydrocortisone"], defaultAge: 35, defaultGender: "Nữ" },
  { id: "adrenal-insufficiency", title: "Suy tuyến thượng thận thứ phát do lạm dụng Corticoid", code: "IM-ENDO-09", category: "Chronic", specialtyId: "im-endo", symptoms: ["Mệt mỏi rũ rượi", "Tụt huyết áp tư thế", "Mặt tròn đỏ dạng Cushing", "Yếu cơ gốc chi"], keywords: ["suy thượng thận", "lạm dụng corticoid", "cortisol sáng giảm", "hydrocortisone", "acth"], defaultAge: 50, defaultGender: "Nữ" },

  // Thận tiết niệu (9)
  { id: "aki", title: "Tổn thương thận cấp trước thận do mất nước nặng", code: "IM-NEPH-01", category: "Acute", specialtyId: "im-neph", symptoms: ["Tiểu ít hẳn (thiểu niệu)", "Khát nước dữ dội", "Creatinine tăng nhanh", "Da khô"], keywords: ["aki", "suy thận cấp trước thận", "creatinine", "bù dịch", "urea"], defaultAge: 60, defaultGender: "Nam" },
  { id: "ckd", title: "Bệnh thận mạn giai đoạn IV do đái tháo đường", code: "IM-NEPH-02", category: "Chronic", specialtyId: "im-neph", symptoms: ["Da xanh xao thiếu máu", "Phù nhẹ mi mắt và chân", "Huyết áp khó kiểm soát", "Chán ăn"], keywords: ["bệnh thận mạn", "ckd", "gfr giảm", "urea creatinine", "thiếu máu do thận", "epo"], defaultAge: 64, defaultGender: "Nam" },
  { id: "nephrotic-syndrome", title: "Hội chứng thận hư nguyên phát thể sang thương tối thiểu", code: "IM-NEPH-03", category: "Chronic", specialtyId: "im-neph", symptoms: ["Phù to toàn thân đột ngột", "Tiểu nhiều bọt", "Bụng chướng căng do tràn dịch", "Tiểu ít"], keywords: ["thận hư", "protein niệu > 3.5g", "giảm albumin máu", "prednisolone", "phù to"], defaultAge: 24, defaultGender: "Nữ" },
  { id: "glomerulonephritis", title: "Viêm cầu thận cấp sau nhiễm liên cầu khuẩn", code: "IM-NEPH-04", category: "Acute", specialtyId: "im-neph", symptoms: ["Tiểu đỏ sẫm như nước rửa thịt", "Phù nhẹ mi mắt buổi sáng", "Tăng huyết áp", "Tiểu ít"], keywords: ["viêm cầu thận cấp", "sau nhiễm liên cầu", "tiểu máu", "aso dương tính", "phù"], defaultAge: 12, defaultGender: "Nam" },
  { id: "uti", title: "Nhiễm trùng đường tiết niệu dưới (Viêm bàng quang cấp)", code: "IM-NEPH-05", category: "Acute", specialtyId: "im-neph", symptoms: ["Đái buốt, đái rắt", "Tiểu đục cuối bãi", "Đau tức vùng hạ vị", "Không sốt"], keywords: ["nhiễm trùng tiểu", "viêm bàng quang", "đái buốt rắt", "bạch cầu niệu", "ciprofloxacin"], defaultAge: 29, defaultGender: "Nữ" },
  { id: "pyelonephritis", title: "Viêm bể thận cấp tính có sỏi kẹt", code: "IM-NEPH-06", category: "Acute", specialtyId: "im-neph", symptoms: ["Sốt cao rét run", "Đau hông lưng dữ dội một bên", "Rung thận (+)", "Đái buốt rắt"], keywords: ["viêm bể thận cấp", "rung thận", "sốt cao", "siêu âm bể thận giãn", "kháng sinh iv"], defaultAge: 46, defaultGender: "Nữ" },
  { id: "nephrolithiasis", title: "Sỏi thận và cơn đau quặn thận cấp", code: "IM-NEPH-07", category: "Acute", specialtyId: "im-neph", symptoms: ["Đau quặn hông lưng dữ dội lan hạ vị", "Vật vã lăn lộn", "Đái máu", "Buồn nôn"], keywords: ["sỏi thận", "cơn đau quặn thận", "đái máu", "giảm đau nsaid", "diclofenac"], defaultAge: 42, defaultGender: "Nam" },
  { id: "hyperkalemia", title: "Tăng kali máu mức độ nặng ở bệnh nhân suy thận", code: "IM-NEPH-08", category: "Acute", specialtyId: "im-neph", symptoms: ["Yếu cơ liệt chi", "Tê bì quanh môi", "Nhịp tim chậm loạn nhịp", "Đau ngực"], keywords: ["tăng kali máu", "ecg sóng t cao nhọn", "calcium gluconate", "insulin glucose", "lọc máu"], defaultAge: 67, defaultGender: "Nam" },
  { id: "hyponatremia", title: "Hạ natri máu mức độ nặng do hội chứng SIADH", code: "IM-NEPH-09", category: "Acute", specialtyId: "im-neph", symptoms: ["Lơ mơ, ngủ gà", "Yếu mệt lả", "Co giật cơ", "Buồn nôn ói mửa"], keywords: ["hạ natri máu", "siadh", "natri clorua 3% ưu trương", "phù não"], defaultAge: 71, defaultGender: "Nữ" },

  // Thần kinh (8)
  { id: "stroke-ischemic", title: "Đột quỵ thiếu máu não cấp giờ thứ 2", code: "IM-NEURO-01", category: "Acute", specialtyId: "im-neuro", symptoms: ["Yếu nửa người đột ngột", "Méo miệng sang bên", "Nói ngọng không ra tiếng", "Tê nửa người"], keywords: ["đột quỵ nhồi máu não", "tiêu sợi huyết", "r-tpa", "ct sọ não loại trừ", "giờ vàng"], defaultAge: 63, defaultGender: "Nam" },
  { id: "stroke-hemorrhagic", title: "Xuất huyết não bao trong do tăng huyết áp", code: "IM-NEURO-02", category: "Acute", specialtyId: "im-neuro", symptoms: ["Đau đầu dữ dội đột ngột", "Nôn vọt", "Yếu liệt nửa người tiến triển", "Rối loạn ý thức"], keywords: ["xuất huyết não", "tăng huyết áp", "máu tụ nhu mô", "ct sọ tăng tỷ trọng", "giảm áp"], defaultAge: 59, defaultGender: "Nam" },
  { id: "epilepsy", title: "Động kinh cơn lớn toàn thể", code: "IM-NEURO-03", category: "Chronic", specialtyId: "im-neuro", symptoms: ["Co giật toàn thân trợn mắt", "Sùi bọt mép", "Mất ý thức trong cơn", "Tiểu không tự chủ"], keywords: ["động kinh", "co giật toàn thể", "điện não đồ eeg", "valproate", "depakine"], defaultAge: 25, defaultGender: "Nam" },
  { id: "meningitis", title: "Viêm màng não mủ do phế cầu", code: "IM-NEURO-04", category: "Acute", specialtyId: "im-neuro", symptoms: ["Sốt cao kèm lạnh run", "Đau đầu dữ dội", "Nôn vọt", "Cổ cứng (+)", "Kernig (+)"], keywords: ["viêm màng não mủ", "chọc dò dịch não tủy", "cổ cứng", "đục", "ceftriaxone liều cao"], defaultAge: 27, defaultGender: "Nam" },
  { id: "parkinson", title: "Bệnh Parkinson giai đoạn Hoenh & Yahr III", code: "IM-NEURO-05", category: "Chronic", specialtyId: "im-neuro", symptoms: ["Run tay khi nghỉ dạng vê thuốc", "Cứng đờ cơ khớp", "Dáng đi kéo lê, mất thăng bằng", "Vẻ mặt vô cảm"], keywords: ["parkinson", "run khi nghỉ", "cứng đờ", "levodopa", "madopar"], defaultAge: 68, defaultGender: "Nam" },
  { id: "alzheimer", title: "Sa sút trí tuệ mức độ trung bình do bệnh Alzheimer", code: "IM-NEURO-06", category: "Chronic", specialtyId: "im-neuro", symptoms: ["Quên sự việc gần đây", "Đi lạc đường", "Rối loạn hành vi, nghi ngờ người nhà", "Chậm chạp"], keywords: ["alzheimer", "sa sút trí tuệ", "giảm trí nhớ", "donepezil", "mri teo não thùy thái dương"], defaultAge: 79, defaultGender: "Nữ" },
  { id: "myasthenia", title: "Bệnh nhược cơ (Myasthenia Gravis) nhóm IIb", code: "IM-NEURO-07", category: "Chronic", specialtyId: "im-neuro", symptoms: ["Sụp mi mắt tăng dần về chiều", "Nói giọng mũi", "Khó nuốt sặc", "Yếu cơ gốc chi tăng khi vận động"], keywords: ["nhược cơ", "sụp mi mắt", "kháng thể kháng achr", "mestinon", "nhược cơ cấp"], defaultAge: 35, defaultGender: "Nữ" },
  { id: "guillain-barre", title: "Hội chứng Guillain-Barre (Viêm đa rễ dây thần kinh cấp)", code: "IM-NEURO-08", category: "Acute", specialtyId: "im-neuro", symptoms: ["Yếu hai chân tiến triển đối xứng hướng lên", "Mất phản xạ gân xương", "Tê bì ngọn chi", "Khó thở nhẹ"], keywords: ["guillain-barre", "yếu cơ tiến triển", "phân ly đạm tế bào", "ivig", "thay huyết tương"], defaultAge: 30, defaultGender: "Nam" },

  // Truyền nhiễm (6)
  { id: "dengue", title: "Sốt xuất huyết Dengue có dấu hiệu cảnh báo ngày thứ 4", code: "IM-INF-01", category: "Acute", specialtyId: "im-inf", symptoms: ["Sốt cao liên tục 3 ngày", "Đau bụng vùng gan", "Nôn ói nhiều", "Chảy máu chân răng", "Chấm xuất huyết"], keywords: ["sốt xuất huyết", "dengue", "dấu hiệu cảnh báo", "ns1", "tiểu cầu giảm", "truyền dịch"], defaultAge: 23, defaultGender: "Nữ" },
  { id: "sepsis", title: "Nhiễm trùng huyết từ đường vào đường niệu", code: "IM-INF-02", category: "Acute", specialtyId: "im-inf", symptoms: ["Sốt cao run lập cập", "Huyết áp tụt nhẹ", "Mạch nhanh", "Lơ mơ nhẹ", "Thở nhanh"], keywords: ["nhiễm trùng huyết", "sepsis", "sofa score", "cấy máu", "kháng sinh phổ rộng iv"], defaultAge: 65, defaultGender: "Nam" },
  { id: "hiv", title: "Nhiễm HIV/AIDS giai đoạn lâm sàng 4 biến chứng viêm phổi PCP", code: "IM-INF-03", category: "Chronic", specialtyId: "im-inf", symptoms: ["Khó thở tăng dần khi gắng sức", "Sốt kéo dài", "Ho khan kéo dài", "Sụt cân nghiêm trọng"], keywords: ["hiv/aids", "pcp", "cd4 thấp", "cotrimoxazole", "arv"], defaultAge: 34, defaultGender: "Nam" },
  { id: "covid19", title: "Nhiễm COVID-19 mức độ trung bình / nặng", code: "IM-INF-04", category: "Acute", specialtyId: "im-inf", symptoms: ["Sốt ho khan liên tục", "Khó thở tức ngực", "SpO2 tụt còn 92%", "Mất khứu giác"], keywords: ["covid-19", "sars-cov-2", "suy hô hấp", "remdesivir", "corticoid iv", "oxygong"], defaultAge: 56, defaultGender: "Nam" },
  { id: "tetanus", title: "Uốn ván toàn thân giai đoạn toàn phát", code: "IM-INF-05", category: "Acute", specialtyId: "im-inf", symptoms: ["Cứng hàm không mở được miệng", "Cơ bụng cứng như gỗ", "Cơn co giật uốn cong người", "Nuốt sặc"], keywords: ["uốn ván", "cứng hàm", "sat", "metronidazole iv", "mở khí quản", "diazepam"], defaultAge: 41, defaultGender: "Nam" },
  { id: "rabies", title: "Bệnh dại thể cuồng (Rabies)", code: "IM-INF-06", category: "Acute", specialtyId: "im-inf", symptoms: ["Sợ nước sợ gió dữ dội", "Kích động co thắt thanh quản", "Vả mồ hôi đầm đìa", "Lơ mơ"], keywords: ["bệnh dại", "chó cắn không tiêm phòng", "tử vong 100%", "cách ly giảm kích thích"], defaultAge: 28, defaultGender: "Nam" },

  // Ngoại tổng quát (8)
  { id: "appendicitis", title: "Viêm ruột thừa cấp ngày thứ 2", code: "SURG-GEN-01", category: "Acute", specialtyId: "surg-gen", symptoms: ["Đau hố chậu phải âm ỉ liên tục", "Đau di chuyển từ quanh rốn xuống", "Sốt nhẹ hâm hấp", "Buồn nôn"], keywords: ["viêm ruột thừa", "mcburney dương tính", "phản ứng dội", "mổ nội soi cắt ruột thừa"], defaultAge: 22, defaultGender: "Nam" },
  { id: "peritonitis", title: "Viêm phúc mạc toàn thể do ruột thừa vỡ", code: "SURG-GEN-02", category: "Acute", specialtyId: "surg-gen", symptoms: ["Đau khắp bụng dữ dội", "Sốt cao run", "Bụng cứng đề kháng khắp bụng", "Vẻ mặt nhiễm trùng"], keywords: ["viêm phúc mạc toàn thể", "đề kháng khắp bụng", "ruột thừa vỡ", "mổ cấp cứu lau rửa ổ bụng"], defaultAge: 35, defaultGender: "Nam" },
  { id: "bowel-obstruction", title: "Tắc ruột cơ học do dây chằng sau mổ cũ", code: "SURG-GEN-03", category: "Acute", specialtyId: "surg-gen", symptoms: ["Đau bụng từng cơn quặn", "Bí trung đại tiện hoàn toàn", "Nôn ói ra dịch thức ăn", "Bụng chướng to"], keywords: ["tắc ruột", "bí trung đại tiện", "quai ruột nổi", "dấu rắn bò", "mức nước hơi xquang"], defaultAge: 52, defaultGender: "Nữ" },
  { id: "perforated-viscus", title: "Thủng dạ dày gây viêm phúc mạc cấp", code: "SURG-GEN-04", category: "Acute", specialtyId: "surg-gen", symptoms: ["Đau bụng đột ngột dữ dội như dao đâm", "Bụng cứng như gỗ", "Vẻ mặt shock nhiễm trùng", "Nôn"], keywords: ["thủng tạng rỗng", "bụng cứng như gỗ", "liềm hơi dưới cơ hoành", "loét dạ dày tá tràng", "mổ khâu"], defaultAge: 47, defaultGender: "Nam" },
  { id: "inguinal-hernia", title: "Thoát vị bẹn nghẹt hố chậu trái", code: "SURG-GEN-05", category: "Acute", specialtyId: "surg-gen", symptoms: ["Khối phồng vùng bẹn đau chói", "Không đẩy khối lên được", "Đau quặn bụng", "Buồn nôn"], keywords: ["thoát vị bẹn nghẹt", "khối bẹn đau chói", "hoại tử ruột", "mổ giải nghẹt khẩn cấp"], defaultAge: 57, defaultGender: "Nam" },
  { id: "hemorrhoids", title: "Trĩ nội độ III biến chứng chảy máu đại thể", code: "SURG-GEN-06", category: "Chronic", specialtyId: "surg-gen", symptoms: ["Chảy máu tươi thành tia khi tiêu", "Khối trĩ sa ra ngoài phải dùng tay đẩy", "Đau rát hậu môn"], keywords: ["trĩ nội độ iii", "tiêu ra máu tươi", "búi trĩ sa", "phẫu thuật longo"], defaultAge: 43, defaultGender: "Nam" },
  { id: "anorectal-abscess", title: "Áp xe quanh hậu môn", code: "SURG-GEN-07", category: "Acute", specialtyId: "surg-gen", symptoms: ["Khối sưng nóng đỏ đau cạnh hậu môn", "Đau rát giật liên tục không ngồi được", "Sốt nhẹ"], keywords: ["áp xe cạnh hậu môn", "sưng nóng đỏ đau hậu môn", "rạch thoát mủ"], defaultAge: 36, defaultGender: "Nam" },
  { id: "colon-cancer", title: "Ung thư đại tràng phải thể sùi sụt cân", code: "SURG-GEN-08", category: "Chronic", specialtyId: "surg-gen", symptoms: ["Tiêu phân sệt lẫn máu đỏ sẫm", "Đau âm ỉ hố chậu phải", "Thiếu máu da xanh xao", "Sụt cân nhanh"], keywords: ["ung thư đại tràng phải", "u đại tràng sùi", "cea tăng", "mổ cắt bán đại tràng phải"], defaultAge: 64, defaultGender: "Nam" },

  // Chấn thương chỉnh hình (5)
  { id: "femoral-fracture", title: "Gãy cổ xương đùi ở người già loãng xương", code: "SURG-ORTHO-01", category: "Chronic", specialtyId: "surg-ortho", symptoms: ["Không nhấc chân nổi khỏi giường", "Bàn chân xoay ngoài sát giường", "Ngắn chi bên đau", "Đau chói háng"], keywords: ["gãy cổ xương đùi", "xoay ngoài sát giường", "ngắn chi", "người cao tuổi", "thay khớp háng"], defaultAge: 78, defaultGender: "Nữ" },
  { id: "forearm-fracture", title: "Gãy kín hai xương cẳng tay trái", code: "SURG-ORTHO-02", category: "Acute", specialtyId: "surg-ortho", symptoms: ["Đau chói vùng cẳng tay trái", "Biến dạng gập góc nhẹ", "Sưng nề to", "Hạn chế vận động tay"], keywords: ["gãy xương cẳng tay", "biến dạng gập góc", "bột cánh bàn tay", "kết hợp xương đinh dốc"], defaultAge: 29, defaultGender: "Nam" },
  { id: "tibia-fracture", title: "Gãy kín thân xương chày phải do tai nạn", code: "SURG-ORTHO-03", category: "Acute", specialtyId: "surg-ortho", symptoms: ["Đau chói cẳng chân phải", "Không đứng tì chân được", "Sưng nề bầm tím", "Biến dạng lệch trục"], keywords: ["gãy xương chày", "gãy xương cẳng chân", "nẹp bột", "kết hợp đinh nội tủy"], defaultAge: 33, defaultGender: "Nam" },
  { id: "shoulder-dislocation", title: "Trật khớp vai ra trước cấp tính", code: "SURG-ORTHO-04", category: "Acute", specialtyId: "surg-ortho", symptoms: ["Đau dữ dội khớp vai", "Dấu hiệu gù vai (vai vuông)", "Dấu hiệu nhát rìu", "Cánh tay dạng xoay ngoài"], keywords: ["trật khớp vai", "dấu hiệu gù vai", "vai vuông", "nắn trật phương pháp hippocrates"], defaultAge: 25, defaultGender: "Nam" },
  { id: "spinal-injury", title: "Chấn thương cột sống cổ liệt tứ chi", code: "SURG-ORTHO-05", category: "Acute", specialtyId: "surg-ortho", symptoms: ["Đau chói vùng cổ sau tai nạn", "Tê bì và yếu liệt hoàn toàn tứ chi", "Bí tiểu", "Mất phản xạ xương"], keywords: ["chấn thương cột sống cổ", "tủy cổ", "liệt tứ chi", "bất động nẹp cổ cứng", "mổ giải ép"], defaultAge: 38, defaultGender: "Nam" },

  // Nhi khoa (6)
  { id: "pediatric-pneumonia", title: "Viêm phổi thùy ở trẻ em 4 tuổi", code: "PED-01", category: "Acute", specialtyId: "pediatrics", symptoms: ["Ho khạc đờm vàng", "Sốt cao liên tục", "Thở nhanh co kéo lồng ngực", "Phổi nghe ran ẩm"], keywords: ["viêm phổi trẻ em", "thở nhanh so tuổi", "ran ẩm ran nổ", "co kéo", "amoxicillin"], defaultAge: 4, defaultGender: "Nam" },
  { id: "acute-diarrhea", title: "Tiêu chảy cấp mất nước mức độ trung bình", code: "PED-02", category: "Acute", specialtyId: "pediatrics", symptoms: ["Tiêu phân lỏng tóe nước > 10 lần/ngày", "Mắt trũng sâu nhẹ", "Nếp véo da mất chậm", "Khát nước thèm uống"], keywords: ["tiêu chảy cấp", "mất nước trung bình", "oresol bù dịch", "kẽm sulfat", "mắt trũng"], defaultAge: 1, defaultGender: "Nữ" },
  { id: "febrile-seizure", title: "Co giật do sốt cao đơn thuần ở trẻ 18 tháng", code: "PED-03", category: "Acute", specialtyId: "pediatrics", symptoms: ["Sốt cao đột ngột > 39 độ C", "Cơn giật toàn thân kiểu gồng trợn mắt", "Cơn giật < 10 phút", "Tỉnh táo ngay"], keywords: ["co giật do sốt", "sốt cao", "paracetamol hạ sốt", "diazepam", "đơn thuần"], defaultAge: 2, defaultGender: "Nam" },
  { id: "hfmd", title: "Bệnh Tay chân miệng độ 2a ở trẻ 2 tuổi", code: "PED-04", category: "Acute", specialtyId: "pediatrics", symptoms: ["Loét vết đau ở miệng không bú được", "Nổi phỏng nước lòng bàn tay bàn chân", "Sốt nhẹ", "Giật mình nhẹ"], keywords: ["tay chân miệng", "độ 2a", "phỏng nước", "loét miệng", "phenobarbital", "giật mình"], defaultAge: 2, defaultGender: "Nam" },
  { id: "measles", title: "Bệnh Sởi giai đoạn toàn phát ở trẻ 3 tuổi", code: "PED-05", category: "Acute", specialtyId: "pediatrics", symptoms: ["Sốt cao ho khan liên tục", "Phát ban đỏ rải rác từ sau tai lan xuống", "Mắt đỏ chảy nước", "Nốt Koplik"], keywords: ["bệnh sởi", "phát ban tuần tự", "nốt koplik", "vitamin a liều cao", "ho chảy mũi"], defaultAge: 3, defaultGender: "Nữ" },
  { id: "malnutrition", title: "Suy dinh dưỡng thể teo đét (Marasmus) ở trẻ 10 tháng", code: "PED-06", category: "Chronic", specialtyId: "pediatrics", symptoms: ["Mất toàn bộ lớp mỡ dưới da, da bọc xương", "Vẻ mặt cụ già", "Quấy khóc lờ đờ", "Cân nặng cực thấp"], keywords: ["suy dinh dưỡng thể teo đét", "marasmus", "thiếu hụt năng lượng", "bột dinh dưỡng cao"], defaultAge: 1, defaultGender: "Nam" },

  // Sản phụ khoa (5)
  { id: "preeclampsia", title: "Tiền sản giật nặng thai phụ 34 tuần", code: "OBGYN-01", category: "Acute", specialtyId: "obgyn", symptoms: ["Huyết áp tăng vọt 170/110 mmHg", "Nhức đầu hoa mắt", "Đau tức hạ sườn phải", "Phù to chân tay", "Tiểu ít"], keywords: ["tiền sản giật nặng", "protein niệu 3+", "magnesium sulfate", "nifedipine hạ áp", "chấm dứt thai kỳ"], defaultAge: 28, defaultGender: "Nữ" },
  { id: "eclampsia", title: "Sản giật toàn phát thai phụ 36 tuần", code: "OBGYN-02", category: "Acute", specialtyId: "obgyn", symptoms: ["Cơn co giật toàn thân kiểu gồng cứng uốn cong", "Huyết áp rất cao", "Hôn mê sau giật", "Mất ý thức"], keywords: ["sản giật", "co giật sản khoa", "magnesium sulfate cắt cơn", "mổ lấy thai khẩn"], defaultAge: 29, defaultGender: "Nữ" },
  { id: "ectopic-pregnancy", title: "Thai ngoài tử cung vỡ gây shock mất máu", code: "OBGYN-03", category: "Acute", specialtyId: "obgyn", symptoms: ["Đau bụng hạ vị đột ngột dữ dội", "Trễ kinh ra huyết âm đạo rỉ rả", "Da xanh tái vã mồ hôi", "Huyết áp kẹp"], keywords: ["thai ngoài tử cung vỡ", "shock mất máu", "chọc túi cùng douglas chói", "mổ nội soi khẩn cấp"], defaultAge: 27, defaultGender: "Nữ" },
  { id: "postpartum-hemorrhage", title: "Băng huyết sau sinh do đờ tử cung giờ thứ 1", code: "OBGYN-04", category: "Acute", specialtyId: "obgyn", symptoms: ["Máu đỏ tươi chảy ồ ạt từ âm đạo sau sinh", "Tử cung nhão loãng không co", "Mạch nhanh nhỏ, huyết áp tụt"], keywords: ["băng huyết sau sinh", "đờ tử cung", "oxytocin truyền", "xoa đáy tử cung", "misoprostol"], defaultAge: 30, defaultGender: "Nữ" },
  { id: "gestational-diabetes", title: "Đái tháo đường thai kỳ kiểm soát kém tuần 28", code: "OBGYN-05", category: "Chronic", specialtyId: "obgyn", symptoms: ["Khát nước tiểu nhiều", "Tăng cân quá nhanh", "Nước ối nhiều (đa ối)", "Thai to so tuổi"], keywords: ["đái tháo đường thai kỳ", "dung nạp glucose", "insulin thai kỳ", "đa ối", "thai to"], defaultAge: 32, defaultGender: "Nữ" },

  // Nội tổng quát bổ sung (5)
  { id: "osteoporosis", title: "Loãng xương nặng có xẹp lún đốt sống ngực", code: "IM-GEN-01", category: "Chronic", specialtyId: "im-gen", symptoms: ["Đau hông lưng ê ẩm tăng khi đi lại", "Gù lưng", "Sụt chiều cao", "Đau buốt cột sống"], keywords: ["loãng xương", "xẹp đốt sống", "t-score < -2.5", "alendronate", "canxi vitamin d3"], defaultAge: 68, defaultGender: "Nữ" },
  { id: "acute-gout", title: "Cơn gút cấp tính khớp bàn ngón chân cái", code: "IM-GEN-02", category: "Acute", specialtyId: "im-gen", symptoms: ["Khớp bàn ngón chân sưng nóng đỏ đau dữ dội", "Khởi phát đột ngột sau bữa tiệc", "Sốt nhẹ"], keywords: ["gút cấp", "acid uric tăng", "khớp bàn ngón cái", "colchicine", "nsaid"], defaultAge: 45, defaultGender: "Nam" },
  { id: "rheumatoid-arthritis", title: "Viêm khớp dạng thấp tiến triển khớp bàn ngón tay", code: "IM-GEN-03", category: "Chronic", specialtyId: "im-gen", symptoms: ["Đau sưng đối xứng các khớp nhỏ bàn tay", "Cứng khớp buổi sáng > 1 giờ", "Biến dạng khớp dạng gió thổi"], keywords: ["viêm khớp dạng thấp", "cứng khớp buổi sáng", "yếu tố dạng thấp rf", "anti-ccp", "methotrexate"], defaultAge: 48, defaultGender: "Nữ" },
  { id: "sle", title: "Lupus ban đỏ hệ thống biến chứng viêm thận Lupus", code: "IM-GEN-04", category: "Chronic", specialtyId: "im-gen", symptoms: ["Hồng ban cánh bướm ở mặt", "Đau khớp rải rác", "Phù chân nhẹ", "Rụng tóc", "Tiểu nhiều bọt"], keywords: ["lupus ban đỏ hệ thống", "sle", "kháng thể ana ds-dna", "viêm thận lupus", "methylprednisolone"], defaultAge: 26, defaultGender: "Nữ" },
  { id: "cfs", title: "Hội chứng suy nhược mạn tính thể suy kiệt", code: "IM-GEN-05", category: "Chronic", specialtyId: "im-gen", symptoms: ["Mệt mỏi kiệt sức kéo dài > 6 tháng", "Rối loạn giấc ngủ", "Đau mỏi cơ lan tỏa", "Khó tập trung"], keywords: ["suy nhược mạn tính", "kiệt sức mạn", "loại trừ bệnh thực thể", "liệu pháp nhận thức"], defaultAge: 39, defaultGender: "Nam" },

  // Da liễu (5)
  { id: "zona", title: "Zona thần kinh liên sườn vùng ngực trái ngày 3", code: "DERM-01", category: "Acute", specialtyId: "dermatology", symptoms: ["Mụn nước mọc thành chùm trên nền hồng ban", "Đau rát bỏng buốt dọc liên sườn", "Sốt nhẹ"], keywords: ["zona", "herpes zoster", "mun nuoc doc day than kinh", "acyclovir", "gabapentin đau sau zona"], defaultAge: 52, defaultGender: "Nam" },
  { id: "psoriasis", title: "Vảy nến thể mảng tiến triển vùng khuỷu và gối", code: "DERM-02", category: "Chronic", specialtyId: "dermatology", symptoms: ["Mảng hồng ban giới hạn rõ phủ vảy trắng xám dạng xà cừ", "Ngứa nhẹ", "Cạo vảy thấy dấu nến đổ"], keywords: ["vảy nến thể mảng", "vảy xà cừ", "dấu koebner", "corticoid thoa tại chỗ", "daliv"], defaultAge: 44, defaultGender: "Nam" },
  { id: "atopic-dermatitis", title: "Viêm da cơ địa đợt cấp tính ở người trẻ", code: "DERM-03", category: "Chronic", specialtyId: "dermatology", symptoms: ["Mảng da đỏ rỉ dịch, dày sừng, tróc vảy", "Ngứa dữ dội tăng về đêm", "Khô da toàn thân"], keywords: ["viêm da cơ địa", "ngứa", "cơ địa dị ứng", "mỡ thoa tacrolimus", "kem dưỡng ẩm"], defaultAge: 21, defaultGender: "Nữ" },
  { id: "urticaria", title: "Mày đay cấp tính nghi do dị ứng thức ăn", code: "DERM-04", category: "Acute", specialtyId: "dermatology", symptoms: ["Sẩn phù đỏ nổi gồ mặt da dạng bản đồ", "Ngứa ngáy châm chích dữ dội", "Mất nhanh không để lại sẹo"], keywords: ["mày đay cấp", "dị ứng thức ăn", "sẩn phù", "kháng histamin h1", "loratadine"], defaultAge: 26, defaultGender: "Nữ" },
  { id: "scabies", title: "Bệnh Ghẻ lở bội nhiễm vùng kẽ ngón tay", code: "DERM-05", category: "Acute", specialtyId: "dermatology", symptoms: ["Sẩn ngứa, mụn nước vùng kẽ ngón tay và bộ phận sinh dục", "Ngứa kinh khủng về đêm", "Dấu vết luống ghẻ"], keywords: ["ghẻ", "cái ghẻ sarcoptes", "luống ghẻ", "permethrin thoa", "ngứa đêm"], defaultAge: 19, defaultGender: "Nam" },

  // Tai Mũi Họng (5)
  { id: "otitis-media", title: "Viêm tai giữa cấp mủ giai đoạn hóa mủ", code: "ENT-01", category: "Acute", specialtyId: "ent", symptoms: ["Đau nhức tai sâu giật giật", "Sốt cao", "Nghe kém nhẹ bên đau", "Chảy mủ tai vàng đục"], keywords: ["viêm tai giữa cấp", "hóa mủ", "màng nhĩ phồng đỏ", "trích rạch màng nhĩ", "amoxicillin-clavulanate"], defaultAge: 8, defaultGender: "Nam" },
  { id: "sinusitis", title: "Viêm xoang hàm cấp mủ do răng", code: "ENT-02", category: "Acute", specialtyId: "ent", symptoms: ["Đau nhức vùng má mặt một bên", "Chảy mũi đục đặc vàng hôi", "Nghẹt mũi nặng", "Sốt hâm hấp"], keywords: ["viêm xoang cấp", "xoang hàm do răng", "chọc rửa xoang", "kháng sinh cephalosporin"], defaultAge: 35, defaultGender: "Nam" },
  { id: "tonsillitis", title: "Viêm amidan cấp mủ (Cấp mủ)", code: "ENT-03", category: "Acute", specialtyId: "ent", symptoms: ["Đau rát họng khi nuốt nhiều", "Sốt cao liên tục", "Amidan sưng to có giả mạc trắng mủ", "Hơi thở hôi"], keywords: ["viêm amidan mủ", "sốt cao", "giả mạc mủ", "kháng sinh beta-lactam"], defaultAge: 14, defaultGender: "Nữ" },
  { id: "pharyngitis", title: "Viêm họng hạt mạn tính tiến triển", code: "ENT-04", category: "Chronic", specialtyId: "ent", symptoms: ["Vướng họng, ngứa rát họng liên tục", "Ho khan kích ứng", "Phải khạc nhổ thường xuyên", "Khô cổ họng"], keywords: ["viêm họng mạn", "viêm họng hạt", "đốt hạt họng", "vệ sinh họng muối ấm"], defaultAge: 42, defaultGender: "Nữ" },
  { id: "peritonsillar-abscess", title: "Áp xe quanh amidan trái biến chứng cứng hàm", code: "ENT-05", category: "Acute", specialtyId: "ent", symptoms: ["Đau họng dữ dội lan tai trái", "Cứng hàm không há được miệng", "Nuốt sặc dãi chảy ra", "Giọng ngậm hạt thị"], keywords: ["áp xe quanh amidan", "cứng hàm", "áp xe vòm họng", "chọc hút mủ khẩn", "kháng sinh iv"], defaultAge: 28, defaultGender: "Nam" },

  // Mắt (5)
  { id: "conjunctivitis", title: "Viêm kết mạc cấp tính dịch tễ (Đau mắt đỏ)", code: "OPH-01", category: "Acute", specialtyId: "ophthalmology", symptoms: ["Mắt đỏ ngầu rầm rập", "Cộm rát xốn xang như có cát", "Chảy nước mắt nhiều kèm ghèn dịch dính"], keywords: ["viêm kết mạc cấp", "đau mắt đỏ", "ghèn rỉ mắt", "nhỏ nước muối sinh lý", "ganciclovir thoa"], defaultAge: 24, defaultGender: "Nữ" },
  { id: "glaucoma", title: "Glocom góc đóng cơn cấp tính (Thiên đầu thống)", code: "OPH-02", category: "Acute", specialtyId: "ophthalmology", symptoms: ["Đau nhức hốc mắt và đầu cùng bên dữ dội", "Nhìn mờ thấy quầng tán sắc cầu vồng", "Mắt đỏ cương tụ rìa", "Đồng tử giãn méo"], keywords: ["glaucoma góc đóng cấp", "nhãn áp tăng vọt", "mắt đỏ cương tụ rìa", "acetazolamide hạ nhãn áp", "mổ chu biên"], defaultAge: 58, defaultGender: "Nữ" },
  { id: "cataract", title: "Đục thủy tinh thể già (Cataract) hai mắt", code: "OPH-03", category: "Chronic", specialtyId: "ophthalmology", symptoms: ["Nhìn mờ từ từ không đau nhức", "Nhìn mờ tăng khi ra nắng sáng", "Nhìn thấy bóng mờ nhân đôi"], keywords: ["đục thủy tinh thể", "phaco mổ", "thay thủy tinh thể nhân tạo", "nhìn mờ từ từ"], defaultAge: 72, defaultGender: "Nam" },
  { id: "corneal-ulcer", title: "Viêm loét giác mạc do nấm sau chấn thương nông nghiệp", code: "OPH-04", category: "Acute", specialtyId: "ophthalmology", symptoms: ["Đau mắt nhức nhối sợ ánh sáng dữ dội", "Chảy nước mắt ròng ròng", "Ổ loét giác mạc màu trắng đục"], keywords: ["loét giác mạc", "chấn thương nông nghiệp bụi lúa", "nấm giác mạc", "natamycin nhỏ"], defaultAge: 46, defaultGender: "Nam" },
  { id: "uveitis", title: "Viêm màng bồ đào trước cấp tính một mắt", code: "OPH-05", category: "Acute", specialtyId: "ophthalmology", symptoms: ["Đau nhức nhãn cầu âm ỉ", "Nhìn mờ như sương khói", "Mắt đỏ cương tụ rìa sâu", "Tủa sau giác mạc dạng bụi"], keywords: ["viêm màng bồ đào trước", "tủa sau giác mạc kp", "đồng tử co nhỏ", "nhỏ atropine giãn đồng tử", "corticoid nhỏ"], defaultAge: 33, defaultGender: "Nam" },

  // Huyết học (4)
  { id: "anemia-iron", title: "Thiếu máu thiếu sắt mức độ trung bình", code: "IM-HEM-01", category: "Chronic", specialtyId: "im-hem", symptoms: ["Mệt mỏi kéo dài", "Da xanh xao", "Móng tay bẹt dễ gãy", "Hoa mắt khi đứng dậy"], keywords: ["thiếu máu thiếu sắt", "ferritin giảm", "sắt huyết thanh", "bổ sung sắt uống"], defaultAge: 34, defaultGender: "Nữ" },
  { id: "itp", title: "Xuất huyết giảm tiểu cầu miễn dịch (ITP)", code: "IM-HEM-02", category: "Acute", specialtyId: "im-hem", symptoms: ["Chấm xuất huyết da dưới da", "Chảy máu cam", "Rong kinh kéo dài", "Mệt mỏi nhẹ"], keywords: ["itp", "tiểu cầu giảm", "kháng thể kháng tiểu cầu", "corticoid", "methylprednisolone"], defaultAge: 28, defaultGender: "Nữ" },
  { id: "thalassemia", title: "Thalassemia thể dị hợp phối hợp thiếu máu", code: "IM-HEM-03", category: "Chronic", specialtyId: "im-hem", symptoms: ["Da vàng nhẹ", "Lách to độ I", "Mệt mỏi khi gắng sức", "Vẻ mặt thalassemia nhẹ"], keywords: ["thalassemia", "điện di hemoglobin", "hồng cầu nhỏ nhược sắc", "truyền máu"], defaultAge: 22, defaultGender: "Nam" },
  { id: "leukemia-acute", title: "Bạch cầu cấp dòng tủy (AML)", code: "IM-HEM-04", category: "Acute", specialtyId: "im-hem", symptoms: ["Sốt cao dai dẳng", "Xuất huyết niêm mạc", "Mệt mỏi kiệt sức", "Phì đại lợi răng"], keywords: ["bạch cầu cấp", "aml", "huyết tủy đồ", "blast > 20%", "hóa trị"], defaultAge: 45, defaultGender: "Nam" },

  // Dị ứng miễn dịch (2)
  { id: "drug-allergy", title: "Dị ứng thuốc kháng sinh nhóm Beta-lactam", code: "IM-ALLERGY-01", category: "Acute", specialtyId: "im-allergy", symptoms: ["Ngứa toàn thân", "Hồng ban sẩn đỏ dạng sởi", "Sốt nhẹ", "Sưng phù nhẹ mi mắt"], keywords: ["dị ứng thuốc", "beta-lactam", "mày đay", "methylprednisolone", "kháng histamin"], defaultAge: 30, defaultGender: "Nữ" },

  // Ngoại lồng ngực (2)
  { id: "surg-empyema", title: "Tràn mủ màng phổi sau viêm phổi", code: "SURG-THORACIC-01", category: "Acute", specialtyId: "surg-thoracic", symptoms: ["Đau ngực dữ dội một bên", "Sốt cao dao động", "Khó thở khi nằm", "Ho khạc đờm đặc"], keywords: ["tràn mủ màng phổi", "dẫn lưu màng phổi", "vỏ hóa màng phổi", "nội soi lồng ngực"], defaultAge: 52, defaultGender: "Nam" },
  { id: "surg-chest-trauma", title: "Chấn thương ngực kín dập phổi do tai nạn", code: "SURG-THORACIC-02", category: "Acute", specialtyId: "surg-thoracic", symptoms: ["Đau ngực chói khi thở", "Khó thở nhanh nông", "Bầm tím thành ngực", "Ho ra máu tươi"], keywords: ["chấn thương ngực kín", "dập phổi", "gãy xương sườn", "giảm đau liên sườn", "oxy hỗ trợ"], defaultAge: 38, defaultGender: "Nam" },

  // Ngoại thần kinh (2)
  { id: "surg-epidural-hematoma", title: "Máu tụ ngoài màng cứng cấp tính bán cầu phải", code: "SURG-NEURO-01", category: "Acute", specialtyId: "surg-neuro", symptoms: ["Đau đầu dữ dội sau chấn thương", "Có khoảng tỉnh rõ rệt", "Nôn ói nhiều", "Đồng tử bên phải giãn nhẹ"], keywords: ["máu tụ ngoài màng cứng", "khoảng tỉnh", "ct sọ hình thấu kính hai mặt lồi", "mổ mở nắp sọ giải áp"], defaultAge: 27, defaultGender: "Nam" },
  { id: "surg-tbi", title: "Chấn thương sọ não dập não vùng trán hai bên", code: "SURG-NEURO-02", category: "Acute", specialtyId: "surg-neuro", symptoms: ["Mất ý thức tạm thời", "Đau đầu dữ dội", "Kích thích vật vã", "Nôn vọt"], keywords: ["chấn thương sọ não", "dập não trán", "phù não", "mannitol", "ct sọ não"], defaultAge: 33, defaultGender: "Nam" },

  // Ngoại niệu (2)
  { id: "surg-ureteral-stone", title: "Cơn đau quặn thận do sỏi kẹt niệu quản 1/3 dưới", code: "SURG-UROLOGY-01", category: "Acute", specialtyId: "surg-urology", symptoms: ["Đau quặn hông lưng dữ dội lan xuống bẹn", "Tiểu buốt rắt", "Đái máu đại thể", "Buồn nôn"], keywords: ["sỏi niệu quản", "cơn đau quặn thận", "tán sỏi laze nội soi", "giảm đau nsaid"], defaultAge: 42, defaultGender: "Nam" },
  { id: "surg-bph", title: "Bí tiểu cấp do phì đại lành tính tuyến tiền liệt", code: "SURG-UROLOGY-02", category: "Acute", specialtyId: "surg-urology", symptoms: ["Bí tiểu hoàn toàn", "Cầu bàng quang căng tức vùng hạ vị", "Rặn tiểu đau chói", "Tiểu lắt nhắt trước đó"], keywords: ["bí tiểu cấp", "phì đại tuyến tiền liệt", "đặt thông tiểu", "tamsulosin", "siêu âm tuyến tiền liệt"], defaultAge: 68, defaultGender: "Nam" },

  // Nhi khoa bổ sung (4)
  { id: "ped-bronchiolitis", title: "Viêm tiểu phế quản cấp ở trẻ 8 tháng tuổi", code: "PED-07", category: "Acute", specialtyId: "pediatrics", symptoms: ["Khó thở khò khè dồn dập", "Ho chảy mũi nhiều", "Bú kém quấy khóc", "Thở co kéo lồng ngực"], keywords: ["viêm tiểu phế quản", "rút lõm lồng ngực", "rsv", "phun muối ưu trương 3%", "hút đờm"], defaultAge: 1, defaultGender: "Nam" },
  { id: "ped-intussusception", title: "Lồng ruột cấp tính ở trẻ 6 tháng tuổi", code: "PED-08", category: "Acute", specialtyId: "pediatrics", symptoms: ["Khóc thét từng cơn đột ngột", "Nôn ói ra sữa dịch vị", "Tiêu phân nhầy máu đỏ", "Khối lồng ở bụng"], keywords: ["lồng ruột", "khóc thét từng cơn", "bơm hơi tháo lồng", "siêu âm hình bia bắn"], defaultAge: 1, defaultGender: "Nam" },
  { id: "ped-vsd", title: "Thông liên thất lỗ lớn tăng áp phổi trẻ 12 tháng", code: "PED-09", category: "Chronic", specialtyId: "pediatrics", symptoms: ["Chậm tăng cân rõ rệt", "Khó thở khi bú mẹ", "Ho thỉnh thoảng kéo dài", "Âm thổi tâm thu 4/6 liên sườn 3-4"], keywords: ["thông liên thất", "vsd", "tăng áp phổi", "suy tim trẻ em", "phẫu thuật vá vách"], defaultAge: 1, defaultGender: "Nữ" },
  { id: "ped-jaundice", title: "Vàng da sơ sinh tăng bilirubin gián tiếp ngày thứ 4", code: "PED-10", category: "Acute", specialtyId: "pediatrics", symptoms: ["Vàng da đậm đến lòng bàn chân", "Bú tốt không sốt", "Tiêu phân vàng nước tiểu trong"], keywords: ["vàng da sơ sinh", "bilirubin gián tiếp", "chiếu đèn vàng da", "vàng da nhân não"], defaultAge: 0, defaultGender: "Nam" },

  // Tai Mũi Họng bổ sung (2)
  { id: "ent-laryngitis", title: "Viêm thanh quản cấp tính co thắt ở trẻ 3 tuổi", code: "ENT-06", category: "Acute", specialtyId: "ent", symptoms: ["Khàn tiếng mất giọng đột ngột", "Ho ông ổng như chó sủa", "Thở rít thì hít vào", "Sốt nhẹ"], keywords: ["viêm thanh quản cấp", "thở rít stridor", "ho ông ổng", "dexamethasone uống", "khí dung budesonide"], defaultAge: 3, defaultGender: "Nam" },
  { id: "ent-nasal-polyp", title: "Polyp mũi hai bên độ II biến chứng viêm xoang mạn", code: "ENT-07", category: "Chronic", specialtyId: "ent", symptoms: ["Nghẹt mũi liên tục hai bên", "Chảy nước mũi trong/đục", "Giảm khứu giác mất mùi", "Nói giọng mũi kín"], keywords: ["polyp mũi", "viêm xoang mạn", "nội soi mũi xoang", "corticoid xịt mũi", "mổ nội soi fess"], defaultAge: 45, defaultGender: "Nam" },

  // Ung bướu (4)
  { id: "onc-breast-cancer", title: "Ung thư biểu mô ống tuyến vú xâm lấn T2N1M0", code: "ONC-01", category: "Chronic", specialtyId: "oncology", symptoms: ["Khối u cứng không đau vú phải", "Co rút da vú nhẹ", "Hạch nách phải sờ chạm di động"], keywords: ["ung thư vú", "mammography", "fna sinh thiết", "mổ cắt tuyến vú", "hóa trị hỗ trợ"], defaultAge: 52, defaultGender: "Nữ" },
  { id: "onc-lung-cancer", title: "Ung thư biểu mô tuyến của phổi giai đoạn IV (Ung thư phổi)", code: "ONC-02", category: "Chronic", specialtyId: "oncology", symptoms: ["Ho khan kéo dài đau ngực", "Ho ra máu lẫn đờm", "Sụt cân nặng", "Khó thở âm ỉ"], keywords: ["ung thư phổi", "biểu mô tuyến", "hạch thượng đòn", "chụp ct ngực", "egfr"], defaultAge: 64, defaultGender: "Nam" },
  { id: "onc-liver-cancer", title: "Ung thư biểu mô tế bào gan (HCC) trên nền xơ gan HBV (Ung thư gan)", code: "ONC-03", category: "Chronic", specialtyId: "oncology", symptoms: ["Đau âm ỉ hạ sườn phải", "Sụt cân mệt mỏi", "Ăn uống kém", "Vàng da nhẹ"], keywords: ["hcc", "ung thư gan", "afp", "mri gan", "tace", "hbv"], defaultAge: 53, defaultGender: "Nam" },
  { id: "onc-colorectal-cancer", title: "Ung thư đại tràng phải thể sùi sụt cân (Ung thư đại trực tràng)", code: "ONC-04", category: "Chronic", specialtyId: "oncology", symptoms: ["Tiêu phân sệt lẫn máu đỏ sẫm", "Đau âm ỉ hố chậu phải", "Thiếu máu da xanh xao", "Sụt cân nhanh"], keywords: ["ung thư đại tràng phải", "u đại tràng sùi", "cea tăng", "mổ cắt bán đại tràng phải"], defaultAge: 64, defaultGender: "Nam" },

  // Hồi sức cấp cứu (4)
  { id: "ic-septic-shock", title: "Sốc nhiễm khuẩn từ đường vào đường niệu", code: "IC-01", category: "Acute", specialtyId: "emergency", symptoms: ["Huyết áp tụt nặng 80/40 mmHg", "Sốt cao rét run lập cập", "Lơ mơ kích thích", "Tiểu cực ít"], keywords: ["sốc nhiễm khuẩn", "septic shock", "bù dịch khẩn", "noradrenaline", "kháng sinh iv phối hợp"], defaultAge: 65, defaultGender: "Nam" },
  { id: "ic-anaphylaxis", title: "Sốc phản vệ độ III do thuốc kháng sinh Ceftriaxone", code: "IC-02", category: "Acute", specialtyId: "emergency", symptoms: ["Khó thở rít thanh quản thanh môn", "Huyết áp tụt tụt nhanh", "Hồng ban ngứa đỏ toàn thân", "Mạch nhanh nhỏ khó bắt"], keywords: ["sốc phản vệ", "adrenaline tiêm đùi", "co thắt thanh quản", "methylprednisolone", "bù dịch"], defaultAge: 28, defaultGender: "Nữ" },
  { id: "ic-cardiac-arrest", title: "Ngừng tuần hoàn hô hấp ngoài bệnh viện đã cấp cứu thành công", code: "IC-03", category: "Acute", specialtyId: "emergency", symptoms: ["Mất ý thức đột ngột không thở", "Mạch cảnh mạch bẹn không bắt được", "Đồng tử giãn đối xứng"], keywords: ["ngừng tuần hoàn", "cpr", "sốc điện", "adrenaline truyền", "rosc"], defaultAge: 62, defaultGender: "Nam" },
  { id: "ic-ards", title: "Hội chứng suy hô hấp cấp tiến triển (ARDS) do viêm phổi nặng", code: "IC-04", category: "Acute", specialtyId: "emergency", symptoms: ["Khó thở thở dốc dữ dội", "Tím môi đầu chi", "SpO2 tụt sâu 80%", "Phổi đầy rale ẩm xơ hóa"], keywords: ["ards", "suy hô hấp cấp", "thở máy bảo vệ phổi", "peep cao", "pronig nằm sấp"], defaultAge: 59, defaultGender: "Nam" },

  // Y học gia đình (4)
  { id: "fm-hypertension", title: "Quản lý và điều trị Tăng huyết áp mạn tính tại gia đình", code: "FM-01", category: "Chronic", specialtyId: "family-medicine", symptoms: ["Đau đầu nhẹ vùng chẩm buổi sáng", "Thỉnh thoảng chóng mặt", "Hồi hộp đánh trống ngực nhẹ"], keywords: ["tăng huyết áp", "bác sĩ gia đình", "tuân thủ điều trị", "amlodipine", "lối sống lành mạnh"], defaultAge: 58, defaultGender: "Nam" },
  { id: "fm-diabetes", title: "Chăm sóc và theo dõi Đái tháo đường type 2 tại cộng đồng", code: "FM-02", category: "Chronic", specialtyId: "family-medicine", symptoms: ["Tê nhẹ hai bàn chân", "Uống nhiều tiểu nhiều nhẹ", "Mệt mỏi thỉnh thoảng"], keywords: ["đái tháo đường type 2", "bác sĩ gia đình", "hba1c mục tiêu", "metformin", "chăm sóc bàn chân"], defaultAge: 55, defaultGender: "Nam" },
  { id: "fm-copd", title: "Quản lý Bệnh phổi tắc nghẽn mạn tính (COPD) giai đoạn ổn định", code: "FM-03", category: "Chronic", specialtyId: "family-medicine", symptoms: ["Ho khạc đờm trắng buổi sáng", "Khó thở nhẹ khi gắng sức trung bình", "Mệt mỏi mạn tính"], keywords: ["copd ổn định", "bác sĩ gia đình", "thuốc hít tiotropium", "cai thuốc lá", "phục hồi chức năng hô hấp"], defaultAge: 73, defaultGender: "Nam" },
  { id: "fm-chronic-care", title: "Chương trình phục hồi chức năng và theo dõi bệnh mạn tính phối hợp", code: "FM-04", category: "Chronic", specialtyId: "family-medicine", symptoms: ["Mệt mỏi uể oải nhẹ", "Hạn chế vận động nhẹ", "Rối loạn giấc ngủ nhẹ"], keywords: ["bệnh mạn tính", "chăm sóc toàn diện", "bác sĩ gia đình", "phối hợp liên chuyên khoa", "tư vấn tâm lý"], defaultAge: 68, defaultGender: "Nữ" }
];

// Highly detailed case generator engine producing premium medical content
export const generateDetailedCase = (
  topicId: string,
  age: number,
  gender: "Nam" | "Nữ",
  severity: "Điển hình" | "Nặng" | "Biến chứng"
): LibraryCase => {
  const topic = DISEASE_TOPICS.find(t => t.id === topicId) || DISEASE_TOPICS[0];
  const specialty = SPECIALTIES.find(s => s.id === topic.specialtyId)?.name || "Nội khoa";
  
  // Custom disease variables to make the clinical scenario dynamic and medically rigorous
  let sevLabel = severity === "Điển hình" ? "thể điển hình" : severity === "Nặng" ? "diễn tiến nặng" : "biến chứng nguy kịch";
  let title = `${topic.title} (${gender} ${age} tuổi, ${sevLabel})`;
  
  let vitals = { bp: "120/80 mmHg", hr: "80 bpm", rr: "18 /phút", temp: "37.0 °C", spo2: "98% (Khí trời)" };
  let labs: LibraryCase["labsAndDiagnostics"] = [];
  let hpi = "";
  let pmh = "";
  let physicalExam = "";
  let cc = topic.symptoms[0] || "Khó chịu trong người."; // chief complaint
  let caseSummaryText = "";
  let clinicalDiscussionText = "";
  let treatmentText = "";
  let prognosisText = "";
  let followUpText = "";
  let clinicalLessonsText = "";
  let commonStudentErrorsText = "";
  let presentationTipsText = "";
  let aiPathophysiology = "";
  let aiDiagnosticsExplanation = "";
  let aiDiagnosisExplanation = "";
  let aiTreatmentExplanation = "";
  let wardRoundsChecklist: string[] = [];
  let commonTeacherQuestions: { question: string; answer: string }[] = [];
  let difficultQuestionTips = "";

  // 1. Vitals generation based on severity & category
  const isAcute = topic.category === "Acute";
  if (isAcute) {
    if (severity === "Điển hình") {
      vitals = { bp: "130/85 mmHg", hr: "92 bpm", rr: "20 /phút", temp: "37.8 °C", spo2: "96% (Khí trời)" };
    } else if (severity === "Nặng") {
      vitals = { bp: "150/95 mmHg", hr: "108 bpm", rr: "24 /phút", temp: "38.5 °C", spo2: "92% (Oxy hỗ trợ)" };
    } else {
      vitals = { bp: "90/55 mmHg (Sốc/Tụt HA)", hr: "124 bpm (Kích ứng)", rr: "28 /phút", temp: "39.2 °C (Sốt cao)", spo2: "88% (Suy hô hấp)" };
    }
  } else {
    if (severity === "Điển hình") {
      vitals = { bp: "125/80 mmHg", hr: "78 bpm", rr: "18 /phút", temp: "36.8 °C", spo2: "98% (Khí trời)" };
    } else if (severity === "Nặng") {
      vitals = { bp: "145/90 mmHg", hr: "90 bpm", rr: "20 /phút", temp: "37.2 °C", spo2: "95% (Khí trời)" };
    } else {
      vitals = { bp: "160/100 mmHg", hr: "102 bpm", rr: "22 /phút", temp: "37.5 °C", spo2: "92% (Khí trời)" };
    }
  }

  // 2. Specific specialty clinical generation templates
  const sympsStr = topic.symptoms.join(", ");
  const keywordsStr = topic.keywords.join(", ");

  cc = `${topic.symptoms[0]} ${isAcute ? "giờ thứ" : "ngày thứ"} ${severity === "Điển hình" ? "2" : severity === "Nặng" ? "4" : "7"}.`;

  hpi = `Cách nhập viện ${severity === "Điển hình" ? "24 giờ" : severity === "Nặng" ? "3 ngày" : "5 ngày"}, bệnh nhân bắt đầu có cảm giác ${topic.symptoms[0]} âm ỉ liên tục. Sau đó triệu chứng tiến triển nhanh thành cảm giác ${topic.symptoms.join(" và ")}. Cảm giác khó chịu tăng lên khi hoạt động mạnh, kèm theo mệt mỏi, vã mồ hôi lạnh và lo âu nhiều. ${severity !== "Điển hình" ? `Đến ngày thứ 2, tình trạng trầm trọng hơn khi có biểu hiện kích thích cơ quan đích rõ rệt, bệnh nhân xuất hiện thêm thở dốc dồn dập, hoa mắt chóng mặt, nôn khan 2 lần và người mệt lả sút lực hẳn.` : "Bệnh nhân tự nghỉ ngơi ở nhà nhưng triệu chứng không thuyên giảm nên người nhà đưa vào bệnh viện cấp cứu."}`;

  pmh = `- Bản thân: Ghi nhận tiền sử ${topic.category === "Chronic" ? `bệnh lý nền tương đồng mạn tính đã 5 năm nay đang điều trị thuốc chuyên khoa nhưng đợt này tự ý giảm liều hoặc uống không đều.` : "khỏe mạnh, chưa ghi nhận dị ứng thuốc hay các bệnh mạn tính nguy cơ trước đây."}\n- Yếu tố nguy cơ: Có các yếu tố liên quan đến nhóm từ khóa (${keywordsStr}).\n- Gia đình: Chưa ghi nhận di truyền hay tim mạch sớm liên quan.`;

  physicalExam = `1. Toàn trạng:\n- Bệnh nhân tỉnh táo, tiếp xúc được, gương mặt mệt mỏi, lo sợ. Thể trạng trung bình BMI = 23.2 kg/m2.\n- Dấu hiệu sinh tồn ghi nhận: Mạch ${vitals.hr}, Huyết áp ${vitals.bp}, Thở ${vitals.rr}, Thân nhiệt ${vitals.temp}, SpO2 ${vitals.spo2}.\n- Da niêm hồng nhạt, không có dấu xuất huyết dưới da tự phát (loại trừ các rối loạn đông máu nặng ở thể điển hình). Không phù chi dưới.\n2. Cơ quan tiêu điểm (Chuyên khoa ${specialty}):\n- Thăm khám lâm sàng ghi nhận các triệu chứng cơ năng điển hình của bệnh như: ${sympsStr}.\n- Nghiệm pháp chuyên khoa tương ứng cho thấy dấu hiệu dương tính rõ rệt, chứng minh tình trạng tổn thương khu trú thực thể.\n- Khám các cơ quan khác (Tim mạch, Hô hấp, Tiêu hóa, Thần kinh): Chưa ghi nhận bất thường bệnh lý đồng mắc đáng kể khác ở thể lâm sàng hiện tại.`;

  labs = [
    { testName: "Công thức máu toàn bộ (CBC)", result: isAcute ? "WBC: 13.8 G/L (Bạch cầu tăng)" : "WBC: 8.2 G/L (Bình thường)", normalRange: "WBC: 4.0 - 10.0 G/L", interpretation: isAcute ? "Nhiễm trùng/Viêm cấp chuyển trái" : "Trong giới hạn bình thường" },
    { testName: "Xét nghiệm sinh hóa máu chuyên sâu", result: severity === "Biến chứng" ? "Creatinine: 145 umol/L (Tăng cao)" : "Creatinine: 88 umol/L (Bình thường)", normalRange: "53 - 100 umol/L", interpretation: severity === "Biến chứng" ? "Có dấu hiệu suy thận cấp đi kèm" : "Chức năng thận bảo tồn tốt" },
    { testName: "Xét nghiệm cận lâm sàng chẩn đoán xác định", result: "Dương tính mạnh mẽ / Thấy hình ảnh điển hình", interpretation: `Khẳng định chẩn đoán dựa trên từ khóa (${topic.keywords[0]})` }
  ];

  caseSummaryText = `Bệnh nhân ${gender} ${age} tuổi, vào viện vì lý do ${cc}. Qua quá trình hỏi bệnh sử, tiền sử nguy cơ và thăm khám lâm sàng, ghi nhận các triệu chứng và hội chứng thực thể dương tính nổi bật của chuyên khoa ${specialty}: Triệu chứng chủ đạo (${sympsStr}), kết hợp xét nghiệm hỗ trợ thấy dấu hiệu viêm/phản ứng cơ quan đặc thù. Chẩn đoán sơ bộ định hướng rõ ràng: ${topic.title} ${sevLabel}.`;

  clinicalDiscussionText = `Về mặt lâm sàng, bệnh cảnh của bệnh nhân phản ánh sinh động cơ chế của ${topic.title}. Triệu chứng xuất hiện và tăng dần mức độ hoàn toàn thống nhất với sinh lý bệnh chuyên khoa. Việc kết hợp chặt chẽ giữa các nghiệm pháp thực thể phát hiện tại giường cùng với kết quả cận lâm sàng đặc hiệu (như ${topic.keywords[2] || "hình ảnh học"}) cho phép loại trừ nhanh chóng các chẩn đoán phân biệt đe dọa tính mạng. Ở mức độ ${severity}, việc phân tầng nguy cơ nhanh để đưa ra quyết định can thiệp sớm (như sử dụng nhóm thuốc chống viêm, kháng sinh phổ rộng, hoặc can thiệp phẫu thuật) là chìa khóa vàng giúp chặn đứng tổn thương thực thể hồi phục, bảo vệ tính mạng tối ưu cho người bệnh.`;

  treatmentText = `1. Phác đồ nội khoa đặc hiệu đầu tay theo hướng dẫn của Bộ Y Tế Việt Nam áp dụng cho ${topic.title}:\n- Sử dụng các nhóm thuốc điều trị đích tương ứng với từ khóa (${keywordsStr}).\n- Liệu pháp hỗ trợ triệu chứng: Giảm đau, kháng viêm hạ sốt, bù nước điện giải theo nhu cầu.\n2. Chỉ định can thiệp thủ thuật hoặc phẫu thuật ngoại khoa nếu tiến triển sang thể nặng hoặc biến chứng tổn thương cấu trúc.\n3. Chế độ dinh dưỡng hồi sức, vận động sớm dưới sự hướng dẫn y tế để đẩy nhanh tiến độ xuất viện an toàn.`;

  prognosisText = `- Tiên lượng gần: ${severity === "Biến chứng" ? "Nặng, có nguy cơ xảy ra suy đa tạng nếu không được tối ưu hóa phác đồ điều trị hồi sức tích cực kịp thời." : "Tốt đến trung bình, đáp ứng nhanh với điều trị chuẩn chỉ sau 48-72 giờ."}\n- Tiên lượng xa: Cần quản lý điều trị ngoại trú chặt chẽ các yếu tố nguy cơ để ngăn ngừa đợt cấp tái phát nguy hại.`;

  followUpText = `- Theo dõi sát dấu hiệu sinh tồn cốt lõi hằng ngày (Mạch, Huyết áp, SpO2, Thân nhiệt).\n- Đánh giá động học các xét nghiệm sinh hóa cơ bản mỗi 24-48 giờ để điều chỉnh liều lượng thuốc phù hợp.\n- Tư vấn chế độ xuất viện, hướng dẫn tự theo dõi các dấu hiệu cảnh báo đỏ nguy hiểm tại nhà để tái khám khẩn cấp.`;

  clinicalLessonsText = `1. Nhận biết sớm triệu chứng báo động đỏ (${topic.symptoms[0]}) để tránh bỏ sót chẩn đoán vàng.\n2. Cận lâm sàng phải luôn luôn đi đôi với biện luận lâm sàng, tuyệt đối không điều trị trên tờ kết quả xét nghiệm đơn thuần.\n3. Cá thể hóa phác đồ điều trị dựa trên tuổi tác, giới tính và các bệnh lý nền đồng mắc của người bệnh.`;

  commonStudentErrorsText = `1. Tiếp cận bệnh nhân không có định hướng, chỉ định tràn lan cận lâm sàng đắt tiền mà không giải thích được mục đích biện luận.\n2. Áp dụng máy móc phác đồ chuẩn mà quên không điều chỉnh liều dùng theo chức năng gan thận thực tế của người bệnh.\n3. Quên không khai thác kỹ tiền sử dùng thuốc trước đó (như Corticoid tự ý mua uống) dẫn đến đánh giá sai tình trạng đáp ứng thuốc hiện tại.`;

  presentationTipsText = `Hãy mở đầu bài trình bày một cách tự tin, đi thẳng vào các hội chứng lâm sàng tích cực: 'Thưa Thầy/Cô, em xin trình bày ca bệnh nhân ${gender} ${age} tuổi, vào viện vì triệu chứng ${cc} ngày thứ 2, qua thăm khám nổi bật với hội chứng tổn thương chuyên khoa ${specialty}, cận lâm sàng ủng hộ chẩn đoán xác định ${topic.title}'. Điều này chứng tỏ bạn có tư duy lâm sàng nhạy bén.`;

  aiPathophysiology = `Cơ chế sinh lý bệnh của ${topic.title} liên quan mật thiết đến sự kích hoạt phản ứng viêm tại chỗ, co thắt cơ trơn hoặc tổn thương cơ học tại vùng mô đích. Điều này dẫn đến sự mất cân bằng cung cầu oxy, tích tụ các gốc tự do và giải phóng hóa chất trung gian gây đau đớn, sốt hoặc rối loạn chức năng thần kinh thực thể.`;

  aiDiagnosticsExplanation = `1. Xét nghiệm chẩn đoán hình ảnh hoặc ECG: Cung cấp bằng chứng thực thể trực tiếp về vùng tổn thương, giúp định vị và phân loại mức độ nghiêm trọng.\n2. Công thức máu và sinh hóa: Đánh giá phản ứng viêm hệ thống và chức năng các cơ quan đào thải chính (gan, thận), hỗ trợ cá thể hóa liều lượng thuốc.\n3. Xét nghiệm định lượng sinh học: Giúp chẩn đoán phân biệt và theo dõi tiến trình hồi phục của mô đích.`;

  aiDiagnosisExplanation = `Chẩn đoán ${topic.title} dựa trên sự đồng thuận của 3 tiêu chuẩn cốt lõi:\n1. Lâm sàng điển hình với các triệu chứng đặc hiệu (${sympsStr}).\n2. Cận lâm sàng đặc hiệu hướng tới tổn thương cơ quan đích.\n3. Loại trừ hoàn toàn các chẩn đoán phân biệt mô phỏng nguy hiểm khác.`;

  aiTreatmentExplanation = `Chiến lược điều trị tối ưu kết hợp đồng thời giữa:\n1. Điều trị căn nguyên: Sử dụng thuốc kháng sinh, kháng virus, chống viêm hoặc can thiệp phẫu thuật triệt để.\n2. Điều trị hỗ trợ triệu chứng: Hạ sốt, giảm đau, cân bằng kiềm toan và nước điện giải.\n3. Dự phòng biến chứng: Sử dụng các nhóm thuốc bảo vệ tế bào lâu dài, phục hồi chức năng vận động và giáo dục sức khỏe sau xuất viện.`;

  wardRoundsChecklist = [
    "Đo lại các dấu hiệu sinh tồn (Mạch, Huyết áp, Nhịp thở, Nhiệt độ) trước giờ thầy cô đi buồng giảng bài.",
    `Hỏi thăm mức độ cải thiện triệu chứng chủ quan (${topic.symptoms[0]}) của bệnh nhân trong buổi sáng.`,
    "Kiểm tra lại toàn bộ hồ sơ bệnh án, các kết quả xét nghiệm mới nhất đã được kẹp đầy đủ chưa.",
    "Khám thực thể vùng tổn thương khu trú để xem mức độ thuyên giảm hay tiến triển cơ năng.",
    "Kiểm tra đường truyền tĩnh mạch và các thuốc đang dùng thực tế của bệnh nhân tại giường."
  ];

  commonTeacherQuestions = [
    { question: `Nêu các chẩn đoán phân biệt chính cần đặt ra cho bệnh nhân có biểu hiện ${topic.symptoms[0]}?`, answer: "Dạ thưa Thầy/Cô, chúng ta cần đặt ra các chẩn đoán phân biệt thuộc các cơ quan lân cận trong cùng khu vực giải phẫu có chung đường dẫn truyền thần kinh hướng tâm, nhằm tránh bỏ sót các cấp cứu tối nguy cấp." },
    { question: `Cơ chế sâu sắc nào dẫn đến triệu chứng ${topic.symptoms[0]} trên bệnh nhân này?`, answer: "Dạ thưa Thầy/Cô, đó là do sự kích hoạt trực tiếp các thụ thể cảm giác tạng bởi áp lực cơ học, phản ứng viêm hóa học hoặc thiếu máu nuôi dưỡng mô đích dẫn truyền về sừng sau tủy sống." }
  ];

  difficultQuestionTips = "Khi giảng viên hỏi khó về các tình huống biến chứng hiếm gặp hoặc hướng can thiệp nâng cao, hãy trả lời bình tĩnh: 'Dạ thưa Thầy/Cô, đây là tình huống rất hay và đòi hỏi chuyên môn sâu. Ở mức độ sinh viên, trước hết em sẽ ưu tiên ổn định các chức năng sống cơ bản cho người bệnh (A-B-C), sau đó em sẽ đề xuất lập tức hội chẩn liên chuyên khoa sâu hoặc xin ý kiến chỉ đạo trực tiếp của các bác sĩ nội trú, bác sĩ điều trị giàu kinh nghiệm để đưa ra phác đồ tối ưu, an toàn nhất cho người bệnh'.";

  return {
    id: `dynamic-${topicId}-${severity.toLowerCase()}-${gender.toLowerCase()}-${age}`,
    title,
    code: topic.code,
    category: topic.category,
    specialty,
    age,
    gender,
    reasonForAdmission: cc,
    historyOfPresentIllness: hpi,
    pastMedicalHistory: pmh,
    vitals,
    physicalExamSummary: physicalExam,
    labsAndDiagnostics: labs,
    aiClinicalInsight: `Cơ chế bệnh sinh & Biện luận sâu sắc:\n${clinicalDiscussionText}\n\nHướng xử trí & Điều trị:\n${treatmentText}`,
    administrationText: `Họ và tên: NGUYỄN LÂM SÀNG, ${age} tuổi, ${gender}.\nĐịa chỉ: TP. Hồ Chí Minh, Việt Nam.\nNghề nghiệp: Tự do.\nNgày giờ làm bệnh án: ${new Date().toLocaleDateString()}`,
    reasonForAdmissionText: cc,
    hpiText: hpi,
    pmhText: pmh,
    physicalExamText: physicalExam,
    caseSummaryText,
    clinicalDiscussionText,
    preliminaryDiagnosisText: `Chẩn đoán sơ bộ: ${topic.title} ${sevLabel}.`,
    definitiveDiagnosisText: `Chẩn đoán xác định: ${topic.title} ${sevLabel}.`,
    diagnosticsText: labs.map(l => `- ${l.testName}: ${l.result} (${l.interpretation})`).join("\n"),
    treatmentText,
    prognosisText,
    followUpText,
    clinicalLessonsText,
    commonStudentErrorsText,
    presentationTipsText,
    wardRoundsChecklist,
    commonTeacherQuestions,
    difficultQuestionTips,
    aiPathophysiology,
    aiDiagnosticsExplanation,
    aiDiagnosisExplanation,
    aiTreatmentExplanation
  };
};
