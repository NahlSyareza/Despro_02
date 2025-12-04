// --- DATA DASHBOARD OVERVIEW ---
export const MOCK_OVERVIEW_KPI = {
  mealsAnalyzed: 1234,
  feedbackRate: 73.8,
  averageRating: 4.6,
  nutritionCompliance: 71.6,
  deltas: {
    mealsAnalyzed: 1.47,
    feedbackRate: -0.59,
    averageRating: -3.4,
    nutritionCompliance: 11.22,
  },
};

export const MOCK_OVERVIEW_RATINGS = [
  { rating: 1, count: 115 },
  { rating: 2, count: 164 },
  { rating: 3, count: 145 },
  { rating: 4, count: 123 },
  { rating: 5, count: 112 },
];

export const MOCK_OVERVIEW_QUALITY = [
  { name: "Good", value: 46, fill: "#22c55e" },
  { name: "Fair", value: 36, fill: "#eab308" },
  { name: "Poor", value: 18, fill: "#ef4444" },
];

// --- DATA ANALYTICS (TRENDS) ---
export const MOCK_RATING_TREND = [
  { date: "20 Oct", thisWeek: 4.2, previousWeek: 3.8 },
  { date: "21 Oct", thisWeek: 4.5, previousWeek: 3.9 },
  { date: "22 Oct", thisWeek: 4.3, previousWeek: 4.1 },
  { date: "23 Oct", thisWeek: 4.8, previousWeek: 4.0 },
  { date: "24 Oct", thisWeek: 4.6, previousWeek: 4.2 },
  { date: "25 Oct", thisWeek: 4.7, previousWeek: 4.3 },
  { date: "26 Oct", thisWeek: 4.9, previousWeek: 4.4 },
];

export const MOCK_QUALITY_TREND = [
  { date: "20 Oct", thisWeek: 75, previousWeek: 65 },
  { date: "21 Oct", thisWeek: 82, previousWeek: 70 },
  { date: "22 Oct", thisWeek: 78, previousWeek: 72 },
  { date: "23 Oct", thisWeek: 90, previousWeek: 75 },
  { date: "24 Oct", thisWeek: 85, previousWeek: 78 },
  { date: "25 Oct", thisWeek: 88, previousWeek: 80 },
  { date: "26 Oct", thisWeek: 92, previousWeek: 82 },
];

export const MOCK_ISSUES = [
  { name: "Taste", value: 350 },
  { name: "Freshness", value: 220 },
  { name: "Hygiene", value: 150 },
  { name: "Portion", value: 630 },
  { name: "Variety", value: 800 },
];

// --- DATA LOG & FEEDBACK ---
export const MOCK_TRAY_LOGS = [
  { date: "20/10/2025", trayId: "ARD42", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0", compliance_score: 90, image_path: null },
  { date: "20/10/2025", trayId: "ARD41", menuId: "A-23850", calories: "850", fat: "30.0", protein: "40.0", carbs: "44.0", compliance_score: 75, image_path: null },
  { date: "19/10/2025", trayId: "ARD40", menuId: "SU13UTX", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0", compliance_score: 95, image_path: null },
  { date: "19/10/2025", trayId: "ARD39", menuId: "A-23850", calories: "920", fat: "42.0", protein: "44.0", carbs: "44.0", compliance_score: 88, image_path: null },
  { date: "18/10/2025", trayId: "ARD38", menuId: "A-23850", calories: "1019", fat: "44.0", protein: "44.0", carbs: "44.0", compliance_score: 60, image_path: null },
];

export const MOCK_STUDENT_FEEDBACKS = [
  { id: 1, name: "Tray_ID 1", rating: 5, date: "25/10/2025", text: "Makanannya enak, bumbu ayamnya meresap tapi nasinya kebanyakan jadi lauknya habis duluan." },
  { id: 2, name: "Tray_ID 2", rating: 5, date: "25/10/2025", text: "Sayurnya enak, buahnya kurang fresh. Next ikan ya wok" },
  { id: 3, name: "Tray_ID 3", rating: 3, date: "25/08/2025", text: "Lauknya sedikit" },
  { id: 4, name: "Tray_ID 4", rating: 2, date: "24/08/2025", text: "Nasi agak keras hari ini" },
  { id: 5, name: "Tray_ID 5", rating: 4, date: "24/08/2025", text: "Lumayan lah buat makan siang gratis" },
];