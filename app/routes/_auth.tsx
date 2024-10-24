import { Outlet } from "@remix-run/react";

export default function AuthLayout() {
  return (
    <div className="h-dvh flex flex-col items-center justify-center">
      <header className="text-3xl font-bold border-b mb-4">AuthHeader</header>
      <main className="max-w-sm w-full">
        <Outlet />
      </main>
    </div>
  );
}
