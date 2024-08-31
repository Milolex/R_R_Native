import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StarRating = ({ rating }) => {
    const filledStars = Math.floor(rating);
    const halfStar = rating - filledStars >= 0.5 ? 1 : 0;
    const emptyStars = 5 - filledStars - halfStar;

    return (
        <View style={{ flexDirection: 'row' }}>
            {[...Array(filledStars)].map((_, index) => (
                <Ionicons key={index} name="star" size={24} color="gold" />
            ))}
            {halfStar === 1 && <Ionicons name="star-half" size={24} color="gold" />}
            {[...Array(emptyStars)].map((_, index) => (
                <Ionicons key={index} name="star-outline" size={24} color="gray" />
            ))}
        </View>
    );
};

export default StarRating;






//Create By: Camilo Andres Martínez Gualteros 2024