import { useEffect, useState } from 'react';
import api from '../services/api';
import { BarPanel } from '../components/ChartPanel';
export default function ReportsPage() {
  const [summary, setSummary] = useState({ geral: 0, porPolo: [], porCidade: [] });
  useEffect(() => { api.get('/reports/summary').then(({ data }) => setSummary(data)); }, []);
  return <><div className="cards"><div className="card"><h3>Total geral de diplomas</h3><div className="value">{summary.geral}</div></div></div><div className="grid-2"><BarPanel title="Relatório por Polo" data={summary.porPolo} /><BarPanel title="Relatório por Cidade" data={summary.porCidade} /></div><div className="grid-2" style={{ marginTop: 16 }}><div className="table-wrap"><h3>Diplomas emitidos por polo</h3><table><thead><tr><th>Polo</th><th>Total</th></tr></thead><tbody>{summary.porPolo.map(item => <tr key={item.name}><td>{item.name}</td><td>{item.total}</td></tr>)}</tbody></table></div><div className="table-wrap"><h3>Diplomas emitidos por cidade</h3><table><thead><tr><th>Cidade</th><th>Total</th></tr></thead><tbody>{summary.porCidade.map(item => <tr key={item.name}><td>{item.name}</td><td>{item.total}</td></tr>)}</tbody></table></div></div></>;
}
