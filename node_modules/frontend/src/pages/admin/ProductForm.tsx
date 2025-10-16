import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Switch,
  FormControlLabel,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  CircularProgress,
  Backdrop
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  DragIndicator as DragIcon,
  ExpandMore as ExpandMoreIcon,
  Image as ImageIcon,
  Category as CategoryIcon,
  Inventory as InventoryIcon,
  LocalShipping as ShippingIcon,
  Sell as PricingIcon,
  Visibility as SeoIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { productsAPI, categoriesAPI } from '../../services/api';

const ImageUploadArea = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
  '&.dragover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light + '20',
  }
}));

const ImagePreview = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
  '&:hover .delete-button': {
    opacity: 1,
  }
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

interface ProductImage {
  id: string;
  url: string;
  file?: File;
  isPrimary: boolean;
}

interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price?: number;
  stock?: number;
  sku?: string;
}

interface Specification {
  key: string;
  value: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Product name is required').min(3, 'Minimum 3 characters'),
  slug: Yup.string().required('Slug is required'),
  description: Yup.string().required('Description is required').min(10, 'Minimum 10 characters'),
  shortDescription: Yup.string().max(200, 'Maximum 200 characters'),
  sku: Yup.string().required('SKU is required'),
  price: Yup.number().required('Price is required').min(0, 'Price must be positive'),
  categoryId: Yup.number().required('Category is required'),
  stockQuantity: Yup.number().min(0, 'Stock must be non-negative'),
  weight: Yup.number().min(0, 'Weight must be positive'),
});

const AdminProductForm: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [specifications, setSpecifications] = useState<Specification[]>([]);
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);

  // Load categories from API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoriesAPI.getCategories();
        const categoriesData = response.data.data;
        if (categoriesData && Array.isArray(categoriesData)) {
          setCategories(categoriesData.map(cat => ({ id: cat.id, name: cat.name })));
        } else {
          throw new Error('Invalid categories data received');
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        // Fallback to mock data if API fails
        setCategories([
          { id: 1, name: 'Microcontrollers' },
          { id: 2, name: 'Sensors' },
          { id: 3, name: 'Robot Kits' },
          { id: 4, name: 'Motors & Actuators' },
          { id: 5, name: 'Development Boards' },
          { id: 6, name: 'Components' }
        ]);
      }
    };
    
    loadCategories();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      slug: '',
      description: '',
      shortDescription: '',
      sku: '',
      price: 0,
      salePrice: 0,
      categoryId: '',
      stockQuantity: 0,
      manageStock: true,
      weight: 0,
      dimensions: '',
      tags: '',
      metaTitle: '',
      metaDescription: '',
      isActive: true,
      isFeatured: false,
      allowBackorders: false,
      trackQuantity: true,
    },
    validationSchema,
    onSubmit: async (values) => {
      setSaving(true);
      try {
        // Create FormData object for file upload
        const formData = new FormData();
        
        // Add all form fields to FormData
        formData.append('name', values.name);
        formData.append('slug', values.slug);
        formData.append('description', values.description);
        formData.append('short_description', values.shortDescription);
        formData.append('sku', values.sku);
        formData.append('price', values.price.toString());
        if (values.salePrice) {
          formData.append('sale_price', values.salePrice.toString());
        }
        formData.append('category_id', values.categoryId.toString());
        formData.append('stock_quantity', values.stockQuantity.toString());
        formData.append('manage_stock', values.manageStock ? '1' : '0');
        formData.append('weight', values.weight.toString());
        formData.append('dimensions', values.dimensions);
        formData.append('tags', values.tags);
        formData.append('meta_title', values.metaTitle);
        formData.append('meta_description', values.metaDescription);
        formData.append('is_active', values.isActive ? '1' : '0');
        formData.append('is_featured', values.isFeatured ? '1' : '0');
        formData.append('allow_backorders', values.allowBackorders ? '1' : '0');
        formData.append('track_quantity', values.trackQuantity ? '1' : '0');
        
        // Add specifications as JSON
        if (specifications.length > 0) {
          formData.append('specifications', JSON.stringify(
            specifications.reduce((acc, spec) => {
              acc[spec.key] = spec.value;
              return acc;
            }, {} as Record<string, string>)
          ));
        }
        
        // Add variants as JSON
        if (variants.length > 0) {
          formData.append('variants', JSON.stringify(variants));
        }
        
        // Add images
        images.forEach((image, index) => {
          if (image.file) {
            if (image.isPrimary) {
              // Set the primary image as featured_image
              formData.append('featured_image', image.file);
            }
            // Also add all images to the images array
            formData.append('images[]', image.file);
          }
        });
        
        // If no primary image is set, use the first image as featured
        if (images.length > 0 && !images.some(img => img.isPrimary) && images[0].file) {
          formData.append('featured_image', images[0].file);
        }
        
        console.log('Saving product with data:', Object.fromEntries(formData.entries()));
        
        // Call the API
        const response = await productsAPI.createProduct(formData);
        
        console.log('Product saved successfully:', response.data);
        
        // Navigate back to products list
        navigate('/admin/products');
      } catch (error: any) {
        console.error('Error saving product:', error);
        
        // Log detailed error information
        if (error.response) {
          console.error('Error response:', error.response.data);
          console.error('Error status:', error.response.status);
        }
        
        // Show error to user (you might want to add a state for this)
        alert('Failed to save product. Please check the console for details.');
      } finally {
        setSaving(false);
      }
    },
  });

  // Auto-generate slug from name
  useEffect(() => {
    if (formik.values.name && !isEdit) {
      const slug = formik.values.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      formik.setFieldValue('slug', slug);
    }
  }, [formik.values.name, isEdit]);

  // Load product data for editing
  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      // Simulate loading product data
      setTimeout(() => {
        const mockProduct = {
          id: parseInt(id),
          name: 'Arduino Uno R3 Microcontroller Board',
          slug: 'arduino-uno-r3',
          description: 'The most popular Arduino board, perfect for beginners and professionals alike. Features an ATmega328P microcontroller with 14 digital I/O pins.',
          shortDescription: 'Popular Arduino board with ATmega328P microcontroller',
          sku: 'ARD-001',
          price: 29.99,
          salePrice: 24.99,
          categoryId: 1,
          stockQuantity: 150,
          manageStock: true,
          weight: 0.025,
          dimensions: '68.6mm x 53.4mm',
          tags: 'arduino,microcontroller,beginner,electronics',
          metaTitle: 'Arduino Uno R3 - Buy Original Arduino Board',
          metaDescription: 'Buy genuine Arduino Uno R3 microcontroller board. Perfect for electronics projects and prototyping.',
          isActive: true,
          isFeatured: true,
          allowBackorders: false,
          trackQuantity: true,
        };

        Object.keys(mockProduct).forEach(key => {
          formik.setFieldValue(key, mockProduct[key as keyof typeof mockProduct]);
        });

        setImages([
          { id: '1', url: '/api/placeholder/400/400', isPrimary: true },
          { id: '2', url: '/api/placeholder/400/400', isPrimary: false },
          { id: '3', url: '/api/placeholder/400/400', isPrimary: false },
        ]);

        setLoading(false);
      }, 1000);
    }
  }, [isEdit, id]);

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage: ProductImage = {
            id: Date.now().toString() + Math.random(),
            url: e.target?.result as string,
            file,
            isPrimary: images.length === 0
          };
          setImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDeleteImage = (imageId: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== imageId);
      // If we deleted the primary image, make the first remaining image primary
      if (filtered.length > 0 && !filtered.some(img => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  const handleSetPrimaryImage = (imageId: string) => {
    setImages(prev => prev.map(img => ({
      ...img,
      isPrimary: img.id === imageId
    })));
  };

  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: Date.now().toString(),
      name: '',
      value: '',
    };
    setVariants(prev => [...prev, newVariant]);
  };

  const updateVariant = (id: string, field: keyof ProductVariant, value: string | number) => {
    setVariants(prev => prev.map(variant => 
      variant.id === id ? { ...variant, [field]: value } : variant
    ));
  };

  const deleteVariant = (id: string) => {
    setVariants(prev => prev.filter(variant => variant.id !== id));
  };

  // Specification management functions
  const addSpecification = () => {
    const newSpec: Specification = {
      key: '',
      value: '',
    };
    setSpecifications(prev => [...prev, newSpec]);
  };

  const updateSpecification = (index: number, field: keyof Specification, value: string) => {
    setSpecifications(prev => prev.map((spec, i) => 
      i === index ? { ...spec, [field]: value } : spec
    ));
  };

  const deleteSpecification = (index: number) => {
    setSpecifications(prev => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <Backdrop open sx={{ color: '#fff', zIndex: theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading product...
        </Typography>
      </Backdrop>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <IconButton onClick={() => navigate('/admin/products')} sx={{ mr: 2 }}>
                <BackIcon />
              </IconButton>
              <Typography variant="h4" sx={{ flexGrow: 1, fontWeight: 700 }}>
                {isEdit ? 'Edit Product' : 'Add New Product'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<PreviewIcon />}
                  onClick={() => setPreviewOpen(true)}
                >
                  Preview
                </Button>
                <Button
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                  onClick={() => formik.handleSubmit()}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Product'}
                </Button>
              </Box>
            </Box>
            
            {/* Submit error handling disabled - using general error state instead */}
          </Box>

          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              {/* Main Content */}
              <Grid item xs={12} lg={8}>
                <Paper sx={{ borderRadius: 2 }}>
                  <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
                    <Tab label="General" icon={<CategoryIcon />} />
                    <Tab label="Images" icon={<ImageIcon />} />
                    <Tab label="Inventory" icon={<InventoryIcon />} />
                    <Tab label="Shipping" icon={<ShippingIcon />} />
                    <Tab label="SEO" icon={<SeoIcon />} />
                  </Tabs>

                  {/* General Tab */}
                  <TabPanel value={activeTab} index={0}>
                    <Box sx={{ p: 3 }}>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            id="name"
                            name="name"
                            label="Product Name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                          />
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            id="slug"
                            name="slug"
                            label="URL Slug"
                            value={formik.values.slug}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.slug && Boolean(formik.errors.slug)}
                            helperText={formik.touched.slug && formik.errors.slug}
                          />
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            id="sku"
                            name="sku"
                            label="SKU"
                            value={formik.values.sku}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.sku && Boolean(formik.errors.sku)}
                            helperText={formik.touched.sku && formik.errors.sku}
                          />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            rows={4}
                            id="description"
                            name="description"
                            label="Description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                          />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            rows={2}
                            id="shortDescription"
                            name="shortDescription"
                            label="Short Description"
                            value={formik.values.shortDescription}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.shortDescription && Boolean(formik.errors.shortDescription)}
                            helperText={formik.touched.shortDescription && formik.errors.shortDescription}
                          />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            id="tags"
                            name="tags"
                            label="Tags (comma separated)"
                            value={formik.values.tags}
                            onChange={formik.handleChange}
                            placeholder="arduino, microcontroller, electronics"
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </TabPanel>

                  {/* Images Tab */}
                  <TabPanel value={activeTab} index={1}>
                    <Box sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Product Images
                      </Typography>
                      
                      <ImageUploadArea
                        onClick={() => document.getElementById('image-upload')?.click()}
                      >
                        <input
                          id="image-upload"
                          type="file"
                          multiple
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => handleImageUpload(e.target.files)}
                        />
                        <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                          Upload Product Images
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Drag and drop images here or click to browse
                        </Typography>
                      </ImageUploadArea>

                      {images.length > 0 && (
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                          {images.map((image, index) => (
                            <Grid item xs={6} sm={4} md={3} key={image.id}>
                              <ImagePreview>
                                <img
                                  src={image.url}
                                  alt={`Product ${index + 1}`}
                                  style={{ width: '100%', height: 150, objectFit: 'cover' }}
                                />
                                <IconButton
                                  className="delete-button"
                                  sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    bgcolor: 'rgba(0,0,0,0.7)',
                                    color: 'white',
                                    opacity: 0,
                                    transition: 'opacity 0.3s',
                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
                                  }}
                                  size="small"
                                  onClick={() => handleDeleteImage(image.id)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                                {image.isPrimary ? (
                                  <Chip
                                    label="Primary"
                                    size="small"
                                    color="primary"
                                    sx={{ position: 'absolute', bottom: 8, left: 8 }}
                                  />
                                ) : (
                                  <Button
                                    size="small"
                                    onClick={() => handleSetPrimaryImage(image.id)}
                                    sx={{ position: 'absolute', bottom: 8, left: 8 }}
                                  >
                                    Set Primary
                                  </Button>
                                )}
                              </ImagePreview>
                            </Grid>
                          ))}
                        </Grid>
                      )}
                    </Box>
                  </TabPanel>

                  {/* Inventory Tab */}
                  <TabPanel value={activeTab} index={2}>
                    <Box sx={{ p: 3 }}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            type="number"
                            id="stockQuantity"
                            name="stockQuantity"
                            label="Stock Quantity"
                            value={formik.values.stockQuantity}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.stockQuantity && Boolean(formik.errors.stockQuantity)}
                            helperText={formik.touched.stockQuantity && formik.errors.stockQuantity}
                          />
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={formik.values.manageStock}
                                onChange={(e) => formik.setFieldValue('manageStock', e.target.checked)}
                              />
                            }
                            label="Manage Stock"
                          />
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={formik.values.allowBackorders}
                                onChange={(e) => formik.setFieldValue('allowBackorders', e.target.checked)}
                              />
                            }
                            label="Allow Backorders"
                          />
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={formik.values.trackQuantity}
                                onChange={(e) => formik.setFieldValue('trackQuantity', e.target.checked)}
                              />
                            }
                            label="Track Quantity"
                          />
                        </Grid>
                      </Grid>

                      {/* Product Variants */}
                      <Box sx={{ mt: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6">Product Variants</Typography>
                          <Button startIcon={<AddIcon />} onClick={addVariant}>
                            Add Variant
                          </Button>
                        </Box>
                        
                        {variants.map((variant) => (
                          <Card key={variant.id} sx={{ mb: 2 }}>
                            <CardContent>
                              <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={3}>
                                  <TextField
                                    fullWidth
                                    label="Attribute"
                                    value={variant.name}
                                    onChange={(e) => updateVariant(variant.id, 'name', e.target.value)}
                                    placeholder="e.g., Color, Size"
                                  />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                  <TextField
                                    fullWidth
                                    label="Value"
                                    value={variant.value}
                                    onChange={(e) => updateVariant(variant.id, 'value', e.target.value)}
                                    placeholder="e.g., Red, Large"
                                  />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                  <TextField
                                    fullWidth
                                    type="number"
                                    label="Price"
                                    value={variant.price || ''}
                                    onChange={(e) => updateVariant(variant.id, 'price', parseFloat(e.target.value))}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                  <TextField
                                    fullWidth
                                    type="number"
                                    label="Stock"
                                    value={variant.stock || ''}
                                    onChange={(e) => updateVariant(variant.id, 'stock', parseInt(e.target.value))}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                  <IconButton
                                    color="error"
                                    onClick={() => deleteVariant(variant.id)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        ))}
                      </Box>
                    </Box>
                  </TabPanel>

                  {/* Shipping Tab */}
                  <TabPanel value={activeTab} index={3}>
                    <Box sx={{ p: 3 }}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            type="number"
                            id="weight"
                            name="weight"
                            label="Weight (kg)"
                            value={formik.values.weight}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.weight && Boolean(formik.errors.weight)}
                            helperText={formik.touched.weight && formik.errors.weight}
                          />
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            id="dimensions"
                            name="dimensions"
                            label="Dimensions (L x W x H)"
                            value={formik.values.dimensions}
                            onChange={formik.handleChange}
                            placeholder="e.g., 10cm x 5cm x 2cm"
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </TabPanel>

                  {/* SEO Tab */}
                  <TabPanel value={activeTab} index={4}>
                    <Box sx={{ p: 3 }}>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            id="metaTitle"
                            name="metaTitle"
                            label="Meta Title"
                            value={formik.values.metaTitle}
                            onChange={formik.handleChange}
                            helperText="Recommended: 50-60 characters"
                          />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            rows={3}
                            id="metaDescription"
                            name="metaDescription"
                            label="Meta Description"
                            value={formik.values.metaDescription}
                            onChange={formik.handleChange}
                            helperText="Recommended: 150-160 characters"
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </TabPanel>
                </Paper>
              </Grid>

              {/* Sidebar */}
              <Grid item xs={12} lg={4}>
                <Grid container spacing={3}>
                  {/* Pricing */}
                  <Grid item xs={12}>
                    <Card>
                      <CardHeader
                        title="Pricing"
                        avatar={<PricingIcon color="primary" />}
                      />
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              type="number"
                              id="price"
                              name="price"
                              label="Regular Price"
                              value={formik.values.price}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={formik.touched.price && Boolean(formik.errors.price)}
                              helperText={formik.touched.price && formik.errors.price}
                              InputProps={{ startAdornment: '$' }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              type="number"
                              id="salePrice"
                              name="salePrice"
                              label="Sale Price"
                              value={formik.values.salePrice}
                              onChange={formik.handleChange}
                              InputProps={{ startAdornment: '$' }}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Category */}
                  <Grid item xs={12}>
                    <Card>
                      <CardHeader
                        title="Category"
                        avatar={<CategoryIcon color="primary" />}
                      />
                      <CardContent>
                        <FormControl fullWidth>
                          <InputLabel>Category</InputLabel>
                          <Select
                            id="categoryId"
                            name="categoryId"
                            value={formik.values.categoryId}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
                            label="Category"
                          >
                            {categories.map((category) => (
                              <MenuItem key={category.id} value={category.id}>
                                {category.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Status */}
                  <Grid item xs={12}>
                    <Card>
                      <CardHeader title="Status" />
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={formik.values.isActive}
                                  onChange={(e) => formik.setFieldValue('isActive', e.target.checked)}
                                />
                              }
                              label="Active"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={formik.values.isFeatured}
                                  onChange={(e) => formik.setFieldValue('isFeatured', e.target.checked)}
                                />
                              }
                              label="Featured"
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </form>

          {/* Save Actions */}
          <Box sx={{ position: 'sticky', bottom: 0, bgcolor: 'background.paper', p: 2, mt: 3, borderRadius: 2, boxShadow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/admin/products')}
              >
                Cancel
              </Button>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => formik.setFieldValue('isActive', false)}
                >
                  Save as Draft
                </Button>
                <Button
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                  onClick={() => formik.handleSubmit()}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
                </Button>
              </Box>
            </Box>
          </Box>
        </motion.div>
  );
};

export default AdminProductForm;