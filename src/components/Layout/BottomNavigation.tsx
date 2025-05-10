import React from 'react';
import { Paper, BottomNavigation as MuiBottomNavigation, BottomNavigationAction } from '@mui/material';
import { 
  CalendarMonth as CalendarIcon,
  Add as AddIcon,
  List as ListIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isImobiliaria } = useAuth();

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0,
        zIndex: 1000
      }} 
      elevation={3}
    >
      <MuiBottomNavigation
        value={location.pathname}
        onChange={handleChange}
        showLabels
      >
        <BottomNavigationAction
          label="Calendário"
          value="/"
          icon={<CalendarIcon />}
        />
        {isImobiliaria && (
          <BottomNavigationAction
            label="Novo"
            value="/novo-agendamento"
            icon={<AddIcon />}
          />
        )}
        <BottomNavigationAction
          label="Lista"
          value="/lista"
          icon={<ListIcon />}
        />
        <BottomNavigationAction
          label="Perfil"
          value="/perfil"
          icon={<PersonIcon />}
        />
      </MuiBottomNavigation>
    </Paper>
  );
} 