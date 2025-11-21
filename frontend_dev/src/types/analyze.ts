// types/analyze.ts

export interface ShareChannel {
  id: number;
  key: string;
  name: string;
  description?: string;
  icon?: string;
  sort_order: number;
}

export interface AnalyzeLink {
  id: number;
  channel_key: string;
  channel_name: string;
  custom_label?: string;
  share_link_url: string;
  access_count: number;
  last_accessed_at?: string;
  created_at: string;
}

export interface MapAnalyzeData {
  shared_map_id: number | null;
  shared_map_name: string | null;
  share_uuid: string | null;
  direct_access_count: number;
  direct_last_accessed_at?: string | null;
  analyze_links: AnalyzeLink[];
}

export interface CreateAnalyzeLinkRequest {
  channel_key: string;
  custom_label?: string;
}

export interface CreateAnalyzeLinkResponse extends AnalyzeLink {
  created: boolean;
}

export interface UpdateAnalyzeLinkLabelRequest {
  custom_label: string;
}

export interface UpdateAnalyzeLinkLabelResponse {
  id: number;
  custom_label: string;
}
