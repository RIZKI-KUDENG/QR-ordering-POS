"use client";
import { useTable, useCreateTable, useDeleteTable } from "@/hooks/useTable";
export default  function AdminTables() {
  const { data: tables = [] } =  useTable();
  const { mutate: createTable, isPending: isLoading } = useCreateTable();
  const { mutate: deleteTable, isPending: isDeleting } = useDeleteTable();

    const handleAddTable = (data: any) => {
        const lastNumber = tables.length
        ? Math.max(...tables.map((t: any) => Number(t.number)))
      : 0;

      createTable({
        number: String(lastNumber + 1),
      });
    }
    const handleRemoveTable = (id: number) => {
      if (confirm("Hapus meja ini?")) {
        deleteTable(id);
      }
    }
  return (
     <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">List Meja</h1>

      <table className="border w-full mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Nomor Meja</th>
            <th className="border p-2">Token</th>
            <th className="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((table: any) => (
            <tr key={table.id}>
              <td className="border p-2">{table.number}</td>
              <td className="border p-2 font-mono text-sm">
                {table.token}
              </td>
              <td className="border p-2">
                <button
                  onClick={() => handleRemoveTable(table.id)}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  {isDeleting ? "Menghapus..." : "Hapus"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleAddTable}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {isLoading ? "Menambahkan..." : "+ Tambah Meja"}
      </button>
    </div>
  );
}
