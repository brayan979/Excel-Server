'use client';

import { useState } from 'react';

const getTest = () => {
  fetch('/api/backend', {
    method: 'GET',
  })
    .then((response) => {
      if (response.ok) {
        console.log(response);
      }
    })
    .catch((error) => {
      console.error('Error al enviar el formulario:', error);
    });
};

export default function FechaFormulario() {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [archivo, setArchivo] = useState();

  const manejarEnvio = (e) => {
    e.preventDefault();

    if (!archivo) {
      alert('Por favor, selecciona un archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('fecha_inicio', fechaInicio);
    formData.append('fecha_fin', fechaFin);
    formData.append('archivo_datos', archivo);

    fetch('/api/backend', {
      method: 'POST',
      body: formData,
    })
      .then(async (response) => {
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Error al procesar el archivo');
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_${fechaInicio}_${fechaFin}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        alert(error.message);
        console.error('Error al enviar el formulario:', error);
      });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={manejarEnvio} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h1 className="text-xl font-bold">Formulario con fechas y archivo</h1>

        <div className="flex flex-col">
          <label htmlFor="fechaInicio" className="mb-1 font-medium">Fecha de inicio</label>
          <input
            type="date"
            id="fechaInicio"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="border px-3 py-2 rounded-md"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="fechaFin" className="mb-1 font-medium">Fecha de fin</label>
          <input
            type="date"
            id="fechaFin"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="border px-3 py-2 rounded-md"
            required
          />
        </div>

        <div className="flex flex-col">
          <input
            type="file"
            id="archivo"
            onChange={(e) => setArchivo(e.target.files?.[0] || null)}
            className="border px-3 py-2 rounded-md"
            required
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Enviar
        </button>
      </form>

    </main>
  );
}
