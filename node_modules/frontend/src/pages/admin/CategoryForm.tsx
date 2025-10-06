import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Paper,
  Divider,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Tabs,
  Tab,
  Alert,
  Breadcrumbs,
  Link,
  Slider,
  Autocomplete,
  useTheme
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as BackIcon,
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Category as CategoryIcon,
  Image as ImageIcon,
  Settings as SettingsIcon,
  Search as SeoIcon,
  Preview as PreviewIcon,
  NavigateNext as NavigateNextIcon,
  Folder as FolderIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import AdminSidebar from '../../components/dashboards/AdminSidebar';

const AdminContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: theme.palette.grey[50],
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: 280,
  [theme.breakpoints.down('md')]: {
    marginLeft: 0,
  },
}));

const UploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.main + '08',
    borderColor: theme.palette.primary.dark,
  },
  '&.dragover': {
    backgroundColor: theme.palette.primary.main + '16',
    borderColor: theme.palette.primary.dark,
  },
}));

const ImagePreview = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  '& img': {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  '& .overlay': {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover .overlay': {
    opacity: 1,
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

interface Category {
  id?: number;
  name: string;
  slug: string;
  description: string;
  image?: string;
  icon?: string;
  parentId?: number;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Category name is required').min(2, 'Name must be at least 2 characters'),
  slug: Yup.string().required('Slug is required').matches(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: Yup.string().max(500, 'Description must be less than 500 characters'),
  parentId: Yup.number().nullable(),
  sortOrder: Yup.number().min(0, 'Sort order must be 0 or greater'),
  metaTitle: Yup.string().max(60, 'Meta title should be less than 60 characters'),
  metaDescription: Yup.string().max(160, 'Meta description should be less than 160 characters'),
});

const AdminCategoryForm: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(id);

  const initialValues: Category = {
    name: '',
    slug: '',
    description: '',
    image: '',
    icon: '',
    parentId: undefined,
    isActive: true,
    isFeatured: false,
    sortOrder: 0,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
  };

  // Mock parent categories
  useEffect(() => {
    const mockCategories: Category[] = [
      { id: 1, name: 'Microcontrollers', slug: 'microcontrollers', description: '', isActive: true, isFeatured: false, sortOrder: 1 },
      { id: 2, name: 'Sensors', slug: 'sensors', description: '', isActive: true, isFeatured: false, sortOrder: 2 },
      { id: 3, name: 'Robot Kits', slug: 'robot-kits', description: '', isActive: true, isFeatured: false, sortOrder: 3 },
      { id: 4, name: 'Motors & Actuators', slug: 'motors-actuators', description: '', isActive: true, isFeatured: false, sortOrder: 4 },
    ];
    setCategories(mockCategories);
  }, []);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (values: Category) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Category data:', values);
      navigate('/admin/categories');
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setLoading(false);
    }
  };

  const iconOptions = [
    { value: 'category', label: 'Category', icon: '📂' },
    { value: 'memory', label: 'Memory/Chip', icon: '💾' },
    { value: 'sensors', label: 'Sensors', icon: '📡' },
    { value: 'smart_toy', label: 'Robot', icon: '🤖' },
    { value: 'settings', label: 'Settings/Gears', icon: '⚙️' },
    { value: 'electrical_services', label: 'Electrical', icon: '⚡' },
    { value: 'cable', label: 'Cables', icon: '🔌' },
    { value: 'battery_full', label: 'Battery', icon: '🔋' },
    { value: 'computer', label: 'Computer', icon: '💻' },
    { value: 'smartphone', label: 'Mobile', icon: '📱' },
  ];

  return (
    <AdminContainer>
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <MainContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
              <Link
                color="inherit"
                href="/admin"
                sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
              >
                Dashboard
              </Link>
              <Link
                color="inherit"
                href="/admin/categories"
                sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
              >
                Categories
              </Link>
              <Typography color="text.primary">
                {isEdit ? 'Edit Category' : 'Add Category'}
              </Typography>
            </Breadcrumbs>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {isEdit ? 'Edit Category' : 'Add New Category'}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<BackIcon />}
                onClick={() => navigate('/admin/categories')}
              >
                Back to Categories
              </Button>
            </Box>
          </Box>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, setFieldValue, handleChange, handleBlur }) => (
              <Form>
                <Grid container spacing={3}>
                  {/* Main Form */}
                  <Grid item xs={12} md={8}>
                    <Card>
                      <CardContent>
                        <Tabs
                          value={activeTab}
                          onChange={(_, newValue) => setActiveTab(newValue)}
                          sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
                        >
                          <Tab icon={<CategoryIcon />} label="General" />
                          <Tab icon={<ImageIcon />} label="Media" />
                          <Tab icon={<SettingsIcon />} label="Settings" />
                          <Tab icon={<SeoIcon />} label="SEO" />
                        </Tabs>

                        {/* General Tab */}
                        <TabPanel value={activeTab} index={0}>
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Category Name"
                                name="name"
                                value={values.name}
                                onChange={(e) => {
                                  handleChange(e);
                                  setFieldValue('slug', generateSlug(e.target.value));
                                }}
                                onBlur={handleBlur}
                                error={touched.name && Boolean(errors.name)}
                                helperText={touched.name && errors.name}
                                required
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Slug"
                                name="slug"
                                value={values.slug}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.slug && Boolean(errors.slug)}
                                helperText={touched.slug && errors.slug || 'URL-friendly version of the name'}
                                required
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={values.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                multiline
                                rows={4}
                                error={touched.description && Boolean(errors.description)}
                                helperText={touched.description && errors.description}
                              />
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <FormControl fullWidth>
                                <InputLabel>Parent Category</InputLabel>
                                <Select
                                  value={values.parentId || ''}
                                  label="Parent Category"
                                  onChange={(e) => setFieldValue('parentId', e.target.value || undefined)}
                                >
                                  <MenuItem value="">
                                    <em>No Parent (Root Category)</em>
                                  </MenuItem>
                                  {categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                      {category.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                label="Sort Order"
                                name="sortOrder"
                                type="number"
                                value={values.sortOrder}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.sortOrder && Boolean(errors.sortOrder)}
                                helperText={touched.sortOrder && errors.sortOrder}
                              />
                            </Grid>
                          </Grid>
                        </TabPanel>

                        {/* Media Tab */}
                        <TabPanel value={activeTab} index={1}>
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="h6" gutterBottom>
                                Category Image
                              </Typography>
                              <UploadBox
                                onClick={() => document.getElementById('image-upload')?.click()}
                              >
                                <input
                                  id="image-upload"
                                  type="file"
                                  accept="image/*"
                                  style={{ display: 'none' }}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleImageUpload(file);
                                  }}
                                />
                                <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h6" gutterBottom>
                                  Upload Category Image
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Click to upload or drag and drop
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Recommended size: 400x300px
                                </Typography>
                              </UploadBox>

                              {previewImage && (
                                <Box sx={{ mt: 2 }}>
                                  <ImagePreview>
                                    <img src={previewImage} alt="Preview" />
                                    <Box className="overlay">
                                      <IconButton
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setPreviewImage(null);
                                        }}
                                        sx={{ color: 'white' }}
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </Box>
                                  </ImagePreview>
                                </Box>
                              )}
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <Typography variant="h6" gutterBottom>
                                Category Icon
                              </Typography>
                              <Autocomplete
                                options={iconOptions}
                                getOptionLabel={(option) => option.label}
                                value={iconOptions.find(opt => opt.value === values.icon) || null}
                                onChange={(_, newValue) => setFieldValue('icon', newValue?.value || '')}
                                renderOption={(props, option) => (
                                  <Box component="li" {...props}>
                                    <Typography sx={{ mr: 2 }}>{option.icon}</Typography>
                                    {option.label}
                                  </Box>
                                )}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Select Icon"
                                    placeholder="Choose an icon"
                                  />
                                )}
                              />
                              {values.icon && (
                                <Box sx={{ mt: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1, textAlign: 'center' }}>
                                  <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Selected Icon Preview:
                                  </Typography>
                                  <Typography sx={{ fontSize: '2rem' }}>
                                    {iconOptions.find(opt => opt.value === values.icon)?.icon}
                                  </Typography>
                                </Box>
                              )}
                            </Grid>
                          </Grid>
                        </TabPanel>

                        {/* Settings Tab */}
                        <TabPanel value={activeTab} index={2}>
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                              <Typography variant="h6" gutterBottom>
                                Category Settings
                              </Typography>
                            </Grid>

                            <Grid item xs={12} md={4}>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={values.isActive}
                                    onChange={(e) => setFieldValue('isActive', e.target.checked)}
                                  />
                                }
                                label="Active"
                              />
                              <Typography variant="caption" color="text.secondary" display="block">
                                Active categories are visible to customers
                              </Typography>
                            </Grid>

                            <Grid item xs={12} md={4}>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={values.isFeatured}
                                    onChange={(e) => setFieldValue('isFeatured', e.target.checked)}
                                  />
                                }
                                label="Featured"
                              />
                              <Typography variant="caption" color="text.secondary" display="block">
                                Featured categories appear prominently on the homepage
                              </Typography>
                            </Grid>
                          </Grid>
                        </TabPanel>

                        {/* SEO Tab */}
                        <TabPanel value={activeTab} index={3}>
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                              <Alert severity="info" sx={{ mb: 3 }}>
                                SEO settings help improve search engine visibility for this category.
                              </Alert>
                            </Grid>

                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Meta Title"
                                name="metaTitle"
                                value={values.metaTitle}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.metaTitle && Boolean(errors.metaTitle)}
                                helperText={
                                  (touched.metaTitle && errors.metaTitle) ||
                                  `${values.metaTitle?.length || 0}/60 characters`
                                }
                                InputProps={{
                                  endAdornment: (
                                    <Chip
                                      label={`${values.metaTitle?.length || 0}/60`}
                                      size="small"
                                      color={
                                        (values.metaTitle?.length || 0) > 60
                                          ? 'error'
                                          : (values.metaTitle?.length || 0) > 50
                                          ? 'warning'
                                          : 'success'
                                      }
                                    />
                                  ),
                                }}
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Meta Description"
                                name="metaDescription"
                                value={values.metaDescription}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                multiline
                                rows={3}
                                error={touched.metaDescription && Boolean(errors.metaDescription)}
                                helperText={
                                  (touched.metaDescription && errors.metaDescription) ||
                                  `${values.metaDescription?.length || 0}/160 characters`
                                }
                                InputProps={{
                                  endAdornment: (
                                    <Chip
                                      label={`${values.metaDescription?.length || 0}/160`}
                                      size="small"
                                      color={
                                        (values.metaDescription?.length || 0) > 160
                                          ? 'error'
                                          : (values.metaDescription?.length || 0) > 140
                                          ? 'warning'
                                          : 'success'
                                      }
                                    />
                                  ),
                                }}
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Meta Keywords"
                                name="metaKeywords"
                                value={values.metaKeywords}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText="Separate keywords with commas"
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                                <Typography variant="subtitle2" gutterBottom>
                                  Search Preview
                                </Typography>
                                <Box sx={{ mb: 1 }}>
                                  <Typography
                                    variant="body1"
                                    sx={{ color: 'primary.main', fontWeight: 500 }}
                                  >
                                    {values.metaTitle || values.name || 'Category Title'}
                                  </Typography>
                                </Box>
                                <Typography variant="caption" color="success.main">
                                  https://roboticsshop.com/categories/{values.slug || 'category-slug'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                  {values.metaDescription || values.description || 'Category description will appear here...'}
                                </Typography>
                              </Paper>
                            </Grid>
                          </Grid>
                        </TabPanel>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Sidebar */}
                  <Grid item xs={12} md={4}>
                    <Box sx={{ position: 'sticky', top: 24 }}>
                      {/* Actions */}
                      <Card sx={{ mb: 3 }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Actions
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Button
                              type="submit"
                              variant="contained"
                              fullWidth
                              startIcon={<SaveIcon />}
                              disabled={loading}
                            >
                              {loading ? 'Saving...' : isEdit ? 'Update Category' : 'Create Category'}
                            </Button>
                            <Button
                              variant="outlined"
                              fullWidth
                              startIcon={<PreviewIcon />}
                              onClick={() => window.open(`/categories/${values.slug}`, '_blank')}
                              disabled={!values.slug}
                            >
                              Preview Category
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>

                      {/* Category Hierarchy */}
                      {values.parentId && (
                        <Card sx={{ mb: 3 }}>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              Category Hierarchy
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <FolderIcon color="primary" />
                              <Typography variant="body2">
                                {categories.find(c => c.id === values.parentId)?.name}
                              </Typography>
                              <NavigateNextIcon fontSize="small" />
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {values.name || 'New Category'}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      )}

                      {/* Help */}
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Tips
                          </Typography>
                          <List dense>
                            <ListItem>
                              <ListItemText
                                primary="Category Name"
                                secondary="Use clear, descriptive names that customers will understand"
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText
                                primary="Description"
                                secondary="Provide a helpful description to guide customers"
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText
                                primary="SEO"
                                secondary="Fill out meta title and description for better search engine visibility"
                              />
                            </ListItem>
                          </List>
                        </CardContent>
                      </Card>
                    </Box>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </motion.div>
      </MainContent>
    </AdminContainer>
  );
};

export default AdminCategoryForm;