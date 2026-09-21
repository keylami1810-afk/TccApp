import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { View, Text, ActivityIndicator } from "react-native";

import { initDatabase } from "../database/initializeDatabase";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [databaseReady, setDatabaseReady] = useState(false);
  const [databaseError, setDatabaseError] = useState(null);

  const [fontsLoaded, fontError] = useFonts({
    Amoria: require("../assets/fonts/AMORIA.otf"),
    Fantasia: require("../assets/fonts/Fantasia.ttf"),
    Flowers: require("../assets/fonts/Flowers.otf"),
    Fogo: require("../assets/fonts/Fogo.otf"),
    Gelo: require("../assets/fonts/Gelo.ttf"),
    Gotico: require("../assets/fonts/Gotico.ttf"),
    Magic: require("../assets/fonts/Magic.ttf"),
  });

  useEffect(() => {
    let ativo = true;

    async function prepararBanco() {
      try {
        await initDatabase();

        if (ativo) {
          setDatabaseReady(true);
        }
      } catch (error) {
        console.error("Erro ao inicializar banco:", error);

        if (ativo) {
          setDatabaseError(error);
        }
      }
    }

    prepararBanco();

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (
      (fontsLoaded || fontError) &&
      (databaseReady || databaseError)
    ) {
      SplashScreen.hideAsync();
    }
  }, [
    fontsLoaded,
    fontError,
    databaseReady,
    databaseError,
  ]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (!databaseReady && !databaseError) {
    return null;
  }

  if (databaseError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 30,
          backgroundColor: "#F3E8FF",
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            marginBottom: 12,
            textAlign: "center",
            color: "#4A154B",
          }}
        >
          Erro ao iniciar o banco
        </Text>

        <Text
          style={{
            fontSize: 14,
            textAlign: "center",
            color: "#555",
          }}
        >
          Não foi possível inicializar o banco de dados SQLite.
        </Text>

        <Text
          style={{
            fontSize: 12,
            textAlign: "center",
            marginTop: 15,
            color: "#888",
          }}
        >
          {String(databaseError?.message || "")}
        </Text>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
