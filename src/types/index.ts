export interface College {
  id: string
  name: string
  location: string
  city: string
  state: string
  fees_per_year: number
  rating: number
  placement_percent: number
  image_url: string | null
  overview: string
  created_at: string
}

export interface Course {
  id: string
  college_id: string
  name: string
  duration: string
  fees: number
}

export interface RankCutoff {
  id: string
  college_id: string
  exam: string
  min_rank: number
  max_rank: number
}

export interface Placement {
  id: string;
  college_id: string;

  placement_rate: number;     
  avg_package: number;        
  highest_package: number;    
  median_package: number;     

  top_recruiters: string[];  

  created_at: string;
}