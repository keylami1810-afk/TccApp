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

export default function LoginAluno() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nomeTema, setNomeTema] = useState("claro");

  const [fontsLoaded] = useFonts({
    Amoria: require("../assets/fonts/AMORIA.otf"),
  });

  const DOMINIOS_INSTITUCIONAIS = [
    "@al.educacao.sp.gov.br",
    "@aluno.educacao.sp.gov.br",
    "@aluno.cps.sp.gov.br",
  ];

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

  const validarEmailInstitucional = (emailTexto) => {
    const emailMinusculo = emailTexto.toLowerCase();
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

    if (!validarEmailInstitucional(txtEmail)) {
      Alert.alert(
        "Acesso Negado",
        "Por favor, utilize um e-mail institucional do aluno (ex: seu.nome@escola.com)."
      );
      return;
    }

    try {
      const parteNome = txtEmail.split("@")[0];
      const nomeFormatado = parteNome.charAt(0).toUpperCase() + parteNome.slice(1);

      await AsyncStorage.setItem("@nome_aluno", nomeFormatado);

      router.push({
        pathname: "/principalMFS",
        params: {
          nomeUsuario: nomeFormatado,
          pontos: 100,
        },
      });
    } catch (error) {
      Alert.alert("Erro", "Ocorreu uma falha ao realizar o login.");
    }
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tema.fundo }]}>
      <View style={[styles.card, { backgroundColor: tema.cardBg }]}>
        <View style={styles.header}>
          <View style={[styles.badge, { backgroundColor: tema.badgeBg }]}>
            <Text style={[styles.textoBadge, { color: tema.textoGeral }]}>
              Portal do Aluno 🎓
            </Text>
          </View>

          <Text
            style={[
              styles.titulo,
              {
                color: tema.textoGeral,
                fontFamily: "Amoria",
              },
            ]}
          >
            Malomi for Schools
          </Text>

          <Text style={[styles.subtitulo, { color: tema.textoGeral }]}>
            Insira seu e-mail institucional
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: tema.textoGeral }]}>
            E-mail Institucional
          </Text>
          <TextInput
            placeholder="seu.nome@aluno.educacao.sp.gov.br"
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
          onPress={fazerLoginAluno}
        >
          <Text style={[styles.textoBotao, { color: tema.textoBotao }]}>
            Acessar Portal
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/")}>
          <Text style={[styles.link, { color: tema.link }]}>
            Não é aluno? Voltar
          </Text>
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
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },
  textoBadge: {
    fontSize: 12,
    fontWeight: "700",
  },
  titulo: {
    fontSize: 32,
    marginBottom: 4,
    textAlign: "center",
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
