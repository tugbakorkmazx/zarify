import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DoubleRule } from "@/components/herbarium/DoubleRule";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { eventCategories, getEventCategory, templates } from "@/lib/templates";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return eventCategories.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getEventCategory(slug);
  if (!category) return { title: "Kategori bulunamadı — Zarify" };
  return {
    title: `${category.name} Davetiye Şablonları — Zarify`,
    description: `${category.name} için dijital davetiye şablonlarını keşfedin.`,
  };
}

export default async function CategoryTemplatesPage({ params }: Props) {
  const { slug } = await params;
  const category = getEventCategory(slug);
  if (!category) notFound();

  const categoryTemplates = templates.filter((template) => template.categorySlug === slug);

  return (
    <main className="paper-ground min-h-svh px-5 pt-5 pb-24 sm:px-10 sm:pt-7">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <Link href="/sablonlar" className="apparatus text-sm text-soot-soft transition-colors hover:text-wine">
            ← Tüm kategoriler
          </Link>
          <Link href="/" className="apparatus text-sm text-soot-soft transition-colors hover:text-wine">
            Ana sayfa
          </Link>
        </div>
        <DoubleRule className="mt-4 text-soot" />
        <div className="mx-auto mt-16 max-w-2xl text-center">
          <p className="apparatus text-xs uppercase tracking-[0.2em] text-wine">Davetiye şablonları</p>
          <h1 className="mt-4 font-display text-4xl text-soot sm:text-6xl">{category.name}</h1>
          <p className="mt-5 font-body text-lg leading-relaxed text-soot-soft">
            {categoryTemplates.length > 0
              ? "Size uygun tasarımı seçin ve davetiyenizi kişiselleştirin."
              : "Bu kategori için şablonlarımız hazırlanıyor. Yeni tasarımlar eklendiğinde burada görünecek."}
          </p>
        </div>
        {categoryTemplates.length > 0 && (
          <div className="mx-auto mt-12 grid max-w-3xl gap-8">
            {categoryTemplates.map((template) => (
              <TemplateCard key={template.slug} template={template} />
            ))}
          </div>
        )}
        <div className="mt-14 text-center">
          <Link href="/sablonlar" className="apparatus text-sm text-wine underline underline-offset-4">
            Diğer davet türlerini incele
          </Link>
        </div>
      </div>
    </main>
  );
}
