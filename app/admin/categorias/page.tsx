import prisma from "@/lib/prisma";
import { CategoriesClientPage } from "./CategoriesClientPage";

// 1. A página principal agora é um Server Component.
// Sua única responsabilidade é buscar os dados iniciais.
export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
    include: {
      _count: {
        select: { books: true },
      },
    },
  });

  // 2. Passamos os dados para um Client Component que cuidará de toda a interatividade.
  return <CategoriesClientPage initialCategories={categories} />;
}