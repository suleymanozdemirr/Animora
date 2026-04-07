import React, { useMemo, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { FormInput } from "../components"

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, [])

  const validate = () => {
    const nextErrors = {}

    if (!email.trim()) {
      nextErrors.email = "E-posta zorunludur."
    } else if (!emailRegex.test(email.trim())) {
      nextErrors.email = "Geçerli bir e-posta adresi girin."
    }

    if (!password) {
      nextErrors.password = "Şifre zorunludur."
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleLogin = async () => {
    if (!validate()) {
      Alert.alert("Hata", "Lütfen giriş bilgilerinizi kontrol edin.")
      return
    }

    setIsLoading(true)
    try {
      const payload = {
        email: email.trim(),
        password,
        rememberMe,
      }
      console.log("Giriş verileri:", payload)
      await new Promise((resolve) => setTimeout(resolve, 1200))
      Alert.alert("Başarılı", "Giriş işlemi başarıyla tamamlandı.")
    } catch (error) {
      Alert.alert("Hata", "Giriş sırasında bir sorun oluştu.")
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
            <Text style={styles.title}>Giriş Yap</Text>
            <Text style={styles.subtitle}>
              Animora hesabına giriş yap ve favori animelerine hemen dön.
            </Text>

            <FormInput
              label="E-posta"
              value={email}
              onChangeText={setEmail}
              placeholder="ornek@mail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <FormInput
              label="Şifre"
              value={password}
              onChangeText={setPassword}
              placeholder="********"
              secureTextEntry={!showPassword}
              rightIconName={showPassword ? "eye-off-outline" : "eye-outline"}
              onRightIconPress={() => setShowPassword((prev) => !prev)}
              error={errors.password}
            />

            <View style={styles.helperRow}>
              <View style={styles.rememberWrap}>
                <Switch
                  value={rememberMe}
                  onValueChange={setRememberMe}
                  trackColor={{ false: "#D7D3EA", true: "#B7A4FF" }}
                  thumbColor={rememberMe ? "#7B63EF" : "#F8F7FF"}
                />
                <Text style={styles.rememberText}>Beni Hatırlat</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
                <Text style={styles.forgotText}>Şifremi Unuttum</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>Giriş Yap</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              style={styles.registerLink}
            >
              <Text style={styles.registerText}>
                Henüz hesabınız yok mu?{" "}
                <Text style={styles.registerTextBold}>Kayıt Ol</Text>
              </Text>
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
  helperRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: -2,
    marginBottom: 10,
  },
  rememberWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberText: {
    marginLeft: 8,
    color: "#665D87",
    fontSize: 13,
  },
  forgotText: {
    color: "#7B63EF",
    fontSize: 13,
    fontWeight: "600",
  },
  loginButton: {
    marginTop: 8,
    height: 52,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8A73F8",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  registerLink: {
    marginTop: 16,
    alignItems: "center",
  },
  registerText: {
    color: "#665D87",
    fontSize: 14,
  },
  registerTextBold: {
    color: "#7B63EF",
    fontWeight: "700",
  },
})

export default LoginScreen
