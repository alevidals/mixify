import { Outlet } from "@remix-run/react";

export default function AuthLayout() {
  return (
    <div className="h-dvh flex flex-col items-center justify-center">
      <main className="max-w-sm w-full">
        <Outlet />
      </main>
    </div>
  );
}
