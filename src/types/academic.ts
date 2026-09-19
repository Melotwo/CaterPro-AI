export interface QctoQualification {
  id: 'chef' | 'cook' | 'kitchen-hand';
  title: string;
  saqaId: string;
  nqfLevel: number;
  credits: number;
  curriculumCode: string;
  subFramework: string;
  purpose: string;
  targetRoles: string[];
  modules: QctoModule[];
}

export interface QctoModule {
  code: string;
  type: 'Knowledge' | 'Practical' | 'Workplace';
  title: string;
  credits: number;
  learningOutcomes: string[];
  caterproToolAlignment: {
    toolName: string;
    description: string;
    evidenceProduced: string;
  }[];
  assessmentCriteria: string[];
}

export interface CostingDrill {
  id: string;
  title: string;
  category: 'Yield Calculation' | 'Wastage Factor' | 'Buffer Margin' | 'Food Cost Percentage';
  qctoModuleRef: string;
  difficulty: 'Apprentice' | 'Intermediate' | 'Master Chef';
  scenario: string;
  givenData: Record<string, string | number>;
  question: string;
  inputUnit: string;
  expectedAnswer: number;
  tolerance: number;
  solutionSteps: string[];
  learningTakeaway: string;
}

export interface LecturerLessonPlan {
  id: string;
  title: string;
  qualificationCode: string;
  qualificationTitle: string;
  nqfLevel: number;
  durationHours: number;
  menuLinkedTitle: string;
  coversToSimulate: number;
  practicalBrief: {
    objective: string;
    timeAllotmentMinutes: number;
    equipmentNeeded: string[];
    ingredientsFocus: string[];
  };
  yieldSheet: {
    item: string;
    asPurchasedQty: string;
    prepLossPercent: number;
    ediblePortionQty: string;
    costPerKgZar: number;
    actualPortionCostZar: number;
  }[];
  studentExerciseQuestions: {
    id: string;
    question: string;
    type: 'costing' | 'haccp' | 'technique';
    benchmarkAnswer: string;
  }[];
  haccpCcpPoints: {
    step: string;
    hazard: string;
    criticalLimit: string;
    monitoringProcedure: string;
  }[];
  gradingRubric: {
    criterion: string;
    weightPercent: number;
    descriptor: string;
  }[];
}

export interface PracticalPhotoProof {
  id: string;
  title: string;
  phase: 'Mise en Place' | 'Thermal Cooking' | 'Final Presentation' | 'HACCP Temperature Log';
  imageUrl: string;
  notes: string;
  timestamp: string;
}

export interface StudentPoeEntry {
  id: string;
  timestamp: string;
  studentName: string;
  studentId: string;
  institutionName: string;
  qualificationId: string;
  saqaId: string;
  nqfLevel: number;
  moduleFocus: string;
  menuTitle: string;
  guestCount: number;
  totalFoodCostZar: number;
  sellingPriceZar: number;
  foodCostPercentage: number;
  allergenChecklist: {
    allergen: string;
    presentInMenu: boolean;
    mitigationPlan: string;
  }[];
  practicalProofs: PracticalPhotoProof[];
  reflectiveLog: string;
  lecturerVerification: {
    lecturerName: string;
    lecturerId: string;
    status: 'Draft' | 'Submitted for Review' | 'Competent' | 'Not Yet Competent';
    marksAwarded?: number;
    feedback: string;
    signedAt?: string;
  };
}
