
import React from 'react';
import { ConfigureEmulatorService } from "./components/common/react-ch5/react-ch5";
import './App.css';
import smwEmulator from "./assets/data/smw-emulator.json";
import Dashboard from './components/dashboard/dashboard';

function App() {
  // Use these two lines if using emulator - comment out when live or use env var
  const configureEmulatorService: ConfigureEmulatorService = new ConfigureEmulatorService();
  configureEmulatorService.initEmulator(smwEmulator);

  return (
    <Dashboard />
  );
}

export default App;
