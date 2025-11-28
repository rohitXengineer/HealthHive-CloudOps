// src/rbacConstants.js
export const ROLES = {
  ADMIN: "ADMIN",
  DOCTOR: "DOCTOR",
  NURSE: "NURSE",
  PATIENT: "PATIENT",
};

export const PERMISSIONS = {
  add_patient: [ROLES.ADMIN, ROLES.DOCTOR],
  edit_patient: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE],
  delete_patient: [ROLES.ADMIN],
  view_all_records: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE],
  view_own_record: [ROLES.PATIENT],
  manage_users: [ROLES.ADMIN],
  add_prescription: [ROLES.ADMIN, ROLES.DOCTOR],
  update_vitals: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE],
};
