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
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginAluno() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // Lista de domínios escolares/institucionais válidos
  const DOMINIOS_INSTITUCIONAIS = [
    "@al.educacao.sp.gov.br",
    "@aluno.educacao.sp.gov.br",
    "@aluno.cps.sp.gov.br",
  ];

  const validarEmailInstitucional = (emailTexto) => {
    const emailMinusculo = emailTexto.toLowerCase();
    
    // Verifica se possui o formato básico de e-mail e se contém um dos domínios aceitos
    const ehEmailValido = emailMinusculo.includes("@") && emailMinusculo.includes(".");
    const ehInstitucional = DOMINIOS_INSTITUCIONAIS.some((dominio) =>
      emailMinusculo.includes(dominio)
    );

    return ehEmailValido && ehInstitucional;
  };

  const fazerLoginAluno = async () => {
    const txtEmail = (email || "").trim();
    const txtSenha = (senha || "").trim();

    if (!txtEmail || !txtSenha) {
      Alert.alert("Acesso Negado", "Preencha o e-mail e a senha.");
      return;
    }

    // Validação do e-mail institucional
    if (!validarEmailInstitucional(txtEmail)) {
      Alert.alert(
        "Acesso Negado",
        "Por favor, utilize um e-mail institucional do aluno (ex: seu.nome@escola.com)."
      );
      return;
    }

    try {
      // Extrai o nome do aluno a partir do e-mail (ex: maria.silva@escola.com -> Maria.silva)
      const parteNome = txtEmail.split("@")[0];
      const nomeFormatado = parteNome.charAt(0).toUpperCase() + parteNome.slice(1);

      // Salva o nome do aluno no AsyncStorage
      await AsyncStorage.setItem("@nome_aluno", nomeFormatado);

      router.push({
        pathname: "/principalMFS",
        params: { 
          nomeUsuario: nomeFormatado,
          pontos: 100 
        },
      });
    } catch (error) {
      Alert.alert("Erro", "Ocorreu uma falha ao realizar o login.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.conteudo}>
        <View style={styles.header}>
          <Ionicons name="school" size={60} color="#6B21A8" />
          <Text style={styles.titulo}>Malomi for Schools</Text>
        </View>

        <TextInput
          placeholder="E-mail Institucional do Aluno"
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

        <TouchableOpacity style={styles.botao} onPress={fazerLoginAluno}>
          <Text style={styles.textoBotao}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/")}>
          <Text style={styles.link}>Não é aluno? Voltar</Text>
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
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4A154B",
    marginTop: 10,
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