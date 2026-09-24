
import React, { useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";

import { useRouter, useLocalSearchParams } from "expo-router";

export default function CarregamentoAluno() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const nomeUsuario = params.nomeUsuario || "Aluno(a)";

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/atividadesaluno");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.conteudo}>

        <View style={styles.gatoContainer}>
          <Text style={styles.gato}>🐱</Text>

          <Text style={styles.patinhas}>👋</Text>
        </View>

        <Text style={styles.titulo}>
          Seja bem-vindo(a)!
        </Text>

        <Text style={styles.nome}>
          {nomeUsuario}
        </Text>

        <Text style={styles.subtitulo}>
          Prepare-se para começar sua jornada
          financeira! 💰
        </Text>

        <View style={styles.carregando}>
          <ActivityIndicator
            size="large"
            color="#B76EA4"
          />

          <Text style={styles.textoCarregando}>
            Carregando...
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3E8FF",
  },

  conteudo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  gatoContainer: {
    width: 150,
    height: 150,

    borderRadius: 75,

    backgroundColor: "#FFFFFF",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 25,

    elevation: 5,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },

  gato: {
    fontSize: 75,
  },

  patinhas: {
    position: "absolute",

    right: 15,
    top: 18,

    fontSize: 35,
  },

  titulo: {
    fontSize: 28,
    fontWeight: "bold",

    color: "#4A154B",

    textAlign: "center",
  },

  nome: {
    fontSize: 22,
    fontWeight: "600",

    color: "#B76EA4",

    marginTop: 6,

    textAlign: "center",
  },

  subtitulo: {
    fontSize: 15,

    color: "#6B5B6B",

    textAlign: "center",

    lineHeight: 22,

    marginTop: 14,

    maxWidth: 300,
  },

  carregando: {
    alignItems: "center",

    marginTop: 35,
  },

  textoCarregando: {
    marginTop: 10,

    fontSize: 13,

    color: "#888",
  },
});
