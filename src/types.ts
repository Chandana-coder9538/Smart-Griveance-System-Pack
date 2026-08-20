export type ComplaintStatus =
  | 'submitted'
  | 'under_review'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'closed'
  | 'escalated';

export type UrgencyLevel = 'critical' | 'high' | 'medium' | 'low';

export type Category =
  | 'electricity'
  | 'water'
  | 'roads'
  | 'sanitation'
  | 'drainage'
  | 'streetlights'
  | 'parks'
  | 'housing'
  | 'healthcare'
  | 'education'
  | 'transport'
  | 'other';

export type ComplaintCategory = Category;

export type UserRole = 'citizen' | 'admin';

export interface User {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  created_at: string;
}

export interface Complaint {
  id: string;
  tracking_id?: string;
  title: string;
  description: string;
  location: string;
  district: string;
  citizen_name: string;
  citizen_email: string;
  citizen_phone: string;
  photo_url?: string | null;
  image_url?: string | null;
  category: Category;
  sub_category: string;
  urgency_score: number; // 1 - 5
  urgency_level: UrgencyLevel;
  sentiment_score: number;
  predicted_resolution_days: number;
  confidence_score?: number;
  ai_confidence: number;
  ai_reasoning?: string;
  department?: string;
  department_name: string;
  assigned_officer?: string | null;
  assigned_officer_name?: string | null;
  assigned_officer_phone?: string | null;
  assigned_officer_email?: string | null;
  officer_name?: string | null;
  officer_phone?: string | null;
  officer_email?: string | null;
  status: ComplaintStatus;
  is_duplicate?: boolean;
  is_overdue?: boolean;
  escalation_notified?: boolean;
  escalation_count?: number;
  similar_complaint_ids?: string[];
  resolution_notes?: string | null;
  actual_resolution_date?: string | null;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  categories_handled?: Category[];
  head_officer?: string;
  head_officer_phone?: string;
  contact_email?: string;
  contact_phone?: string;
  avg_resolution_days?: number;
  current_workload?: number;
  sla_days?: number;
  latitude: number;
  longitude: number;
  address: string;
}

export interface AIClassificationResponse {
  category: Category;
  sub_category: string;
  urgency_score: number;
  urgency_level: UrgencyLevel;
  sentiment_score: number;
  predicted_resolution_days: number;
  confidence_score?: number;
  ai_confidence?: number;
  department_name?: string;
  routing_department?: string;
  reasoning?: string;
  ai_reasoning?: string;
  key_factors?: string[];
  suggested_action?: string;
}

export interface KPIData {
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  criticalPending: number;
  overdueComplaints: number;
  resolutionRate: number;
  categoryCounts: Record<string, number>;
  urgencyCounts: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  districtStats: Record<
    string,
    {
      count: number;
      criticalCount: number;
      resolvedCount: number;
      lat: number;
      lng: number;
    }
  >;
}

export interface DashboardKPIs {
  total: number;
  criticalHigh: number;
  resolved: number;
  pending: number;
  slaViolations: number;
  avgResolutionTimeDays: number;
  classificationAccuracy: number;
}

export interface DistrictMetric {
  district: string;
  count: number;
  criticalCount: number;
  resolvedCount: number;
  lat: number;
  lng: number;
}
