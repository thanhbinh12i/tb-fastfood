"use client";

import { useAppContext } from "@/components/app-provider";
import { toast } from "@/components/ui/use-toast";
import { decodeToken, generateSocketInstance } from "@/lib/utils";
import { useSetTokenToCookieMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function OAuthPage() {
  const { setRole, setSocket } = useAppContext();
  const count = useRef(0);
  const { mutateAsync } = useSetTokenToCookieMutation();
  const router = useRouter();
  const searchParam = useSearchParams();
  const accessToken = searchParam.get("accessToken");
  const refreshToken = searchParam.get("refreshToken");
  const message = searchParam.get("message");
  useEffect(() => {
    if (accessToken && refreshToken) {
      if (count.current === 0) {
        const { role } = decodeToken(accessToken);
        mutateAsync({ accessToken, refreshToken })
          .then(() => {
            setRole(role);
            setSocket(generateSocketInstance(accessToken));
            router.push("/manage/dashboard");
          })
          .catch((e) => {
            toast({
              description: e.message || "Có lỗi xảy ra",
            });
          });
      }
      count.current++;
    } else {
      if (count.current === 0) {
        setTimeout(() => {
          toast({
            description: message || "Có lỗi xảy ra",
          });
        });
        router.push("/login");
      }
      count.current++;
    }
  }, [
    accessToken,
    refreshToken,
    setRole,
    router,
    setSocket,
    message,
    mutateAsync,
  ]);
  return <div />;
}
