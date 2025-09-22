"use client";

import { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, CircularProgress } from '@mui/material';
import { apiUrl } from '@/utils/api';

interface Zona {
  _id: string;
  nome: string;
  inep: string;
  diretor?: string;
  coordenador_geral?: string;
  telefone?: string;
  email?: string;
}

export default function ViewZonaPage({ params }: { params: { id: string } }) {
  const [zona, setZona] = useState<Zona | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchZona = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/api/v1/zona/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Falha ao buscar os dados da zona.');
        }

        const data = await response.json();
        setZona(data.zona || null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchZona();
    }
  }, [params.id]);

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" sx={{ mt: 4 }}>{error}</Typography>
      </Container>
    );
  }

  if (!zona) {
    return (
      <Container>
        <Typography sx={{ mt: 4 }}>Zona não encontrada.</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Detalhes da Zona
        </Typography>
        <Box mt={2}>
          <Typography variant="h6">Nome:</Typography>
          <Typography>{zona.nome}</Typography>
        </Box>
        <Box mt={2}>
          <Typography variant="h6">INEP:</Typography>
          <Typography>{zona.inep}</Typography>
        </Box>
        <Box mt={2}>
          <Typography variant="h6">Diretor(a):</Typography>
          <Typography>{zona.diretor || 'Não informado'}</Typography>
        </Box>
        <Box mt={2}>
          <Typography variant="h6">Coordenador(a) Geral:</Typography>
          <Typography>{zona.coordenador_geral || 'Não informado'}</Typography>
        </Box>
        <Box mt={2}>
          <Typography variant="h6">Telefone:</Typography>
          <Typography>{zona.telefone || 'Não informado'}</Typography>
        </Box>
        <Box mt={2}>
          <Typography variant="h6">Email:</Typography>
          <Typography>{zona.email || 'Não informado'}</Typography>
        </Box>
      </Paper>
    </Container>
  );
}
