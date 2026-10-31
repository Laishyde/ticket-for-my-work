import { getSupabaseClient } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Easing,
    Image,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";

const getTicketCode = (qrValue: string) => {
  try {
    return new URL(qrValue).searchParams.get("code") || qrValue;
  } catch {
    return qrValue;
  }
};

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

const eventInfo = {
  sessions: ["28/10/2026", "30/10/2026", "31/10/2026"],
  doorsOpen: "16:00",
  showStarts: "20:00",
  ageRating: "16 anos; de 5 a 15 anos somente acompanhados de pais ou responsáveis legais",
  onlineServiceFee: "20% sobre o valor do ingresso",
  prices: [
    {
      sector: "Arquibancada",
      half: "R$ 340,00",
      full: "R$ 680,00",
    },
    {
      sector: "Cadeira Superior",
      half: "R$ 490,00",
      full: "R$ 980,00",
    },
    {
      sector: "Cadeira Inferior",
      half: "R$ 540,00",
      full: "R$ 1.080,00",
    },
    {
      sector: "Pista",
      half: "R$ 625,00",
      full: "R$ 1.250,00",
    },
    {
      sector: "Soundcheck Pacote VIP (pista, soundcheck pré-show e brindes)",
      half: "R$ 3.678,00",
      full: "R$ 4.303,00",
    },
  ],
};

const getImageAspectRatio = (image: any, fallback = 3 / 2) => {
  try {
    const source = Image.resolveAssetSource(image);
    if (source?.width && source?.height) {
      return source.width / source.height;
    }
  } catch (e) {}
  return fallback;
};

const getBTSDate = (dayOffset: number) => {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  let showDay = currentDay + dayOffset;
  let targetDate = new Date(currentYear, currentMonth, showDay);
  let finalDate = targetDate;

  const daysOfWeek = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];
  const dayOfWeek = daysOfWeek[finalDate.getDay()];

  const displayDay = finalDate.getDate();
  const displayMonth = finalDate.getMonth() + 1;
  const displayYear = finalDate.getFullYear();

  return {
    data: `${dayOfWeek} · ${displayDay.toString().padStart(2, "0")}/${displayMonth.toString().padStart(2, "0")}/${displayYear.toString().slice(-2)} · 20:00`,
    headerData: `${displayDay.toString().padStart(2, "0")}/${displayMonth.toString().padStart(2, "0")}/${displayYear}São Paulo`,
  };
};

const rawTickets = [
  {
    id: 1,
    tab: "1",
    evento: "BTS WORLD TOUR 'ARIRANG'",
    ...getBTSDate(0),
    local: "São Paulo, no Estádio do MorumBIS",
    setor: "Pista",
    secao: "INTEIRA",
    entrada: "Portões 02, 04 e 18",
    valor: "R$ 1.250,00",
    total: "R$ 1.500,00",
    qr: "https://zqcolmspkrucybtavibr.supabase.co/functions/v1/validate-ticket?code=BTS2026-SP-PISTA-1",
    valorTipo: "Benefício Itaú 15%",
    abertura: "16:00",
    inicio: "20:00",
    image: require("../../assets/images/ticket.png"),
    eventInfo,
  },
  {
    id: 2,
    tab: "2",
    evento: "BTS WORLD TOUR 'ARIRANG'",
    ...getBTSDate(0),
    local: "São Paulo, no Estádio do MorumBIS",
    setor: "Cadeira Inferior",
    secao: "INTEIRA",
    entrada: "Portões 17A e 17B",
    valor: "R$ 1.080,00",
    total: "R$ 1.296,00",
    qr: "https://zqcolmspkrucybtavibr.supabase.co/functions/v1/validate-ticket?code=BTS2026-SP-CADEIRA-INFERIOR-2",
    valorTipo: "Benefício Itaú 15%",
    abertura: "16:00",
    inicio: "20:00",
    image: require("../../assets/images/ticket.png"),
    eventInfo,
  },
  {
    id: 3,
    tab: "3",
    evento: "BTS WORLD TOUR 'ARIRANG'",
    ...getBTSDate(0),
    local: "São Paulo, no Estádio do MorumBIS",
    setor: "Cadeira Superior",
    secao: "INTEIRA",
    entrada: "Portões 05 e 16",
    valor: "R$ 980,00",
    total: "R$ 1.176,00",
    qr: "https://zqcolmspkrucybtavibr.supabase.co/functions/v1/validate-ticket?code=BTS2026-SP-CADEIRA-SUPERIOR-3",
    valorTipo: "Benefício Itaú 15%",
    abertura: "16:00",
    inicio: "20:00",
    image: require("../../assets/images/ticket.png"),
    eventInfo,
  },
  {
    id: 4,
    tab: "4",
    evento: "BTS WORLD TOUR 'ARIRANG'",
    ...getBTSDate(0),
    local: "São Paulo, no Estádio do MorumBIS",
    setor: "Arquibancada",
    secao: "INTEIRA",
    entrada: "Portões 06 e 15",
    valor: "R$ 680,00",
    total: "R$ 816,00",
    qr: "https://zqcolmspkrucybtavibr.supabase.co/functions/v1/validate-ticket?code=BTS2026-SP-ARQUIBANCADA-4",
    valorTipo: "Benefício Itaú 15%",
    abertura: "16:00",
    inicio: "20:00",
    image: require("../../assets/images/ticket.png"),
    eventInfo,
  },
];

const tickets: (Ticket & { aspectRatio: number })[] = rawTickets.map((t) => ({
  ...t,
  aspectRatio: getImageAspectRatio(t.image),
}));

export default function TicketsScreen() {
  const { width: windowWidth } = useWindowDimensions();
  const [webViewportWidth, setWebViewportWidth] = useState(0);
  const [webViewportReady, setWebViewportReady] = useState(Platform.OS !== "web");
  const screenWidth =
    webViewportWidth > 0
      ? webViewportWidth
      : windowWidth > 0
        ? windowWidth
        : 390;
  const cardWidth = screenWidth * 0.9;
  const { code: codeParam } = useLocalSearchParams<{ code?: string | string[] }>();
  const scannedCode = Array.isArray(codeParam) ? codeParam[0] : codeParam;
  const [selectedTicket, setSelectedTicket] = useState(0);
  const [appOrigin, setAppOrigin] = useState("");
  const [validation, setValidation] = useState<{
    code: string;
    status: "checking" | "used" | "error";
    message: string;
  } | null>(null);
  const currentTicket = tickets[selectedTicket] || tickets[0];
  const router = useRouter();

  const ticketScrollRef = useRef<ScrollView>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAppOrigin(window.location.origin);
      setWebViewportWidth(window.innerWidth);
      setWebViewportReady(true);
    }
  }, []);

  useEffect(() => {
    if (!scannedCode) {
      setValidation(null);
      return;
    }

    let active = true;
    const ticketIndex = tickets.findIndex((ticket) => getTicketCode(ticket.qr) === scannedCode);

    if (ticketIndex >= 0) {
      setSelectedTicket(ticketIndex);
    }

    setValidation({ code: scannedCode, status: "checking", message: "VALIDANDO INGRESSO" });

    const validateTicket = async () => {
      try {
        const { data, error } = await getSupabaseClient().functions.invoke(
          "validate-ticket",
          { body: { qr_code: scannedCode } },
        );

        if (error) throw error;
        if (!active) return;

        const wasUsed = data.message === "INGRESSO USADO" || data.valid === true;
        setValidation({
          code: scannedCode,
          status: wasUsed ? "used" : "error",
          message: wasUsed
            ? "INGRESSO USADO"
            : data.message || "INGRESSO NAO ENCONTRADO",
        });
      } catch (error) {
        if (!active) return;
        setValidation({
          code: scannedCode,
          status: "error",
          message: error instanceof Error ? error.message : "FALHA AO VALIDAR INGRESSO",
        });
      }
    };

    void validateTicket();
    return () => {
      active = false;
    };
  }, [scannedCode]);

  useEffect(() => {
    if (!scannedCode || screenWidth <= 0) return;

    const ticketIndex = tickets.findIndex((ticket) => getTicketCode(ticket.qr) === scannedCode);
    if (ticketIndex < 0) return;

    const scrollFrame = requestAnimationFrame(() => {
      ticketScrollRef.current?.scrollTo({
        x: ticketIndex * screenWidth,
        animated: false,
      });
    });

    return () => cancelAnimationFrame(scrollFrame);
  }, [scannedCode, screenWidth]);

  useEffect(() => {
    progressAnim.setValue(0);
    const animation = Animated.loop(
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    );
    animation.start();

    return () => animation.stop();
  }, [selectedTicket]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / screenWidth);
    if (index >= 0 && index < tickets.length && index !== selectedTicket) {
      setSelectedTicket(index);
    }
  };

  const scrollToTicket = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= tickets.length) return;
    ticketScrollRef.current?.scrollTo({
      x: nextIndex * screenWidth,
      animated: true,
    });
    setSelectedTicket(nextIndex);
  };

  const goNext = () => scrollToTicket(selectedTicket + 1);
  const goPrev = () => scrollToTicket(selectedTicket - 1);

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

      {/* Scroll horizontal de ingressos */}
      {!webViewportReady ? (
        <View style={styles.carouselLoading}>
          <ActivityIndicator size="small" color="#c9f36a" />
        </View>
      ) : (
        <ScrollView
          ref={ticketScrollRef}
          horizontal
          pagingEnabled
          snapToInterval={screenWidth}
          snapToAlignment="center"
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          bounces={false}
          alwaysBounceHorizontal={false}
          removeClippedSubviews={false}
          style={styles.ticketsHorizontalScroll}
          contentContainerStyle={styles.ticketsScrollContent}
        >
        {tickets.map((ticket, index) => (
          <View
            key={ticket.id}
            style={[styles.ticketPageWrapper, { width: screenWidth }]}
          >
            <TouchableOpacity
              style={[styles.hitLeft, { width: screenWidth * 0.28 }]}
              activeOpacity={1}
              onPress={goPrev}
            />
            <TouchableOpacity
              style={[styles.hitRight, { width: screenWidth * 0.28 }]}
              activeOpacity={1}
              onPress={goNext}
            />
            {validation?.code === getTicketCode(ticket.qr) && (
              <View
                style={[
                  styles.validationBadge,
                  validation.status === "used"
                    ? styles.validationUsed
                    : validation.status === "checking"
                      ? styles.validationChecking
                      : styles.validationError,
                ]}
              >
                {validation.status === "checking" && <ActivityIndicator size="small" color="#ffffff" />}
                <Text style={styles.validationBadgeText}>{validation.message}</Text>
              </View>
            )}
            <View
              style={[styles.ticketCardWrapper, { width: cardWidth }]}
              pointerEvents="box-none"
            >
              <View
                style={[
                  styles.ticketImageContainer,
                  { aspectRatio: ticket.aspectRatio },
                ]}
              >
                <Image
                  source={ticket.image}
                  style={styles.ticketCoverImage}
                  resizeMode="contain"
                />

                <View style={styles.overlayBarContainer}>
                  <Animated.View
                    style={[
                      styles.progressBar,
                      {
                        width: selectedTicket === index ? progressWidth : "0%",
                      },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.whiteSection}>
                <View style={styles.qrRow}>
                  <View style={styles.qrImageContainer}>
                    {appOrigin ? (
                      <Image
                        source={{
                          uri: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`${appOrigin}/tickets?code=${getTicketCode(ticket.qr)}`)}`,
                        }}
                        style={styles.qrImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <ActivityIndicator style={styles.qrLoading} color="#0074d1" />
                    )}
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

                    <TouchableOpacity
                      style={styles.moreInfoButton}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.moreInfoButtonText}>
                        Mais informação
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.dashedContainer}>
                <View style={styles.dashedLine} />
              </View>

              {/* SEÇÃO DE INFORMAÇÕES */}
              <View style={styles.graySection}>
                <View style={styles.gridContainer}>
                  {/* Linha 1: TAXA */}
                  <View style={styles.gridItemFull}>
                    <Text style={styles.gridLabel}>TAXA</Text>
                    <Text style={styles.gridValueBold}>{ticket.valor}</Text>
                  </View>

                  {/* Linha 2: SEÇÃO e FILEIRA */}
                  <View style={styles.gridItem}>
                    <Text style={styles.gridLabel}>SEÇÃO</Text>
                    <Text style={styles.gridValueBold}>{ticket.secao}</Text>
                  </View>
                  <View style={styles.gridItem}>
                    <Text style={styles.gridLabel}>FILEIRA</Text>
                    <Text style={styles.gridValueRegular}>Não numerado</Text>
                  </View>

                  {/* Linha 3: ABERTURA e INÍCIO */}
                  <View style={styles.gridItem}>
                    <Text style={styles.gridLabel}>ABERTURA</Text>
                    <Text style={styles.gridValueBold}>{ticket.abertura}</Text>
                  </View>
                  <View style={styles.gridItem}>
                    <Text style={styles.gridLabel}>INÍCIO</Text>
                    <Text style={styles.gridValueBold}>{ticket.inicio}</Text>
                  </View>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.returnButton} activeOpacity={0.7}>
              <Ionicons
                name="arrow-undo"
                size={16}
                color="#0084ff"
                style={styles.returnIcon}
              />
              <Text style={styles.returnText}>Devolver ingresso</Text>
            </TouchableOpacity>
          </View>
        ))}
        </ScrollView>
      )}

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
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
    flexShrink: 0,
  },
  backButton: {
    paddingVertical: 4,
    paddingRight: 14,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: "#9ca3af",
    fontSize: 11,
    marginTop: 1,
  },
  ticketsHorizontalScroll: {
    flex: 1,
  },
  carouselLoading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  ticketsScrollContent: {
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  ticketPageWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexGrow: 1,
    flexShrink: 0,
    position: "relative",
  },
  hitLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 5,
    backgroundColor: "transparent",
  },
  hitRight: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
    backgroundColor: "transparent",
  },
  ticketCardWrapper: {
    minHeight: 0,
    flexGrow: 0,
    flexShrink: 0,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1,
  },
  ticketImageContainer: {
    width: "100%",
    backgroundColor: "#0074d1",
    position: "relative",
    overflow: "hidden",
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
    height: 6,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#02e1c1",
  },
  whiteSection: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  qrRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  qrImageContainer: {
    width: 112,
    height: 112,
    flexShrink: 0,
  },
  qrImage: {
    width: "100%",
    height: "100%",
  },
  qrLoading: {
    flex: 1,
  },
  validationBadge: {
    position: "absolute",
    top: 12,
    left: 22,
    right: 22,
    zIndex: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 40,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  validationUsed: {
    backgroundColor: "#b4232f",
  },
  validationChecking: {
    backgroundColor: "#8a6413",
  },
  validationError: {
    backgroundColor: "#6e2929",
  },
  validationBadgeText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },
  qrRightInfo: {
    flex: 1,
    height: 112,
    paddingLeft: 14,
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
    color: "#3d3d3d",
    fontWeight: "600",
  },
  moreInfoButton: {
    backgroundColor: "#dff4f6",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 3,
  },
  moreInfoButtonText: {
    color: "#1fa8b3",
    fontSize: 11,
    fontWeight: "500",
  },
  dashedContainer: {
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 14,
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
    paddingVertical: 22,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 16,
  },
  gridItemFull: {
    width: "100%",
  },
  gridItem: {
    width: "50%",
  },
  gridLabel: {
    color: "#a8a8a8",
    fontSize: 9,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 3,
  },
  gridValueBold: {
    color: "#333333",
    fontSize: 15,
    fontWeight: "700",
  },
  gridValueRegular: {
    color: "#5f5f5f",
    fontSize: 15,
    fontWeight: "500",
  },
  returnButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 2,
    paddingVertical: 3,
    height: 28,
    flexShrink: 0,
    zIndex: 10,
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
    marginTop: 0,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    flexShrink: 0,
  },
  footerLink: {
    flex: 1,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(200, 182, 167, 0.4)",
    borderRadius: 8,
    paddingVertical: 0,
  },
  footerLinkText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#bba99a",
  },
  footerButton: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderColor: "rgba(200, 182, 167, 0.4)",
    borderRadius: 8,
    paddingVertical: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  footerButtonText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#c8b6a7",
  },
});