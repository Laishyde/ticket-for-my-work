import { Ionicons } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// Função com a sua lógica idêntica e intacta, apenas corrigindo a string de exibição
const getDynamicShowDate = () => {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth(); // 6 é Julho
  const currentYear = today.getFullYear();

  let showDay = 17;
  let dayOfWeek = "Sexta-feira";

  if (currentYear === 2026 && currentMonth === 6) {
    if (currentDay <= 17) {
      showDay = 17;
      dayOfWeek = "Sexta-feira";
    } else if (currentDay === 18) {
      showDay = 18;
      dayOfWeek = "Sábado";
    } else if (currentDay >= 19 && currentDay <= 21) {
      showDay = 21;
      dayOfWeek = "Terça-feira";
    } else {
      showDay = 24;
      dayOfWeek = "Sexta-feira";
    }
  } else {
    showDay = 17;
    dayOfWeek = "Sexta-feira";
  }

  // Mantido idêntico ao original
  return `${dayOfWeek}, ${showDay} • 20:45h`;
};

export default function HomeScreen() {
  const router = useRouter();
  const [, setCurrentTime] = useState("");
  const [activeTab, setActiveTab] = useState<"proximos" | "anterior">("proximos");
  const [dynamicDate, setDynamicDate] = useState(getDynamicShowDate());

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      );
      setDynamicDate(getDynamicShowDate());
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleEventPress = (eventId: string) => {
    (router as any).push(`/event/${eventId}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header com os Ícones Menores na cor da data e sem coração */}
        <View style={styles.mainHeader}>
          <Text style={styles.mainTitle}>Meus ingressos</Text>
          
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
              <Ionicons name="notifications-outline" size={20} color="#8e8e93" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
              <Ionicons name="person-outline" size={20} color="#8e8e93" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Abas (Tabs) */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "proximos" && styles.tabActive]}
            onPress={() => router.push("/tickets")}
            activeOpacity={0.9}
          >
            <Text style={[styles.tabText, activeTab === "proximos" && styles.tabTextActive]}>
              Próximos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "anterior" && styles.tabActive]}
            onPress={() => setActiveTab("anterior")}
            activeOpacity={0.9}
          >
            <Text style={[styles.tabText, activeTab === "anterior" && styles.tabTextActive]}>
              Anterior
            </Text>
          </TouchableOpacity>
        </View>

        {/* Card de Ingresso */}
        <TouchableOpacity
          style={styles.ticketCard}
          onPress={() => handleEventPress("djavan-rio")}
          activeOpacity={0.8}
        >
          <View style={styles.eventImageContainer}>
            <ExpoImage
              source={require("../../assets/images/bts.png")}
              style={styles.eventImage}
              contentFit="cover"
            />
            <View style={styles.tagAgora}>
              <Text style={styles.tagAgoraText}>AGORA</Text>
            </View>
          </View>

          <View style={styles.eventInfo}>
            <View style={styles.ticketMeta}>
              <Text style={styles.ticketCount}>10 ingresso</Text>
              <Text style={styles.dotSeparator}></Text>
              <Text style={styles.eventDate}></Text>
            </View>

            <Text style={styles.eventTitle} numberOfLines={2}>
             BTS WORLD TOUR 'ARIRANG'
            </Text>

            <Text style={styles.eventLocation} numberOfLines={1}>
              São Paulo, no Estádio do MorumBIS
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  mainHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 2,
    marginBottom: 8,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.5,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconButton: {
    backgroundColor: "transparent",
    padding: 4,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#1c1c1e",
    marginVertical: 16,
    borderRadius: 12,
    padding: 3,
    width: "100%",
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    backgroundColor: "#ffffff",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8e8e93",
  },
  tabTextActive: {
    color: "#000000",
  },
  ticketCard: {
    flexDirection: "column",
    borderRadius: 24,
    backgroundColor: "#1c1c1e",
    overflow: "hidden",
    marginTop: 10,
    paddingBottom: 20,
  },
  eventImageContainer: {
    width: "100%",
    height: 310,
    backgroundColor: "#2c2c2e",
    position: "relative",
  },
  eventImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  tagAgora: {
    position: "absolute",
    bottom: 14,
    left: 14,
    backgroundColor: "#00bfa5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagAgoraText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "800",
  },
  eventInfo: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  ticketMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  ticketCount: {
    color: "#00bfa5",
    fontSize: 12,
    fontWeight: "600",
  },
  dotSeparator: {
    color: "#8e8e93",
    fontSize: 12,
  },
  eventDate: {
    color: "#8e8e93",
    fontSize: 12,
    fontWeight: "600",
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    lineHeight: 22,
    marginBottom: 4,
  },
  eventLocation: {
    color: "#8e8e93",
    fontSize: 14,
    fontWeight: "500",
  },
});