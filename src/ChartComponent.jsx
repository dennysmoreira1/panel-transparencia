import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const ChartComponent = () => {
    const [presupuestoData, setPresupuestoData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("/presupuesto") // Conexión a la API
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en la respuesta del servidor");
                }
                return response.json();
            })
            .then(data => {
                console.log("Datos recibidos:", data); // <-- Agrega esto para ver los datos
                setPresupuestoData(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al obtener los datos:", error);
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Cargando datos...</p>;
    if (error) return <p>Error: {error}</p>;

    const chartData = {
        labels: presupuestoData.map(item => item.sector),
        datasets: [
            {
                label: "Monto Presupuestado",
                data: presupuestoData.map(item => item.monto),
                backgroundColor: "rgba(75, 192, 192, 0.5)",
            },
        ],
    };

    const pieData = {
        labels: presupuestoData.map(item => item.sector),
        datasets: [
            {
                data: presupuestoData.map(item => item.monto),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Presupuesto por Sector" },
        },
    };

    return (
        <div>
            <h2>Presupuesto por Sector</h2>
            <Bar data={chartData} options={options} />
            <h2>Distribución del Presupuesto</h2>
            <Pie data={pieData} />
        </div>
    );
};

export default ChartComponent;
