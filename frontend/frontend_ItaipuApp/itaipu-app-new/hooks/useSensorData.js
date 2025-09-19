import { useState, useEffect } from 'react';
import { getLatestSensorData, getSensorHistory } from '../services/influxService';

export const useSensorData = (refreshInterval = 5000) => {
  const [sensorData, setSensorData] = useState({
    peso: 0,
    tds: 0,
    temperatura: 0,
    loading: true,
    error: null
  });

  const [history, setHistory] = useState({
    peso: [],
    tds: [],
    temperatura: [],
    loading: true
  });

  const fetchData = async () => {
    try {
      const data = await getLatestSensorData();
      if (data) {
        setSensorData(prev => ({
          ...data,
          loading: false,
          error: null
        }));
      }
    } catch (error) {
      setSensorData(prev => ({
        ...prev,
        loading: false,
        error: 'Erro ao carregar dados'
      }));
    }
  };

  const fetchHistory = async () => {
    try {
      const [pesoHistory, tdsHistory, tempHistory] = await Promise.all([
        getSensorHistory('peso'),
        getSensorHistory('tds'),
        getSensorHistory('temperatura')
      ]);

      setHistory({
        peso: pesoHistory,
        tds: tdsHistory,
        temperatura: tempHistory,
        loading: false
      });
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchHistory();

    const interval = setInterval(fetchData, refreshInterval);
    const historyInterval = setInterval(fetchHistory, 60000); // Atualiza histórico a cada minuto

    return () => {
      clearInterval(interval);
      clearInterval(historyInterval);
    };
  }, [refreshInterval]);

  return { sensorData, history, refetch: fetchData };
};