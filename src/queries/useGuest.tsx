import accountApiRequest from "@/apiRequests/account";
import guestApiRequest from "@/apiRequests/guest";
import { GetGuestListQueryParamsType } from "@/schemaValidations/account.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGuestLoginMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.login,
  });
};

export const useGuestLogoutMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.logout,
  });
};

export const useGuestOrderMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.order,
  });
};

export const useGuestGetOrderListQuery = () => {
  return useQuery({
    queryKey: ["guest-orders"],
    queryFn: guestApiRequest.getOrderList,
  });
};

export const useGuestListQuery = (queryParams: GetGuestListQueryParamsType) => {
  return useQuery({
    queryKey: ["guests", queryParams],
    queryFn: () => accountApiRequest.guestList(queryParams),
  });
};

export const useCreateGuestMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.createGuest,
  });
};
