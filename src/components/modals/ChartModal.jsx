import { DownloadOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useSimulationControls } from '../../hooks/useSimulationControls';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const ChartModal = ({ isVisible, onClose, getMetrics }) => {
  const [metrics, setMetrics] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const { exportData } = useSimulationControls();

  useEffect(() => {
    if (getMetrics && isVisible){
      setMetrics(getMetrics());
    }
  }, [isVisible, getMetrics]);

  useEffect(() => {
    if (metrics && metrics.length > 0) {
      const labels = metrics.map(m => m.generation);
      setChartData({
        labels,
        datasets: [
          {
            label: 'Population Size',
            data: metrics.map(m => m.populationSize),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 2,
            pointHoverRadius: 5,
          },
          {
            label: 'Births',
            data: metrics.map(m => m.births),
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 2,
            pointHoverRadius: 5,
          },
          {
            label: 'Deaths',
            data: metrics.map(m => m.deaths),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 2,
            pointHoverRadius: 5,
          },
        ],
      });
    }
  }, [metrics]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: true,
        text: 'Game of Life Population Metrics',
        padding: {
          top: 10,
          bottom: 20,
        },
        font: {
          size: 16,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#666',
        bodyColor: '#666',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        usePointStyle: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Generation',
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count',
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart',
    },
  };

  return (
    <Modal
      title={
        <span>Population Metrics</span>
      }
      open={isVisible}
      onCancel={onClose}
      width={800}
      footer={null}
      bodyStyle={{
        padding: '20px',
        backgroundColor: '#fff',
      }}
    >
      <div style={{ height: '60vh', padding: '12px' }}>
        {metrics && metrics.length > 0 ? (
          <Line options={options} data={chartData} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No data available. Run the simulation to collect metrics.
          </div>
        )}
      </div>
      <div className="flex items-center justify-end w-full gap-5">
        <Button
          className="rounded-lg"
          type="default"
          icon={<DownloadOutlined />}
          size="small"
          onClick={exportData}
        >
            Download CSV
        </Button>

      </div>
    </Modal>
  );
};

ChartModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  getMetrics: PropTypes.func.isRequired,
};

export default ChartModal;
