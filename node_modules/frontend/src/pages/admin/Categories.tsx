import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
  Toolbar,
  alpha,
  useTheme,
  Tooltip,
  Fab,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  VisibilityOff as HideIcon,
  Category as CategoryIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  GridView as GridViewIcon,
  ViewList as ListViewIcon,
  DragIndicator as DragIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SimpleTreeView as TreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

const StatsCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: 'white',
  '&.secondary': {
    background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
  },
  '&.success': {
    background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
  },
  '&.warning': {
    background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
  },
}));

const SearchToolbar = styled(Toolbar)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(3),
  minHeight: '64px !important',
}));

const CategoryCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[8],
    borderColor: theme.palette.primary.main,
  },
}));

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  parentId?: number;
  isActive: boolean;
  sortOrder: number;
  productCount: number;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

const AdminCategories: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'tree'>('tree');
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['root']);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Mock data
  useEffect(() => {
    const mockCategories: Category[] = [
      {
        id: 1,
        name: 'Microcontrollers',
        slug: 'microcontrollers',
        description: 'Development boards and microcontroller units',
        image: '/api/placeholder/200/150',
        icon: 'memory',
        isActive: true,
        sortOrder: 1,
        productCount: 45,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15',
        children: [
          {
            id: 11,
            name: 'Arduino',
            slug: 'arduino',
            description: 'Arduino development boards',
            parentId: 1,
            isActive: true,
            sortOrder: 1,
            productCount: 25,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-10'
          },
          {
            id: 12,
            name: 'Raspberry Pi',
            slug: 'raspberry-pi',
            description: 'Raspberry Pi computers and accessories',
            parentId: 1,
            isActive: true,
            sortOrder: 2,
            productCount: 20,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-12'
          }
        ]
      },
      {
        id: 2,
        name: 'Sensors',
        slug: 'sensors',
        description: 'Various types of sensors for robotics projects',
        image: '/api/placeholder/200/150',
        icon: 'sensors',
        isActive: true,
        sortOrder: 2,
        productCount: 78,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-18',
        children: [
          {
            id: 21,
            name: 'Distance Sensors',
            slug: 'distance-sensors',
            description: 'Ultrasonic and laser distance sensors',
            parentId: 2,
            isActive: true,
            sortOrder: 1,
            productCount: 15,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-08'
          },
          {
            id: 22,
            name: 'Temperature Sensors',
            slug: 'temperature-sensors',
            description: 'Digital and analog temperature sensors',
            parentId: 2,
            isActive: true,
            sortOrder: 2,
            productCount: 12,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-09'
          }
        ]
      },
      {
        id: 3,
        name: 'Robot Kits',
        slug: 'robot-kits',
        description: 'Complete robot building kits',
        image: '/api/placeholder/200/150',
        icon: 'smart_toy',
        isActive: true,
        sortOrder: 3,
        productCount: 23,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-20'
      },
      {
        id: 4,
        name: 'Motors & Actuators',
        slug: 'motors-actuators',
        description: 'Servo motors, stepper motors, and actuators',
        image: '/api/placeholder/200/150',
        icon: 'settings',
        isActive: false,
        sortOrder: 4,
        productCount: 34,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-14'
      }
    ];

    setTimeout(() => {
      setCategories(mockCategories);
      setFilteredCategories(mockCategories);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter categories based on search
  useEffect(() => {
    if (searchQuery === '') {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category => 
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.children?.some(child => 
          child.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery, categories]);

  const stats = [
    {
      title: 'Total Categories',
      value: categories.length,
      icon: <CategoryIcon fontSize="large" />,
      color: 'primary' as const
    },
    {
      title: 'Active Categories',
      value: categories.filter(c => c.isActive).length,
      icon: <ViewIcon fontSize="large" />,
      color: 'success' as const
    },
    {
      title: 'Subcategories',
      value: categories.reduce((sum, c) => sum + (c.children?.length || 0), 0),
      icon: <FolderIcon fontSize="large" />,
      color: 'secondary' as const
    },
    {
      title: 'Total Products',
      value: categories.reduce((sum, c) => sum + c.productCount, 0),
      icon: <GridViewIcon fontSize="large" />,
      color: 'warning' as const
    }
  ];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, category: Category) => {
    setMenuAnchor(event.currentTarget);
    setSelectedCategory(category);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedCategory(null);
  };

  const handleDeleteCategory = () => {
    if (selectedCategory) {
      setCategories(prev => prev.filter(c => c.id !== selectedCategory.id));
      setDeleteDialogOpen(false);
      handleMenuClose();
    }
  };

  const handleToggleStatus = (categoryId: number) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId 
        ? { ...category, isActive: !category.isActive }
        : category
    ));
  };

  const flattenCategories = (categories: Category[]): Category[] => {
    const flattened: Category[] = [];
    
    const flatten = (cats: Category[], level = 0) => {
      cats.forEach(cat => {
        flattened.push({ ...cat, level } as Category & { level: number });
        if (cat.children) {
          flatten(cat.children, level + 1);
        }
      });
    };
    
    flatten(categories);
    return flattened;
  };

  const renderTreeView = () => {
    const renderTreeItem = (category: Category) => (
      <TreeItem
        key={category.id}
        itemId={category.id.toString()}
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
            <Avatar
              src={category.image}
              sx={{ width: 32, height: 32, mr: 2, bgcolor: 'primary.light' }}
            >
              <CategoryIcon />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {category.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {category.productCount} products
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip
                label={category.isActive ? 'Active' : 'Inactive'}
                size="small"
                color={category.isActive ? 'success' : 'error'}
              />
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMenuOpen(e, category);
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
          </Box>
        }
      >
        {category.children?.map(child => renderTreeItem(child))}
      </TreeItem>
    );

    return (
      <TreeView
        expandedItems={expandedNodes}
        onExpandedItemsChange={(event: React.SyntheticEvent | null, itemIds: string[]) => setExpandedNodes(itemIds)}
      >
        {filteredCategories.map(category => renderTreeItem(category))}
      </TreeView>
    );
  };

  const renderGridView = () => (
    <Grid container spacing={3}>
      {filteredCategories.map((category) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <CategoryCard onClick={() => navigate(`/admin/categories/${category.id}/edit`)}>
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Avatar
                    src={category.image}
                    sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                  >
                    <CategoryIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {category.description}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Chip
                    label={`${category.productCount} Products`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={category.isActive ? 'Active' : 'Inactive'}
                    size="small"
                    color={category.isActive ? 'success' : 'error'}
                  />
                </Box>
                
                {category.children && category.children.length > 0 && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Subcategories: {category.children.map(child => child.name).join(', ')}
                    </Typography>
                  </Box>
                )}
                
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuOpen(e, category);
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </CategoryCard>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );

  const renderListView = () => (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell>Category</TableCell>
              <TableCell>Parent</TableCell>
              <TableCell>Products</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Sort Order</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flattenCategories(filteredCategories).map((category: any) => (
              <TableRow key={category.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ ml: category.level * 3 }}>
                      <Avatar
                        src={category.image}
                        sx={{ width: 40, height: 40, mr: 2 }}
                      >
                        <CategoryIcon />
                      </Avatar>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {category.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {category.slug}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  {category.parentId ? (
                    <Chip
                      label={categories.find(c => c.id === category.parentId)?.name || 'Unknown'}
                      size="small"
                      variant="outlined"
                    />
                  ) : (
                    <Chip label="Root" size="small" color="primary" />
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={category.productCount}
                    size="small"
                    color={category.productCount > 0 ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={category.isActive ? 'Active' : 'Inactive'}
                    size="small"
                    color={category.isActive ? 'success' : 'error'}
                    onClick={() => handleToggleStatus(category.id)}
                    sx={{ cursor: 'pointer' }}
                  />
                </TableCell>
                <TableCell>{category.sortOrder}</TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, category)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Typography variant="h6">Loading categories...</Typography>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Categories Management
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/admin/categories/add')}
              >
                Add Category
              </Button>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              {stats.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <StatsCard className={stat.color}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                            {stat.value}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            {stat.title}
                          </Typography>
                        </Box>
                        <Box sx={{ opacity: 0.8 }}>
                          {stat.icon}
                        </Box>
                      </Box>
                    </CardContent>
                  </StatsCard>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Search and View Controls */}
          <SearchToolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <TextField
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{ minWidth: 300 }}
              />
              
              <Box sx={{ flexGrow: 1 }} />
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Tree View">
                  <IconButton
                    onClick={() => setViewMode('tree')}
                    color={viewMode === 'tree' ? 'primary' : 'default'}
                  >
                    <FolderIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Grid View">
                  <IconButton
                    onClick={() => setViewMode('grid')}
                    color={viewMode === 'grid' ? 'primary' : 'default'}
                  >
                    <GridViewIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="List View">
                  <IconButton
                    onClick={() => setViewMode('list')}
                    color={viewMode === 'list' ? 'primary' : 'default'}
                  >
                    <ListViewIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </SearchToolbar>

          {/* Categories Display */}
          <Box sx={{ mb: 4 }}>
            {viewMode === 'tree' && renderTreeView()}
            {viewMode === 'grid' && renderGridView()}
            {viewMode === 'list' && renderListView()}
          </Box>

          {/* Actions Menu */}
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => {
              if (selectedCategory) navigate(`/admin/categories/${selectedCategory.id}/edit`);
              handleMenuClose();
            }}>
              <EditIcon sx={{ mr: 1 }} />
              Edit Category
            </MenuItem>
            <MenuItem onClick={() => {
              if (selectedCategory) navigate(`/categories/${selectedCategory.slug}`);
              handleMenuClose();
            }}>
              <ViewIcon sx={{ mr: 1 }} />
              View Category
            </MenuItem>
            <MenuItem onClick={() => {
              if (selectedCategory) navigate(`/admin/categories/add?parent=${selectedCategory.id}`);
              handleMenuClose();
            }}>
              <AddIcon sx={{ mr: 1 }} />
              Add Subcategory
            </MenuItem>
            <MenuItem 
              onClick={() => {
                setDeleteDialogOpen(true);
                handleMenuClose();
              }}
              sx={{ color: 'error.main' }}
            >
              <DeleteIcon sx={{ mr: 1 }} />
              Delete Category
            </MenuItem>
          </Menu>

          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogContent>
              Are you sure you want to delete "{selectedCategory?.name}"? 
              This will also delete all subcategories and may affect products. 
              This action cannot be undone.
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleDeleteCategory} color="error" variant="contained">
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          {/* Floating Action Button */}
          <Fab
            color="primary"
            sx={{ position: 'fixed', bottom: 24, right: 24 }}
            onClick={() => navigate('/admin/categories/add')}
          >
            <AddIcon />
          </Fab>
        </motion.div>
  );
};

export default AdminCategories;