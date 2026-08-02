import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
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

// Função para obter as informações do show DJAVAN
const getDynamicShowDate = () => {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth() + 1; // +1 porque getMonth() retorna 0-11
  const currentYear = today.getFullYear();
  
  const daysOfWeek = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  const dayOfWeek = daysOfWeek[today.getDay()];
  
  return {
    data: `${dayOfWeek} · ${currentDay.toString().padStart(2, '0')}/${currentMonth.toString().padStart(2, '0')}/${currentYear.toString().slice(-2)} · 21:00`,
    headerData: `${currentDay.toString().padStart(2, '0')}/${currentMonth.toString().padStart(2, '0')}/${currentYear} - Rio de Janeiro`
  };
};

const dynamicDateInfo = getDynamicShowDate();

const tickets = [
  {
    id: 1,
    tab: "",
    evento: "DJAVAN - RIO DE JANEIRO",
    data: dynamicDateInfo.data,
    headerData: dynamicDateInfo.headerData,
    local: "Rio de Janeiro",
    setor: "Cadeira N1",
    secao: "CADEIRA N1",
    entrada: "livre",
    valor: "R$ 690,00 + R$ 69,00",
    total: "R$ 759,00",
    qr: "DJAVAN-CADEIRA-N1",
    valorTipo: "R$ 690,00 + R$ 69,00",
    abertura: "18:00",
    inicio: "21:00",
  },
  {
    id: 2,
    tab: "",
    evento: "DJAVAN - RIO DE JANEIRO",
    data: dynamicDateInfo.data,
    headerData: dynamicDateInfo.headerData,
    local: "Rio de Janeiro",
    setor: "Cadeira N3",
    secao: "CADEIRA N3",
    entrada: "livre",
    valor: "R$ 210,00 + R$ 63,00",
    total: "R$ 273,00",
    qr: "DJAVAN-CADEIRA-N3",
    valorTipo: "R$ 210,00 + R$ 63,00",
    abertura: "18:00",
    inicio: "21:00",
  },
  {
    id: 3,
    tab: "",
    evento: "DJAVAN - RIO DE JANEIRO",
    data: dynamicDateInfo.data,
    headerData: dynamicDateInfo.headerData,
    local: "Rio de Janeiro",
    setor: "Pista Premium",
    secao: "INTEIRA",
    entrada: "livre",
    valor: "R$ 630,00 + R$ 63,00",
    total: "R$ 693,00",
    qr: "DJAVAN-PISTA-PREMIUM",
    valorTipo: "R$ 630,00 + R$ 63,00",
    abertura: "18:00",
    inicio: "20:45",
  },
];

export default function TicketsScreen() {
  const [selectedTicket, setSelectedTicket] = useState(0);
  const currentTicket = tickets[selectedTicket];
  const router = useRouter();

  const ticketScrollRef = useRef<ScrollView>(null);
  const tabsScrollRef = useRef<ScrollView>(null);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      animatedValue.setValue(0);
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 6000,
        useNativeDriver: false,
      }).start(() => startAnimation());
    };
    startAnimation();
  }, [animatedValue]);

  const barWidth = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["100%", "0%"],
  });

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / SCREEN_WIDTH);
    if (index >= 0 && index < tickets.length && index !== selectedTicket) {
      setSelectedTicket(index);
      tabsScrollRef.current?.scrollTo({
        x: index * 90 - 40,
        animated: true,
      });
    }
  };

  const handleTabPress = (index: number) => {
    setSelectedTicket(index);
    ticketScrollRef.current?.scrollTo({
      x: index * SCREEN_WIDTH,
      animated: true,
    });
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

      {/* Abas Superiores de Seleção */}
      <View style={styles.tabsContainer}>
        <ScrollView 
          ref={tabsScrollRef}
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={{ width: "100%" }}
        >
          {tickets.map((ticket, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.tab, selectedTicket === index && styles.activeTab]}
              onPress={() => handleTabPress(index)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTicket === index && styles.activeTabText,
                ]}
              >
                {ticket.tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Scroll de Ingressos (Horizontal / Swipable) */}
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
              
              {/* Parte Superior: Imagem */}
              <View style={styles.ticketImageContainer}>
                <Image
                  source={require("../../assets/images/ticket.png")}
                  style={styles.ticketCoverImage}
                  resizeMode="cover"
                />
                
                <View style={styles.overlayBarContainer}>
                  <Animated.View 
                    style={[
                      styles.progressBar, 
                      { 
                        width: selectedTicket === index ? barWidth : "100%", 
                      }
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

                    <View style={{ marginTop: 12 }}>
                      <Text style={styles.cardInfoLabel}>Acesso</Text>
                      <Text style={styles.cardInfoValue} numberOfLines={1}>
                        {ticket.entrada}
                      </Text>
                    </View>

                    <TouchableOpacity style={styles.moreInfoButton} activeOpacity={0.7}>
                      <Text style={styles.moreInfoButtonText}>Mais informações</Text>
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
          </View>
        ))}
      </ScrollView>

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
    paddingVertical: 12,
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
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#000000",
    borderBottomWidth: 0.5,
    borderBottomColor: "#333",
  },
  tab: {
    paddingHorizontal: 20,
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "transparent",
  },
  tabText: {
    color: "#666",
    fontSize: 13,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#026cdf",
  },
  ticketsHorizontalScroll: {
    flex: 1,
  },
  ticketPageWrapper: {
    width: SCREEN_WIDTH, 
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 10,
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
    height: 200,
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
    height: 6,
    backgroundColor: "transparent",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#02e1c1",
  },
  whiteSection: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  qrRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  qrImageContainer: {
    width: 135,
    height: 135,
    flexShrink: 0,
  },
  qrImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  qrRightInfo: {
    flex: 1,
    height: 135,
    paddingLeft: 20,
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
    fontSize: 15,
    color: "#5f5f5f",
    fontWeight: "400",
  },
  moreInfoButton: {
    backgroundColor: "#dff4f6",
    paddingHorizontal: 12,
    paddingVertical: 8,
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
    paddingHorizontal: 24,
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
    padding: 24,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 24,
  },
  gridItem: {
    width: "50%",
  },
  gridLabel: {
    color: "#d2cbc2",
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  gridValue: {
    color: "#5f5f5f",
    fontSize: 14,
    fontWeight: "500",
  },
  gridValueBold: {
    color: "#5f5f5f",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  customFooter: {
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(111, 90, 75, 0.15)",
    borderRadius: 12,
  },
  footerLink: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  footerLinkText: {
    fontSize: 11,
    fontWeight: "400",
    color: "#bba99a",
  },
  footerButton: {
    flex: 1,
    backgroundColor: "rgba(111, 90, 75, 0.1)",
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