import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { temasDoProjeto, obterTemaSalvo, salvarTema } from "./temas";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nomeTema, setNomeTema] = useState("claro");

  // Aponta direto para assets/fonts/AMORIA.otf subindo um nível
  const [fontsLoaded] = useFonts({
    Amoria: require("../assets/fonts/AMORIA.otf"),
  });

  useEffect(() => {
    carregarTema();
  }, []);

  const carregarTema = async () => {
    const t = await obterTemaSalvo();
    setNomeTema(t);
  };

  const alternarTema = async () => {
    const chaves = Object.keys(temasDoProjeto);
    const proximaIndex = (chaves.indexOf(nomeTema) + 1) % chaves.length;
    const novoTema = chaves[proximaIndex];
    setNomeTema(novoTema);
    await salvarTema(novoTema);
  };

  const tema = temasDoProjeto[nomeTema] || temasDoProjeto.claro;

  const fazerLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      const nomeSalvo = await AsyncStorage.getItem(`@user_nome_${email.toLowerCase()}`);
      const nomeExibicao = nomeSalvo || email.split("@")[0];

      await AsyncStorage.setItem("@nome_usuario", nomeExibicao);

      router.push({
        pathname: "/principal",
        params: { nomeUsuario: nomeExibicao },
      });
    } catch (error) {
      Alert.alert("Erro", "Falha ao realizar login.");
    }
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tema.fundo }]}>
      <View style={[styles.card, { backgroundColor: tema.cardBg }]}>
        <View style={styles.header}>
          <Text style={styles.iconeBorboleta}>🦋</Text>

          <Text
            style={[
              styles.titulo,
              {
                color: tema.textoGeral,
                fontFamily: "Amoria",
              },
            ]}
          >
            Malomi
          </Text>

          <Text style={[styles.subtitulo, { color: tema.textoGeral }]}>
            Seu dinheiro. Seu controle. Seu futuro.
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: tema.textoGeral }]}>E-mail</Text>
          <TextInput
            placeholder="seu@email.com"
            placeholderTextColor="#A1A1AA"
            style={[
              styles.input,
              {
                backgroundColor: tema.caixaInput,
                borderColor: tema.borda,
                color: tema.textoGeral,
              },
            ]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: tema.textoGeral }]}>Senha</Text>
          <TextInput
            placeholder="••••••••"
            placeholderTextColor="#A1A1AA"
            secureTextEntry
            style={[
              styles.input,
              {
                backgroundColor: tema.caixaInput,
                borderColor: tema.borda,
                color: tema.textoGeral,
              },
            ]}
            value={senha}
            onChangeText={setSenha}
          />
        </View>

        <TouchableOpacity
          style={[styles.botao, { backgroundColor: tema.botao }]}
          onPress={fazerLogin}
        >
          <Text style={[styles.textoBotao, { color: tema.textoBotao }]}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/loginaluno")}>
          <Text style={[styles.link, { color: tema.link }]}>
            Sou Aluno (Acesso Escolar)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/cadastro")}>
          <Text style={[styles.link, { color: tema.link }]}>Criar uma conta</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnTema} onPress={alternarTema}>
          <Ionicons name="color-palette-outline" size={16} color={tema.textoGeral} />
          <Text style={[styles.textoBtnTema, { color: tema.textoGeral }]}>
            Tema: {nomeTema.toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 24,
    padding: 28,
    shadowColor: "#E879F9",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconeBorboleta: {
    fontSize: 32,
    marginBottom: 4,
  },
  titulo: {
    fontSize: 42,
    marginBottom: 4,
    letterSpacing: 1,
  },
  subtitulo: {
    fontSize: 13,
    opacity: 0.8,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
  },
  botao: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 14,
  },
  textoBotao: {
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    textAlign: "center",
    fontWeight: "600",
    marginTop: 8,
    fontSize: 14,
  },
  btnTema: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    opacity: 0.6,
    gap: 6,
  },
  textoBtnTema: {
    fontSize: 11,
    fontWeight: "600",
  },
});
