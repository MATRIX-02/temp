'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
export const users: User[] = [
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
    role: ['Software Engineer'],
    substitute_user: 'Jessica Turner',
    substitute_start_date: '2024-09-01',
    substitute_end_date: '2024-10-15',
    permissions: {
      own: [
        { name: 'Create Own', status: true },
        { name: 'View Own', status: true },
        { name: 'Analyze Own', status: true }
      ],
      other: [
        {
          name: 'View Other',
          status: true,
          department: ['Finance', 'Operations'],
          site: ['Chicago', 'New York'],
          company: ['Finovate'],
          category: ['Remote']
        },
        {
          name: 'Analyze Other',
          status: true,
          department: ['Finance'],
          site: ['Chicago'],
          company: ['Finovate'],
          category: ['Full-time']
        }
      ]
    },
    active: true
  }
  // Add more sample users as needed
];

// UserForm.tsx

interface UserFormProps {
  user?: User;
  onSubmit: (user: User) => void;
  onCancel: () => void;
}
export const departments = [
  'Finance',
  'Operations',
  'IT',
  'HR',
  'Sales',
  'Marketing'
];
export const sites = [
  'Chicago',
  'New York',
  'San Francisco',
  'London',
  'Singapore'
];
export const companies = ['Finovate', 'TechCorp', 'GlobalFin'];
export const categories = ['Full-time', 'Part-time', 'Remote', 'Contract'];
export const roles = ['Software Engineer', 'Manager', 'Director', 'Analyst'];

// UserForm.tsx
import React from 'react';

import { Input } from '@/components/ui/input';

import { Button } from '@/components/ui/button';
import { User } from './_utils';

interface UserFormProps {
  user?: User;
  onSubmit: (user: User) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = React.useState<User>(
    user || {
      first_name: '',
      last_name: '',
      email: '',
      employee_id: '',
      start_date: '',
      department: '',
      site: '',
      company: '',
      supervisor: '',
      category: [],
      requisition_limit: '',
      role: [],
      permissions: {
        own: [],
        other: []
      },
      active: true
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">First Name</label>
          <Input
            value={formData.first_name}
            onChange={(e) =>
              setFormData({ ...formData, first_name: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Last Name</label>
          <Input
            value={formData.last_name}
            onChange={(e) =>
              setFormData({ ...formData, last_name: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Employee ID</label>
          <Input
            value={formData.employee_id}
            onChange={(e) =>
              setFormData({ ...formData, employee_id: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Start Date</label>
          <Input
            type="date"
            value={formData.start_date}
            onChange={(e) =>
              setFormData({ ...formData, start_date: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Department</label>
          <Select
            value={formData.department}
            onValueChange={(value) =>
              setFormData({ ...formData, department: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Site</label>
          <Select
            value={formData.site}
            onValueChange={(value) => setFormData({ ...formData, site: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select site" />
            </SelectTrigger>
            <SelectContent>
              {sites.map((site) => (
                <SelectItem key={site} value={site}>
                  {site}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Company</label>
          <Select
            value={formData.company}
            onValueChange={(value) =>
              setFormData({ ...formData, company: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company} value={company}>
                  {company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Categories</label>
          <Select
            multiple
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Roles</label>
          <Select
            multiple
            value={formData.role}
            onValueChange={(value) => setFormData({ ...formData, role: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select roles" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Requisition Limit</label>
          <Input
            type="number"
            value={formData.requisition_limit}
            onChange={(e) =>
              setFormData({ ...formData, requisition_limit: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Substitute Information</label>
        <div className="grid grid-cols-3 gap-4">
          <Input
            placeholder="Substitute User"
            value={formData.substitute_user || ''}
            onChange={(e) =>
              setFormData({ ...formData, substitute_user: e.target.value })
            }
          />
          <Input
            type="date"
            placeholder="Start Date"
            value={formData.substitute_start_date || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                substitute_start_date: e.target.value
              })
            }
          />
          <Input
            type="date"
            placeholder="End Date"
            value={formData.substitute_end_date || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                substitute_end_date: e.target.value
              })
            }
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{user ? 'Update User' : 'Create User'}</Button>
      </div>
    </form>
  );
};
