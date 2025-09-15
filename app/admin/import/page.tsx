import { ImportForm } from "./components/ImportForm";

export default function AdminImportPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Importação de Livros em Massa</h1>
      <div className="max-w-2xl">
        <ImportForm />
      </div>
    </div>
  );
}