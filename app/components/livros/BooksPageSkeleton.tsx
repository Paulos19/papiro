import { Skeleton } from "@/components/ui/skeleton";

export function BooksPageSkeleton() {
  return (
    <div>
      {/* Skeleton dos Filtros */}
      <Skeleton className="h-40 w-full mb-8" />
      
      {/* Skeleton do Header da Lista */}
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-6 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>

      {/* Skeleton da Grade de Livros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-[3/4] w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-10 w-full mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}