// src/components/PresupuestoChart.js
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { saveAs } from "file-saver";
import Papa from "papaparse";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const PresupuestoChart = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedSector, setSelectedSector] = useState("Todos");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}/presupuesto`);
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.msg || "Error al obtener los datos.");
                }

                if (!Array.isArray(result)) {
                    throw new Error("Los datos recibidos no tienen el formato esperado.");
                }

                setData(result);
                setFilteredData(result);
            } catch (err) {
                console.error("❌ Error al cargar presupuesto:", err);
                setError("No se pudo cargar la información del presupuesto.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (selectedSector === "Todos") {
            setFilteredData(data);
        } else {
            setFilteredData(data.filter((item) => item.sector === selectedSector));
        }
    }, [selectedSector, data]);

    const handleExportCSV = () => {
        const csv = Papa.unparse(filteredData);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "presupuesto.csv");
    };

    const handleExportJSON = () => {
        const blob = new Blob([JSON.stringify(filteredData, null, 2)], { type: "application/json" });
        saveAs(blob, "presupuesto.json");
    };

    const chartData = {
        labels: filteredData.map((item) => item.sector),
        datasets: [
            {
                label: "Presupuesto (millones)",
                data: filteredData.map((item) => item.monto),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
        ],
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Presupuesto por Sector</h2>

            {loading && <p>Cargando datos...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {!loading && !error && (
                <>
                    <select
                        onChange={(e) => setSelectedSector(e.target.value)}
                        className="mb-4 p-2 border rounded"
                    >
                        <option value="Todos">Todos</option>
                        {[...new Set(data.map((item) => item.sector))].map((sector) => (
                            <option key={sector} value={sector}>
                                {sector}
                            </option>
                        ))}
                    </select>

                    <Bar data={chartData} />

                    <div className="mt-4 flex gap-4">
                        <button onClick={handleExportCSV} className="bg-green-500 text-white px-4 py-2 rounded">
                            Exportar CSV
                        </button>
                        <button onClick={handleExportJSON} className="bg-blue-500 text-white px-4 py-2 rounded">
                            Exportar JSON
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default PresupuestoChart;
