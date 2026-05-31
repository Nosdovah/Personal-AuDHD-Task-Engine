import React from 'react';
import { useTaskStore } from './store/useTaskStore';
import EnergyCheckIn from './components/organisms/EnergyCheckIn';
import DailyPlate from './components/organisms/DailyPlate';
import './App.css';

function App() {
  const currentEnergy = useTaskStore((state) => state.currentEnergy);

  return (
    <div className="min-h-screen blueprint-bg text-slate-100 font-tech selection:bg-sky-500/30">
      {!currentEnergy ? (
        <EnergyCheckIn />
      ) : (
        <DailyPlate />
      )}
    </div>
  );
}

export default App;
