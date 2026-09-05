import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.9;

interface Ticket {
  id: number;
  tab: string;
  evento: string;
  data: string;
  headerData: string;
  local: string;
  setor: string;
  secao: string;
  entrada: string;
  valor: string;
  total: string;
  qr: string;
  valorTipo: string;
  abertura: string;
  inicio: string;
  image: any;
}

const getImageAspectRatio = (image: any, fallback = 3 / 2) => {
  try {
    const source = Image.resolveAssetSource(image);
    if (source?.width && source?.height) {
      return source.width / source.height;
    }
  } catch (e) {
  }
  return fallback;
};

const getRockInRioDate = (dayOffset: number) => {
  const baseDate = new Date(2026, 8, 4);
  const targetDate = new Date(baseDate);
  targetDate.setDate(baseDate.getDate() + dayOffset);

  const currentDay = targetDate.getDate();
  const currentMonth = targetDate.getMonth() + 1;
  const currentYear = targetDate.getFullYear();

  const daysOfWeek = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  const dayOfWeek = daysOfWeek[targetDate.getDay()];

  return {
    data: `${dayOfWeek} · ${currentDay.toString().padStart(2, '0')}/${currentMonth.toString().padStart(2, '0')}/${currentYear.toString().slice(-2)} · 14:00`,
    headerData: `${currentDay.toString().padStart(2, '0')}/${currentMonth.toString().padStart(2, '0')}/${currentYear} - Rio de Janeiro`
  };
};

const rawTickets = [
  {
    id: 1, tab: "1", evento: "Rock in Rio 2026", ...getRockInRioDate(0),
    local: "Cidade do Rock", setor: "Gramado", secao: "INTEIRA",
    entrada: "Últ. Acesso: 00h", valor: "R$ 870,00", total: "R$ 870,00",
    qr: "RIR2026-DIA4-GRAMADO-1", valorTipo: "Benefício Itaú 15%",
    abertura: "14:00", inicio: "14:00", image: require("../../assets/images/dia-4.png"),
  },
  {
    id: 2, tab: "2", evento: "Rock in Rio 2026", ...getRockInRioDate(1),
    local: "Cidade do Rock", setor: "Gramado", secao: "INTEIRA",
    entrada: "Últ. Acesso: 00h", valor: "R$ 870,00", total: "R$ 870,00",
    qr: "RIR2026-DIA5-GRAMADO-2", valorTipo: "Benefício Itaú 15%",
    abertura: "14:00", inicio: "14:00", image: require("../../assets/images/dia-5.png"),
  },
  {
    id: 3, tab: "3", evento: "Rock in Rio 2026", ...getRockInRioDate(2),
    local: "Cidade do Rock", setor: "Gramado", secao: "INTEIRA",
    entrada: "Últ. Acesso: 00h", valor: "R$ 870,00", total: "R$ 870,00",
    qr: "RIR2026-DIA6-GRAMADO-3", valorTipo: "Benefício Itaú 15%",
    abertura: "14:00", inicio: "14:00", image: require("../../assets/images/dia-6.png"),
  },
  {
    id: 4, tab: "4", evento: "Rock in Rio 2026", ...getRockInRioDate(3),
    local: "Cidade do Rock", setor: "Gramado", secao: "INTEIRA",
    entrada: "Últ. Acesso: 00h", valor: "R$ 870,00", total: "R$ 870,00",
    qr: "RIR2026-DIA7-GRAMADO-4", valorTipo: "Benefício Itaú 15%",
    abertura: "14:00", inicio: "14:00", image: require("../../assets/images/dia-7.png"),
  },
  {
    id: 5, tab: "5", evento: "Rock in Rio 2026", ...getRockInRioDate(4),
    local: "Cidade do Rock", setor: "Gramado", secao: "INTEIRA",
    entrada: "Últ. Acesso: 00h", valor: "R$ 870,00", total: "R$ 870,00",
    qr: "RIR2026-DIA8-GRAMADO-5", valorTipo: "Benefício Itaú 15%",
    abertura: "14:00", inicio: "14:00", image: require("../../assets/images/dia-8.png"),
  },
  {
    id: 6, tab: "6", evento: "Rock in Rio 2026", ...getRockInRioDate(5),
    local: "Cidade do Rock", setor: "Gramado", secao: "INTEIRA",
    entrada: "Últ. Acesso: 00h", valor: "R$ 870,00", total: "R$ 870,00",
    qr: "RIR2026-DIA9-GRAMADO-6", valorTipo: "Benefício Itaú 15%",
    abertura: "14:00", inicio: "14:00", image: require("../../assets/images/dia-9.png"),
  },
  {
    id: 7, tab: "7", evento: "Rock in Rio 2026", ...getRockInRioDate(6),
    local: "Cidade do Rock", setor: "Gramado", secao: "INTEIRA",
    entrada: "Últ. Acesso: 00h", valor: "R$ 870,00", total: "R$ 870,00",
    qr: "RIR2026-DIA10-GRAMADO-7", valorTipo: "Benefício Itaú 15%",
    abertura: "14:00", inicio: "14:00", image: require("../../assets/images/dia-10.png"),
  },
  {
    id: 8, tab: "8", evento: "Rock in Rio 2026", ...getRockInRioDate(7),
    local: "Cidade do Rock", setor: "Gramado", secao: "INTEIRA",
    entrada: "Últ. Acesso: 00h", valor: "R$ 870,00", total: "R$ 870,00",
    qr: "RIR2026-DIA11-GRAMADO-8", valorTipo: "Benefício Itaú 15%",
    abertura: "14:00", inicio: "14:00", image: require("../../assets/images/dia-11.png"),
  },
  {
    id: 9, tab: "9", evento: "Rock in Rio 2026", ...getRockInRioDate(8),
    local: "Cidade do Rock", setor: "Gramado", secao: "INTEIRA",
    entrada: "Últ. Acesso: 00h", valor: "R$ 870,00", total: "R$ 870,00",
    qr: "RIR2026-DIA12-GRAMADO-9", valorTipo: "Benefício Itaú 15%",
    abertura: "14:00", inicio: "14:00", image: require("../../assets/images/dia-12.png"),
  },
  {
    id: 10, tab: "10", evento: "Rock in Rio 2026", ...getRockInRioDate(9),
    local: "Cidade do Rock", setor: "Gramado", secao: "INTEIRA",
    entrada: "Últ. Acesso: 00h", valor: "R$ 870,00", total: "R$ 870,00",
    qr: "RIR2026-DIA13-GRAMADO-10", valorTipo: "Benefício Itaú 15%",
    abertura: "14:00", inicio: "14:00", image: require("../../assets/images/dia-13.png"),
  },
];

const tickets: (Ticket & { aspectRatio: number })[] = rawTickets.map((t) => ({
  ...t,
  aspectRatio: getImageAspectRatio(t.image),
}));

export default function TicketsScreen() {
  const [selectedTicket, setSelectedTicket] = useState(0);
  const currentTicket = tickets[selectedTicket] || tickets[0];
  const router = useRouter();

  const ticketScrollRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / SCREEN_WIDTH);
    if (index >= 0 && index < tickets.length && index !== selectedTicket) {
      setSelectedTicket(index);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Cabeçalho do Evento */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/")}
        >
          <Ionicons name="chevron-back" size={24} color="#9ca3af" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {currentTicket.evento}
          </Text>
          <Text style={styles.headerSubtitle}>{currentTicket.headerData}</Text>
        </View>
      </View>

      {/* Área flexível dos ingressos */}
      <View style={styles.ticketsArea}>
        {/* Scroll de Ingressos: arraste para o lado para trocar de dia. Sem
            barra de números — o próprio card é o indicador de navegação. */}
        <ScrollView
          ref={ticketScrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.ticketsHorizontalScroll}
        >
          {tickets.map((ticket, index) => (
            <View key={ticket.id} style={styles.ticketPageWrapper}>
              <View style={styles.ticketCardWrapper}>

                {/* Imagem do ingresso, na proporção exata do arquivo — sem cortar, sem esticar */}
                <View style={[styles.ticketImageContainer, { aspectRatio: ticket.aspectRatio }]}>
                  <Image
                    source={ticket.image}
                    style={styles.ticketCoverImage}
                    resizeMode="contain"
                  />
                  <View style={styles.overlayBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        { width: selectedTicket === index ? "35%" : "100%" },
                      ]}
                    />
                  </View>
                </View>

                {/* Parte Central Branca */}
                <View style={styles.whiteSection}>
                  <View style={styles.qrRow}>
                    <View style={styles.qrImageContainer}>
                      <Image
                        source={{
                          uri: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${ticket.qr}`,
                        }}
                        style={styles.qrImage}
                      />
                    </View>

                    <View style={styles.qrRightInfo}>
                      <View>
                        <Text style={styles.cardInfoLabel}>Setor</Text>
                        <Text style={styles.cardInfoValue} numberOfLines={1}>
                          {ticket.setor}
                        </Text>
                      </View>

                      <View style={{ marginTop: 8 }}>
                        <Text style={styles.cardInfoLabel}>Acesso</Text>
                        <Text style={styles.cardInfoValue} numberOfLines={1}>
                          {ticket.entrada}
                        </Text>
                      </View>

                      <TouchableOpacity style={styles.moreInfoButton} activeOpacity={0.7}>
                        <Text style={styles.moreInfoButtonText}>Mais informação</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Divisória Serrilhada */}
                <View style={styles.dashedContainer}>
                  <View style={styles.dashedLine} />
                </View>

                {/* Parte Inferior Cinza */}
                <View style={styles.graySection}>
                  <View style={styles.gridContainer}>
                    <View style={styles.gridItem}>
                      <Text style={styles.gridLabel}>Taxa</Text>
                      <Text style={styles.gridValue}>{ticket.valorTipo}</Text>
                    </View>
                    <View style={styles.gridItem} />
                    <View style={styles.gridItem}>
                      <Text style={styles.gridLabel}>Seção</Text>
                      <Text style={styles.gridValueBold}>{ticket.secao}</Text>
                    </View>
                    <View style={styles.gridItem}>
                      <Text style={styles.gridLabel}>Fileira</Text>
                      <Text style={styles.gridValue}>Não numerado</Text>
                    </View>
                    <View style={styles.gridItem}>
                      <Text style={styles.gridLabel}>Abertura</Text>
                      <Text style={styles.gridValue}>{ticket.abertura}</Text>
                    </View>
                    <View style={styles.gridItem}>
                      <Text style={styles.gridLabel}>Início</Text>
                      <Text style={styles.gridValue}>{ticket.inicio}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Ação de Devolver Ingresso */}
              <TouchableOpacity style={styles.returnButton} activeOpacity={0.7}>
                <Ionicons name="arrow-undo" size={16} color="#0084ff" style={styles.returnIcon} />
                <Text style={styles.returnText}>Devolver ingresso</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Rodapé Fixo */}
      <View style={styles.customFooter}>
        <TouchableOpacity style={styles.footerLink} activeOpacity={0.7}>
          <Text style={styles.footerLinkText}>Ingresso intransferível</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} activeOpacity={0.7}>
          <Text style={styles.footerButtonText}>Mais informações</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
  },
  backButton: {
    paddingVertical: 4,
    paddingRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 2,
  },
  ticketsArea: {
    flex: 1,
    justifyContent: "flex-start",
  },
  ticketsHorizontalScroll: {
    flexGrow: 0,
  },
  ticketPageWrapper: {
    width: SCREEN_WIDTH,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 8,
  },
  ticketCardWrapper: {
    width: CARD_WIDTH,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  ticketImageContainer: {
    width: "100%",
    backgroundColor: "#026cdf",
    position: "relative",
  },
  ticketCoverImage: {
    width: "100%",
    height: "100%",
  },
  overlayBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: "transparent",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#02e1c1",
  },
  whiteSection: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  qrRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  qrImageContainer: {
    width: 110,
    height: 110,
    flexShrink: 0,
  },
  qrImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  qrRightInfo: {
    flex: 1,
    height: 110,
    paddingLeft: 16,
    justifyContent: "space-between",
  },
  cardInfoLabel: {
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#d2cbc2",
    fontWeight: "600",
    marginBottom: 2,
  },
  cardInfoValue: {
    fontSize: 14,
    color: "#5f5f5f",
    fontWeight: "400",
  },
  moreInfoButton: {
    backgroundColor: "#dff4f6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  moreInfoButtonText: {
    color: "#1fa8b3",
    fontSize: 12,
    fontWeight: "400",
  },
  dashedContainer: {
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
  },
  dashedLine: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
    height: 1,
    width: "100%",
  },
  graySection: {
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 10,
  },
  gridItem: {
    width: "50%",
  },
  gridLabel: {
    color: "#d2cbc2",
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  gridValue: {
    color: "#5f5f5f",
    fontSize: 13,
    fontWeight: "500",
  },
  gridValueBold: {
    color: "#5f5f5f",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  returnButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  returnIcon: {
    marginRight: 6,
  },
  returnText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
  customFooter: {
    marginHorizontal: 16,
    marginBottom: 0,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  footerLink: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(200, 182, 167, 0.4)",
    borderRadius: 8,
    paddingVertical: 8,
  },
  footerLinkText: {
    fontSize: 11,
    fontWeight: "400",
    color: "#bba99a",
  },
  footerButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(200, 182, 167, 0.4)",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  footerButtonText: {
    fontSize: 11,
    fontWeight: "400",
    color: "#c8b6a7",
  },
});