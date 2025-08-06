"use client";
import { useState, useEffect } from "react";

// Mock API utility embedded directly for compilation in this environment
// In a real application, this would be in a separate file like "@/app/utils/api"
export const API_CONFIG = {
  endpoints: {
    agendamentos: {
      criar: '/api/agendamentos/criar', // Mock endpoint path
    },
  },
};

export async function apiRequest(endpoint, options) {
  console.log(`Mock API Request to: ${endpoint}`);
  console.log('Options:', options);

  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Simulate a successful response
  return { message: 'Mock data saved successfully!' };

  // If you want to simulate an error, uncomment the line below:
  // throw new Error('Mock API Error: Failed to save data.');
}

// --- AgendamentoModal Component (Embedded) ---
interface AgendamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AgendamentoModal({ isOpen, onClose }: AgendamentoModalProps) {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    servico: '',
    data: '',
    horario: ''
  });
  const [loading, setLoading] = useState(false);

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

    if (!formData.nome || !formData.telefone || !formData.servico || !formData.data || !formData.horario) {
      alert('Por favor, preencha todos os campos obrigatórios: Nome, Telefone, Serviço, Data e Horário.');
      return;
    }

    setLoading(true);

    try {
      try {
        console.log('Tentando salvar agendamento no backend...');
        const agendamentoData = {
          nome: formData.nome,
          telefone: formData.telefone,
          servico: formData.servico,
          data: formData.data,
          horario: formData.horario,
        };
        const response = await apiRequest(API_CONFIG.endpoints.agendamentos.criar, {
          method: 'POST',
          body: JSON.stringify(agendamentoData)
        });
        console.log('Agendamento salvo com sucesso no backend:', response);
      } catch (apiError) {
        console.error('Erro ao salvar no backend:', apiError);
        console.warn('Agendamento não foi salvo no sistema, mas será enviado via WhatsApp.');
      }

      const servicoSelecionado = servicos.find(s => s.id === formData.servico);
      const dataFormatada = new Date(formData.data).toLocaleDateString('pt-BR');

      const mensagem = `Olá! Gostaria de confirmar meu agendamento:
        
👤 Nome: ${formData.nome}
📞 Telefone: ${formData.telefone}
✂️ Serviço: ${servicoSelecionado?.nome} (${servicoSelecionado?.preco})
📅 Data: ${dataFormatada}
🕐 Horário: ${formData.horario}

Agendamento solicitado via site!`;

      const whatsappUrl = `https://wa.me/5522997364126?text=${encodeURIComponent(mensagem)}`;
      window.open(whatsappUrl, '_blank');

      alert('Você foi redirecionado para o WhatsApp para confirmar.');
      onClose();

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

    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Agendar Horário</h2>
            <p className="text-sm text-gray-600">Preencha os detalhes do seu agendamento.</p>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone *
            </label>
            <input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

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

// --- LoginModal Component (Mock) ---
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToCadastro: () => void;
  onLoginSuccess: (userData: any) => void; // Using 'any' for mock
}

function LoginModal({ isOpen, onClose, onSwitchToCadastro, onLoginSuccess }: LoginModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Login Modal (Mock)</h2>
        <p className="text-gray-600 mb-6">Este é um modal de Login de exemplo.</p>
        <button onClick={onClose} className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
          Fechar
        </button>
        <button onClick={onSwitchToCadastro} className="w-full mt-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
          Ir para Cadastro
        </button>
      </div>
    </div>
  );
}

// --- CadastroModal Component (Mock) ---
interface CadastroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

function CadastroModal({ isOpen, onClose, onSwitchToLogin }: CadastroModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Cadastro Modal (Mock)</h2>
        <p className="text-gray-600 mb-6">Este é um modal de Cadastro de exemplo.</p>
        <button onClick={onClose} className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
          Fechar
        </button>
        <button onClick={onSwitchToLogin} className="w-full mt-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
          Ir para Login
        </button>
      </div>
    </div>
  );
}

// --- AgendamentoModalSlogin Component (Embedded, same as AgendamentoModal without login logic) ---
// This is intentionally the same as AgendamentoModal above, as per previous instructions
// It's kept separate here to respect the original file structure intention, but embedded for compilation.
function AgendamentoModalSlogin({ isOpen, onClose }: AgendamentoModalProps) {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    servico: '',
    data: '',
    horario: ''
  });
  const [loading, setLoading] = useState(false);

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

    if (!formData.nome || !formData.telefone || !formData.servico || !formData.data || !formData.horario) {
      alert('Por favor, preencha todos os campos obrigatórios: Nome, Telefone, Serviço, Data e Horário.');
      return;
    }

    setLoading(true);

    try {
      try {
        console.log('Tentando salvar agendamento no backend...');
        const agendamentoData = {
          nome: formData.nome,
          telefone: formData.telefone,
          servico: formData.servico,
          data: formData.data,
          horario: formData.horario,
        };
        const response = await apiRequest(API_CONFIG.endpoints.agendamentos.criar, {
          method: 'POST',
          body: JSON.stringify(agendamentoData)
        });
        console.log('Agendamento salvo com sucesso no backend:', response);
      } catch (apiError) {
        console.error('Erro ao salvar no backend:', apiError);
        console.warn('Agendamento não foi salvo no sistema, mas será enviado via WhatsApp.');
      }

      const servicoSelecionado = servicos.find(s => s.id === formData.servico);
      const dataFormatada = new Date(formData.data).toLocaleDateString('pt-BR');

      const mensagem = `Olá! Gostaria de confirmar meu agendamento:
        
👤 Nome: ${formData.nome}
📞 Telefone: ${formData.telefone}
✂️ Serviço: ${servicoSelecionado?.nome} (${servicoSelecionado?.preco})
📅 Data: ${dataFormatada}
🕐 Horário: ${formData.horario}

Agendamento solicitado via site!`;

      const whatsappUrl = `https://wa.me/5522997364126?text=${encodeURIComponent(mensagem)}`;
      window.open(whatsappUrl, '_blank');

      alert('Você será redirecionado para o WhatsApp para confirmar.');
      onClose();

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

    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Agendar Horário</h2>
            <p className="text-sm text-gray-600">Preencha os detalhes do seu agendamento.</p>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone *
            </label>
            <input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

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


// --- Home Component ---
export default function Home() {
  const [isAgendamentoModalOpen, setIsAgendamentoModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAgendamentoModalSloginOpen, setIsAgendamentoModalSloginOpen] = useState(false);
  const [isCadastroModalOpen, setIsCadastroModalOpen] = useState(false);

  useEffect(() => {
    // Verificar se o usuário está logado
    const userData = localStorage.getItem('user');
    if (userData) {
      // Usuário está logado, mas não precisamos armazenar no estado aqui
      console.log('Usuário logado:', JSON.parse(userData));
    }

    // Listener para abrir modal de login
    const handleOpenLoginModal = () => {
      setIsLoginModalOpen(true);
    };

    window.addEventListener('openLoginModal', handleOpenLoginModal);
    return () => window.removeEventListener('openLoginModal', handleOpenLoginModal);
  }, []);

  const openAgendamentoModal = () => setIsAgendamentoModalOpen(true);
  const closeAgendamentoModal = () => setIsAgendamentoModalOpen(false);

  const openAgendamentoModalSlogin = () => setIsAgendamentoModalSloginOpen(true); // Função para abrir o modal sem login
  const closeAgendamentoModalSlogin = () => setIsAgendamentoModalSloginOpen(false); // Função para fechar o modal sem login


  const closeLoginModal = () => setIsLoginModalOpen(false);

  const closeCadastroModal = () => setIsCadastroModalOpen(false);

  const switchToCadastro = () => {
    setIsLoginModalOpen(false);
    setIsCadastroModalOpen(true);
  };

  const switchToLogin = () => {
    setIsCadastroModalOpen(false);
    setIsLoginModalOpen(true);
  };
  const handleLoginSuccess = (userData: any) => { // Using 'any' for mock
    // Salvar usuário no localStorage (já feito no modal)
    window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: userData }));
    setIsAgendamentoModalOpen(true); // Abrir modal de agendamento após login
  };

  const handleLoginRequired = () => {
    setIsLoginModalOpen(true);
  };

  return (
    <>
      <main className="bg-white text-gray-900">{/* Hero Section */}
        <section id="inicio" className="relative min-h-screen flex items-center justify-center">
          <div className="absolute inset-0">
            <img
              src="/assets/backgroundhero.jpg"
              alt="Barbearia"
              className="w-full h-full object-cover object-[0%_5%]"
              style={{ objectFit: 'cover', objectPosition: '0% 5%' }} // Added style for object-fit
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>

          <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6 pt-32">
            <div className="animate-fadeInUp">
              <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight tracking-wide">
                QUALIDADE E EXPERIÊNCIA
              </h1>
              <button
                onClick={openAgendamentoModalSlogin}
                className="botao-ousado inline-block text-white font-bold py-4 px-12 uppercase tracking-wider transition-all duration-300 transform hover:scale-105"
              >
                AGENDAR HORÁRIO
              </button>
            </div>
          </div>
        </section>{/* Services Section */}
        <section id="servicos" className="py-32 bg-white relative">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Lado esquerdo - Texto */}
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-8">
                  NOSSOS SERVIÇOS
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  Mais de uma década de experiência com tradições e tendências.
                </p>
                <p className="text-gray-600 leading-relaxed mb-12">
                  Oferecemos uma experiência completa com produtos de qualidade e técnicas modernas para todos os estilos.
                </p>
                <a href="#galeria" className="botao-ousado inline-block text-white font-bold py-4 px-12 uppercase tracking-wider transition-all duration-300 transform hover:scale-105">
                  VER GALERIA
                </a>
              </div>

              {/* Lado direito - Lista de preços */}
              <div className="space-y-6">
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                      </svg>
                    </div>
                    <span className="text-lg font-medium text-gray-800">CORTE</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">30,00</span>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                      </svg>
                    </div>
                    <span className="text-lg font-medium text-gray-800">BARBA</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">20,00</span>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                      </svg>
                    </div>
                    <span className="text-lg font-medium text-gray-800">CABELO E BARBA</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">45,00</span>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                      </svg>
                    </div>
                    <span className="text-lg font-medium text-gray-800">SOMBRANCELHA</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">5,00</span>
                </div>

                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                      </svg>
                    </div>
                    <span className="text-lg font-medium text-gray-800">PEZINHO</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">10,00</span>
                </div>
              </div>
            </div>
          </div>
          {/* Logo marca d'água */}
          <div className="absolute top-1/2 right-[6%] transform -translate-y-1/2 opacity-10 pointer-events-none">
            <img
              src="/assets/logooriginal.jpeg"
              alt="Logo"
              className="object-contain mr-48"
              width={720}
              height={720}
            />
          </div>
        </section>

        {/* Location Section */}
        <section id="unidade" className="py-20 bg-gray-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">Nossa Unidade</h2>
              <p className="text-xl text-gray-600">Localização privilegiada no coração da cidade</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div id="contato">          <div className="space-y-6 mb-8">
                <div className="flex items-center">
                  <span className="text-blue-600 text-2xl mr-4">📍</span>
                  <div>
                    <p className="font-semibold text-lg">Endereço</p>
                    <p className="text-gray-600">Av. 28 de Março, N° 560 - Parque Avenida Pelinca, Campos dos Goytacazes - RJ, 28020-740. Ao Lado do Shopping</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-blue-600 text-2xl mr-4">🕐</span>
                  <div>
                    <p className="font-semibold text-lg">Horário de Funcionamento</p>
                    <p className="text-gray-600">Seg-Sex: 9h às 20h | Sáb: 9h às 17h</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-blue-600 text-2xl mr-4">📞</span>
                  <div>
                    <p className="font-semibold text-lg">Telefone</p>
                    <p className="text-gray-600">(22) 99736-4126</p>
                  </div>
                </div>
              </div>          <button
                onClick={openAgendamentoModal}
                className="botao-ousado inline-block text-white font-bold py-4 px-12 uppercase tracking-wider transition-all duration-300 transform hover:scale-105"
              >
                  AGENDAR PELO WHATSAPP
                </button>
              </div>          <div className="grid grid-cols-1 gap-4 ">
                <img
                  src="/assets/foto-unidade-1.jpeg"
                  alt="Interior da Unidade"
                  className="w-full h-64 object-cover object-[center_58%] shadow-lg"
                  width={400}
                  height={192}
                />
                <img
                  src="/assets/foto-unidade-2.jpeg"
                  alt="Ambiente da Barbearia"
                  className="w-full h-64 object-cover shadow-lg"
                  width={400}
                  height={192}
                />
              </div>
            </div>
          </div>          </section>

        {/* Gallery Section */}
        <section id="galeria" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">Galeria de Cortes</h2>
              <p className="text-xl text-gray-600">Alguns dos nossos trabalhos recentes</p>
            </div>          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="group relative overflow-hidden shadow-lg">
                <img
                  src="/assets/corte1.svg"
                  alt="Corte Moderno"
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  width={400}
                  height={256}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-semibold">Corte Moderno</span>
                </div>
              </div>
              <div className="group relative overflow-hidden shadow-lg">
                <img
                  src="/assets/corte2.svg"
                  alt="Barba Estilizada"
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  width={400}
                  height={256}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-semibold">Barba Estilizada</span>
                </div>
              </div>
              <div className="group relative overflow-hidden shadow-lg">
                <img
                  src="/assets/corte3.svg"
                  alt="Combo Completo"
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  width={400}
                  height={256}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-semibold">Combo Completo</span>
                </div>
              </div>
              <div className="group relative overflow-hidden shadow-lg">
                <img
                  src="/assets/corte4.svg"
                  alt="Estilo Clássico"
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  width={400}
                  height={256}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-semibold">Estilo Clássico</span>
                </div>
              </div>
              <div className="group relative overflow-hidden shadow-lg">
                <img
                  src="/assets/corte1.svg"
                  alt="Degradê Moderno"
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  width={400}
                  height={256}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-semibold">Degradê Moderno</span>
                </div>
              </div>
              <div className="group relative overflow-hidden shadow-lg">
                <img
                  src="/assets/corte2.svg"
                  alt="Corte Social"
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  width={400}
                  height={256}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-semibold">Corte Social</span>
                </div>
              </div>
              <div className="group relative overflow-hidden shadow-lg">
                <img
                  src="/assets/corte3.svg"
                  alt="Estilo Executivo"
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  width={400}
                  height={256}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-semibold">Estilo Executivo</span>
                </div>
              </div>
              <div className="group relative overflow-hidden shadow-lg">
                <img
                  src="/assets/corte4.svg"
                  alt="Barba Completa"
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  width={400}
                  height={256}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-semibold">Barba Completa</span>
                </div>
              </div>
            </div>
          </div>
        </section>          {/* CTA Section */}
        <section id="agendamento" className="py-20 bg-gradient-to-r from-gray-900 to-black text-white">
          <div className="max-w-6xl mx-auto px-80">
            <div className="grid gap-0">
              {/* Contato */}
              <div className="from-gray-900 text-white text-center">
                <div className="grid grid-cols-1 md:grid-cols-2 items-center from-gray-900 to-black text-white">
                  <div className="from-gray-900  text-white">
                    <img
                      src="/assets/lopesclubicon.png"
                      alt="logo2"
                      className="w-48 h-48"
                      width={400}
                      height={256}
                    />
                  </div>
                  <div className="text-center">
                    <h1 className="text-3xl font-bold whitespace-nowrap mb-5">Agende seu horário</h1>
                    <button
                      onClick={openAgendamentoModal}
                      className="botao-ousado inline-block text-white font-bold py-4 px-12 uppercase tracking-wider transition-all duration-300 transform hover:scale-105"
                    >
                      AGENDAR AGORA
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modais */}
      <AgendamentoModal
        isOpen={isAgendamentoModalOpen}
        onClose={closeAgendamentoModal}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onSwitchToCadastro={switchToCadastro}
        onLoginSuccess={handleLoginSuccess}
      />
      <CadastroModal
        isOpen={isCadastroModalOpen}
        onClose={closeCadastroModal}
        onSwitchToLogin={switchToLogin}
      />
      <AgendamentoModalSlogin
        isOpen={isAgendamentoModalSloginOpen}
        onClose={closeAgendamentoModalSlogin} // Corrigido para usar a função de fechar do modal sem login
      />
    </>
  );
}
