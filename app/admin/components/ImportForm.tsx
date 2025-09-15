// app/admin/components/ImportForm.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from "@/components/ui/progress"

// Definimos uma interface para o resultado da importação
interface ImportResult {
  successCount: number
  errorCount: number
  errors: string[]
}

export function ImportForm() {
  const [file, setFile] = useState<File | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0])
      setResult(null) // Limpa resultados anteriores ao selecionar novo arquivo
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!file) {
      alert('Por favor, selecione um arquivo para importar.')
      return
    }

    setIsImporting(true)
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/admin/books/import', {
        method: 'POST',
        body: formData,
      })

      const data: ImportResult = await response.json()

      if (!response.ok) {
        throw new Error(data.errors.join(', ') || 'Erro desconhecido na importação')
      }

      setResult(data)
    } catch (error: any) {
      setResult({ successCount: 0, errorCount: 0, errors: [error.message] })
    } finally {
      setIsImporting(false)
    }
  }

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
            <Input id="spreadsheet" type="file" onChange={handleFileChange} accept=".xlsx, .csv" />
          </div>
          <Button type="submit" disabled={isImporting || !file}>
            {isImporting ? 'Importando...' : 'Iniciar Importação'}
          </Button>
        </form>

        {isImporting && <Progress value={100} className="w-full mt-4 animate-pulse" />}

        {result && (
          <div className="mt-6 space-y-4">
            {result.successCount > 0 && (
              <Alert variant="default">
                <AlertTitle>Importação Concluída com Sucesso!</AlertTitle>
                <AlertDescription>
                  {result.successCount} livro(s) foram importados para o catálogo.
                </AlertDescription>
              </Alert>
            )}
            {result.errorCount > 0 && (
              <Alert variant="destructive">
                <AlertTitle>Ocorreram {result.errorCount} erro(s) na importação</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5">
                    {result.errors.slice(0, 5).map((error, index) => ( // Mostra os 5 primeiros erros
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                  {result.errors.length > 5 && <p>E mais {result.errors.length - 5} erros...</p>}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}