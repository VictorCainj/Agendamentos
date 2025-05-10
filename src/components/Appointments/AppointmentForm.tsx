import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Appointment } from '../../types';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface AppointmentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (appointment: Partial<Appointment>) => void;
  onDelete?: (id: string) => void;
  initialData?: Partial<Appointment>;
}

type FormData = {
  type: 'orçamento' | 'reparo';
  date: Date;
  location: string;
  tenant: string;
  description: string;
  status: Appointment['status'];
  approvedValue?: number;
};

export function AppointmentForm({
  open,
  onClose,
  onSubmit,
  onDelete,
  initialData
}: AppointmentFormProps) {
  const [formData, setFormData] = useState<FormData>({
    type: initialData?.type || 'orçamento',
    date: initialData?.date || new Date(),
    location: initialData?.location || '',
    tenant: initialData?.tenant || '',
    description: initialData?.description || '',
    status: initialData?.status || 'pending',
    approvedValue: initialData?.approvedValue
  });

  const theme = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      date: formData.date || new Date()
    });
    onClose();
  };

  const handleDelete = () => {
    if (initialData?.id && onDelete) {
      onDelete(initialData.id);
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      fullScreen={useMediaQuery(theme.breakpoints.down('sm'))}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          px: { xs: 2, sm: 3 }
        }}>
          {initialData ? 'Editar Agendamento' : 'Novo Agendamento'}
          {initialData && onDelete && (
            <IconButton 
              onClick={handleDelete}
              color="error"
              sx={{ 
                '&:hover': { 
                  backgroundColor: 'error.light',
                  color: 'error.contrastText'
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </DialogTitle>
        
        <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2, 
            mt: 2,
            '& .MuiFormControl-root': {
              width: '100%'
            }
          }}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Serviço</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'orçamento' | 'reparo' })}
                required
                native
              >
                <option value="orçamento">Orçamento</option>
                <option value="reparo">Reparo</option>
              </Select>
            </FormControl>

            <DateTimePicker
              label="Data e Hora"
              value={formData.date}
              onChange={(newValue) => setFormData({ ...formData, date: newValue || new Date() })}
              slotProps={{
                textField: {
                  fullWidth: true
                }
              }}
            />

            <TextField
              label="Nome do Cliente"
              value={formData.tenant}
              onChange={(e) => setFormData({ ...formData, tenant: e.target.value })}
              required
              fullWidth
              inputProps={{
                autoComplete: 'off'
              }}
            />

            <TextField
              label="Endereço do Serviço"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              fullWidth
              inputProps={{
                autoComplete: 'off'
              }}
            />

            <TextField
              label="Descrição do Serviço"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              fullWidth
              placeholder="Descreva o serviço que precisa ser realizado..."
            />

            {initialData && (
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Appointment['status'] })}
                  native
                >
                  <option value="pending">Pendente</option>
                  <option value="confirmed">Confirmado</option>
                  <option value="cancelled">Cancelado</option>
                  <option value="completed">Concluído</option>
                </Select>
              </FormControl>
            )}

            {formData.status === 'confirmed' && (
              <>
                <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
                  Informações do Orçamento Aprovado
                </Typography>
                <TextField
                  label="Valor Aprovado"
                  type="number"
                  value={formData.approvedValue || ''}
                  onChange={(e) => setFormData({ ...formData, approvedValue: Number(e.target.value) })}
                  fullWidth
                  InputProps={{
                    startAdornment: <Typography>R$</Typography>
                  }}
                />
              </>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            fullWidth={useMediaQuery(theme.breakpoints.down('sm'))}
          >
            {initialData ? 'Salvar' : 'Agendar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 