import { Document } from "mongoose";

export type AccountType = {
  name: string;
  email: string;
  password: string;
  status: boolean;
};

export type AccountFilterType = Partial<AccountType>;

export type AccountDocumentType = AccountType & Document;
