import http from "@/lib/http";
import {
  AccountResType,
  ChangePasswordBodyType,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";

const accountApiRequest = {
  me: () => http.get<AccountResType>("/accounts/me"),
  updateme: (body: UpdateMeBodyType) =>
    http.put<AccountResType>("/accounts/me", body),
  changepassword: (body: ChangePasswordBodyType) =>
    http.put<AccountResType>("/accounts/change-password", body),
};

export default accountApiRequest;
