'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Loader2, AlertCircle } from 'lucide-react';
import { exportAllData } from './actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function BackupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await exportAllData();

      if (!result.success || !result.data) {
        throw new Error(result.message || 'Falha ao exportar os dados.');
      }

      const dataStr = JSON.stringify(result.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      const date = new Date().toISOString().slice(0, 10); // Formato YYYY-MM-DD

      link.href = url;
      link.setAttribute('download', `papiro_branco_backup_${date}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Exportação concluída!', {
        description: 'O ficheiro de backup foi descarregado.',
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Backup e Exportação</h1>
        <p className="text-muted-foreground">Exporte todos os dados da sua loja para um ficheiro JSON.</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Exportar Dados</CardTitle>
          <CardDescription>
            Clique no botão abaixo para gerar e descarregar um ficheiro JSON contendo todos os dados das tabelas de utilizadores, categorias e livros. Guarde este ficheiro num local seguro.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro na Exportação</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button onClick={handleExport} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                A gerar ficheiro...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Exportar Todos os Dados
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

