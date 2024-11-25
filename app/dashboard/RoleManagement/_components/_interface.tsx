export interface Role {
  role_name: string;
  role_id: string;
  description: string;
  object: RoleObject[];
  status: string; // This remains string for the overall role status
  created_by: string;
  created_on: string;
  modified_by: string;
  modified_on: string;
  icon?: any;
}

export interface RoleObject {
  object_name: string;
  activity: Activity[];
}
interface Activity {
  activity_name: string;
  status: boolean;
  data_field_actions: DataFieldAction[];
}

export interface DataFieldAction {
  label: string;
  status: boolean;
  description: string;
}
export interface ObjectManagementState {
  objects: RoleObject[];
  selectedObjectId: string | null;
  isCreatingObject: boolean;
  isEditingObject: boolean; // Added this
  isSearching: boolean;
  searchQuery: string;
  newObject: NewObject;
  editingObject: EditableObject | null; // Added this
}
export interface EditableActivity {
  activityName: string;
  status: boolean;
  dataFieldActions: DataFieldAction[];
}
export interface EditableObject {
  objectName: string;
  activities: EditableActivity[];
}

export interface NewObject {
  objectName: string;
  activityName: string;
  dataFieldActions: DataFieldAction[];
}
export interface FilterState {
  objects: string[];
  activities: string[];
  dataFieldActions: string[];
}
export const searchBarStyles = `
@keyframes slideRight {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.search-bar-enter {
  animation: slideRight 0.2s ease-out forwards;
}
`;
