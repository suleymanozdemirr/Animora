import React, { useMemo, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { FormInput } from "../components"

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, [])

  const validate = () => {
    if (!email.trim()) {
      setError("E-posta zorunludur.")
      return false
    }
    if (!emailRegex.test(email.trim())) {
      setError("Geçerli bir e-posta adresi girin.")
      return false
    }
    setError("")
    return true
  }

  const handleResetPassword = async () => {
    if (!validate()) {
      Alert.alert("Hata", "Lütfen geçerli bir e-posta adresi girin.")
      return
    }

    setIsLoading(true)
    try {
      console.log("Şifre sıfırlama isteği:", { email: email.trim() })
      await new Promise((resolve) => setTimeout(resolve, 1200))
      Alert.alert("Başarılı", "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.")
      navigation.navigate("VerificationCode", { email: email.trim() })
    } catch (resetError) {
      Alert.alert("Hata", "İşlem sırasında bir sorun oluştu.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <LinearGradient
      colors={["#FFE7F4", "#EDE2FF", "#DCF3FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Image
            source={require("../../assets/app-icon.png")}
            style={styles.backgroundIllustration}
          />

          <View style={styles.card}>
            <Text style={styles.title}>Şifremi Unuttum</Text>
            <Text style={styles.subtitle}>
              E-posta adresini gir, şifreni yenilemen için bağlantıyı hemen gönderelim.
            </Text>

            <FormInput
              label="E-posta"
              value={email}
              onChangeText={setEmail}
              placeholder="ornek@mail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={error}
            />

            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.resetButtonText}>Sıfırlama Linki Gönder</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backLink}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.backText}>Giriş ekranına dön</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  backgroundIllustration: {
    position: "absolute",
    top: "12%",
    right: -24,
    width: 230,
    height: 230,
    opacity: 0.08,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.85)",
    shadowColor: "#7D5AB8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 5,
  },
  title: {
    color: "#31254F",
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: "AvenirNext-DemiBold",
      android: "sans-serif-medium",
      default: "System",
    }),
  },
  subtitle: {
    color: "#5D547D",
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
    fontFamily: Platform.select({
      ios: "AvenirNext-Regular",
      android: "sans-serif",
      default: "System",
    }),
  },
  resetButton: {
    marginTop: 8,
    height: 52,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8A73F8",
  },
  resetButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  backLink: {
    marginTop: 16,
    alignItems: "center",
  },
  backText: {
    color: "#7B63EF",
    fontSize: 14,
    fontWeight: "700",
  },
})

export default ForgotPasswordScreen
