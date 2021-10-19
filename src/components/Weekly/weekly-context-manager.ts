import React, { createContext } from 'react';
import { WeeklyInfo } from './weekly.type';

// createContext 参考
// https://stackoverflow.com/questions/61333188/react-typescript-avoid-context-default-value
export const WeeklyContext = createContext<WeeklyInfo | null>(null);
