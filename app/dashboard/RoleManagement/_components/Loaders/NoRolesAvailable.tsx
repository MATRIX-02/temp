import React from 'react';
import ModernRoleSidebar from '../RoleComponents/RolesSidebar';

const NoRolesAvailable = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <ModernRoleSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          Role Management
        </h1>
        <p className="mt-20 text-center text-gray-500">
          No roles available. Create a new role to get started.
        </p>
      </main>
    </div>
  );
};

export default NoRolesAvailable;
