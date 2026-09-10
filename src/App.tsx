/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AppTab, DailyJournalEntry, UserProfileData } from './types';
import { storageService } from './services/storageService';
import { AppHeader } from './components/navigation/AppHeader';
import { BottomTabBar } from './components/navigation/BottomTabBar';
import { CosmicBackground } from './design-system';
import { HomeView } from './components/views/HomeView';
import { DailyJournalView } from './components/views/DailyJournalView';
import { MyDayView } from './components/views/MyDayView';
import { JourneyView } from './components/views/JourneyView';
import { HistoryView } from './components/views/HistoryView';
import { PrintableBookView } from './components/views/PrintableBookView';
import { ProfileView } from './components/views/ProfileView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>('inicio');
  const [profile, setProfile] = useState<UserProfileData>(() =>
    storageService.getUserProfile()
  );

  const [currentDay, setCurrentDay] = useState<number>(() => {
    const saved = localStorage.getItem('metodo_atomico_current_day');
    const prof = storageService.getUserProfile();
    const maxDay = prof.unlocked100DaysJourney ? 100 : 21;
    return saved ? Math.min(Math.max(Number(saved), 1), maxDay) : 1;
  });

  const [entries, setEntries] = useState<Record<number, DailyJournalEntry>>(() =>
    storageService.getAllEntries()
  );

  const [stats, setStats] = useState(() => storageService.getJourneyStats());

  // Salvar dia atual
  const handleSelectDay = useCallback((day: number) => {
    const prof = storageService.getUserProfile();
    const maxDay = prof.unlocked100DaysJourney ? 100 : 21;
    const clamped = Math.min(Math.max(day, 1), maxDay);
    setCurrentDay(clamped);
    localStorage.setItem('metodo_atomico_current_day', clamped.toString());
  }, []);

  // Recarregar dados quando houver evento de atualização do storage
  const reloadData = useCallback(() => {
    setEntries(storageService.getAllEntries());
    setProfile(storageService.getUserProfile());
    setStats(storageService.getJourneyStats());
  }, []);

  useEffect(() => {
    window.addEventListener('metodo_atomico_update', reloadData);
    return () => window.removeEventListener('metodo_atomico_update', reloadData);
  }, [reloadData]);

  const handleSaveProfile = (updatedProfile: UserProfileData) => {
    storageService.saveUserProfile(updatedProfile);
    setProfile(updatedProfile);
  };

  const handleResetJourney = () => {
    storageService.resetJourney();
    setCurrentDay(1);
    reloadData();
    setCurrentTab('inicio');
  };

  const todayEntry = entries[currentDay] || storageService.getEntryForDay(currentDay);

  return (
    <CosmicBackground currentDay={currentDay}>
      {/* Universal Sticky Header Navigation */}
      <AppHeader
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentDay={currentDay}
        completedDays={stats.completedDays}
        totalDays={stats.totalDays}
      />

      {/* Main Active Tab Content Area */}
      <main className="flex-1 w-full pb-16 md:pb-0">
        {currentTab === 'inicio' && (
          <HomeView
            onNavigate={setCurrentTab}
            currentDay={currentDay}
            stats={stats}
            todayEntry={todayEntry}
            profile={profile}
            onSelectDay={handleSelectDay}
          />
        )}

        {currentTab === 'diario' && (
          <DailyJournalView
            initialDay={currentDay}
            profile={profile}
            onNavigateDay={handleSelectDay}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'dia' && (
          <MyDayView
            currentDay={currentDay}
            onNavigate={setCurrentTab}
            onSelectDay={handleSelectDay}
          />
        )}

        {currentTab === 'jornada' && (
          <JourneyView
            currentDay={currentDay}
            entries={entries}
            onNavigate={setCurrentTab}
            onSelectDay={handleSelectDay}
          />
        )}

        {currentTab === 'historico' && (
          <HistoryView
            entries={entries}
            onNavigate={setCurrentTab}
            onSelectDay={handleSelectDay}
          />
        )}

        {currentTab === 'imprimir' && <PrintableBookView />}

        {currentTab === 'perfil' && (
          <ProfileView
            profile={profile}
            onSaveProfile={handleSaveProfile}
            onResetJourney={handleResetJourney}
          />
        )}
      </main>

      {/* Mobile Bottom Tab Bar */}
      <BottomTabBar currentTab={currentTab} onSelectTab={setCurrentTab} />
    </CosmicBackground>
  );
}
