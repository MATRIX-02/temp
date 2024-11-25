import { User } from '@/app/dashboard/UserManagement/_components/_utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define the TypeScript types for each part of the user data

// Initial state based on your data
const initialState: User[] = [
  {
    first_name: 'Emma',
    last_name: 'Brown',
    email: 'emma.brown@company.com',
    employee_id: 'EMP004',
    start_date: '2020-11-03',
    department: 'Finance',
    site: 'Chicago',
    company: 'Finovate',
    supervisor: 'Tom Harris',
    category: ['Full-time', 'Remote'],
    requisition_limit: '20000',
    role: [
      {
        role_name: 'Procurement Controller',
        role_id: 'PROC_CON_001',
        description: 'Manages procurement activities',
        object: [
          {
            object_name: 'Purchase Requisition',
            activity: [
              {
                activity_name: 'Create Requisition',
                status: true,
                data_field_actions: [
                  {
                    label: 'Add SKU',
                    status: true,
                    description: 'Create a new purchase requisition'
                  },
                  {
                    label: 'Add / Modify Cost Center',
                    status: true,
                    description: 'Edit an existing purchase requisition'
                  },
                  {
                    label: 'Add/Modify GL',
                    status: true,
                    description: 'Mark a purchase requisition for deletion'
                  },
                  {
                    label: 'Add / Modify supplier',
                    status: true,
                    description: 'Approve a purchase requisition'
                  },
                  {
                    label: 'Add / Modify Special Instructions',
                    status: true,
                    description: 'Track the status of a purchase requisition'
                  },
                  {
                    label: 'Add / Modify Supplier Instructions',
                    status: true,
                    description: 'Track the status of a purchase requisition'
                  }
                ]
              },
              {
                activity_name: 'Edit Requisition',
                status: true,
                data_field_actions: [
                  {
                    label: 'Add a new line item',
                    status: true,
                    description: 'Create a new purchase requisition'
                  },
                  {
                    label: 'Edit SKU',
                    status: true,
                    description: 'Edit an existing purchase requisition'
                  },
                  {
                    label: 'Mark for Deletion line item',
                    status: true,
                    description: 'Track the status of a purchase requisition'
                  }
                ]
              }
            ]
          },
          {
            object_name: 'Purchase Order',
            activity: [
              {
                activity_name: 'Create Order',
                status: true,
                data_field_actions: [
                  {
                    label: 'Create Order',
                    status: true,
                    description: 'Create a new purchase order'
                  },
                  {
                    label: 'Edit Order',
                    status: true,
                    description: 'Edit an existing purchase order'
                  },
                  {
                    label: 'Approve',
                    status: true,
                    description: 'Approve a purchase order'
                  },
                  {
                    label: 'Monitor Order',
                    status: true,
                    description: 'Monitor the status of a purchase order'
                  }
                ]
              }
            ]
          }
        ],
        status: 'Inactive',
        created_by: 'John Doe',
        created_on: '2023-04-15',
        modified_by: 'Jane Smith',
        modified_on: '2023-06-01'
      }
    ],
    substitute_user: 'Jessica Turner',
    substitute_start_date: '2024-09-01',
    substitute_end_date: '2024-10-15',
    permissions: {
      own: [
        {
          name: 'Create Requisition',
          status: true,
          department: ['Finance'],
          site: ['Chicago'],
          company: ['Finovate'],
          category: ['Full-time', 'Remote']
        },
        {
          name: 'Create Requisition',
          status: true,
          department: ['Finance'],
          site: ['Chicago'],
          company: ['Finovate'],
          category: ['Full-time', 'Remote']
        }
      ],
      other: [
        {
          name: 'Monitor Order',
          status: true,
          department: ['Finance'],
          site: ['Chicago'],
          company: ['Finovate']
        },
        {
          name: 'Monitor Order',
          status: true,
          department: ['Finance'],
          site: ['Chicago'],
          company: ['Finovate']
        },
        {
          name: 'Monitor Order',
          status: true,
          department: ['Finance'],
          site: ['Chicago'],
          company: ['Finovate']
        }
      ]
    },
    active: true
  },
  {
    first_name: 'Liam',
    last_name: 'Smith',
    email: 'liam.smith@company.com',
    employee_id: 'EMP005',
    start_date: '2019-07-21',
    department: 'Operations',
    site: 'New York',
    company: 'TechCorp',
    supervisor: 'Rachel Adams',
    category: ['Part-time'],
    requisition_limit: '15000',
    role: [
      {
        role_name: 'Procurement Manager',
        role_id: 'PROC_MGR_001',
        description: 'Manages procurement team',
        object: [
          {
            object_name: 'Supplier Management',
            activity: [
              {
                activity_name: 'Discover Suppliers',
                status: true,
                data_field_actions: [
                  {
                    label: 'Discover Suppliers',
                    status: true,
                    description: 'Discover new suppliers'
                  },
                  {
                    label: 'Monitor Supplier Performance',
                    status: true,
                    description: 'Monitor the performance of suppliers'
                  },
                  {
                    label: 'Approve Suppliers',
                    status: true,
                    description: 'Approve new suppliers'
                  }
                ]
              }
            ]
          },
          {
            object_name: 'Contract Negotiation',
            activity: [
              {
                activity_name: 'Negotiate Terms',
                status: true,
                data_field_actions: [
                  {
                    label: 'Negotiate Terms',
                    status: true,
                    description: 'Negotiate contract terms with suppliers'
                  },
                  {
                    label: 'Review Contracts',
                    status: true,
                    description: 'Review contracts for compliance and standards'
                  },
                  {
                    label: 'Approve Contract',
                    status: true,
                    description: 'Approve finalized contract terms'
                  }
                ]
              }
            ]
          }
        ],
        status: 'Active',
        created_by: 'John Smith',
        created_on: '2023-03-01',
        modified_by: 'Jane Doe',
        modified_on: '2023-05-15'
      }
    ],
    substitute_user: 'James Lee',
    substitute_start_date: '2023-06-01',
    substitute_end_date: '2023-09-01',
    permissions: {
      own: [
        {
          name: 'Create Requisition',
          status: true,
          department: ['Finance'],
          site: ['Chicago'],
          company: ['Finovate'],
          category: ['Full-time', 'Remote']
        },
        {
          name: 'Create Requisition',
          status: true,
          department: ['Finance'],
          site: ['Chicago'],
          company: ['Finovate'],
          category: ['Full-time', 'Remote']
        }
      ],
      other: [
        {
          name: 'Monitor Order',
          status: true,
          department: ['Finance'],
          site: ['Chicago'],
          company: ['Finovate']
        },
        {
          name: 'Monitor Order',
          status: true,
          department: ['Finance'],
          site: ['Chicago'],
          company: ['Finovate']
        },
        {
          name: 'Monitor Order',
          status: true,
          department: ['Finance'],
          site: ['Chicago'],
          company: ['Finovate']
        }
      ]
    },
    active: true
  },
  {
    first_name: 'Sophia',
    last_name: 'Taylor',
    email: 'sophia.taylor@company.com',
    employee_id: 'EMP006',
    start_date: '2022-05-10',
    department: 'Human Resources',
    site: 'San Francisco',
    company: 'GlobalSolutions',
    supervisor: 'Michael Clark',
    category: ['Full-time'],
    requisition_limit: '30000',
    role: [
      {
        role_name: 'Material Planner',
        role_id: 'MAT_PLAN_001',
        description: 'Plans and manages material inventory',
        object: [
          {
            object_name: 'Inventory Management',
            activity: [
              {
                activity_name: 'Monitor Stock Levels',
                status: true,
                data_field_actions: [
                  {
                    label: 'Monitor Stock Levels',
                    status: true,
                    description: 'Monitor the levels of material inventory'
                  },
                  {
                    label: 'Replenish Inventory',
                    status: true,
                    description: 'Replenish material inventory'
                  }
                ]
              }
            ]
          },
          {
            object_name: 'Demand Forecasting',
            activity: [
              {
                activity_name: 'Analyze Demand',
                status: true,
                data_field_actions: [
                  {
                    label: 'Analyze Demand',
                    status: true,
                    description: 'Analyze product demand for inventory planning'
                  },
                  {
                    label: 'Plan Inventory',
                    status: true,
                    description:
                      'Plan inventory levels based on forecasted demand'
                  }
                ]
              }
            ]
          }
        ],
        status: 'Active',
        created_by: 'Jane Johnson',
        created_on: '2023-02-01',
        modified_by: 'John Brown',
        modified_on: '2023-04-30'
      }
    ],
    substitute_user: 'Sarah Johnson',
    substitute_start_date: '2023-12-01',
    substitute_end_date: '2024-01-15',
    permissions: {
      own: [
        {
          name: 'Create Requisition',
          status: true,
          department: ['Finance'],
          site: ['Chicago'],
          company: ['Finovate'],
          category: ['Full-time', 'Remote']
        },
        {
          name: 'Create Requisition',
          status: true,
          department: ['Finance'],
          site: ['Chicago'],
          company: ['Finovate'],
          category: ['Full-time', 'Remote']
        }
      ],
      other: [
        {
          name: 'Monitor Order',
          status: true,
          department: ['Finance'],
          site: ['Chicago'],
          company: ['Finovate']
        },
        {
          name: 'Monitor Order',
          status: true,
          department: ['Finance'],
          site: ['Chicago'],
          company: ['Finovate']
        },
        {
          name: 'Monitor Order',
          status: true,
          department: ['Finance'],
          site: ['Chicago'],
          company: ['Finovate']
        }
      ]
    },
    active: true
  }
];

// Create the slice
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.findIndex(
        (user) => user.employee_id === action.payload.employee_id
      );
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    updateProfilePicture: (
      state,
      action: PayloadAction<{ profile_picture: string; employee_id: string }>
    ) => {
      const index = state.findIndex(
        (user) => user.employee_id === action.payload.employee_id
      );
      if (index !== -1) {
        state[index].profile_picture = action.payload.profile_picture;
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      return state.filter((user) => user.employee_id !== action.payload);
    }
  }
});

// Export actions and reducer
export const { addUser, updateUser, deleteUser, updateProfilePicture } =
  userSlice.actions;
export const usersSelector = (state: RootState) => state.users;

export default userSlice.reducer;
