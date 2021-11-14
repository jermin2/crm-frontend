/**
 * Authorization Roles
 */
const authRoles = {
  ROLE: {
    admin: 'admin',
    staff: 'staff',
    user: 'user',
    unverified: 'unverified',
    guest: 'guest',
  },
  admin: ['admin'],
  staff: ['admin', 'staff'],
  user: ['admin', 'staff', 'user'],
  unverified: ['unverified'],
  onlyGuest: [],
};

export default authRoles;
