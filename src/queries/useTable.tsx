import tableApiRequests from "@/apiRequests/table";
import { UpdateTableBodyType } from "@/schemaValidations/table.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetTableList = () => {
  return useQuery({
    queryKey: ["tables"],
    queryFn: tableApiRequests.list,
  });
};

export const useGetTable = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["tables", id],
    queryFn: () => tableApiRequests.getTable(id),
    enabled,
  });
};

export const useAddTableMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tableApiRequests.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });
};

export const useUpdateTableMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: number } & UpdateTableBodyType) => {
      return tableApiRequests.updateTable(id, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"], exact: true });
    },
  });
};

export const useDeleteTableMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tableApiRequests.deleteTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });
};
