import { Icons } from '@/components/icons';

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

export interface SalesOrder {
  _id: number;
  'Customer ID': string;
  'Customer Name': string;
  'Customer Purchase Order': string;
  'Ticket Reference': string;
  'PO Date': string;
  'Sales Order': string;
  status: 'SO Created' | 'Process PO';
}
export interface BOM {
  component_id: string;
  component_name: string;
  part_number: string;
  description: string;
  quantity: number;
  unit_of_measure: string;
  source: string;
  lead_time: number;
  price: number;
  currency: string;
}
export interface BasicInfo {
  basic_info: {
    sku: string;
    description: string;
    dimension: string;
    site: string;
    unit_of_measure: string;
    stock_status: string;
    risk: string;
    risk_info: string;
    on_hand: number;
    committed: number;
    available: number;
    incoming: number;
    lead_time: number;
    price_per_unit: number;
    status: boolean;
  };
}
export interface TextFilterProps {
  column: any;
  placeholder: string;
  type?: 'text' | 'number';
}

export interface TableConfig {
  enableSearch: boolean;
  enableExport: boolean;
  enableColumnVisibility: boolean;
  enableFilters: boolean;
  enableDensityToggle: boolean;
  enableFullScreen: boolean;
  enablePagination: boolean;
  defaultPageSize: number;
  pageSizeOptions: number[];
}
