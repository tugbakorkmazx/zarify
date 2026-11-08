"use client";

import type { ComponentProps } from "react";
import { HerbaryumTemplate } from "./HerbaryumTemplate";
import { StorybookPreview } from "./StorybookPreview";

export const STORYBOOK_BACKGROUND = "flex min-h-svh flex-col bg-[linear-gradient(#4d4a3c3d,#4d4a3c3d),url(/storybook/background.png)] bg-[#a5a28b] bg-cover bg-center";

export function InvitationTemplate({
  templateSlug,
  timeLine,
  ...props
}: ComponentProps<typeof HerbaryumTemplate> & { templateSlug?: string; timeLine?: string }) {
  if (templateSlug === "hikaye-kitabi") {
    return <StorybookPreview timeLine={timeLine} {...props} />;
  }

  return <HerbaryumTemplate {...props} />;
}
