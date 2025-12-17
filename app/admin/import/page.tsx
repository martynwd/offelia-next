"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { Upload, AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface ImportStats {
  total: number;
  created: number;
  updated: number;
  skipped: number;
}

interface ImportResult {
  success: boolean;
  stats: ImportStats;
  errors?: string[];
}

export default function ImportPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');

    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetch('/api/auth/verify', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) {
          localStorage.removeItem('admin_token');
          router.push('/admin/login');
        } else {
          setIsAuthenticated(true);
          setIsChecking(false);
        }
      })
      .catch(() => {
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
      });
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        setError('Пожалуйста, выберите CSV файл');
        return;
      }
      setFile(selectedFile);
      setError(null);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError('Пожалуйста, выберите файл');
      return;
    }

    setIsImporting(true);
    setError(null);
    setResult(null);

    try {
      // Parse CSV file
      const text = await file.text();

      Papa.parse(text, {
        header: false,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            // Convert to our expected format
            const rows = results.data.map((row: any) => ({
              category: row[0],
              name: row[1],
              price: row[2],
            }));

            // Send to API
            const response = await fetch('/api/admin/import-products', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                csvData: JSON.stringify(rows),
              }),
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.error || 'Import failed');
            }

            setResult(data);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Import failed');
          } finally {
            setIsImporting(false);
          }
        },
        error: (error: Error) => {
          setError(`CSV parsing error: ${error.message}`);
          setIsImporting(false);
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read file');
      setIsImporting(false);
    }
  };

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Импорт товаров из CSV</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Загрузите CSV файл с товарами для обновления базы данных
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Формат файла
        </h2>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• <strong>Колонка 1:</strong> Название категории</li>
          <li>• <strong>Колонка 2:</strong> Название товара</li>
          <li>• <strong>Колонка 3:</strong> Цена (число)</li>
          <li>• Файл должен быть в формате CSV без заголовков</li>
          <li>• <strong>Важно:</strong> Все товары в файле будут отмечены как &quot;В наличии&quot;, остальные - как &quot;Нет в наличии&quot;</li>
        </ul>
      </div>

      {/* File Upload */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Выберите CSV файл
          </label>
          <div className="flex items-center gap-4">
            <label className="flex-1 cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors">
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                {file ? (
                  <div>
                    <p className="font-medium text-primary">{file.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium">Нажмите для выбора файла</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Или перетащите файл сюда
                    </p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleImport}
            disabled={!file || isImporting}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {isImporting ? 'Импортируется...' : 'Импортировать'}
          </button>
          <button
            onClick={() => router.push('/admin')}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Отмена
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <XCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100 mb-1">
                Ошибка импорта
              </h3>
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Result */}
      {result && result.success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3">
                Импорт завершен успешно!
              </h3>

              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {result.stats.total}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Всего строк
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {result.stats.created}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Создано
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {result.stats.updated}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Обновлено
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {result.stats.skipped}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Пропущено
                  </div>
                </div>
              </div>

              {/* Errors if any */}
              {result.errors && result.errors.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">
                    Предупреждения ({result.errors.length}):
                  </h4>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-h-60 overflow-y-auto">
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      {result.errors.map((err, idx) => (
                        <li key={idx} className="break-all">
                          • {err}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => router.push('/admin')}
            className="w-full bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Вернуться в админ панель
          </button>
        </div>
      )}
    </div>
  );
}
