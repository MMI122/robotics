import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  useTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Category } from '../../types';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const theme = useTheme();

  return (
    <Card
      component={Link}
      to={`/products?category=${category.slug}`}
      sx={{
        height: '100%',
        textDecoration: 'none',
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.3s ease',
        border: '1px solid rgba(0,0,0,0.08)',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: theme.shadows[8],
          '& .category-image': {
            transform: 'scale(1.1)',
          },
          '& .category-overlay': {
            opacity: 0.8,
          },
        },
      }}
    >
      <Box sx={{ position: 'relative', height: 200 }}>
        <CardMedia
          component="img"
          height="100%"
          image={category.image || '/images/placeholder-category.jpg'}
          alt={category.name}
          className="category-image"
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
        />
        
        {/* Gradient Overlay */}
        <Box
          className="category-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.6), rgba(30, 60, 114, 0.6))',
            opacity: 0.6,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* Category Content Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            textAlign: 'center',
            p: 2,
            zIndex: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              mb: 1,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {category.name}
          </Typography>
          
          {/* Product count temporarily disabled until backend provides this data */}
        </Box>
      </Box>

      {category.description && (
        <CardContent sx={{ p: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.4,
            }}
          >
            {category.description}
          </Typography>
        </CardContent>
      )}
    </Card>
  );
};

export default CategoryCard;