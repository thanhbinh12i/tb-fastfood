import { checkAndRefreshToken } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const UNAUTHENTICATED_PATH = ["/login", "/register", "/refresh-token", "/"];
export default function RefreshToken() {
  const pathName = usePathname();
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathName)) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let interval: any = null;
    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval);
      },
    });
    // Phải gọi lần đầu tiên, vì interval sẽ chạy sau thời gian TIMEOUT
    // Timeout interval phải bé hơn thời gian hết hạn của access token
    const TIMEOUT = 1000;
    interval = setInterval(checkAndRefreshToken, TIMEOUT);
    return () => clearInterval(interval);
  }, [pathName]);

  return null;
}
