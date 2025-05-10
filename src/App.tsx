import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  ThemeProvider,
  createTheme,
  Tab,
  Tabs,
  Button,
  Grid,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  useMediaQuery
} from '@mui/material';
import { Add as AddIcon, ContentCopy as CopyIcon, Map as MapIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { Navbar } from './components/Layout/Navbar';
import { AppointmentForm } from './components/Appointments/AppointmentForm';
import { Appointment, Service, User } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { appointmentService } from './services/appointments';
import { serviceService } from './services/services';
import { userService } from './services/users';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2C3E50',
      light: '#34495E',
      dark: '#1A252F',
    },
    secondary: {
      main: '#3498DB',
      light: '#5DADE2',
      dark: '#2980B9',
    },
    success: {
      main: '#27AE60',
      light: '#2ECC71',
      dark: '#219A52',
    },
    warning: {
      main: '#F39C12',
      light: '#F1C40F',
      dark: '#D35400',
    },
    error: {
      main: '#E74C3C',
      light: '#EC7063',
      dark: '#C0392B',
    },
    background: {
      default: '#F5F6FA',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#2C3E50',
    },
    h6: {
      fontWeight: 500,
      color: '#2C3E50',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '1rem',
        },
      },
    },
  },
});

const statusColors = {
  pending: theme.palette.warning.main,
  confirmed: theme.palette.success.main,
  cancelled: theme.palette.error.main,
  completed: theme.palette.secondary.main
};

function AppContent() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [providers, setProviders] = useState<User[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const { isImobiliaria } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [appointmentsData, providersData, clientsData] = await Promise.all([
        appointmentService.getAll(),
        userService.getByRole('provider'),
        userService.getByRole('client')
      ]);

      setAppointments(appointmentsData);
      setProviders(providersData);
      setClients(clientsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao carregar dados',
        severity: 'error'
      });
    }
  };

  const handleAppointmentSubmit = async (appointmentData: Partial<Appointment>) => {
    try {
      if (editingAppointment) {
        const updated = await appointmentService.update(editingAppointment.id, {
          ...appointmentData,
          serviceId: editingAppointment.serviceId
        });
        setAppointments(appointments.map(a => a.id === updated.id ? updated : a));
        setSnackbar({
          open: true,
          message: 'Agendamento atualizado com sucesso!',
          severity: 'success'
        });
      } else {
        if (providers.length === 0) {
          throw new Error('Nenhum prestador disponível');
        }
        if (clients.length === 0) {
          throw new Error('Nenhum cliente disponível');
        }

        const newAppointment = await appointmentService.create({
          ...appointmentData,
          providerId: providers[0].id,
          clientId: clients[0].id,
          serviceId: '00000000-0000-0000-0000-000000000001',
          status: 'pending',
          date: appointmentData.date || new Date(),
          type: appointmentData.type || 'orçamento',
          location: appointmentData.location || '',
          tenant: appointmentData.tenant || '',
          description: appointmentData.description || ''
        });

        setAppointments([...appointments, newAppointment]);
        setSnackbar({
          open: true,
          message: 'Agendamento criado com sucesso!',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Erro ao salvar agendamento',
        severity: 'error'
      });
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    try {
      await appointmentService.delete(id);
      setAppointments(appointments.filter(a => a.id !== id));
      setSnackbar({
        open: true,
        message: 'Agendamento excluído com sucesso!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao excluir agendamento',
        severity: 'error'
      });
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    return (
      appointmentDate.getDate() === selectedDate.getDate() &&
      appointmentDate.getMonth() === selectedDate.getMonth() &&
      appointmentDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  // Função para verificar se um dia tem agendamentos
  const hasAppointmentsOnDay = (date: Date) => {
    return appointments.some(appointment => 
      isSameDay(new Date(appointment.date), date)
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              align="center"
              sx={{ 
                mb: 4,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 60,
                  height: 4,
                  bgcolor: 'primary.main',
                  borderRadius: 2,
                }
              }}
            >
              Sistema de Agendamentos
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Paper 
                  sx={{ 
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <DateCalendar
                    value={selectedDate}
                    onChange={(newDate) => newDate && setSelectedDate(newDate)}
                    sx={{ 
                      width: '100%',
                      '& .MuiPickersDay-root': {
                        borderRadius: 1,
                        '&.Mui-selected': {
                          backgroundColor: 'primary.main',
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                          },
                        },
                      },
                    }}
                    slots={{
                      day: (props: PickersDayProps<Date>) => {
                        const isSelected = hasAppointmentsOnDay(props.day);
                        return (
                          <Box
                            sx={{
                              position: 'relative',
                              '& .MuiPickersDay-root': {
                                ...(isSelected && {
                                  backgroundColor: 'warning.light',
                                  color: 'warning.contrastText',
                                  fontWeight: 'bold',
                                  '&:hover': {
                                    backgroundColor: 'warning.main',
                                  },
                                }),
                              },
                              '&::after': isSelected ? {
                                content: '""',
                                position: 'absolute',
                                bottom: 2,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: 4,
                                height: 4,
                                borderRadius: '50%',
                                backgroundColor: 'warning.main',
                              } : {},
                            }}
                          >
                            <PickersDay {...props} />
                          </Box>
                        );
                      }
                    }}
                  />
                </Paper>
              </Grid>

              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 3 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 3,
                    flexDirection: isImobiliaria ? 'row' : 'column',
                    gap: isImobiliaria ? 2 : 0
                  }}>
                    <Typography variant="h6" sx={{ color: 'primary.main' }}>
                      Agendamentos para {selectedDate.toLocaleDateString()}
                    </Typography>
                    {isImobiliaria && (
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => {
                          setEditingAppointment(null);
                          setIsFormOpen(true);
                        }}
                        sx={{
                          bgcolor: 'primary.main',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          },
                        }}
                      >
                        Novo Agendamento
                      </Button>
                    )}
                  </Box>

                  {filteredAppointments.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {filteredAppointments.map((appointment) => {
                        const service = providers.find(p => p.id === appointment.providerId);
                        return (
                          <Paper
                            key={appointment.id}
                            sx={{
                              p: 3,
                              borderLeft: 6,
                              borderColor: statusColors[appointment.status],
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                boxShadow: isImobiliaria ? '0px 4px 8px rgba(0,0,0,0.1)' : 'none',
                                transform: isImobiliaria ? 'translateY(-2px)' : 'none',
                                cursor: isImobiliaria ? 'pointer' : 'default'
                              }
                            }}
                            onClick={() => isImobiliaria && setEditingAppointment(appointment)}
                          >
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center', 
                              mb: 2 
                            }}>
                              <Typography 
                                variant="h6" 
                                sx={{ 
                                  color: 'primary.main',
                                  fontWeight: 600
                                }}
                              >
                                {appointment.type === 'orçamento' ? 'Orçamento' : 'Reparo'}
                              </Typography>
                              {isImobiliaria && (
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    px: 2, 
                                    py: 0.5, 
                                    borderRadius: 2,
                                    backgroundColor: statusColors[appointment.status],
                                    color: 'white',
                                    fontWeight: 500,
                                    textTransform: 'uppercase',
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.5px'
                                  }}
                                >
                                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                </Typography>
                              )}
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                              <Box>
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    color: 'text.secondary',
                                    display: 'block',
                                    mb: 0.5
                                  }}
                                >
                                  Data e hora:
                                </Typography>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    color: 'text.secondary',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                  }}
                                >
                                  📅 {format(new Date(appointment.date), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                                </Typography>
                              </Box>
                              
                              <Box>
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    color: 'text.secondary',
                                    display: 'block',
                                    mb: 0.5
                                  }}
                                >
                                  Nome do cliente:
                                </Typography>
                                <Typography 
                                  variant="body1" 
                                  sx={{ 
                                    fontWeight: 600,
                                    color: 'primary.main'
                                  }}
                                >
                                  {appointment.tenant}
                                </Typography>
                              </Box>
                              
                              <Box>
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    color: 'text.secondary',
                                    display: 'block',
                                    mb: 0.5
                                  }}
                                >
                                  Endereço:
                                </Typography>
                                <Box sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: 1,
                                  bgcolor: 'background.default',
                                  p: 1.5,
                                  borderRadius: 1
                                }}>
                                  <Typography variant="body2" sx={{ color: 'primary.main' }}>
                                    📍 {appointment.location}
                                  </Typography>
                                  <Tooltip title="Copiar endereço">
                                    <IconButton 
                                      size="small" 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigator.clipboard.writeText(appointment.location);
                                      }}
                                      sx={{ color: 'primary.main' }}
                                    >
                                      <CopyIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Abrir no Google Maps">
                                    <IconButton 
                                      size="small" 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const encodedAddress = encodeURIComponent(appointment.location);
                                        window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
                                      }}
                                      sx={{ color: 'primary.main' }}
                                    >
                                      <MapIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </Box>
                              
                              <Box>
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    color: 'text.secondary',
                                    display: 'block',
                                    mb: 0.5
                                  }}
                                >
                                  Situação:
                                </Typography>
                                <Typography 
                                  variant="body2"
                                  sx={{
                                    bgcolor: 'background.default',
                                    p: 1.5,
                                    borderRadius: 1,
                                    color: 'text.primary'
                                  }}
                                >
                                  📝 {appointment.description}
                                </Typography>
                              </Box>

                              {appointment.type === 'orçamento' && appointment.status === 'confirmed' && appointment.approvedValue && (
                                <Box>
                                  <Typography 
                                    variant="caption" 
                                    sx={{ 
                                      color: 'text.secondary',
                                      display: 'block',
                                      mb: 0.5
                                    }}
                                  >
                                    Valor aprovado:
                                  </Typography>
                                  <Box sx={{ 
                                    mt: 1, 
                                    p: 2, 
                                    bgcolor: 'success.light', 
                                    borderRadius: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                  }}>
                                    <Typography variant="body2" color="success.contrastText" sx={{ fontWeight: 500 }}>
                                      💰 R$ {appointment.approvedValue.toFixed(2)}
                                    </Typography>
                                  </Box>
                                </Box>
                              )}
                            </Box>
                          </Paper>
                        );
                      })}
                    </Box>
                  ) : (
                    <Box sx={{ 
                      textAlign: 'center', 
                      py: 4,
                      bgcolor: 'background.default',
                      borderRadius: 1
                    }}>
                      <Typography variant="body1" color="text.secondary">
                        Nenhum agendamento para esta data
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {isImobiliaria && (
            <AppointmentForm
              open={isFormOpen || !!editingAppointment}
              onClose={() => {
                setIsFormOpen(false);
                setEditingAppointment(null);
              }}
              onSubmit={handleAppointmentSubmit}
              onDelete={handleDeleteAppointment}
              initialData={editingAppointment || undefined}
            />
          )}
        </Container>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ 
              width: '100%',
              boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
              borderRadius: 2
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

function SwitchImobiliaria() {
  const { isImobiliaria, setIsImobiliaria } = useAuth();
  
  return (
    <Box sx={{ 
      position: 'fixed', 
      top: 16, 
      right: 16, 
      zIndex: 1000, 
      bgcolor: 'white', 
      p: 2, 
      borderRadius: 2, 
      boxShadow: '0px 2px 4px rgba(0,0,0,0.1)'
    }}>
      <FormControlLabel
        control={
          <Switch
            checked={isImobiliaria}
            onChange={(e) => setIsImobiliaria(e.target.checked)}
            color="primary"
          />
        }
        label={
          <Typography sx={{ 
            fontWeight: 500,
            color: 'primary.main'
          }}>
            Sou Imobiliária
          </Typography>
        }
      />
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <SwitchImobiliaria />
      <AppContent />
    </AuthProvider>
  );
}

export default App; 