import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#6C5CE7',
  primaryLight: '#A29BFE',
  accent: '#00D2FF',
  bgDark: '#0A0E27',
  bgCard: '#141937',
  bgCardLight: '#1E2548',
  bgInput: '#1A1F3D',
  textPrimary: '#FFFFFF',
  textSecondary: '#8B92B0',
  border: '#2A3158',
};

const CANNED_RESPONSES = [
  "Based on your current data, revenue is up 12.4% compared to last month. Your top-performing category is SaaS subscriptions, contributing 43% of total revenue. I'd recommend focusing marketing spend there for maximum ROI.",
  "I've analyzed your sales pipeline. You have 23 deals in progress worth a combined $184,500. The average deal cycle is 18 days, which is 3 days faster than last quarter. Your close rate sits at 34%, above the industry benchmark of 28%.",
  "Looking at your Q2 forecast, I'm projecting $312K in revenue based on current growth trajectories. Key risk factors include seasonal dip in April and two enterprise contracts up for renewal. I'd suggest scheduling renewal conversations this week.",
  "Your product performance comparison shows Product A leads with a 67% margin, while Product C has the highest volume at 1,240 units sold. Interestingly, Product B has the best customer retention rate at 89%. Would you like a detailed breakdown?",
  "I've generated your expense report summary. Total operating costs are $47,200 this month, a 3.1% decrease from last month. The largest savings came from renegotiated vendor contracts. Your burn rate gives you 14.2 months of runway at current spending.",
  "Customer acquisition cost has dropped to $42.30, down from $56.10 last quarter. This correlates with your new referral program, which now accounts for 22% of new signups. Lifetime value to CAC ratio is 8.4x, which is excellent for your segment.",
];

const QUICK_SUGGESTIONS = [
  'Analyze this month\'s revenue',
  'Generate a sales report',
  'Forecast Q2 trends',
  'Compare product performance',
];

const formatTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  const m = minutes < 10 ? '0' + minutes : minutes;
  return `${h}:${m} ${ampm}`;
};

const TypingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (dot, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );

    const a1 = animateDot(dot1, 0);
    const a2 = animateDot(dot2, 150);
    const a3 = animateDot(dot3, 300);

    a1.start();
    a2.start();
    a3.start();

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [dot1, dot2, dot3]);

  const dotStyle = (anim) => ({
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primaryLight,
    marginHorizontal: 3,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -6],
        }),
      },
    ],
    opacity: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.4, 1],
    }),
  });

  return (
    <View style={styles.typingContainer}>
      <View style={styles.aiAvatar}>
        <Ionicons name="hardware-chip-outline" size={14} color={COLORS.accent} />
      </View>
      <View style={styles.typingBubble}>
        <Animated.View style={dotStyle(dot1)} />
        <Animated.View style={dotStyle(dot2)} />
        <Animated.View style={dotStyle(dot3)} />
      </View>
    </View>
  );
};

const AIAssistantScreen = ({ navigation }) => {
  const welcomeMessage = {
    id: '1',
    text: "Hello! I'm your BizPilot AI assistant. I can help you analyze business data, generate reports, forecast trends, and automate tasks. What would you like to explore?",
    sender: 'ai',
    timestamp: new Date(),
  };

  const [messages, setMessages] = useState([welcomeMessage]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);
  const responseIndex = useRef(0);

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    Keyboard.dismiss();

    const userMessage = {
      id: Date.now().toString(),
      text: trimmed,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: CANNED_RESPONSES[responseIndex.current % CANNED_RESPONSES.length],
        sender: 'ai',
        timestamp: new Date(),
      };
      responseIndex.current += 1;
      setIsTyping(false);
      setMessages((prev) => [...prev, aiResponse]);
    }, 1500);
  };

  const handleSuggestionTap = (suggestion) => {
    setInputText(suggestion);
  };

  const handleNewChat = () => {
    setMessages([
      {
        ...welcomeMessage,
        id: Date.now().toString(),
        timestamp: new Date(),
      },
    ]);
    setInputText('');
    setIsTyping(false);
    responseIndex.current = 0;
  };

  const renderMessage = ({ item }) => {
    const isAI = item.sender === 'ai';

    return (
      <View
        style={[
          styles.messageRow,
          isAI ? styles.messageRowAI : styles.messageRowUser,
        ]}
      >
        {isAI && (
          <View style={styles.aiAvatar}>
            <Ionicons name="hardware-chip-outline" size={14} color={COLORS.accent} />
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isAI ? styles.aiBubble : styles.userBubble,
          ]}
        >
          <Text style={[styles.messageText, isAI ? styles.aiText : styles.userText]}>
            {item.text}
          </Text>
          <Text
            style={[
              styles.timestamp,
              isAI ? styles.aiTimestamp : styles.userTimestamp,
            ]}
          >
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  const renderQuickSuggestions = () => {
    if (messages.length > 3) return null;

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.suggestionsContainer}
        keyboardShouldPersistTaps="handled"
      >
        {QUICK_SUGGESTIONS.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestionChip}
            onPress={() => handleSuggestionTap(suggestion)}
            activeOpacity={0.7}
          >
            <Text style={styles.suggestionText}>{suggestion}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerSideButton}
            onPress={() => navigation?.goBack?.()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <View style={styles.headerTitleRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.headerTitle}>AI Assistant</Text>
            </View>
            <Text style={styles.headerSubtitle}>Online</Text>
          </View>
          <TouchableOpacity
            style={styles.headerSideButton}
            onPress={handleNewChat}
            activeOpacity={0.7}
          >
            <Ionicons name="add-outline" size={26} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
          onContentSizeChange={scrollToBottom}
        />

        {/* Quick Suggestions */}
        {renderQuickSuggestions()}

        {/* Input Area */}
        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachButton} activeOpacity={0.7}>
              <Ionicons name="attach-outline" size={22} color={COLORS.textSecondary} />
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask BizPilot AI anything..."
              placeholderTextColor={COLORS.textSecondary}
              multiline
              maxLength={1000}
              returnKeyType={Platform.OS === 'ios' ? 'default' : 'send'}
              blurOnSubmit={Platform.OS === 'android'}
              onSubmitEditing={Platform.OS === 'android' ? handleSend : undefined}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                inputText.trim() ? styles.sendButtonActive : styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={!inputText.trim()}
              activeOpacity={0.7}
            >
              <Ionicons
                name="paper-plane"
                size={18}
                color={inputText.trim() ? COLORS.textPrimary : COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerSideButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00E676',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.accent,
    marginTop: 2,
  },
  messageList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  messageRowAI: {
    justifyContent: 'flex-start',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  aiAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.bgCardLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  aiBubble: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 18,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  aiText: {
    color: COLORS.textPrimary,
  },
  userText: {
    color: COLORS.textPrimary,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 6,
  },
  aiTimestamp: {
    color: COLORS.textSecondary,
  },
  userTimestamp: {
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'right',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: 18,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  suggestionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  suggestionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
    backgroundColor: 'transparent',
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 13,
    color: COLORS.primaryLight,
    fontWeight: '500',
  },
  inputWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.bgInput,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 6,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
  },
  attachButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    maxHeight: 100,
    paddingVertical: Platform.OS === 'ios' ? 8 : 6,
    paddingHorizontal: 4,
    lineHeight: 20,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: COLORS.primary,
  },
  sendButtonDisabled: {
    backgroundColor: 'transparent',
  },
});

export default AIAssistantScreen;
