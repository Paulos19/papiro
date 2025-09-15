import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import * as XLSX from 'xlsx';
import { Prisma } from '@prisma/client';

export async function POST(request: Request) {
  // 1. SEGURANÇA: Garante que apenas um administrador logado pode executar esta ação.
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ errors: ['Não autorizado'] }, { status: 401 });
  }

  try {
    // 2. RECEBIMENTO E LEITURA DO ARQUIVO
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ errors: ['Nenhum arquivo enviado'] }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    // 3. PREPARAÇÃO: Inicializa contadores e a lista de operações para a transação.
    let errorCount = 0;
    const errors: string[] = [];
    const operations: Prisma.PrismaPromise<any>[] = [];
    
    const requiredColumns = [
      'Autor*', 'Título*', 'Editora*', 'Ano*', 'Estante*', 'Preço*', 'Conservação: Descrição*'
    ];

    // 4. PROCESSAMENTO E VALIDAÇÃO (LINHA POR LINHA)
    for (const [index, row] of data.entries()) {
      const rowIndex = index + 2;
      const rowData = row as any;

      // Validação de colunas obrigatórias
      const missingColumns = requiredColumns.filter(col => !rowData[col]);
      if (missingColumns.length > 0) {
        errors.push(`Linha ${rowIndex}: Colunas obrigatórias faltando: ${missingColumns.join(', ')}.`);
        errorCount++;
        continue;
      }
      
      // Validação do formato do preço
      const priceString = String(rowData['Preço*']).replace(',', '.');
      if (isNaN(parseFloat(priceString))) {
        errors.push(`Linha ${rowIndex}: O valor na coluna "Preço*" (${rowData['Preço*']}) não é um número válido.`);
        errorCount++;
        continue;
      }
      
      const bookISBN = rowData['ISBN/ISSN']?.toString() || null;

      // Mapeia os dados da linha para o formato esperado pelo Prisma
      const bookData = {
        title:                rowData['Título*'].toString(),
        author:               rowData['Autor*'].toString(),
        publisher:            rowData['Editora*'].toString(),
        publicationYear:      parseInt(rowData['Ano*']),
        price:                new Prisma.Decimal(priceString),
        conditionDescription: rowData['Conservação: Descrição*'].toString(),
        description:          rowData['Sinopse']?.toString() || null, // Adicionando sinopse se houver
        stock:                rowData['Estoque'] ? parseInt(rowData['Estoque']) : 1,
        weightInGrams:        rowData['Peso (g)'] ? parseInt(rowData['Peso (g)']) : null,
        bookType:             rowData['Tipo de publicação: Revista/Livro']?.toString() || null,
        condition:            rowData['Tipo: Novo/Usado']?.toString() || null,
        edition:              rowData['Edição Número']?.toString() || null,
        language:             rowData['Idioma']?.toString() || null,
        binding:              rowData['Acabamento']?.toString() || null,
        subject:              rowData['Assunto']?.toString() || null,
        location:             rowData['Localização']?.toString() || null,
        // --- MAPEAMENTO DA IMAGEM DA CAPA ---
        coverImageUrl:        rowData['URL_CAPA']?.toString() || null,
      };

      const categoryData = {
        connectOrCreate: {
          where: { name: rowData['Estante*'].toString() },
          create: { name: rowData['Estante*'].toString() },
        },
      };

      // 5. LÓGICA DE "UPSERT": Decide se deve criar um novo livro ou atualizar um existente.
      if (bookISBN) {
        operations.push(prisma.book.upsert({
          where: { isbn: bookISBN },
          update: bookData,
          create: { ...bookData, isbn: bookISBN, category: categoryData },
        }));
      } else {
        operations.push(prisma.book.create({ 
          data: { ...bookData, category: categoryData }
        }));
      }
    }

    // 6. TRANSAÇÃO ATÔMICA: Executa todas as operações preparadas de uma só vez.
    if (operations.length > 0) {
      const transactionResult = await prisma.$transaction(operations);
      const successCount = transactionResult.length;
      return NextResponse.json({ successCount, errorCount, errors });
    }

    // Caso nenhum livro válido seja encontrado na planilha
    return NextResponse.json({ successCount: 0, errorCount, errors });

  } catch (error) {
    console.error("Erro na importação:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
       return NextResponse.json({ errors: [`Ocorreu um erro no banco de dados. Código: ${error.code}. Verifique se os dados da planilha são válidos.`] }, { status: 400 });
    }
    return NextResponse.json({ errors: ['Ocorreu um erro inesperado no servidor.'] }, { status: 500 });
  }
}