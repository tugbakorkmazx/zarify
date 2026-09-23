import type { Metadata } from "next";
import { InvitationDetailsForm } from "@/components/invitation-details/InvitationDetailsForm";

export const metadata: Metadata = {
  title: "Davetiye Bilgileri — Zarify",
};

export default function InvitationDetailsPage() {
  return <InvitationDetailsForm />;
}
