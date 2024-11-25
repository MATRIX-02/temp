export interface Permission {
  name: string;
  status: boolean;
  department?: string[];
  site?: string[];
  company?: string[];
  category?: string[];
}

export interface Permissions {
  own: Permission[];
  other: Permission[];
}

export interface User {
  first_name: string;
  last_name: string;
  email: string;
  employee_id: string;
  start_date: string;
  department: string;
  site: string;
  company: string;
  supervisor: string;
  category: string[];
  requisition_limit: string;
  profile_picture?: string;
  role: {
    role_name: string;
    role_id: string;
    description: string;
    object: {
      object_name: string;
      activity: Activity[];
    }[];
    status: string;
    created_by: string;
    created_on: string;
    modified_by: string;
    modified_on: string;
  }[];
  substitute_user?: string;
  substitute_start_date?: string;
  substitute_end_date?: string;
  permissions: Permissions;
  active?: boolean;
}
export interface UserFormProps {
  user?: User;
  onSubmit: (user: User) => void;
  onCancel: () => void;
}
export interface SortConfig {
  key: keyof User | '';
  direction: 'asc' | 'desc';
}

export interface Filters {
  department: string;
  site: string;
  company: string;
  supervisor: string;
  category: string;
}
interface Activity {
  activity_name: string;
  status: boolean;
  data_field_actions: DataFieldAction[];
}
interface DataFieldAction {
  label: string;
  status: boolean;
  description: string;
}
