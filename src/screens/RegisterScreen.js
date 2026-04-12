import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  Animated,
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
import { useAuth } from "../context/AuthContext"

const RegisterScreen = ({ navigation }) => {
  const { signUp } = useAuth()
  const floatA = useRef(new Animated.Value(0)).current
  const floatB = useRef(new Animated.Value(0)).current
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, [])

  useEffect(() => {
    const loopA = Animated.loop(
      Animated.sequence([
        Animated.timing(floatA, {
          toValue: 1,
          duration: 2800,
          useNativeDriver: true,
        }),
        Animated.timing(floatA, {
          toValue: 0,
          duration: 2800,
          useNativeDriver: true,
        }),
      ])
    )

    const loopB = Animated.loop(
      Animated.sequence([
        Animated.timing(floatB, {
          toValue: 1,
          duration: 3600,
          useNativeDriver: true,
        }),
        Animated.timing(floatB, {
          toValue: 0,
          duration: 3600,
          useNativeDriver: true,
        }),
      ])
    )

    loopA.start()
    loopB.start()

    return () => {
      loopA.stop()
      loopB.stop()
    }
  }, [floatA, floatB])

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
      const result = await signUp({
        username: username.trim(),
        email: email.trim(),
        password,
      })

      if (!result?.session) {
        Alert.alert(
          "Başarılı",
          "Kayıt tamamlandı. E-postanı doğruladıktan sonra giriş yapabilirsin."
        )
        navigation.navigate("Login")
      }
    } catch (error) {
      Alert.alert("Hata", error?.message || "Kayıt sırasında bir sorun oluştu.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <LinearGradient
      colors={["#FAF6FF", "#EFE9FF", "#E4F4FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.bgBlobLarge,
          {
            transform: [
              {
                translateY: floatA.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -14],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.bgBlobSmall,
          {
            transform: [
              {
                translateY: floatB.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 10],
                }),
              },
            ],
          },
        ]}
      />
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
            rightIconName={
              showConfirmPassword ? "eye-off-outline" : "eye-outline"
            }
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
              Zaten hesabınız var mı?{" "}
              <Text style={styles.loginTextBold}>Giriş Yap</Text>
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
    backgroundColor: "#F4EEFF",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  bgBlobLarge: {
    position: "absolute",
    top: "8%",
    right: -36,
    width: 210,
    height: 210,
    borderRadius: 120,
    backgroundColor: "rgba(164, 129, 255, 0.20)",
  },
  bgBlobSmall: {
    position: "absolute",
    bottom: "14%",
    left: -22,
    width: 150,
    height: 150,
    borderRadius: 90,
    backgroundColor: "rgba(124, 199, 255, 0.20)",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.88)",
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
