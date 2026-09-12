import React, { useState } from "react";
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

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const fazerLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      // Busca o nome salvo no cadastro ou usa a parte inicial do e-mail
      const nomeSalvo = await AsyncStorage.getItem(`@user_nome_${email.toLowerCase()}`);
      const nomeExibicao = nomeSalvo || email.split("@")[0];

      // Salva o usuário ativo
      await AsyncStorage.setItem("@nome_usuario", nomeExibicao);

      router.push({
        pathname: "/principal",
        params: { nomeUsuario: nomeExibicao },
      });
    } catch (error) {
      Alert.alert("Erro", "Falha ao realizar login.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.conteudo}>
        <Text style={styles.titulo}>Login Malomi</Text>

        <TextInput
          placeholder="E-mail"
          placeholderTextColor="#888"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Senha"
          placeholderTextColor="#888"
          secureTextEntry
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={styles.botao} onPress={fazerLogin}>
          <Text style={styles.textoBotao}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/loginaluno")}>
          <Text style={styles.link}>Sou Aluno (Acesso Escolar)</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/cadastro")}>
          <Text style={styles.link}>Criar uma conta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3E8FF",
    justifyContent: "center",
  },
  conteudo: {
    paddingHorizontal: 25,
    width: "100%",
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4A154B",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
  },
  botao: {
    backgroundColor: "#B76EA4",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
    marginBottom: 20,
  },
  textoBotao: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: "#B76EA4",
    textAlign: "center",
    fontWeight: "600",
    marginTop: 12,
    fontSize: 15,
  },
});
