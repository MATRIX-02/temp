import { RoleObject } from '../../RoleManagement/_components/_interface';

export const objectData: RoleObject[] = [
  {
    object_name: 'Purchase Requisition',
    id: '1',
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
            label: 'Add / Modify Cost Center',
            status: true,
            description: 'Mark a purchase requisition for deletion'
          },
          {
            label: 'Add/Modify GL',
            status: true,
            description: 'Approve a purchase requisition'
          },
          {
            label: 'Add / Modify supplier',
            status: true,
            description: 'Track the status of a purchase requisition'
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
    id: '2',
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
          },
          {
            label: 'Recieved Order',
            status: true,
            description: 'Recieved the status of a purchase order'
          }
        ]
      }
    ]
  }
];
