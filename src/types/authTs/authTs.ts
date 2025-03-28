type DropdownOption = {
  value: number;
  label: string;
};

export type RegisterFormData = {
  address: string;
  farmerName: string; // Farmer's name
  farmName: string; // Farm name
  email: string; // Email address
  phone: string; // Phone number
  password: string; // Password
  region: DropdownOption | null; // Thana (or Sub-district) selection
  area: DropdownOption | null; // District selection
  teritory: DropdownOption | null; // District selection
};
