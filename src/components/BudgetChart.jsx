import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { useEffect, useState } from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const BudgetChart = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedSectors, setSelectedSectors] = useState([]);
    const [chartType, setChartType] = useState('bar');

    useEffect(() => {
        fetch('http://localhost:5000/presupuesto') // Ajusta la URL si es necesario
            .then((response) => response.json())
            .then((data) => {
                console.log('Datos recibidos:', data);
                setData(data);
                setFilteredData(data);
            })
            .catch((error) => console.error('Error al obtener los datos:', error));
    }, []);

    // Manejar el filtro por múltiples sectores
    const handleFilterChange = (e) => {
        const options = [...e.target.options];
        const selectedValues = options.filter(opt => opt.selected).map(opt => opt.value);
        setSelectedSectors(selectedValues);

        if (selectedValues.length === 0) {
            setFilteredData(data);
        } else {
            setFilteredData(data.filter(item => selectedValues.includes(item.sector)));
        }
    };

    // Calcular el total del presupuesto
    const totalPresupuesto = filteredData.reduce((sum, item) => sum + item.presupuesto, 0);

    // Configuración de los gráficos
    const chartData = {
        labels: filteredData.map((item) => item.sector),
        datasets: [
            {
                label: 'Presupuesto en millones',
                data: filteredData.map((item) => item.presupuesto),
                backgroundColor: ['rgba(54, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)', 'rgba(75, 192, 192, 0.5)'],
                borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += context.raw.toLocaleString() + ' millones';
                        return label;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    const renderChart = () => {
        switch (chartType) {
            case 'pie':
                return <Pie data={chartData} options={options} />;
            case 'line':
                return <Line data={chartData} options={options} />;
            default:
                return <Bar data={chartData} options={options} />;
        }
    };

    // Funciones para exportar datos
    const downloadCSV = () => {
        const csvRows = [];
        const headers = ['Sector', 'Presupuesto'];
        csvRows.push(headers.join(','));

        filteredData.forEach(item => {
            const row = [item.sector, item.presupuesto].join(',');
            csvRows.push(row);
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'presupuesto.csv');
        link.click();
    };

    const downloadJSON = () => {
        const jsonString = JSON.stringify(filteredData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'presupuesto.json');
        link.click();
    };

    if (!data.length) return <p>Cargando datos...</p>;

    return (
        <div>
            <h2>Presupuesto por Sector</h2>
            <p>Total Presupuesto: {totalPresupuesto.toLocaleString()} millones</p>

            {/* Filtro de sectores */}
            <label htmlFor="sector">Filtrar por sectores: </label>
            <select id="sector" multiple value={selectedSectors} onChange={handleFilterChange}>
                {data.map((item, index) => (
                    <option key={index} value={item.sector}>
                        {item.sector}
                    </option>
                ))}
            </select>

            {/* Selección de tipo de gráfico */}
            <label htmlFor="chartType">Seleccionar tipo de gráfico: </label>
            <select id="chartType" value={chartType} onChange={(e) => setChartType(e.target.value)}>
                <option value="bar">Barras</option>
                <option value="pie">Circular</option>
                <option value="line">Líneas</option>
            </select>

            {/* Renderizado dinámico del gráfico */}
            {renderChart()}

            {/* Botones de descarga */}
            <button onClick={downloadCSV} style={{ marginTop: '10px' }}>
                Descargar CSV
            </button>
            <button onClick={downloadJSON} style={{ marginTop: '10px', marginLeft: '10px' }}>
                Descargar JSON
            </button>
        </div>
    );
};

export default BudgetChart;
