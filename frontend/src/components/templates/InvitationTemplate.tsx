"use client";

import type { ComponentProps } from "react";
import { HerbaryumTemplate } from "./HerbaryumTemplate";
import { StorybookPreview } from "./StorybookPreview";

export const STORYBOOK_BACKGROUND = "relative isolate flex min-h-svh flex-col before:pointer-events-none before:fixed before:inset-0 before:-z-10 before:bg-[linear-gradient(#4d4a3c3d,#4d4a3c3d),url(/storybook/background.png)] before:bg-[#a5a28b] before:bg-cover before:bg-center";

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
