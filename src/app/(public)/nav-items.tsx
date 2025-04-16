"use client";

import { useAppContext } from "@/components/app-provider";
import { Role } from "@/constants/type";
import { cn, handleErrorApi } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useGuestLogoutMutation } from "@/queries/useGuest";
import { RoleType } from "@/types/jwt.types";
import Link from "next/link";
import { useRouter } from "next/navigation";

const menuItems: {
  title: string;
  href: string;
  role?: RoleType[];
  hideWhenLogin?: boolean;
}[] = [
  {
    title: "Trang chủ",
    href: "/menu",
  },
  {
    title: "Menu",
    href: "/guest/menu",
    role: [Role.Guest],
  },
  {
    title: "Đơn hàng",
    href: "/orders",
  },
  {
    title: "Đăng nhập",
    href: "/login",
    hideWhenLogin: true,
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    role: [Role.Employee, Role.Owner],
  },
];

export default function NavItems({ className }: { className?: string }) {
  const { role, setRole } = useAppContext();
  const router = useRouter();
  const logoutMutation = useLogoutMutation();
  const guestLogoutMutation = useGuestLogoutMutation();
  const logout = async () => {
    if (logoutMutation.isPending || guestLogoutMutation.isPending) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      role === Role.Guest
        ? await guestLogoutMutation.mutateAsync()
        : await logoutMutation.mutateAsync();
      setRole();
      router.push("/");
    } catch (error) {
      handleErrorApi({ error });
    }
  };
  return (
    <>
      {menuItems.map((item) => {
        // Trường hợp đăng nhập thì chỉ hiển thị menu đăng nhập
        const isAuth = item.role && role && item.role.includes(role);
        // Trường hợp menu item có thể hiển thị dù cho đã đăng nhập hay chưa
        const canShow =
          (item.role === undefined && !item.hideWhenLogin) ||
          (!role && item.hideWhenLogin);
        if (isAuth || canShow) {
          return (
            <Link href={item.href} key={item.href} className={className}>
              {item.title}
            </Link>
          );
        }
        return null;
      })}
      {role && (
        <div className={cn(className, "cursor-pointer")} onClick={logout}>
          Đăng xuất
        </div>
      )}
    </>
  );
}
