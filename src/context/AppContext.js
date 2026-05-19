import React, { createContext, useContext, useReducer } from 'react';
import { mockAppointments } from '../data/mockData';

const AppContext = createContext();

const initialState = {
  isAuthenticated: false,
  user: {
    id: 'u1',
    name: 'João Silva',
    avatar: 'https://i.pravatar.cc/300?img=1',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-9999',
    address: 'Rua das Flores, 123 - Apto 45, São Paulo',
    totalCuts: 5,
    memberSince: 'Março 2024',
  },
  appointments: mockAppointments,
  favorites: ['1', '2'],
  notifications: 3,
  activeFilter: 'Todos',
  searchQuery: '',
  trackingStatus: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_APPOINTMENT':
      return {
        ...state,
        appointments: [action.payload, ...state.appointments],
        user: { ...state.user, totalCuts: state.user.totalCuts + 1 },
      };
    case 'CANCEL_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.map(a =>
          a.id === action.payload ? { ...a, status: 'cancelled' } : a
        ),
      };
    case 'TOGGLE_FAVORITE':
      const isFav = state.favorites.includes(action.payload);
      return {
        ...state,
        favorites: isFav
          ? state.favorites.filter(id => id !== action.payload)
          : [...state.favorites, action.payload],
      };
    case 'SET_FILTER':
      return { ...state, activeFilter: action.payload };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
    case 'RATE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.map(a =>
          a.id === action.payload.id ? { ...a, rating: action.payload.rating } : a
        ),
      };
    case 'START_TRACKING':
      return { ...state, trackingStatus: action.payload };
    case 'CLEAR_TRACKING':
      return { ...state, trackingStatus: null };
    case 'LOGIN':
      return { ...state, isAuthenticated: true, user: { ...state.user, ...action.payload } };
    case 'REGISTER':
      return { ...state, isAuthenticated: true, user: { ...state.user, ...action.payload } };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addAppointment = (appointment) => {
    const newAppointment = {
      ...appointment,
      id: `a${Date.now()}`,
      status: 'upcoming',
      address: state.user.address,
    };
    dispatch({ type: 'ADD_APPOINTMENT', payload: newAppointment });
    return newAppointment;
  };

  const cancelAppointment = (id) => dispatch({ type: 'CANCEL_APPOINTMENT', payload: id });
  const toggleFavorite = (id) => dispatch({ type: 'TOGGLE_FAVORITE', payload: id });
  const setFilter = (filter) => dispatch({ type: 'SET_FILTER', payload: filter });
  const setSearch = (query) => dispatch({ type: 'SET_SEARCH', payload: query });
  const rateAppointment = (id, rating) => dispatch({ type: 'RATE_APPOINTMENT', payload: { id, rating } });
  const startTracking = (data) => dispatch({ type: 'START_TRACKING', payload: data });
  const clearTracking = () => dispatch({ type: 'CLEAR_TRACKING' });
  const updateUser = (data) => dispatch({ type: 'UPDATE_USER', payload: data });

  const login = (userData) => dispatch({ type: 'LOGIN', payload: userData });
  const register = (userData) => dispatch({ type: 'REGISTER', payload: userData });
  const logout = () => dispatch({ type: 'LOGOUT' });

  return (
    <AppContext.Provider value={{
      state,
      addAppointment,
      cancelAppointment,
      toggleFavorite,
      setFilter,
      setSearch,
      rateAppointment,
      startTracking,
      clearTracking,
      updateUser,
      login,
      register,
      logout,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
