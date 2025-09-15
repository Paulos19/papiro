'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from "@/components/ui/progress";
import * as XLSX from 'xlsx';
import { importBooksAction } from '../actions';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export function ImportForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentBook, setCurrentBook] = useState('');
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null);
  
  // Usamos um 'ref' para controlar o cancelamento dentro do processo assíncrono
  const importCancelled = useRef(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      setImportResult(null);
      setProgress(0);
      setCurrentBook('');
    }
  };

  const handleCancelImport = () => {
    importCancelled.current = true; // Define o sinal de cancelamento
    setIsImporting(false);
    setProgress(0);
    setCurrentBook('');
    toast.info("A importação foi cancelada pelo usuário.");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      toast.error('Por favor, selecione um arquivo para importar.');
      return;
    }

    setIsImporting(true);
    setImportResult(null);
    setProgress(0);
    importCancelled.current = false; // Reseta o sinal de cancelamento
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any[] = XLSX.utils.sheet_to_json(worksheet);

        const totalBooks = json.length;
        if (totalBooks === 0) {
          toast.error('A planilha parece estar vazia.');
          setIsImporting(false);
          return;
        }
        
        const booksToImport = json.map(row => ({
          title: row['Título*']?.toString() || 'Sem Título',
          author: row['Autor*']?.toString() || 'Desconhecido',
          publisher: row['Editora*']?.toString() || null,
          publicationYear: row['Ano*'] ? parseInt(row['Ano*']) : null,
          price: parseFloat(String(row['Preço*']).replace(',', '.')) || 0,
          conditionDescription: row['Conservação: Descrição*']?.toString() || null,
          stock: row['Estoque'] ? parseInt(row['Estoque']) : 1,
          isbn: row['ISBN/ISSN']?.toString() || null,
          coverImageUrl: row['URL_CAPA']?.toString() || null,
          categoryName: row['Estante*']?.toString() || 'Sem Categoria',
        }));

        // Simula o processamento com animação, verificando o cancelamento a cada passo
        for (let i = 0; i < totalBooks; i++) {
          if (importCancelled.current) {
            console.log("Processo de leitura cancelado.");
            return; // Interrompe o loop
          }
          setCurrentBook(booksToImport[i].title);
          setProgress(((i + 1) / totalBooks) * 100);
          await new Promise(resolve => setTimeout(resolve, 50)); 
        }
        
        // Verificação final antes de enviar para o servidor
        if (importCancelled.current) {
          console.log("Envio para o servidor cancelado.");
          return;
        }
        
        const result = await importBooksAction(booksToImport);
        setImportResult(result);

        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }

      } catch (error) {
        toast.error("Ocorreu um erro ao ler o arquivo da planilha.");
      } finally {
        setIsImporting(false);
        setCurrentBook('');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Importar Livros</CardTitle>
        <CardDescription>
          Faça o upload de uma planilha (.xlsx ou .csv) para adicionar livros em massa.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="spreadsheet">Planilha</Label>
            <Input id="spreadsheet" type="file" onChange={handleFileChange} accept=".xlsx, .csv" disabled={isImporting} />
          </div>
          <Button type="submit" disabled={isImporting || !file}>
            {isImporting ? 'Importando...' : 'Iniciar Importação'}
          </Button>
        </form>

        {isImporting && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-4">
              <Progress value={progress} className="flex-1" />
              <Button variant="ghost" size="icon" onClick={handleCancelImport} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-6 text-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentBook}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm text-muted-foreground truncate"
                >
                  {currentBook}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        )}

        {importResult && !isImporting && (
          <div className="mt-6">
            <Alert variant={importResult.success ? "default" : "destructive"}>
              <AlertTitle>{importResult.success ? "Sucesso!" : "Erro!"}</AlertTitle>
              <AlertDescription>{importResult.message}</AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}