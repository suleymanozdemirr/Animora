import React, { useMemo, useState } from "react"
import {
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { FormInput } from "../components"

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, [])

  const validate = () => {
    const nextErrors = {}

    if (!username.trim()) {
      nextErrors.username = "Kullanıcı adı zorunludur."
    }
    if (!email.trim()) {
      nextErrors.email = "E-posta zorunludur."
    } else if (!emailRegex.test(email.trim())) {
      nextErrors.email = "Geçerli bir e-posta adresi girin."
    }

    if (!password) {
      nextErrors.password = "Şifre zorunludur."
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

  const handleRegister = async () => {
    if (!validate()) {
      Alert.alert("Hata", "Lütfen formdaki hataları düzeltin.")
      return
    }

    setIsLoading(true)
    try {
      const payload = {
        username: username.trim(),
        email: email.trim(),
        password,
      }
      console.log("Kayıt verileri:", payload)

      await new Promise((resolve) => setTimeout(resolve, 1200))
      Alert.alert("Başarılı", "Kayıt işlemi başarıyla tamamlandı.")
    } catch (error) {
      Alert.alert("Hata", "Kayıt sırasında bir sorun oluştu.")
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
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Kayıt Ol</Text>
          <Text style={styles.subtitle}>
            Animora dünyasına katıl ve listeni oluşturmaya başla.
          </Text>

          <FormInput
            label="Kullanıcı Adı"
            value={username}
            onChangeText={setUsername}
            placeholder="anime_lover"
            autoCapitalize="none"
            error={errors.username}
          />

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

          <FormInput
            label="Şifre Tekrar"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="********"
            secureTextEntry={!showConfirmPassword}
            rightIconName={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
            onRightIconPress={() => setShowConfirmPassword((prev) => !prev)}
            error={errors.confirmPassword}
          />

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.registerButtonText}>Kayıt Ol</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={styles.loginLink}
          >
            <Text style={styles.loginText}>
              Zaten hesabınız var mı? <Text style={styles.loginTextBold}>Giriş Yap</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  registerButton: {
    marginTop: 6,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8A73F8",
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  loginLink: {
    marginTop: 16,
    alignItems: "center",
  },
  loginText: {
    color: "#665D87",
    fontSize: 14,
  },
  loginTextBold: {
    color: "#7B63EF",
    fontWeight: "700",
  },
})

export default RegisterScreen
