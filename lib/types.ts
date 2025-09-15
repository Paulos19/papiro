import { Book, Category } from '@prisma/client';

/**
 * Este tipo representa um objeto 'Book' completo, com a relação 'category' incluída.
 */
export type BookWithCategory = Book & { category: Category };

/**
 * Este é o tipo que usamos para passar dados de Server para Client Components.
 * Ele pega o livro completo com sua categoria, remove o campo 'price' (que é um Decimal),
 * e o adiciona de volta como um 'number'.
 */
export type BookForClient = Omit<BookWithCategory, 'price'> & {
  price: number;
};