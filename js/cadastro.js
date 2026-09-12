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

export default function Cadastro() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const cadastrar = async () => {
    if (!nome || !email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      // Salva o nome associado ao e-mail e define como usuario ativo
      await AsyncStorage.setItem(`@user_nome_${email.toLowerCase()}`, nome);
      await AsyncStorage.setItem("@nome_usuario", nome);

      Alert.alert("Sucesso", "Conta criada com sucesso!", [
        {
          text: "OK",
          onPress: () =>
            router.push({
              pathname: "/principal",
              params: { nomeUsuario: nome },
            }),
        },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar o cadastro.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.conteudo}>
        <Text style={styles.titulo}>Criar Conta</Text>

        <TextInput
          placeholder="Seu Nome Completo"
          placeholderTextColor="#888"
          style={styles.input}
          value={nome}
          onChangeText={setNome}
        />

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

        <TouchableOpacity style={styles.botao} onPress={cadastrar}>
          <Text style={styles.textoBotao}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/")}>
          <Text style={styles.link}>Já tenho uma conta (Voltar ao Login)</Text>
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
