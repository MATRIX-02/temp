import { Role } from './_interface';

export const extractUniqueValues = (roles: Role[]) => {
  const objects = new Set<string>();
  const activities = new Set<string>();
  const dataFieldActions = new Set<string>();

  roles.forEach((role) => {
    role.object?.forEach((obj) => {
      objects.add(obj.object_name);
      obj.activity.forEach((activity) => {
        // Add all activities regardless of status
        activities.add(activity.activity_name);
        activity.data_field_actions.forEach((action) => {
          // Add all data field actions regardless of status
          dataFieldActions.add(action.label);
        });
      });
    });
  });

  return {
    objects: Array.from(objects),
    activities: Array.from(activities),
    dataFieldActions: Array.from(dataFieldActions)
  };
};
