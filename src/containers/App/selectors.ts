import { createSelector } from 'reselect';
import type { ApplicationRootState } from 'types';

import { initialState } from './reducer';
import type { KeyValuePair, Role, User } from './types';


export const selectGlobal = (state?: Partial<ApplicationRootState>) => state?.global ?? initialState;

export const makeSelectUser = createSelector(selectGlobal, globalState => globalState.user);

/**
 * Selector that returns the list of permissions for the current user
 *
 * @returns {Object[]} - All permissions from assigned roles combined with extra permissions
 */
export const makeSelectUserPermissions = createSelector(makeSelectUser, (user: Partial<User>) => {
  const permissionMap = new Map<number, Role>();

  user?.roles?.flatMap<Role | undefined>(role => role.permissions)
    .concat(user.permissions)
    .forEach(permission => {
      if (permission) { permissionMap.set(permission.id, permission); }
    });

  return [...permissionMap.values()];
});

/**
 * Selector that returns the list of permission codes for the current user
 *
 * @returns {String[]} - All permissions from assigned roles combined with extra permissions
 */
export const makeSelectUserPermissionCodeNames = createSelector(makeSelectUserPermissions, permissions =>
  permissions.map(({ codename }) => codename)
);

/**
 * Selector that queries the user's permissions and returna a boolean
 * when that permission is present.
 *
 * @returns {Function}
 */
export const makeSelectUserCan = createSelector(
  [makeSelectUser, makeSelectUserPermissionCodeNames],
  ({ is_superuser }, permissions) =>
    /**
     * @param   {String} capability - The permission to check for
     * @returns {(Boolean|undefined)} - is_superuser can be one of undefined, true or false
     */
    (capability: string): (boolean | undefined) =>
      is_superuser !== false ? is_superuser : Boolean(permissions.find(codename => codename === capability))
);

/**
 * Selector that queries a subset of the user's permissions. Useful for determining
 * if a user should have access to a specific section of the application.
 *
 * @returns {Function}
 */
export const makeSelectUserCanAccess = createSelector(
  [makeSelectUser, makeSelectUserPermissionCodeNames],
  ({ is_superuser }, permissions) =>
    /**
     * @param   {String} section - The set of permissions to check for
     * @returns {(Boolean|undefined)} - is_superuser can be one of undefined, true or false
     */
    (section: string): (boolean | undefined) => {
      if (is_superuser !== false) {
        return is_superuser;
      }

      const groups = ['view_group', 'change_group', 'add_group'];
      const groupForm = ['change_group', 'add_group'];
      const users = ['view_user', 'add_user', 'change_user'];
      const userForm = ['add_user', 'change_user'];
      const departments = ['view_department', 'change_department', 'add_department'];
      const departmentForm = ['change_department', 'add_department'];
      const categories = ['view_category', 'change_category', 'add_category'];
      const categoryForm = ['add_category', 'change_category'];

      const requiredPerms = {
        settings: [groups, users],
        groups: [groups],
        groupForm: [groupForm],
        users: [users],
        userForm: [userForm],
        departments: [departments],
        departmentForm: [departmentForm],
        categories: [categories],
        categoryForm: [categoryForm],
      };

      if (!Object.keys(requiredPerms).includes(section)) {
        return false;
      }

      const sectionPermissions: string[][] = requiredPerms[section as keyof typeof requiredPerms];

      // require all sets of permissions
      return Boolean(sectionPermissions.every((sectionPerms: string[]) =>
        // from each set, require at least one permission
        sectionPerms.some((perm: string) => permissions.includes(perm))
      ));
    }
);

export const makeSelectLoading = () => createSelector(selectGlobal, globalState => globalState?.loading);

export const makeSelectError = () => createSelector(selectGlobal, globalState => globalState?.error);

export const makeSelectNotification = () =>
  createSelector(selectGlobal, globalState => globalState?.notification);

export const makeSelectSearchQuery = createSelector(selectGlobal, globalState => globalState?.searchQuery);

export const makeSelectSources = createSelector(selectGlobal, globalState =>
  globalState?.sources.length ? globalState
    .sources.map(({ name }): KeyValuePair<string> => ({
      key: name,
      value: name,
    }))
    : null
);
