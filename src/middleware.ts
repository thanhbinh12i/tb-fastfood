import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Role } from "./constants/type";
import { TokenPayload } from "./types/jwt.types";
import jwt from "jsonwebtoken";

const managePaths = ["/manage"];
const guestPaths = ["/guest"];
const onlyOwnerPaths = ["/manage/accounts"];
const privatePaths = [...managePaths, ...guestPaths];
const unAuthPaths = ["/login"];

const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload;
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  //No auth
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("clearTokens", "true");
    return NextResponse.redirect(url);
  }
  if (refreshToken) {
    //Auth
    if (unAuthPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    //access token het han
    if (
      privatePaths.some((path) => pathname.startsWith(path)) &&
      !accessToken
    ) {
      const url = new URL("/refresh-token", request.url);
      url.searchParams.set("refreshToken", refreshToken);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    //k dung role
    const role = decodeToken(refreshToken).role;
    const isGuestGoToManagePaths =
      role === Role.Guest &&
      managePaths.some((path) => pathname.startsWith(path));
    const isNotGuestGoToGuestPaths =
      role !== Role.Guest &&
      guestPaths.some((path) => pathname.startsWith(path));
    const isNotOwnerGoToOwnerPaths =
      role !== Role.Owner &&
      onlyOwnerPaths.some((path) => pathname.startsWith(path));
    if (
      isGuestGoToManagePaths ||
      isNotGuestGoToGuestPaths ||
      isNotOwnerGoToOwnerPaths
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/manage/:path*", "/guest/:path*", "/login"],
};
