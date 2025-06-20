import api from '../../../services/api';

export const buscarAvaliacoes = async (usuarioId = null) => {
  try {
    const endpoint = usuarioId 
      ? `/Avaliacoes/usuario/${usuarioId}`
      : '/Avaliacoes';
    
    const response = await api.get(endpoint);
    const dados = response.data.$values || response.data;
    
    return Array.isArray(dados) 
      ? dados.map(avaliacao => ({
          ...avaliacao,
          avaliacaoId: avaliacao.avaliacaoId || avaliacao.id,
          jogoId: avaliacao.jogoId,
          usuarioId: avaliacao.usuarioId,
          usuarioNome: avaliacao.usuarioNome || "Usuário Anônimo"
        }))
      : [];
  } catch (error) {
    console.error('Erro ao buscar avaliações:', error);
    throw new Error('Não foi possível carregar as avaliações');
  }
};

export const buscarJogos = async () => {
    try {
        const response = await api.get('/Jogos');
        const dados = response.data.$values || response.data;
        const jogosFormatados = Array.isArray(dados)
            ? dados.map(jogo => ({
                ...jogo,
                imagem: jogo.imagem || '/images/default_game_cover.png'
            }))
            : [];
        return jogosFormatados;
    } catch (error) {
        console.error('Erro ao buscar jogos:', error);
        throw new Error('Não foi possível carregar a lista de jogos');
    }
};

export const criarAvaliacao = async (avaliacaoData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Usuário não autenticado');

    const response = await api.post('/Avaliacoes', avaliacaoData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar avaliação:', error);
    throw new Error(error.response?.data?.message || 'Erro ao criar avaliação');
  }
};

export const buscarRecomendacoes = async (userId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn('Token de autenticação não encontrado para buscar recomendações.');
            return [];
        }

        const response = await api.get(`/Usuarios/${userId}/recomendacoes`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const dados = response.data.$values || response.data;
        return Array.isArray(dados) ? dados : [];
    } catch (error) {
        console.error(`Erro ao buscar recomendações para o usuário ${userId}:`, error);
        return []; 
    }
};