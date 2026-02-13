import { AccountDocumentType } from "@/types/account/account.type";
import { model, Model, Schema } from "mongoose";

const AccountSchema = new Schema<AccountDocumentType>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: Boolean, required: true },
  },
  { timestamps: true },
);

const Account: Model<AccountDocumentType> = model<
  AccountDocumentType,
  Model<AccountDocumentType>
>("accounts", AccountSchema);

export default Account;
