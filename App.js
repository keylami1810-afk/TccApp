import { ExpoRoot } from 'expo-router';
import { View } from 'react-native';

export default function App() {
  // Esse arquivo apenas serve de ponte para o Expo Router abrir a sua pasta "app"
  const ctx = require.context('./APP');
  return <ExpoRoot context={ctx} />;
}