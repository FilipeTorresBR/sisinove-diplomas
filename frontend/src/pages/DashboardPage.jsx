import { useEffect, useState } from 'react';
import api from '../services/api';
import { BarPanel, PiePanel } from '../components/ChartPanel';
export default function DashboardPage() {
  const [data, setData] = useState({ cards: {}, byPole: [], byCourse: [], byStatus: [], byCity: [] });
  useEffect(() => { api.get('/dashboard').then(({ data }) => setData(data)); }, []);
  const cards = [['Total de diplomas', data.cards.totalDiplomas || 0], ['Registrados', data.cards.totalRegistered || 0], ['Enviados', data.cards.totalSent || 0], ['Entregues', data.cards.totalDelivered || 0], ['Pendentes', data.cards.totalPending || 0]];
  return <><div className="cards">{cards.map(([label, value]) => <div className="card" key={label}><h3>{label}</h3><div className="value">{value}</div></div>)}</div><div className="grid-2"><BarPanel title="Diplomas por Polo" data={data.byPole} /><PiePanel title="Diplomas por Status" data={data.byStatus} /><BarPanel title="Diplomas por Cidade" data={data.byCity} /><BarPanel title="Diplomas por Curso" data={data.byCourse} /></div></>;
}
