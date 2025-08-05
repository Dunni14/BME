import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';

interface Category {
  id: string;
  name: string;
  iconName: string;
  color: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  showAll?: boolean;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  showAll = true,
}) => {
  const handleCategoryPress = (categoryId: string | null) => {
    if (selectedCategory === categoryId) {
      onCategorySelect(null); // Deselect if already selected
    } else {
      onCategorySelect(categoryId);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {showAll && (
          <TouchableOpacity
            style={[
              styles.categoryItem,
              selectedCategory === null && styles.selectedCategoryItem,
            ]}
            onPress={() => handleCategoryPress(null)}
          >
            <View style={[
              styles.categoryIcon,
              selectedCategory === null && styles.selectedCategoryIcon,
            ]}>
              <Ionicons 
                name="apps" 
                size={20} 
                color={selectedCategory === null ? colors.surface : colors.primary} 
              />
            </View>
            <Text style={[
              styles.categoryName,
              selectedCategory === null && styles.selectedCategoryName,
            ]}>
              All
            </Text>
          </TouchableOpacity>
        )}
        
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryItem,
                isSelected && styles.selectedCategoryItem,
              ]}
              onPress={() => handleCategoryPress(category.id)}
            >
              <View style={[
                styles.categoryIcon,
                { backgroundColor: isSelected ? category.color : `${category.color}15` },
              ]}>
                <Ionicons 
                  name={category.iconName as any} 
                  size={20} 
                  color={isSelected ? colors.surface : category.color} 
                />
              </View>
              <Text style={[
                styles.categoryName,
                isSelected && styles.selectedCategoryName,
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryItem: {
    alignItems: 'center',
    minWidth: 70,
  },
  selectedCategoryItem: {
    // Additional styling can be added here if needed
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedCategoryIcon: {
    backgroundColor: colors.primary,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  selectedCategoryName: {
    color: colors.primary,
    fontWeight: '600',
  },
});