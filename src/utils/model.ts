export type UserModel = {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string | null;
  phone: string | null;
  account: {
    type: string;
    status: string;
    employee_id: string | null;
  };
  meta: {
    create_date: string;
    update_date: string;
    is_active: boolean;
  };
  extra: any | null;
};
