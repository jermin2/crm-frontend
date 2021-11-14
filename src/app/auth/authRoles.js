/**
 * Authorization Roles
 */
const authRoles = {
  ROLE: {
    admin: 'admin',
    staff: 'staff',
    user: 'user',
    guest: 'guest',
  },
  admin: ['admin'],
  staff: ['admin', 'staff'],
  user: ['admin', 'staff', 'user'],
  onlyGuest: ['guest'],
};

export default authRoles;
