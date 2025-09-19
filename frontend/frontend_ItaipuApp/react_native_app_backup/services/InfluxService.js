import { InfluxDB } from '@influxdata/influxdb-client';

const INFLUXDB_URL = 'https://us-east-1-1.aws.cloud2.influxdata.com';
const INFLUXDB_TOKEN = 'eIS7t8yifYcG8pJWg85-KPQOEX_NreAOLxtJVcxNhFiecEgrE7ovKkwQSs4XPz36noFdv_81O3rNMiVWVZOH4w==';
const INFLUXDB_ORG = 'CSC';
const INFLUXDB_BUCKET = 'arracoador';

const queryApi = new InfluxDB({ url: INFLUXDB_URL, token: INFLUXDB_TOKEN }).getQueryApi(INFLUXDB_ORG);

export const getLatestSensorData = async () => {
  try {
    const fluxQuery = `
      from(bucket: "${INFLUXDB_BUCKET}")
        |> range(start: -1h)
        |> filter(fn: (r) => r["_measurement"] == "esp_medidas")
        |> filter(fn: (r) => r["_field"] == "peso" or r["_field"] == "tds" or r["_field"] == "temperatura")
        |> last()
    `;

    const results = [];
    
    for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
      const o = tableMeta.toObject(values);
      results.push(o);
    }

    // Processar resultados
    const data = {
      peso: 0,
      tds: 0,
      temperatura: 0
    };

    results.forEach(result => {
      if (result._field === 'peso') data.peso = result._value;
      if (result._field === 'tds') data.tds = result._value;
      if (result._field === 'temperatura') data.temperatura = result._value;
    });

    return data;

  } catch (error) {
    console.error('Erro ao buscar dados do InfluxDB:', error);
    return null;
  }
};

export const getSensorHistory = async (field, timeRange = '1h') => {
  try {
    const fluxQuery = `
      from(bucket: "${INFLUXDB_BUCKET}")
        |> range(start: -${timeRange})
        |> filter(fn: (r) => r["_measurement"] == "esp_medidas")
        |> filter(fn: (r) => r["_field"] == "${field}")
        |> aggregateWindow(every: 1m, fn: mean, createEmpty: false)
        |> yield(name: "mean")
    `;

    const results = [];
    
    for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
      const o = tableMeta.toObject(values);
      results.push({
        time: new Date(o._time),
        value: o._value
      });
    }

    return results;

  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    return [];
  }
};