import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleAuth = async () => {
    if (!email.trim() || !password) {
      setFeedback({ type: 'error', message: 'Preencha seu e-mail e sua senha para continuar.' });
      return;
    }

    setFeedback(null);
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email.trim(), password);
        router.replace('/');
      } else {
        await signUp(email.trim(), password);
        setIsLogin(true);
        setPassword('');
        setFeedback({
          type: 'success',
          message: 'Conta criada! Agora entre com seu e-mail e senha. Se for solicitada, confirme seu e-mail antes de entrar.',
        });
      }
    } catch (error: any) {
      setFeedback({
        type: 'error',
        message: error.message || 'Não foi possível concluir. Confira os dados e tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  };

return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoMark}>
            <Image source={require('../assets/images/icon.png')} style={styles.logoImage} />
          </View>
          <Text style={styles.brand}>QUENTRO</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>{isLogin ? 'Que bom ver você' : 'Crie sua conta'}</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Entre para acessar seus ingressos.' : 'Cadastre-se para acompanhar seus eventos.'}
          </Text>

          <View style={styles.form}>
            <Text style={styles.fieldLabel}>E-mail</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={19} color="#00f0ff" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="voce@exemplo.com"
                placeholderTextColor="#7b8492"
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  setFeedback(null);
                }}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
              />
            </View>

            <Text style={styles.fieldLabel}>Senha</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={19} color="#00f0ff" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor="#7b8492"
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  setFeedback(null);
                }}
                secureTextEntry
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                onSubmitEditing={handleAuth}
              />
            </View>
          </View>

          {feedback && (
            <View style={[styles.feedback, feedback.type === 'success' ? styles.feedbackSuccess : styles.feedbackError]}>
              <Ionicons
                name={feedback.type === 'success' ? 'checkmark-circle' : 'alert-circle'}
                size={20}
                color={feedback.type === 'success' ? '#86efac' : '#fca5a5'}
              />
              <Text style={[styles.feedbackText, feedback.type === 'success' ? styles.feedbackSuccessText : styles.feedbackErrorText]}>
                {feedback.message}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={handleAuth}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#070d0f" />
            ) : (
              <Text style={styles.buttonText}>
                {isLogin ? 'Entrar na minha conta' : 'Criar minha conta'}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              {isLogin ? 'Ainda não tem uma conta? ' : 'Já tem uma conta? '}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setIsLogin(!isLogin);
                setFeedback(null);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.infoLink}>
                {isLogin ? 'Cadastre-se' : 'Entrar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1012',
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    paddingHorizontal: 20,
    justifyContent: 'center',
    paddingVertical: 28,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 22,
  },
  logoMark: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#131b1d',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#00f0ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoImage: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  brand: {
    fontSize: 12,
    fontWeight: '800',
    color: '#00f0ff',
    letterSpacing: 2,
  },
  card: {
    backgroundColor: '#131b1d',
    borderColor: 'rgba(0, 240, 255, 0.25)',
    borderWidth: 1,
    borderRadius: 18,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8,
  },
  title: {
    fontSize: 25,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 7,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
  },
  form: {
    marginBottom: 16,
  },
  fieldLabel: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0c1315',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 17,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    outlineStyle: 'none',
  } as any,
  feedback: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 9,
    borderWidth: 1,
    padding: 12,
    marginBottom: 14,
    gap: 9,
  },
  feedbackSuccess: {
    backgroundColor: '#0c2226',
    borderColor: '#115e59',
  },
  feedbackError: {
    backgroundColor: '#2b1719',
    borderColor: '#65343a',
  },
  feedbackText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },
  feedbackSuccessText: {
    color: '#99f6e4',
  },
  feedbackErrorText: {
    color: '#fecaca',
  },
  button: {
    backgroundColor: '#00f0ff',
    borderRadius: 9,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00f0ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#070d0f',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  infoLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00f0ff',
  },
});