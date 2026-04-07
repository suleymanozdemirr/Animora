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

const ResetPasswordScreen = ({ navigation, route }) => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const email = route?.params?.email ?? ""

  const validate = () => {
    const nextErrors = {}

    if (!password) {
      nextErrors.password = "Yeni şifre zorunludur."
    } else if (password.length < 8) {
      nextErrors.password = "Şifre en az 8 karakter olmalıdır."
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Şifre tekrar zorunludur."
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Şifreler birbiriyle eşleşmiyor."
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleResetPassword = async () => {
    if (!validate()) {
      Alert.alert("Hata", "Lütfen formdaki hataları düzeltin.")
      return
    }

    setIsLoading(true)
    try {
      console.log("Yeni şifre verisi:", { email, password })
      await new Promise((resolve) => setTimeout(resolve, 1200))
      Alert.alert("Başarılı", "Şifreniz güncellendi. Şimdi giriş yapabilirsiniz.")
      navigation.navigate("Login")
    } catch (resetError) {
      Alert.alert("Hata", "Şifre güncellenirken bir sorun oluştu.")
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
            <Text style={styles.title}>Yeni Şifre</Text>
            <Text style={styles.subtitle}>
              Güvenli bir şifre belirleyin ve hesabınıza tekrar erişin.
            </Text>

            <FormInput
              label="Yeni Şifre"
              value={password}
              onChangeText={setPassword}
              placeholder="********"
              secureTextEntry={!showPassword}
              rightIconName={showPassword ? "eye-off-outline" : "eye-outline"}
              onRightIconPress={() => setShowPassword((prev) => !prev)}
              error={errors.password}
            />

            <FormInput
              label="Yeni Şifre Tekrar"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="********"
              secureTextEntry={!showConfirmPassword}
              rightIconName={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
              onRightIconPress={() => setShowConfirmPassword((prev) => !prev)}
              error={errors.confirmPassword}
            />

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Şifreyi Güncelle</Text>
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

export default ResetPasswordScreen
