import AsyncStorage from "@react-native-async-storage/async-storage";

export const temasDoProjeto = {
  principal: {
    nome: "Malomi",

    imagem: require("../assets/TemaMalomi.jpg"),

    cardBg: "rgba(249, 197, 197, 0.5)",
    caixaInput: "rgba(255, 241, 242, 0.95)",
    borda: "#F472B6",
    botao: "#EC4899",
    textoBotao: "#FFFFFF",
    textoGeral: "#831843",
    link: "#DB2777",
    badgeBg: "#FBCFE8",
    fonteTitulo: "Amoria",
    sombraCor: "#E879F9",
  },

  gotico: {
    nome: "Gótico",

    imagem: require("../assets/TemaGotico.png"),

    cardBg: "rgba(20, 15, 18, 0.3)",
    caixaInput: "rgba(38, 38, 38, 0.96)",
    borda: "#800020",
    botao: "#A9002D",
    textoBotao: "#FFFFFF",
    textoGeral: "#D4AF37",
    link: "#D4002F",
    badgeBg: "#45000C",
    fonteTitulo: "Gotico",
    sombraCor: "#800020",
  },

  fogo: {
    nome: "Fogo",

    imagem: require("../assets/TemaFogo.jpg"),

    cardBg: "rgba(28, 10, 0, 0.66)",
    caixaInput: "rgba(43, 13, 0, 0.96)",
    borda: "#FF4500",
    botao: "#FF4500",
    textoBotao: "#FFFFFF",
    textoGeral: "#FFD700",
    link: "#FF6347",
    badgeBg: "#4A1800",
    fonteTitulo: "Fogo",
    sombraCor: "#FF4500",
  },

  gelo: {
    nome: "Gelo",

    imagem: require("../assets/TemaGelo.png"),

    cardBg: "rgba(255, 255, 255, 0.45)",
    caixaInput: "rgba(224, 242, 254, 0.96)",
    borda: "#38BDF8",
    botao: "#0284C7",
    textoBotao: "#FFFFFF",
    textoGeral: "#0C4A6E",
    link: "#0369A1",
    badgeBg: "#BAE6FD",
    fonteTitulo: "Gelo",
    sombraCor: "#38BDF8",
  },

  pastel: {
    nome: "Floral",

    imagem: require("../assets/TemaFlowers.jpg"),

    cardBg: "rgba(255, 255, 255, 0.34)",
    caixaInput: "rgba(252, 231, 243, 0.95)",
    borda: "#ECBBF8",
    botao: "#A92BC2",
    textoBotao: "#FFFFFF",
    textoGeral: "#320C42",
    link: "#78128C",
    badgeBg: "#F8B5F5",
    fonteTitulo: "Flowers",
    sombraCor: "#A92BC2",
  },

  magico: {
    nome: "Mágico",

    imagem: require("../assets/TemaMagico.jpg"),

    cardBg: "rgba(24, 19, 43, 0.64)",
    caixaInput: "rgba(35, 27, 61, 0.96)",
    borda: "#A855F7",
    botao: "#7E22CE",
    textoBotao: "#FFFFFF",
    textoGeral: "#E9D5FF",
    link: "#C084FC",
    badgeBg: "#3B0764",
    fonteTitulo: "Magic",
    sombraCor: "#A855F7",
  },

  retro: {
    nome: "Fantasia",

    imagem: require("../assets/TemaFantasia.jpg"),

    cardBg: "rgba(255, 253, 249, 0.49)",
    caixaInput: "rgba(250, 240, 230, 0.96)",
    borda: "#C6AC8F",
    botao: "#85592A",
    textoBotao: "#FFFFFF",
    textoGeral: "#22333B",
    link: "#85592A",
    badgeBg: "#E6CCB2",
    fonteTitulo: "Fantasia",
    sombraCor: "#85592A",
  },
};

export const salvarTema = async (nomeTema) => {
  try {
    await AsyncStorage.setItem("@tema_app", nomeTema);
  } catch (e) {
    console.error("Erro ao salvar tema:", e);
  }
};

export const obterTemaSalvo = async () => {
  try {
    const tema = await AsyncStorage.getItem("@tema_app");

    if (tema && temasDoProjeto[tema]) {
      return tema;
    }

    return "principal";
  } catch (e) {
    return "principal";
  }
};
