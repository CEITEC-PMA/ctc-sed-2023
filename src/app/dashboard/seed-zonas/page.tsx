"use client";
import { useState } from 'react';
import { Button, Container, Paper, Typography, Input, Box } from '@mui/material';
import { apiUrl } from '@/utils/api';

export default function SeedZonasPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setMessage('Por favor, selecione um arquivo CSV.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/v1/zona/upload-seed`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message);
      } else {
        setMessage(result.error || 'Ocorreu um erro.');
      }
    } catch (error) {
      setMessage('Ocorreu um erro ao enviar o arquivo.');
    }
  };

  return (
    <Container>
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Povoar Zonas a partir de CSV
        </Typography>
        <Box mt={2}>
          <Input
            type="file"
            onChange={handleFileChange}
            inputProps={{ accept: '.csv' }}
          />
        </Box>
        <Box mt={2}>
          <Button variant="contained" onClick={handleSubmit}>
            Enviar
          </Button>
        </Box>
        {message && (
          <Box mt={2}>
            <Typography>{message}</Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
