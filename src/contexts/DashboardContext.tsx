import { createContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { FilterOptions } from '../types';

interface DashboardContextType {
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  startDate: Date;
  endDate: Date;
  setDateRange: (startDate: Date, endDate: Date) => void;
  resetFilters: () => void;
}

const getDefaultDateRange = () => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  return { start: startOfMonth, end: today };
};

const defaultFilters: FilterOptions = {};

export const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider = ({ children }: DashboardProviderProps) => {
  const { start: defaultStart, end: defaultEnd } = getDefaultDateRange();
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [startDate, setStartDate] = useState<Date>(defaultStart);
  const [endDate, setEndDate] = useState<Date>(defaultEnd);

  useEffect(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      startDate,
      endDate,
    }));
  }, [startDate, endDate]);

  const setDateRange = useCallback((newStartDate: Date, newEndDate: Date) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  }, []);

  const resetFilters = useCallback(() => {
    const { start, end } = getDefaultDateRange();
    setStartDate(start);
    setEndDate(end);
    setFilters(defaultFilters);
  }, []);

  const value: DashboardContextType = {
    filters,
    setFilters,
    startDate,
    endDate,
    setDateRange,
    resetFilters,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};
