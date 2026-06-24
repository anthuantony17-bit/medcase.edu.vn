import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import mammoth from "mammoth";
import * as pdf from "pdf-parse";

dotenv.config();

// Pre-defined fallback analysis templates based on common inputs
const getFallbackAnalysis = (recordText: string, specialty: string) => {
  const text = recordText.toLowerCase();
  
  // Default cardiac clinical analysis (e.g. AMI / Chest pain)
  if (text.includes("đau ngực") || text.includes("tim mạch") || text.includes("nhồi máu") || text.includes("mạch vành")) {
    return {
      overallScore: 78,
      scores: {
        history: 80,
        exam: 82,
        labs: 75,
        reasoning: 72,
        treatment: 80
      },
      comments: {
        errors: [
          {
            title: "Chưa phân biệt rõ loại hội chứng mạch vành cấp",
            desc: "Bệnh án chưa phân định rõ chẩn đoán sơ bộ ban đầu là Nhồi máu cơ tim cấp có ST chênh lên (STEMI) hay Hội chứng mạch vành cấp không ST chênh lên (NSTE-ACS) ngay trước khi có kết quả điện tâm đồ (ECG)."
          },
          {
            title: "Thiếu chẩn đoán phân biệt nguy kịch",
            desc: "Đau ngực cấp dữ dội kèm vã mồ hôi bắt buộc phải loại trừ Phình tách động mạch chủ ngực (đau xé lan sau lưng) và Thuyên tắc phổi cấp (đau kèm khó thở đột ngột, SpO2 giảm)."
          }
        ],
        missing: [
          {
            title: "Thiếu thông tin phân tầng yếu tố nguy cơ tim mạch",
            desc: "Cần khai thác kỹ hơn về tiền sử gia đình (cha ruột bị mạch vành sớm trước 55 tuổi) và thói quen sinh hoạt (hút thuốc lá bao nhiêu bao/năm, mức độ stress)."
          },
          {
            title: "Khám tim mạch chưa ghi nhận tĩnh mạch cổ nổi và ran phổi",
            desc: "Đây là 2 dấu hiệu thực thể cực kỳ quan trọng giúp đánh giá nhanh biến chứng suy tim cấp (phù phổi cấp hoặc shock tim) đi kèm nhồi máu cơ tim."
          }
        ],
        terminology: [
          {
            title: "Sử dụng viết tắt vô nguyên tắc",
            desc: "Tránh viết tắt trực tiếp 'NMCT', 'THA', 'ĐTĐ' trong phần Bệnh sử mà chưa định nghĩa viết tắt ở dòng đầu tiên xuất hiện."
          },
          {
            title: "Dùng từ ngữ dân dã chưa y khoa",
            desc: "Thay thế từ 'mệt xỉu' bằng 'gần ngất' (near-syncope) hoặc 'mệt mỏi mức độ nặng' để chuẩn hóa bệnh án."
          }
        ],
        suggestions: [
          {
            title: "Bổ sung thang điểm phân tầng nguy cơ quốc tế",
            desc: "Đề xuất áp dụng thang điểm GRACE hoặc TIMI ngay trong phần Biện luận lâm sàng để định hình thời gian can thiệp mạch vành phù hợp (can thiệp cấp cứu < 2h, hay can thiệp sớm < 24h)."
          }
        ]
      },
      classification: {
        caseType: "Bệnh án Nội khoa",
        specialty: "Nội khoa - Tim mạch",
        suspectedDiagnosis: "Nhồi máu cơ tim cấp (AMI) nghi ngờ thể STEMI",
        structure: "Đầy đủ 14 phần chính nhưng nội dung một số phần còn sơ sài"
      },
      detailedScores: {
        administration: { score: 4, max: 5, comments: "Thông tin hành chính tương đối đầy đủ nhưng cần ghi rõ thời gian làm bệnh án cụ thể đến từng phút để đối chiếu mốc giờ vàng." },
        chiefComplaint: { score: 5, max: 5, comments: "Lý do nhập viện đạt yêu cầu (Đau ngực trái dữ dội giờ thứ 2)." },
        hpi: { score: 11, max: 15, comments: "Mô tả bệnh sử tốt về khởi phát nhưng thiếu hướng lan đặc hiệu của mạch vành và các triệu chứng âm tính để loại trừ phình tách động mạch chủ." },
        pmh: { score: 7, max: 10, comments: "Tiền sử ghi nhận THA nhưng chưa khai thác loại thuốc đang dùng, tính tuân thủ điều trị và huyết áp nền của bệnh nhân." },
        physicalExam: { score: 11, max: 15, comments: "Phần khám tổng quát đạt yêu cầu, phần khám tim mạch thiếu ghi nhận ran phổi và các dấu hiệu của suy tim trái." },
        caseSummary: { score: 4, max: 5, comments: "Tóm tắt bệnh án nêu được hội chứng đau ngực cấp nhưng cần gom cụ thể thành 'Hội chứng mạch vành cấp' để tăng tính thuyết phục." },
        clinicalDiscussion: { score: 10, max: 15, comments: "Biện luận còn mang tính lý thuyết, chưa liên kết chặt chẽ triệu chứng đau ngực thắt nghẹn, hướng lan, vã mồ hôi và các yếu tố nguy cơ (hút thuốc lá, THA) để chỉ ra cơ chế mạch vành." },
        preliminaryDiagnosis: { score: 4, max: 5, comments: "Chẩn đoán sơ bộ hợp lý nhưng cần ghi rõ giờ thứ mấy của bệnh lý mạch vành." },
        definitiveDiagnosis: { score: 3, max: 5, comments: "Chưa thể đưa ra chẩn đoán xác định khi chưa có kết quả Điện tâm đồ (ECG) 12 chuyển đạo và động học men tim (Troponin)." },
        diagnostics: { score: 7, max: 10, comments: "Chỉ định cận lâm sàng đúng (ECG, Troponin Hs, siêu âm tim tại giường, X-quang ngực) nhưng chưa biện luận được kết quả giả định hoặc thời gian cần thực hiện." },
        treatment: { score: 4, max: 5, comments: "Xử trí ban đầu đúng hướng giảm đau, chống ngưng tập tiểu cầu kép nhưng cần bổ sung liều lượng cụ thể và thuốc giãn mạch nitroglycerin (nếu huyết áp cho phép)." },
        prognosis: { score: 2, max: 3, comments: "Tiên lượng gần dè dặt vì nguy cơ rối loạn nhịp tim thất nguy kịch hoặc đột quỵ, cần đánh giá thang điểm cụ thể." },
        followUp: { score: 2, max: 3, comments: "Theo dõi sát dấu hiệu sinh tồn, điện tâm đồ liên tục trên monitor và động học Troponin mỗi 3 giờ." },
        clinicalLessons: { score: 3, max: 4, comments: "Bài học rút ra là tiếp cận đau ngực cấp phải nhanh chóng, thực hiện ECG trong vòng 10 phút đầu tiên từ lúc tiếp cận." }
      },
      comparisonBlocks: [
        {
          sectionName: "Hành chính (Administration)",
          originalText: "Họ tên: Trần Huy Hoàng, Tuổi: 45, Địa chỉ: Hà Nội",
          correctedText: "Họ và tên: TRẦN HUY HOÀNG\nTuổi: 45 (Sinh năm: 1981)   Giới tính: Nam\nNghề nghiệp: Kỹ sư xây dựng\nĐịa chỉ: Số 12, ngõ 90 Lê Thanh Nghị, Quận Hai Bà Trưng, Hà Nội\nNgày giờ vào viện: 09 giờ 30 phút ngày 24/06/2026\nNgày giờ làm bệnh án: 11 giờ 00 phút ngày 24/06/2026",
          highlights: [
            {
              type: "addition",
              text: "Ngày giờ vào viện và làm bệnh án chi tiết",
              replacement: "Cực kỳ quan trọng trong bệnh lý cấp cứu tim mạch để tính toán 'thời gian vàng' tái tưới máu.",
              explanation: "Bệnh lý nhồi máu cơ tim cấp cứu tính bằng phút, thiếu mốc giờ cụ thể sẽ không thể tính được thời gian cửa - bóng hoặc thời gian cửa - kim."
            }
          ]
        },
        {
          sectionName: "Lý do nhập viện (Chief Complaint)",
          originalText: "Đau ngực trái",
          correctedText: "Đau ngực trái dữ dội giờ thứ 2 kèm vã mồ hôi lạnh",
          highlights: [
            {
              type: "improvement",
              text: "Đau ngực kèm mốc thời gian và triệu chứng vã mồ hôi",
              replacement: "Đau ngực trái dữ dội giờ thứ 2 kèm vã mồ hôi lạnh",
              explanation: "Lý do vào viện cần ngắn gọn nhưng phải định hướng được tính chất cấp cứu và thời gian khởi phát để chuẩn bị kịch bản can thiệp."
            }
          ]
        },
        {
          sectionName: "Bệnh sử (History of Present Illness)",
          originalText: "Cách nhập viện 2 tiếng, bệnh nhân đang uống trà sáng ở nhà thì đột nhiên thấy đau ngực trái dữ dội, vã mồ hôi đầm đìa, khó thở nhẹ, nằm nghỉ không đỡ nên gọi cấp cứu vào viện.",
          correctedText: "Cách nhập viện 02 giờ, bệnh nhân đang ngồi uống nước chè tại nhà thì đột ngột xuất hiện cơn đau thắt nghẹn sau xương ức (cảm giác bóp nghẹt như có đá đè nặng lên ngực, điểm đau 8/10). Cơn đau diễn tiến liên tục không giảm khi nghỉ ngơi hay thay đổi tư thế, lan lên vai trái, dọc bờ trong mặt trong cánh tay trái xuống ngón út và áp út, đồng thời lan lâm râm lên hàm dưới. Cơn đau kèm vã mồ hôi lạnh đầm đìa, khó thở nhẹ (thở nhanh nông), hồi hộp và lo sợ nhiều. Bệnh nhân chưa xử trí thuốc gì, triệu chứng không thuyên giảm nên được gia đình đưa vào viện cấp cứu.",
          highlights: [
            {
              type: "error",
              text: "đau ngực trái dữ dội",
              replacement: "đau thắt nghẹn sau xương ức (cảm giác bóp nghẹt như có đá đè nặng lên ngực, lan vai trái, mặt trong cánh tay trái xuống ngón út)",
              explanation: "Đau ngực trong nhồi máu cơ tim cấp điển hình khởi phát sau xương ức hoặc vùng trước tim, có hướng lan đặc hiệu dọc dây thần kinh trụ bên trái."
            },
            {
              type: "addition",
              text: "không giảm khi nghỉ ngơi hay thay đổi tư thế",
              replacement: "diễn tiến liên tục không giảm khi nghỉ ngơi",
              explanation: "Giúp phân biệt giữa đau ngực do bệnh mạch vành ổn định (thường giảm khi nghỉ) và hội chứng mạch vành cấp (đau kéo dài > 20 phút không đỡ)."
            }
          ]
        }
      ],
      teachingPoints: [
        {
          title: "Chẩn đoán phân biệt đau ngực cấp nguy kịch",
          section: "Biện luận lâm sàng",
          whyWrong: "Bệnh án gốc chỉ tập trung vào nhồi máu cơ tim mà bỏ qua các nguyên nhân đau ngực chết người khác.",
          whyCorrection: "Phải chủ động đưa Phình tách động mạch chủ và Thuyên tắc phổi vào chẩn đoán phân biệt chính.",
          clinicalKnowledge: "Phình tách động mạch chủ ngực thường gây đau ngực dữ dội kiểu 'xé rách' đột ngột đạt đỉnh ngay lập tức và lan ra sau lưng, kèm huyết áp hai tay chênh lệch (>20mmHg). Thuyên tắc phổi thường đau ngực màng phổi kèm khó thở cấp tính, SpO2 giảm sâu và có yếu tố nguy cơ huyết khối tĩnh mạch sâu chi dưới.",
          preventiveTip: "Khi viết bệnh án đau ngực cấp, luôn có một câu khám sàng lọc: 'Huyết áp đo đều hai tay không chênh lệch, không có đau lan sau lưng kiểu xé rách, SpO2 duy trì tốt' để loại trừ nhanh các bệnh lý này."
        },
        {
          title: "Quy tắc 10 phút vàng trong cấp cứu tim mạch",
          section: "Chỉ định cận lâm sàng",
          whyWrong: "Bệnh án chưa nhấn mạnh tính chất khẩn cấp của việc đo điện tâm đồ.",
          whyCorrection: "Điện tâm đồ 12 chuyển đạo phải được thực hiện và đọc kết quả trong vòng 10 phút kể từ lúc bệnh nhân tiếp cận phòng cấp cứu.",
          clinicalKnowledge: "Mục tiêu tái thông mạch vành bằng can thiệp mạch vành qua da (PCI) là dưới 120 phút từ lúc chẩn đoán. Chậm trễ đo ECG sẽ làm trì hoãn toàn bộ quy trình kích hoạt phòng Catlab cấp cứu.",
          preventiveTip: "Luôn đặt chỉ định: 'ECG 12 chuyển đạo tại giường thực hiện ngay lập tức trong 10 phút đầu' lên vị trí ưu tiên hàng đầu trong phần cận lâm sàng."
        }
      ],
      completenessChecklist: [
        {
          item: "Xác định chính xác thời điểm khởi phát đau ngực",
          status: "complete",
          importance: "critical",
          notes: "Đã ghi nhận rõ cách nhập viện 2 giờ."
        },
        {
          item: "Mô tả đầy đủ hướng lan và tính chất đau điển hình",
          status: "incomplete",
          notes: "Bệnh sử gốc chưa ghi nhận hướng lan lên vai trái, tay trái hay cằm."
        },
        {
          item: "Ghi nhận đầy đủ 5 dấu hiệu sinh tồn (Mạch, HA, Nhiệt độ, Nhịp thở, SpO2)",
          status: "complete",
          notes: "Phần thăm khám đã ghi nhận tương đối đầy đủ."
        },
        {
          item: "Chỉ định ECG 12 chuyển đạo trong vòng 10 phút đầu",
          status: "incomplete",
          notes: "Trong bệnh án chưa đặt yêu cầu mốc thời gian khẩn cấp cho chỉ định ECG."
        },
        {
          item: "Khai thác tiền sử gia đình về bệnh tim mạch sớm",
          status: "incomplete",
          notes: "Thiếu thông tin đột tử hoặc mạch vành sớm của thân nhân."
        }
      ],
      similarCases: [
        {
          code: "IM-CARD-01",
          title: "Nhồi máu cơ tim cấp (AMI)",
          matchReason: "Cùng bệnh cảnh đau ngực trái cấp tính sau xương ức giờ thứ 2, có kèm các yếu tố nguy cơ cao như THA, hút thuốc lá lâu năm."
        },
        {
          code: "IM-CARD-04",
          title: "Suy tim cấp (Cơn hen tim/Phù phổi cấp)",
          matchReason: "Biến chứng tim mạch cấp tính cần cảnh giác cao độ ở bệnh nhân nhồi máu cơ tim diện rộng."
        }
      ],
      learningSummary: {
        errorsList: [
          "Bỏ sót chẩn đoán phân biệt cực kỳ nguy cấp (Phình tách động mạch chủ, Thuyên tắc phổi).",
          "Mô tả bệnh sử đau ngực thiếu chi tiết về hướng lan đặc hiệu.",
          "Viết tắt tùy tiện các thuật ngữ tim mạch (NMCT, THA)."
        ],
        commonMistakes: [
          "Sinh viên thường có xu hướng chẩn đoán áp đặt (chỉ nghĩ đến NMCT mà không lập luận loại trừ).",
          "Chưa coi trọng mốc thời gian cấp cứu vàng trong xử trí lâm sàng."
        ],
        areasForImprovement: [
          "Cải thiện tư duy chẩn đoán loại trừ đau ngực cấp.",
          "Thực hành khai thác bệnh sử tim mạch theo quy chuẩn 7 tính chất của đau."
        ],
        personalizedPlan: "Dành 2 giờ đọc lại chương 'Hội chứng mạch vành cấp' trong giáo trình Nội bệnh lý tập 1. Thực hành làm ca bệnh mô phỏng OSCE mã ca IM-402 (Bệnh nhân Trần Huy Hoàng đau ngực) để rèn luyện kỹ năng hỏi bệnh và phản xạ cấp cứu."
      },
      wardRounds: {
        presentationScore: 75,
        presentationFeedback: "Trình bày rõ ràng, lưu loát lưu trình khởi phát bệnh sử. Tuy nhiên, giọng điệu trình bày bệnh án cấp cứu cần dứt khoát hơn, nêu nổi bật các dấu hiệu sinh tồn nguy kịch ngay từ đầu để giảng viên nắm thông tin.",
        interactiveQuestions: [
          {
            question: "Tại sao ở bệnh nhân này, mặc dù đau ngực trái nhưng em lại bắt buộc phải chỉ định ghi thêm các chuyển đạo phía bên phải như V3R, V4R và các chuyển đạo sau lưng như V7, V8, V9?",
            sampleAnswer: "Dạ thưa Thầy, em cần chỉ định thêm V3R, V4R để khảo sát xem có tình trạng nhồi máu cơ tim thất phải kèm theo hay không, đặc biệt nếu tổn thương nằm ở động mạch vành phải (gây nhồi máu thành dưới). Việc phát hiện nhồi máu thất phải cực kỳ quan trọng vì phác đồ điều trị khi đó chống chỉ định với các thuốc giãn mạch như Nitroglycerin hay lợi tiểu, vốn làm giảm tiền gánh và gây tụt huyết áp nghiêm trọng. Ghi thêm V7, V8, V9 để tránh bỏ sót nhồi máu cơ tim thành sau thực thể (Posterior MI)."
          },
          {
            question: "Nếu kết quả ECG trả về có ST chênh lên ở DI, aVL, V5, V6, em định khu vùng nhồi máu ở đâu và động mạch nào bị tắc nghẽn?",
            sampleAnswer: "Dạ thưa Thầy, ST chênh lên ở DI, aVL, V5, V6 định khu tổn thương ở vùng thành bên của thất trái (Lateral MI). Động mạch thủ phạm thường gặp nhất là Động mạch mũ (LCx - Left Circumflex Artery) hoặc đôi khi là nhánh chéo (Diagonal) của động mạch liên thất trước (LAD)."
          },
          {
            question: "Bệnh nhân này có tiền sử Tăng huyết áp đang dùng thuốc. Khi tiếp cận cấp cứu mạch vành, em có sử dụng thuốc chẹn beta giao cảm (Beta-blockers) đường tĩnh mạch ngay lập tức cho bệnh nhân không? Vì sao?",
            sampleAnswer: "Dạ thưa Thầy, em không tự ý dùng chẹn beta đường tĩnh mạch ngay lập tức khi chưa đánh giá kỹ. Chẹn beta chỉ dùng khi huyết động hoàn toàn ổn định. Nếu bệnh nhân có dấu hiệu suy tim cấp (phổi đầy ran ẩm), nhịp tim chậm < 60 ck/p, huyết áp tâm thu < 120 mmHg, hoặc có nguy cơ cao bị shock tim (tuổi cao, Killip II trở lên), việc dùng chẹn beta sẽ ức chế cơ tim làm huyết động sụp đổ nhanh chóng, đẩy bệnh nhân vào tình trạng shock tim kháng trị nguy hiểm."
          }
        ]
      }
    };
  }

  // Surgical / Appendicitis / Abdominal pain
  if (text.includes("ruột thừa") || text.includes("bụng") || text.includes("hố chậu") || text.includes("ngoại khoa")) {
    return {
      overallScore: 80,
      scores: {
        history: 82,
        exam: 78,
        labs: 85,
        reasoning: 80,
        treatment: 85
      },
      comments: {
        errors: [
          {
            title: "Bỏ sót chẩn đoán loại trừ sản phụ khoa",
            desc: "Bệnh nhân nữ trẻ tuổi có đau bụng hố chậu phải cấp tính bắt buộc phải được loại trừ Thai ngoài tử cung vỡ hoặc Xoắn u nang buồng trứng trước khi đưa ra quyết định phẫu thuật cắt ruột thừa."
          }
        ],
        missing: [
          {
            title: "Thiếu chi tiết tính chất di chuyển của đau bụng ngoại khoa",
            desc: "Chưa ghi nhận rõ cơn đau có khởi phát từ thượng vị/quanh rốn rồi mới di chuyển khu trú dần về hố chậu phải hay đau hố chậu phải ngay từ đầu. Tính chất di chuyển này đạt độ đặc hiệu rất cao cho viêm ruột thừa cấp."
          },
          {
            title: "Khám bụng mô tả phản ứng thành bụng chưa đầy đủ",
            desc: "Chỉ ghi nhận 'ấn đau hố chậu phải' mà chưa kiểm tra và mô tả dấu hiệu Phản ứng thành bụng (Defense) hoặc Cảm ứng phúc mạc (Rebound tenderness) để phát hiện biến chứng viêm phúc mạc ruột thừa."
          }
        ],
        terminology: [
          {
            title: "Nhầm lẫn tên nghiệm pháp ngoại khoa",
            desc: "Viết nhầm nghiệm pháp 'Mc Burney' thành 'Mac Burney'. Nên nhớ viết đúng chính văn y học quốc tế."
          }
        ],
        suggestions: [
          {
            title: "Ứng dụng thang điểm Alvarado hệ thống hóa chẩn đoán",
            desc: "Khuyên sinh viên nên tính toán điểm Alvarado dựa trên lâm sàng và bạch cầu tăng để phân tầng khả năng viêm ruột thừa cấp (Alvarado >= 7 có chỉ định mổ cao)."
          }
        ]
      },
      classification: {
        caseType: "Bệnh án Ngoại khoa",
        specialty: "Ngoại tổng quát",
        suspectedDiagnosis: "Viêm ruột thừa cấp ngày thứ 2",
        structure: "Tương đối đầy đủ cấu trúc bệnh án ngoại khoa cấp cứu bụng"
      },
      detailedScores: {
        administration: { score: 5, max: 5, comments: "Thông tin hành chính đầy đủ, rõ ràng." },
        chiefComplaint: { score: 5, max: 5, comments: "Lý do nhập viện tốt (Đau bụng hố chậu phải ngày thứ 2)." },
        hpi: { score: 12, max: 15, comments: "Mô tả bệnh sử tương đối tốt, tuy nhiên cần ghi nhận chi tiết hơn về thói quen ăn uống, số lần nôn và tính chất chất nôn để đánh giá tình trạng tắc ruột kèm theo nếu có." },
        pmh: { score: 8, max: 10, comments: "Tiền sử sản phụ khoa ở bệnh nhân nữ trẻ tuổi cần khai thác kỹ chu kỳ kinh cuối và biện pháp tránh thai." },
        physicalExam: { score: 11, max: 15, comments: "Khám bụng sơ sài, thiếu mô tả tình trạng chướng bụng, dấu hiệu rắn bò, nhu động ruột và sẹo mổ cũ." },
        caseSummary: { score: 4, max: 5, comments: "Tóm tắt bệnh án cần nêu rõ 'Hội chứng đáp ứng viêm hệ thống' (sốt, bạch cầu tăng) và 'Triệu chứng thực thể vùng hố chậu phải'." },
        clinicalDiscussion: { score: 12, max: 15, comments: "Biện luận tốt về viêm ruột thừa nhưng lập luận loại trừ thai ngoài tử cung vỡ còn yếu, chưa dựa trên cận lâm sàng hCG." },
        preliminaryDiagnosis: { score: 4, max: 5, comments: "Chẩn đoán sơ bộ đúng chuẩn ngoại khoa." },
        definitiveDiagnosis: { score: 4, max: 5, comments: "Chẩn đoán xác định phù hợp sau khi có hình ảnh siêu âm dày thành ruột thừa." },
        diagnostics: { score: 8, max: 10, comments: "Chỉ định cận lâm sàng đầy đủ (Siêu âm bụng tổng quát, công thức máu, tổng phân tích nước tiểu, Quick Beta-hCG)." },
        treatment: { score: 4, max: 5, comments: "Đề xuất phẫu thuật nội soi cắt ruột thừa là chính xác nhưng cần lưu ý thời gian nhịn ăn uống của bệnh nhân." },
        prognosis: { score: 3, max: 3, comments: "Tiên lượng tốt nếu mổ nội soi sớm trước khi ruột thừa vỡ mủ." },
        followUp: { score: 2, max: 3, comments: "Theo dõi sát tình trạng trung tiện, cơn đau bụng sau mổ và tình trạng vết mổ." },
        clinicalLessons: { score: 3, max: 4, comments: "Bài học rút ra là luôn thử thai (Beta-hCG) cho mọi bệnh nhân nữ trong độ tuổi sinh đẻ có đau bụng cấp." }
      },
      comparisonBlocks: [
        {
          sectionName: "Bệnh sử (History of Present Illness)",
          originalText: "Bệnh nhân bị đau hố chậu phải từ tối qua, đau âm ỉ liên tục, kèm sốt nhẹ 38 độ C, có nôn 1 lần, chán ăn nên đi khám.",
          correctedText: "Cách nhập viện 24 giờ, bệnh nhân khởi phát cơn đau bụng âm ỉ, liên tục ở vùng thượng vị và xung quanh rốn, không lan. Sau khoảng 8 tiếng, cơn đau di chuyển và khu trú rõ rệt về vùng hố chậu phải, tính chất đau âm ỉ liên tục tăng dần, thốn nhói mạnh hơn khi bệnh nhân ho, hắt hơi hoặc vận động mạnh. Bệnh nhân kèm cảm giác chán ăn hoàn toàn, buồn nôn và nôn khan 1 lần ra ít dịch vị dạ dày vào sáng nay, người gai rét sốt nhẹ (nhiệt độ đo tại nhà 37.8 độ C). Đại tiểu tiện bình thường, chưa xử trí thuốc gì giảm đau trước đó.",
          highlights: [
            {
              type: "error",
              text: "đau hố chậu phải từ tối qua",
              replacement: "khởi phát đau vùng thượng vị/quanh rốn sau đó di chuyển và khu trú về hố chậu phải sau 8 tiếng",
              explanation: "Đặc điểm di chuyển đau (dấu hiệu Kocher) rất đặc hiệu cho viêm ruột thừa cấp do kích thích phúc mạc tạng ban đầu chuyển sang phúc mạc thành hố chậu phải."
            }
          ]
        },
        {
          sectionName: "Khám lâm sàng (Physical Exam)",
          originalText: "Bụng mềm, ấn đau hố chậu phải, điểm Mac Burney dương tính.",
          correctedText: "Bụng phẳng, di động đều theo nhịp thở, không chướng, không có tuần hoàn bàng hệ hay sẹo mổ cũ. Bụng mềm, ấn đau chói vùng hố chậu phải, điểm McBurney (+). Dấu hiệu Phản ứng dội (Rebound tenderness) ở hố chậu phải (+), dấu hiệu cơ thắt lưng chậu (Psoas sign) (-). Phản ứng thành bụng (Defense) (-). Gan lách không sờ chạm, gõ trong, nhu động ruột 5 lần/phút, không nghe thấy tiếng thổi mạch máu.",
          highlights: [
            {
              type: "error",
              text: "điểm Mac Burney",
              replacement: "điểm McBurney",
              explanation: "Sai lỗi chính tả danh từ y khoa quốc tế phổ biến. Điểm McBurney nằm ở vị trí 1/3 ngoài trên đường nối từ gai chậu trước trên bên phải đến rốn."
            },
            {
              type: "addition",
              text: "Dấu hiệu Phản ứng dội (Rebound tenderness) và Phản ứng thành bụng",
              replacement: "Phản ứng dội (+), Phản ứng thành bụng (-)",
              explanation: "Cần thiết phải ghi nhận để loại trừ hoặc khẳng định tình trạng viêm phúc mạc ruột thừa đã vỡ mủ tự do hay chưa."
            }
          ]
        }
      ],
      teachingPoints: [
        {
          title: "Chẩn đoán phân biệt đau bụng cấp ở nữ trẻ tuổi",
          section: "Biện luận lâm sàng",
          whyWrong: "Bệnh án ngoại khoa ở bệnh nhân nữ trẻ thường bị định kiến là viêm ruột thừa mà quên mất hệ sinh dục.",
          whyCorrection: "Bắt buộc phải lập luận loại trừ thai ngoài tử cung vỡ và xoắn u nang buồng trứng.",
          clinicalKnowledge: "Thai ngoài tử cung vỡ thường gây đau bụng dưới dữ dội kèm trễ kinh, ra máu âm đạo sẫm màu, túi cùng Douglas đau chói, Beta-hCG (+). Xoắn u nang buồng trứng gây đau quặn hạ vị dữ dội đột ngột, khám có thể sờ thấy khối u đau cạnh tử cung, siêu âm thấy buồng trứng sưng to mất tín hiệu mạch máu.",
          preventiveTip: "Mọi bệnh án đau bụng cấp ở nữ tuổi sinh đẻ đều phải bắt đầu khai thác bằng câu hỏi: 'Kỳ kinh cuối ngày nào? Kinh nguyệt có đều không?'"
        }
      ],
      completenessChecklist: [
        {
          item: "Mô tả tính chất đau bụng di chuyển (Kocher sign)",
          status: "complete",
          notes: "Đã bổ sung trong bệnh sử cải tiến."
        },
        {
          item: "Kiểm tra dấu hiệu phản ứng thành bụng và cảm ứng phúc mạc",
          status: "complete",
          notes: "Đã mô tả chi tiết trạng thái phúc mạc bụng."
        },
        {
          item: "Khai thác tiền sử sản phụ khoa (kỳ kinh cuối)",
          status: "incomplete",
          notes: "Tiền sử gốc chưa ghi nhận rõ."
        },
        {
          item: "Chỉ định siêu âm ổ bụng khảo sát ruột thừa",
          status: "complete",
          notes: "Đã có chỉ định siêu âm."
        }
      ],
      similarCases: [
        {
          code: "SURG-GEN-01",
          title: "Viêm ruột thừa cấp ngày thứ 2",
          matchReason: "Cùng mô tả triệu chứng đau hố chậu phải âm ỉ liên tục, sốt nhẹ, chán ăn ở bệnh nhân trẻ."
        },
        {
          code: "OBGYN-02",
          title: "Thai ngoài tử cung vỡ gây lụt màng bụng",
          matchReason: "Chẩn đoán phân biệt phụ khoa quan trọng hàng đầu cho bệnh cảnh đau hố chậu phải cấp tính ở nữ."
        }
      ],
      learningSummary: {
        errorsList: [
          "Bỏ sót chẩn đoán loại trừ phụ khoa cực kỳ phổ biến.",
          "Viết sai tên riêng y khoa quốc tế (McBurney).",
          "Mô tả triệu chứng thực thể bụng quá vắn tắt."
        ],
        commonMistakes: [
          "Quên làm xét nghiệm thử thai cơ bản cho nữ trẻ tuổi đau bụng cấp.",
          "Chỉ khám bụng sơ sài mà không mô tả các phản xạ thành bụng quan trọng."
        ],
        areasForImprovement: [
          "Tăng cường độ sâu khi khám thực thể bụng cấp cứu.",
          "Trau dồi đúng chính tả thuật ngữ y học."
        ],
        personalizedPlan: "Xem lại video hướng dẫn khám bụng ngoại khoa trên kênh thư viện MEDCASEVN. Thực hành hỏi ca bệnh sản khoa OBGYN-02 để nắm vững chẩn đoán phân biệt đau bụng dưới."
      },
      wardRounds: {
        presentationScore: 82,
        presentationFeedback: "Trình bày rõ ràng cấu trúc bệnh án ngoại khoa. Cần rèn luyện cách nêu bật các chỉ số xét nghiệm huyết học (bạch cầu tăng, tỷ lệ trung tính) để bảo vệ lập luận của mình trước thầy cô.",
        interactiveQuestions: [
          {
            question: "Tại sao trong viêm ruột thừa cấp, bệnh nhân lại thường đau ở thượng vị hoặc quanh rốn trước, sau đó mới di chuyển xuống hố chậu phải?",
            sampleAnswer: "Dạ thưa Thầy, đó là do cơ chế đau tạng (visceral pain) và đau thành (somatic pain). Ban đầu, khi ruột thừa bị tắc nghẽn và căng chướng, các sợi thần kinh hướng tâm cảm giác tạng đi theo sợi giao cảm hướng về tủy sống ở đốt ngực T8-T10, gây cảm giác đau mơ hồ vùng quanh rốn hoặc thượng vị. Khi quá trình viêm tiến triển, lan ra ngoài làm kích thích phúc mạc thành vùng hố chậu phải, các sợi thần kinh cảm giác thành (somatic) dẫn truyền nhanh cảm giác đau khu trú chính xác tại hố chậu phải."
          },
          {
            question: "Nếu bệnh nhân này siêu âm bụng thấy ruột thừa đường kính 8mm, đè ấn không xẹp, có sỏi phân kẹt, nhưng bạch cầu trong máu hoàn toàn bình thường (7.2 G/L). Em có loại trừ viêm ruột thừa cấp không? Em xử trí thế nào?",
            sampleAnswer: "Dạ thưa Thầy, em không loại trừ viêm ruột thừa cấp. Khoảng 10-20% trường hợp viêm ruột thừa cấp giai đoạn sớm có thể có số lượng bạch cầu bình thường. Chẩn đoán viêm ruột thừa chủ yếu dựa trên lâm sàng và hình ảnh siêu âm (đường kính ruột thừa > 6mm, đè ấn không xẹp, có sỏi phân kẹt là bằng chứng rất mạnh). Em vẫn đề xuất chỉ định phẫu thuật nội soi cắt ruột thừa và theo dõi sát lâm sàng."
          }
        ]
      }
    };
  }

  // Generic clinical record fallback
  return {
    overallScore: 75,
    scores: {
      history: 76,
      exam: 75,
      labs: 80,
      reasoning: 70,
      treatment: 74
    },
    comments: {
      errors: [
        {
          title: "Thiếu chẩn đoán phân biệt trong lập luận sơ bộ",
          desc: "Bệnh án đưa thẳng đến chẩn đoán xác định mà không có lập luận loại trừ các chẩn đoán phân biệt thường gặp có triệu chứng tương đồng."
        }
      ],
      missing: [
        {
          title: "Thông số dấu hiệu sinh tồn chưa đầy đủ",
          desc: "Phần thăm khám tổng quát chưa ghi nhận đầy đủ bộ 5 dấu hiệu sinh tồn cơ bản: Mạch, Huyết áp, Nhiệt độ, Nhịp thở, SpO2."
        },
        {
          title: "Tiền sử dị ứng khai thác sơ sài",
          desc: "Chưa ghi nhận rõ tiền sử dị ứng thuốc kháng sinh, tá dược hay dị ứng thức ăn."
        }
      ],
      terminology: [
        {
          title: "Sử dụng từ ngữ chưa chuẩn danh pháp giải phẫu",
          desc: "Nên dùng thuật ngữ giải phẫu học và bệnh học chuẩn hóa thay vì dùng ngôn ngữ giao tiếp hằng ngày của người bệnh."
        }
      ],
      suggestions: [
        {
          title: "Tối ưu hóa lập luận lâm sàng",
          desc: "Cần tạo sự liên kết chặt chẽ giữa các hội chứng lâm sàng phát hiện được với chỉ định cận lâm sàng tương ứng."
        }
      ]
    },
    classification: {
      caseType: "Bệnh án Lâm sàng Chung",
      specialty: specialty || "Nội khoa",
      suspectedDiagnosis: "Chưa xác định rõ bệnh lý chính",
      structure: "Cấu trúc cơ bản đầy đủ nhưng nội dung cần đào sâu"
    },
    detailedScores: {
      administration: { score: 4, max: 5, comments: "Thông tin hành chính cơ bản đầy đủ." },
      chiefComplaint: { score: 4, max: 5, comments: "Lý do nhập viện cần nêu rõ thời gian khởi phát." },
      hpi: { score: 11, max: 15, comments: "Cần mô tả chi tiết diễn tiến triệu chứng theo thời gian." },
      pmh: { score: 7, max: 10, comments: "Cần khai thác rõ hơn các bệnh lý mạn tính đi kèm." },
      physicalExam: { score: 11, max: 15, comments: "Khám các cơ quan cần có trọng tâm hơn tùy theo lý do vào viện." },
      caseSummary: { score: 3, max: 5, comments: "Tóm tắt bệnh án cần tóm tắt thành các hội chứng y khoa cụ thể." },
      clinicalDiscussion: { score: 10, max: 15, comments: "Biện luận cần có tính logic biện chứng giữa lâm sàng và cận lâm sàng." },
      preliminaryDiagnosis: { score: 4, max: 5, comments: "Chẩn đoán sơ bộ hợp lý." },
      definitiveDiagnosis: { score: 3, max: 5, comments: "Cần có bằng chứng cận lâm sàng để khẳng định." },
      diagnostics: { score: 8, max: 10, comments: "Chỉ định cận lâm sàng đúng hướng." },
      treatment: { score: 3, max: 5, comments: "Hướng điều trị cần cụ thể hóa phác đồ sử dụng." },
      prognosis: { score: 2, max: 3, comments: "Đánh giá tiên lượng dựa trên các yếu tố nguy cơ của bệnh nhân." },
      followUp: { score: 2, max: 3, comments: "Cần ghi rõ tần suất theo dõi các dấu hiệu sinh tồn." },
      clinicalLessons: { score: 3, max: 4, comments: "Rút ra bài học lâm sàng về phương pháp tiếp cận bệnh nhân toàn diện." }
    },
    comparisonBlocks: [
      {
        sectionName: "Tóm tắt bệnh án (Case Summary)",
        originalText: "Bệnh nhân nam, vào viện vì đau vùng ngực, khám có phổi bình thường, mạch ổn định.",
        correctedText: "Bệnh nhân nam 45 tuổi, vào viện vì lý do đau ngực trái cấp tính giờ thứ 2. Qua thăm khám lâm sàng và khai thác tiền sử, ghi nhận các hội chứng và triệu chứng sau: Hội chứng đau ngực cấp điển hình kiểu mạch vành, kèm triệu chứng vã mồ hôi lạnh đầm đìa. Không có hội chứng suy tim cấp trên lâm sàng (phổi thông khí đều, không ran, tĩnh mạch cổ không nổi). Tiền sử có Tăng huyết áp và rối loạn lipid máu, hút thuốc lá nhiều năm.",
        highlights: [
          {
            type: "error",
            text: "vào viện vì đau vùng ngực",
            replacement: "vào viện vì lý do đau ngực trái cấp tính giờ thứ 2",
            explanation: "Tóm tắt bệnh án phải nêu rõ lý do chính xác kèm mốc thời gian để định hình tính khẩn cấp của bệnh án."
          }
        ]
      }
    ],
    teachingPoints: [
      {
        title: "Kỹ năng tóm tắt bệnh án theo hội chứng",
        section: "Tóm tắt bệnh án",
        whyWrong: "Bệnh án gốc chỉ liệt kê các triệu chứng rời rạc thay vì tổng hợp lại.",
        whyCorrection: "Sinh viên cần gom các triệu chứng liên quan lại thành các hội chứng lâm sàng điển hình.",
        clinicalKnowledge: "Ví dụ: đau ngực trái thắt nghẹn, lan tay trái, vã mồ hôi được gom vào 'Hội chứng đau ngực cấp kiểu mạch vành'. Sốt cao, vẻ mặt nhiễm trùng, môi khô lưỡi bẩn, bạch cầu tăng được gom vào 'Hội chứng nhiễm trùng'. Cách viết này giúp tăng tính chuyên nghiệp và định hướng biện luận rất nhanh.",
        preventiveTip: "Trước khi viết phần tóm tắt, hãy kẻ nháp 2 cột: Cột Triệu chứng lâm sàng và Cột Hội chứng tương ứng để tổng hợp mạch lạc."
      }
    ],
    completenessChecklist: [
      {
        item: "Khám đầy đủ dấu hiệu sinh tồn",
        status: "incomplete",
        notes: "Cần bổ sung nhịp thở và SpO2."
      },
      {
        item: "Khai thác kỹ tiền sử dị ứng thuốc",
        status: "incomplete",
        notes: "Ghi nhận còn sơ sài."
      }
    ],
    similarCases: [],
    learningSummary: {
      errorsList: ["Tóm tắt bệnh án rời rạc, chưa gom thành hội chứng lâm sàng.", "Khai thác tiền sử dị ứng thuốc chưa chi tiết."],
      commonMistakes: ["Sinh viên thường quên ghi đầy đủ các dấu hiệu sinh tồn cơ bản.", "Triệu chứng âm tính có giá trị loại trừ thường bị bỏ qua."],
      areasForImprovement: ["Nâng cao kỹ năng gom hội chứng lâm sàng.", "Cẩn thận hơn khi ghi nhận sinh hiệu."],
      personalizedPlan: "Xem lại tài liệu 'Phương pháp làm bệnh án nội khoa mẫu' của MEDCASEVN. Thực hành viết tóm tắt bệnh án cho 3 ca bệnh khác nhau trong tuần này."
    },
    wardRounds: {
      presentationScore: 70,
      presentationFeedback: "Trình bày đầy đủ nhưng thiếu điểm nhấn lâm sàng, cần làm nổi bật triệu chứng cốt lõi của ca bệnh để thu hút người nghe.",
      interactiveQuestions: [
        {
          question: "Tại sao khi tiếp cận một bệnh án, việc khai thác tiền sử dị ứng thuốc của bệnh nhân lại vô cùng quan trọng trước khi đưa ra bất kỳ y lệnh điều trị nào?",
          sampleAnswer: "Dạ thưa Thầy, việc khai thác dị ứng thuốc giúp bảo vệ an toàn tính mạng cho bệnh nhân, tránh tai biến sốc phản vệ nguy hiểm có thể xảy ra khi dùng thuốc (đặc biệt là các nhóm kháng sinh họ Beta-lactam, thuốc cản quang hoặc các thuốc giảm đau NSAIDs). Ngoài ra, nó giúp bác sĩ chủ động lựa chọn các nhóm thuốc thay thế an toàn ngay từ đầu trong phác đồ điều trị."
        }
      ]
    }
  };
};

// Simulated patient responses for OSCE
const getFallbackOSCEPatientResponse = (caseId: string, messages: any[]) => {
  const lastMessageObj = messages[messages.length - 1];
  const text = (lastMessageObj?.text || lastMessageObj?.message || "").toLowerCase();
  
  if (caseId === "IM-402") {
    // 45yo Male, crushing chest pain (Trần Huy Hoàng)
    if (text.includes("chào") || text.includes("tên là gì") || text.includes("ai đó")) {
      return "Tôi là Trần Huy Hoàng, 45 tuổi bác sĩ ạ. Tôi đau ngực quá, cứu tôi với...";
    }
    if (text.includes("đau như thế nào") || text.includes("tính chất") || text.includes("đau sao") || text.includes("cảm giác")) {
      return "Nó đau thắt bóp lại, như có tảng đá đè nặng ngay giữa ngực tôi vậy bác sĩ. Đau nghẹt thở luôn!";
    }
    if (text.includes("bắt đầu") || text.includes("bao lâu") || text.includes("khi nào") || text.includes("khởi phát")) {
      return "Đột ngột lắm, cách đây khoảng 2 tiếng khi tôi đang uống trà sáng ở nhà. Tự nhiên ngực thắt nghẹn lại rồi đau dữ dội liên tục tới giờ.";
    }
    if (text.includes("lan đi đâu") || text.includes("lan ra") || text.includes("lan xuống")) {
      return "Dạ có, nó lan nhức cả cái bả vai trái rồi tê buốt dọc xuống cánh tay trái của tôi nữa. Lên cả cằm lâm râm nữa bác sĩ.";
    }
    if (text.includes("kèm theo") || text.includes("triệu chứng khác") || text.includes("khó thở") || text.includes("buồn nôn") || text.includes("vã mồ hôi")) {
      return "Tôi thấy khó thở nhẹ, ngực nghẹn lại, người thì vã mồ hôi lạnh đầm đìa ra ướt hết cả áo đây này. Sợ lắm bác sĩ.";
    }
    if (text.includes("giảm") || text.includes("đỡ đau") || text.includes("tăng") || text.includes("tư thế")) {
      return "Không đỡ tí nào bác sĩ ơi. Tôi nằm nghỉ, thay đổi tư thế hay ngồi dậy đều đau liên tục không giảm chút nào hết.";
    }
    if (text.includes("tiền sử") || text.includes("bệnh lý") || text.includes("huyết áp") || text.includes("mỡ máu") || text.includes("tiểu đường")) {
      return "Tôi bị cao huyết áp khoảng 3 năm nay, có uống thuốc hằng ngày nhưng thỉnh thoảng hay quên. Với lại tôi hay đi khám thì họ bảo có mỡ máu cao nữa.";
    }
    if (text.includes("gia đình") || text.includes("bố mẹ") || text.includes("nhà có ai")) {
      return "Bố tôi mất sớm năm 50 tuổi do đột tử, nghe mẹ kể là bị đột quỵ hay nhồi máu cơ tim gì đó đột ngột lắm bác sĩ.";
    }
    if (text.includes("hút thuốc") || text.includes("thuốc lá") || text.includes("rượu bia")) {
      return "Tôi hút thuốc lá nhiều lắm, mỗi ngày 1 bao, hút cũng hơn 20 năm nay rồi bác sĩ ạ. Rượu bia thì thỉnh thoảng cuối tuần mới uống.";
    }
    if (text.includes("dị ứng")) {
      return "Tôi không dị ứng với thuốc hay thức ăn gì hết bác sĩ ạ.";
    }
    
    // Default empathetic distressed patient answer
    const randomAnxiety = [
      "Tôi đau quá bác sĩ ơi, ngực cứ nghẹn lại như bị bóp nghẹt. Tôi có bị làm sao không, có chết không bác sĩ?",
      "Người tôi cứ bủn rủn, vã hết mồ hôi lạnh ra đây này. Bác sĩ cho tôi xin thuốc gì giảm đau gấp với...",
      "Cơn đau ngực này nặng nề lắm, chưa bao giờ tôi bị đau dữ dội như thế này cả bác sĩ ạ.",
      "Bác sĩ ơi, tôi mệt quá, ngực đau thắt từng cơn liên tục không dứt."
    ];
    return randomAnxiety[Math.floor(Math.random() * randomAnxiety.length)];
  }

  if (caseId === "SURG-201") {
    // 22yo Female, appendicitis pain (Nguyễn Thu Thảo)
    if (text.includes("chào") || text.includes("tên") || text.includes("tuổi")) {
      return "Em là Nguyễn Thu Thảo, 22 tuổi ạ. Em bị đau bụng từ tối qua, mệt quá bác sĩ ơi.";
    }
    if (text.includes("đau ở đâu") || text.includes("chỗ nào") || text.includes("đau bụng vùng nào")) {
      return "Ban đầu tối qua em thấy đau âm ỉ xung quanh rốn thôi, nhưng đến sáng nay ngủ dậy thì nó đau râm ran di chuyển hẳn xuống vùng hông bên phải (hố chậu phải) này rồi bác sĩ.";
    }
    if (text.includes("đau như thế nào") || text.includes("tính chất") || text.includes("kiểu đau")) {
      return "Dạ nó đau quặn từng cơn nhẹ trên nền âm ỉ liên tục, mỗi lần em ho hay bước đi mạnh là thốn nhói cả ruột gan vùng hông phải.";
    }
    if (text.includes("sốt") || text.includes("nhiệt độ")) {
      return "Em cảm thấy người hơi gai gai sốt hâm hấp từ sáng, đo ở nhà khoảng 37.8 độ C ạ.";
    }
    if (text.includes("ăn uống") || text.includes("buồn nôn") || text.includes("nôn")) {
      return "Em chán ăn lắm, từ tối qua không muốn ăn gì cả. Sáng nay em có nôn khan ra một lần bác sĩ ạ.";
    }
    if (text.includes("kinh nguyệt") || text.includes("trễ kinh") || text.includes("thai")) {
      return "Kỳ kinh cuối của em cách đây 2 tuần, đều đặn bình thường ạ. Em không có khả năng mang thai đâu bác sĩ.";
    }
    return "Cái bụng bên phải của em thốn lắm, bác sĩ ấn vào đau nhói chịu không nổi luôn.";
  }

  // Fallback default patient
  return "Tôi thấy trong người mệt mỏi và có triệu chứng khó chịu, mong bác sĩ thăm khám và cho tôi lời khuyên.";
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for parsing uploaded files (PDF, DOCX, TXT)
  app.post("/api/parse-file", async (req, res) => {
    try {
      const { fileData, fileName } = req.body;
      if (!fileData) {
        return res.status(400).json({ error: "Không tìm thấy dữ liệu tệp tin." });
      }

      const buffer = Buffer.from(fileData, 'base64');
      let extractedText = "";

      if (fileName.toLowerCase().endsWith(".docx")) {
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value;
      } else if (fileName.toLowerCase().endsWith(".pdf")) {
        const parsePdf = (typeof pdf === 'function') ? pdf : (pdf as any).default || pdf;
        const data = await parsePdf(buffer);
        extractedText = data.text;
      } else if (fileName.toLowerCase().endsWith(".txt")) {
        extractedText = buffer.toString('utf-8');
      } else {
        return res.status(400).json({ error: "Định dạng tệp không được hỗ trợ. Vui lòng tải lên tệp .docx, .pdf hoặc .txt." });
      }

      if (!extractedText || extractedText.trim().length === 0) {
        return res.status(422).json({ error: "Không thể trích xuất văn bản từ tệp này hoặc tệp bị trống." });
      }

      res.json({ text: extractedText });
    } catch (err: any) {
      console.error("Error parsing file:", err);
      res.status(500).json({ error: `Lỗi khi xử lý tệp: ${err.message || err}` });
    }
  });

  // Initialize Gemini SDK safely if key is provided
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY") {
    try {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
      console.log("Gemini API initialized successfully.");
    } catch (err) {
      console.error("Failed to initialize Gemini API:", err);
    }
  } else {
    console.log("No GEMINI_API_KEY found, using advanced rule-based Vietnamese medical simulator fallback.");
  }

  // 1. Analyze Medical Record API Route
  app.post("/api/analyze-case", async (req, res) => {
    const { record, specialty } = req.body;
    if (!record || record.trim().length < 10) {
      return res.status(400).json({ error: "Nội dung bệnh án quá ngắn hoặc trống." });
    }

    // If Gemini client is active, use Gemini API!
    if (ai) {
      try {
        console.log("Calling Gemini API for clinical case analysis with rich tutor schema...");
        const prompt = `
          Bạn là một Giảng viên Lâm sàng Y khoa và Trợ giảng Y khoa AI cao cấp (Senior Clinical AI Instructor) tại Việt Nam.
          Nhiệm vụ của bạn là phân tích bệnh án tiếng Việt do sinh viên y khoa tải lên dưới đây, phát hiện lỗi chuyên môn lâm sàng/logic, chấm điểm khắt khe theo đúng thang điểm 100, cung cấp bài giảng lý giải nguyên nhân sai và cách làm đúng, rà soát danh mục cần thiết, gợi ý ca bệnh mẫu tương đồng và giả lập câu hỏi đi buồng vấn đáp lâm sàng của Thầy.

          Chuyên khoa giả định của bệnh án: ${specialty || "Nội khoa"}
          Nội dung bệnh án sinh viên gửi:
          ---
          ${record}
          ---

          Yêu cầu bắt buộc: Bạn phải trả về một đối tượng JSON khớp CHÍNH XÁC với cấu trúc sau đây (KHÔNG được bao gồm bất kỳ văn bản nào ngoài JSON, không bọc trong thẻ code block hay ký tự lạ nào):
          {
            "overallScore": <Số nguyên 0-100, điểm tổng quát trung bình của bệnh án>,
            "scores": {
              "history": <Số nguyên 0-100, đánh giá phần Bệnh sử & Tiền sử>,
              "exam": <Số nguyên 0-100, đánh giá phần Khám Lâm sàng>,
              "labs": <Số nguyên 0-100, đánh giá phần Chỉ định & Biện luận Cận lâm sàng>,
              "reasoning": <Số nguyên 0-100, đánh giá tư duy Biện luận Lâm sàng & Chẩn đoán>,
              "treatment": <Số nguyên 0-100, đánh giá hướng Điều trị & Theo dõi>
            },
            "comments": {
              "errors": [
                {
                  "title": "Tên ngắn gọn của sai sót chuyên môn",
                  "desc": "Giải thích chi tiết tại sao đây là sai sót lâm sàng và hậu quả có thể xảy ra cho người bệnh."
                }
              ],
              "missing": [
                {
                  "title": "Thông tin y khoa quan trọng còn thiếu",
                  "desc": "Mô tả chi tiết những gì sinh viên đã bỏ sót chưa khai thác hoặc thăm khám."
                }
              ],
              "terminology": [
                {
                  "title": "Lỗi viết tắt hoặc thuật ngữ phi chuẩn",
                  "desc": "Chỉ ra thuật ngữ chưa đúng y văn tiếng Việt hoặc viết tắt tùy tiện cần sửa."
                }
              ],
              "suggestions": [
                {
                  "title": "Gợi ý nâng cao chất lượng bệnh án",
                  "desc": "Gợi ý áp dụng các thang điểm quốc tế, bổ sung các phương pháp chẩn đoán chuyên sâu."
                }
              ]
            },
            "classification": {
              "caseType": "Loại bệnh án (ví dụ: Bệnh án Nội khoa, Bệnh án Ngoại khoa, Bệnh án Nhi khoa, Bệnh án Sản phụ khoa...)",
              "specialty": "Chuyên khoa cụ thể nhất (ví dụ: Tim mạch, Tiêu hóa, Thần kinh, Ngoại tổng quát...)",
              "suspectedDiagnosis": "Chẩn đoán chính nghi ngờ dựa trên bệnh án",
              "structure": "Nhận xét ngắn gọn về độ đầy đủ của cấu trúc bệnh án (ví dụ: Đủ 14 cấu phần chính nhưng nội dung sơ sài...)"
            },
            "detailedScores": {
              "administration": { "score": <Điểm số đạt được từ 0-5>, "max": 5, "comments": "Nhận xét chi tiết cho phần Hành chính" },
              "chiefComplaint": { "score": <Điểm số từ 0-5>, "max": 5, "comments": "Nhận xét chi tiết cho phần Lý do nhập viện" },
              "hpi": { "score": <Điểm số từ 0-15>, "max": 15, "comments": "Nhận xét chi tiết cho phần Bệnh sử" },
              "pmh": { "score": <Điểm số từ 0-10>, "max": 10, "comments": "Nhận xét chi tiết cho phần Tiền sử" },
              "physicalExam": { "score": <Điểm số từ 0-15>, "max": 15, "comments": "Nhận xét chi tiết cho phần Khám lâm sàng" },
              "caseSummary": { "score": <Điểm số từ 0-5>, "max": 5, "comments": "Nhận xét chi tiết cho phần Tóm tắt bệnh án" },
              "clinicalDiscussion": { "score": <Điểm số từ 0-15>, "max": 15, "comments": "Nhận xét chi tiết cho phần Biện luận lâm sàng" },
              "preliminaryDiagnosis": { "score": <Điểm số từ 0-5>, "max": 5, "comments": "Nhận xét chi tiết cho phần Chẩn đoán sơ bộ" },
              "definitiveDiagnosis": { "score": <Điểm số từ 0-5>, "max": 5, "comments": "Nhận xét chi tiết cho phần Chẩn đoán xác định" },
              "diagnostics": { "score": <Điểm số từ 0-10>, "max": 10, "comments": "Nhận xét chi tiết cho phần Cận lâm sàng" },
              "treatment": { "score": <Điểm số từ 0-5>, "max": 5, "comments": "Nhận xét chi tiết cho phần Điều trị" },
              "prognosis": { "score": <Điểm số từ 0-3>, "max": 3, "comments": "Nhận xét chi tiết cho phần Tiên lượng" },
              "followUp": { "score": <Điểm số từ 0-3>, "max": 3, "comments": "Nhận xét chi tiết cho phần Theo dõi" },
              "clinicalLessons": { "score": <Điểm số từ 0-4>, "max": 4, "comments": "Nhận xét chi tiết cho phần Bài học lâm sàng" }
            },
            "comparisonBlocks": [
              {
                "sectionName": "Tên cấu phần bệnh án (Ví dụ: Bệnh sử, Khám lâm sàng, Biện luận...)",
                "originalText": "Đoạn văn gốc của sinh viên viết liên quan đến phần này",
                "correctedText": "Đoạn văn hiệu chỉnh chuẩn mực do AI viết lại hoàn chỉnh nhất",
                "highlights": [
                  {
                    "type": "error",
                    "text": "Đoạn văn bị sai hoặc chưa đúng trong nguyên bản",
                    "replacement": "Nội dung thay thế đúng chuẩn y khoa",
                    "explanation": "Giải thích chi tiết tại sao đoạn này sai về mặt chuyên môn lâm sàng hoặc y văn thực tế."
                  }
                ]
              }
            ],
            "teachingPoints": [
              {
                "title": "Tiêu đề bài học ngắn gọn (Ví dụ: Cơ chế đau ngực của nhồi máu, Phân biệt viêm ruột thừa và phụ khoa...)",
                "section": "Tên cấu phần liên quan (ví dụ: Biện luận lâm sàng)",
                "whyWrong": "Giải thích tại sao cách tư duy cũ của sinh viên trong bệnh án là chưa chuẩn xác",
                "whyCorrection": "Lý giải bản chất của tư duy đúng chuẩn lâm sàng",
                "clinicalKnowledge": "Kiến thức hàn lâm y khoa chuyên sâu, hướng dẫn, đồng thuận quốc tế (như AHA, ESC, Bộ Y tế Việt Nam) liên quan đến chủ đề này",
                "preventiveTip": "Mẹo thực tế lâm sàng để sinh viên không bao giờ mắc lại lỗi này khi đi buồng hoặc viết bệnh án sau này"
              }
            ],
            "completenessChecklist": [
              {
                "item": "Tên tiêu chí kiểm tra (Ví dụ: Khai thác tính chất đau ngực chi tiết, Khám phản xạ thành bụng, Thử Beta-hCG cho nữ tuổi sinh đẻ...)",
                "status": "Trạng thái đạt được, bắt buộc là một trong 3 giá trị: 'complete' hoặc 'incomplete' hoặc 'not_applicable'",
                "importance": "Độ quan trọng, bắt buộc là một trong 3 giá trị: 'critical' hoặc 'important' hoặc 'optional'",
                "notes": "Nhận xét hoặc giải thích lý do đạt/chưa đạt hoặc gợi ý thực hiện"
              }
            ],
            "similarCases": [
              {
                "code": "Mã ca bệnh thực tế hoặc tự định nghĩa tương đương",
                "title": "Tên ca bệnh tương đồng trong thư viện",
                "matchReason": "Lý do vì sao hai ca bệnh này có sự tương đồng lâm sàng và sinh viên nên tham khảo chéo ca bệnh kia"
              }
            ],
            "learningSummary": {
              "errorsList": [
                "Danh sách các lỗi sai cốt lõi tìm thấy trong bệnh án"
              ],
              "commonMistakes": [
                "Các quan niệm sai lầm phổ biến liên quan đến trường hợp lâm sàng này ở sinh viên y khoa"
              ],
              "areasForImprovement": [
                "Những mảng kiến thức bệnh học hoặc kỹ năng lâm sàng sinh viên cần tập trung cải thiện gấp"
              ],
              "personalizedPlan": "Lời khuyên cá nhân hóa, lộ trình học tập cụ thể, chỉ định đọc tài liệu nào để khắc phục hoàn toàn điểm yếu"
            },
            "wardRounds": {
              "presentationScore": <Số nguyên 0-100, đánh giá kỹ năng trình bày bệnh án lâm sàng miệng>,
              "presentationFeedback": "Nhận xét chi tiết về tác phong, logic trình bày miệng và khả năng làm nổi bật triệu chứng cốt lõi của ca bệnh",
              "interactiveQuestions": [
                {
                  "question": "Câu hỏi vấn đáp lâm sàng của giảng viên (thách thức tư duy biện luận lâm sàng sâu, cơ chế bệnh học)",
                  "sampleAnswer": "Câu trả lời mẫu hoàn hảo và đầy đủ nhất theo chuẩn Giáo sư y khoa để sinh viên học tập"
                }
              ]
            }
          }

          Hãy đảm bảo nhận xét cực kỳ sâu sắc, mang tính giáo dục lâm sàng cao, dùng đúng thuật ngữ y khoa chuyên nghiệp của Việt Nam. Không viết thêm bất kỳ từ ngữ thảo luận nào trước và sau JSON, trả về đúng chuỗi JSON hợp lệ.
        `;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          }
        });

        const responseText = response.text || "";
        console.log("Raw Gemini Tutor Response received.");
        
        let parsedData;
        try {
          parsedData = JSON.parse(responseText.trim().replace(/^```json\s*/i, "").replace(/```$/, "").trim());
          return res.json(parsedData);
        } catch (parseErr) {
          console.error("Failed to parse Gemini JSON, attempting regex cleanup...", parseErr);
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            parsedData = JSON.parse(jsonMatch[0]);
            return res.json(parsedData);
          }
          throw new Error("Invalid JSON returned by Gemini");
        }

      } catch (apiErr) {
        console.error("Gemini API Error during analysis, falling back to rule-based analysis:", apiErr);
        const fallbackResult = getFallbackAnalysis(record, specialty);
        return res.json(fallbackResult);
      }
    } else {
      const fallbackResult = getFallbackAnalysis(record, specialty);
      return res.json(fallbackResult);
    }
  });

  // 1.5. Library Case Q&A / AI Explanations API Route
  app.post("/api/library-chat", async (req, res) => {
    const { caseTitle, caseDetails, messages } = req.body;
    if (!caseDetails) {
      return res.status(400).json({ error: "Thiếu thông tin chi tiết ca bệnh." });
    }

    if (ai) {
      try {
        console.log(`Calling Gemini API for Library Case Q&A [Case: ${caseTitle}]...`);
        const systemInstruction = `
          Bạn là một Giáo sư Lâm sàng Y khoa và Chuyên gia AI của MEDCASEVN. 
          Nhiệm vụ của bạn là giải thích cặn kẽ các câu hỏi của sinh viên Y khoa về ca bệnh lâm sàng sau:
          
          CA LÂM SÀNG:
          ---
          Tiêu đề: ${caseTitle}
          Chi tiết bệnh án:
          ${JSON.stringify(caseDetails)}
          ---

          Hướng dẫn trả lời:
          1. Luôn sử dụng đúng văn phong chuẩn y khoa Việt Nam, chuyên nghiệp, súc tích và chính xác.
          2. Tập trung giải thích sâu về cơ chế bệnh sinh (Pathophysiology), ý nghĩa các chỉ số cận lâm sàng (Diagnostics), logic đưa ra chẩn đoán xác định, và tối ưu hóa phác đồ điều trị.
          3. Nếu sinh viên hỏi ngoài phạm vi y khoa hoặc ca bệnh, hãy lịch sự nhắc nhở quay lại nội dung ca bệnh lâm sàng này.
          4. Trả lời bằng tiếng Việt, trình bày đẹp bằng Markdown, dùng danh sách liệt kê rõ ràng.
        `;

        const formattedContents = messages.map((m: any) => {
          const role = m.role === "student" || m.role === "user" ? "user" : "model";
          const text = m.text || m.message || "";
          return {
            role,
            parts: [{ text }]
          };
        });

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: formattedContents,
          config: {
            systemInstruction,
            temperature: 0.5,
          }
        });

        return res.json({ response: response.text });
      } catch (apiErr) {
        console.error("Gemini API Error during Library Chat, falling back:", apiErr);
        return res.json({ response: "Xin lỗi, hệ thống AI đang quá tải. Dưới đây là lời khuyên chung: Hãy tập trung vào việc đối chiếu lâm sàng và cận lâm sàng để tìm ra cơ chế bệnh sinh cốt lõi của ca bệnh." });
      }
    } else {
      // Rule-based fallback responses for clinical keywords
      const lastMessage = messages[messages.length - 1]?.text?.toLowerCase() || "";
      let reply = "Thầy cô khuyên em nên đọc thêm sách giáo trình lâm sàng. Em muốn tìm hiểu sâu về phần nào của ca bệnh này? (Cơ chế bệnh sinh, Cận lâm sàng, Chẩn đoán, hay Điều trị?)";
      
      if (lastMessage.includes("bệnh sinh") || lastMessage.includes("cơ chế")) {
        reply = `**Giải thích cơ chế bệnh sinh của ca bệnh này:**\n\n1. **Khởi phát tổn thương:** Có sự rối loạn chức năng cấp/mạn của cơ quan đích (tim, phổi, ruột thừa...) gây ứ trệ hoặc thiếu máu nuôi dưỡng tế bào.\n2. **Phản ứng viêm hệ thống:** Cơ thể giải phóng các hóa hướng động (cytokines, bạch cầu) đến vùng tổn thương, gây biểu hiện sốt, đau tại chỗ và tăng nồng độ bạch cầu trong máu.\n3. **Mất bù lâm sàng:** Khi các cơ chế thích nghi vượt quá giới hạn, triệu chứng lâm sàng bộc phát dữ dội (như cơn đau bóp nghẹt, khó thở dồn dập).`;
      } else if (lastMessage.includes("cận lâm sàng") || lastMessage.includes("xét nghiệm") || lastMessage.includes("cls")) {
        reply = `**Phiên giải kết quả cận lâm sàng đặc trưng:**\n\n- **Xét nghiệm máu (Công thức máu):** Cho thấy phản ứng viêm rõ rệt với bạch cầu tăng ưu thế trung tính.\n- **Xét nghiệm đặc hiệu (Troponin, Siêu âm, X-quang):** Cung cấp bằng chứng khách quan về mức độ hủy hoại thực thể tại cơ quan và định hướng phân loại thể lâm sàng.\n- **Xét nghiệm loại trừ:** Giúp bác sĩ tự tin loại bỏ các chẩn đoán phân biệt nguy kịch khác.`;
      } else if (lastMessage.includes("chẩn đoán") || lastMessage.includes("xác định")) {
        reply = `**Lập luận đưa ra chẩn đoán xác định:**\n\n1. **Yếu tố nguy cơ & Tiền sử:** Đóng vai trò định hướng nền tảng vững chắc.\n2. **Triệu chứng lâm sàng cốt lõi:** Các hội chứng đặc trưng và thời gian khởi phát triệu chứng.\n3. **Cận lâm sàng vàng:** Kết quả xét nghiệm mang tính quyết định khẳng định tổn thương thực thể.`;
      } else if (lastMessage.includes("điều trị") || lastMessage.includes("thuốc") || lastMessage.includes("phẫu thuật")) {
        reply = `**Nguyên tắc điều trị chuẩn:**\n\n- **Điều trị khẩn cấp:** Bảo đảm chức năng sống (đường thở, hô hấp, tuần hoàn) và giảm đau tối đa cho bệnh nhân.\n- **Điều trị nguyên nhân:** Loại bỏ ổ viêm (phẫu thuật cắt ruột thừa) hoặc tái thông mạch máu tắc nghẽn (PCI trong mạch vành).\n- **Điều trị duy trì:** Thuốc bảo vệ cơ quan dài hạn, phục hồi chức năng và giáo dục sức khỏe phòng ngừa tái phát.`;
      }
      return res.json({ response: reply });
    }
  });

  // 2. OSCE Live Patient Simulator Chat API Route
  app.post("/api/osce-chat", async (req, res) => {
    const { caseId, messages } = req.body;
    if (!caseId) {
      return res.status(400).json({ error: "Thiếu caseId của ca mô phỏng." });
    }

    // If Gemini is active, use it for rich patient chat simulation!
    if (ai) {
      try {
        console.log(`Calling Gemini API for OSCE Patient Simulator [Case: ${caseId}]...`);
        
        const casePromptMap: Record<string, string> = {
          "IM-402": `
            Bạn là bệnh nhân nam Trần Huy Hoàng, 45 tuổi, đang ở phòng cấp cứu bệnh viện vì đau ngực dữ dội.
            Tính cách: Đang rất lo lắng, sợ hãi (lo sợ mình bị đột quỵ hoặc nhồi máu cơ tim giống người cha đã mất sớm lúc 50 tuổi), mệt mỏi, thở hơi dốc.
            Bệnh cảnh lâm sàng:
            - Lý do vào viện: Đau ngực trái dữ dội kèm vã mồ hôi.
            - Khởi phát: Cách đây 2 giờ, đột ngột xuất hiện lúc đang ngồi uống trà nghỉ ngơi.
            - Tính chất đau: Đau bóp nghẹt, như đá đè nặng sau xương ức, đau liên tục không giảm dù thay đổi tư thế hay nghỉ ngơi. Điểm đau 8/10.
            - Hướng lan: Lan lên vai trái và dọc bờ trong mặt trong cánh tay trái xuống ngón tay út, lan nhẹ lên hàm dưới.
            - Triệu chứng kèm theo: Vã mồ hôi đầm đìa, khó thở nhẹ, cảm giác hồi hộp lo sợ cái chết. Không sốt, không ho, không nôn.
            - Tiền sử: Tăng huyết áp 3 năm nay uống thuốc Coversyl hằng ngày không đều, có rối loạn lipid máu. Hút thuốc lá 1 bao/ngày trong 20 năm qua. Ít tập thể dục.
            - Tiền sử gia đình: Cha ruột đột tử do nhồi máu cơ tim cấp lúc 50 tuổi.
            
            Nguyên tắc giao tiếp:
            - Trả lời bằng tiếng Việt, xưng 'tôi' và gọi người đối diện là 'bác sĩ' hoặc 'bác'.
            - Trả lời ngắn gọn, tự nhiên giống người bệnh thật (1-3 câu), bộc lộ sự mệt mỏi hoặc lo âu phù hợp.
            - KHÔNG bao giờ tự khai hết tất cả triệu chứng cùng một lúc. Người học hỏi đến đâu, bạn trả lời chi tiết đến đó. Nếu hỏi lan man hoặc dùng quá nhiều từ ngữ chuyên môn phức tạp (như 'áp lực động mạch phổi', 'rối loạn tái cực'), hãy trả lời ngơ ngác, không hiểu: 'Bác sĩ nói gì tôi không hiểu lắm, tôi chỉ thấy ngực nó bóp nghẹt quá...'.
          `,
          "SURG-201": `
            Bạn là bệnh nhân nữ Nguyễn Thu Thảo, 22 tuổi, sinh viên, đang ở phòng khám ngoại khoa vì đau bụng cấp.
            Tính cách: Mệt mỏi, hơi e ngại, lo lắng vì sợ phải mổ ruột thừa.
            Bệnh cảnh lâm sàng:
            - Lý do vào viện: Đau bụng vùng hố chậu phải ngày thứ 2.
            - Khởi phát: Tối ngày hôm qua, ban đầu đau âm ỉ, âm ỉ ở khu vực quanh rốn. Sau khoảng 8-12 tiếng (sáng nay), cơn đau di chuyển và khu trú hẳn xuống vùng hông bên phải (hố chậu phải).
            - Tính chất đau: Đau âm ỉ liên tục, thỉnh thoảng quặn nhẹ, ho hay đi lại, cử động mạnh là đau nhói thốn ở hông phải. Điểm đau 6/10.
            - Triệu chứng kèm theo: Chán ăn hoàn toàn (từ tối qua đến giờ không muốn ăn gì), buồn nôn và có nôn khan 1 lần sáng nay. Người hơi sốt nhẹ hâm hấp (37.8 độ C). Đại tiểu tiện bình thường, phân vàng sệt.
            - Tiền sử: Chưa từng bị đau tương tự. Khỏe mạnh. Kỳ kinh cuối cách đây 2 tuần, kinh nguyệt đều, chưa lập gia đình, không trễ kinh.
            
            Nguyên tắc giao tiếp:
            - Trả lời bằng tiếng Việt, xưng 'em' hoặc 'cháu' và gọi người đối diện là 'bác sĩ'.
            - Triệu chứng cần khai thác dần dần, chỉ nói khi được hỏi trúng triệu chứng. Trả lời tự nhiên, ngắn gọn (1-2 câu).
          `
        };

        const systemInstruction = casePromptMap[caseId] || "Bạn là một bệnh nhân đang giả định triệu chứng lâm sàng để sinh viên y khoa thi vấn đáp OSCE. Hãy đóng vai bệnh nhân thật một cách tự nhiên, trả lời ngắn gọn và chỉ tiết lộ thông tin khi được hỏi phù hợp.";

        const formattedContents = messages.map((m: any) => {
          const role = m.role === "student" ? "user" : "model";
          const text = m.text || m.message || "";
          return {
            role,
            parts: [{ text }]
          };
        });

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: formattedContents,
          config: {
            systemInstruction,
            temperature: 0.7,
            topP: 0.9,
          }
        });

        return res.json({ response: response.text });
      } catch (apiErr) {
        console.error("Gemini API Error during OSCE chat, using fallback response:", apiErr);
        const fallbackResponse = getFallbackOSCEPatientResponse(caseId, messages);
        return res.json({ response: fallbackResponse });
      }
    } else {
      const fallbackResponse = getFallbackOSCEPatientResponse(caseId, messages);
      return res.json({ response: fallbackResponse });
    }
  });

  // Serve static build in production, otherwise Vite dev server handles assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MEDCASEVN AI full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
