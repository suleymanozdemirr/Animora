import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAnime } from '../context/AnimeContext';
import { colors, statusConfig } from '../constants/colors';
import { spacing, borderRadius, fontSize, fontWeight, shadows } from '../constants/theme';

const AddAnimeScreen = ({ navigation }) => {
  const { addAnime } = useAnime();
  
  const [formData, setFormData] = useState({
    title: '',
    titleJapanese: '',
    image: 'https://via.placeholder.com/300x450/1A1A2E/6C5CE7?text=Anime',
    totalSeasons: '1',
    totalEpisodes: '12',
    genres: '',
    studio: '',
    year: new Date().getFullYear().toString(),
    synopsis: '',
    notes: '',
    status: 'planToWatch',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Anime adı zorunludur';
    }
    if (!formData.totalEpisodes || parseInt(formData.totalEpisodes) <= 0) {
      newErrors.totalEpisodes = 'Geçerli bir bölüm sayısı girin';
    }
    if (!formData.totalSeasons || parseInt(formData.totalSeasons) <= 0) {
      newErrors.totalSeasons = 'Geçerli bir sezon sayısı girin';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      Alert.alert('Hata', 'Lütfen gerekli alanları doldurun');
      return;
    }

    const genresArray = formData.genres
      .split(',')
      .map(g => g.trim())
      .filter(g => g.length > 0);

    const newAnime = {
      title: formData.title.trim(),
      titleJapanese: formData.titleJapanese.trim() || '',
      image: formData.image.trim() || 'https://via.placeholder.com/300x450/1A1A2E/6C5CE7?text=Anime',
      coverImage: formData.image.trim() || 'https://via.placeholder.com/800x400/1A1A2E/6C5CE7?text=Cover',
      totalSeasons: parseInt(formData.totalSeasons) || 1,
      totalEpisodes: parseInt(formData.totalEpisodes) || 12,
      genres: genresArray.length > 0 ? genresArray : ['Anime'],
      studio: formData.studio.trim() || 'Bilinmiyor',
      year: parseInt(formData.year) || new Date().getFullYear(),
      synopsis: formData.synopsis.trim() || 'Açıklama eklenmedi.',
      notes: formData.notes.trim(),
      status: formData.status,
    };

    addAnime(newAnime);
    Alert.alert('Başarılı', `"${newAnime.title}" listene eklendi!`, [
      { text: 'Tamam', onPress: () => navigation.goBack() }
    ]);
  };

  const renderInput = (label, field, placeholder, options = {}) => {
    const { keyboardType = 'default', multiline = false, numberOfLines = 1 } = options;
    
    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            errors[field] && styles.inputError,
          ]}
          value={formData[field]}
          onChangeText={(value) => handleChange(field, value)}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
        {errors[field] && (
          <Text style={styles.errorText}>{errors[field]}</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Anime Ekle</Text>
        <TouchableOpacity onPress={handleSubmit} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Kaydet</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Basic Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Temel Bilgiler</Text>
            
            {renderInput('Anime Adı *', 'title', 'Örn: Attack on Titan')}
            {renderInput('Japonca Adı', 'titleJapanese', 'Örn: 進撃の巨人')}
            {renderInput('Poster URL', 'image', 'https://...')}
          </View>

          {/* Episode Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bölüm Bilgileri</Text>
            
            <View style={styles.row}>
              <View style={styles.halfInput}>
                {renderInput('Toplam Sezon *', 'totalSeasons', '1', { keyboardType: 'numeric' })}
              </View>
              <View style={styles.halfInput}>
                {renderInput('Toplam Bölüm *', 'totalEpisodes', '12', { keyboardType: 'numeric' })}
              </View>
            </View>
          </View>

          {/* Additional Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ek Bilgiler</Text>
            
            {renderInput('Türler', 'genres', 'Action, Drama, Fantasy (virgülle ayırın)')}
            
            <View style={styles.row}>
              <View style={styles.halfInput}>
                {renderInput('Stüdyo', 'studio', 'MAPPA')}
              </View>
              <View style={styles.halfInput}>
                {renderInput('Yıl', 'year', '2024', { keyboardType: 'numeric' })}
              </View>
            </View>
          </View>

          {/* Status Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Durum</Text>
            <View style={styles.statusGrid}>
              {Object.entries(statusConfig).map(([key, config]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.statusOption,
                    formData.status === key && styles.statusOptionActive,
                    formData.status === key && { borderColor: config.color },
                  ]}
                  onPress={() => handleChange('status', key)}
                >
                  <Ionicons
                    name={config.icon}
                    size={20}
                    color={formData.status === key ? config.color : colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.statusOptionText,
                      formData.status === key && { color: config.color },
                    ]}
                  >
                    {config.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Description Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Açıklamalar</Text>
            
            {renderInput('Özet', 'synopsis', 'Anime hakkında kısa bir özet...', {
              multiline: true,
              numberOfLines: 4,
            })}
            
            {renderInput('Notlarım', 'notes', 'Kendi notlarınız...', {
              multiline: true,
              numberOfLines: 3,
            })}
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Ionicons name="add-circle" size={24} color={colors.textPrimary} />
            <Text style={styles.submitButtonText}>Listeye Ekle</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  saveButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  saveButtonText: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.backgroundInput,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.textPrimary,
    fontSize: fontSize.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  multilineInput: {
    minHeight: 100,
    paddingTop: spacing.md,
  },
  inputError: {
    borderColor: colors.dropped,
  },
  errorText: {
    color: colors.dropped,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundCard,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  statusOptionActive: {
    backgroundColor: colors.backgroundInput,
  },
  statusOptionText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
  },
  submitButtonText: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
});

export default AddAnimeScreen;
