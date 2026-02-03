/**
 * Address Types
 */

export interface Address {
    id: number;
    user_id: number;
    contact_name: string;
    phone: string;
    address_type: string; // "Nhà riêng", "Văn phòng", "Khác"
    detail_address: string;
    latitude: number | null;
    longitude: number | null;
    is_default: boolean;
    created_at: string;
    updated_at?: string;
}

export interface AddressFormData {
    contact_name: string;
    phone: string;
    address_type: string;
    detail_address: string;
    latitude: number | null;
    longitude: number | null;
    is_default: boolean;
}

export interface CreateAddressPayload {
    user_id: number;
    contact_name: string;
    phone: string;
    address_type: string;
    detail_address: string;
    latitude?: number | null;
    longitude?: number | null;
    is_default: boolean;
}

export interface UpdateAddressPayload {
    contact_name: string;
    phone: string;
    address_type: string;
    detail_address: string;
    latitude?: number | null;
    longitude?: number | null;
    is_default: boolean;
}

export type AddressType = "Nhà riêng" | "Văn phòng" | "Khác";

export const ADDRESS_TYPES: AddressType[] = ["Nhà riêng", "Văn phòng", "Khác"];