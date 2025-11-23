import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMetrics } from '../services/api';
import type { Metric } from '../types';
import ReactECharts from 'echarts-for-react';
import { BarChart3, TrendingUp, Users, LogOut } from 'lucide-react';

export const Dashboard = () => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const data = await getMetrics();
      setMetrics(data);
    } catch (err: any) {
      setError('Erro ao carregar métricas');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Filtrar métricas por categoria
  const vendas = metrics.filter((m) => m.category === 'vendas');
  const usuarios = metrics.filter((m) => m.category === 'usuarios');

  // Configuração do gráfico de vendas
  const vendasChartOption = {
    title: {
      text: 'Vendas Mensais',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: vendas.map((m) => m.label),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: vendas.map((m) => m.value),
        type: 'bar',
        itemStyle: {
          color: '#3b82f6',
        },
      },
    ],
  };

  // Configuração do gráfico de usuários
  const usuariosChartOption = {
    title: {
      text: 'Métricas de Usuários',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: usuarios.map((m) => ({
          name: m.label,
          value: m.value,
        })),
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total de Métricas</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{metrics.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Vendas</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{vendas.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Usuários</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{usuarios.length}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <ReactECharts option={vendasChartOption} style={{ height: '400px' }} />
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <ReactECharts option={usuariosChartOption} style={{ height: '400px' }} />
          </div>
        </div>
      </main>
    </div>
  );
};