"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  CircularProgress,
  Button,
  Modal,
  Input,
  Alert
} from '@mui/material';
import { Visibility, Edit, UploadFile } from '@mui/icons-material';
import Link from 'next/link';
import { apiUrl } from '@/utils/api';

interface Zona {
  _id: string;
  nome: string;
  inep: string;
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ZonasListPage() {
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for upload modal
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const fetchZonas = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/v1/zona`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Falha ao buscar os dados das zonas.');
      }

      const data = await response.json();
      setZonas(data.zona || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchZonas();
  }, [fetchZonas]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) {
      setUploadMessage("Por favor, selecione um arquivo CSV.");
      return;
    }

    setIsUploading(true);
    setUploadMessage("");
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/api/v1/zona/upload-seed`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadMessage(result.message);
        fetchZonas(); // Refresh the table
        setTimeout(() => {
          setModalOpen(false);
          setUploadMessage('');
          setSelectedFile(null);
        }, 2000);
      } else {
        setUploadMessage(result.error || "Ocorreu um erro.");
      }
    } catch (error) {
      setUploadMessage("Ocorreu um erro ao enviar o arquivo.");
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return <Container><Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box></Container>;
  }

  if (error) {
    return <Container><Typography color="error" sx={{ mt: 4 }}>{error}</Typography></Container>;
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Lista de Zonas
        </Typography>
        <Button variant="contained" startIcon={<UploadFile />} onClick={() => setModalOpen(true)}>
          Adicionar por CSV
        </Button>
      </Box>

      <Modal open={isModalOpen} onClose={() => setModalOpen(false)}>
        <Paper sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Povoar Zonas a partir de CSV
          </Typography>
          <Box mt={2}>
            <Input
              type="file"
              onChange={handleFileChange}
              inputProps={{ accept: '.csv' }}
              disabled={isUploading}
            />
          </Box>
          <Box mt={2} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button variant="contained" onClick={handleUploadSubmit} disabled={isUploading}>
              {isUploading ? "Processando..." : "Enviar"}
            </Button>
            {isUploading && <CircularProgress size={24} />}
          </Box>
          {uploadMessage && (
            <Box mt={2}>
              <Alert severity={uploadMessage.includes("sucesso") ? "success" : "error"}>{uploadMessage}</Alert>
            </Box>
          )}
        </Paper>
      </Modal>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome da Escola/CMEI</TableCell>
              <TableCell>INEP</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {zonas.map((zona) => (
              <TableRow key={zona._id}>
                <TableCell>{zona.nome}</TableCell>
                <TableCell>{zona.inep}</TableCell>
                <TableCell align="right">
                  <Link href={`/dashboard/zonas/view/${zona._id}`} passHref>
                    <IconButton aria-label="visualizar">
                      <Visibility />
                    </IconButton>
                  </Link>
                  <Link href={`/dashboard/zonas/edit/${zona._id}`} passHref>
                    <IconButton aria-label="editar">
                      <Edit />
                    </IconButton>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
