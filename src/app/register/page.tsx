"use client";
import AppBarLogin from "@/components/dashboard/AppBarLogin";
import UserRegister from "@/components/register/UserRegister";

export default function PublicRegisterPage() {
  return (
    <div>
      <AppBarLogin />
      <UserRegister />;
    </div>
  );
}
