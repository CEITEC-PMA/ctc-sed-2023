import CandidatoForm from "@/components/register/CandidatoForm";
import React from "react";

export default function CandidatoRegisterPage({
  params,
}: {
  params: { id: string };
}) {
  // return <CandidatoForm id={params.id} />;
  return <CandidatoForm />;
}
