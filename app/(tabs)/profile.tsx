import { IconSymbol } from "@/components/ui/icon-symbol";
import { mockEvents, mockUser } from "@/constants/mockData";
import { Image as ExpoImage } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function ProfileScreen() {
  console.log("PROFILE RENDER");
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<
    "tickets" | "favorites" | "history"
  >("tickets");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const favoriteEvents = mockEvents.filter((e) =>
    mockUser.favoriteEvents.includes(e.id),
  );

  const handleEventPress = (eventId: string) => {
    (router as any).push(`/event/${eventId}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Info */}
        <View style={styles.userSection}>
          <ExpoImage
            source={mockUser.avatar}
            style={styles.avatar}
            contentFit="cover"
          />
          <Text style={styles.userName}>{mockUser.name}</Text>
          <Text style={styles.userEmail}>{mockUser.email}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mockUser.tickets.length}</Text>
              <Text style={styles.statLabel}>Ingressos</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {mockUser.favoriteEvents.length}
              </Text>
              <Text style={styles.statLabel}>Favoritos</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {mockUser.purchaseHistory.length}
              </Text>
              <Text style={styles.statLabel}>Histórico</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "tickets" && styles.tabActive]}
            onPress={() => setSelectedTab("tickets")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "tickets" && styles.tabTextActive,
              ]}
            >
              Meus Ingressos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === "favorites" && styles.tabActive,
            ]}
            onPress={() => setSelectedTab("favorites")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "favorites" && styles.tabTextActive,
              ]}
            >
              Favoritos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "history" && styles.tabActive]}
            onPress={() => setSelectedTab("history")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "history" && styles.tabTextActive,
              ]}
            >
              Histórico
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {selectedTab === "tickets" && (
          <View style={styles.contentSection}>
            {mockUser.tickets.map((ticket) => (
              <TouchableOpacity
                key={ticket.id}
                style={styles.eventCard}
                onPress={() => {}}
                activeOpacity={0.8}
              >
                <ExpoImage
                  source={ticket.eventImage}
                  style={styles.eventImage}
                  contentFit="cover"
                />
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle} numberOfLines={2}>
                    {ticket.eventTitle}
                  </Text>
                  <View style={styles.eventInfo}>
                    <IconSymbol name="calendar" size={14} color="#666" />
                    <Text style={styles.eventDate}>
                      {formatDate(ticket.date)}
                    </Text>
                  </View>
                  <View style={styles.eventInfo}>
                    <IconSymbol name="mappin" size={14} color="#666" />
                    <Text style={styles.eventLocation}>{ticket.venue}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          ticket.status === "valid" ? "#4CAF50" : "#FF9800",
                      },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {ticket.status === "valid" ? "Válido" : "Utilizado"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {selectedTab === "favorites" && (
          <View style={styles.contentSection}>
            {favoriteEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventCard}
                onPress={() => handleEventPress(event.id)}
                activeOpacity={0.8}
              >
                <ExpoImage
                  source={event.image}
                  style={styles.eventImage}
                  contentFit="cover"
                />
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle} numberOfLines={2}>
                    {event.title}
                  </Text>
                  <View style={styles.eventInfo}>
                    <IconSymbol name="calendar" size={14} color="#666" />
                    <Text style={styles.eventDate}>
                      {formatDate(event.date)}
                    </Text>
                  </View>
                  <View style={styles.eventInfo}>
                    <IconSymbol name="mappin" size={14} color="#666" />
                    <Text style={styles.eventLocation}>{event.venue}</Text>
                  </View>
                  <Text style={styles.eventPrice}>R$ {event.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {selectedTab === "history" && (
          <View style={styles.contentSection}>
            {mockUser.purchaseHistory.map((ticket) => (
              <TouchableOpacity
                key={ticket.id}
                style={[styles.eventCard, styles.eventCardPast]}
                onPress={() => (router as any).push("/tickets")}
                activeOpacity={0.8}
              >
                <ExpoImage
                  source={ticket.eventImage}
                  style={styles.eventImage}
                  contentFit="cover"
                />
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle} numberOfLines={2}>
                    {ticket.eventTitle}
                  </Text>
                  <View style={styles.eventInfo}>
                    <IconSymbol name="calendar" size={14} color="#666" />
                    <Text style={styles.eventDate}>
                      {formatDate(ticket.date)}
                    </Text>
                  </View>
                  <View style={styles.eventInfo}>
                    <IconSymbol name="mappin" size={14} color="#666" />
                    <Text style={styles.eventLocation}>{ticket.venue}</Text>
                  </View>
                  <View
                    style={[styles.statusBadge, { backgroundColor: "#FF9800" }]}
                  >
                    <Text style={styles.statusText}>Utilizado</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Configurações</Text>

          <TouchableOpacity style={styles.settingItem}>
            <IconSymbol name="bell" size={24} color="#666" />
            <Text style={styles.settingText}>Notificações</Text>
            <IconSymbol name="chevron.right" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <IconSymbol name="creditcard" size={24} color="#666" />
            <Text style={styles.settingText}>Métodos de Pagamento</Text>
            <IconSymbol name="chevron.right" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <IconSymbol name="lock" size={24} color="#666" />
            <Text style={styles.settingText}>Privacidade</Text>
            <IconSymbol name="chevron.right" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <IconSymbol name="questionmark.circle" size={24} color="#666" />
            <Text style={styles.settingText}>Ajuda</Text>
            <IconSymbol name="chevron.right" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, styles.settingItemDanger]}
          >
            <IconSymbol name="arrow.right.square" size={24} color="#F44336" />
            <Text style={[styles.settingText, styles.settingTextDanger]}>
              Sair
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  userSection: {
    backgroundColor: "#fff",
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#007AFF",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#eee",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#007AFF",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#007AFF",
  },
  contentSection: {
    paddingHorizontal: 20,
  },
  eventCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventCardPast: {
    opacity: 0.7,
  },
  eventImage: {
    width: 100,
    height: 100,
  },
  eventContent: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  eventInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 12,
    color: "#666",
  },
  eventLocation: {
    fontSize: 12,
    color: "#666",
  },
  eventPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#007AFF",
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
  settingsSection: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  settingItemDanger: {
    borderBottomWidth: 0,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: "#1a1a1a",
    marginLeft: 16,
  },
  settingTextDanger: {
    color: "#F44336",
  },
});
