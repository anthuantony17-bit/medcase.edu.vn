export interface ScoreBreakdown {
  history: number;
  exam: number;
  labs: number;
  reasoning: number;
  treatment: number;
}

export interface FeedbackComment {
  title: string;
  desc: string;
}

export interface FeedbackComments {
  errors: FeedbackComment[];
  missing: FeedbackComment[];
  terminology: FeedbackComment[];
  suggestions: FeedbackComment[];
}

export interface CaseClassification {
  caseType: string;
  specialty: string;
  suspectedDiagnosis: string;
  structure: string;
}

export interface DetailedSectionScore {
  score: number;
  max: number;
  comments: string;
}

export interface DetailedScores {
  administration: DetailedSectionScore;
  chiefComplaint: DetailedSectionScore;
  hpi: DetailedSectionScore;
  pmh: DetailedSectionScore;
  physicalExam: DetailedSectionScore;
  caseSummary: DetailedSectionScore;
  clinicalDiscussion: DetailedSectionScore;
  preliminaryDiagnosis: DetailedSectionScore;
  definitiveDiagnosis: DetailedSectionScore;
  diagnostics: DetailedSectionScore;
  treatment: DetailedSectionScore;
  prognosis: DetailedSectionScore;
  followUp: DetailedSectionScore;
  clinicalLessons: DetailedSectionScore;
}

export interface DiffHighlight {
  type: "error" | "improvement" | "addition";
  text: string;
  replacement?: string;
  explanation: string;
}

export interface ComparisonBlock {
  sectionName: string;
  originalText: string;
  correctedText: string;
  highlights: DiffHighlight[];
}

export interface TeachingPoint {
  title: string;
  section: string;
  whyWrong: string;
  whyCorrection: string;
  clinicalKnowledge: string;
  preventiveTip: string;
}

export interface CompletenessItem {
  item: string;
  status: "complete" | "incomplete" | "not_applicable";
  importance: "critical" | "important" | "optional";
  notes: string;
}

export interface SimilarCaseSuggestion {
  code: string;
  title: string;
  matchReason: string;
}

export interface LearningSummary {
  errorsList: string[];
  commonMistakes: string[];
  areasForImprovement: string[];
  personalizedPlan: string;
}

export interface InteractiveQuestion {
  question: string;
  sampleAnswer: string;
  studentAnswerFeedback?: string;
}

export interface WardRoundsFeedback {
  presentationScore: number;
  presentationFeedback: string;
  interactiveQuestions: InteractiveQuestion[];
}

export interface AnalysisResult {
  overallScore: number;
  scores: ScoreBreakdown;
  comments: FeedbackComments;
  
  // Advanced tutor extension fields (optional to keep compatibility with existing fallbacks)
  classification?: CaseClassification;
  detailedScores?: DetailedScores;
  comparisonBlocks?: ComparisonBlock[];
  teachingPoints?: TeachingPoint[];
  completenessChecklist?: CompletenessItem[];
  similarCases?: SimilarCaseSuggestion[];
  learningSummary?: LearningSummary;
  wardRounds?: WardRoundsFeedback;
}

export interface OSCEMessage {
  id: string;
  role: "student" | "patient";
  text: string;
  timestamp: Date;
}

export interface OSCECase {
  id: string;
  code: string;
  title: string;
  specialty: string;
  gender: string;
  age: number;
  complaint: string;
  timeRemaining: number; // in seconds
  vitals: {
    bp: string;
    hr: string;
    rr: string;
    spo2: string;
    temp: string;
  };
  examManeuvers: {
    id: string;
    name: string;
    result: string;
  }[];
  labTests: {
    id: string;
    name: string;
    result: string;
    interpretation?: string;
  }[];
}

export interface LibraryCase {
  id: string;
  title: string;
  code: string;
  category: "Acute" | "Chronic";
  specialty: string;
  age: number;
  gender: string;
  reasonForAdmission: string;
  historyOfPresentIllness: string;
  pastMedicalHistory: string;
  vitals: {
    bp: string;
    hr: string;
    rr: string;
    temp: string;
    spo2: string;
  };
  physicalExamSummary: string;
  labsAndDiagnostics: {
    testName: string;
    result: string;
    normalRange?: string;
    interpretation?: string;
  }[];
  aiClinicalInsight: string;
  imagePlaceholder?: string;

  // New detailed 16 sections
  administrationText?: string;
  reasonForAdmissionText?: string;
  hpiText?: string;
  pmhText?: string;
  physicalExamText?: string;
  caseSummaryText?: string;
  clinicalDiscussionText?: string;
  preliminaryDiagnosisText?: string;
  definitiveDiagnosisText?: string;
  diagnosticsText?: string;
  treatmentText?: string;
  prognosisText?: string;
  followUpText?: string;
  clinicalLessonsText?: string;
  commonStudentErrorsText?: string;
  presentationTipsText?: string;

  // Specialty Rounds (Chuyên đề đi buồng)
  wardRoundsChecklist?: string[];
  commonTeacherQuestions?: { question: string; answer: string }[];
  difficultQuestionTips?: string;

  // AI Assistance Explanations
  aiPathophysiology?: string;
  aiDiagnosticsExplanation?: string;
  aiDiagnosisExplanation?: string;
  aiTreatmentExplanation?: string;
}

export interface StudentStats {
  learningHours: number;
  casesStudied: number;
  avgOSCEScore: number;
  docQualityScore: number;
  specialtyProgress: {
    name: string;
    completed: number;
    total: number;
    color: string;
  }[];
  achievements: {
    id: string;
    title: string;
    desc: string;
    iconName: string;
    color: string;
  }[];
  recentActivities: {
    id: string;
    type: "osce" | "analysis" | "library";
    title: string;
    score?: string;
    time: string;
  }[];
}
