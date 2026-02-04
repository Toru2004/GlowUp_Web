export interface Store {
  id: number;
  name: string;
  address_detail: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  manager_id?: number | null;
  manager_name?: string;
  manager_email_full?: string;
  distance_km?: number;
  created_at: string;
  updated_at: string;
}