"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  TextField,
  Button,
  Alert
} from '@mui/material';
import { apiUrl } from '@/utils/api';

interface ZonaData {
  nome: string;
  diretor?: string;
  coordenador_geral?: string;
  telefone?: string;
  email?: string;
}

export default function EditZonaPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [formData, setFormData] = useState<ZonaData>({ nome: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
        if (data.zona) {
          setFormData({
            nome: data.zona.nome || '',
            diretor: data.zona.diretor || '',
            coordenador_geral: data.zona.coordenador_geral || '',
            telefone: data.zona.telefone || '',
            email: data.zona.email || '',
          });
        }
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/v1/zona/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao atualizar a zona.');
      }

      setSuccess('Zona atualizada com sucesso! Redirecionando...');
      setTimeout(() => {
        router.push('/dashboard/zonas');
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Container><Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box></Container>;
  }

  if (error && !formData.nome) { // Show fatal error if initial fetch fails
    return <Container><Alert severity="error" sx={{ mt: 4 }}>{error}</Alert></Container>;
  }

  return (
    <Container>
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Editar Zona
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box mt={2} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Nome da Escola/CMEI" name="nome" value={formData.nome} onChange={handleChange} required />
            <TextField label="Diretor(a)" name="diretor" value={formData.diretor} onChange={handleChange} />
            <TextField label="Coordenador(a) Geral" name="coordenador_geral" value={formData.coordenador_geral} onChange={handleChange} />
            <TextField label="Telefone" name="telefone" value={formData.telefone} onChange={handleChange} />
            <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
            
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <Box mt={2} sx={{ position: 'relative' }}>
              <Button type="submit" variant="contained" disabled={saving}>
                Salvar Alterações
              </Button>
              {saving && (
                <CircularProgress
                  size={24}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              )}
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
