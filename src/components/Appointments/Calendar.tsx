import React, { useState } from 'react';
import { Box, Badge, List, ListItem, ListItemText, ListItemSecondaryAction, Typography, Chip, IconButton } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { format, isSameDay } from 'date-fns';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Appointment } from '../../types';

interface CalendarProps {
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ appointments, onEdit, onDelete }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const filteredAppointments = appointments.filter(
    (appointment) => isSameDay(new Date(appointment.date), selectedDate)
  );

  const getStatusLabel = (status: Appointment['status']) => {
    const labels: Record<Appointment['status'], string> = {
      pending: 'Pendente',
      confirmed: 'Confirmado',
      cancelled: 'Cancelado',
      completed: 'Concluído'
    };
    return labels[status];
  };

  const getStatusColor = (status: Appointment['status']) => {
    const colors: Record<Appointment['status'], 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
      pending: 'warning',
      confirmed: 'info',
      cancelled: 'error',
      completed: 'success'
    };
    return colors[status];
  };

  return (
    <Box sx={{ 
      width: '100%',
      '& .MuiPickersCalendarHeader-root': {
        display: { xs: 'none', sm: 'flex' }
      },
      '& .MuiPickersCalendarHeader-labelContainer': {
        margin: { xs: '0 auto', sm: '0' }
      }
    }}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
        <DateCalendar
          value={selectedDate}
          onChange={handleDateChange}
          sx={{
            width: '100%',
            '& .MuiPickersDay-root': {
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              margin: { xs: 0.5, sm: 1 }
            },
            '& .MuiPickersCalendarHeader-root': {
              marginBottom: { xs: 1, sm: 2 }
            }
          }}
          slots={{
            day: (props) => {
              const date = props.day;
              const hasAppointment = appointments.some(
                (appointment) => isSameDay(new Date(appointment.date), date)
              );

              return (
                <Badge
                  key={date.toString()}
                  overlap="circular"
                  badgeContent={hasAppointment ? '•' : undefined}
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      right: { xs: 2, sm: 4 },
                      top: { xs: 2, sm: 4 },
                      width: { xs: 8, sm: 10 },
                      height: { xs: 8, sm: 10 }
                    }
                  }}
                >
                  <PickersDay {...props} />
                </Badge>
              );
            }
          }}
        />
      </LocalizationProvider>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Agendamentos do Dia
        </Typography>
        <List>
          {filteredAppointments.map((appointment) => (
            <ListItem
              key={appointment.id}
              sx={{
                mb: 1,
                bgcolor: 'background.paper',
                borderRadius: 1,
                boxShadow: 1
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1">
                      {format(new Date(appointment.date), 'HH:mm')}
                    </Typography>
                    <Chip
                      label={appointment.type}
                      size="small"
                      color={appointment.type === 'orçamento' ? 'primary' : 'secondary'}
                    />
                    <Chip
                      label={getStatusLabel(appointment.status)}
                      size="small"
                      color={getStatusColor(appointment.status)}
                    />
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Cliente: {appointment.tenant}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Local: {appointment.location}
                    </Typography>
                    {appointment.status === 'confirmed' && appointment.approvedValue && (
                      <Typography variant="body2" color="text.secondary">
                        Valor: R$ {appointment.approvedValue.toFixed(2)}
                      </Typography>
                    )}
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => onEdit(appointment)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => onDelete(appointment.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Calendar; 