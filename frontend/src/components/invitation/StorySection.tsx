import { useI18n } from "@/lib/i18n";
import { IlluminatedRule } from "./IlluminatedRule";
import { PhotoPlate } from "./PhotoPlate";

/** The couple's story. `showPhotoPlaceholders` is only for the gallery
 * showcase — a real invitation has no photo upload yet, so it shows the
 * text alone rather than empty "photo coming soon" plates. */
export function StorySection({
  text,
  showPhotoPlaceholders = false,
}: {
  text: string;
  showPhotoPlaceholders?: boolean;
}) {
  const { t } = useI18n();

  return (
    <section className="paper-ground-deep px-6 sm:px-16 lg:px-24 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl flex flex-col items-center text-center">
        <h2 className="font-display text-3xl sm:text-4xl text-ink">
          {t.story.heading}
        </h2>
        <IlluminatedRule className="my-6" />
        <p className="font-body text-base sm:text-lg leading-relaxed text-ink-soft max-w-xl whitespace-pre-line">
          {text}
        </p>

        {showPhotoPlaceholders && (
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-14 w-full max-w-2xl">
            <PhotoPlate
              caption={t.story.photoCaptionA}
              placeholderNote={t.story.placeholderNote}
            />
            <PhotoPlate
              caption={t.story.photoCaptionB}
              placeholderNote={t.story.placeholderNote}
              className="sm:mt-10"
            />
          </div>
        )}
      </div>
    </section>
  );
}
