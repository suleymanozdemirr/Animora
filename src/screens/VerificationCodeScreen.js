import React, { useState } from "react"
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

const VerificationCodeScreen = ({ navigation, route }) => {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const email = route?.params?.email ?? ""

  const validate = () => {
    if (!code.trim()) {
      setError("Doğrulama kodu zorunludur.")
      return false
    }
    if (code.trim().length < 4) {
      setError("Kod en az 4 karakter olmalıdır.")
      return false
    }
    setError("")
    return true
  }

  const handleVerifyCode = async () => {
    if (!validate()) {
      Alert.alert("Hata", "Lütfen geçerli bir doğrulama kodu girin.")
      return
    }

    setIsLoading(true)
    try {
      console.log("Kod doğrulama verisi:", { email, code: code.trim() })
      await new Promise((resolve) => setTimeout(resolve, 1100))
      Alert.alert("Başarılı", "Kod doğrulandı.")
      navigation.navigate("ResetPassword", { email })
    } catch (verifyError) {
      Alert.alert("Hata", "Kod doğrulama sırasında bir sorun oluştu.")
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
            <Text style={styles.title}>Kod Doğrulama</Text>
            <Text style={styles.subtitle}>
              {email
                ? `${email} adresine gönderilen doğrulama kodunu girin.`
                : "E-posta adresinize gönderilen doğrulama kodunu girin."}
            </Text>

            <FormInput
              label="Doğrulama Kodu"
              value={code}
              onChangeText={setCode}
              placeholder="123456"
              keyboardType="number-pad"
              autoCapitalize="none"
              error={error}
            />

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleVerifyCode}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Kodu Doğrula</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
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
  primaryButton: {
    marginTop: 8,
    height: 52,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8A73F8",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
})

export default VerificationCodeScreen
