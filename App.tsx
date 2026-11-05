/**
 * STOP STACK — ND exposure reckoner.
 * App.tsx is the state machine only; every screen owns its own behaviour.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler, StatusBar, StyleSheet, View } from 'react-native';
import theme from './src/constants/theme';
import { DEFAULT_RECIPROCITY } from './src/constants/config';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import GameScreen from './src/screens/GameScreen';
import ResultScreen from './src/screens/ResultScreen';
import CountdownScreen from './src/screens/CountdownScreen';
import useFieldLog from './src/hooks/useFieldLog';
import type { ExposureResult } from './src/game/exposure';

type Screen = 'loader' | 'menu' | 'game' | 'result' | 'countdown';

function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');
  const [nightMode, setNightMode] = useState(false);
  const [recip, setRecip] = useState(DEFAULT_RECIPROCITY);
  const [result, setResult] = useState<ExposureResult | null>(null);
  const [loggedTs, setLoggedTs] = useState<number | null>(null);
  const { logShot, count: shots } = useFieldLog();

  const goMenu = useCallback(() => setScreen('menu'), []);
  const goGame = useCallback(() => setScreen('game'), []);
  const toggleNight = useCallback(() => setNightMode(v => !v), []);

  const handleCalculate = useCallback((next: ExposureResult) => {
    setResult(next);
    setLoggedTs(null);
    setScreen('result');
  }, []);

  const handleBulb = useCallback(() => setScreen('countdown'), []);
  const handleBackToResult = useCallback(() => setScreen('result'), []);

  const handleSave = useCallback(() => {
    if (result) {
      logShot(result);
      setLoggedTs(Date.now());
    }
  }, [result, logShot]);

  useEffect(() => {
    const onBack = () => {
      if (screen === 'game') {
        setScreen('menu');
        return true;
      }
      if (screen === 'result') {
        setScreen('game');
        return true;
      }
      if (screen === 'countdown') {
        setScreen('result');
        return true;
      }
      return false;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => sub.remove();
  }, [screen]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {screen === 'loader' ? <LoaderScreen onDone={goMenu} /> : null}

      {screen === 'menu' ? (
        <MenuScreen
          shots={shots}
          recip={recip}
          nightMode={nightMode}
          onToggleNight={toggleNight}
          onStart={goGame}
        />
      ) : null}

      {screen === 'game' ? (
        <GameScreen
          recip={recip}
          onRecipChange={setRecip}
          onHome={goMenu}
          onCalculate={handleCalculate}
        />
      ) : null}

      {screen === 'result' && result ? (
        <ResultScreen
          result={result}
          logged={loggedTs !== null}
          onBulb={handleBulb}
          onAgain={goGame}
          onMenu={goMenu}
          onSave={handleSave}
        />
      ) : null}

      {screen === 'countdown' && result ? (
        <CountdownScreen
          result={result}
          onClose={handleBackToResult}
          onAgain={handleBackToResult}
        />
      ) : null}

      {nightMode ? <View pointerEvents="none" style={styles.nightVeil} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
  },
  nightVeil: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.night.veil,
  },
});

export default App;
