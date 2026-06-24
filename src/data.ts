import { OSCECase, LibraryCase, StudentStats } from "./types";
import { generateDetailedCase, DISEASE_TOPICS } from "./libraryData";

// Pre-loaded medical record templates for "AI Sửa Bệnh Án"
export const PRESET_MEDICAL_RECORDS = [
  {
    id: "ami-male-65",
    title: "Nhồi máu cơ tim cấp (Nam 65T, giờ thứ 3)",
    specialty: "Tim mạch",
    recordText: `HÀNH CHÍNH:
Họ và tên: NGUYỄN VĂN HÙNG, 65 tuổi, Nam.
Nghề nghiệp: Hưu trí.
Địa chỉ: Quận 5, TP. Hồ Chí Minh.

LÝ DO VÀO VIỆN: Đau ngực trái giờ thứ 3.

BỆNH SỬ:
Cách nhập viện khoảng 3 giờ, khi đang ngồi nghỉ ngơi, bệnh nhân đột ngột xuất hiện cơn đau dữ dội vùng sau xương ức, cảm giác bóp nghẹt như có đá đè lên ngực. Đau liên tục kéo dài hơn 30 phút không giảm, lan lên cằm và dọc bờ trong cánh tay trái xuống ngón út. Bệnh nhân có vã mồ hôi đầm đìa toàn thân, kèm theo cảm giác khó thở, hồi hộp đánh trống ngực. Không sốt, không ho, không nôn ói. Ở nhà có ngậm 1 viên Nitroglycerin dưới lưỡi nhưng không đỡ đau nên người nhà đưa vào viện cấp cứu.

TIỀN SỬ:
1. Bản thân:
- Tăng huyết áp 10 năm, huyết áp tâm thu cao nhất 180 mmHg, duy trì hằng ngày với Amlodipine 5mg uống sáng nhưng uống không đều đặn.
- Rối loạn lipid máu phát hiện 2 năm nay, điều trị không liên tục.
- Hút thuốc lá 30 năm, khoảng 1 bao/ngày.
2. Gia đình: Chưa ghi nhận bệnh lý tim mạch sớm.

THĂM KHÁM LÂM SÀNG:
1. Toàn trạng:
- Bệnh nhân tỉnh táo, tiếp xúc tốt, gương mặt lo âu, vã mồ hôi lạnh.
- Thể trạng trung bình, BMI = 24.2 kg/m2.
- Dấu hiệu sinh tồn: Mạch: 96 lần/phút (đều, rõ), Huyết áp: 145/85 mmHg, Nhịp thở: 22 lần/phút, Nhiệt độ: 36.8 độ C, SpO2: 94% (khí trời).
- Niêm mạc hồng nhạt, không phù, hạch ngoại vi không sờ chạm.
2. Cơ quan:
- Tim mạch: Lồng ngực cân đối, diện đập mỏm tim ở khoang liên sườn V đường trung đòn trái, diện đập khoảng 1.5cm. Nghe tim: tiếng T1, T2 đều, rõ, tần số 96 chu kỳ/phút, không nghe thấy tiếng thổi bệnh lý, không thấy tiếng cọ màng tim hay tiếng T3, T4.
- Hô hấp: Rì rào phế nang 2 phế trường êm dịu, không rale.
- Tiêu hóa: Bụng mềm, gan lách không sờ chạm.
- Thần kinh: Không có dấu hiệu thần kinh khu trú.`
  },
  {
    id: "appendicitis-female-22",
    title: "Viêm ruột thừa cấp (Nữ 22T, ngày 2)",
    specialty: "Ngoại khoa",
    recordText: `HÀNH CHÍNH:
Họ và tên: LÊ THỊ MAI, 22 tuổi, Nữ.
Nghề nghiệp: Sinh viên.
Địa chỉ: Quận Thủ Đức, TP. Hồ Chí Minh.

LÝ DO VÀO VIỆN: Đau bụng vùng hố chậu phải ngày thứ 2.

BỆNH SỬ:
Cách nhập viện khoảng 24 giờ, bệnh nhân bắt đầu khởi phát cơn đau bụng âm ỉ, râm ran ở vùng quanh rốn, đau mức độ nhẹ (điểm đau 3/10). Đau liên tục, không lan. Sau đó khoảng 10 tiếng, cơn đau di chuyển hẳn và khu trú rõ rệt về vùng hố chậu bên phải. Lúc này tính chất đau chuyển sang âm ỉ liên tục kèm theo những cơn đau quặn tăng dần (điểm đau 6/10), mỗi khi bệnh nhân ho hay cử động, bước đi mạnh thì đau nhói thốn ở vùng bụng bên phải. Bệnh nhân có cảm giác chán ăn, ăn vào thấy buồn nôn, đã nôn khan 1 lần ra dịch dạ dày trong sáng nay. Người hâm hấp sốt, tự đo nhiệt độ thấy 37.8 độ C. Đại tiểu tiện bình thường, phân vàng sệt.

TIỀN SỬ:
1. Bản thân: Chưa ghi nhận bệnh lý nội ngoại khoa nào trước đây. Khỏe mạnh. Kinh nguyệt đều, kỳ kinh cuối cách đây 14 ngày. Chưa lập gia đình.
2. Gia đình: Không có gì đặc biệt.

THĂM KHÁM LÂM SÀNG:
1. Toàn trạng:
- Bệnh nhân tỉnh, tiếp xúc tốt, mệt mỏi.
- Dấu hiệu sinh tồn: Mạch: 88 lần/phút, Huyết áp: 110/70 mmHg, Nhiệt độ: 37.9 độ C, Nhịp thở: 18 lần/phút, SpO2: 98% (khí trời).
- Môi hơi khô, lưỡi bẩn nhẹ. Không phù, hạch cổ không to.
2. Khám bụng:
- Bụng phẳng, di động theo nhịp thở, không chướng, không tuần hoàn bàng hệ.
- Bụng mềm, ấn đau chói vùng hố chậu phải.
- Nghiệm pháp ấn điểm McBurney (+).
- Nghiệm pháp phản ứng dội (Rebound tenderness) nghi ngờ (+) ở hố chậu phải.
- Nghiệm pháp cơ thắt lưng chậu (Psoas sign) (+).
- Gõ trong, không gõ đục vùng thấp. Nghe nhu động ruột 6 lần/phút.`
  },
  {
    id: "asthma-child-3",
    title: "Cơn hen phế quản cấp (Trẻ nam 3T, đợt cấp)",
    specialty: "Nhi khoa",
    recordText: `HÀNH CHÍNH:
Họ và tên trẻ: TRẦN MINH QUÂN, 3 tuổi, Nam.
Người đưa trẻ đến khám: Mẹ ruột (Chị Nguyễn Thị Lan).
Địa chỉ: Quận Bình Thạnh, TP. Hồ Chí Minh.

LÝ DO VÀO VIỆN: Ho và khó thở khò khè ngày thứ 2.

BỆNH SỬ:
Theo lời kể của mẹ, bé có tiền sử khò khè nhiều đợt. Cách nhập viện 2 ngày, sau khi thay đổi thời tiết chuyển lạnh, bé bắt đầu xuất hiện chảy nước mũi trong, hắt hơi kèm ho húng hắng. Đến tối hôm qua, bé bắt đầu ho nhiều hơn thành cơn, xuất hiện tiếng thở khò khè nghe rõ bằng tai thường, thở nhanh và nông hơn. Sáng nay, bé thở gắng sức, co kéo cơ hô hấp phụ, bú kém, quấy khóc liên tục, không nằm yên được mà phải bế dựng trên vai mẹ thì mới đỡ thở dốc. Bé không sốt, không nôn ói, đại tiểu tiện bình thường. Người nhà chưa tự cho uống thuốc gì ngoài siro ho bổ phế nhưng không đỡ nên đưa bé đi khám.

TIỀN SỬ:
- Bé sinh thường, đủ tháng, nặng 3.2 kg, phát triển tâm vận bình thường.
- Đã có 3 đợt khò khè khó thở phải nhập viện điều trị xịt thuốc giãn phế quản (Salbutamol) và corticoid đường uống khi 18 tháng, 24 tháng và 30 tháng tuổi.
- Có cơ địa chàm sữa (Atopic dermatitis) lúc nhỏ và dị ứng với hải sản (tôm, cua).
- Gia đình: Mẹ ruột bị viêm mũi dị ứng; Cậu ruột bị hen phế quản từ nhỏ.

THĂM KHÁM LÂM SÀNG:
1. Toàn trạng:
- Trẻ tỉnh táo nhưng quấy khóc liên tục, vật vã, thích ngồi hơn nằm.
- Thể trạng trung bình, cân nặng 14 kg.
- Dấu hiệu sinh tồn: Mạch: 132 lần/phút (nhanh), Nhịp thở: 44 lần/phút (nhanh so với lứa tuổi), Nhiệt độ: 37.0 độ C, SpO2: 91% (không thở oxy).
- Da niêm mạc hồng, không có tím tái quanh môi hay đầu chi.
2. Khám Hô hấp:
- Lồng ngực cân đối, di động theo nhịp thở.
- Thở gắng sức rõ: co kéo cơ liên sườn (+) nhẹ, rút lõm hõm ức (+), phập phồng cánh mũi (+).
- Nghe phổi: rì rào phế nang giảm nhẹ 2 phế trường, nghe đầy rẫy rale rít (wheezing) và rale ngáy lan tỏa khắp 2 phổi, rõ nhất ở thì thở ra. Thì thở ra kéo dài.
3. Cơ quan khác:
- Tim mạch: Tiếng tim nhanh, đều, rõ, tần số 132 lần/phút, không âm thổi.
- Tiêu hóa: Bụng mềm, chướng nhẹ, gan lách không sờ chạm.`
  }
];

// Pre-defined OSCE simulations
export const OSCE_CASES: OSCECase[] = [
  {
    id: "IM-402",
    code: "IM-402",
    title: "Cấp cứu Đau Ngực Cấp",
    specialty: "Nội khoa / Tim mạch",
    gender: "Nam",
    age: 45,
    complaint: "Đau thắt ngực trái dữ dội giờ thứ 2 kèm vã mồ hôi lạnh.",
    timeRemaining: 900, // 15 minutes
    vitals: {
      bp: "145/88 mmHg",
      hr: "96 bpm",
      rr: "22 /phút",
      spo2: "94% (Khí trời)",
      temp: "36.7 °C"
    },
    examManeuvers: [
      { id: "e1", name: "Nghe tim (Auscultation)", result: "T1, T2 đều rõ, tần số 96 chu kỳ/phút, không nghe thấy tiếng tim Gallop T3 hay tiếng cọ màng ngoài tim." },
      { id: "e2", name: "Nghe phổi (Lung exam)", result: "Rì rào phế nang phế trường 2 bên êm dịu, không có rale ẩm, không rale rít rít." },
      { id: "e3", name: "Khám mạch ngoại vi (Pulses)", result: "Mạch quay, mạch cảnh, mạch bẹn hai bên đều nảy rõ, đối xứng. Không có dấu hiệu sưng đau chi dưới (loại trừ huyết khối tĩnh mạch sâu)." },
      { id: "e4", name: "Khám thành ngực (Wall palpation)", result: "Ấn chẩn thành ngực không có điểm đau khu trú tại xương ức hay sụn sườn (loại trừ đau thành ngực)." }
    ],
    labTests: [
      { id: "l1", name: "Điện tâm đồ (ECG 12 chuyển đạo)", result: "ST chênh lên dạng vòm (ST-elevation) > 2mm ở các chuyển đạo V1, V2, V3, V4 kèm hình ảnh soi gương ST chênh xuống ở DII, DIII, aVF.", interpretation: "Nhồi máu cơ tim cấp vùng trước rộng (Anterior STEMI)" },
      { id: "l2", name: "Troponin T siêu nhạy (hs-Troponin T)", result: "850 ng/L (Bình thường < 14 ng/L)", interpretation: "Tăng rất cao, khẳng định có sự hủy hoại tế bào cơ tim cấp tính." },
      { id: "l3", name: "Công thức máu (CBC)", result: "Bạch cầu (WBC): 11.2 G/L (tăng nhẹ phản ứng), Hồng cầu (RBC): 4.5 T/L, Tiểu cầu (PLT): 225 G/L.", interpretation: "Trong giới hạn bình thường phản ứng." },
      { id: "l4", name: "Sinh hóa máu (Urea, Creatinine, Men gan)", result: "Urea: 5.6 mmol/L, Creatinine: 82 µmol/L (chức năng thận bình thường), AST: 54 U/L, ALT: 38 U/L.", interpretation: "Bình thường." }
    ]
  },
  {
    id: "SURG-201",
    code: "SURG-201",
    title: "Cấp cứu Đau Bụng Cấp",
    specialty: "Ngoại khoa / Tiêu hóa",
    gender: "Nữ",
    age: 22,
    complaint: "Đau hố chậu phải ngày thứ 2 di chuyển từ rốn, kèm sốt nhẹ.",
    timeRemaining: 900,
    vitals: {
      bp: "110/72 mmHg",
      hr: "88 bpm",
      rr: "18 /phút",
      spo2: "98% (Khí trời)",
      temp: "37.9 °C"
    },
    examManeuvers: [
      { id: "e1", name: "Khám bụng: Nhìn & Nghe", result: "Bụng phẳng, không chướng, di động theo nhịp thở. Nhu động ruột 5-6 lần/phút, âm sắc bình thường." },
      { id: "e2", name: "Khám bụng: Sờ chẩn (Palpation)", result: "Ấn đau chói khu trú ở vùng hố chậu phải. Đề kháng thành bụng (-) nhưng phản ứng dội (Rebound tenderness / MacBurney) (+)." },
      { id: "e3", name: "Nghiệm pháp cơ thắt lưng chậu (Psoas sign)", result: "Dương tính (+). Đau nhói ở hố chậu phải khi nâng chân phải của bệnh nhân chống lại lực cản." },
      { id: "e4", name: "Khám phụ khoa sơ bộ", result: "Cổ tử cung khép, không đau khi lắc cổ tử cung. Không có khối nề đau vùng hạ vị." }
    ],
    labTests: [
      { id: "l1", name: "Công thức máu (CBC)", result: "Bạch cầu (WBC): 14.5 G/L (tăng cao), tỷ lệ Bạch cầu trung tính (Neutrophils): 82% (chuyển trái rõ rệt).", interpretation: "Hội chứng nhiễm trùng huyết học rõ rệt." },
      { id: "l2", name: "Siêu âm ổ bụng (Abdominal Ultrasound)", result: "Hình ảnh ruột thừa vùng hố chậu phải tăng kích thước, đường kính ngoài d = 8.2mm (bình thường < 6mm), thành dày, mất liên tục lớp dưới niêm mạc, có ít dịch xung quanh và thâm nhiễm mỡ hố chậu phải. Không có dịch tự do ổ bụng.", interpretation: "Hình ảnh viêm ruột thừa cấp điển hình." },
      { id: "l3", name: "Xét nghiệm nước tiểu (Urine analysis)", result: "Bạch cầu (-), Hồng cầu (-), Nitrite (-).", interpretation: "Loại trừ nhiễm trùng đường tiết niệu hoặc sỏi niệu quản phải." },
      { id: "l4", name: "Định lượng beta-hCG máu", result: "< 2.0 U/L (Âm tính)", interpretation: "Loại trừ có thai và chửa ngoài tử cung vỡ." }
    ]
  }
];

// Rich Library Cases for Thư viện bệnh án
export const ORIGINAL_LIBRARY_CASES: LibraryCase[] = [
  {
    id: "lib-1",
    title: "Nhồi máu cơ tim cấp thành trước rộng",
    code: "IM-CARD-01",
    category: "Acute",
    specialty: "Tim mạch",
    age: 65,
    gender: "Nam",
    reasonForAdmission: "Đau thắt ngực trái dữ dội kèm vã mồ hôi lạnh giờ thứ 3.",
    historyOfPresentIllness: "Cách nhập viện 3 giờ, khi đang nghỉ ngơi tại nhà, bệnh nhân đột ngột xuất hiện cơn đau bóp nghẹt vùng sau xương ức, lan lên cằm và vai trái, kéo dài liên tục hơn 30 phút không giảm dù đã ngậm Nitroglycerin. Kèm vã mồ hôi đầm đìa, khó thở nhẹ.",
    pastMedicalHistory: "Tăng huyết áp 10 năm điều trị Amlodipine 5mg uống không đều. Rối loạn lipid máu 2 năm. Hút thuốc lá 30 bao-năm.",
    vitals: {
      bp: "145/85 mmHg",
      hr: "96 bpm",
      rr: "22 /phút",
      temp: "36.8 °C",
      spo2: "94% (Khí trời)"
    },
    physicalExamSummary: "Bệnh nhân tỉnh táo, lo âu, vã mồ hôi lạnh. Nghe tim tiếng T1, T2 đều rõ, chu kỳ 96 ck/phút, không âm thổi bệnh lý. Phổi rì rào phế nang rõ, không rale. Bụng mềm, gan lách không to. Mạch ngoại vi nảy đều hai bên.",
    labsAndDiagnostics: [
      { testName: "ECG 12 chuyển đạo", result: "ST chênh lên dạng vòm > 2mm ở các chuyển đạo trước tim V1 đến V4, kèm hình ảnh soi gương ở DII, DIII, aVF.", interpretation: "Nhồi máu cơ tim cấp vùng trước rộng (STEMI)." },
      { testName: "hs-Troponin T", result: "850 ng/L", normalRange: "< 14 ng/L", interpretation: "Hủy hoại tế bào cơ tim cấp tính rõ rệt." },
      { testName: "Siêu âm tim tại giường (POCUS)", result: "Giảm vận động vùng vách liên thất và thành trước thất trái. Phân suất tống máu thất trái (EF) giảm nhẹ còn 46%.", interpretation: "Phù hợp với vùng cơ tim bị thiếu máu nuôi dưỡng do tắc nghẽn động mạch liên thất trước (LAD)." }
    ],
    aiClinicalInsight: "Cơn đau ngực điển hình kèm hình ảnh ST chênh lên vùng trước rộng trên ECG và men tim tăng rất cao là tiêu chuẩn vàng chẩn đoán Nhồi máu cơ tim cấp vùng trước rộng (STEMI). Chiến lược xử trí hàng đầu là kích hoạt hệ thống can thiệp mạch vành qua da (PCI) cấp cứu tái thông động mạch vành tắc nghẽn trong thời gian vàng (< 120 phút từ lúc tiếp cận y tế) để giảm thiểu diện tích hoại tử cơ tim, kết hợp kháng kết tập tiểu cầu kép (DAPT) và chống đông heparin."
  },
  {
    id: "lib-2",
    title: "Viêm ruột thừa cấp thể điển hình",
    code: "SURG-GI-03",
    category: "Acute",
    specialty: "Ngoại khoa",
    age: 22,
    gender: "Nữ",
    reasonForAdmission: "Đau hố chậu phải ngày thứ 2 di chuyển từ quanh rốn.",
    historyOfPresentIllness: "Bệnh khởi phát cách nhập viện 24 giờ với đau âm ỉ vùng quanh rốn, sau đó 10 tiếng di chuyển và khu trú rõ ở hố chậu phải, tăng lên khi đi lại hoặc ho. Kèm chán ăn, buồn nôn, nôn khan 1 lần, sốt nhẹ hâm hấp.",
    pastMedicalHistory: "Chưa ghi nhận bệnh lý nội ngoại khoa đặc biệt trước đây. Kỳ kinh cuối cách đây 14 ngày, chu kỳ kinh nguyệt đều.",
    vitals: {
      bp: "110/70 mmHg",
      hr: "88 bpm",
      rr: "18 /phút",
      temp: "37.9 °C",
      spo2: "98% (Khí trời)"
    },
    physicalExamSummary: "Tỉnh, mệt mỏi, sốt nhẹ. Bụng phẳng di động theo nhịp thở, bụng mềm, ấn đau chói vùng hố chậu phải. Nghiệm pháp McBurney (+), Rebound tenderness (+), Nghiệm pháp cơ thắt lưng chậu (+).",
    labsAndDiagnostics: [
      { testName: "Công thức máu (CBC)", result: "WBC: 14.5 G/L, Neutrophil: 82% (tăng cao)", normalRange: "WBC: 4.0 - 10.0 G/L", interpretation: "Có tình trạng phản ứng viêm/nhiễm trùng cấp tính." },
      { testName: "Siêu âm bụng", result: "Ruột thừa hố chậu phải đường kính ngoài 8.2mm, thành dày, mất liên tục lớp dưới niêm mạc, có thâm nhiễm mỡ xung quanh ruột thừa.", interpretation: "Viêm ruột thừa cấp tiến triển." },
      { testName: "Beta-hCG định lượng", result: "< 2.0 U/L", normalRange: "< 5.0 U/L (Âm tính)", interpretation: "Loại trừ mang thai hoặc thai ngoài tử cung vỡ." }
    ],
    aiClinicalInsight: "Bệnh sử điển hình (triệu chứng di chuyển đau quanh rốn sang hố chậu phải) kết hợp với phản ứng thành bụng khu trú, sốt nhẹ, bạch cầu tăng và hình ảnh ruột thừa căng to trên siêu âm cho phép khẳng định chẩn đoán Viêm ruột thừa cấp. Phương pháp điều trị là phẫu thuật nội soi cắt ruột thừa cấp cứu nhằm phòng ngừa biến chứng nguy hiểm như viêm ruột thừa vỡ gây viêm phúc mạc toàn thể."
  },
  {
    id: "lib-3",
    title: "Đợt cấp Bệnh phổi tắc nghẽn mạn tính (COPD)",
    code: "IM-PULM-02",
    category: "Chronic",
    specialty: "Nội khoa",
    age: 72,
    gender: "Nam",
    reasonForAdmission: "Khó thở nhiều kèm ho khạc đờm đục tăng dần ngày thứ 3.",
    historyOfPresentIllness: "Bệnh nhân có tiền sử COPD nhiều năm. Cách nhập viện 3 ngày, sau khi nhiễm lạnh, bệnh nhân ho nhiều hơn, đờm chuyển sang đục, có màu vàng xanh, lượng đờm tăng lên. Khó thở tăng dần, khó thở ngay cả khi đi lại trong nhà, phải ngồi dậy để thở.",
    pastMedicalHistory: "COPD nhóm D (chẩn đoán 5 năm trước), đang dùng thuốc hít hằng ngày nhưng không đều. Tiền sử hút thuốc lá thuốc lào hơn 40 năm.",
    vitals: {
      bp: "135/80 mmHg",
      hr: "102 bpm (nhanh, đều)",
      rr: "26 /phút (thở nhanh, nông)",
      temp: "37.5 °C",
      spo2: "89% (Khí trời) -> 93% (thở oxy gọng kính 2L/phút)"
    },
    physicalExamSummary: "Bệnh nhân tỉnh táo, thở co kéo cơ hô hấp phụ, môi khô, lưỡi bẩn. Lồng ngực hình thùng, gõ vang trống hai phế trường. Nghe phổi rì rào phế nang giảm, ran rít ran ngáy rải rác hai bên phổi, kèm ít ran ẩm vùng đáy phổi phải.",
    labsAndDiagnostics: [
      { testName: "Khí máu động mạch (ABG)", result: "pH: 7.33 (giảm nhẹ), PaCO2: 52 mmHg (tăng), PaO2: 58 mmHg (giảm), HCO3-: 28 mmol/L.", interpretation: "Toan hô hấp mất bù nhẹ, có tình trạng suy hô hấp cấp trên nền mạn tính (tăng CO2 máu)." },
      { testName: "X-quang ngực thẳng", result: "Hình ảnh khí phế thũng: trường phổi 2 bên sáng, xương sườn nằm ngang, cơ hoành dẹt hai bên. Giải đậm rải rác vùng đáy phổi phải.", interpretation: "Phù hợp với khí phế thũng mạn tính và nghi ngờ có viêm phổi bội nhiễm kèm theo." },
      { testName: "Định lượng CRP", result: "45 mg/L (tăng cao)", normalRange: "< 5 mg/L", interpretation: "Có phản ứng viêm hệ thống tiến triển (nhiễm khuẩn đợt cấp)." }
    ],
    aiClinicalInsight: "Sự gia tăng đồng thời cả 3 triệu chứng (khó thở tăng, lượng đờm tăng, đờm mủ đục) đáp ứng tiêu chuẩn Anthonisen nhóm I, chẩn đoán xác định Đợt cấp COPD mức độ nặng, có chỉ định dùng kháng sinh phổ rộng (như Cephalosporin thế hệ 3 kết hợp Macrolide hoặc Levofloxacin). Xử trí cấp cứu bao gồm thở oxy kiểm soát giữ SpO2 từ 88-92%, khí dung thuốc giãn phế quản tác dụng ngắn (SABA + SAMA như Combivent), và Methylprednisolon đường tĩnh mạch."
  },
  {
    id: "lib-4",
    title: "Đột quỵ nhồi máu não cấp giờ thứ 2",
    code: "IM-NEURO-04",
    category: "Acute",
    specialty: "Thần kinh",
    age: 58,
    gender: "Nữ",
    reasonForAdmission: "Yếu nửa người bên trái và nói ngọng khởi phát đột ngột.",
    historyOfPresentIllness: "Cách nhập viện 2 giờ, khi bệnh nhân đang ăn trưa cùng gia đình, đột ngột thấy tê bì và yếu liệt hoàn toàn nửa người bên trái, không thể cầm đũa bằng tay trái, chân trái đứng không vững và bị ngã khuỵu xuống. Đồng thời bệnh nhân nói khó, méo miệng sang phải. Không đau đầu, không co giật, không nôn ói.",
    pastMedicalHistory: "Rung nhĩ không do bệnh van tim đang điều trị với thuốc chống đông đường uống mới (NOAC) nhưng tự ý ngưng thuốc 1 tháng nay. Tăng huyết áp 5 năm.",
    vitals: {
      bp: "160/90 mmHg",
      hr: "115 bpm (nhịp tim không đều hoàn toàn - loạn nhịp hoàn toàn)",
      rr: "18 /phút",
      temp: "36.6 °C",
      spo2: "97% (Khí trời)"
    },
    physicalExamSummary: "Tỉnh táo, gọi hỏi trả lời chậm, nói ngọng rõ. Liệt dây thần kinh số VII trung ương bên trái (méo miệng sang phải). Sức cơ tay trái 1/5, chân trái 2/5. Phản xạ gân xương bánh chè trái tăng, dấu hiệu Babinski trái (+). Cảm giác nông nửa người trái giảm.",
    labsAndDiagnostics: [
      { testName: "Cắt lớp vi tính sọ não không cản quang (Non-contrast CT)", result: "Chưa thấy hình ảnh xuất huyết não (máu tụ dạng tăng tỷ trọng). Thấy mờ rãnh vỏ não nhẹ vùng thái dương - đỉnh bên phải.", interpretation: "Loại trừ xuất huyết não, phù hợp đột quỵ nhồi máu não cấp tính diện rộng giờ đầu." },
      { testName: "Điện tâm đồ (ECG)", result: "Mất sóng P, thay bằng các sóng f lăn tăn tần số nhanh, khoảng cách các phức bộ QRS hoàn toàn không đều nhau.", interpretation: "Rung nhĩ đáp ứng thất nhanh." },
      { testName: "Đông máu toàn bộ", result: "PT-INR: 1.15", normalRange: "2.0 - 3.0 (cho bệnh nhân dùng kháng đông)", interpretation: "Chỉ số đông máu bình thường, chứng minh thuốc chống đông NOAC không còn hiệu lực bảo vệ do tự ngưng thuốc." }
    ],
    aiClinicalInsight: "Bệnh nhân có biểu hiện đột quỵ não cấp với hội chứng yếu nửa người trái và liệt VII trung ương trái khởi phát đột ngột. CT sọ não loại trừ xuất huyết. Thời gian từ lúc khởi phát là 2 giờ (nằm trong cửa sổ thời gian vàng < 4.5 giờ). Bệnh nhân có chỉ định tuyệt đối sử dụng thuốc tiêu sợi huyết Alteplase (rTPA) đường tĩnh mạch để tái thông mạch máu não bị tắc, kèm theo tầm soát huyết khối động mạch lớn bằng chụp mạch CT (CTA) để sẵn sàng can thiệp lấy huyết khối bằng dụng cụ cơ học (Mechanical Thrombectomy)."
  }
];

const DYNAMIC_LIBRARY_CASES: LibraryCase[] = DISEASE_TOPICS.flatMap(topic => {
  return (["Điển hình", "Nặng", "Biến chứng"] as const).map(sev => {
    return generateDetailedCase(topic.id, topic.defaultAge, topic.defaultGender, sev);
  });
});

export const LIBRARY_CASES: LibraryCase[] = [
  ...ORIGINAL_LIBRARY_CASES,
  ...DYNAMIC_LIBRARY_CASES
];

// Initial Stats for Dashboard
export const INITIAL_STUDENT_STATS: StudentStats = {
  learningHours: 124,
  casesStudied: 342,
  avgOSCEScore: 85,
  docQualityScore: 92,
  specialtyProgress: [
    { name: "Nội khoa", completed: 120, total: 150, color: "bg-blue-600" },
    { name: "Ngoại khoa", completed: 85, total: 100, color: "bg-teal-600" },
    { name: "Sản phụ khoa", completed: 40, total: 80, color: "bg-purple-600" },
    { name: "Nhi khoa", completed: 65, total: 80, color: "bg-indigo-600" },
    { name: "Thần kinh", completed: 32, total: 50, color: "bg-pink-600" }
  ],
  achievements: [
    {
      id: "ac-1",
      title: "Biện Luận Sắc Bén",
      desc: "Đạt điểm Biện luận lâm sàng trên 90% ở 10 ca liên tiếp.",
      iconName: "BrainCircuit",
      color: "text-blue-600 bg-blue-50 border-blue-200"
    },
    {
      id: "ac-2",
      title: "Trùm OSCE",
      desc: "Hoàn thành bài thi OSCE Ảo dưới 10 phút với điểm tối đa.",
      iconName: "Stethoscope",
      color: "text-teal-600 bg-teal-50 border-teal-200"
    },
    {
      id: "ac-3",
      title: "Lương Y Từ Mẫu",
      desc: "Sử dụng ngôn từ thấu cảm y đức đạt điểm tuyệt đối khi hỏi bệnh.",
      iconName: "HeartHandshake",
      color: "text-pink-600 bg-pink-50 border-pink-200"
    },
    {
      id: "ac-4",
      title: "Thần Tốc Xử Trí",
      desc: "Chỉ định cận lâm sàng cấp cứu và xử trí STEMI đúng thời gian vàng.",
      iconName: "Zap",
      color: "text-amber-600 bg-amber-50 border-amber-200"
    }
  ],
  recentActivities: [
    {
      id: "act-1",
      type: "osce",
      title: "Hoàn thành ca thi OSCE: IM-402 - Đau ngực cấp",
      score: "88%",
      time: "10 phút trước"
    },
    {
      id: "act-2",
      type: "analysis",
      title: "AI sửa bệnh án: Nguyễn Văn Hùng - Nhồi máu cơ tim",
      score: "85/100",
      time: "2 giờ trước"
    },
    {
      id: "act-3",
      type: "library",
      title: "Nghiên cứu bệnh án mẫu: Đột quỵ nhồi máu não cấp",
      time: "1 ngày trước"
    },
    {
      id: "act-4",
      type: "osce",
      title: "Thi thử OSCE: SURG-201 - Viêm ruột thừa cấp",
      score: "92%",
      time: "3 ngày trước"
    }
  ]
};
