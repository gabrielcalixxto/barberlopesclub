"use client";
import { useState } from "react";

// Mock API utility embedded directly for compilation in this environment
// In a real application, this would be in a separate file like "@/app/utils/api"
export const API_CONFIG = {
  endpoints: {
    agendamentos: {
      criar: '/api/agendamentos/criar', // Mock endpoint path
    },
  },
};


interface AgendamentoModalSloginProps {
  isOpen: boolean;
  onClose: () => void;
  // onLoginRequired: () => void; // Não é mais necessário
}

export default function AgendamentoModalSlogin({ isOpen, onClose }: AgendamentoModalSloginProps) {
  const [formData, setFormData] = useState({
    nome: '', // Agora o nome será preenchido pelo usuário
    telefone: '', // Agora o telefone será preenchido pelo usuário
    servico: '',
    data: '',
    horario: ''
  });
  // const [user, setUser] = useState<User | null>(null); // Não é mais necessário
  const [loading, setLoading] = useState(false);

  // O useEffect para verificar o login foi removido

  const servicos = [
    { id: 'corte', nome: 'Corte', preco: 'R$ 30,00' },
    { id: 'barba', nome: 'Barba', preco: 'R$ 20,00' },
    { id: 'cabelo-barba', nome: 'Cabelo e Barba', preco: 'R$ 45,00' },
    { id: 'sombrancelha', nome: 'Sombrancelha', preco: 'R$ 5,00' },
    { id: 'pezinho', nome: 'Pezinho', preco: 'R$ 10,00' }
  ];

  const horarios = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação dos campos, agora incluindo nome e telefone
    if (!formData.nome || !formData.telefone || !formData.servico || !formData.data || !formData.horario) {
      // Usando um modal customizado em vez de alert, conforme as boas práticas
      alert('Por favor, preencha todos os campos obrigatórios: Nome, Telefone, Serviço, Data e Horário.');
      return;
    }

    setLoading(true);

    try {
      // Tentar salvar no backend primeiro
      try {
        console.log('Tentando salvar agendamento no backend...');

        /*const agendamentoData = {
          nome: formData.nome,
          telefone: formData.telefone,
          servico: formData.servico,
          data: formData.data,
          horario: formData.horario,
        };*/

    

      // Criar mensagem para WhatsApp
      const servicoSelecionado = servicos.find(s => s.id === formData.servico);
      const dataFormatada = new Date(formData.data).toLocaleDateString('pt-BR');

      const mensagem = `Olá! Gostaria de confirmar meu agendamento:
        
👤 Nome: ${formData.nome}
📞 Telefone: ${formData.telefone}
✂️ Serviço: ${servicoSelecionado?.nome} (${servicoSelecionado?.preco})
📅 Data: ${dataFormatada}
🕐 Horário: ${formData.horario}

Agendamento solicitado via site!`;

      // Redirecionar para WhatsApp
      const whatsappUrl = `https://wa.me/5522997364126?text=${encodeURIComponent(mensagem)}`;
      window.open(whatsappUrl, '_blank');

      alert('Você será redirecionado para o WhatsApp para confirmar.');
      onClose();

      // Limpar todos os campos do formulário após o agendamento
      setFormData({
        nome: '',
        telefone: '',
        servico: '',
        data: '',
        horario: ''
      });
      } catch (error) {
        console.error('Erro ao processar agendamento:', error);
        alert('Erro ao processar agendamento. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro inesperado ao tentar salvar agendamento:', error);
      alert('Erro inesperado ao tentar salvar agendamento. Tente novamente.');
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  // A tela de "Login Necessário" foi removida, o formulário é sempre exibido
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Agendar Horário</h2>
            <p className="text-sm text-gray-600">Preencha os detalhes do seu agendamento.</p> {/* Mensagem genérica */}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nome (agora editável) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required // Tornar obrigatório
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Telefone (agora editável) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone *
            </label>
            <input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              required // Tornar obrigatório
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Serviço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Serviço *
            </label>
            <select
              name="servico"
              value={formData.servico}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione um serviço</option>
              {servicos.map(servico => (
                <option key={servico.id} value={servico.id}>
                  {servico.nome} - {servico.preco}
                </option>
              ))}
            </select>
          </div>

          {/* Data */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data *
            </label>
            <input
              type="date"
              name="data"
              value={formData.data}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Horário */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Horário *
            </label>
            <select
              name="horario"
              value={formData.horario}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione um horário</option>
              {horarios.map(horario => (
                <option key={horario} value={horario}>
                  {horario}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Agendando...' : 'Agendar via WhatsApp'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
